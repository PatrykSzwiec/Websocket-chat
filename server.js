const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000; // Use the provided PORT environment variable or default to 8000


const messages = [];

// Serve static files from the 'client/build' directory
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  // Send the 'index.html' file from the 'client/build' directory
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});