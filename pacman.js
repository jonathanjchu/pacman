var loopTimer = 400;
var loop;

const mapping = {
    0: "empty",
    1: "coin",
    2: "brick",
    3: "cherry",
    4: "warp"
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
        lives: 2
    };

    ghosts = [];

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
    ghosts = [{
        name: "blinky",
        // x: 2,
        // y: 9
        x: 28,
        y: 16
    },
    {
        name: "clyde",
        x: 20,
        y: 10
    },
        // {
        //     name: "blinky",
        //     x: 1,
        //     y: 19
        // }
    ];
    showGhosts();
}

function showGhosts() {
    for (var i = 0; i < ghosts.length; i++) {
        document.getElementById(ghosts[i].name).style.display = "block";
    }
}

function hideGhosts() {
    for (var i = 0; i < ghosts.length; i++) {
        document.getElementById(ghosts[i].name).style.display = "none";
    }
}


// function whichWayToPacman(gh) {
//     var dirsToPac = [];

//     if (pacman.y > gh.y) {
//         dirsToPac.push(direction.DOWN);
//     }
//     else if (pacman.y < gh.y) {
//         dirsToPac.push(direction.UP);
//     }

//     if (pacman.x < gh.x) {
//         dirsToPac.push(direction.LEFT);
//     }
//     else if (pacman.x > gh.x) {
//         dirsToPac.push(direction.RIGHT);
//     }

//     return dirsToPac;
// }

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

    console.log("x: " + x + ", y: " + y);
    console.log("world: " + world[y][x]);

    console.log("direction: " + direction.UP);

    if (world[y - 1][x] != 2) {
        dirs.push(direction.UP);
    }

    console.log("direction: " + direction.DOWN);

    if (world[y + 1][x] != 2) {
        console.log("asdf");
        dirs.push(direction.DOWN);
    }

    console.log("direction: " + direction.LEFT);

    if (world[y][x - 1] != 2) {
        dirs.push(direction.LEFT);
    }

    console.log("direction: " + direction.RIGHT);

    if (world[y][x + 1] != 2) {
        dirs.push(direction.RIGHT);
    }

    return dirs;
}

// check if pacman is touching a ghost
function isPacmanCollideWithGhost() {
    for (var i = 0; i < ghosts.length; i++) {
        if (pacman.y == ghosts[i].y && pacman.x == ghosts[i].x)
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

// keyboard press
document.onkeydown = function (e) {
    // check if game is paused due to pacman death animation
    if (isLifeResetLocked)
        return;

    // collision detection and move pacman if allowed
    if (e.keyCode == 37 &&  // left arrow
        world[pacman.y][pacman.x - 1] != 2) {
        pacman.x--;
        document.getElementById("pacman").style.transform = "rotate(180deg)";
    }
    else if (e.keyCode == 39 && // right arrow
        world[pacman.y][pacman.x + 1] != 2) {
        pacman.x++;
        document.getElementById("pacman").style.transform = "rotate(0deg)";
    }
    else if (e.keyCode == 40 && // down arrow
        world[pacman.y + 1][pacman.x] != 2) {
        pacman.y++;
        document.getElementById("pacman").style.transform = "rotate(90deg)";
    }
    else if (e.keyCode == 38 && // up arrow
        world[pacman.y - 1][pacman.x] != 2) {
        pacman.y--;
        document.getElementById("pacman").style.transform = "rotate(270deg)";
    }

    updatePacman();

}

function gameLoop() {
    if (!isLifeResetLocked) {
        updatePacman();
        updateGhosts();
    }
}

function updateGhosts() {
    moveGhosts();
    displayGhosts();
    displayWorld();

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
    if (world[pacman.y][pacman.x] == 1) {
        world[pacman.y][pacman.x] = 0;
        score += 10;
        displayScore();
    }
    else if (world[pacman.y][pacman.x] == 3) {
        world[pacman.y][pacman.x] = 0;
        score += 50;
        displayScore();
    }

    // redraw
    displayPacman();
    displayWorld();
    displayScore();
}


// draw on initialization
resetGame();



