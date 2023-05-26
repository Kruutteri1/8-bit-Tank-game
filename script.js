let bullets = [];

const obstacles = document.querySelectorAll('.obstacle2');
const obstaclesWater = document.querySelectorAll('.water');
const breakableObstacles = document.querySelectorAll('.breakable');

let oldLeft;
let oldTop;

let oldLeft2;
let oldTop2;

let canShot = true;
let canShot2 = true;


let lives = 3;
let secondLives = 3;

const tank = document.getElementById("tank");
const tank2 = document.getElementById("tankSecond");

document.addEventListener("keydown", function(event) {
    const tankTop = parseInt(window.getComputedStyle(tank).getPropertyValue("top"));
    const tankLeft = parseInt(window.getComputedStyle(tank).getPropertyValue("left"));

    const tankSecondTop = parseInt(window.getComputedStyle(tank2).getPropertyValue("top"));
    const tankSecondLeft = parseInt(window.getComputedStyle(tank2).getPropertyValue("left"));

    const key = event.code; // Get the key value

    // Move first tank
    if (key === "KeyA" && tankLeft > 0) {
        oldLeft = tankLeft;
        oldTop = tankTop;
        tank.style.left = tankLeft - 40 + "px";
        tank.style.transform = "rotate(270deg)";

    }
    else if (key === "KeyW" && tankTop > 0) {
        oldLeft = tankLeft;
        oldTop = tankTop;
        tank.style.top = tankTop - 40 + "px";
        tank.style.transform = "rotate(0deg)";

    }
    else if (key === "KeyD" && tankLeft < 480) {
        tank.style.left = tankLeft + 40 + "px";
        tank.style.transform = "rotate(90deg)";
        oldLeft = tankLeft;
        oldTop = tankTop;

    }
    else if (key === "KeyS" && tankTop < 480) {
        tank.style.top = tankTop + 40 + "px";
        tank.style.transform = "rotate(180deg)";
        oldLeft = tankLeft;
        oldTop = tankTop;

    }
    else if (key === "Space") {
        fireBullet(tankTop, tankLeft, tank.style.transform);
    }

    // Move second tank
    if (key === "ArrowLeft" && tankSecondLeft > 0) {
        oldLeft2 = tankSecondLeft;
        oldTop2 = tankSecondTop;
        tank2.style.left = tankSecondLeft - 40 + "px";
        tank2.style.transform = "rotate(270deg)";

    }
    else if (key === "ArrowUp" && tankSecondTop > 0) {
        oldLeft2 = tankSecondLeft;
        oldTop2 = tankSecondTop;
        tank2.style.top = tankSecondTop - 40 + "px";
        tank2.style.transform = "rotate(0deg)";

    }
    else if (key === "ArrowRight" && tankSecondLeft < 480) {
        tank2.style.left = tankSecondLeft + 40 + "px";
        tank2.style.transform = "rotate(90deg)";
        oldLeft2 = tankSecondLeft;
        oldTop2 = tankSecondTop;

    }
    else if (key === "ArrowDown" && tankSecondTop < 480) {
        tank2.style.top = tankSecondTop + 40 + "px";
        tank2.style.transform = "rotate(180deg)";
        oldLeft2 = tankSecondLeft;
        oldTop2 = tankSecondTop;

    }
    else if (key === "ControlRight") {
        fireBullet2(tankSecondTop, tankSecondLeft, tank2.style.transform);
    }

    // Check collision for the first tank
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (collision(tank, obstacle)) {
            // If the tank is on an obstacle, cancel its movement
            tank.style.left = oldLeft + 'px';
            tank.style.top = oldTop + 'px';
            return;
        }
    }

    // Check collision for the second tank
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (collision(tank2, obstacle)) {
            // If the tank is on an obstacle, cancel its movement
            tank2.style.left = oldLeft2 + 'px';
            tank2.style.top = oldTop2 + 'px';
            return;
        }
    }

});

