var loopTimer = 400;
var pacmanTimer = 300;
var loop;

const mapping = {
    0: "empty",
    1: "coin",
    2: "brick",
    3: "cherry",
    6: "warp"
};

const direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

var world, pacman, ghosts;
var score = 0;

var isLifeResetLocked = false;
var isPowerup = false;
var path = [];

function resetGame() {
    world = [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 0, 1, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2],
        [2, 1, 1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 1, 2],
        [2, 1, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 2, 1, 1, 2, 3, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2],
        [2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 3, 1, 1, 1, 1, 3, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2, 1, 2, 2, 3, 2, 2, 2, 2, 2, 3, 2],
        [2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 3, 2, 2, 2, 0, 2, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2],
        [2, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 3, 2, 0, 0, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2],
        [2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2],
        [2, 1, 1, 3, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2],
        [2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 3, 1, 1, 2, 1, 1, 1, 3, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2],
        [2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 3, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2],
        [2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2],
        [2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 3, 1, 1, 2],
        [2, 1, 2, 1, 1, 1, 1, 3, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2],
        [2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2],
        [2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 3, 2, 2, 1, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ];

    pacman = {
        x: 1,
        y: 1,
        lives: 2,
        currentDirection: direction.LEFT
    };

    score = 0;

    document.getElementById("gameover").style.display = "none";
    document.getElementById("death").style.display = "none";

    resetPacmanPostion();
    resetGhostPosition();

    document.getElementById("lives").innerHTML = pacman.lives;

    displayWorld();
    displayPacman();
    displayGhosts();
    displayScore();

    loop = setInterval(gameLoop, loopTimer);

    isLifeResetLocked = false;
}

function gameOver() {
    document.getElementById("gameover").style.display = "block";
}

function resetPacmanPostion() {
    pacman.x = 1;
    pacman.y = 1;
    document.getElementById("pacman").style.transform = "rotate(0deg)";
    document.getElementById("pacman").style.display = "block";
}

function resetGhostPosition() {
    ghosts = {
        blinky: {
            // x: 2,
            // y: 9
            x: 28,
            y: 16,
            // x: 20,
            // y: 10,
            d: -1
        },
        clyde: {
            x: 20,
            y: 10,
            d: -1
        },
        inky:
        {
            x: 1,
            y: 19,
            d: -1
        },
        pinky:
        {
            // x: 5,
            // y: 5,
            x: 20,
            y: 11,
            d: -1
        }
    };

    showGhosts();
}

function showGhosts() {
    var ghostNames = Object.keys(ghosts);
    for (var i = 0; i < ghostNames.length; i++) {
        document.getElementById(ghostNames[i]).style.display = "block";
    }
}

function hideGhosts() {
    var ghostNames = Object.keys(ghosts);
    for (var i = 0; i < ghostNames.length; i++) {
        document.getElementById(ghostNames[i]).style.display = "none";
    }
}

// checks if it is possible to move in direction dir from
//  position x, y
function canMoveDirection(x, y, dir) {
    if (dir == direction.UP && world[y - 1][x] != 2) {
        return true;
    }
    else if (dir == direction.DOWN && world[y + 1][x] != 2) {
        return true;
    }
    else if (dir == direction.LEFT && world[y][x - 1] != 2) {
        return true;
    }
    else if (dir == direction.RIGHT && world[y][x + 1] != 2) {
        return true;
    }
    else {
        return false;
    }
}

// return array of possible directions that a unit can move from
//  the given x, y coordinates
function availableDirections(x, y) {
    let dirs = [];

    // console.log("x: " + x + ", y: " + y);
    // console.log("world: " + world[y][x]);

    if (world[y - 1][x] != 2) {
        dirs.push(direction.UP);
    }

    if (world[y + 1][x] != 2) {
        console.log("asdf");
        dirs.push(direction.DOWN);
    }

    if (world[y][x - 1] != 2) {
        dirs.push(direction.LEFT);
    }

    if (world[y][x + 1] != 2) {
        dirs.push(direction.RIGHT);
    }

    return dirs;
}

