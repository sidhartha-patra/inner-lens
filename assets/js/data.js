// data.js — meaning tables that power the built-in (offline) decoder engine.
// All content is framed as reflective psychology + numerology archetypes,
// not prediction. Numbers cover 1-9 plus master numbers 11/22/33.

export const NUMBERS = {
  1: {
    archetype: "The Pioneer",
    keywords: ["independent", "driven", "original", "bold"],
    core:
      "You are wired to lead and to do things your own way. A 1 carries a strong inner engine — ambition, originality and the urge to be first. You feel most alive when you are initiating, not following.",
    strengths: ["Initiative and courage", "Original thinking", "Self-reliance", "Drive to win", "Natural leadership"],
    shadows: ["Domineering or impatient", "Ego protecting itself as 'independence'", "Isolating under pressure", "Fear of failure disguised as control"],
    career:
      "You thrive where you can own the outcome: founding, building from zero, leading a team, or being the singular creative voice. Roles that bury you in committee work or rigid hierarchy drain you fast.",
    careerRoles: ["founder / entrepreneur", "executive or team lead", "solo creator / specialist", "anything you can pioneer"],
    love:
      "In close relationships you need autonomy and genuine admiration. You give loyalty and protection, but can default to 'my way'. Conflict flares when you feel controlled, criticised, or unseen.",
    needs: ["space to be your own person", "respect for your direction", "a partner who is a teammate, not a rival"],
    triggers: ["feeling controlled or boxed in", "having your competence questioned", "being made to wait on others"],
    purpose:
      "Your life keeps circling back to one theme: becoming the author of your own path and proving that a single committed person can create something from nothing.",
    conflict:
      "You are torn between fierce independence and a quiet craving to be validated by others. You want no one's permission — and yet you notice every withheld bit of approval.",
    growth:
      "The shift that frees you: leadership is not the same as doing it alone. Letting people in, asking for help, and softening control multiplies your impact instead of diluting it.",
  },
  2: {
    archetype: "The Diplomat",
    keywords: ["sensitive", "cooperative", "intuitive", "loyal"],
    core:
      "You read rooms, people and undercurrents that others miss. A 2 is relational at the core — your gift is connection, patience and bringing people into harmony. You feel most yourself in partnership.",
    strengths: ["Deep empathy and tact", "Intuition about people", "Patience and devotion", "Talent for mediation", "Attention to nuance"],
    shadows: ["Over-sensitivity to slights", "Indecision and self-doubt", "Avoiding conflict until you resent it", "Erasing your own needs to keep peace"],
    career:
      "You shine in roles built on trust and collaboration — supporting, advising, designing, mediating. You can lead, but you lead through influence and relationship, not force.",
    careerRoles: ["counsellor / coach / HR", "designer / UX", "mediator / diplomacy", "second-in-command / trusted partner"],
    love:
      "You love attentively and want closeness, reassurance and emotional safety. You give a lot. The danger is over-giving until you feel unseen, then withdrawing or quietly keeping score.",
    needs: ["reassurance and consistency", "emotional attunement", "to feel chosen, not tolerated"],
    triggers: ["feeling unappreciated", "harsh tone or conflict", "fear of abandonment"],
    purpose:
      "Your theme is connection — learning to bind people, ideas and feelings together without losing yourself in the process.",
    conflict:
      "You are pulled between your own needs and the urge to keep everyone comfortable. You often know exactly what you want, then talk yourself out of asking for it.",
    growth:
      "The shift that frees you: peace bought by self-erasure isn't peace. Honest boundaries and your own clear 'yes/no' actually deepen the harmony you crave.",
  },
  3: {
    archetype: "The Communicator",
    keywords: ["expressive", "creative", "social", "optimistic"],
    core:
      "You are here to express. A 3 lights up rooms with imagination, words, humour and warmth. Creativity isn't a hobby for you — it's how you process being alive.",
    strengths: ["Expressive and articulate", "Imagination and wit", "Optimism that lifts others", "Social magnetism", "Quick creative range"],
    shadows: ["Scattering energy across too much", "Skimming the surface to avoid depth", "Mood swings under self-doubt", "Using charm to dodge hard feelings"],
    career:
      "You belong wherever ideas become expression — writing, design, performance, marketing, media, teaching. Repetitive, voiceless work suffocates you.",
    careerRoles: ["writer / speaker / creator", "design / brand / marketing", "performer / artist", "any expressive, idea-driven role"],
    love:
      "You bring play, charm and emotional colour. You need a partner who enjoys your sparkle and gives you room to express. Boredom, criticism, and pressure to 'be serious' push you away.",
    needs: ["fun and lightness", "appreciation of your expression", "freedom to be playful"],
    triggers: ["criticism of your creativity", "emotional heaviness or boredom", "feeling caged"],
    purpose:
      "Your life keeps circling expression — finding your voice and using it to inspire joy, beauty and honesty in others.",
    conflict:
      "You are torn between depth and lightness. Beneath the bright surface is real sensitivity you sometimes hide behind a joke or a new project.",
    growth:
      "The shift that frees you: focus is not the enemy of creativity — it's how creativity becomes a body of work. Finishing, and feeling the hard feelings, makes your expression matter more.",
  },
  4: {
    archetype: "The Builder",
    keywords: ["practical", "disciplined", "loyal", "grounded"],
    core:
      "You build things that last. A 4 brings order, discipline and reliability to a chaotic world. You trust effort, systems and follow-through more than luck or hype.",
    strengths: ["Discipline and persistence", "Practical problem-solving", "Loyalty and reliability", "Strong systems thinking", "You finish what you start"],
    shadows: ["Rigidity and stubbornness", "Workaholism and burnout", "Resistance to change", "Controlling because uncertainty feels unsafe"],
    career:
      "You excel where structure and craft matter — engineering, operations, finance, architecture, anything that rewards rigor and consistency. Vague, ever-shifting environments frustrate you.",
    careerRoles: ["engineer / operations", "finance / analysis", "architecture / construction", "systems & process roles"],
    love:
      "You show love through reliability — you show up, you provide, you keep your word. You need stability and trust. Unpredictability and broken commitments make you feel unsafe and rigid.",
    needs: ["stability and consistency", "clear commitments kept", "a calm, dependable home base"],
    triggers: ["sudden change or chaos", "broken promises", "feeling financially or structurally insecure"],
    purpose:
      "Your theme is foundation — building the stable, lasting structures (work, home, systems) that you and others can rely on.",
    conflict:
      "You are torn between security and freedom. You crave a solid, predictable life, yet part of you resents how heavy that responsibility can feel.",
    growth:
      "The shift that frees you: control is not the same as safety. Flexibility, rest, and trusting that you can handle change make you stronger than rigidity ever could.",
  },
  5: {
    archetype: "The Explorer",
    keywords: ["adventurous", "adaptable", "curious", "magnetic"],
    core:
      "You are built for motion, variety and experience. A 5 needs freedom the way others need air — new places, ideas, people. You learn by doing and adapt faster than almost anyone.",
    strengths: ["Adaptability and quick learning", "Curiosity and versatility", "Magnetism and persuasion", "Courage to embrace change", "Resourcefulness"],
    shadows: ["Restlessness and impulsivity", "Avoiding commitment", "Excess and scattering", "Running from feelings via novelty"],
    career:
      "You thrive in dynamic, people-facing, change-rich work — sales, media, travel, entrepreneurship, anything that won't trap you in routine. Monotony is your kryptonite.",
    careerRoles: ["sales / business development", "media / travel / events", "entrepreneur / generalist", "fast-changing, varied roles"],
    love:
      "You bring excitement, passion and spontaneity. You need freedom and stimulation inside the relationship. Routine, possessiveness, and feeling trapped trigger your urge to bolt.",
    needs: ["freedom and variety", "a partner who is also an adventure", "space without guilt"],
    triggers: ["routine and predictability", "possessiveness / control", "feeling tied down"],
    purpose:
      "Your theme is freedom — using your experiences and adaptability to liberate yourself and others from narrow, fearful living.",
    conflict:
      "You are torn between freedom and intimacy. You want depth and a home, but the moment it feels like a cage, you crave escape.",
    growth:
      "The shift that frees you: real freedom is chosen commitment, not endless options. Depth doesn't trap you — it's where the most interesting experiences actually live.",
  },
  6: {
    archetype: "The Nurturer",
    keywords: ["responsible", "caring", "protective", "harmonising"],
    core:
      "You are the one people lean on. A 6 carries a deep sense of responsibility, love and the urge to make things right, beautiful and safe for the people you care about.",
    strengths: ["Warmth and devotion", "Responsibility you can trust", "Healing, nurturing presence", "Eye for harmony and beauty", "Loyalty to family/community"],
    shadows: ["Self-sacrifice to the point of martyrdom", "Controlling through caretaking", "Perfectionism", "Meddling or over-responsibility"],
    career:
      "You flourish in service that helps people grow or heal — teaching, counselling, medicine, hospitality, design of home/beauty, community leadership.",
    careerRoles: ["teacher / counsellor", "healthcare / wellness", "hospitality / community", "design (home, beauty, harmony)"],
    love:
      "You love deeply and protectively — family is sacred to you. You give and give. The risk: over-giving, then feeling unappreciated, then quietly controlling 'for their own good'.",
    needs: ["to feel needed and appreciated", "a loving, harmonious home", "mutual care, not one-way giving"],
    triggers: ["feeling unappreciated or taken for granted", "disharmony in the home", "loved ones in pain you can't fix"],
    purpose:
      "Your theme is care — creating harmony, healing and beauty, and learning to extend the same compassion inward that you pour outward.",
    conflict:
      "You are torn between caring for everyone else and caring for yourself. You feel selfish when you rest, and resentful when you don't.",
    growth:
      "The shift that frees you: you cannot pour from an empty cup, and love isn't control. Boundaries and receiving care make your giving sustainable and clean.",
  },
  7: {
    archetype: "The Seeker",
    keywords: ["analytical", "introspective", "spiritual", "perceptive"],
    core:
      "You go beneath the surface of everything. A 7 is a thinker, observer and seeker of truth — you trust depth, evidence and inner knowing over noise and crowd opinion.",
    strengths: ["Sharp analysis and insight", "Independence of mind", "Depth and focus", "Intuition and perception", "Authenticity"],
    shadows: ["Isolating and aloof", "Overthinking everything", "Cynicism or distrust", "Secretiveness; hard to reach"],
    career:
      "You excel in work that rewards depth and expertise — research, science, analysis, technology, academia, or anything spiritual/philosophical. Shallow, purely social roles bore you.",
    careerRoles: ["research / science / analysis", "technology / specialist expert", "academia / writing", "spiritual / philosophical work"],
    love:
      "You need depth and space in equal measure. You bond through real understanding, not small talk, and you protect your inner world. Pressure to over-share or 'perform' connection pushes you back into your shell.",
    needs: ["intellectual and emotional depth", "solitude without it meaning rejection", "a partner who respects your privacy"],
    triggers: ["superficiality and noise", "being pressured to open up on demand", "feeling intruded upon"],
    purpose:
      "Your theme is truth — understanding how things and people really work, and turning that into wisdom you can trust.",
    conflict:
      "You are torn between intimacy and solitude, faith and doubt. You long to be deeply known, then retreat the moment it gets too close.",
    growth:
      "The shift that frees you: vulnerability is not weakness, and not every question needs an answer before you act. Sharing your inner world is how depth becomes connection.",
  },
  8: {
    archetype: "The Powerhouse",
    keywords: ["ambitious", "strategic", "resilient", "authoritative"],
    core:
      "You are built for impact at scale. An 8 understands power, money and systems instinctively, and carries the resilience to keep rising after setbacks that would stop most people.",
    strengths: ["Strategic vision", "Resilience and drive", "Executive authority", "Talent with money/resources", "Ability to manifest big results"],
    shadows: ["Workaholism and burnout", "Tying self-worth to achievement", "Control and power struggles", "Materialism crowding out the inner life"],
    career:
      "You thrive in leadership and high-stakes building — business, finance, law, executive roles, large-scale ventures. You want authority and measurable results.",
    careerRoles: ["business / executive leadership", "finance / investing", "law / negotiation", "founder of something large"],
    love:
      "You provide and protect powerfully, and respect a strong partner. The risk: bringing the boardroom home, confusing worth with achievement, and neglecting the emotional side of intimacy.",
    needs: ["a partner who is an equal", "respect and shared ambition", "to be valued for who you are, not just what you produce"],
    triggers: ["power struggles or being undermined", "feeling disrespected", "loss of control or status"],
    purpose:
      "Your theme is mastery — building real-world power and abundance, and learning to wield it with integrity rather than be owned by it.",
    conflict:
      "You are torn between material success and inner fulfilment. You chase the win, then quietly wonder whether the win is the point.",
    growth:
      "The shift that frees you: power used for others, and presence over productivity, turn success into something that actually fills you. Generosity is strength, not leakage.",
  },
  9: {
    archetype: "The Humanitarian",
    keywords: ["compassionate", "idealistic", "wise", "artistic"],
    core:
      "You carry an old-soul wisdom and a wide, compassionate heart. A 9 feels the bigger picture — the suffering and the beauty of the world — and is moved to give, heal and uplift.",
    strengths: ["Deep compassion and empathy", "Idealism and vision", "Artistic, expressive soul", "Wisdom beyond your years", "Generosity"],
    shadows: ["Martyrdom and emotional overwhelm", "Difficulty letting go", "Disappointment when reality fails the ideal", "Aloof, hard-to-reach idealism"],
    career:
      "You thrive in work with meaning and reach — humanitarian causes, the arts, healing, teaching, leadership for the greater good. Purely transactional work feels empty.",
    careerRoles: ["humanitarian / nonprofit", "arts / creative expression", "healing / teaching", "mission-driven leadership"],
    love:
      "You love generously and universally, sometimes more easily 'humanity' than the one person in front of you. You give much; the work is staying present and personal, not floating above intimacy.",
    needs: ["shared values and meaning", "emotional generosity returned", "a partner who honours your idealism"],
    triggers: ["betrayal of your ideals", "feeling the world's pain too acutely", "being misunderstood as cold"],
    purpose:
      "Your theme is service and completion — giving your gifts to something larger than yourself and learning to release what is finished.",
    conflict:
      "You are torn between your own personal desires and the pull to serve everyone else. Wanting things for yourself can feel selfish against your ideals.",
    growth:
      "The shift that frees you: you serve best from a full, grounded life — not from self-erasure. Forgiveness and letting go clear space for what wants to come next.",
  },
  11: {
    archetype: "The Illuminator (Master 11)",
    keywords: ["visionary", "intuitive", "inspired", "sensitive"],
    core:
      "You run on a higher voltage. An 11 is the intuitive of the numbers — visionary, electric, deeply sensitive, here to inspire and illuminate. You feel and perceive far more than you let on.",
    strengths: ["Powerful intuition", "Visionary inspiration", "Ability to uplift others", "Sensitivity to subtle truth", "Creative/spiritual depth"],
    shadows: ["Anxiety and nervous tension", "Self-doubt vs your own vision", "Emotional extremes", "Overwhelm from your own sensitivity"],
    career:
      "You belong where you can inspire and illuminate — teaching, the arts, counselling, innovation, spiritual or visionary work. You're a messenger, not a cog.",
    careerRoles: ["inspirer / teacher / speaker", "artist / creator", "counsellor / healer", "visionary innovator"],
    love:
      "You connect intensely and intuitively, craving a soul-level bond. Your sensitivity is a gift and a load — anxiety and nervous energy can spill into the relationship if ungrounded.",
    needs: ["deep, spiritual connection", "calm and reassurance", "a partner who steadies your sensitivity"],
    triggers: ["chaos and harshness", "feeling spiritually alone", "your intuition being dismissed"],
    purpose:
      "Your theme is illumination — turning your heightened perception into inspiration that wakes something up in others.",
    conflict:
      "You are torn between a soaring vision and the anxious, doubting voice that asks 'who am I to channel this?' The gift and the fear share the same wire.",
    growth:
      "The shift that frees you: grounding (body, routine, breath) is what lets your high voltage become light instead of static. Trust the intuition; manage the nerves.",
  },
  22: {
    archetype: "The Master Builder (Master 22)",
    keywords: ["visionary", "practical", "powerful", "ambitious"],
    core:
      "You hold the rare combination of big vision and the practical power to build it. A 22 can turn dreams into concrete, large-scale reality — institutions, systems, lasting works.",
    strengths: ["Vision plus execution", "Capacity for large-scale impact", "Discipline and ambition", "Leadership that builds", "Turning ideals into structures"],
    shadows: ["Crushing self-imposed pressure", "Self-doubt vs huge potential", "Overwhelm and control", "All-or-nothing thinking"],
    career:
      "You're meant to build something big — organisations, systems, infrastructure, movements. You combine the 4's rigor with a visionary reach.",
    careerRoles: ["founder / architect of systems", "large-scale leadership", "builder of institutions", "ambitious, legacy-scale work"],
    love:
      "You're dependable yet intensely driven; the relationship can compete with the mission. Partners need you present, not just provided for.",
    needs: ["a partner who believes in the mission", "presence balanced with ambition", "stability under the intensity"],
    triggers: ["feeling you're wasting your potential", "loss of control on something you're building", "being doubted"],
    purpose:
      "Your theme is legacy — building something of real, lasting, large-scale value that outlives you.",
    conflict:
      "You are torn between enormous potential and the fear that you're not enough to carry it. The bigger the vision, the louder the doubt.",
    growth:
      "The shift that frees you: trust the vision and start with the next brick. Balance ambition with presence so the legacy doesn't cost you the life you're living now.",
  },
  33: {
    archetype: "The Master Teacher (Master 33)",
    keywords: ["compassionate", "devoted", "healing", "selfless"],
    core:
      "You carry the rare master vibration of compassionate service. A 33 blends love, responsibility and wisdom into a calling to heal, teach and uplift — often at great personal devotion.",
    strengths: ["Profound compassion", "Healing and teaching gifts", "Devotion and responsibility", "Wisdom in service of others", "Uplifting presence"],
    shadows: ["Martyrdom and over-responsibility", "Carrying others' burdens", "Neglecting your own needs", "Emotional overload"],
    career:
      "You thrive in healing, teaching, creative or spiritual service — work that lifts many people. Your impact is felt, not just measured.",
    careerRoles: ["teacher / mentor / healer", "creative or spiritual service", "humanitarian leadership", "anything that uplifts at scale"],
    love:
      "You love with extraordinary devotion and care. The risk is self-sacrifice — giving until there's nothing left and calling it love.",
    needs: ["mutual care, not one-way service", "permission to have your own needs", "a partner who protects your energy"],
    triggers: ["others suffering when you can't help", "feeling your sacrifice is unseen", "guilt for self-care"],
    purpose:
      "Your theme is selfless uplift — using love and wisdom to heal and raise others, without losing yourself.",
    conflict:
      "You are torn between universal care and your own personal needs, which can feel almost shameful to honour.",
    growth:
      "The shift that frees you: self-care is not selfish — it's what keeps the well from running dry. Boundaries make your service sustainable and real.",
  },
};

