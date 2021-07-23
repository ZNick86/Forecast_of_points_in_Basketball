/*----300--36---
------600--63------
------720--81----
-----1200--99--0.0825---111--0.0925---117--0.0975---105--0.0875----
const averageRateAndTimeOfQuater = [
    [300, 600, 720, 1200],
    [0.12, 0.105, 0.1125, 0.0975]
];
*/

const averageRateAndTimeOfQuater = [
    [300,   600,    720,    1200],
    [0.06,	0.055,	0.0625,	0.045]
];// 18,    33,     45,     54

/*
300 600 720 1200
0.07	0.055,	0.075,	0.06
0,13    0,105   0,115277777777778   0,0825
sessionStorage.setItem('test', JSON.stringify(averageRateAndTimeOfQuater));
*/
let tabMatch = JSON.parse(localStorage.getItem('tabMatch'));
const tabMatchNumber = JSON.parse(localStorage.getItem('tabMatchTreeId'));
/* ------------------------------------------------------------------------ */
const matchLogTeamFast = tabMatchNumber + '_log_team_fast';
const matchLogTeamSecond = tabMatchNumber + '_log_team_second';
const matchLogGeneral = tabMatchNumber + '_log_general';

const matchInfo = tabMatchNumber + '_matchInfo_';
const headOfMatch = tabMatchNumber + '_headOfMatch_';
/* ------------------------------------------------------------------------ */
const matchTimeOfQuater = tabMatchNumber + '_timeOfQuater';
const matchQuaters = tabMatchNumber + '_matchQuaters';
const numberOfQuater = tabMatchNumber + '_numberOfQuater';

const matchAddCalculationsTeamFast = tabMatchNumber + '_fast_matchAddCalculations';
const matchAddCalculationsTeamSecond = tabMatchNumber  + '_second_matchAddCalculations';
const matchAddCalculationsGeneral = tabMatchNumber  + '_general_matchAddCalculations';

const pointsAndTimeOfMatch = tabMatchNumber + '_pointsAndTimeOfMatch_';
/* ------------------------------------------------------------------------ */

let mainTimeOfQuater = 0;
let mainCountOfQuaters = 0;
let numCalculations = 0;
/* -!--!--!--!--!--!--!--!- */
let lastElementForecastOfQuater = 0;
let lastElementBet = 0;
/* -!--!--!--!--!--!--!--!- */
let numPoints =  0;
let drawPoints = false;
/* -!--!--!--!--!--!--!--!- */
const averageRateMiddle = 0.125;
//0.10833333334 // 600
const smoothingFactor = 1.025;

const specificLength = 6;
const repetForecast = 3;

const ratioWidthChartlist = 28;
const visiblePoints = 2;

// percentage of difference between start and end limit up and down
const diffStartEndUD = 44.5; // % -


/* --for 5 min:--for 10 min: --------- 22.5 ---for 12 min:- 25 -- 26.2 ------for 20 min:------ */

const throwingTime = 24.98;

//const throwingTime = 26.15; 
/*
let totalHaflPoints = 0;
let forecastHaflTotalPoints = 0;
*/
/*
let totalPoints = 0;
let forecastTotalPoints = 0;
*/

let stepOfTime = 150;
let modifyperiod = false;
/* ******************************** */

/* *********calculate*********** */
function setEndKeyBaseLog(keyBaseLog) { 
    return keyBaseLog.slice(keyBaseLog.lastIndexOf('_')+1);
}

function calculate(v) {
    var ex = new Expression("");
    try {
        ex.Expression(v);
        let result = ex.Evaluate();
        if (isNaN(result)) { result = 0; }
        return result;
    } catch (e) { return 0; }
}
/* ****************************** */

/* ************the Recheck Sport ID****************** */
function theRecheckSportID(tabMatch, requiredSportID) {
    chrome.tabs.executeScript(tabMatch.id, { "code": "document.getElementsByClassName('sport-category-container').item(0).dataset.sportTreeid" }, function(currentSportID) {
        sessionStorage.setItem('currentSportID', Number(currentSportID));
    });
    let currentSportID = sessionStorage.getItem('currentSportID');
    const even = (element) => element == currentSportID;
    if (requiredSportID.some((element) => element == currentSportID)) { return true; } else { return false; }
}
/* ************************************************* */

/* ---------------- add calculation -------------- */
function calculationForecastRepetitions(log) {
    for (let i = 0; i < log.length; i++) {
        if (Math.round(log[log.length - 1].forecastPoints) == Math.round(log[i].forecastPoints)) {
            log[log.length - 1].forecastRepetitions += 1;
        }
    }
}
/* ----------------------------------------------- */
function calculationAverageRate(log) {
    let averageRate = 0;
    for (let i = 0; i < log.length; i++) {
        //--- calculation average of Rate ---
        averageRate += log[i].forecastPoints;
        log[i].averageRateOfQuater = (averageRate / (i + 1));
    }
}

function calculationAverageSumPointsOfQuater(lastTime, timeOfQuater) {
    for (let i = 0; i < averageRateAndTimeOfQuater[0].length; i++) {
        if (averageRateAndTimeOfQuater[0][i] == timeOfQuater) {
            return averageRateAndTimeOfQuater[1][i] * lastTime;
        }
    }
}

function calculationFlagAverageRateOfQuater(log, timeOfQuater) {
    /*timeOfQuater = 300 || = 600 || = 720*/
    if (log.length > 1) {
        for (let i = 0; i < log.length - 1; i++) {
            if (Math.round(log[i].averageRateOfQuater * timeOfQuater) > Math.round(log[i + 1].averageRateOfQuater * timeOfQuater)) {
                log[i + 1].flagAverageRateOfQuater = 0; // 0 = lA
            }
            if (Math.round(log[i].averageRateOfQuater * timeOfQuater) == Math.round(log[i + 1].averageRateOfQuater * timeOfQuater)) {
                log[i + 1].flagAverageRateOfQuater = 1; // 1 = mA
            }
            if (Math.round(log[i].averageRateOfQuater * timeOfQuater) < Math.round(log[i + 1].averageRateOfQuater * timeOfQuater)) {
                log[i + 1].flagAverageRateOfQuater = 2; // 2 = hA
            }
        }
    }
}

function calculationAverageRateHighLow(log, specificlength, matchAddCalculations) {
    let averageRateHigh = 0;
    let averageRateLow = 0;

    let averageRate = {
        high: 0,
        low: 0
    };
    
    //Rete High&Low 
    for (let i = 0; i < log.length; i++) {
        if (log.length > specificlength) {
            if (log[i].forecastPoints >= log[log.length - 1].averageRateOfQuater) {
                averageRateHigh += log[i].forecastPoints;
            } else {
                averageRateHigh += log[log.length - 2].averageRateHighOfQuater;
                // averageRateHigh += log[i - 1].averageRateHighOfQuater;
            }
            if (log[i].forecastPoints <= log[log.length - 1].averageRateOfQuater) {
                averageRateLow += log[i].forecastPoints;
            } else {
                averageRateLow += log[log.length - 2].averageRateLowOfQuater;
                // averageRateLow += log[i - 1].averageRateLowOfQuater;
            }
            log[i].averageRateHighOfQuater = (averageRateHigh / (i + 1));
            log[i].averageRateLowOfQuater = (averageRateLow / (i + 1));
        } else {
            log[i].averageRateHighOfQuater = log[i].averageRateOfQuater;
            log[i].averageRateLowOfQuater = log[i].averageRateOfQuater;
        }
    }


    // --!--!--!--  Difference!!!!! --!--!--!--!--!--!--!--!-- 
    let difFPB = (log[0].averageRateHighOfQuater) - (log[0].averageRateLowOfQuater);
    let difFPE = (log[log.length - 1].averageRateHighOfQuater) - (log[log.length - 1].averageRateLowOfQuater);

    let addCalcLog = {
        diffHighAndLowBegin: difFPB,
        diffHighAndLowEnd: difFPE,
        difBeginEnd: difFPB - difFPE,
        diffSEUD: 0
    };

    let addCalculationsLog = JSON.parse(sessionStorage.getItem(matchAddCalculations));
    if (addCalculationsLog != null) {
        if ((addCalculationsLog[addCalculationsLog.length - 1].difBeginEnd != addCalcLog.difBeginEnd)) {
            addCalculationsLog[addCalculationsLog.length] = addCalcLog;

        } else {
            let difB = addCalculationsLog[addCalculationsLog.length - 1].diffHighAndLowBegin;
            let difE = addCalculationsLog[addCalculationsLog.length - 1].diffHighAndLowEnd;

            if (difB != difE && difB < difE) {
                addCalculationsLog[addCalculationsLog.length - 1].diffSEUD = Math.abs(((difE * 100) / difB) - 100);
            }
            if (difB != difE && difE < difB) {
                addCalculationsLog[addCalculationsLog.length - 1].diffSEUD = Math.abs(((difB * 100) / difE) - 100)
            }
            if (addCalculationsLog.length > 1) {
                addCalculationsLog.splice(0, addCalculationsLog.length - 1);
            }
        }
    } else {
        addCalculationsLog = [addCalcLog];
    }
    sessionStorage.setItem(matchAddCalculations, JSON.stringify(addCalculationsLog));
}



