var five = require('johnny-five');
var Pi = require("raspi-io");

var board = new five.Board({
  io: new Pi()
});

var socket = require('socket.io-client')
    .connect('http://commandmonkey.azurewebsites.net');
    
//work on a real device
board.on("ready", function() {
    var monkey = new five.Pin("GPIO23");
    var light = new five.Led("GPIO24");
    
    light.on();

    socket.emit('setTarget');
    socket.on('command', function (cmd) {
        monkey.high();
        setTimeout(function () { monkey.low(); }, 2000);
    })
    
    board.on("warn", function(event) {
        //when the process shuts down, turn off the light
        if(event.class === 'Board' || event.message === 'Closing.') {
            monkey.low();
            light.off();
        }
    });
}).start();