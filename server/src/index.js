const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });


const app = express();
const port = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());

const routesPath = path.join(__dirname, '../routes');
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    app.use('/api', route);
  }
});

app.use(express.static(path.join(__dirname, '..', 'public', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dist', 'index.html'));
});

// Start the server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