function calculationGeneralizingForecast(log, specificlength) {
    for (let i = 0; i < log.length; i++) {
        if (log.length > specificlength) {
            switch (log[i].flagAverageRateOfQuater) {
                case 2:
                    log[i].generalizingForecast = (log[i].averageRateOfQuater - log[i].averageRateLowOfQuater) + log[i].averageRateOfQuater;
                    break;
                case 1:
                    //log[i].generalizingForecast =
                    break;
                case 0:
                    log[i].generalizingForecast = log[i].averageRateOfQuater - (log[i].averageRateHighOfQuater - log[i].averageRateOfQuater);
                    break;
            }
        }
    }
}

function deleteFastElementByDifferenceInterest(keyBaseLog, keyBaseAddCalculations, specificLength, diffStartEndUpDown) {
    let log = JSON.parse(sessionStorage.getItem(keyBaseLog));
    let addCalculationsLog = JSON.parse(sessionStorage.getItem(keyBaseAddCalculations));

    if (log.length > (specificLength + 1)) {
        if ((addCalculationsLog != null) && (addCalculationsLog.length == 1)) {
            if (addCalculationsLog[addCalculationsLog.length - 1].diffSEUD > diffStartEndUpDown) {
                log.splice(0, 1);
                sessionStorage.setItem(keyBaseLog, JSON.stringify(log));
            }
        }
    }
}

//---------D_E_L_E_T_E--I_n_i_t_i_a_l--F_o_r_e_c_a_s_t-------------
function deleteInitialForecast(keyBaseLog, keyBaseAddCalculations, specificlength) {
    let cutPoints = 3;
    let log = JSON.parse(sessionStorage.getItem(keyBaseLog));
    let initialForecast = false;
    let initialForecastLength = 0;
    for (let i = 0; i < log.length; i++) {
        if (log.length > (specificlength + cutPoints)) {
            if (((log[0].averageRateOfQuater == log[0].averageRateLowOfQuater) || (log[0].averageRateOfQuater == log[0].averageRateHighOfQuater)) &&
                ((log[1].averageRateOfQuater == log[1].averageRateLowOfQuater) || (log[1].averageRateOfQuater == log[1].averageRateHighOfQuater))) {
                initialForecast = true;
                //console.log('OOH! Yes');
                initialForecastLength = cutPoints - 1;
            }
        }
    }

    if ((log.length > (specificlength + cutPoints)) && initialForecast) {
        log.splice(0, initialForecastLength);
        //console.log('Yes', ' initialForecastLength = ', initialForecastLength);
        sessionStorage.setItem(keyBaseLog, JSON.stringify(log));
        initialForecast = false;
    }
}


function calculationMainDifferenceHighLow(log, matchAddCalculations) {

    // --!--!--!--  Difference!!!!! --!--!--!--!--!--!--!--!-- 
    let difFPB = (log[0].averageRateHighOfQuater) - (log[0].averageRateLowOfQuater);
    let difFPE = (log[log.length - 1].averageRateHighOfQuater) - (log[log.length - 1].averageRateLowOfQuater);

    let addCalcLog = {
        diffHighAndLowBegin: difFPB,
        diffHighAndLowEnd: difFPE,
        difBeginEnd: difFPB - difFPE,
        diffSEUD: 0
    };

    let addCalculationsLog = JSON.parse(sessionStorage.getItem(matchAddCalculations));
    if (addCalculationsLog != null) {
        if ((addCalculationsLog[addCalculationsLog.length - 1].difBeginEnd != addCalcLog.difBeginEnd)) {
            addCalculationsLog[addCalculationsLog.length] = addCalcLog;

        } else {
            let difB = addCalculationsLog[addCalculationsLog.length - 1].diffHighAndLowBegin;
            let difE = addCalculationsLog[addCalculationsLog.length - 1].diffHighAndLowEnd;

            if (difB != difE && difB < difE) {
                addCalculationsLog[addCalculationsLog.length - 1].diffSEUD = Math.abs(((difE * 100) / difB) - 100);
            }
            if (difB != difE && difE < difB) {
                addCalculationsLog[addCalculationsLog.length - 1].diffSEUD = Math.abs(((difB * 100) / difE) - 100)
            }
            if (addCalculationsLog.length > 1) {
                addCalculationsLog.splice(0, addCalculationsLog.length - 1);
            }
        }
    } else {
        addCalculationsLog = [addCalcLog];
    }
    sessionStorage.setItem(matchAddCalculations, JSON.stringify(addCalculationsLog));
}


/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
/* ////////////////////// NEW Function ///////////////// */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||| */

function ratioOfTwoLimitsAB(numberA, minNumberA, maxNumberA, minNumberB, maxNumberB){


}

function rationalDependenceNumberBonA(numberA, MaxNumberA, MinNumberB, MaxNumberB){
    let numberBonA = ( (MaxNumberB - MinNumberB)/100) * ( (numberA * 100) / MaxNumberA) + (MinNumberB - MaxNumberB ) + MaxNumberB;
    return numberBonA;
}

function suppressionJumpsDifferences(percentDifferenceAndLevels, forecast, percentLastTime){
    let suppressionForecast = forecast;
    let transitionalPercentDifference = 11.5;
    let dwTransitionalPercentDifference = 2.2;
    let dynamicDenominatorForLevelTwo = 2.7;
    let limitDynamicPercentLastTime = 60;  

    if (percentLastTime <= limitDynamicPercentLastTime){
        dynamicDenominatorForLevelTwo =  rationalDependenceNumberBonA(percentLastTime, limitDynamicPercentLastTime, dynamicDenominatorForLevelTwo, 1.95);
        console.log(" percent LastTime = ", percentLastTime,"%  dynamicDenominatorForLevelTwo = ", dynamicDenominatorForLevelTwo," ");
    };

    switch (true) {
        case ((percentDifferenceAndLevels[1] == 2) && (percentDifferenceAndLevels[0] > transitionalPercentDifference) ):
            suppressionForecast = forecast - ( ( forecast / 100 ) * (percentDifferenceAndLevels[0] / dynamicDenominatorForLevelTwo ) );
            break;

        case ((percentDifferenceAndLevels[1] == 2) && (percentDifferenceAndLevels[0] < transitionalPercentDifference) ):
            suppressionForecast = forecast - ( ( forecast / 100 ) * (percentDifferenceAndLevels[0]) );
            break;

        case ((percentDifferenceAndLevels[1] == 0) && (percentDifferenceAndLevels[0] < (transitionalPercentDifference - dwTransitionalPercentDifference) )  ):
            suppressionForecast = forecast + ( ( forecast / 100 ) * (percentDifferenceAndLevels[0] ) );
            break;

    };                    

    return suppressionForecast;
}


