const messageTypes = { LEFT: "left", RIGHT: "right", LOGIN: "login" };

//Chat stuff
const chatWindow = document.getElementById("chat");
const messagesList = document.getElementById("messagesList");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

//login stuff
let username = "";
const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const loginWindow = document.getElementById("login");

const messages = []; // { author, date, content, type }

//Connect to socket.io - automatically tries to connect on same port app was served from
var socket = io();

socket.on("message", (message) => {
  //Update type of message based on username
  if (message.type !== messageTypes.LOGIN) {
    if (message.author === username) {
      //both .types were set to change left, made this to be one or the other
      message.type = messageTypes.RIGHT;
    } else {
      message.type = messageTypes.LEFT;
    }
  }

  // debugger;
  messages.push(message);
  displayMessages();

  //scroll to the bottom - changed from scrollWIDTH to scrollHEIGHT
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

createMessageHTML = (message) => {
  if (message.type === messageTypes.LOGIN) {
    return `
			<p class="secondary-text text-center mb-2">${message.author} joined the chat...</p>
		`;
  }
  return `
	<div class="message ${
    //switched around the ternary conditions - right applied when type is right
    message.type === messageTypes.RIGHT ? "message-right" : "message-left"
  }">
		<div class="message-details flex">
			<p class="flex-grow-1 message-author">${
        message.type === messageTypes.LEFT ? message.author : ""
      }</p>
			<p class="message-date">${message.date}</p>
		</div>
		<p class="message-content">${message.content}</p>
	</div>
	`;
};

displayMessages = () => {
  //removed unnecessary messagesHTML.length
  const messagesHTML = messages
    .map((message) => createMessageHTML(message))
    .join("");
  messagesList.innerHTML = messagesHTML;
};

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!messageInput.value) {
    return console.log("Invalid input");
  }

  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const dateString = `${day}/${month + 1}/${year}`;

  const message = {
    author: username,
    date: dateString,
    content: messageInput.value,
  };
  sendMessage(message);
  //clear input
  messageInput.value = "";
});

function addUsername(e) {
  e.preventDefault();
  if (!usernameInput.value) {
    return console.log("Must supply a username");
  }

  //set the username and create logged in message
  username = usernameInput.value;
  sendMessage({ author: username, type: messageTypes.LOGIN });

  //show chat window and hide login
  loginWindow.classList.add("hidden");
  chatWindow.classList.remove("hidden");
}

loginBtn.addEventListener("click", addUsername);

sendMessage = (message) => {
  socket.emit("message", message);
};
// const messageTypes = { LEFT: "left", RIGHT: "right", LOGIN: "login" };

// //Chat stuff
// const chatWindow = document.getElementById("chat");
// const messagesList = document.getElementById("messagesList");
// const messageInput = document.getElementById("messageInput");
// const sendBtn = document.getElementById("sendBtn");

// //login stuff
// let username = "";
// const usernameInput = document.getElementById("usernameInput");
// const loginBtn = document.getElementById("loginBtn");
// const loginWindow = document.getElementById("login");

// const messages = []; // { author, date, content, type }

// //Connect to socket.io - automatically tries to connect on same port app was served from
// var socket = io();

// socket.on("message", (message) => {
//   //Update type of message based on username
//   if (message.type !== messageTypes.LOGIN) {
//     if (message.author === username) {
//       message.type = messageTypes.LEFT;
//     } else {
//       message.type = messageTypes.LEFT;
//     }
//   }

//   messages.push(message);
//   // messages.reverse();
//   displayMessages();

//   //scroll to the bottom
//   chatWindow.scrollTop = chatWindow.scrollWidth;
// });

// createMessageHTML = (message) => {
//   if (message.type === messageTypes.LOGIN) {
//     return `
// 			<p class="secondary-text text-center mb-2">${usernameInput.value} joined the chat...</p>
// 		`;
//   }
//   return `
// 	<div class="message ${
//     message.type === messageTypes.RIGHT ? "message-left" : "message-right"
//   }">
// 		<div class="message-details flex">
// 			<p class="flex-grow-1 message-author">${
//         message.type === messageTypes.LEFT ? message.author : ""
//       }</p>
// 			<p class="message-date">${message.date}</p>
// 		</div>
// 		<p class="message-content">${message.content}</p>
// 	</div>
// 	`;
// };

// displayMessages = () => {
//   // const newArr = messages.reverse();
//   const messagesHTML = messages
//     .map((message) => createMessageHTML(message))
//     .join("");
//   messagesList.innerHTML = messagesHTML;
// };

// sendBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   if (!messageInput.value) {
//     return console.log("Invalid input");
//   }

//   const date = new Date();
//   const month = 1 + date.getMonth();
//   const day = date.getDate();
//   const year = date.getFullYear();
//   const dateString = `${day}/${month}/${year}`;

//   const message = {
//     author: usernameInput.value,
//     date: dateString,
//     content: messageInput.value,
//   };
//   sendMessage(message);
//   //clear input
//   messageInput.value = "";
// });

// function addUsername(e) {
//   e.preventDefault();
//   if (!usernameInput.value) {
//     return console.log("Must supply a username");
//   }

//   //set the username and create logged in message
//   username = usernameInput.text;
//   sendMessage({ author: username, type: messageTypes.LOGIN });

//   //show chat window and hide login
//   loginWindow.classList.add("hidden");
//   chatWindow.classList.remove("hidden");
// }

// loginBtn.addEventListener("click", addUsername);

// sendMessage = (message) => {
//   socket.emit("message", message);
// };
