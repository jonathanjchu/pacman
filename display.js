
function displayWorld() {
    var output = "";

    for (var i = 0; i < world.length; i++) {
        output += "<div class='row'>";
        for (var j = 0; j < world[i].length; j++) {
            switch (world[i][j]) {
                case 3:
                    output += "<div class='cherry'></div>";
                    break;

                case 2:
                    output += "<div class='brick'></div>";
                    break;

                case 1:
                    output += "<div class='coin' x='" + j + "' y='" + i + "'></div>";
                    break;

                default:
                    output += "<div class='empty'></div>";
            }

        }

        output += "</div>";
    }

    // console.log(output);
    document.getElementById("world").innerHTML = output;
}

function displayPacman() {
    document.getElementById("pacman").style.top = pacman.y * 30 + "px";
    document.getElementById("pacman").style.left = pacman.x * 30 + "px";
}

function displayGhosts() {
    for (var i = 0; i < ghosts.length; i++) {
        document.getElementById(ghosts[i].name).style.top = ghosts[i].y * 30 + "px";
        document.getElementById(ghosts[i].name).style.left = ghosts[i].x * 30 + "px";
    }
}

function displayScore() {
    document.getElementById("score").innerHTML = score;
}