function percentDifferenceForecasts(forecastPointsByLastTime, forecastByLastTimeAndMax){
    let levelDifference = 1;
    let percentDifference = 0;
    switch (true) {
        case (forecastPointsByLastTime < forecastByLastTimeAndMax):
            percentDifference = (((forecastByLastTimeAndMax * 100) / forecastPointsByLastTime) - 100); 
            levelDifference = 0;     
            break;

        case (forecastPointsByLastTime > forecastByLastTimeAndMax):
            percentDifference = (((forecastPointsByLastTime * 100) / forecastByLastTimeAndMax) - 100); 
            levelDifference = 2;     
            break;

        case (forecastPointsByLastTime == forecastByLastTimeAndMax):
            percentDifference = 0; 
            levelDifference = 1; 
            break;
    };                    

    return [percentDifference, levelDifference];
}


//--------------------------------------------------------------

// matchLogGeneral

//--------------Main!!!-----------Forecast v4...
function setLog(objLog, keyBaseLog, matchAddCalculations) {
    let log = JSON.parse(sessionStorage.getItem(keyBaseLog));
    if (log != null) {
        if ((log[log.length - 1].forecastPoints == objLog.forecastPoints) ||  (log[log.length - 1].lastTime > objLog.lastTime)) { log.pop(); }

        log[log.length] = objLog;

        //calculationForecastRepetitions(log);

        calculationAverageRate(log);
        calculationFlagAverageRateOfQuater(log, sessionStorage.getItem(matchTimeOfQuater));
        calculationAverageRateHighLow(log, specificLength, matchAddCalculations);

        //calculationGeneralizingForecast(log, specificLength);

        modifyperiod = true;

    } else {
        objLog.averageRateOfQuater = objLog.forecastPoints;
        objLog.averageRateHighOfQuater = objLog.forecastPoints;
        objLog.averageRateLowOfQuater = objLog.forecastPoints;
        
        //objLog.forecastRepetitions = 1;
        
        objLog.flagAverageRateOfQuater = 1; // 1 = medium
        log = [objLog];
    };

    sessionStorage.setItem(keyBaseLog, JSON.stringify(log));
    deleteInitialForecast(keyBaseLog, matchAddCalculations, specificLength);
    addsCalculation(JSON.parse(sessionStorage.getItem(keyBaseLog)), sessionStorage.getItem(matchQuaters), sessionStorage.getItem(matchTimeOfQuater), matchAddCalculations);
    deleteFastElementByDifferenceInterest(keyBaseLog, matchAddCalculations, specificLength, diffStartEndUD)
};

function setMainLog(objLog, keyBaseLog, matchAddCalculations) {
    let log = JSON.parse(sessionStorage.getItem(keyBaseLog));
    if (log != null) {
        if ((log[log.length - 1].forecastPoints == objLog.forecastPoints) ||  (log[log.length - 1].lastTime > objLog.lastTime)) { log.pop(); }
        log[log.length] = objLog;

        //calculationForecastRepetitions(log);
        
        calculationFlagAverageRateOfQuater(log, sessionStorage.getItem(matchTimeOfQuater));
        calculationMainDifferenceHighLow(log, matchAddCalculations);

        //calculationGeneralizingForecast(log, specificLength);

    } else {
        log = [objLog];
    };
    modifyperiod = true;
    sessionStorage.setItem(keyBaseLog, JSON.stringify(log));
    deleteInitialForecast(keyBaseLog, matchAddCalculations, specificLength);
    addsCalculation(JSON.parse(sessionStorage.getItem(keyBaseLog)), sessionStorage.getItem(matchQuaters), sessionStorage.getItem(matchTimeOfQuater), matchAddCalculations);
    deleteFastElementByDifferenceInterest(keyBaseLog, matchAddCalculations, specificLength, diffStartEndUD);
};

function forecastPointsTotal (){

};

function renderingPointsOnLine(log) {
    let mediumCtPoints = document.querySelectorAll("#chartlog .ct-series-b .ct-point");
    if (mediumCtPoints.length == log.length) {
        for (let i = 0; i < mediumCtPoints.length; i++) {
            if (mediumCtPoints.length > 1) {
                switch (log[i].flagAverageRateOfQuater) {
                    case 2:
                        mediumCtPoints[i].style.stroke = "rgb(240, 0, 0)";
                        break;
                    case 1:
                        mediumCtPoints[i].style.stroke = "rgb(0, 240, 0)";
                        break;
                    case 0:
                        mediumCtPoints[i].style.stroke = "rgb(0, 0, 140)";
                        break;
                };
            };
        };
    };
};

function addsCalculation(log, quaters, timeOfQuater, matchAddCalculations) {
    /*---------------------------------------------------*/
    let outputField = document.querySelector(".caddcalcul");

    /*
    let difPTF = (((log[log.length - 1].rateOfQuater * timeOfQuater))) - (log[log.length - 1].realRate * timeOfQuater);
    let needsTime = (difPTF / 2) * throwingTime;
    let endTime = timeOfQuater - (needsTime + log[log.length - 1].lastTime);
    let forecastPointsByEndTime = (((log[log.length - 1].realRate * timeOfQuater) + difPTF) + (endTime / throwingTime));
    let difFPE = (log[log.length - 1].averageRateHighOfQuater * timeOfQuater) - (log[log.length - 1].averageRateLowOfQuater * timeOfQuater);
    let difFPB = (log[0].averageRateHighOfQuater * timeOfQuater) - (log[0].averageRateLowOfQuater * timeOfQuater);
    */
    let difIntBE = 0;
    /*
        averageRateHighOfQuater: null,
        averageRateOfQuater: null,
        averageRateLowOfQuater: null,
        eventInningTimes[0].count
    */
    /*
      log[i].averageSumPointsOfQuater.toString().replace('.', ',') + "</td><td>" +
                    log[i].averageDifBetweenMaxPointsOfQuater.toString().replace('.', ',') + "</td><td>" +
    */

    let addCalculationsLog = JSON.parse(sessionStorage.getItem(matchAddCalculations));
    if (addCalculationsLog != null) {
        difIntBE = addCalculationsLog[addCalculationsLog.length - 1].diffSEUD;
    }

    /*
forecastPointsByLastTime: arraySumPointsOfTeams[0].forecastPointsByLastTime + arraySumPointsOfTeams[1].forecastPointsByLastTime,
forecastPoints: arraySumPointsOfTeams[0].forecastPoints + arraySumPointsOfTeams[1].forecastPoints,
generalizingForecast: 0, // arraySumPointsOfTeams[0].generalizingForecast + arraySumPointsOfTeams[1].generalizingForecast,
percentDifferenceForecastByLastTimeAndMaxAndLastTime: percentDifferenceForecasts(arraySumPointsOfTeams[0].forecastPointsByLastTime + arraySumPointsOfTeams[1].forecastPointsByLastTime, arraySumPointsOfTeams[0].forecastPoints + arraySumPointsOfTeams[1].forecastPoints),

    */

    outputField.innerHTML =
        /*
        ' dif.FP=' + difPTF.toFixed(2) +
        ' nT.=' + needsTime.toFixed(2) +
        ' eT.=' + endTime.toFixed(2) +
        ' D.B= ' + difFPB.toFixed(4) +
        ' D.E= ' + difFPE.toFixed(4) +
        //' B-E= ' + (difFPB - difFPE) +
        */
        ' B~E(%)= ' + difIntBE.toFixed(2) + '% ' +
        ' Nu.Ps= ' + log.length + 
        ' LastT%= ' + log[log.length - 1].percentLastTime.toFixed(2) + '% ' +
        ' difFsLtM= ' + log[log.length - 1].percentDifferenceForecastsByLastTimeAndMaxAndLastTime.toFixed(2) + '% ' +
        ' difFsLevel= ' + log[log.length - 1].levelPercentDifferenceForecastsLTM + ' ';
    //1.742216 Diff_E = 1.963545 B-E = -0.221328947226027 Diff_B = 1.821913 Diff_E = 2.585160 B-E = -0.7632466 40169655
    /*
    ' FPsByeT.=' + forecastPointsByEndTime.toFixed(2);
    //deleteInitialForecast(matchLog, specificLength);
    */
}

