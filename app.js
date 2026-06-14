(() => {
  const STORY = window.BLACK_MERIDIAN_STORY || [];
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  const storage = {
    pageIndex: "bm.v31.pageIndex",
    muted: "bm.v31.muted",
    solved: "bm.v31.solved",
    inventory: "bm.v31.inventory",
    choices: "bm.v31.choices",
    redactions: "bm.v31.redactions",
    audioPlayed: "bm.v31.audioPlayed",
    unlockedMax: "bm.v31.unlockedMax"
  };

  // Import old V3 progress only if the V3.1 keys do not exist yet.
  const legacy = {
    pageIndex: localStorage.getItem("bm.pageIndex"),
    muted: localStorage.getItem("bm.muted"),
    solved: localStorage.getItem("bm.solved"),
    inventory: localStorage.getItem("bm.inventory"),
    choices: localStorage.getItem("bm.choices"),
    redactions: localStorage.getItem("bm.redactions")
  };

  function safeJSON(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; }
  }

  const state = {
    pageIndex: Number(localStorage.getItem(storage.pageIndex) ?? legacy.pageIndex ?? 0),
    muted: (localStorage.getItem(storage.muted) ?? legacy.muted) === "true",
    solved: safeJSON(localStorage.getItem(storage.solved) ?? legacy.solved, {}),
    inventory: safeJSON(localStorage.getItem(storage.inventory) ?? legacy.inventory, []),
    choices: safeJSON(localStorage.getItem(storage.choices) ?? legacy.choices, {}),
    redactions: safeJSON(localStorage.getItem(storage.redactions) ?? legacy.redactions, {}),
    audioPlayed: safeJSON(localStorage.getItem(storage.audioPlayed), {}),
    unlockedMax: Number(localStorage.getItem(storage.unlockedMax) ?? 0),
    sequence: {},
    begun: false
  };

  const els = {
    boot: qs("#bootScreen"),
    experience: qs("#experience"),
    begin: qs("#beginBtn"),
    book: qs("#book"),
    left: qs("#leftPage"),
    right: qs("#rightPage"),
    prev: qs("#prevBtn"),
    next: qs("#nextBtn"),
    narrate: qs("#narrateBtn"),
    mute: qs("#muteBtn"),
    reset: qs("#resetBtn"),
    mobilePrev: qs("#mobilePrevBtn"),
    mobileNext: qs("#mobileNextBtn"),
    mobileNarrate: qs("#mobileNarrateBtn"),
    chapterCount: qs("#chapterCount"),
    clearance: qs("#clearance"),
    collectedCount: qs("#collectedCount"),
    inventory: qs("#inventory"),
    hint: qs("#hintText"),
    gateStatus: qs("#gateStatus"),
    ambience: qs("#ambience"),
    pageTurnAudio: qs("#pageTurnAudio"),
    glitchAudio: qs("#glitchAudio"),
    beepAudio: qs("#beepAudio")
  };

  function persist() {
    localStorage.setItem(storage.pageIndex, String(state.pageIndex));
    localStorage.setItem(storage.muted, String(state.muted));
    localStorage.setItem(storage.solved, JSON.stringify(state.solved));
    localStorage.setItem(storage.inventory, JSON.stringify(state.inventory));
    localStorage.setItem(storage.choices, JSON.stringify(state.choices));
    localStorage.setItem(storage.redactions, JSON.stringify(state.redactions));
    localStorage.setItem(storage.audioPlayed, JSON.stringify(state.audioPlayed));
    localStorage.setItem(storage.unlockedMax, String(state.unlockedMax));
  }

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function spreadSize() {
    return isMobile() ? 1 : 2;
  }

  function visibleIndices() {
    if (STORY.length === 0) return [];
    if (isMobile()) return [state.pageIndex].filter(i => STORY[i]);
    const leftIndex = state.pageIndex % 2 === 0 ? state.pageIndex : state.pageIndex - 1;
    return [leftIndex, leftIndex + 1].filter(i => STORY[i]);
  }

  function getVisiblePages() {
    return visibleIndices().map(i => STORY[i]).filter(Boolean);
  }

  function pageIndexById(pageId) {
    return STORY.findIndex(page => page.id === pageId);
  }

  function normalizeIndex() {
    state.unlockedMax = Math.max(0, Math.min(state.unlockedMax, STORY.length - 1));
    state.pageIndex = Math.max(0, Math.min(state.pageIndex, STORY.length - 1, state.unlockedMax));
    if (!isMobile() && state.pageIndex % 2 !== 0) state.pageIndex -= 1;
  }

  function play(el, volume = 0.75) {
    if (!el || state.muted) return;
    try {
      el.volume = volume;
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (_) {}
  }

  function startAmbience() {
    els.ambience.volume = state.muted ? 0 : 0.28;
    if (!state.muted) {
      const p = els.ambience.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function processInlineMarkup(page, text) {
    return String(text || "").replace(/<redact\s+data-value=['\"]([^'\"]+)['\"]>.*?<\/redact>/g, (_, value) => {
      const key = `${page.id}:${value}`;
      const revealed = !!state.redactions[key];
      return `<span class="redaction ${revealed ? "revealed" : ""}" data-page="${page.id}" data-secret="${escapeHtml(value)}" role="button" tabindex="0">${revealed ? escapeHtml(value) : ""}</span>`;
    });
  }

  function pageIsComplete(page, index = pageIndexById(page?.id)) {
    if (!page) return true;
    if (page.autoUnlock) return true;
    if (page.puzzle) return !!state.solved[page.id];
    if (page.audioLog?.required) return !!state.audioPlayed[page.id] || !!state.solved[page.id];
    if (page.collectible) return state.inventory.includes(page.collectible) || !!state.solved[page.id];
    return index <= state.unlockedMax;
  }

  function markSolved(page, message = "File verified.") {
    if (!page) return false;
    const firstSolve = !state.solved[page.id];
    state.solved[page.id] = true;
    if (page.collectible && !state.inventory.includes(page.collectible)) {
      state.inventory.push(page.collectible);
    }
    if (message) els.hint.textContent = message;
    return firstSolve;
  }

  function autoCompleteVisiblePages() {
    visibleIndices().forEach(index => {
      const page = STORY[index];
      if (page?.autoUnlock) markSolved(page, "Archive node verified.");
    });
  }

  function maybeUnlockNext() {
    const indices = visibleIndices();
    if (!indices.length) return false;
    const complete = indices.every(index => pageIsComplete(STORY[index], index));
    if (!complete) return false;
    const nextUnlock = Math.min(STORY.length - 1, Math.max(...indices) + 1);
    if (nextUnlock > state.unlockedMax) {
      state.unlockedMax = nextUnlock;
      return true;
    }
    return false;
  }

  function requirementFor(page) {
    if (!page) return "Archive page missing.";
    if (page.puzzle?.type === "redactions") return `Reveal ${page.puzzle.required} redaction${page.puzzle.required > 1 ? "s" : ""} in CH ${page.chapter}.`;
    if (page.puzzle?.type === "terminal") return `Run the terminal command in CH ${page.chapter}.`;
    if (page.puzzle?.type === "sequence") return `Rebuild the phrase in CH ${page.chapter}.`;
    if (page.puzzle?.type === "choice") return `Make a selection in CH ${page.chapter}.`;
    if (page.audioLog?.required) return `Play the required audio log in CH ${page.chapter}.`;
    if (page.collectible) return `Secure evidence in CH ${page.chapter}.`;
    return `Verify CH ${page.chapter}.`;
  }

  function gateMessage() {
    const incomplete = visibleIndices()
      .map(index => STORY[index])
      .filter(page => !pageIsComplete(page));
    if (!incomplete.length) return "ARCHIVE GATE: NEXT FILE READY.";
    return `ARCHIVE GATE LOCKED: ${incomplete.map(requirementFor).join(" ")}`;
  }

  function canTurnNext() {
    const nextIndex = state.pageIndex + spreadSize();
    return nextIndex <= STORY.length - 1 && nextIndex <= state.unlockedMax;
  }

  function renderPage(page, side) {
    if (!page) return `<div class="dossier-copy"><p></p></div>`;
    const solved = !!state.solved[page.id] || page.autoUnlock;
    const complete = pageIsComplete(page);
    const hasCollectible = !!page.collectible;
    const collected = state.inventory.includes(page.collectible);
    const image = page.image ? `<div class="asset-plate"><img src="${page.image}" alt="${escapeHtml(page.title)} visual" /></div>` : "";
    const body = [...(page.body || []), page.bodyAddendum].filter(Boolean).map(p => `<p>${processInlineMarkup(page, p)}</p>`).join("");
    const quote = page.quote ? `<blockquote class="quote">${escapeHtml(page.quote)}</blockquote>` : "";
    const statusText = complete ? "FILE VERIFIED" : "LOCK OPEN / ACTION REQUIRED";
    const status = `<span class="status-pill ${complete ? "verified" : "pending"}">${statusText}</span>`;
    const audio = page.audioLog ? renderAudioLog(page.audioLog, page) : "";
    const puzzle = renderPuzzle(page);
    const collectibleLocked = hasCollectible && ((page.puzzle && !state.solved[page.id]) || (page.audioLog?.required && !state.audioPlayed[page.id] && !state.solved[page.id]));
    const collect = hasCollectible && !collectibleLocked
      ? `<div class="action-row"><button class="mini-btn" data-collect="${escapeHtml(page.collectible)}" data-page="${escapeHtml(page.id)}">${collected || solved ? "EVIDENCE SECURED" : "SECURE EVIDENCE"}</button></div>`
      : hasCollectible
        ? `<div class="locked-note">Evidence package remains sealed until this page action is complete.</div>`
        : "";

    return `
      <div class="page-inner" data-page-id="${page.id}" data-side="${side}">
        <p class="page-kicker">${escapeHtml(page.kicker || "CLASSIFIED")}</p>
        <h2 class="page-title">${escapeHtml(page.title)}</h2>
        <p class="page-subtitle">${escapeHtml(page.subtitle || "")}</p>
        ${status}
        ${image}
        <div class="dossier-copy">${body}${quote}</div>
        ${audio}
        ${puzzle}
        ${collect}
      </div>
    `;
  }

  function renderAudioLog(log, page) {
    const required = log.required ? `<span class="required-chip">REQUIRED PLAYBACK</span>` : "";
    const indexed = state.audioPlayed[page.id] ? `<div class="locked-note success-note">AUDIO LOG INDEXED. EVIDENCE GATE OPEN.</div>` : "";
    return `
      <div class="audio-log">
        <p class="page-subtitle">${escapeHtml(log.title)} ${required}</p>
        <audio controls preload="metadata" src="${escapeHtml(log.src)}" data-audio-log-page="${escapeHtml(page.id)}"></audio>
        <div class="audio-transcript">${escapeHtml(log.transcript)}</div>
        ${indexed}
      </div>
    `;
  }

  function renderPuzzle(page) {
    const puzzle = page.puzzle;
    if (!puzzle) return "";
    if (state.solved[page.id]) {
      const selected = state.choices[page.id] ? `<p class="audio-transcript">SELECTED: ${escapeHtml(state.choices[page.id])}</p>` : "";
      return `<div class="locked-note success-note">${escapeHtml(puzzle.success || "Puzzle complete.")}${selected}</div>`;
    }

    if (puzzle.type === "terminal") {
      return `<div data-terminal-root data-page="${page.id}" data-answer="${escapeHtml(puzzle.answer)}" data-boot="${escapeHtml(puzzle.bootText)}" data-success="${escapeHtml(puzzle.success)}" data-failure="${escapeHtml(puzzle.failure)}"></div>`;
    }

    if (puzzle.type === "sequence") {
      const words = puzzle.words.map(word => `<button class="sequence-word" data-sequence-word="${escapeHtml(word)}" data-page="${page.id}">${escapeHtml(word)}</button>`).join("");
      return `<div class="choice-grid" data-sequence-root="${page.id}">${words}</div><div class="audio-transcript" data-sequence-output="${page.id}">Selected: —</div>`;
    }

    if (puzzle.type === "choice") {
      const choices = puzzle.choices.map(choice => `<button class="choice-card" data-choice="${escapeHtml(choice.id)}" data-page="${page.id}" data-response="${escapeHtml(choice.response)}">${escapeHtml(choice.label)}</button>`).join("");
      return `<div class="choice-grid"><p class="page-subtitle">${escapeHtml(puzzle.prompt)}</p>${choices}</div><div class="audio-transcript" data-choice-output="${page.id}"></div>`;
    }

    if (puzzle.type === "redactions") {
      return `<div class="locked-note">Reveal ${puzzle.required} hidden redaction${puzzle.required > 1 ? "s" : ""} to verify this file and unlock the next archive node.</div>`;
    }

    return "";
  }

  function hydrateTerminals() {
    qsa("[data-terminal-root]").forEach(root => {
      const pageId = root.dataset.page;
      const template = qs("#terminalTemplate").content.cloneNode(true);
      root.appendChild(template);
      const out = qs("[data-terminal-output]", root);
      const form = qs("[data-terminal-form]", root);
      const input = qs("[data-terminal-input]", root);
      out.textContent = root.dataset.boot || "TERMINAL READY.";
      setTimeout(() => input.focus({ preventScroll: true }), 100);
      form.addEventListener("submit", e => {
        e.preventDefault();
        const command = input.value.trim().toLowerCase();
        const answer = root.dataset.answer.trim().toLowerCase();
        if (command === answer) {
          out.textContent += `\n> ${command}\n${root.dataset.success}`;
          solvePage(pageId, root.dataset.success);
          play(els.beepAudio, 0.85);
        } else {
          out.textContent += `\n> ${command}\n${root.dataset.failure}`;
          play(els.glitchAudio, 0.65);
        }
        input.value = "";
      });
    });
  }

  function hydrateEvents() {
    qsa(".redaction").forEach(redaction => {
      const reveal = () => {
        const key = `${redaction.dataset.page}:${redaction.dataset.secret}`;
        if (!state.redactions[key]) {
          state.redactions[key] = true;
          redaction.textContent = redaction.dataset.secret;
          redaction.classList.add("revealed");
          play(els.glitchAudio, 0.45);
          checkRedactionPuzzle(redaction.dataset.page);
          persist();
          updateHud();
        }
      };
      redaction.addEventListener("click", reveal);
      redaction.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") reveal(); });
    });

    qsa("[data-collect]").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.dataset.collect;
        const page = STORY.find(p => p.id === btn.dataset.page);
        if (!state.inventory.includes(item)) state.inventory.push(item);
        if (page && !page.puzzle && !page.audioLog?.required) markSolved(page, "Evidence secured. Archive gate updated.");
        if (page && page.autoUnlock) markSolved(page, "Archive node verified.");
        btn.textContent = "EVIDENCE SECURED";
        play(els.beepAudio, 0.7);
        maybeUnlockNext();
        updateHud();
        persist();
      });
    });

    qsa("[data-audio-log-page]").forEach(audio => {
      const pageId = audio.dataset.audioLogPage;
      const markAudio = () => {
        if (!state.audioPlayed[pageId]) {
          state.audioPlayed[pageId] = true;
          const page = STORY.find(p => p.id === pageId);
          if (page?.audioLog?.required) solvePage(pageId, "Audio log indexed. Archive gate updated.");
          play(els.beepAudio, 0.6);
        }
      };
      audio.addEventListener("play", markAudio, { once: true });
      audio.addEventListener("ended", markAudio, { once: true });
    });

    qsa("[data-sequence-word]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pageId = btn.dataset.page;
        const page = STORY.find(p => p.id === pageId);
        if (!state.sequence[pageId]) state.sequence[pageId] = [];
        state.sequence[pageId].push(btn.dataset.sequenceWord.toLowerCase());
        btn.classList.add("selected");
        btn.disabled = true;
        const out = qs(`[data-sequence-output="${pageId}"]`);
        if (out) out.textContent = `Selected: ${state.sequence[pageId].join(" ")}`;
        const answer = page.puzzle.answer.join(" ");
        const current = state.sequence[pageId].join(" ");
        if (current === answer) {
          solvePage(pageId, page.puzzle.success);
          play(els.beepAudio, 0.8);
        } else if (!answer.startsWith(current)) {
          if (out) out.textContent += "\nSequence corrupted. Resetting phrase.";
          qsa(`[data-sequence-word][data-page="${pageId}"]`).forEach(w => { w.classList.remove("selected"); w.disabled = false; });
          state.sequence[pageId] = [];
          play(els.glitchAudio, 0.6);
        }
      });
    });

    qsa("[data-choice]").forEach(btn => {
      btn.addEventListener("click", () => {
        const pageId = btn.dataset.page;
        qsa(`[data-choice][data-page="${pageId}"]`).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.choices[pageId] = btn.textContent.trim();
        const out = qs(`[data-choice-output="${pageId}"]`);
        if (out) out.textContent = btn.dataset.response;
        solvePage(pageId, btn.dataset.response, false);
        play(els.beepAudio, 0.75);
      });
    });

    hydrateTerminals();
  }

  function checkRedactionPuzzle(pageId) {
    const page = STORY.find(p => p.id === pageId);
    if (!page || !page.puzzle || page.puzzle.type !== "redactions") return;
    const revealedCount = qsa(`.redaction[data-page="${pageId}"].revealed`).length;
    if (revealedCount >= page.puzzle.required) solvePage(pageId, page.puzzle.success, true);
  }

  function solvePage(pageId, message, rerender = true) {
    const page = STORY.find(p => p.id === pageId);
    const firstSolve = markSolved(page, message || "File verified.");
    const unlocked = maybeUnlockNext();
    persist();
    updateHud();
    if ((firstSolve || unlocked) && rerender) setTimeout(render, 650);
  }

  function renderArchiveNav() {
    const navItems = STORY
      .map((page, index) => ({ page, index }))
      .filter(({ index }) => index <= state.unlockedMax);

    els.inventory.innerHTML = navItems.length
      ? navItems.map(({ page, index }) => {
          const active = visibleIndices().includes(index);
          const verified = pageIsComplete(page, index);
          const collected = page.collectible && state.inventory.includes(page.collectible);
          const meta = collected ? page.collectible : verified ? "FILE VERIFIED" : "ACTION REQUIRED";
          return `<li><button class="archive-nav-btn ${active ? "active" : ""}" data-jump-index="${index}"><span>CH ${escapeHtml(page.chapter)} // ${escapeHtml(page.title)}</span><small>${escapeHtml(meta)}</small></button></li>`;
        }).join("")
      : `<li>NO FILES UNSEALED</li>`;

    qsa("[data-jump-index]", els.inventory).forEach(btn => {
      btn.addEventListener("click", () => {
        const target = Number(btn.dataset.jumpIndex);
        if (Number.isNaN(target) || target > state.unlockedMax) return;
        state.pageIndex = target;
        normalizeIndex();
        play(els.pageTurnAudio, 0.55);
        render();
      });
    });
  }

  function updateHud() {
    maybeUnlockNext();
    const first = getVisiblePages()[0] || STORY[0];
    const lastNum = String(STORY.length - 1).padStart(2, "0");
    els.chapterCount.textContent = `${String(state.pageIndex).padStart(2, "0")} / ${lastNum}`;
    els.collectedCount.textContent = String(state.inventory.length);
    const solvedCount = Object.keys(state.solved).length;
    els.clearance.textContent = solvedCount > 10 ? "NULL" : solvedCount > 6 ? "BLACK" : solvedCount > 2 ? "OBSIDIAN+" : "OBSIDIAN";
    els.mute.textContent = state.muted ? "AUDIO OFF" : "AUDIO ON";

    const canNext = canTurnNext();
    const atEnd = state.pageIndex >= STORY.length - 1;
    els.prev.disabled = state.pageIndex <= 0;
    els.mobilePrev.disabled = state.pageIndex <= 0;
    els.next.disabled = atEnd || !canNext;
    els.mobileNext.disabled = atEnd || !canNext;
    els.next.textContent = atEnd ? "END" : canNext ? "NEXT →" : "NEXT LOCKED";
    els.mobileNext.textContent = atEnd ? "END" : canNext ? "→" : "LOCK";

    const gate = gateMessage();
    if (els.gateStatus) els.gateStatus.textContent = gate;
    els.hint.textContent = pageIsComplete(first) ? gate : (first?.hint || gate);
    renderArchiveNav();
    persist();
  }

  function render() {
    normalizeIndex();
    autoCompleteVisiblePages();
    maybeUnlockNext();
    const visible = getVisiblePages();
    if (isMobile()) {
      els.left.innerHTML = "";
      els.right.innerHTML = renderPage(visible[0], "right");
    } else {
      els.left.innerHTML = renderPage(visible[0], "left");
      els.right.innerHTML = renderPage(visible[1], "right");
    }
    hydrateEvents();
    updateHud();
    persist();
  }

  function turn(direction) {
    const step = spreadSize();
    const nextIndex = direction === "next" ? state.pageIndex + step : state.pageIndex - step;
    if (nextIndex < 0 || nextIndex > STORY.length - 1) return;
    if (direction === "next" && nextIndex > state.unlockedMax) {
      els.hint.textContent = gateMessage();
      if (els.gateStatus) els.gateStatus.textContent = gateMessage();
      play(els.glitchAudio, 0.65);
      els.book.classList.add("gate-denied");
      setTimeout(() => els.book.classList.remove("gate-denied"), 420);
      return;
    }
    els.book.classList.remove("flipping-next", "flipping-prev");
    void els.book.offsetWidth;
    els.book.classList.add(direction === "next" ? "flipping-next" : "flipping-prev");
    play(els.pageTurnAudio, 0.8);
    setTimeout(() => {
      state.pageIndex = nextIndex;
      els.book.classList.remove("flipping-next", "flipping-prev");
      render();
    }, 360);
  }

  function narrate() {
    if (!("speechSynthesis" in window)) {
      els.hint.textContent = "This browser does not support in-browser narration. Use the transcripts on each page.";
      return;
    }
    window.speechSynthesis.cancel();
    const text = getVisiblePages().map(p => p?.narration).filter(Boolean).join(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.86;
    utterance.pitch = 0.74;
    utterance.volume = state.muted ? 0 : 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function resetProgress() {
    const sure = confirm("Reset Black Meridian V3.1 local progress on this browser?");
    if (!sure) return;
    [
      ...Object.values(storage),
      "bm.pageIndex", "bm.muted", "bm.solved", "bm.inventory", "bm.choices", "bm.redactions"
    ].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  }

  function wireGlobalEvents() {
    document.addEventListener("pointermove", e => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    });
    document.addEventListener("keydown", e => {
      if (els.experience.classList.contains("hidden")) return;
      if (e.key === "ArrowRight") turn("next");
      if (e.key === "ArrowLeft") turn("prev");
      if (e.key.toLowerCase() === "n") narrate();
    });
    window.addEventListener("resize", () => {
      normalizeIndex();
      render();
    });
  }

  els.begin.addEventListener("click", () => {
    state.begun = true;
    els.boot.classList.add("hidden");
    els.experience.classList.remove("hidden");
    startAmbience();
    render();
    setTimeout(narrate, 350);
  });
  els.prev.addEventListener("click", () => turn("prev"));
  els.next.addEventListener("click", () => turn("next"));
  els.mobilePrev.addEventListener("click", () => turn("prev"));
  els.mobileNext.addEventListener("click", () => turn("next"));
  els.narrate.addEventListener("click", narrate);
  els.mobileNarrate.addEventListener("click", narrate);
  els.reset.addEventListener("click", resetProgress);
  els.mute.addEventListener("click", () => {
    state.muted = !state.muted;
    els.ambience.volume = state.muted ? 0 : 0.28;
    if (state.muted) window.speechSynthesis?.cancel();
    if (!state.muted) startAmbience();
    persist();
    updateHud();
  });

  wireGlobalEvents();
  updateHud();
})();
