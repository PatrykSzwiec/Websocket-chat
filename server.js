const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

const messages = [];

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  // Send the 'index.html' file from the 'client/build' directory
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message and disconnect events \n');

});