function outEventJsonMatchInfo(keyHeadMatch, jsonMatchInfo, keyInfoPointsAndTimeOfMatch, timeOfQuater, jsonPointsAndMinutes, numOfQuater, countOfQuaters, logTeamFast, logTeamSecond, logGeneral) {

    let lastTimeMatch = 0;
    let timeBO = ['&#9203; ', '&#8987; ', '&#8987; ', '&#9203; '];
    let hourglass = timeBO[Math.floor(Math.random() * 3)];
    hourglass = ' <img src="icons/clock-time-icons.png Second-Requests-256x256.gif" class="clock-time-icons" > ';
         hourglass = '<img src="icons/second-Requests-256x256.gif" class="clock-time-icons-gif" >';
    let quaterInMinutes = calculate(timeOfQuater + "/60") + ':00';
    let tableMathInfo = document.querySelector(".ctbmatchinfoandforecast");

    let teamHeadFast = document.querySelector(".cdivteamheadfast");
    let teamHeadSecond = document.querySelector(".cdivteamheadsecond");

    let arrayPointsMath = jsonPointsAndMinutes.getArrayPointsOfTeamsOfQuarter; 
    let arrayPointsTeamA = [];
    let arrayPointsTeamB = [];
    //console.log(arrayPointsMath +' = '+ arrayPointsMath.length);

    let strNumOfQuarters = '';
    let strGeneralPointsOfTeams = '';  
    let strPointsOfTeamA = '';
    let strPointsOfTeamB = '';
 
    function makeStr(arrayPoints, forecastPoints){
        let arrayGetPoints = [];
        let totalSum = 0; 
        let numTD = 3; 
        let blocksDT = '';
        let styleBorder_left_right = ' style="border-left: 3px solid rgb(0 128 0 / 45%); border-right: 3px solid rgb(0 128 0 / 45%);" ';
        for (let i = 0; i < arrayPoints.length; i++) {
            totalSum += calculate(arrayPoints[i]);    
            if ((i+1) % 2 == 0) { arrayGetPoints.push('<td' + styleBorder_left_right + '>' + calculate(arrayPoints[i - 1]) + '</td>', '<td style="background: rgb(160 80 50 / 50%); color: rgb(255 255 255 / 90%);">' + calculate(arrayPoints[i - 1] + '+' + arrayPoints[i]) + '</td>', '<td' + styleBorder_left_right + '>' + calculate(arrayPoints[i]) + '</td>'); };
        };
        if (arrayPoints.length % 2 != 0) {
            arrayGetPoints.push('<td' + styleBorder_left_right + '>' + calculate(arrayPoints[arrayPoints.length - 1]) + ' | ' + forecastPoints.toFixed(2) +  '</td>');
        };

        if (arrayGetPoints.length == 3 || arrayGetPoints.length == 6){
            if (arrayGetPoints.length == 6) { numTD = 4; };
            //console.log((arrayGetPoints.length - numTD) + ' - - - ' + calculate(arrayPoints[arrayGetPoints.length - numTD]) );
            arrayGetPoints[arrayGetPoints.length - 2] = arrayGetPoints[arrayGetPoints.length - 2].replace('</td>',' | ' + calculate('('+ arrayPoints[arrayGetPoints.length - numTD] + ') + (' + forecastPoints + ')').toFixed(2) +  ' </td>');
            arrayGetPoints[arrayGetPoints.length - 1] = arrayGetPoints[arrayGetPoints.length - 1].replace('</td>'," | " + forecastPoints.toFixed(2) +  " </td>"); 
        };
        for (let i = 0; i < arrayGetPoints.length; i++) { blocksDT += arrayGetPoints[i]; };

        if (arrayGetPoints.length >= 6){
            let forecastTotalPoints = ' | ' +  ((totalSum - calculate(arrayPoints[arrayPoints.length - 1])) + forecastPoints).toFixed(2);
            totalSum += forecastTotalPoints;
        };    
        return blocksDT + '<td style="background: rgb(160 80 50 / 55%); color: rgb(255 255 255 / 90%);">' + totalSum + '</td>';
    };

    function makeTitleStr(numQuater, countQuaters){
        let arrayGetPoints = [];
        let blocksDT = '';
        let titleTotalStr = '';
        for (let i = 0; i < numQuater; i++) { if ((i+1) % 2 == 0) {arrayGetPoints.push('<td> (' + (i) + '/' + countQuaters + ') </td>','<td  style="background: rgb(5 85 1 / 65%); "> Hafl </td>','<td> (' + (i + 1) + '/' + countQuaters + ') </td>'); }; };    
        if ( numQuater % 2 != 0) { arrayGetPoints.push('<td> (' + numQuater + '/' + countQuaters + ') | Forecast </td>'); };

        if (arrayGetPoints.length == 3 || arrayGetPoints.length == 6){
            arrayGetPoints[arrayGetPoints.length - 2] = arrayGetPoints[arrayGetPoints.length - 2].replace('</td>',' | Forecast </td>');
            arrayGetPoints[arrayGetPoints.length - 1] = arrayGetPoints[arrayGetPoints.length - 1].replace('</td>',' | Forecast </td>');

            //arrayGetPoints[arrayGetPoints.length - 2] = arrayGetPoints[arrayGetPoints.length - 2].replace('<td>','<td style="color: red; ">');
            //arrayGetPoints[arrayGetPoints.length - 1] = arrayGetPoints[arrayGetPoints.length - 1].replace('<td>','<td style="color: red; ">');
        };

        for (let i = 0; i < arrayGetPoints.length; i++) { blocksDT += arrayGetPoints[i]; };

        if (arrayGetPoints.length >= 6){ titleTotalStr = ' | Forecast '; };    
        return blocksDT + '<td style="background: rgb(5 85 1 / 65%);"> Total(' + numQuater + '/' + countQuaters + ') ' + titleTotalStr + '</td>'; 
    };    

    if (jsonMatchInfo != null) {
        for (let i = 0; i < arrayPointsMath.length; i++) {
            let arrayPointsTeams = arrayPointsMath[i].split('+');
            arrayPointsTeamA.push(arrayPointsTeams[0]);
            arrayPointsTeamB.push(arrayPointsTeams[1]);
        };

        strNumOfQuarters = makeTitleStr(numOfQuater, countOfQuaters);
        strGeneralPointsOfTeams = makeStr(arrayPointsMath, logGeneral[logGeneral.length - 1].forecastPoints); 
        strPointsOfTeamA = makeStr(arrayPointsTeamA, logTeamFast[logTeamFast.length - 1].forecastPoints );
        strPointsOfTeamB = makeStr(arrayPointsTeamB, logTeamSecond[logTeamSecond.length - 1].forecastPoints);

        if (jsonMatchInfo.matchTime.seconds == 0) { lastTimeMatch = jsonMatchInfo.eventInningTimes[0].time; } else { lastTimeMatch = jsonMatchInfo.matchTime.seconds; }

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        let lastMinutes = Math.floor(lastTimeMatch / 60) + ':';
        let lastSeconds = lastTimeMatch % 60 + '';
        if (lastSeconds.length < 2){ lastSeconds = '0' + lastSeconds}; 
        let lastMinutesAndSeconds = lastMinutes + lastSeconds;
        /* ---------------------------- */
        let minutesLeft = Math.floor((timeOfQuater - lastTimeMatch) / 60) + ':';
        let secondsLeft = (timeOfQuater - lastTimeMatch)  % 60 + '';
        if (secondsLeft.length < 2){ secondsLeft = '0' + secondsLeft}; 
        let minutesAndSecondsLeft = minutesLeft + secondsLeft;
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        tableMathInfo.innerHTML = '<tr style="background: green; color: white; "><td style="width: 66px; background: linear-gradient(166deg, #008000 73%, #faaa96, #faaa96 79%);" rowspan="3"> Match: </td>' + 
        '<td colspan="' + ((arrayPointsMath.length * 2) + 2) + '">' + sessionStorage.getItem(keyHeadMatch) + '</td></tr>' +
        '<tr style="background: green; color: white;"><td>Quaters:</td>' + strNumOfQuarters + '</tr>' +
        '<tr style="background: rgb(250 170 150);"><td>Points of quaters match(' + numOfQuater + '/' + countOfQuaters + '):</td>' + strGeneralPointsOfTeams + '</tr>' +        
        '<tr style="background: rgb(250 210 190);"><td style=" background: rgb(250 170 150);" rowspan="2">Teams:</td><td>' + jsonMatchInfo.teamNames[0] + ':</td>' + strPointsOfTeamA + '</tr>' + 
        '<tr style="background: rgb(250 190 160);"><td>' + jsonMatchInfo.teamNames[1] + ':</td>' + strPointsOfTeamB + '</tr>' +     
        '<tr style="background: paleturquoise;"><td colspan="2">Time of quater in minutes: ' + quaterInMinutes + ' &#8781 ' + timeOfQuater + ' seconds (' + numOfQuater + '/' + countOfQuaters + '): </td>' +
        '<td colspan="' + ((arrayPointsMath.length * 2) + 1) + '"> minutes (' + lastMinutesAndSeconds + hourglass + minutesAndSecondsLeft + ') &#8781 (' + lastTimeMatch + hourglass + (timeOfQuater - lastTimeMatch) +') seconds </td></tr>'.replace('(5/5)', '(OT)');
        
        teamHeadFast.innerHTML = 'Team: ' + jsonMatchInfo.teamNames[0]
        teamHeadSecond.innerHTML = 'Team: ' + jsonMatchInfo.teamNames[1];

    };
};

