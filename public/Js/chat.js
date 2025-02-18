import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
//import Viewer from "viewerjs";
const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-image", {
  multiple: true,
  maxFileCount: 5,
});
// Client_Send_Message
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray || [];
    console.log(images);
    if (content || images.length > 0) {
      // Gửi ảnh hoặc content len server
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// End Client_Send_Message
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const boxTyping = document.querySelector(".inner-list-typing");
  // Tạo thẻ div
  const div = document.createElement("div");
  let htmlfullName = "";
  let htmlContent = "";
  let htmlImages = "";
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlfullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  if (data.content) {
    htmlContent = `<div class="inner-content">${data.content}</div>`;
  }
  if (data.images) {
    htmlImages += `<div class="inner-images">`;
    for (const image of data.images) {
      htmlImages += `<img src=${image}>`;
    }
    htmlImages += `</div>`;
  }
  div.innerHTML = `
    ${htmlfullName}
    ${htmlContent}
    ${htmlImages}
  `;
  body.insertBefore(div, boxTyping);
  const boxImages = div.querySelector(".inner-images");
  if (boxImages) {
    const gallery = new Viewer(boxImages);
  }
  body.scrollTop = body.scrollHeight;
});
// END SERVER_RETURN_MESSAGE
// Scroll Chat to Bottom
// showTyping
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
// end showTyping
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end Scroll Chat to Bottom
//emoji-picker
// Show Popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
// Insert Icon to Input

const emojPicker = document.querySelector("emoji-picker");
if (emojPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();
    showTyping();
  });

  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}
// end emoji-picker
// SERVER_RETURN_TYPING
const elementsListTyping = document.querySelector(".chat .inner-list-typing");
if (elementsListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementsListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if (!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        `;
        elementsListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingREmove = elementsListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if (boxTypingREmove) {
        elementsListTyping.removeChild(boxTypingREmove);
      }
    }
  });
}

//End SERVER_RETURN_TYPING
// FileUploadWithPreview

// End FileUploadWithPreview
// Preview Image
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
  console.log(chatBody);
  const gallery = new Viewer(chatBody);
}
// End Preview Image
