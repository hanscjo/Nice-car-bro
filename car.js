function updateCarPositionNormal() {
    if (carPositionLeft < 0) {
        resetCarPositionNormal();
    }
    carPositionLeft -= 1/3;
    view();
}

function resetCarPositionNormal() {
    carPositionLeft = 93;   
}

let animation = setInterval(updateCarPositionNormal, 36);