/*-----------------------ReadOut into PANEL ------------------------------*/
function readout(keyBaseLog) {
    let log = JSON.parse(sessionStorage.getItem(keyBaseLog));
    let jsonMatchInfo = JSON.parse(sessionStorage.getItem(matchInfo));

    let tableForecast = document.querySelector('.cmaintbodylog' + setEndKeyBaseLog(keyBaseLog));
    let divTableScroll = document.querySelector('.cdivtable' + setEndKeyBaseLog(keyBaseLog));
    let divChartlistScroll = document.querySelector('.cdivchartlist' + setEndKeyBaseLog(keyBaseLog));

    let cStyleTdFbyT = " style = 'background: rgba(0, 130, 180, 0.233)'";
    let cStyleTdFRb = " style = 'background: rgba(0, 0, 0, 0.233)'";
    let cStyleTdRR = " style = 'background: rgb(250 170 150)'";
    let cStyleTdHF = " style = 'background: rgba(199, 0, 0, 0.355)'";
    let cStyleTdMF = " style = 'background: rgba(15, 160, 15, 0.50)'";
    let cStyleTdLF = " style = 'background: rgba(15, 15, 145, 0.35)'";
    let cStyleTdMMF = " style = 'background:  rgba(180, 80, 0, 0.45)'"; 





    let tableTotalQuarter = document.querySelector('.ctqtbodylog');
    let tableTotalHafl = document.querySelector('.cthtbodylog');
    let tableTotalTotal = document.querySelector('.ctttbodylog');

    let cStyleTLQ = " style = 'background: rgba(69, 0, 169, 0.4)'";
    let cStyleTMQ = " style = 'background: rgba(0, 100, 100, 0.6)'";
    let cStyleTHQ = " style = 'background: rgba(236, 36, 0, 0.5)'";


    let cStyleTH = " style = 'background: rgba(0, 255, 127, 0.215)'";
    let cStyleTT = " style = 'background: rgba(126, 41, 7, 0.255)'";

    let ctdf;
    let cStyleTdFR = "";

    // ------------------Width--Scroll--Left----------------- 
    let widthChartlistScrollLeft;


    let arrayOfLastTime = [];
    let arrayOfSumPoints = [];


    let arrayForecastPoints = [];
    let arrayForecastPointsByLastTime = [];
    let arrayForecastPointsByLTAndMidModMax = [];
        
    let arrayOfAverageRate = [];
    let arrayOfAverageRateHigh = [];
    let arrayOfAverageRateLow = [];

    let arrayBetsTotalPointsQuarterLow = [];
    let arrayBetsTotalPointsQuarterMedium = [];
    let arrayBetsTotalPointsQuarterHigh = [];

    if (jsonMatchInfo != null) {
        totalPoints = calculate(jsonMatchInfo.mainScore.replace(':', '+'));
        forecastTotalPoints = 0;
    };
    if (log != null) {
        widthChartlistScrollLeft = (log.length * ratioWidthChartlist);
    } else { widthChartlistScrollLeft = ratioWidthChartlist }

    divChartlistScroll.scrollLeft = (((widthChartlistScrollLeft + ratioWidthChartlist) * divTableScroll.scrollTop) / divTableScroll.scrollHeight);

    if (log != null) {
        // -------------------------------- Draw graphic ------------------------------
        for (let i = 0; i < log.length; i++) {

            arrayOfLastTime[arrayOfLastTime.length] = log[i].lastTime;

            arrayForecastPoints[arrayForecastPoints.length] = log[i].forecastPoints.toFixed(2);

            arrayForecastPointsByLastTime[arrayForecastPointsByLastTime.length] = log[i].forecastPointsByLastTime.toFixed(2);

            arrayForecastPointsByLTAndMidModMax[arrayForecastPointsByLTAndMidModMax.length] = log[i].forecastPointsByLTAndMidModMax.toFixed(2);
            /*
            arrayForecastPointsByEndTime[arrayForecastPointsByEndTime.length] = log[i].forecastPointsByEndTime.toFixed(2);
            */
            arrayOfAverageRateHigh[arrayOfAverageRateHigh.length] = log[i].averageRateHighOfQuater.toFixed(2);
            arrayOfAverageRate[arrayOfAverageRate.length] = log[i].averageRateOfQuater.toFixed(2);
            arrayOfAverageRateLow[arrayOfAverageRateLow.length] = log[i].averageRateLowOfQuater.toFixed(2);

            /*arrayOfSumPoints = arrayOfRealRate*/
            arrayOfSumPoints[arrayOfSumPoints.length] = log[i].sumPoints;

            arrayBetsTotalPointsQuarterLow[arrayBetsTotalPointsQuarterLow.length] = log[i].betTotalQuarterLow;
            arrayBetsTotalPointsQuarterMedium[arrayBetsTotalPointsQuarterMedium.length] = log[i].betTotalQuarterMedium;
            arrayBetsTotalPointsQuarterHigh[arrayBetsTotalPointsQuarterHigh.length] = log[i].betTotalQuarterHigh;

            /*
             arryaOfAverageFMGF[arryaOfAverageFMGF.length] = log[i].averageFMGF * timeOfQuater;
             arrayRepetitionsRateQuater[arrayRepetitionsRateQuater.length] = log[i].repetitionsRateQuater * timeOfQuater;
             */
        };
        /*
        for (let i = 0; i < arrayRepetitionsRateQuater.length; i++) {
            if (arrayRepetitionsRateQuater[i] == 0) {  arrayRepetitionsRateQuater[i] = null;  }
        }
        */

        if (log.length > visiblePoints) {
            for (let i = 0; i < log.length - visiblePoints; i++) {
                arrayOfSumPoints[i] = null;
            }
        }

        let pointsChartlistQAxisY = {
            series: [arrayForecastPoints,

                arrayOfAverageRate,
                arrayOfAverageRateHigh,
                arrayOfAverageRateLow,

                arrayOfSumPoints,
                arrayForecastPointsByLastTime,
                arrayBetsTotalPointsQuarterLow,
                arrayBetsTotalPointsQuarterMedium,
                arrayBetsTotalPointsQuarterHigh,

                arrayForecastPointsByLTAndMidModMax
 
            ]
        };
        let optionsChartlistQAxisY = {
            fullWidth: true,
            showArea: false,
            showLine: false,
            showPoint: false,
            axisX: {
                offset: 13,
            },
            axisY: {
                offset: 48,
            },

        };

        new Chartist.Line('#charty' + setEndKeyBaseLog(keyBaseLog), pointsChartlistQAxisY, optionsChartlistQAxisY);

        let pointsChartlistQ = {
            labels: arrayOfLastTime,
            series: [arrayForecastPoints,

                arrayOfAverageRate,
                arrayOfAverageRateHigh,
                arrayOfAverageRateLow,

                arrayOfSumPoints,
                arrayForecastPointsByLastTime,
                arrayBetsTotalPointsQuarterLow,
                arrayBetsTotalPointsQuarterMedium,
                arrayBetsTotalPointsQuarterHigh,

                arrayForecastPointsByLTAndMidModMax
                /*
                arrayForecastPointsByEndTime
                */
            ]
        };

        let optionsChartlistQ = {
            fullWidth: false,
            showArea: true,
            //---------------
            width: widthChartlistScrollLeft,
            /*--height: 374--.cchartlistscrollx height: 396px --.ct-chart-y height: 373px --.cdivchartlist height: 389px--*/
            height: 374,
            chartPadding: {
                // top: 0,
                right: 2,
                // bottom: 0,
                left: 2,
            },
            axisX: {
                offset: 13,
                // type: Chartist.AutoScaleAxis
            },
            axisY: {
                showLabel: false,
                offset: 0,
            },

            areaBase: log[log.length - 1].averageRateOfQuater

            //plugins: [Chartist.plugins.tooltip()],

        };

        let forecastsQ = new Chartist.Line('#chartlog' + setEndKeyBaseLog(keyBaseLog), pointsChartlistQ, optionsChartlistQ);

        forecastsQ.on('draw', function(context) {
            /*
            if ((context.group._node.classList.value === "ct-series ct-series-a") && (context.type === "point")) {
                if (context.series.length == log.length) {
                    context.element.attr({
                        style: 'stroke-width: ' + Math.ceil(log[context.index].forecastRepetitions * 2) + 'px;'
                    });
                }
            }
            */

            if ((context.group._node.classList.value === "ct-series ct-series-b") && (context.type === "point")) {
                let triangleUp = new Chartist.Svg('path', {
                    d: ['M',
                        context.x,
                        context.y - 8,
                        'L',
                        context.x - 4,
                        context.y + 4,
                        'L',
                        context.x + 4,
                        context.y + 4,
                        'z'
                    ].join(' '),
                    style: 'fill-opacity: 0.86; fill: rgb(200, 0, 0);'
                }, 'ct-area');

                let triangleDown = new Chartist.Svg('path', {
                    d: ['M',
                        context.x - 4,
                        context.y - 4,
                        'L',
                        context.x + 4,
                        context.y - 4,
                        'L',
                        context.x,
                        context.y + 8,
                        'z'
                    ].join(' '),

                    style: 'fill-opacity: 0.86; fill: rgb(0, 0, 140);'
                }, 'ct-area');

                let rombMid = new Chartist.Svg('path', {
                    d: ['M',
                        context.x - 7,
                        context.y,
                        '',
                        context.x,
                        context.y - 4,
                        '',
                        context.x + 7,
                        context.y,
                        '',
                        context.x,
                        context.y + 4,
                    ].join(' '),
                    style: 'fill-opacity: 0.86; fill: rgb(0, 240, 0);'
                }, 'ct-area');

                if (context.series.length == log.length) {
                    switch (log[context.index].flagAverageRateOfQuater) {
                        case 2:
                            /*
                            context.element.attr({
                                style: 'stroke: rgb(200, 0, 0);'
                            });
                            */
                            context.element.replace(triangleUp);
                            break;
                        case 1:
                            /*
                            context.element.attr({
                                style: 'stroke: rgb(0, 240, 0);'
                            });
                            */
                            context.element.replace(rombMid);
                            break;
                        case 0:
                            /*
                            context.element.attr({
                                style: 'stroke: rgb(0, 0, 140);'
                            });
                            */
                            context.element.replace(triangleDown);
                            break;
                    }
                }
            }

        });

        //divChartistScroll.scrollLeft = syncScroll;

        // -------------------------------- Draw table forecast------------------------------
        tableForecast.innerHTML = "";

        let colorTextTd = "color: rgb(0, 0, 0);";

        for (let i = 0; i < log.length; i++) {
            /*
            let colorStep = 20;
            ctdf = (255 + colorStep) - log[i].forecastRepetitions * colorStep;
            if (ctdf > 255) { ctdf = 255; }

            cStyleTdFR = " style = 'background: rgb(" + ctdf + ",255," + ctdf + ")'";
            */

            cStyleTdAmG = " style = 'background: rgba(0, 108, 128, 0.35)'"

            /*
            if (log[i].forecastRepetitions <= 2) {
                cStyleTrFR = " style = 'border: 1px solid rgb(1, 61, 121)'";
            } else cStyleTrFR = " style = 'border: 4px solid rgb(" + ctdf + ",255," + ctdf + ")'";
            */

            if (log.length > 1) {
                switch (log[i].flagAverageRateOfQuater) {
                    case 2:
                        cStyleTdMF = cStyleTdHF;
                        colorTextTd = "color: rgb(200, 0, 0);";
                        break;
                    case 1:
                        cStyleTdMF = " style = 'background: rgba(15, 160, 15, 0.45)'";
                        colorTextTd = "color: rgb(0, 240, 0);";
                        break;
                    case 0:
                        cStyleTdMF = cStyleTdLF;
                        colorTextTd = "color: rgb(0, 0, 140);";
                        break;
                }
            }

            /* ----------------------- draw sring of table forecast ------------------- */
            tableForecast.innerHTML += "<tr><td>" + arrayOfLastTime[i] +
                "</td><td" + cStyleTdRR + ">" + log[i].sumPoints + 
                "</td><td" + cStyleTdFbyT + ">" + arrayForecastPointsByLastTime[i] +
                "</td><td" + cStyleTdFRb + ">" + arrayForecastPoints[i] +
                "</td><td" + cStyleTdMMF + ">" + arrayForecastPointsByLTAndMidModMax[i] +
                //--
                "</td><td" + cStyleTdLF + ">" + arrayOfAverageRateLow[i] +
                "</td><td" + cStyleTdMF + ">" + arrayOfAverageRate[i] +
                "</td><td" + cStyleTdHF + ">" + arrayOfAverageRateHigh[i] +
                "</td></tr>";
        }

        /* ************************** Bets ******************************************************** */
        tableTotalQuarter.innerHTML = "<tr><td" + cStyleTHQ + ">" +
            log[log.length - 1].betTotalQuarterHigh + "</td></tr>" +
            "<tr><td" + cStyleTMQ + ">" + log[log.length - 1].betTotalQuarterMedium + "</td></tr>" +
            "<tr><td" + cStyleTLQ + ">" + log[log.length - 1].betTotalQuarterLow + "</td></tr>";
        /* *************************************************************************************** */
        /* *************************************************************************************** */
        tableTotalHafl.innerHTML = "<tr><td" + cStyleTH + ">" + log[log.length - 1].betHafl + "</td></tr>";
        /* *************************************************************************************** */
        /* *************************************************************************************** */
        tableTotalTotal.innerHTML = "<tr><td" + cStyleTT + ">" + log[log.length - 1].betTotal + "</td></tr>";
        /* *************************************************************************************** */
    }
}

