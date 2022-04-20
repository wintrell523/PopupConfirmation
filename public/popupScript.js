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
  localStorage.setItem("popupConfirmedTime", new Date());
  hidePopup();
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    initPopup();

    // get saved time from localStorage and convert it to Date object
    const popupConfirmedTime = new Date(
      localStorage.getItem("popupConfirmedTime")
    );
    if (popupConfirmedTime) {
      // add 10 minutes to popupConfirmedTime
      const popupConfirmedValidity = new Date(
        popupConfirmedTime.getTime() + 10 * 60000
      );
      const now = new Date();
      if (now.getTime() > popupConfirmedValidity.getTime()) {
        showPopup();
      }
    } else {
      showPopup();
    }
  },
  false
);
