// Node.js Chat Demo Server with WebSocket
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var WebSocketServer = require('websocket').server;
var conn_list = []; // stores all websocket connections
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'content-type': 'text/html',
  		      'content-length': index.length});
  res.end(index); // always return index.html
}).listen(8080, function() {
  console.log('Listening on 8080');
});

var wsServer = new WebSocketServer({
  httpServer: server // associate websocket with http server
});

wsServer.on('request', function(req) {
  var conn = req.accept('chat', req.origin); // accept from all origins
  console.log((new Date()) + ' Peer ' + conn.remoteAddress + ' connected.');
  conn_list.push(conn); // add new connection
  conn.on('message', function(msg) {
    conn_list.forEach(function(c) {
      c.sendUTF(msg.utf8Data); // send incoming data to all connections
    });
  });
  conn.on('close', function(reasonCode, description) {
    conn_list.splice(conn_list.indexOf(conn), 1); // remove closed connection
    console.log((new Date()) + ' Peer ' + conn.remoteAddress + ' disconnected.');
  });
});