function editPositionTooltip(keyBaseLog) {

    //chartListScrollP = document.getElementsByClassName('cchartlistscrollx');
    //let chartListScrollP = document.getElementsByClassName('cdivchartlist');
    let chartListScrollP = document.querySelector('.cdivchartlist' + setEndKeyBaseLog(keyBaseLog));
    //console.log(chartListScrollP);

    chartListScrollP.onmouseover = chartListScrollP.onmouseout = chartListScrollP.onmousemove = function(e) {

        let tooltip = document.querySelector('.chartist-tooltip');
        let left = ((e.offsetX + 40) - e.path[2].scrollLeft);
        let top = (e.offsetY + 80);

        //sessionStorage.setItem('mouseover', JSON.stringify(e));
        //console.log(' x = ' + e.offsetX + ' y = ' + e.offsetY + '  e.scrollLeft = ' + e.scrollLeft);
        //console.log(e);

        tooltip.style.display = "none";

        switch (true) {
            case ((e.offsetX > 2 || e.offsetX < 475) && (e.offsetY > 3 || e.offsetY < 387)):
                tooltip.style.display = "block";
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                break;
            case ((e.offsetX < 1 || e.offsetX > 476) && (e.offsetY < 1 || e.offsetY > 388)):
                tooltip.style.display = "none";
                break;
        };
        //   tooltip.style.display = "none";
    };
    // left max 577 min 36  top max 436  min 79
}

