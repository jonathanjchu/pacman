
function moveGhosts() {
    for (var i = 0; i < ghosts.length; i++) {
        switch (ghosts[i].name) {
            case "blinky":
                moveGhostTowardsPacman(ghosts[i]);
                break;

            case "clyde":
                
                moveGhostRandom(ghosts[i]);
                //moveGhostTowardsPacman(ghosts[i]);
                break;

            case "inky":
                break;

            case "pinky":
                break;
        }
    }

}

// move the given ghost in the given direction
// function moveGhost(gh, dir) {
//     switch (dir) {
//         case direction.UP:
//             gh.y--;
//             break;

//         case direction.DOWN:
//             gh.y++;
//             break;

//         case direction.LEFT:
//             gh.x--;
//             break;

//         case direction.RIGHT:
//             gh.x++;
//             break;

//         default:
//             console.log("unknown direction " + dir);
//     }
// }

// move the given ghost in a random direction
function moveGhostRandom(gh) {
    //var availDirs = availableDirections(gh.x, gh.y);
    var availCells = getOpenAdjacentCells(gh.x, gh.y);
    var rndNum = Math.floor(Math.random() * availCells.length);

    gh.x = availCells[rndNum].x;
    gh.y = availCells[rndNum].y;

    //moveGhost(gh, availDirs[ranDir]);
}

// move the given ghost towards pacman
function moveGhostTowardsPacman(gh) {
    findAllPaths(gh.x, gh.y, pacman.x, pacman.y);
    
    var idx = findCellInPath(gh.x, gh.y);

    var nextCell = findAdjacentCellThatsCloser(path[idx].x, path[idx].y, path[idx].d);

    gh.x = nextCell.x;
    gh.y = nextCell.y;
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
        //console.log(path);
        // console.log("x: " + path[i].x + ", y: " + path[i].y + ", d: " + path[i].d);

        // if (path[i].x == start_x && path[i] == start_y) {
        //     break;
        // }

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

    if (world[y + 1][x] != 2) {   // down
        openCells.push({
            x: x,
            y: (y + 1)
        });
    }

    if (world[y - 1][x] != 2) {   // up
        openCells.push({
            x: x,
            y: (y - 1)
        });
    }

    if (world[y][x - 1] != 2) {   // left
        openCells.push({
            x: (x - 1),
            y: y
        });
    }

    if (world[y][x + 1] != 2) {   // right
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
        i = findAdjacentCellThatsCloser(path[i].x, path[i].y, path[i].d);

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

function findAdjacentCellThatsCloser(x, y, d) {
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

// simple distance to pacman (ignores walls)
function getDistanceToPacman(x, y) {
    return (Math.abs(pacman.x - x) + Math.abs(pacman.y - y));
}