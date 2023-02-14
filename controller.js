function streetChange() {
    roadCounter++;
    if (roadCounter == roadImages.length) {
        roadCounter = 0;
    }
    roadSrc = roadImages[roadCounter];
    dialogText = dialogTexts[roadCounter];
    view();
}

function playerResponse(response) {
    switch (response.innerHTML) {
        case 'Vink!':
            coolness += specialEvents[0].wave;
            break;

        case 'Peace!':
            coolness += specialEvents[0].peaceSign;
            break;

        case 'Dab!':
            coolness += specialEvents[0].dab;
            break;
    }
    eventImgSrc = '';
    dialogText = dialogTexts[0];
    view();
}

function handleEncounter() {
    let givenEncounter = specialEvents[0];
    dialogText = givenEncounter.description;
    currentEvent = givenEncounter.description;
    if (givenEncounter.type == 'normal') {
        dialogText += `
        <button onclick="playerResponse(this)">Sett den på!</button>
        <br>
        <button onclick="playerResponse(this)">La den være...</button>`;
    }
    else if (givenEncounter.type == 'friend') {
        dialogText += `<br>
        <button onclick="playerResponse(this)">Vink!</button>
        
        <button onclick="playerResponse(this)">Peace!</button>
        
        <button onclick="playerResponse(this)">Dab!</button>`;
        eventImgSrc = 'img/events/king.jpg';
    }
    view();
}

function setGivenTimeout() {
    let givenInterval = intervals[eventCounter];
    let intervalSum = intervals[0] + intervals[1] + intervals[2];
    setTimeout(handleEncounter, (givenInterval/intervalSum)*10000);
}

function defineIntervals() {
    let num1 = Math.floor(Math.random()*10) + 1;
    let num2 = Math.floor(Math.random()*10) + 1;
    let num3 = Math.floor(Math.random()*10) + 1;

    return[num1, num2, num3];
}

function generateEncounter() {
    let givenEncounter;
    if (streetCounter == 2) {
        givenEncounter = specialEvents[0];
    }
    else {
        let eventIndex = Math.floor(Math.random()*(normalEvents.length+1));
        if (eventIndex == 3) {
            let friendIndex = Math.floor(Math.random()*friendEvents.length);
            givenEncounter = friendEvents[friendIndex];
        }
        else {
            givenEncounter = normalEvents[eventIndex];
        }
    }
    return givenEncounter;
}

setTimeout(handleEncounter, 3000);