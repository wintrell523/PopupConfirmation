function initPopup() {
  const popupWrapper = document.createElement("div");
  popupWrapper.setAttribute("class", "modal");
  popupWrapper.setAttribute("id", "popup");
  popupWrapper.addEventListener("click", hidePopupUnconfirmed);

  const content = document.createElement("div");
  content.setAttribute("class", "modal-content");

  const confirmationButton = document.createElement("button");

  confirmationButton.setAttribute("id", "confirmButton");
  confirmationButton.addEventListener("click", handleConfirmation);
  confirmationButton.innerHTML = "confirm";

  const header = document.createElement("div");
  header.setAttribute("id", "popupHeader");
  header.innerHTML = "<h2>Please confirm that you read this.</h2>";

  const receivedMessage = document.createElement("p");
  receivedMessage.setAttribute("id", "popupMessage");

  const closeButton = document.createElement("span");
  closeButton.setAttribute("class", "close");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", hidePopupUnconfirmed);

  content.appendChild(closeButton);
  content.appendChild(header);
  content.appendChild(receivedMessage);
  content.appendChild(confirmationButton);
  popupWrapper.appendChild(content);

  document.body.appendChild(popupWrapper);
}

function showPopup() {
  fetchPopup().catch((err) => {
    err.message;
  });
  document.querySelector("#popup").style.display = "block";
}

function hidePopupConfirmed() {
  document.querySelector("#popup").style.display = "none";
}

function hidePopupUnconfirmed() {
  // if the popup is not confirmed and only closed, show it again in 10 minutes
  runPopupTimer();
  document.querySelector("#popup").style.display = "none";
}

function handleConfirmation() {
  const confirmationReqStatus = confirmPopup().catch((err) => {
    err.message;
  }); // send post to confirm the popup
  // hide popup with confirmed or unconfirmed status depending on the response code
  if (confirmationReqStatus) {
    hidePopupConfirmed();
  } else {
    hidePopupUnconfirmed();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    initPopup(); // init the popup
    if (!getWithExpiry("popupConfirmedTime")) {
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

/**
 * GET /popup
 * Show popup if the response is 200
 * Set the message from response to the popup
 */
async function fetchPopup() {
  const fetchPopup = await fetch("/popup");
  if (!fetchPopup.ok) {
    hidePopupUnconfirmed();
    return;
  }
  const fetchPopupJson = await fetchPopup.json();
  document.querySelector("#popupMessage").innerHTML = fetchPopupJson.message;
}

/**
 * POST /popup/confirmation
 * If the response contains confirmationTracked: true, set confirm token
 */
async function confirmPopup() {
  const popupConfirm = await fetch("/popup/confirmation", {
    method: "POST",
  });
  const popupConfirmJson = await popupConfirm.json();
  if (popupConfirmJson.confirmationTracked) {
    setWithExpiry("popupConfirmedTime", 10);
    return popupConfirmJson.confirmationTracked;
  }
}

/**
 * Timer for 10 minutes for the case that the popup was closed without confirmation.
 * After 10 minutes the popup is opened again.
 */
function runPopupTimer() {
  setTimeout(showPopup, 600000); // check again in a second
  console.log("TIMER SET");
}
