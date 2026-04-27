let matches = [];
let current = -1;

function sendStatus() {
  chrome.runtime.sendMessage({
    type: "UPDATE_COUNTER",
    current: matches.length ? current + 1 : 0,
    total: matches.length
  });
}

chrome.runtime.onMessage.addListener((msg) => {

  if (msg.action === "RUN") {
    runHighlight(msg.keywords, msg.sentenceOnly);
  }

  if (msg.action === "NEXT") {
    move(1);
  }

  if (msg.action === "PREV") {
    move(-1);
  }
});

function clearHighlight() {
  document.querySelectorAll("[data-and-highlight]").forEach(el => {
    el.style.backgroundColor = "";
    el.style.outline = "";
    el.removeAttribute("data-and-highlight");
  });
}

function runHighlight(keywords, sentenceOnly) {

  clearHighlight();

  matches = [];
  current = -1;

  if (!keywords.length) {
    sendStatus();
    return;
  }

  const elements = document.querySelectorAll("p, li, article, section");

  elements.forEach(el => {
    const text = el.innerText.toLowerCase();
    if (!text) return;

    let ok = false;

    if (sentenceOnly) {
      const sentences = text.split(/[.!?。！？]/);

      ok = sentences.some(s =>
        keywords.every(k => s.includes(k.toLowerCase()))
      );
    } else {
      ok = keywords.every(k =>
        text.includes(k.toLowerCase())
      );
    }

    if (ok) {
      el.style.backgroundColor = "yellow";
      el.setAttribute("data-and-highlight", "1");
      matches.push(el);
    }
  });

  if (matches.length > 0) {
    current = 0;
    focus(matches[current]);
  }

  sendStatus();
}

function move(step) {
  if (!matches.length) return;

  current += step;

  if (current < 0) current = matches.length - 1;
  if (current >= matches.length) current = 0;

  focus(matches[current]);

  sendStatus();
}

function focus(el) {
  matches.forEach(e => e.style.outline = "");

  el.style.outline = "3px solid red";
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}