// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
//end show alert
// button-go-back
const buttonGoBack = document.querySelectorAll("[button-go-back]");
if (buttonGoBack.length > 0) {
  buttonGoBack.forEach((button) => {
    button.addEventListener("click", () => {
      window.history.back();
    });
  });
}
// end button-go-back
