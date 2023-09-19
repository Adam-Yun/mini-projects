///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

const http = require('http'); 
const CONSTANTS = require('./utils/constants.js');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// You may choose to use the constants defined in the file below
const { PORT, CLIENT, SERVER } = CONSTANTS;

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.html' : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
});

///////////////////////////////////////////////
////////////////// WS LOGIC ///////////////////
///////////////////////////////////////////////

// TODO
// Exercise 3: Create the WebSocket Server using the HTTP server
const wsServer = new WebSocket.Server({server})

// TODO
// Exercise 5: Respond to connection events 
  // Exercise 6: Respond to client messages
  // Exercise 7: Send a message back to the client, echoing the message received
  // Exercise 8: Broadcast messages received to all other clients
  wsServer.on('connection',(socket)=> {
    console.log('A new client has connected to the server :)')

    socket.on('message',(data) => {
      console.log('test '+ data);

      const {type, payload} = JSON.parse(data);
      switch(type){
        case CLIENT.MESSAGE.NEW_USER:
          const time = new Date().toLocaleString();
          payload.time = time;
          const dataWithTime = {
            type: SERVER.BROADCAST.NEW_USER_WITH_TIME,
            payload
          }
          
          broadcast(JSON.stringify(dataWithTime))
          break;
        case CLIENT.MESSAGE.NEW_MESSAGE:
          broadcast(data, socket);
          break;
         default:
          break;
      }

      // socket.send('Message Received' + data)
      
    })
  })

///////////////////////////////////////////////
////////////// HELPER FUNCTIONS ///////////////
///////////////////////////////////////////////

function broadcast(data, socketToOmit) {
  // TODO
  // Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!

  wsServer.clients.forEach(connectedSocket => {
    if (connectedSocket.readyState === WebSocket.OPEN && connectedSocket !== socketToOmit) {
      connectedSocket.send(data)
    }
  })

}

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

