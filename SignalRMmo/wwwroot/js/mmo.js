"use strict";

/// VARIABLES //////////////////////////////
const domCanvas = document.getElementById("gameCanvas");
const domErrorDiv = document.getElementById("errorDiv");
const gameCanvas = new GameCanvas(domCanvas);

let playerId = "";
let playerPosition = undefined;
const speed = 7;
var connection = new signalR.HubConnectionBuilder().withUrl("/mmo").build();

/// CONNECTION RELATED  //////////////////////////////

connection.start().then(function () {
    connection.invoke("Subscribe")
        .catch(function (err) { writeError("Error subscribing to game updates"); });
    var playerNameInput = document.getElementById("playerName");
    playerNameInput.addEventListener("input", _ => {
            document.getElementById("joinGameButton").disabled = playerNameInput.value.length <= 0;
    });
}).catch(function (err) {
    writeError(err.toString());
});


connection.on("gameUpdate", function (players) {
    gameCanvas.context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawPlayers(players);
});

connection.on("playerCreated", function playerCreated(id) { playerId = id; });

////    METHODS     ////////////////////////////////

function joinGame() {
    var textBox = document.getElementById("playerName");
    connection.invoke("Join", textBox.value)
        .then(() => startGameLoop())
        .catch(function (err) {writeError("Error joining game for '" + textBox.value + "': " + err);});
    document.getElementById("joinControls").style.display = "none";
}

function move(movement) {
    if (movement.x == 0 && movement.y == 0) { return; }
    connection.invoke("Move", playerId, { x: Math.round(movement.x * speed), y: Math.round(movement.y * speed) })
        .catch(function (err) { writeError("Error sending move (" + movement.x + "," + movement.y + ") to server. Error was: " + err.message);});
}

function startGameLoop() {
    setInterval(sendUpdates, 40);
}

function sendUpdates() {
    var movement;
    var mousePosition = gameCanvas.mousePosition;
    //if the mouse button is currently pressed at a specified location
    //and we have a position for the player, we calculate which direction to move
    if (gameCanvas.mouseButtonDown
        && mousePosition !== undefined
        && playerPosition !== undefined) {
        var directionTowardsMouse = gameCanvas.getDirectionTowardsMouse(playerPosition);
        movement = degreesToMovement(directionTowardsMouse);
        if (getDistance(mousePosition, playerPosition) < speed) {
            movement = { x: (mousePosition.x - playerPosition.x)/speed, y: (mousePosition.y - playerPosition.y)/speed };
        }
    }
    //else we determine movement by listening to the keyboard state
    else { movement = gameCanvas.getKeyboardMovement(); }

    move(movement);
}

function degreesToMovement(degrees) {
    let xMove = Math.cos(degrees);
    let yMove = Math.sin(degrees);
    let move = { x: xMove, y: yMove };
    return move;
}

////   DRAWING     //////////////////////////
function drawPlayers(players) {
    var playerSize = 25;
    var self;
    var color = 'silver';
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.id == playerId) {
            self = player;
            playerPosition = player.position;
        }
        drawPlayer(player.position.x, player.position.y, playerSize, color, player.name);
    }
    if (self !== null) {
        drawPlayer(self.position.x, self.position.y, playerSize, 'hotpink', self.name);
    }
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

function getDistance(point1, point2) {
    let distX = point1.x - point2.x;
    let distY = point1.y - point2.y;

    return Math.sqrt(distX * distX + distY * distY);
}

function writeError(message) {
    domErrorDiv.innerHTML = message;
}


// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == domCanvas) {
        e.preventDefault();
    }
}, { passive: false });
document.body.addEventListener("touchend", function (e) {
    if (e.target == domCanvas) {
        e.preventDefault();
    }
}, { passive: false });
document.body.addEventListener("touchmove", function (e) {
    if (e.target == domCanvas) {
        e.preventDefault();
    }
}, { passive: false });