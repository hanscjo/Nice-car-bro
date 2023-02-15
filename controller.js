function streetChange() { //Blir en slags overordnet nullstillingsfunksjon
    roadCounter++;
    eventCounter = 0;
    if (roadCounter == roadImages.length) { //Dersom man bytter fra Karl Johan
        roadCounter = 0;
        intervals = defineIntervals();
        clearInterval(animation);
        resetCarPositionNormal();
        animation = setInterval(updateCarPositionNormal, 36);
        setGivenTimeout(); //Repetisjon av main.js. Det kunne nok blitt bakt inn i en funksjon. Det er viktig med en omstilling her siden Karl Johan er spesielt definert mtp encounters
    }
    else if (roadCounter == 2) { //Bytte til Karl Johan
        clearInterval(animation);
        resetCarPositionCastle();
        animation = setInterval(updateCarPositionCastle, 50);
        setTimeout(handleEncounter, 5000); //Egen måte å håndtere events på
    }
    else { //Alle andre gater
        clearInterval(animation);
        resetCarPositionNormal();
        animation = setInterval(updateCarPositionNormal, 36);
    }
    roadSrc = roadImages[roadCounter];
    dialogText = dialogTexts[roadCounter];
    view();
    //Kall denne funksjonen dersom tredje event skjer, antatt at tredje event alltid skjer etter 10 sekunder.
}

function playerResponse(response) {
    let currentRoad;
    switch (roadCounter) {
        case 0:
            currentRoad = 'coolnessForest';
            break;

        case 1:
            currentRoad = 'coolnessBridge';
            break;    
        
        case 2:
            currentRoad = 'coolnessCastle';
            break;
    }

    switch (response) {
        case 'putOn':
            coolness += normalEvents[currentEventId][currentRoad]; //Coolness-verdien går opp eller ned avhengig av hvilken vei man kjører på(les: det som er trendy på den plassen)
            break;

        case 'leave':
            break;

        case 'vink': //besvare kompiser, mer generell løsning
            coolness += friendEvents[currentEventId].wave;
            break;

        case 'peace':
            coolness += friendEvents[currentEventId].peaceSign;
            break;

        case 'dab':
            coolness += friendEvents[currentEventId].dab;
            break;

        case 'vinkKing': //egenhåndtering. Kan skaleres opp til flere special events ved å legge til flere cases.
            coolness += specialEvents[0].wave;
            break;

        case 'peaceKing':
            coolness += specialEvents[0].peaceSign;
            break;

        case 'dabKing':
            coolness += specialEvents[0].dab;
            break;
    }
    coolness = Math.max(coolness, 0);
    coolness = Math.min(coolness, 100);
    eventImgSrc = ''; //Vi har svart på eventen, da skjuler vi bildet.
    dialogText = dialogTexts[roadCounter];
    if (roadCounter == 2) { //Egenhåndtering for Karl Johan.
        animation = setInterval(updateCarPositionCastle, 50);
        setTimeout(streetChange, 4350);
    }
    else {
        animation = setInterval(updateCarPositionNormal, 36); //Fortsett å kjøre bilen   
    }
    if (eventCounter == 3) { //Vi bytter vei når det har skjedd 3 events.
        intervals = defineIntervals();
        streetChange();
    }
    if (roadCounter != 2) { //Egenhåndtering for Karl Johan. Altså vi kjører bare ett event der.
        setGivenTimeout();
    }
    
    view();
}

function handleEncounter() {
    let givenEncounter = generateEncounter();
    if (!(roadCounter == 2 && eventCounter > 0)) { //Egenhåndtering for Karl Johan. Skal altså bare skje ett event der.
        dialogText = givenEncounter.description;
        currentEventId = givenEncounter.id;
        clearInterval(animation);
    
        if (givenEncounter.type == 'normal') {
            dialogText += `<br>
            <img onclick="playerResponse('putOn')">Sett den på!</button>
            <br>
            <button onclick="playerResponse('leave')">La den være...</button>`;
            eventImgSrc = normalEventImages[currentEventId];
        }
        else if (givenEncounter.type == 'friend') {
            dialogText += `<br>
            <button onclick="playerResponse('vink')">Vink!</button>
            
            <button onclick="playerResponse('peace')">Peace!</button>
            
            <button onclick="playerResponse('dab')">Dab!</button>`;
            eventImgSrc = friendEventImages[currentEventId];
        }
        else if (givenEncounter.type == 'king') {
            dialogText += `<br>
            <button onclick="playerResponse('vinkKing')">Vink!</button>
            
            <button onclick="playerResponse('peaceKing')">Peace!</button>
            
            <button onclick="playerResponse('dabKing')">Dab!</button>`;
            eventImgSrc = specialEventImages[currentEventId];
        }
    }
    
    eventCounter++;
    view();
}

function setGivenTimeout() {
    if (roadCounter != 2) {
        let givenInterval = intervals[eventCounter];
        let intervalSum = intervals[0] + intervals[1] + intervals[2];
        let timeout = (givenInterval/intervalSum)*10000; //De tre eventene skjer på tilfeldige tidspunkter, men til sammen skal de alltid ta 10 sekunder med hensyn til animasjonen.
        console.log(timeout);
        setTimeout(handleEncounter, timeout);
    }
    
}

function defineIntervals() { //Genererer tilfeldige timeout-faktorer som brukes i setGivenTimeout()
    let num1 = Math.floor(Math.random()*10) + 1;
    let num2 = Math.floor(Math.random()*10) + 1;
    let num3 = Math.floor(Math.random()*10) + 1;

    return[num1, num2, num3];
}

function generateEncounter() { //Henter ut et tilfeldig event
    let givenEncounter;
    if (roadCounter == 2) { //Dersom gaten er Karl Johan
        givenEncounter = specialEvents[0];
    }
    else {
        let eventIndex = Math.floor(Math.random()*(normalEvents.length+1));
        if (eventIndex == normalEvents.length) { //Vi roller et "friend-event"
            let friendIndex = Math.floor(Math.random()*friendEvents.length);
            givenEncounter = friendEvents[friendIndex];
        }
        else { //Vi roller et "normal-event"
            givenEncounter = normalEvents[eventIndex];
        }
    }
    return givenEncounter;
}

//setTimeout(handleEncounter, 3000);