const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userName = document.getElementById("users");

//Get username and room
const { username, room } = qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

/* console.log(username, room); */

const socket = io();

//Join chatroom
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUserName(users);
});

//Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down on new message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  /* console.log(msg); */
  //Emit message to server
  socket.emit("chatMessage", msg);

  //clear input bar
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output meesage from DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to DOM
function outputUserName(users) {
  userName.innerHTML = `
        ${users.map((user) => `<li> ${user.username} <\li>`).join("")}
    `;
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
