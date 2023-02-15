function updateCarPositionNormal() {
    if (carPositionLeft < 0) {
        resetCarPositionNormal();
    }
    carPositionLeft -= 1/3;
    view();
}

function resetCarPositionNormal() {
    carPositionLeft = 93;   
    carPositionTop = 45;
    carHeight=100;
    eventImgSrc = '';
}

function updateCarPositionCastle() {
    if (carPositionTop < 40) {
        resetCarPositionCastle()
    }
    carPositionTop -= 1/4;
    carPositionLeft += 1/14;
    carHeight -= 3/8;
    view();
}

function resetCarPositionCastle() {
    carPositionTop = 87;
    carPositionLeft = 50;
    carHeight = 100;
    eventImgSrc = '';
}

resetCarPositionNormal();
let animationForest = setInterval(updateCarPositionNormal, 36);
//let animationCastle = setInterval(updateCarPositionCastle, 50);