// Personal Year cycle (1-9): the theme of the current 12-month chapter.
export const PERSONAL_YEAR = {
  1: { title: "New Beginnings", text: "A planting year. Fresh starts, independence, and seeds of a new chapter. Bold moves you make now ripple out for the next nine years. Initiate." },
  2: { title: "Patience & Partnership", text: "A slower, relational year. Cooperation, patience and connection matter more than force. Things develop quietly under the surface. Nurture, don't push." },
  3: { title: "Expression & Expansion", text: "A creative, social, expressive year. Visibility, joy and new circles open up. Watch for scattering — channel the energy into something you actually finish." },
  4: { title: "Work & Foundations", text: "A building year. Discipline, structure and hard work lay foundations you'll stand on later. Less glamour, more groundwork. Show up consistently." },
  5: { title: "Change & Freedom", text: "A year of movement and the unexpected. Change, travel, new experiences and freedom. Stay flexible; avoid impulsive burning of bridges you'll want later." },
  6: { title: "Responsibility & Home", text: "A year centred on relationships, home, family and service. Responsibilities grow; so does love. Balance giving to others with caring for yourself." },
  7: { title: "Reflection & Depth", text: "An inner year. Study, rest, reflection and spiritual deepening over outward hustle. Trust the quiet. Insights now reshape the next cycle." },
  8: { title: "Power & Harvest", text: "A year of achievement, recognition and reward. Effort from prior years can pay off — money, status, results. Lead with integrity; don't grasp." },
  9: { title: "Completion & Release", text: "A closing year. Endings, letting go and clearing space. Release what's finished — relationships, habits, roles — so the next cycle can begin clean." },
};

