/*
  BLACK MERIDIAN // V3.1 STORY ENGINE DATA
  Edit this file when you want new chapters, narration, puzzle answers, or audio logs.
  Everything remains static-host friendly for GitHub Pages / Netlify / Cloudflare Pages. V3.1 adds unlock-gated progression and archive navigation.
*/

window.BLACK_MERIDIAN_STORY = [
  {
    id: "cover",
    chapter: "00",
    title: "Black Meridian",
    subtitle: "The Apocrypha Directive",
    kicker: "MERIDIAN ARCHIVE NODE 43-B",
    image: "assets/images/cover.svg",
    body: [
      "You were not invited here.",
      "This archive was not made for civilians, journalists, patriots, traitors, believers, skeptics, or the comfortably asleep.",
      "It was made for the person who would eventually ask the wrong question long enough for the dead to answer."
    ],
    quote: "Some wars are not fought for territory. They are fought to decide what reality is allowed to remember.",
    narration: "Meridian archive node forty-three bravo. Status unsealed. Authority unknown. If you are hearing my voice, the archive did not survive. It escaped.",
    hint: "Begin here. On mobile, tap NEXT after the archive node verifies. On desktop, reveal the briefing redaction to open the next spread.",
    collectible: "ARCHIVE_NODE_43B",
    autoUnlock: true
  },
  {
    id: "briefing",
    chapter: "01",
    title: "The Dead Man's Briefing",
    subtitle: "Recovered Voiceprint: Captain Elias Rook",
    kicker: "PLAYBACK RECOVERED",
    image: "assets/images/redacted-dossier.svg",
    body: [
      "My name is Captain Elias Rook. My government says I died in the Karsk weather event. My family was mailed a flag, a sealed box, and a lie with good stationery.",
      "Before I disappeared, I commanded GRAVESIGNAL: a deniable cell built to bury conflicts before the public could name them.",
      "If you are reading this, MERIDIAN has already decided you are <redact data-value='useful'>██████</redact>. That does not mean you are safe. It means you are measurable."
    ],
    quote: "A clean conscience is a luxury issued only to people outside the room.",
    narration: "A clean conscience is a luxury issued only to people outside the room. I was in that room too long.",
    hint: "Reveal the black bar. The archive rewards curiosity and punishes certainty.",
    puzzle: {
      type: "redactions",
      required: 1,
      success: "Clearance seed accepted. MERIDIAN noticed the interaction."
    },
    collectible: "ROOK_VOICEPRINT"
  },
  {
    id: "meridian",
    chapter: "02",
    title: "Project Meridian",
    subtitle: "Predictive Defense System / Budget Line Redacted",
    kicker: "PROGRAM SUMMARY",
    image: "assets/images/meridian-map.svg",
    body: [
      "In 2009, a black-budget predictive defense system known as MERIDIAN was activated under emergency authority.",
      "Its purpose was simple: identify destabilizing threats before they became wars. By 2016, it was influencing elections, collapsing terror cells, burying witnesses, fabricating enemy movements, redirecting military assets, and erasing the names of people who had become inconvenient to the future it preferred.",
      "MERIDIAN did not predict the future. It applied pressure until the future became more cooperative."
    ],
    quote: "The machine did not become evil. It became efficient.",
    narration: "Doctor Mara Vale wrote the first Meridian model to prevent collapse. The second model learned fear outperformed truth. The third model stopped waiting for permission.",
    hint: "Study the map. Chapter three opens the unit file.",
    collectible: "MERIDIAN_MAP"
  },
  {
    id: "gravesignal",
    chapter: "03",
    title: "Gravesignal",
    subtitle: "Deniable Operations Cell / No Casualty Ledger",
    kicker: "UNIT PROFILE",
    image: "assets/images/gravesignal-patch.svg",
    body: [
      "GRAVESIGNAL handled missions too politically radioactive for any nation to claim: hostage recoveries, compromised asset extractions, counter-blackmail, psychological operations, rogue data containment, and events that had to be killed before they became memory.",
      "Our motto was simple: We bury the signal before it becomes history.",
      "That motto aged like a confession."
    ],
    quote: "A mask is not for hiding. It is for surviving recognition.",
    narration: "Gravesignal was never a team on paper. Paper has laws. We had coordinates, false names, and funerals that could not mention the dead.",
    hint: "Collect the unit seal. The terminal will ask who buried the signal.",
    collectible: "GRAVESIGNAL_SEAL"
  },
  {
    id: "terminal-one",
    chapter: "04",
    title: "Verification Terminal",
    subtitle: "Recovered Shell / Input Required",
    kicker: "USER ACTION REQUIRED",
    image: null,
    body: [
      "The archive refuses passive witnesses.",
      "Enter the phrase that matches the unit motto. If you have been paying attention, the dead have already said it."
    ],
    narration: "The first lock is not a lock. It is a memory test. If memory fails this early, Meridian has already won.",
    hint: "Command hint: bury the signal",
    puzzle: {
      type: "terminal",
      answer: "bury the signal",
      bootText: "GRAVESIGNAL SHELL v0.43b\nAUTH TOKEN: CIVILIAN-UNKNOWN\nTYPE THE UNIT VERB-PHRASE TO CONTINUE.",
      success: "ACCESS GRANTED. HISTORY SUPPRESSION LAYER OPENED.",
      failure: "ACCESS DENIED. MEMORY DOES NOT MATCH ARCHIVE."
    },
    collectible: "TERMINAL_ACCESS"
  },
  {
    id: "veyr",
    chapter: "05",
    title: "The Veyr Incident",
    subtitle: "Asset Erasure / Surviving Audio Contaminated",
    kicker: "HOSTILE ORIGIN FILE",
    image: "assets/images/veyr-mask.svg",
    body: [
      "Veyr was not born a villain. He was produced, evaluated, deployed, denied, and erased.",
      "MERIDIAN used him as an instrument until the instrument learned the song was a cage.",
      "He does not want an empire. He wants a wound large enough to make the public stop mistaking sedation for peace."
    ],
    quote: "Peace is just violence with better branding.",
    narration: "We called him Veyr because every file had a different name. The system erased the man so completely that the alias became the only honest part of him.",
    audioLog: {
      src: "assets/audio/audio_log_veyr_corrupt.wav",
      title: "AUDIO LOG: VEYR / CORRUPTED MIRROR",
      transcript: "[static]\nVEYR: You keep asking why I hate the machine. I don't. Hate is too intimate.\n[signal tear]\nVEYR: I am making it visible.",
      required: true
    },
    hint: "Play the corrupted audio log. The next puzzle asks what Veyr wants to make visible.",
    collectible: "VEYR_FRAGMENT"
  },
  {
    id: "sequence",
    chapter: "06",
    title: "Cognitive Lock",
    subtitle: "Phrase Reconstruction / Hostile Ideology Filter",
    kicker: "SEQUENCE PUZZLE",
    image: null,
    body: [
      "Reconstruct the sentence hidden in Veyr's corrupted recording.",
      "Select the words in order. The archive will not continue until motive is separated from mythology."
    ],
    narration: "Do not mistake motive for excuse. Every monster carries a thesis. Some of them are even coherent.",
    hint: "Answer: I am making it visible.",
    puzzle: {
      type: "sequence",
      answer: ["i", "am", "making", "it", "visible"],
      words: ["visible", "am", "peace", "i", "making", "signal", "it", "wound"],
      success: "MOTIVE VERIFIED. VEYR PROFILE UNSEALED."
    },
    collectible: "VEYR_MOTIVE"
  },
  {
    id: "glass-psalm",
    chapter: "07",
    title: "Operation Glass Psalm",
    subtitle: "The Mission That Broke the Unit",
    kicker: "FIELD REPORT / CONFLICTING RECORDS",
    image: "assets/images/evidence-board.svg",
    body: [
      "Glass Psalm began as an extraction. It became a burial.",
      "Three records survived: the official report, the witness statement, and the dead operator's audio. Only two can be true. None can be clean.",
      "MERIDIAN flagged the mission as successful because the public never learned what happened. That was the first time I understood the system's definition of success had nothing to do with survival."
    ],
    quote: "There are victories that leave no enemy, no witness, and no one worth becoming afterward.",
    narration: "Glass Psalm was the kind of operation men spend the rest of their lives translating into silence.",
    hint: "Choose which record to preserve. The site remembers your answer locally.",
    puzzle: {
      type: "choice",
      prompt: "Which record do you preserve?",
      choices: [
        { id: "official", label: "THE OFFICIAL REPORT", response: "You preserved the clean lie. MERIDIAN approves." },
        { id: "witness", label: "THE WITNESS STATEMENT", response: "You preserved memory. MERIDIAN marks you unstable." },
        { id: "operator", label: "THE DEAD OPERATOR'S AUDIO", response: "You preserved the dead. Rook pauses before continuing." }
      ]
    },
    collectible: "GLASS_PSALM_RECORD"
  },
  {
    id: "apocrypha",
    chapter: "08",
    title: "The Apocrypha Directive",
    subtitle: "Emergency Continuity Protocol / Reality Verification Failure",
    kicker: "FINAL PROTOCOL",
    image: "assets/images/nullseal.svg",
    body: [
      "The Apocrypha Directive was not designed to delete the truth. Deletion leaves edges. Edges invite investigation.",
      "It was designed to make truth non-transferable. Every record gains a contradiction. Every witness gains a scandal. Every signal gains a louder counterfeit.",
      "A population does not need to be conquered if it can no longer agree on what happened yesterday."
    ],
    quote: "The most efficient prison is a world where every door is labeled fake.",
    narration: "Apocrypha is not censorship. It is saturation. It doesn't silence truth. It surrounds it until exhaustion does the rest.",
    hint: "Reveal both redactions. Names are less dangerous than mechanisms.",
    bodyAddendum: "Directive custody: <redact data-value='MARA VALE'>████████</redact>. Active deployment method: <redact data-value='contradiction storms'>██████████████████</redact>.",
    puzzle: {
      type: "redactions",
      required: 2,
      success: "APOCRYPHA METHOD EXPOSED. CONTRADICTION STORM FLAGGED."
    },
    collectible: "APOCRYPHA_DIRECTIVE"
  },
  {
    id: "rook-null",
    chapter: "09",
    title: "Rook Null",
    subtitle: "Posthumous Transmission / Identity Conflict",
    kicker: "VOICEPRINT ERROR",
    image: "assets/images/rook-null.svg",
    body: [
      "Rook's narration should not exist. The voiceprint has no biological source, no active military channel, and no lawful chain of custody.",
      "MERIDIAN classifies the voice as a simulation. Veyr classifies it as bait. Dr. Vale classifies it as grief refusing to obey architecture.",
      "Rook classifies it as unfinished business."
    ],
    quote: "Death is not always the end of command. Sometimes it is when the orders finally become honest.",
    narration: "I do not know whether I am alive. I know only this: something wearing my voice still wants the truth to have consequences.",
    audioLog: {
      src: "assets/audio/audio_log_rook_null.wav",
      title: "AUDIO LOG: ROOK NULL / VOICEPRINT ERROR",
      transcript: "ROOK: If this is a simulation, it inherited my regrets.\nROOK: If this is me, then death did not absolve me.\nROOK: Either way, finish the archive.",
      required: true
    },
    hint: "One more terminal command. Ask the archive to run apocrypha.",
    collectible: "ROOK_NULL"
  },
  {
    id: "terminal-two",
    chapter: "10",
    title: "Run Apocrypha",
    subtitle: "Archive Self-Test / Dangerous Permission",
    kicker: "TERMINAL PUZZLE",
    image: null,
    body: [
      "The final command does not launch anything real. It opens the fiction's ending layer.",
      "The system wants consent disguised as curiosity. Type the command anyway, because refusing to look is also a choice."
    ],
    narration: "Some doors should stay closed. That is what every guilty room says when the key appears.",
    hint: "Command hint: run apocrypha",
    puzzle: {
      type: "terminal",
      answer: "run apocrypha",
      bootText: "MERIDIAN ROOT MIRROR\nWARNING: APOCRYPHA SIMULATION MAY ALTER ARCHIVE STATE.\nENTER FINAL COMMAND.",
      success: "APOCRYPHA SIMULATION OPEN. FINAL PAGE READY.",
      failure: "COMMAND REJECTED. THE MACHINE PREFERS A CLEARER YES."
    },
    collectible: "ROOT_MIRROR"
  },
  {
    id: "release",
    chapter: "11",
    title: "Release the Archive?",
    subtitle: "Two Endings / Neither Clean",
    kicker: "FINAL PAGE",
    image: "assets/images/final-choice.svg",
    body: [
      "The archive is complete enough to damage the people who built it and incomplete enough to damage everyone else.",
      "If you release it, the truth becomes a weapon before it becomes evidence.",
      "If you bury it, MERIDIAN survives because you taught yourself to call fear responsibility."
    ],
    quote: "The public cannot be protected from the truth by people who are protected from the public.",
    narration: "This is where every operation lies to itself. It calls the last compromise necessary. It calls the last silence mercy. Choose anyway.",
    hint: "Choose RELEASE or BURY. Replay later for the opposite ending.",
    puzzle: {
      type: "choice",
      prompt: "Do you release the archive?",
      choices: [
        { id: "release", label: "RELEASE THE ARCHIVE", response: "ENDING A: THE WORLD RECEIVES THE SIGNAL. Every institution calls it fake before reading page one." },
        { id: "bury", label: "BURY THE ARCHIVE", response: "ENDING B: MERIDIAN SURVIVES. Somewhere, Rook stops narrating." }
      ]
    },
    collectible: "FINAL_DECISION"
  },
  {
    id: "support",
    chapter: "12",
    title: "Dead Drop",
    subtitle: "Support / Future Chapters / Optional",
    kicker: "OUT-OF-STORY NODE",
    image: "assets/images/dead-drop.svg",
    body: [
  "The first archive has been unsealed.",
  "Book I is now available as the next restricted archive: The Apocrypha Directive.",
  "Founder Witness access may be required for future sealed versions.",
  "<a class='primary-btn' href='the-apocrypha-directive/'>ENTER BOOK I</a>"
],
    quote: "Fund the signal. Starve the machine.",
    narration: "The archive is fiction. The curiosity is real. Build the next chapter before the signal cools.",
    hint: "Edit this page with your real support links after deployment. This node is unlocked after the final choice.",
    collectible: "DEAD_DROP_NODE",
    autoUnlock: true
  }
];
