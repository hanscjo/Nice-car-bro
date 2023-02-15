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
    eventImgSrc = '';
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
            coolness = Math.max(coolness, 0);
            coolness = Math.min(coolness, 100);
            friendReactionSrc = `<p><b>For en bil...</b></p><img height="100px" src=${friendResponseImages[Math.floor(coolness/33)]}>`;
            break;

        case 'peace':
            coolness += friendEvents[currentEventId].peaceSign;
            coolness = Math.max(coolness, 0);
            coolness = Math.min(coolness, 100);
            friendReactionSrc = `<p><b>For en bil...</b></p><img height="100px" src=${friendResponseImages[Math.floor(coolness/33)]}>`;
            break;

        case 'dab':
            coolness += friendEvents[currentEventId].dab;
            coolness = Math.max(coolness, 0);
            coolness = Math.min(coolness, 100);
            friendReactionSrc = `<p><b>For en bil...</b></p><img height="100px" src=${friendResponseImages[Math.floor(coolness/33)]}>`;
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
    friendReactionSrc = '';
    if (!(roadCounter == 2 && eventCounter > 0)) { //Egenhåndtering for Karl Johan. Skal altså bare skje ett event der.
        dialogText = givenEncounter.description;
        currentEventId = givenEncounter.id;
        clearInterval(animation);
    
        if (givenEncounter.type == 'normal') {
            dialogText += `<br>
            <img class="responseImg" onclick="playerResponse('putOn')" src="img/responses/take.png">
            <img class="responseImg" onclick="playerResponse('leave')" src="img/responses/leave.png">`;
            eventImgSrc = normalEventImages[currentEventId];
        }
        else if (givenEncounter.type == 'friend') {
            dialogText += `<br>
            <img class="responseImg" onclick="playerResponse('vink')" src="img/responses/wink.jpeg">
            <img class="responseImg" onclick="playerResponse('peace')" src="img/responses/peace.png">
            <img class="responseImg" onclick="playerResponse('dab')" src="img/responses/dab.png">`;
            eventImgSrc = friendEventImages[currentEventId];
        }
        else if (givenEncounter.type == 'king') {
            dialogText += `<br>
            <img class="responseImg" onclick="playerResponse('vinkKing')" src="img/responses/kingWink.png">
            <img class="responseImg" onclick="playerResponse('peaceKing')" src="img/responses/kingPeace.jpeg">
            <img class="responseImg" onclick="playerResponse('dabKing')" src="img/responses/kingDab.png">`;
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
        let timeout = (givenInterval/intervalSum)*9500; //De tre eventene skjer på tilfeldige tidspunkter, men til sammen skal de alltid ta 10 sekunder med hensyn til animasjonen.
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