// Pinnacle number meanings (life chapters of opportunity/theme).
export const PINNACLE = {
  1: "Independence and self-development — learning to stand on your own and lead.",
  2: "Relationships, patience and cooperation — growth through partnership and sensitivity.",
  3: "Creative self-expression and social expansion — finding and using your voice.",
  4: "Work, discipline and building — establishing solid foundations through effort.",
  5: "Freedom, change and experience — growth through versatility and the unexpected.",
  6: "Responsibility, love and service — home, family and care take centre stage.",
  7: "Inner growth, study and wisdom — a chapter of depth, analysis and self-understanding.",
  8: "Achievement, power and material mastery — building results and authority in the world.",
  9: "Compassion, completion and giving back — a broad, humanitarian, releasing chapter.",
  11: "Inspiration and intuition — a heightened, visionary chapter of illuminating others.",
  22: "Master building — a chapter to construct something large and lasting.",
};

// Challenge number meanings (the recurring lesson to work through).
export const CHALLENGE = {
  0: "The challenge of choice — you have many strengths; the lesson is balance, integrity and trusting yourself without an obvious obstacle to push against.",
  1: "Learning to be your own person — to assert yourself and lead without domination or fear of standing out.",
  2: "Managing sensitivity — to handle criticism and emotion without losing confidence, and to cooperate without self-erasure.",
  3: "Owning your voice — to express honestly instead of scattering, deflecting with humour, or hiding self-doubt.",
  4: "Building discipline and flexibility — to do the work without becoming rigid, and to embrace change.",
  5: "Using freedom wisely — to enjoy variety and experience without excess, impulsivity, or running away.",
  6: "Balancing responsibility — to care and serve without martyrdom, perfectionism, or control.",
  7: "Trust and openness — to seek depth without isolating, and faith without cynicism.",
  8: "A healthy relationship with power and money — to pursue success without control, greed, or losing yourself in it.",
};