function autoParallelScroll(keyBaseLog) {
    let log = JSON.parse(sessionStorage.getItem(keyBaseLog));
    let divTableScroll = document.querySelector('.cdivtable' + setEndKeyBaseLog(keyBaseLog));
    let divChartlistScroll = document.querySelector('.cdivchartlist' + setEndKeyBaseLog(keyBaseLog));

    // ------------------Width--Scroll--Left----------------- 
    let widthChartlistScrollLeft;

    if (log != null) {
        widthChartlistScrollLeft = (log.length * ratioWidthChartlist);
    } else { widthChartlistScrollLeft = ratioWidthChartlist }

    // -------------------Table--Scroll--Top---------------- 
    //    divTableScroll.scrollTop = divTableScroll.scrollHeight;
    //    .centerstring, 17  38 65 89 110 131   182 
    //    document.querySelector(".centerstring").innerHTML = " divTableScroll: " + divTableScroll.scrollTop + " = " + divTableScroll.scrollHeight + " divChartistScroll: " + divChartlistScroll.scrollLeft + " = " + divChartlistScroll.scrollHeight;

    divChartlistScroll.scrollLeft = (((widthChartlistScrollLeft + (ratioWidthChartlist * 2)) * divTableScroll.scrollTop) / divTableScroll.scrollHeight);
    divTableScroll.scrollTop = divTableScroll.scrollHeight;
}

/************************************************/
/************************************************/
/************************************************/
/*================ Main function ===============*/
/************************************************/
/************************************************/
/************************************************/

function sumAndForecastPointsOfBothTeams(strPoints, lastTimeMatch, timeOfQuater, eventJsonMatchInfo) {
    
    let arraySumPointsOfTeams = strPoints.split('+');
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    let endD = 0.65;
    let denominator = 2 + endD;    
    let dinamicDenominator = denominator - ((endD / timeOfQuater) * lastTimeMatch);
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


    for (let i = 0; i < arraySumPointsOfTeams.length; i++) {
        let forecastMaxPointsBytimeOfQuater = 0;
        let forecastPointsByLastTime = 0;

        forecastMaxPointsBytimeOfQuater = calculationAverageSumPointsOfQuater(timeOfQuater - lastTimeMatch, timeOfQuater);
        
        if (Number(arraySumPointsOfTeams[i]) != 0 ){
            forecastPointsByLastTime = (Number(arraySumPointsOfTeams[i]) / lastTimeMatch) * timeOfQuater;
        } else { forecastPointsByLastTime = (forecastMaxPointsBytimeOfQuater / (dinamicDenominator)); };

        let difByMaxP = calculationAverageSumPointsOfQuater(timeOfQuater - lastTimeMatch, timeOfQuater);
         
        let forecastByLastTimeAndMax = (Number(arraySumPointsOfTeams[i]) + difByMaxP + forecastPointsByLastTime) / dinamicDenominator;      
        
        let forecastTotal = 0;

        //------------------Main object--------------------
        let pointsTeamLog = {
            sumPoints: Number(arraySumPointsOfTeams[i]),
            overfulfillmentByPoints: calculationAverageSumPointsOfQuater(lastTimeMatch, timeOfQuater) - Number(arraySumPointsOfTeams[i]), 

            lastTime: lastTimeMatch,
            percentLastTime: ((lastTimeMatch * 100) / timeOfQuater),
                        
            forecastPoints: forecastByLastTimeAndMax,

            forecastPointsByLTAndMidModMax: forecastByLastTimeAndMax,

            //generalizingForecast: 0, //forecastByLastTimeAndMax,
            //forecastRepetitions: 0,

            forecastPointsByLastTime: forecastPointsByLastTime,

            percentDifferenceForecastsByLastTimeAndMaxAndLastTime: percentDifferenceForecasts(forecastPointsByLastTime, forecastByLastTimeAndMax)[0],
            levelPercentDifferenceForecastsLTM: percentDifferenceForecasts(forecastPointsByLastTime, forecastByLastTimeAndMax)[1],

            forecastPointsTotal: null, 

            averageRateHighOfQuater: null,
            averageRateOfQuater: null,
            averageRateLowOfQuater: null,
            flagAverageRateOfQuater: 1,

            averageSumMaxPointsOfQuater: calculationAverageSumPointsOfQuater(lastTimeMatch, timeOfQuater),
            averageDifBetweenMaxPointsOfQuater: calculationAverageSumPointsOfQuater(timeOfQuater - lastTimeMatch, timeOfQuater),




            betTotalQuarterLow: eventJsonMatchInfo[0][6][i][0],
            betTotalQuarterMedium: eventJsonMatchInfo[0][6][i][1],
            betTotalQuarterHigh: eventJsonMatchInfo[0][6][i][2],     
        };

        arraySumPointsOfTeams[i] = pointsTeamLog;
    };
    return arraySumPointsOfTeams;
}

