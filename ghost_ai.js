
function moveGhosts() {
    // create a mapping of all cells to pacman
    if (!isPowerup) {
        findAllPaths(pacman.x, pacman.y);
    }
    else {
        findAllPaths(ghostHome.x, ghostHome.y)
    }

    ghosts.forEach(function (gh) {
        switch (gh.name) {
            case ghostNames.BLINKY:
                moveGhostTowardsPacman(gh);
                break;

            case ghostNames.INKY:
                moveInky(gh);
                break;

            case ghostNames.CLYDE:
                moveClyde(gh);
                break;
        }
    });

    // pinky must be called last
    //  due to its different behavior the world needs to be remapped
    movePinky(
        ghosts.find(function (gh) {
            return (gh.name == ghostNames.PINKY);
        })
    );
}

// move the given ghost in a random direction
function moveGhostRandom(gh) {
    //var availDirs = availableDirections(gh.x, gh.y);
    var availCells = getOpenAdjacentCells(gh.x, gh.y);
    var rndNum = Math.floor(Math.random() * availCells.length);

    gh.x = availCells[rndNum].x;
    gh.y = availCells[rndNum].y;
}

// move the given ghost towards pacman
function moveGhostTowardsPacman(gh) {
    var idx = findCellInPath(gh.x, gh.y);

    if (idx != null) {
        var nextCell = findCloserAdjacentCell(path[idx].x, path[idx].y, path[idx].d);

        if (nextCell != null) {
            gh.x = nextCell.x;
            gh.y = nextCell.y;
            gh.d = nextCell.d;
        }
    }
}

// clyde sometimes moves towards pacman, sometimes moves randomly
function moveClyde(gh) {
    var rnd = Math.random() * 60;
    var time = Date.now() / 1000;

    // console.log(time % rnd);
    if (time % rnd < 10) {
        moveGhostTowardsPacman(gh);
    }
    else {
        moveGhostRandom(gh);
    }
}

// inky moves towards pacman while far away, moves randomly when close to pacman
function moveInky(gh) {
    var idx = findCellInPath(gh.x, gh.y);

    var nextCell;
    if (path[idx].d > 5) {
        nextCell = findCloserAdjacentCell(path[idx].x, path[idx].y, path[idx].d);
        gh.x = nextCell.x;
        gh.y = nextCell.y;
    }
    else {
        moveGhostRandom(gh);
    }
}

// pinky tries to move to a location in front of pacman if possible
function movePinky(gh) {
    var p_x = pacman.x;
    var p_y = pacman.y;
    var pinkyOffset = 5;
    switch (pacman.currentDirection) {
        case direction.LEFT:
            p_x -= pinkyOffset;
            if (p_x < 0) {
                p_x = 0;
            }
            break;

        case direction.RIGHT:
            p_x += pinkyOffset;
            if (p_x > world[p_y].length) {
                p_x = world[p_y].length - 1;
            }
            break;

        case direction.UP:
            p_y -= pinkyOffset;
            if (p_y < 0) {
                p_y = 0;
            }
            break;

        case direction.DOWN:
            p_y += pinkyOffset;
            if (p_y > world.length) {
                p_y = world.length - 1;
            }
            break;

        default:
            return;
    }

    if (!isPowerup) {
        findPinkyPaths(gh.x, gh.y, p_x, p_y);
    }

    moveGhostTowardsPacman(gh);
}

function findAllPaths(end_x, end_y) {
    path = [];

    // start from end

    // add destination cell
    path.push({
        x: end_x,
        y: end_y,
        d: 0
    });

    // go through every cell in path (path will grow whie traversing)
    for (var i = 0; i < path.length; i++) {
        // console.log("x: " + path[i].x + ", y: " + path[i].y + ", d: " + path[i].d);
        checkNextCells(path[i].x, path[i].y, path[i].d);
    }
}