// check if pacman is touching a ghost
function isPacmanCollideWithGhost() {
    var ghostCoords = Object.values(ghosts);
    for (var i = 0; i < ghostCoords.length; i++) {
        if (pacman.y == ghostCoords[i].y && pacman.x == ghostCoords[i].x)
            return true;
    }
    return false;
}

function loseLife() {
    // hide ghost and pacman
    hideGhosts();

    document.getElementById("pacman").style.display = "none";

    // display death animation
    document.getElementById("death").style.top = pacman.y * 30 + "px";
    document.getElementById("death").style.left = pacman.x * 30 + "px";
    document.getElementById("death").style.display = "block";

    // lock game movement
    isLifeResetLocked = true;
    clearInterval(loop);

    setTimeout(function () {
        // handle aftermath of pacman's death
        pacman.lives--;

        if (pacman.lives < 0) {
            gameOver();
        }
        else {
            // hide death animation
            document.getElementById("death").style.display = "none";

            document.getElementById("lives").innerHTML = pacman.lives;

            // display pacman and ghost
            resetPacmanPostion();
            resetGhostPosition();

            displayPacman();
            displayGhosts();

            loop = setInterval(gameLoop, loopTimer);
        }

        isLifeResetLocked = false;
    }, 800);
}

// // keyboard press
// document.onkeydown = function (e) {
//     // movePacman(e);
// }

function movePacman(dir) {
    // check if game is paused due to pacman death animation
    if (isLifeResetLocked)
        return;

    // collision detection and move pacman if allowed
    if (dir == direction.LEFT &&  // left arrow
        world[pacman.y][pacman.x - 1] != 2) {
        pacman.x--;
        document.getElementById("pacman").style.transform = "rotate(180deg)";
        pacman.currentDirection = direction.LEFT;
    }
    else if (dir == direction.RIGHT && // right arrow
        world[pacman.y][pacman.x + 1] != 2) {
        pacman.x++;
        document.getElementById("pacman").style.transform = "rotate(0deg)";
        pacman.currentDirection = direction.RIGHT;
    }
    else if (dir == direction.DOWN && // down arrow
        world[pacman.y + 1][pacman.x] != 2) {
        pacman.y++;
        document.getElementById("pacman").style.transform = "rotate(90deg)";
        pacman.currentDirection = direction.DOWN;
    }
    else if (dir == direction.UP && // up arrow
        world[pacman.y - 1][pacman.x] != 2) {
        pacman.y--;
        document.getElementById("pacman").style.transform = "rotate(270deg)";
        pacman.currentDirection = direction.UP;
    }

    updatePacman();
}

function gameLoop() {
    if (!isLifeResetLocked) {
        // kd.tick();
        updatePacman();
        updateGhosts();
    }
}

function updateGhosts() {
    moveGhosts();
    displayGhosts();

    // check ghost collision again (in case pacman is trying to swap positions)
    if (isPacmanCollideWithGhost()) {
        loseLife();
    }
}

function updatePacman() {
    // check ghost collision again (in case pacman is trying to swap positions)
    if (isPacmanCollideWithGhost()) {
        loseLife();
    }

    // update score
    if (world[pacman.y][pacman.x] == 1) {   // regular dot
        world[pacman.y][pacman.x] = 0;
        score += 10;
    }
    else if (world[pacman.y][pacman.x] == 3) {  // cherry
        world[pacman.y][pacman.x] = 0;
        score += 50;
    }

    // redraw
    displayPacman();
    displayWorld();
    displayScore();
}


// draw on initialization
resetGame();


// pacman movement timer (calls keydrown)
setInterval(function() {
    kd.tick();
}, pacmanTimer);

// kd.run(function() { kd.tick(); });

// keydrown event handlers
// kd.RIGHT.down(movePacman(direction.RIGHT));
kd.RIGHT.down(function() { movePacman(direction.RIGHT); });
kd.LEFT.down(function() { movePacman(direction.LEFT); });
kd.UP.down(function() { movePacman(direction.UP); });
kd.DOWN.down(function() { movePacman(direction.DOWN); });