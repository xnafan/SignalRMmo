"use strict";
let gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
gameCanvas.addEventListener("keydown", keyDown);
gameCanvas.addEventListener("keyup", keyUp);

let playerId = "";
let speed = 5;
var connection = new signalR.HubConnectionBuilder().withUrl("/mmo").build();
var keyboardStatus = { up: false, down: false, left: false, right: false };

connection.on("gameUpdate", function (players) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    showPlayers(players);
});

connection.on("playerCreated", function playerCreated(id) { playerId = id; });

function showPlayers(players) {
    var playerSize = 25;
    var self;
    var color = 'yellow';
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.id == playerId) { self = player; }
        fillCircle(player.position.x, player.position.y, playerSize, color, player.name);
    }
    if (self !== null) {
        fillCircle(self.position.x, self.position.y, playerSize, 'red', self.name);
    }
}

connection.start().then(function () {
    document.getElementById("joinGameButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

function startGameLoop() {
    setInterval(sendUpdates, 40);
}

function sendUpdates() {
    move(getMovement());
}

function joinGame() {
    var textBox = document.getElementById("playerName");
    connection.invoke("Join", textBox.value)
        .then(() => startGameLoop())
        .catch(function (err) {
        alert("Error joining game for '" + textBox.value + "': " + err);
    });
    document.getElementById("joinControls").style.display = "none";
}

function move(movement) {
    if (movement.x == 0 && movement.y == 0) { return;}
    connection.invoke("Move", playerId, { x: movement.x, y: movement.y })
        .catch(function (err) {
            alert("Error sending move to server");
        });
}
function fillCircle(x, y, radius, color, name) {

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '2px white';
    //ctx.strokeText(name, x, y);
    ctx.fillStyle = 'black';
    ctx.fillText(name, x, y);
}

function keyDown(event) {
    switch (event.code) {
        case 'ArrowLeft': keyboardStatus.left=true; break;
        case 'ArrowRight': keyboardStatus.right = true;break;
        case 'ArrowUp': keyboardStatus.up = true;break;
        case 'ArrowDown': keyboardStatus.down= true;break;
    }
}

function keyUp(event) {
    switch (event.code) {
        case 'ArrowLeft': keyboardStatus.left = false; break;
        case 'ArrowRight': keyboardStatus.right = false; break;
        case 'ArrowUp': keyboardStatus.up = false; break;
        case 'ArrowDown': keyboardStatus.down = false; break;
    }
}

function getMovement() {
    var deltaX = 0;
    deltaX += keyboardStatus.left ? -speed : 0;
    deltaX += keyboardStatus.right ? speed : 0;
    var deltaY = 0;
    deltaY += keyboardStatus.up ? -speed : 0;
    deltaY += keyboardStatus.down ? speed : 0;
    return { x: deltaX, y: deltaY };
}

