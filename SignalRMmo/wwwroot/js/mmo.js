﻿"use strict";
const gameCanvas = new GameCanvas(document.getElementById("gameCanvas"));

let playerId = "";
const speed = 5;
var connection = new signalR.HubConnectionBuilder().withUrl("/mmo").build();

connection.start().then(function () {
    document.getElementById("joinGameButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

connection.on("gameUpdate", function (players) {
    gameCanvas.context.fillStyle = "gray";
    gameCanvas.context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    showPlayers(players);
});

connection.on("playerCreated", function playerCreated(id) { playerId = id; });

function showPlayers(players) {
    var playerSize = 25;
    var self;
    var color = 'cyan';
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.id == playerId) { self = player; }
        drawPlayer(player.position.x, player.position.y, playerSize, color, player.name);
    }
    if (self !== null) {
        drawPlayer(self.position.x, self.position.y, playerSize, 'hotpink', self.name);
    }
}


function startGameLoop() {
    setInterval(sendUpdates, 40);
}

function sendUpdates() {
    move(gameCanvas.getMovement());
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
    connection.invoke("Move", playerId, { x: movement.x * speed, y: movement.y * speed})
        .catch(function (err) {
            alert("Error sending move to server");
        });
}
function drawPlayer(x, y, radius, color, name) {
    gameCanvas.context.fillStyle = color;
    gameCanvas.context.beginPath();
    gameCanvas.context.arc(x, y, radius, 0, 2 * Math.PI);
    gameCanvas.context.fill();
    gameCanvas.context.fillStyle = 'black';
    gameCanvas.context.beginPath();
    gameCanvas.context.arc(x, y, radius, 0, 2 * Math.PI);
    gameCanvas.context.stroke();
    gameCanvas.context.font = '22px serif';
    gameCanvas.context.textAlign = 'center';
    gameCanvas.context.textBaseline = 'middle';
    gameCanvas.context.strokeStyle = '2px white';
    gameCanvas.context.fillText(name, x, y);
}