// Import the library
const server = require('server');
const { get, socket } = server.router;
const { render } = server.reply;


//counter of those connect to chat
const updateCounter = ctx => {
  ctx.io.emit('count', Object.keys(ctx.io.sockets.sockets).length);
};

// Send the new message to everyone
const sendMessage = ctx => {
  ctx.io.emit('message', ctx.data);
};

server([
  // For the initial load render the index.html
  get('/', ctx => render('index.html')),

  // Join/leave the room
  socket('connect', updateCounter),
  socket('disconnect', updateCounter),
  //sendMessage
  socket('message', sendMessage)
]);
