const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

const messages = [];
const users = [];

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  // Send the 'index.html' file from the 'client/build' directory
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('user-login', (username) => {
    // Add user to the users array
    users.push({ name: username, id: socket.id });
    console.log(`User ${username} logged in with id ${socket.id}`);
    io.emit('users-updated', users);

    // Notify the newly joined user that they have joined
    const joinMessage = `Welcome, ${username}! You have joined the conversation.`;
    const chatBotMessage = { author: 'Chat Bot', content: joinMessage, system: true };
    socket.emit('message', chatBotMessage); // Emit the message to the newly joined user

    // Notify other clients that a user has joined
    const generalJoinMessage = `${username} has joined the conversation.`;
    const generalChatBotMessage = { author: 'Chat Bot', content: generalJoinMessage, system: true };
    socket.broadcast.emit('message', generalChatBotMessage); // Emit the message to other users
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
  // Remove user from the users array
  const disconnectedUser = users.find(user => user.id === socket.id);
    if (disconnectedUser) {
      users.splice(users.indexOf(disconnectedUser), 1);
      console.log(`User ${disconnectedUser.name} with id ${socket.id} has left`);
      io.emit('users-updated', users); // Send updated user list to all clients

      // Notify other clients that a user has left
      const leaveMessage = `${disconnectedUser.name} has left the conversation... :(`;
      const chatBotMessage = { author: 'Chat Bot', content: leaveMessage, system: true };
      io.emit('message', chatBotMessage);
    }
  });

});