// Zodiac sun signs with element, modality and reflective notes.
export const SIGNS = {
  Aries:       { dates: "Mar 21 – Apr 19", element: "Fire",  modality: "Cardinal", symbol: "♈", keyword: "I lead",
    traits: "bold, energetic, pioneering, direct", strength: "courage and initiative", shadow: "impatience and a short fuse",
    love: "passionate and fast-moving; needs excitement and a partner who can keep pace", work: "anything you can charge at first — starting, leading, competing" },
  Taurus:      { dates: "Apr 20 – May 20", element: "Earth", modality: "Fixed",    symbol: "♉", keyword: "I build",
    traits: "steady, sensual, loyal, determined", strength: "patience and reliability", shadow: "stubbornness and resistance to change",
    love: "deeply loyal and security-seeking; slow to commit, then devoted", work: "stable, tangible, quality-focused building and finance" },
  Gemini:      { dates: "May 21 – Jun 20", element: "Air",   modality: "Mutable",   symbol: "♊", keyword: "I connect",
    traits: "curious, witty, versatile, communicative", strength: "adaptability and quick mind", shadow: "restlessness and scattering",
    love: "needs mental connection and variety; talkative and playful", work: "communication, ideas, media, anything varied and fast" },
  Cancer:      { dates: "Jun 21 – Jul 22", element: "Water", modality: "Cardinal", symbol: "♋", keyword: "I nurture",
    traits: "caring, intuitive, protective, sentimental", strength: "emotional depth and loyalty", shadow: "moodiness and clinging",
    love: "deeply nurturing and home-oriented; needs emotional safety", work: "caretaking, hospitality, anything that protects and nourishes" },
  Leo:         { dates: "Jul 23 – Aug 22", element: "Fire",  modality: "Fixed",    symbol: "♌", keyword: "I shine",
    traits: "warm, expressive, generous, proud", strength: "confidence and heart", shadow: "ego and need for applause",
    love: "warm, loyal and romantic; needs admiration and devotion", work: "leadership, performance, creative spotlight roles" },
  Virgo:       { dates: "Aug 23 – Sep 22", element: "Earth", modality: "Mutable",   symbol: "♍", keyword: "I refine",
    traits: "analytical, precise, helpful, modest", strength: "discernment and service", shadow: "over-criticism and worry",
    love: "shows love through acts of service; needs to feel useful and appreciated", work: "analysis, craft, health, anything precise and improving" },
  Libra:       { dates: "Sep 23 – Oct 22", element: "Air",   modality: "Cardinal", symbol: "♎", keyword: "I balance",
    traits: "diplomatic, charming, fair, relational", strength: "harmony and fairness", shadow: "indecision and people-pleasing",
    love: "partnership-oriented and romantic; needs balance and beauty", work: "design, diplomacy, law, relationship-centred work" },
  Scorpio:     { dates: "Oct 23 – Nov 21", element: "Water", modality: "Fixed",    symbol: "♏", keyword: "I transform",
    traits: "intense, perceptive, passionate, private", strength: "depth and resilience", shadow: "control and suspicion",
    love: "all-or-nothing and deeply loyal; needs trust and emotional truth", work: "investigation, psychology, finance, transformation" },
  Sagittarius: { dates: "Nov 22 – Dec 21", element: "Fire",  modality: "Mutable",   symbol: "♐", keyword: "I explore",
    traits: "adventurous, optimistic, honest, philosophical", strength: "vision and freedom", shadow: "restlessness and bluntness",
    love: "freedom-loving and fun; needs space and shared adventure", work: "travel, teaching, big-picture, exploratory work" },
  Capricorn:   { dates: "Dec 22 – Jan 19", element: "Earth", modality: "Cardinal", symbol: "♑", keyword: "I achieve",
    traits: "disciplined, ambitious, responsible, patient", strength: "endurance and mastery", shadow: "rigidity and over-work",
    love: "loyal and committed; shows love through steadiness and provision", work: "leadership, structure, long-game ambition" },
  Aquarius:    { dates: "Jan 20 – Feb 18", element: "Air",   modality: "Fixed",    symbol: "♒", keyword: "I innovate",
    traits: "original, independent, humanitarian, cerebral", strength: "vision and originality", shadow: "detachment and stubbornness",
    love: "values friendship and freedom; needs intellectual and ideological alignment", work: "innovation, technology, causes, the unconventional" },
  Pisces:      { dates: "Feb 19 – Mar 20", element: "Water", modality: "Mutable",   symbol: "♓", keyword: "I dream",
    traits: "imaginative, compassionate, intuitive, gentle", strength: "empathy and creativity", shadow: "escapism and boundary loss",
    love: "romantic, selfless and dreamy; needs tenderness and emotional union", work: "art, healing, spirituality, imaginative work" },
};