function fireBullet(tankTop, tankLeft, tankRotation) {
    if (!canShot) {
        return;
    }

    canShot = false;

    const bullet = document.createElement("div");
    let bulletLeft;
    let bulletTop;

    if (tankRotation === "rotate(0deg)") {
        bullet.classList.add("bulletTop");
        bulletTop = tankTop - 15;
        bulletLeft = tankLeft + 17;
    } else if (tankRotation === "rotate(90deg)") {
        bullet.classList.add("bulletLeft");
        bulletTop = tankTop + 18;
        bulletLeft = tankLeft + 33;
    } else if (tankRotation === "rotate(180deg)") {
        bullet.classList.add("bulletTop");
        bulletTop = tankTop + 25;
        bulletLeft = tankLeft + 18;
    } else if (tankRotation === "rotate(270deg)") {
        bullet.classList.add("bulletLeft");
        bulletTop = tankTop + 18;
        bulletLeft = tankLeft - 15;
    }

    bullet.style.top = bulletTop + "px";
    bullet.style.left = bulletLeft + "px";
    document.getElementById("gameContainer").appendChild(bullet);
    bullets.push(bullet);

    const bulletInterval = setInterval(function () {
        shotEnemy(bullet, tank2);
        checkCollision(bullet, bullets);

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];

            if (collision(bullet, obstacle)) {
                let isWaterObstacle = false;

                for (let j = 0; j < obstaclesWater.length; j++) {
                    const water = obstaclesWater[j];

                    if (collision(bullet, water)) {
                        isWaterObstacle = true;
                        break;
                    }
                }

                if (isWaterObstacle) {
                    continue; // Ignore collision with water obstacles
                }

                bullet.remove();
                clearInterval(bulletInterval);
                const index = bullets.indexOf(bullet);

                if (index > -1) {
                    bullets.splice(index, 1);
                }

                return;
            }
        }

        if (tankRotation === "rotate(0deg)") {
            bulletTop -= 5;
            bullet.style.top = bulletTop + "px";
        } else if (tankRotation === "rotate(90deg)") {
            bulletLeft += 5;
            bullet.style.left = bulletLeft + "px";
        } else if (tankRotation === "rotate(180deg)") {
            bulletTop += 5;
            bullet.style.top = bulletTop + "px";
        } else if (tankRotation === "rotate(270deg)") {
            bulletLeft -= 5;
            bullet.style.left = bulletLeft + "px";
        }

        if (bulletTop < 0 || bulletTop > 520 || bulletLeft < 0 || bulletLeft > 520) {
            bullet.remove();
            clearInterval(bulletInterval);
            const index = bullets.indexOf(bullet);
            if (index > -1) {
                bullets.splice(index, 1);
            }
        }
    }, 10);

    // Delay between shots
    setTimeout(() => {
        canShot = true;
    }, 500);
}