function findPinkyPaths(start_x, start_y, end_x, end_y) {
    path = [];

    // add destination cell
    path.push({
        x: end_x,
        y: end_y,
        d: 0
    });

    // go through every cell in path (path will grow whie traversing)
    for (var i = 0; i < path.length; i++) {

        // stop once first path is found
        //  (may not be the shortest possible path, but my browser can't handle re-mapping the whole
        //  world again)
        if (path[i].x == start_x && path[i] == start_y) {
            break;
        }
        // console.log("x: " + path[i].x + ", y: " + path[i].y + ", d: " + path[i].d);
        checkNextCells(path[i].x, path[i].y, path[i].d);
    }
}

function checkNextCells(x, y, d) {
    // get array of open cells
    let openCells = getOpenAdjacentCells(x, y);

    // go through array of open cells
    for (var i = 0; i < openCells.length; i++) {
        if (!isCellAlreadyInPath(openCells[i].x, openCells[i].y, d + 1)) {
            path.push({
                x: openCells[i].x,
                y: openCells[i].y,
                d: d + 1
            });
        }
    }
}

function isCellAlreadyInPath(x, y, d) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].x == x && path[i].y == y && path[i].d <= d) {
            return true;
        }
    }
    return false;
}

// check if the 2 cells are the same location
function areCellsEqual(left, right) {
    return (left.x == right.x && left.y == right.y);
}

// find cells adjacent to x, y that are not walls
// @returns an array with all adjacent cells that aren't wall
function getOpenAdjacentCells(x, y) {
    let openCells = [];

    // console.log("x: " + x + ", y: " + y);

    if (y + 1 < world.length && world[y + 1][x] != 2) {   // down
        openCells.push({
            x: x,
            y: (y + 1)
        });
    }

    if (y > 0 && world[y - 1][x] != 2) {   // up
        openCells.push({
            x: x,
            y: (y - 1)
        });
    }

    if (x > 0 && world[y][x - 1] != 2) {   // left
        openCells.push({
            x: (x - 1),
            y: y
        });
    }

    if (x + 1 < world[y].length && world[y][x + 1] != 2) {   // right
        openCells.push({
            x: (x + 1),
            y: y
        });
    }

    return openCells;
}

function findCellInPath(x, y) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].x == x && path[i].y == y) {
            return i;
        }
    }

    return null;
}

// get an array of all the cells on the shortest path (mainly for debugging)
function getPathToTarget(x, y) {
    var shortestPath = [];
    var i = findCellInPath(x, y);
    var dist = path[i].d;

    shortestPath.push({
        x: x,
        y: y,
        d: dist
    })

    console.log("x: " + path[i].x + ", y: " + path[i].y + ", d: " + path[i].d);


    while (dist > 0) {
        i = findCloserAdjacentCell(path[i].x, path[i].y, path[i].d);

        // console.log(path[i]);
        // console.log("i: " + i)
        // console.log("x: " + path[i].x + ", y: " + path[i].y + ", d: " + path[i].d);

        shortestPath.push({
            x: path[i].x,
            y: path[i].y,
            d: path[i].d
        });

        dist = path[i].d;
    }

    return shortestPath;
}

function findCloserAdjacentCell(x, y, d) {
    let adjCells = getOpenAdjacentCells(x, y);

    // console.log(adjCells);

    for (var i = 0; i < path.length; i++) {
        for (var j = 0; j < adjCells.length; j++) {
            if (path[i].x == adjCells[j].x
                && path[i].y == adjCells[j].y
                && path[i].d == d - 1) {
                return path[i];
            }
        }
    }
}

function findFurtherAdjacentCell(x, y, d) {
    let adjCells = getOpenAdjacentCells(x, y);

    for (var i = 0; i < path.length; i++) {
        for (var j = 0; j < adjCells.length; j++) {
            if (path[i].x == adjCells[j].x
                && path[i].y == adjCells[j].y
                && path[i].d == d + 1) {
                return path[i];
            }
        }
    }
}

// simple distance to pacman (ignores walls)
function getDistanceToPacman(x, y) {
    return (Math.abs(pacman.x - x) + Math.abs(pacman.y - y));
}
