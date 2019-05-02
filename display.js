
function displayWorld() {
    var output = "";

    for (var i = 0; i < world.length; i++) {
        output += "<div class='row'>";
        for (var j = 0; j < world[i].length; j++) {
            output += "<div class='";
            switch (world[i][j]) {
                case mapping.POWERUP:
                    output += "powerup";
                    break;

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
    ghosts.forEach(function(gh) {
        switch (gh.status) {
            case ghostStatus.NORMAL:
                document.getElementById(gh.name).style.backgroundImage = "url(img/" + gh.name +".png)";
                break;

                case ghostStatus.VULNERABLE:
                    document.getElementById(gh.name).style.backgroundImage = "url(img/vulnerable.png)";
                break;

                case ghostStatus.DEAD:
                    document.getElementById(gh.name).style.backgroundImage = "url(img/eyes.png)"; 
                break;
        }

        if (isPowerup && remainingPowerupDuration < 5) {
            if (remainingPowerupDuration % 2 == 0) {
                document.getElementById(gh.name).style.filter = "invert(0)";
            }
            else {
                document.getElementById(gh.name).style.filter = "invert(100%)";
            }
        }

        document.getElementById(gh.name).style.top = gh.y * 30 + "px";
        document.getElementById(gh.name).style.left = gh.x * 30 + "px";
    });
}

function displayScore() {
    document.getElementById("score").innerHTML = score;
}