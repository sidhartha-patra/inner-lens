#!/usr/bin/env node
// opus-proxy.mjs — a tiny OpenAI-compatible server that answers chat completions
// using GitHub Copilot CLI's Claude Opus 4.8, locally. No dependencies.
//
//   node server/opus-proxy.mjs           (or: npm run server)
//
// Then in the Inner Lens web app, open Live AI, pick "Copilot Opus 4.8 (local)"
// (base URL http://localhost:8765/v1, model claude-opus-4.8) and Save.
//
// Why the flags: the CLI normally loads your ~/.copilot MCP servers (35 of them
// here) which makes a cold prompt hang for minutes. We disable every MCP server
// plus custom instructions so a request returns in ~10s of pure model output.

import http from "node:http";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PORT = process.env.OPUS_PROXY_PORT ? Number(process.env.OPUS_PROXY_PORT) : 8765;
const DEFAULT_MODEL = "claude-opus-4.8";
const TIMEOUT_MS = 240000;

// Discover configured MCP servers so we can disable them all (fast, pure generation).
function mcpServerNames() {
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), ".copilot", "mcp-config.json"), "utf8"));
    return Object.keys(cfg.mcpServers || cfg.servers || {});
  } catch {
    return [];
  }
}
const DISABLE_FLAGS = mcpServerNames().flatMap((n) => ["--disable-mcp-server", n]);

function leanArgs(prompt, model) {
  return [
    "-p", prompt,
    "--model", model || DEFAULT_MODEL,
    "-s",
    "--no-color",
    "--no-auto-update",
    "--no-custom-instructions",
    "--disable-builtin-mcps",
    "--no-ask-user",
    "--allow-all-tools",
    ...DISABLE_FLAGS,
  ];
}

// Run one Copilot CLI generation. copilot is a native exe so we spawn without a shell
// (Node quotes the multi-line prompt arg safely).
function runCopilot(prompt, model) {
  return new Promise((resolve, reject) => {
    const child = spawn("copilot", leanArgs(prompt, model), { shell: false, windowsHide: true });
    let out = "";
    let err = "";
    const timer = setTimeout(() => { child.kill(); reject(new Error("Copilot CLI timed out")); }, TIMEOUT_MS);
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("error", (e) => { clearTimeout(timer); reject(e); });
    child.on("close", (code) => {
      clearTimeout(timer);
      const text = out.trim();
      if (text) resolve(text);
      else reject(new Error(`Copilot CLI exited (${code}) with no output. ${err.slice(0, 400)}`));
    });
  });
}

function promptFromMessages(messages = []) {
  // Fold the OpenAI message list into a single prompt: system instructions first.
  const sys = messages.filter((m) => m.role === "system").map((m) => m.content);
  const rest = messages.filter((m) => m.role !== "system").map((m) => m.content);
  return [...sys, ...rest].filter(Boolean).join("\n\n");
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
function sendJSON(res, code, obj) {
  cors(res);
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 200000) { reject(new Error("Body too large")); req.destroy(); }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") { cors(res); res.writeHead(204); res.end(); return; }

  const url = (req.url || "").split("?")[0];

  if (req.method === "GET" && (url === "/" || url === "/health")) {
    return sendJSON(res, 200, { status: "ok", service: "inner-lens opus-proxy", model: DEFAULT_MODEL, mcpDisabled: DISABLE_FLAGS.length / 2 });
  }

  if (req.method === "GET" && url === "/v1/models") {
    return sendJSON(res, 200, { object: "list", data: [{ id: DEFAULT_MODEL, object: "model", owned_by: "github-copilot" }] });
  }

  if (req.method === "POST" && url === "/v1/chat/completions") {
    try {
      const body = JSON.parse((await readBody(req)) || "{}");
      const prompt = promptFromMessages(body.messages);
      if (!prompt) return sendJSON(res, 400, { error: { message: "No messages provided." } });
      const model = body.model || DEFAULT_MODEL;
      const started = Date.now();
      console.log(`[${new Date().toISOString()}] → generating (${prompt.length} chars, model ${model})…`);
      const text = await runCopilot(prompt, model);
      console.log(`[${new Date().toISOString()}] ✓ ${text.length} chars in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      return sendJSON(res, 200, {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, message: { role: "assistant", content: text }, finish_reason: "stop" }],
        usage: { prompt_tokens: Math.ceil(prompt.length / 4), completion_tokens: Math.ceil(text.length / 4), total_tokens: Math.ceil((prompt.length + text.length) / 4) },
      });
    } catch (e) {
      console.error("✗", e.message);
      return sendJSON(res, 502, { error: { message: e.message } });
    }
  }

  sendJSON(res, 404, { error: { message: "Not found" } });
});

server.listen(PORT, () => {
  console.log("\n🔮  Inner Lens — local Opus 4.8 server");
  console.log(`    Listening on  http://localhost:${PORT}`);
  console.log(`    OpenAI base   http://localhost:${PORT}/v1`);
  console.log(`    Model         ${DEFAULT_MODEL}`);
  console.log(`    MCP disabled  ${DISABLE_FLAGS.length / 2} servers (for fast, pure generation)`);
  console.log("    First request warms up in ~10–20s. Leave this running.\n");
});
