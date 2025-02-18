//Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");

if (listBtnAddFriend) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// end chức năng gửi yêu cầu
//Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if (listBtnCancelFriend) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// end chức năng hủy yêu cầu
//Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");

if (listBtnRefuseFriend) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// end chức năng từ chối kết bạn
//Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");

if (listBtnAcceptFriend) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");
      console.log(userId);
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// end chức năng chấp nhận kết bạn
//SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");
  if (userId == data.userId) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
//END SERVER_RETURN_LENGTH_ACCEPT_FRIEND
// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  //Trang loi moi ket ban
  const dataUsersAccept = document.querySelector("[data-users-accept]");

  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if (userId == data.userId) {
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);
      newBoxUser.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="/images/avatar.jpg" alt="${data.infoUserA.fullName}">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">
                            ${data.infoUserA.fullName}
                        </div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoUserA._id}">
                                Chấp nhận
                            </button>
                            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoUserA._id}">
                                Xóa
                            </button><button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">
                                Đã xóa
                            </button>
                            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">
                                Đã chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            `;
      dataUsersAccept.appendChild(newBoxUser);
      // Xóa lời mời kết bạn
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
      if (btnRefuseFriend) {
        btnRefuseFriend.addEventListener("click", () => {
          btnRefuseFriend.closest(".box-user").classList.add("refuse");
          const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
          socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
      }
      // Hết xóa lời mời kết bạn
      // Chấp nhận lời mời kết bạn
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      if (btnAcceptFriend) {
        btnAcceptFriend.addEventListener("click", () => {
          btnAcceptFriend.closest(".box-user").classList.add("accepted");
          const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
          socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        });
      }
      // Hết chấp nhận lời mời kết bạn
    }
  }
  //Hết trang lời mời kết bạn
  //Danh sách người dùng
  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
    if (userId == data.userId) {
      const boxUserRemove = dataUsersNotFriend.querySelector(
        `[user-id="${data.infoUserA._id}"]`
      );
      if (boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove);
      }
    }
  }
  //Hết trang danh sách người dùng
});
// END SERVER_RETURN_INFO_ACCEPT_FRIEND
// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector("[data-users-accept]");
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if (userId == data.userId) {
      //Xóa A khỏi danh sách B
      const boxUserRemove = dataUsersAccept.querySelector(
        `[user-id="${data.userIdA}"]`
      );
      if (boxUserRemove) {
        dataUsersAccept.removeChild(boxUserRemove);
      }
    }
  }
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND
//SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if (boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", "online");
    }
  }
});
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if (boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", "offline");
    }
  }
});
//END SERVER_RETURN_USER_ONLINE
