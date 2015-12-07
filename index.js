const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const assert = require('assert');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = IS_PRODUCTION ? process.env.PORT : 3000;
assert(!!PORT, 'PORT is truthy');

server.listen(PORT, (error) => {
  if (! error) {
    console.log(`Server live on http://0.0.0.0:${PORT}!`);
  } else {
    console.error(error.stack);
  }
});

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/index.html'));
});

var canvas = '';

io.on('connection', (socket) => {
  socket.emit('canvas', canvas);
  socket.on('canvas', (data) => {
    canvas = data;
    socket.broadcast.emit('canvas', canvas);
  });
});
