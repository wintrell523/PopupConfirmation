function initPopup() {
  const popupWrapper = document.createElement("div");
  popupWrapper.setAttribute("class", "modal");
  popupWrapper.setAttribute("id", "popup");
  popupWrapper.addEventListener("click", hidePopup);

  const content = document.createElement("div");
  content.setAttribute("class", "modal-content");

  const confirmationButton = document.createElement("button");
  confirmationButton.addEventListener("click", handleConfirmation);
  confirmationButton.innerHTML = "confirm";

  const message = document.createElement("div");
  message.innerHTML = "<h2>Please confirm that you read this.</h2>";

  const closeButton = document.createElement("span");
  closeButton.setAttribute("class", "close");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", hidePopup);

  content.appendChild(closeButton);
  content.appendChild(message);
  content.appendChild(confirmationButton);
  popupWrapper.appendChild(content);

  document.body.appendChild(popupWrapper);
}

function showPopup() {
  document.querySelector("#popup").style.display = "block";
}

function hidePopup() {
  document.querySelector("#popup").style.display = "none";
}

function handleConfirmation() {
  setWithExpiry("popupConfirmedTime", 10);
  hidePopup();
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    initPopup();

    const popupConfirmedTime = getWithExpiry("popupConfirmedTime");
    if (!popupConfirmedTime) {
      showPopup();
    }
  },
  false
);

function setWithExpiry(key, ttl) {
  const now = new Date();
  const expiryTime = now.getTime() + ttl * 60000;
  localStorage.setItem(key, expiryTime);
}

function getWithExpiry(key) {
  const expiryTime = localStorage.getItem(key);

  // if the item doesn't exist, return null
  if (!expiryTime) {
    return null;
  }
  const now = new Date();

  // compare the expiry time of the item with the current time
  if (now.getTime() > expiryTime) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return expiryTime;
}
