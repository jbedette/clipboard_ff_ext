const textListEl = document.getElementById("textList");
const newTextInput = document.getElementById("newText");
const addTextButton = document.getElementById("addText");

// Load stored texts from storage and render them
function loadTexts() {
  browser.storage.local.get("texts").then((result) => {
    const texts = result.texts || [];
    renderTexts(texts);
  });
}

// Render texts in the popup
function renderTexts(texts) {
  textListEl.innerHTML = "";
  texts.forEach((text, index) => {
    const li = document.createElement("li");

    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.addEventListener("click", () => copyToClipboard(text));

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editText(index, text));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteText(index));

    li.appendChild(textSpan);
    li.appendChild(copyButton);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    textListEl.appendChild(li);
  });
}

// Copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard: " + text);
  });
}

// Add new text
function addText() {
  const newText = newTextInput.value.trim();
  if (newText) {
    browser.storage.local.get("texts").then((result) => {
      const texts = result.texts || [];
      texts.push(newText);
      browser.storage.local.set({ texts });
      loadTexts();
      newTextInput.value = "";
    });
  }
}

// Edit existing text
function editText(index, oldText) {
  const newText = prompt("Edit text:", oldText);
  if (newText !== null) {
    browser.storage.local.get("texts").then((result) => {
      const texts = result.texts || [];
      texts[index] = newText;
      browser.storage.local.set({ texts });
      loadTexts();
    });
  }
}

// Delete text
function deleteText(index) {
  browser.storage.local.get("texts").then((result) => {
    const texts = result.texts || [];
    texts.splice(index, 1);
    browser.storage.local.set({ texts });
    loadTexts();
  });
}

// Event listeners
addTextButton.addEventListener("click", addText);

// Initial load
loadTexts();
