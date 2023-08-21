const socket = io();

// Global variables
let userName = ""; // Stores the username

// Select the elements using their IDs
const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

socket.on('message', ({ author, content }) => addMessage(author, content))

// Event listener for login form submission
loginForm.addEventListener("submit", function (event) {
  login(event); // Call the login function with the event
});

// Event listener for adding a message
addMessageForm.addEventListener("submit", function (event) {
  sendMessage(event); // Call the sendMessage function with the event
});


function login(event) {
  event.preventDefault();

  // Get the entered username
  const enteredUserName = userNameInput.value;

  // Validate the input
  if (!enteredUserName) {
    alert("Please enter a username.");
    return;
  }

  // Set the global userName variable
  userName = enteredUserName;

  // Hide the login form and show the messages section
  loginForm.classList.remove("show");
  messagesSection.classList.add("show");
}

// Function to handle form submission for sending a message
function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  // Validate the input
  if (!messageContent.length) {
    alert('You have to type something!');
  } 
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content:messageContent })
    messageContentInput.value = '';
  }
}

// Function to add a message to the messages list
function addMessage(author, content) {
  const message = document.createElement("li");
  message.classList.add("message");
  message.classList.add("message--received");

  if (author === userName) {
    message.classList.add("message--self");
  }

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? "You" : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  messagesList.appendChild(message);
}
