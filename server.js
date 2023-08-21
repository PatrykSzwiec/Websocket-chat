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
  }
  });

});