function makeForecast(tabMatch, keyWork) {
    if (keyWork) {
        let timeOfQuater = 0;
        let lastTimeMatch = 0;

        //-----------------------------
        let jsonMatchInfo = [];
        let jsonPointsAndMinutes = [];

        /* ----------------------------------------------------NEW!!!!!! BEGIN!!!!!------------------------------------------ */
        chrome.tabs.executeScript(tabMatch.id, { file: "/js/get.info.marathonbet.com.js" }, function(eventJsonMatchInfo) {

            if ((eventJsonMatchInfo != null) && (chrome.runtime.TypeError == null)) {

                /****************************************/
                try {
                    //console.log(eventJsonMatchInfo[0][2]);
                } catch (e) { console.log('end'); }
                /****************************************/

                try {
                    sessionStorage.setItem(headOfMatch, eventJsonMatchInfo[0][0]);
                } catch (e) { sessionStorage.setItem(headOfMatch, '_._'); }

                try { sessionStorage.setItem(matchInfo, JSON.stringify(eventJsonMatchInfo[0][1])); } catch (e) { sessionStorage.setItem(matchInfo, null); }
                try { sessionStorage.setItem(pointsAndTimeOfMatch, JSON.stringify(eventJsonMatchInfo[0][2])); } catch (e) { sessionStorage.setItem(pointsAndTimeOfMatch, null); };

                jsonMatchInfo = JSON.parse(sessionStorage.getItem(matchInfo));
                jsonPointsAndMinutes = JSON.parse(sessionStorage.getItem(pointsAndTimeOfMatch));


                if ((jsonMatchInfo != null) && (jsonMatchInfo.treeId == tabMatchNumber)) {

                    if ((jsonPointsAndMinutes != null) && (jsonMatchInfo.treeId == tabMatchNumber)) {

                        sessionStorage.setItem(matchQuaters, jsonMatchInfo.eventInningTimes[0].count);

                        if (jsonMatchInfo.matchTime.seconds == 0) {
                            lastTimeMatch = jsonMatchInfo.eventInningTimes[0].time;
                        } else { lastTimeMatch = jsonMatchInfo.matchTime.seconds; }

                        sessionStorage.setItem(numberOfQuater, jsonPointsAndMinutes.getArrayPointsOfTeamsOfQuarter.length);

                        if (jsonMatchInfo.matchTime.isOvertime) {
                            if (sessionStorage.getItem(matchQuaters) == 2) { sessionStorage.setItem(matchQuaters, 3) }
                            if (sessionStorage.getItem(matchQuaters) == 4) { sessionStorage.setItem(matchQuaters, 5) }
                            sessionStorage.setItem(matchTimeOfQuater, 300);
                        } else { sessionStorage.setItem(matchTimeOfQuater, jsonMatchInfo.eventInningTimes[0].time); }

                        //matchTime.isOvertime

                        timeOfQuater = sessionStorage.getItem(matchTimeOfQuater);

                        if (lastTimeMatch != 0) {

                            let strSumPointsOfQuater = jsonPointsAndMinutes.getArrayPointsOfTeamsOfQuarter[jsonPointsAndMinutes.getArrayPointsOfTeamsOfQuarter.length - 1]; //+
                            let arraySumPointsOfTeams = sumAndForecastPointsOfBothTeams(strSumPointsOfQuater, lastTimeMatch, timeOfQuater, eventJsonMatchInfo);

                            //console.log(eventJsonMatchInfo[0][6]);

                            setLog(arraySumPointsOfTeams[0], matchLogTeamFast, matchAddCalculationsTeamFast);
                            setLog(arraySumPointsOfTeams[1], matchLogTeamSecond, matchAddCalculationsTeamSecond);
                                                        
                            let generalForecastPoints = arraySumPointsOfTeams[0].forecastPoints + arraySumPointsOfTeams[1].forecastPoints;

                            let generalforecastPointsByLastTime = arraySumPointsOfTeams[0].forecastPointsByLastTime + arraySumPointsOfTeams[1].forecastPointsByLastTime;                           
                            
                            let generalPercentDifferenceForecastsAndLevels = percentDifferenceForecasts(generalforecastPointsByLastTime,  generalForecastPoints);

                            let generalPercentLastTime = ((lastTimeMatch * 100) / timeOfQuater);

                            let pointsLogOfQuater = {

                                sumPoints: arraySumPointsOfTeams[0].sumPoints + arraySumPointsOfTeams[1].sumPoints,
                                overfulfillmentByPoints: arraySumPointsOfTeams[0].overfulfillmentByPoints + arraySumPointsOfTeams[1].overfulfillmentByPoints, 

                                lastTime: lastTimeMatch,
                                percentLastTime:  generalPercentLastTime,
   
                                forecastPointsByLastTime: generalforecastPointsByLastTime,

                                forecastPointsByLTAndMidModMax: generalForecastPoints,

                                forecastPoints: suppressionJumpsDifferences(generalPercentDifferenceForecastsAndLevels, generalForecastPoints, generalPercentLastTime),
   
                                //generalizingForecast: 0, // arraySumPointsOfTeams[0].generalizingForecast + arraySumPointsOfTeams[1].generalizingForecast,
                                //forecastRepetitions: 0,

                                percentDifferenceForecastsByLastTimeAndMaxAndLastTime: generalPercentDifferenceForecastsAndLevels[0],
                                levelPercentDifferenceForecastsLTM: generalPercentDifferenceForecastsAndLevels[1],

                                averageRateHighOfQuater: null,
                                averageRateOfQuater: null,
                                averageRateLowOfQuater: null,
                                
                                flagAverageRateOfQuater: 1,                    
                                averageSumMaxPointsOfQuater: calculationAverageSumPointsOfQuater(lastTimeMatch, timeOfQuater),
                                averageDifBetweenMaxPointsOfQuater: calculationAverageSumPointsOfQuater(timeOfQuater - lastTimeMatch, timeOfQuater),
                                
                                betTotalQuarterLow: eventJsonMatchInfo[0][3][0],
                                betTotalQuarterMedium: eventJsonMatchInfo[0][3][1],
                                betTotalQuarterHigh: eventJsonMatchInfo[0][3][2],
                                betHafl: eventJsonMatchInfo[0][4],
                                betTotal: eventJsonMatchInfo[0][5]
                            };
                            
                            setLog(pointsLogOfQuater, matchLogGeneral, matchAddCalculationsGeneral); //aAdd elemet into Log

                            //==================== Draw panel... ========================
                            let generalLog = JSON.parse(sessionStorage.getItem(matchLogGeneral));                
                            // for draw and redraw panel
                            if ((generalLog.length != numPoints) || 
                            (generalLog[generalLog.length - 1].lastTime > lastTimeMatch) ||
                            (generalLog[generalLog.length - 1].forecastPoints != lastElementForecastOfQuater) ||
                            (generalLog[generalLog.length - 1].betTotalQuarterLow != lastElementBet)){
                                //console.log("Ok = logPoints[" + logPoints.length - 1 + "] = ");
                                numPoints = generalLog.length;
                                lastElementForecastOfQuater = generalLog[generalLog.length - 1].forecastPoints;
                                lastElementBet = generalLog[generalLog.length - 1].betTotalQuarterLow;
                                
                                outEventJsonMatchInfo(headOfMatch, JSON.parse(sessionStorage.getItem(matchInfo)), pointsAndTimeOfMatch, sessionStorage.getItem(matchTimeOfQuater), JSON.parse(sessionStorage.getItem(pointsAndTimeOfMatch)), sessionStorage.getItem(numberOfQuater), sessionStorage.getItem(matchQuaters), JSON.parse(sessionStorage.getItem(matchLogTeamFast)), JSON.parse(sessionStorage.getItem(matchLogTeamSecond)), JSON.parse(sessionStorage.getItem(matchLogGeneral)) );
  
                                readout(matchLogTeamFast);
                                //editPositionTooltip(matchLogTeamFast);
                                autoParallelScroll(matchLogTeamFast);

                                readout(matchLogTeamSecond);
                                //editPositionTooltip(matchLogTeamSecond);
                                autoParallelScroll(matchLogTeamSecond);
 
                                readout(matchLogGeneral);
                                //editPositionTooltip(matchLogGeneral);
                                autoParallelScroll(matchLogGeneral);
    
                            }
                            
                            //=============================================================
                        }

                    }
                } else {
                    //document.querySelector(".cpointstime").style.color = red;
                    keyWork = false;
                }
            } else {
                //document.querySelector(".cpointstime").style.color = red;  +7 996 127-57-97 
                keyWork = false;
            }
        });

    }
}