// Element overview (used to add a cross-cut layer).
export const ELEMENTS = {
  Fire:  "energy, drive and inspiration — you move through life with passion and momentum, and need outlets for that heat.",
  Earth: "groundedness and practicality — you build tangible, reliable results and trust what you can see, touch and prove.",
  Air:   "intellect and connection — you process life through ideas, words and relationships, and need mental stimulation.",
  Water: "emotion and intuition — you feel everything deeply, sense undercurrents, and need emotional safety and meaning.",
};

export const MODALITIES = {
  Cardinal: "an initiator — you start things, lead, and set cycles in motion.",
  Fixed:    "a sustainer — you stabilise, persist and see things through (and can dig in your heels).",
  Mutable:  "an adapter — you flex, blend and change shape to meet the moment (and can scatter).",
};

// Chinese zodiac (year animal) — a light extra layer.
export const CHINESE = {
  Rat:     "clever, resourceful and quick — a survivor who spots opportunity early.",
  Ox:      "steady, dependable and hard-working — strength through patience.",
  Tiger:   "brave, intense and magnetic — a natural, restless leader.",
  Rabbit:  "gentle, diplomatic and refined — peace-seeking and intuitive.",
  Dragon:  "bold, charismatic and ambitious — born to stand out.",
  Snake:   "wise, private and perceptive — a deep thinker who plays the long game.",
  Horse:   "free, energetic and independent — needs movement and space.",
  Goat:    "kind, artistic and sensitive — a gentle, creative soul.",
  Monkey:  "inventive, witty and adaptable — a clever problem-solver.",
  Rooster: "observant, precise and confident — proud and hard-working.",
  Dog:     "loyal, honest and protective — a principled friend.",
  Pig:     "generous, sincere and easygoing — warm-hearted and grounded.",
};