function fireBullet2(tankTop, tankLeft, tankRotation) {
    if (!canShot2) {
        return;
    }

    canShot2 = false;

    const bullet2 = document.createElement("div");
    let bulletLeft;
    let bulletTop;

    if (tankRotation === "rotate(0deg)") {
        bullet2.classList.add("bulletTop");
        bulletTop = tankTop - 15;
        bulletLeft = tankLeft + 17;
    } else if (tankRotation === "rotate(90deg)") {
        bullet2.classList.add("bulletLeft");
        bulletTop = tankTop + 18;
        bulletLeft = tankLeft + 33;
    } else if (tankRotation === "rotate(180deg)") {
        bullet2.classList.add("bulletTop");
        bulletTop = tankTop + 25;
        bulletLeft = tankLeft + 18;
    } else if (tankRotation === "rotate(270deg)") {
        bullet2.classList.add("bulletLeft");
        bulletTop = tankTop + 18;
        bulletLeft = tankLeft - 15;
    }

    bullet2.style.top = bulletTop + "px";
    bullet2.style.left = bulletLeft + "px";
    document.getElementById("gameContainer").appendChild(bullet2);
    bullets.push(bullet2);

    const bulletInterval = setInterval(function () {
        shotEnemy(bullet2, tank);
        checkCollision(bullet2, bullets);

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];

            if (collision(bullet2, obstacle)) {
                let isWaterObstacle = false;

                for (let j = 0; j < obstaclesWater.length; j++) {
                    const water = obstaclesWater[j];

                    if (collision(bullet2, water)) {
                        isWaterObstacle = true;
                        break;
                    }
                }

                if (isWaterObstacle) {
                    continue; // Ignore collision with water obstacles
                }

                bullet2.remove();
                clearInterval(bulletInterval);
                const index = bullets.indexOf(bullet2);

                if (index > -1) {
                    bullets.splice(index, 1);
                }

                return;
            }
        }

        if (tankRotation === "rotate(0deg)") {
            bulletTop -= 5;
            bullet2.style.top = bulletTop + "px";
        } else if (tankRotation === "rotate(90deg)") {
            bulletLeft += 5;
            bullet2.style.left = bulletLeft + "px";
        } else if (tankRotation === "rotate(180deg)") {
            bulletTop += 5;
            bullet2.style.top = bulletTop + "px";
        } else if (tankRotation === "rotate(270deg)") {
            bulletLeft -= 5;
            bullet2.style.left = bulletLeft + "px";
        }

        if (bulletTop < 0 || bulletTop > 520 || bulletLeft < 0 || bulletLeft > 520) {
            bullet2.remove();
            clearInterval(bulletInterval);
            const index = bullets.indexOf(bullet2);
            if (index > -1) {
                bullets.splice(index, 1);
            }
        }
    }, 10);

    // Delay between shots
    setTimeout(() => {
        canShot2 = true;
    }, 500);
}

function restartGame() {
    location.reload();
}

function shotEnemy(bullet, enemy) {
    if (collision(bullet, enemy)) {
        bullet.remove();
        const bulletIndex = bullets.indexOf(bullet);
        if (bulletIndex > -1) {
            bullets.splice(bulletIndex, 1);
        }

        if (enemy === tank) {
            lives -= 1;
            if (lives === 0) {
                tank.remove();
            } else {
                tank.style.top = 480 + "px";
                tank.style.left = 160 + "px";
            }
            //replace image
            const hearts = document.querySelectorAll("#sidebar .heart");
            if (hearts.length > lives) {
                hearts[lives].classList.remove("heart");
                hearts[lives].classList.add("heatHeart");
            }
        } else {
            secondLives -= 1;
            if (secondLives === 0) {
                tank2.remove();
            } else {
                tank2.style.top = 0 + "px";
                tank2.style.left = 320 + "px";
            }
            // replace image
            const hearts = document.querySelectorAll("#sidebarSecond .heart");
            if (hearts.length > secondLives) {
                hearts[secondLives].classList.remove("heart");
                hearts[secondLives].classList.add("heatHeart");
            }
        }

        if (enemy === tank2 && secondLives === 0) {
            setTimeout(function() {
                alert("Player 1 won!");
                restartGame(); // reload page
            }, 1000);
        } else if (enemy === tank && lives === 0) {
            setTimeout(function() {
                alert("Player 2 won!");
                restartGame(); // reload page
            }, 1000);
        }

    }
}

function checkCollision(bullet, bulletsArray) {
    for (let i = 0; i < bulletsArray.length; i++) {
        const currBullet = bulletsArray[i];

        // Check collision between bullet and breakable obstacles
        for (let j = 0; j < breakableObstacles.length; j++) {
            const obstacle = breakableObstacles[j];
            if (collision(currBullet, obstacle)) {
                // Delete bullet
                currBullet.remove();
                bulletsArray.splice(i, 1);

                // Delete obstacle
                obstacle.remove();
                breakableObstacles.splice(j, 1);
                break;
            }
        }
    }
}

function collision(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(
        aRect.bottom <= bRect.top ||
        aRect.top >= bRect.bottom ||
        aRect.right <= bRect.left ||
        aRect.left >= bRect.right
    );
}