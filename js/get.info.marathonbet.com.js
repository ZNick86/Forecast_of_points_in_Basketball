function trackingQuarterBets(matchTreeId, matchTime, matchLastSeconds) {
    let arrayTotalPointsQuarterBets = [];

    let numberBlockBets = 0;
    let unitBlocksQuarter = 0;

    let blockTotalQuarterBetsLow = null;
    let blockTotalQuarterBetsMedium = null;
    let blockTotalQuarterBetsHigh = null;

    let blockTotalQuarterBetLsess1More2 = 1;
    let arrayBlocksQuarterBets;
    let blockTotalQuarterKey = "";
    let strKey = "";

    try {
        strKey = "@Total_Points_-_" + Number(sessionStorage.getItem(numberOfQuater));
    } catch (e) { strKey = "@Total_Points_-_"; };

    try {
        arrayBlocksQuarterBets = document.querySelector("#block" + matchTreeId + "type25").lastElementChild.children;
        unitBlocksQuarter = document.querySelector("#block" + matchTreeId + "type25").lastElementChild.children.length;
    } catch (e) { unitBlocksQuarter = 0; };

    if (unitBlocksQuarter > 7) { unitBlocksQuarter = Math.trunc(unitBlocksQuarter / 2); };

    for (let i = 0; i < unitBlocksQuarter; i++) {
        try {
            blockTotalQuarterKey = arrayBlocksQuarterBets[i].firstElementChild.children.item(1).rows.item(1).attributes[1].ownerElement.cells[0].firstElementChild.lastElementChild.firstElementChild.dataset.selectionKey;
            if (blockTotalQuarterKey.includes(strKey)) { numberBlockBets = (i + 1); break; };
        } catch (e) { numberBlockBets = 0; };
    };
    /* 
    tqs = document.querySelector("#block11258616type25").lastElementChild.children
    tqs[3].firstElementChild.children.item(1).rows.item(1).attributes[1].ownerElement.cells[0].firstElementChild.lastElementChild.firstElementChild.dataset.selectionKey
    "@Total_Points_-_3rd_Quarter"
    "@Total_Points_-_"

    let getJsonMatchInfo = JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText);
    let matchTreeId = getJsonMatchInfo.treeId;
    let numberBlockBets = 0;
    let blockTotalQuarterBetLsess1More2 = 1;
    document.querySelector("#block11497939type25 > div > div:nth-child(0) > div > table.td-border > tbody > tr:nth-child(2) > td:nth-child(1) > div > div.coeff-value").style.backgroundColor = "LightCoral";
    */

    for (let i = 2; i < 5; i++) {
        try { document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockBets + ") > div > table.td-border > tbody > tr:nth-child(" + i + ") > td:nth-child(1)").style.backgroundColor = "Salmon"; } catch (e){ let selectBets = null; };
        try { document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockBets + ") > div > table.td-border > tbody > tr:nth-child(" + i + ") > td:nth-child(2)").style.backgroundColor = "Salmon"; } catch (e){ let selectBets = null; }; 
    };
    
    try {
        blockTotalQuarterBetsLow = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockBets + ") > div > table.td-border > tbody > tr:nth-child(2) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { blockTotalQuarterBetsLow = null; }

    try {
        blockTotalQuarterBetsMedium = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockBets + ") > div > table.td-border > tbody > tr:nth-child(3) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { blockTotalQuarterBetsMedium = null; }

    try {
        blockTotalQuarterBetsHigh = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockBets + ") > div > table.td-border > tbody > tr:nth-child(4) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { blockTotalQuarterBetsHigh = null; }
    arrayTotalPointsQuarterBets = [blockTotalQuarterBetsLow, blockTotalQuarterBetsMedium, blockTotalQuarterBetsHigh, numberBlockBets, unitBlocksQuarter, strKey, blockTotalQuarterKey, matchTime, matchLastSeconds];
    return arrayTotalPointsQuarterBets;
};


function trackingTeamsQuarterBets(matchTreeId, matchTime, matchLastSeconds) {

    let arrayTotalPointsFastTeamsQuarterBets = [];
    let arrayTotalPointsSecondTeamsQuarterBets = [];


    let numberBlockBets = 0;
    let unitBlocksQuarter = 0;

    let numberBlockFastTeamBets = 0;
    let numberBlockSecondTeamBets = 0;

    let arrayBlockaFastTeamsQuarterBets = [];
    let arrayBlockaSecondTeamsQuarterBets = [];


    let blockTotalQuarterBetLsess1More2 = 1;
    let arrayBlocksQuarterBets;
    let blockTotalQuarterKey = "";
    let strKey = "";

    try {
        strKey = "@Total_Points_-_" + Number(sessionStorage.getItem(numberOfQuater));
    } catch (e) { strKey = "@Total_Points_-_"; };

    try {
        arrayBlocksQuarterBets = document.querySelector("#block" + matchTreeId + "type25").lastElementChild.children;
        unitBlocksQuarter = document.querySelector("#block" + matchTreeId + "type25").lastElementChild.children.length;
    } catch (e) { unitBlocksQuarter = 0; };

    if (unitBlocksQuarter > 7) { unitBlocksQuarter = Math.trunc(unitBlocksQuarter / 2); };

    for (let i = 0; i < unitBlocksQuarter; i++) {
        try {
            blockTotalQuarterKey = arrayBlocksQuarterBets[i].firstElementChild.children.item(1).rows.item(1).attributes[1].ownerElement.cells[0].firstElementChild.lastElementChild.firstElementChild.dataset.selectionKey;
            if (blockTotalQuarterKey.includes(strKey)) {
                numberBlockFastTeamBets = (i + 2);
                numberBlockSecondTeamBets = (i + 3); 
   
            };
        } catch (e)  {
            numberBlockFastTeamBets = 0;
            numberBlockSecondTeamBets = 0; 
        };    
    };

    /* 
    tqs = document.querySelector("#block11258616type25").lastElementChild.children
    tqs[3].firstElementChild.children.item(1).rows.item(1).attributes[1].ownerElement.cells[0].firstElementChild.lastElementChild.firstElementChild.dataset.selectionKey
    "@Total_Points_-_3rd_Quarter"
    "@Total_Points_-_"

    let getJsonMatchInfo = JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText);
    let matchTreeId = getJsonMatchInfo.treeId;
    let numberBlockBets = 0;
    let blockTotalQuarterBetLsess1More2 = 1;
    document.querySelector("#block11497939type25 > div > div:nth-child(0) > div > table.td-border > tbody > tr:nth-child(2) > td:nth-child(1) > div > div.coeff-value").style.backgroundColor = "LightCoral";
    */


    for (let i = 2; i < 5; i++) {
        try { document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockFastTeamBets + ") > div > table.td-border > tbody > tr:nth-child(" + i + ") > td:nth-child(1)").style.backgroundColor = "Salmon"; } catch (e){ let selectBets = null; };
        try { document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockFastTeamBets + ") > div > table.td-border > tbody > tr:nth-child(" + i + ") > td:nth-child(2)").style.backgroundColor = "Salmon"; } catch (e){ let selectBets = null; }; 

        try { document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockSecondTeamBets + ") > div > table.td-border > tbody > tr:nth-child(" + i + ") > td:nth-child(1)").style.backgroundColor = "Salmon"; } catch (e){ let selectBets = null; };
        try { document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockSecondTeamBets + ") > div > table.td-border > tbody > tr:nth-child(" + i + ") > td:nth-child(2)").style.backgroundColor = "Salmon"; } catch (e){ let selectBets = null; }; 
    };
    

    /* ---------------------------------------------------------------------------------------------------------------------------- */
    try {
        arrayBlockaFastTeamsQuarterBets[0] = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockFastTeamBets + ") > div > table.td-border > tbody > tr:nth-child(2) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { arrayBlockaFastTeamsQuarterBets[0] = null; }

    try {
        arrayBlockaFastTeamsQuarterBets[1] = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockFastTeamBets + ") > div > table.td-border > tbody > tr:nth-child(3) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { arrayBlockaFastTeamsQuarterBets[1] = null; }

    try {
        arrayBlockaFastTeamsQuarterBets[2] = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockFastTeamBets + ") > div > table.td-border > tbody > tr:nth-child(4) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { arrayBlockaFastTeamsQuarterBets[2] = null; }

    arrayTotalPointsFastTeamsQuarterBets = [arrayBlockaFastTeamsQuarterBets[0], arrayBlockaFastTeamsQuarterBets[1], arrayBlockaFastTeamsQuarterBets[2], numberBlockFastTeamBets, unitBlocksQuarter, strKey, blockTotalQuarterKey, matchTime, matchLastSeconds];
    /* ---------------------------------------------------------------------------------------------------------------------------- */

    /* ---------------------------------------------------------------------------------------------------------------------------- */
    try {
        arrayBlockaSecondTeamsQuarterBets[0] = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockSecondTeamBets + ") > div > table.td-border > tbody > tr:nth-child(2) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { arrayBlockaSecondTeamsQuarterBets[0] = null; }
    
    try {
        arrayBlockaSecondTeamsQuarterBets[1] = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockSecondTeamBets + ") > div > table.td-border > tbody > tr:nth-child(3) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { arrayBlockaSecondTeamsQuarterBets[1] = null; }
    
    try {
        arrayBlockaSecondTeamsQuarterBets[2] = Number(document.querySelector("#block" + matchTreeId + "type25 > div > div:nth-child(" + numberBlockSecondTeamBets + ") > div > table.td-border > tbody > tr:nth-child(4) > td:nth-child(" + blockTotalQuarterBetLsess1More2 + ") > div > div.coeff-value").innerText.replace(/[()]/g, ''));
    } catch (e) { arrayBlockaSecondTeamsQuarterBets[2] = null; }
    
    arrayTotalPointsSecondTeamsQuarterBets = [arrayBlockaSecondTeamsQuarterBets[0], arrayBlockaSecondTeamsQuarterBets[1], arrayBlockaSecondTeamsQuarterBets[2], numberBlockSecondTeamBets, unitBlocksQuarter, strKey, blockTotalQuarterKey, matchTime, matchLastSeconds];
    /* ---------------------------------------------------------------------------------------------------------------------------- */
   
    return [arrayTotalPointsFastTeamsQuarterBets, arrayTotalPointsSecondTeamsQuarterBets];
};




function trackingTotalBets(betUnderAndOver /* Underbet = 0 Overbet = 1*/ ) {
    let numberBlock = 0;
    let totalBetsMedium = null;
    try {
        numberBlock = document.querySelector(".sub-row").children.length - (2 - betUnderAndOver);
        totalBetsMedium = Number(document.querySelector(".sub-row").children.item(numberBlock).children.item(0).previousSibling.wholeText.replace(/[^\d\.+]/g, ""));
    } catch (e) { totalBetsMedium = null; };
    return totalBetsMedium;
};

function trackingHaflBets(matchTreeId, betUnderAndOver /* Underbet = 0 Overbet = 1*/ ) {
    //block11300127type26
    let numberBlockHaflBets = null;
    let numberHaflBets = null;
    let haflBetsMedium = null;
    /*    6 = 4,     5 = 3.    4 = 2,     */
    try {
        numberBlockHaflBets = document.querySelector("#block" + matchTreeId + "type26").lastElementChild.children.length - 3;
        numberHaflBets = document.querySelector("#block" + matchTreeId + "type26").lastElementChild.children.item(numberBlockHaflBets).firstElementChild.lastElementChild.children.item(0).rows.length - 4;
        haflBetsMedium = Number(document.querySelector("#block" + matchTreeId + "type26").lastElementChild.children.item(numberBlockHaflBets).firstElementChild.lastElementChild.children.item(0).rows.item(numberHaflBets).children.item(betUnderAndOver).previousSibling.nextElementSibling.lastElementChild.firstChild.nextSibling.innerText.replace(/[^\d\.+]/g, ""));
    } catch (e) { haflBetsMedium = null; };
    return haflBetsMedium;
};

function selectGetsBets(jsonMatchInfo, nBlockBets) {

}

function getInfo() {
    let getHeadLineMatch = null;

    let getJsonMatchInfo = null;

    let getMatchTime = null;
    let getMatchTreeId = null;
    let arrayTotalPointsQuarterBets = [];
    let arrayTeamsQuarterBets = [];

    let pointsAndMinutes = {
        getInfoPointsAndMinutesMatch: null,
        getArrayPointsOfTeamsOfQuarter: null,
        getTotalHaflPoints: null,
    };

    /*document.querySelector(data-block-type-id="25")
    data-block-type-id="25" */
    //chrome.runtime.lastError == null && tabUrlCategoryMatchInfo[0][0] != undefined

    try { getHeadLineMatch = document.getElementsByClassName('category-label simple-live').item(0).outerText; } catch (e) { getHeadLineMatch = null; }
    try { getJsonMatchInfo = JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText); } catch (e) { getJsonMatchInfo = null; }

    if (getJsonMatchInfo != null) {
        if (getJsonMatchInfo.matchTime.isOvertime) {
            getMatchTime = getJsonMatchInfo.eventInningTimes[1].time;
        } else { getMatchTime = getJsonMatchInfo.eventInningTimes[0].time; }

        if ( ((getMatchTime == 600) && (getJsonMatchInfo.matchTime.seconds < 360)) ||
             ((getMatchTime == 720) && (getJsonMatchInfo.matchTime.seconds < 480)) ) {
            arrayTotalPointsQuarterBets = trackingQuarterBets(getJsonMatchInfo.treeId, getMatchTime, getJsonMatchInfo.matchTime.seconds);
        } else { arrayTotalPointsQuarterBets = [null, null, null] };

        if ( ((getMatchTime == 600) && (getJsonMatchInfo.matchTime.seconds < 300)) ||
             ((getMatchTime == 720) && (getJsonMatchInfo.matchTime.seconds < 420)) ) {
            arrayTeamsQuarterBets = trackingTeamsQuarterBets(getJsonMatchInfo.treeId, getMatchTime, getJsonMatchInfo.matchTime.seconds);
        } else { arrayTeamsQuarterBets = [[null, null, null], [null, null, null]] };

    };

    try {
        let getPointsAndMinute = document.getElementsByClassName('cl-left red').item(0).innerText;
        pointsAndMinutes.getInfoPointsAndMinutesMatch = getPointsAndMinute;
        if (getPointsAndMinute.indexOf('OT') == -1) {
            let strMainTimeTemp = getPointsAndMinute.replace(/:/g, "+").replace(/\n/g, '_').replace(/ /g, '');
            let strMainTime = strMainTimeTemp.substr(0, strMainTimeTemp.indexOf("_"));
            if (strMainTime.length >= 3 && strMainTime.length <= 5) {
                pointsAndMinutes.getArrayPointsOfTeamsOfQuarter = [strMainTime];
            } else if (strMainTime.length > 8) {
                //Summa of points 2-q's, 3-q's, 4-q's. --4:4(4:4)            
                pointsAndMinutes.getArrayPointsOfTeamsOfQuarter = strMainTime.slice(strMainTime.indexOf("(") + 1, strMainTime.indexOf(")")).split(",");
                if (pointsAndMinutes.getArrayPointsOfTeamsOfQuarter.length % 2 == 0) {
                    pointsAndMinutes.getTotalHaflPoints = (pointsAndMinutes.getArrayPointsOfTeamsOfQuarter[pointsAndMinutes.getArrayPointsOfTeamsOfQuarter.length - 2] +
                    '+' + pointsAndMinutes.getArrayPointsOfTeamsOfQuarter[pointsAndMinutes.getArrayPointsOfTeamsOfQuarter.length - 1]).replace(/ /g, '');
                };
            };
        } else {
            let strOoverTimeTemp = getPointsAndMinute.replace(/:/g, "+").replace(/\n/g, '_').replace(/ /g, '').replace(')OT(', ',');
            let strOoverTime = strOoverTimeTemp.substr(0, strOoverTimeTemp.indexOf("_"));
            //80:79 (22:14, 15:13, 19:27, 18:20) OT (6:5)↵5:00"
            pointsAndMinutes.getArrayPointsOfTeamsOfQuarter = strOoverTime.slice(strOoverTime.indexOf("(") + 1, strOoverTime.indexOf(")")).split(",");
        };
    } catch (e) { pointsAndMinutes = null; }

    /*
        try {
            matchTime = eventInningTimes.time;
            matchLastSeconds = matchTime.seconds;
            matchTreeId = jsonMatchInfo.treeId;
        } catch (e) {
            matchTime = null;
            matchLastSeconds = null;
            matchTreeId = "";
        }
    */

    /*
        document.querySelector("#block11247845type25 > div > div:nth-child(2) > div > table.td-border > tbody > tr:nth-child(2) > td:nth-child(1) > div > div.coeff-value")
        document.querySelector("#shortcutLink_event11219794type25")

        if (chrome.runtime.lastError == null &&
            (document.getElementsByClassName('category-label simple-live').item(0).outerText != null ||
                document.getElementsByClassName('category-label simple-live').item(0).outerText != undefined)) {
            fulfillmentCondition = true;
            headLineMatch = document.getElementsByClassName('category-label simple-live').item(0).outerText;
        } else { fulfillmentCondition = false }
        if (chrome.runtime.lastError == null &&
            (document.querySelectorAll('tr > td.hidden').item(0).innerText != null ||
                document.querySelectorAll('tr > td.hidden').item(0).innerText != undefined)) {
            fulfillmentCondition = true;
            jsonMatchInfo = JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText);
        } else { fulfillmentCondition = false }
        if (chrome.runtime.lastError == null &&
            (document.getElementsByClassName('cl-left red').item(0).innerText != null ||
                document.getElementsByClassName('cl-left red').item(0).innerText != undefined)) {
            fulfillmentCondition = true;
            pointsAndTime = document.getElementsByClassName('cl-left red').item(0).innerText;
        } else { fulfillmentCondition = false }

        if (fulfillmentCondition == true) {
            return [headLineMatch, jsonMatchInfo, pointsAndTime];
            //return [document.getElementsByClassName('category-label simple-live').item(0).outerText, JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText), document.getElementsByClassName('cl-left red').item(0).innerHTML];
        } else { return [null, null, null]; }
    */

    try {
        getMatchTreeId = getJsonMatchInfo.treeId;
    } catch (e) { getMatchTreeId = null; }

    return [getHeadLineMatch, getJsonMatchInfo, pointsAndMinutes, arrayTotalPointsQuarterBets, trackingHaflBets(getMatchTreeId, 0 /* Underbet = 0 Overbet = 1*/ ), trackingTotalBets(0), arrayTeamsQuarterBets];
};


getInfo();