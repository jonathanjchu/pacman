
function displayWorld() {
    var output = "";

    for (var i = 0; i < world.length; i++) {
        output += "<div class='row'>";
        for (var j = 0; j < world[i].length; j++) {
            output += "<div class='";
            switch (world[i][j]) {
                case 3:
                    output += "cherry";
                    break;

                case 2:
                    output += "brick";
                    break;

                case 1:
                    output += "coin";
                    break;

                default:
                    output += "empty";
            }

            output += "' x='" + j + "' y='" + i + "'></div>";

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