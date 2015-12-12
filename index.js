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


var events = [];
const ioEmit = (eventName) => [
  eventName,
  (eventData) => {
    events.push([eventName, eventData]);
    io.emit(eventName, eventData);
  }
];

io.on('connection', (socket) => {
  socket.emit('init', events);
  socket.on(...ioEmit('mouseup'));
  socket.on(...ioEmit('mousedown'));
  socket.on(...ioEmit('mousemove'));
  socket.on('reset', () => {
    events.length = 0;
    io.emit('reset');
  });
});
