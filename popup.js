let currentIndex = -1;

function getKeywords() {
  return document.getElementById("keywords").value
    .split(",")
    .map(k => k.trim())
    .filter(Boolean);
}

function getSentenceMode() {
  return document.getElementById("sentenceOnly").checked;
}

async function send(action) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, {
    action,
    keywords: getKeywords(),
    sentenceOnly: getSentenceMode()
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "UPDATE_COUNTER") {
    const el = document.getElementById("counter");
    if (el) {
      el.textContent = `${msg.current} / ${msg.total}`;
    }
  }
});

function updateCounter(current, total) {
  const el = document.getElementById("counter");
  if (el) el.textContent = `${current} / ${total}`;
}

async function send(action) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, {
    action,
    keywords: getKeywords(),
    sentenceOnly: getSentenceMode()
  });
}

document.getElementById("run").addEventListener("click", () => {
  send("RUN");
});

document.getElementById("next").addEventListener("click", () => {
  send("NEXT");
});

document.getElementById("prev").addEventListener("click", () => {
  send("PREV");
});