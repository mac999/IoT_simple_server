// Title: Simple IoT server
// Developer: Taewook, Kang
// Date: 2021.6.29
// Email: laputa99999@gmail.com

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var five = require('johnny-five');	// nw.require('nwjs-j5-fix').fix();
var SerialPort = require("serialport");

var clients = [];

io.on('connection', function(socket){
 clients.push(socket.id);
 var clientConnectedMsg = 'User connected ' + util.inspect(socket.id) + ', total: ' + clients.length;
 console.log(clientConnectedMsg);
socket.on('disconnect', function(){
  clients.pop(socket.id);
  var clientDisconnectedMsg = 'User disconnected ' + util.inspect(socket.id) + ', total: ' + clients.length;
  console.log(clientDisconnectedMsg);
 })
});

var sensorValue = 0;
var board = new five.Board();

board.on('ready', function () {
  var sensor = new five.Sensor("A0");
  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  sensor.on("change", function() {
    sensorValue = this.scaleTo(0, 1000);
    // console.log(sensorValue);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
function sendWind() {
 console.log('Wind sent to user: ' + sensorValue);
 io.emit('new wind', sensorValue); // getRandomInRange(0, 360));
}
setInterval(sendWind, 3000);