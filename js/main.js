function readTextFile(file) {
    var rawFile = new XMLHttpRequest(); // XMLHttpRequest (often abbreviated as XHR) is a browser object accessible in JavaScript that provides data in XML, JSON, but also HTML format, or even a simple text using HTTP requests.
    rawFile.open("GET", file, false); // open with method GET the file with the link file ,  false (synchronous)
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) // readyState = 4: request finished and response is ready
        {
            if (rawFile.status === 200) // status 200: "OK"
            {
                var allText = rawFile.responseText; //  Returns the response data as a string
                console.log(allText); // display text on the console
            }
        }
    }
    rawFile.send(null); //Sends the request to the server Used for GET requests with param null
}

function detectOS() {
    const platform = navigator.platform.toLowerCase(),
        iosPlatforms = ['iphone', 'ipad', 'ipod', 'ipod touch'];
    if (platform.includes('mac')) return 'MacOS';
    if (iosPlatforms.includes(platform)) return 'iOS';
    if (platform.includes('win')) return 'Windows';
    if (/android/.test(navigator.userAgent.toLowerCase())) return 'Android';
    if (/linux/.test(platform)) return 'Linux';
    return 'unknown';
}

function  changeFloatNumberBeforeOutput(floatNumber, indexRounding) {
    let indexFloat = 0;    
    let changeNumber = floatNumber;

    if (floatNumber != null) {
        if((floatNumber - parseInt(floatNumber)) != 0){indexFloat = floatNumber.toString().split('.')[1].length;};

        if(indexFloat < indexRounding){changeNumber = floatNumber.toFixed(indexFloat);} else {changeNumber = floatNumber.toFixed(indexRounding);};

        changeNumber = changeNumber.toString().replace('.', ',');        
    };

    return changeNumber;
}

/*------------------------------------------------*/
//        .chartist-tooltip 
// tooltip.item(0).style.background = "rgba(25,110,0,0.75)";
/*-------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function() {
    let blockTeams = document.querySelector('.cblockteams'); //
        blockTeams.style.display = "flex";

    let winOrientation = "H";
    let chartListWidth = 0;
    let tableWidth = 0;
    let mainPanelHeight = 0;
    let winPixelRatio = 0;

    let tabMatch = JSON.parse(localStorage.getItem('tabMatch'));
    let requiredSportID = [45356, 1372932];
    //let requiredSportID = JSON.parse(sessionStorage.getItem('requiredSportID'));
    let keyWork = theRecheckSportID(tabMatch, requiredSportID);

    let mainWidthWin = 0;
    let mainHeightWin = 0;

    //makeForecast(tabMatch, keyWork);

    //-----------------------Clean fast el
    document.querySelector('.cbdelfastelgeneral').addEventListener('click', function() {
        //sessionStorage.removeItem(matchLog);
        //readTextFile("http://zakhozhij.ru/basket/600g.txt");
        // readTextFile("js/600g.txt");
        //let bDelFastEl = this;
        //bDelFastEl.disabled = true;
        let log = JSON.parse(sessionStorage.getItem(matchLogGeneral));
        if (log.length > 1) {
            log.splice(0, 1);
            sessionStorage.setItem(matchLogGeneral, JSON.stringify(log));
            drawPoints = true;
        }

    });

    document.querySelector('.cbdelfastelfast').addEventListener('click', function() {
        let log = JSON.parse(sessionStorage.getItem(matchLogTeamFast));
        if (log.length > 1) {
            log.splice(0, 1);
            sessionStorage.setItem(matchLogTeamFast, JSON.stringify(log));
            drawPoints = true;
            readout(matchLogTeamFast);
            //editPositionTooltip(matchLogTeamFast);
            autoParallelScroll(matchLogTeamFast);

        }
    });

    document.querySelector('.cbdelfastelsecond').addEventListener('click', function() {
        let log = JSON.parse(sessionStorage.getItem(matchLogTeamSecond));
        if (log.length > 1) {
            log.splice(0, 1);
            sessionStorage.setItem(matchLogTeamSecond, JSON.stringify(log));
            drawPoints = true;
            readout(matchLogTeamSecond);
            //editPositionTooltip(matchLogTeamSecond);
            autoParallelScroll(matchLogTeamSecond);

        }
    });

    //Clean log
    document.querySelector('.cbclearloggeneral').addEventListener('click', function() {
        //sessionStorage.removeItem(matchLog);
        let log = JSON.parse(sessionStorage.getItem(matchLogGeneral));
        if (log.length > 1) {
            log.splice(0, log.length - 1);
            sessionStorage.setItem(matchLogGeneral, JSON.stringify(log));

        }
        readout(matchLogGeneral);

    });

    document.querySelector('.cbclearlogfast').addEventListener('click', function() {
        //sessionStorage.removeItem(matchLog);
        let log = JSON.parse(sessionStorage.getItem(matchLogTeamFast));
        if (log.length > 1) {
            log.splice(0, log.length - 1);
            sessionStorage.setItem(matchLogTeamFast, JSON.stringify(log));
        }
        readout(matchLogTeamFast);

    });

    document.querySelector('.cbclearlogsecond').addEventListener('click', function() {
        //sessionStorage.removeItem(matchLog);
        let log = JSON.parse(sessionStorage.getItem(matchLogTeamSecond));
        if (log.length > 1) {
            log.splice(0, log.length - 1);
            sessionStorage.setItem(matchLogTeamSecond, JSON.stringify(log));
        }
        readout(matchLogTeamSecond);

    });

    document.querySelector('.cbwinorien').addEventListener('click', function() {
        let bWinOrien = this;
        bWinOrien.disabled = true;
        chrome.windows.getCurrent(null, function(winProperties) {
            if (winOrientation == "V") {
                bWinOrien.innerHTML = "Vertical";
                winOrientation = "H";

            } else {
                bWinOrien.innerHTML = "Horizontal";
                winOrientation = "V";

            }
        });
    });


    document.querySelector('.cbhidenshowteams').addEventListener('click', function() {
        let bWinOrien = this;
        //bWinOrien.disabled = true;
        chrome.windows.getCurrent(null, function(winProperties) {
            
            if (blockTeams.style.display == "flex") {
                blockTeams.style.display = "none";
                bWinOrien.innerHTML = "Show teams"; 
            } else {
                blockTeams.style.display = "flex";
                bWinOrien.innerHTML = "Hiden teams";
                //winOrientation = "V";
            }
            
        });
    });



    /* ************************* Save log ********************************** */
    document.getElementsByTagName('a')[0].onclick = function() {
        let log = JSON.parse(sessionStorage.getItem(matchLogGeneral));
        if (log != null) {
            let txt = "<TABLE>";
            //
            txt += "<tr>" +
                "<td> Sec </td>" + 
                "<td> %Sec </td>" + 
                "<td> TsPs </td>" +

                "<td> F points </td>" +
                "<td> FP by last time </td>" +
                "<td> FP by ModMax </td>" +
                
                "<td> %DiffFLTM </td>" +    
                "<td> LFLTM </td>" +    

                "<td> 100% Sum </td>" +
                "<td> Diff Max </td>" + 

                "<td> High </td>" +
                "<td> Rate </td>" + 
                "<td> Low </td>" +             
                "<td> Flag </td>" + 
                
                "<td> bet-Low </td>" +
                "<td> bet-Medium </td>" +
                "<td> bet-High </td>" + 
            "</tr>";
            
            for (let i = 0; i < log.length; i++) {
                 
                txt += "<tr>" + 

                    "<td>" + log[i].lastTime + "</td>" +
                    "<td>" + changeFloatNumberBeforeOutput(log[i].percentLastTime, 3) + "</td>" + 
                    "<td>" + log[i].sumPoints + "</td>" +

                    "<td>" + changeFloatNumberBeforeOutput(log[i].forecastPoints, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].forecastPointsByLastTime, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].forecastPointsByLTAndMidModMax, 99) + "</td>" + 

                    "<td>" + changeFloatNumberBeforeOutput(log[i].percentDifferenceForecastsByLastTimeAndMaxAndLastTime, 99) + "</td>" + 
                    "<td>" + log[i].levelPercentDifferenceForecastsLTM + "</td>" + 
                   
                    "<td>" + changeFloatNumberBeforeOutput(log[i].averageSumMaxPointsOfQuater, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].averageDifBetweenMaxPointsOfQuater, 99) + "</td>" + 
                   
                    "<td>" + changeFloatNumberBeforeOutput(log[i].averageRateHighOfQuater, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].averageRateOfQuater, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].averageRateLowOfQuater, 99) + "</td>" + 
                    "<td>" + log[i].flagAverageRateOfQuater + "</td>" +

                    "<td>" + changeFloatNumberBeforeOutput(log[i].betTotalQuarterLow, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].betTotalQuarterMedium, 99) + "</td>" + 
                    "<td>" + changeFloatNumberBeforeOutput(log[i].betTotalQuarterHigh, 99) + "</td>" + 
                  
                "</tr>";
            };

            txt += "</TABLE>";
            logsave = 'data:application/csv;charset=utf-8,' + encodeURIComponent(txt);
            this.href = logsave;
            this.target = '_blank';

            let dateSave = new Date().toString().replace(/ GMT[\s\S]*/g, '').replace(/ /g, '_');
            this.download = 'log_' + dateSave + '.html';
        }
    };
    /***********************************************************************/

    /************************** Save log ***********************************
    document.querySelector('.curlsavetableqs').addEventListener('click', function() {
        let txt = "<TABLE style='background: black; color: #fff;'>";
        txt += "<tr><td>Match:</td><td>" + document.querySelectorAll('.cheadlinematch')[0].innerText + "</td></tr>";
        txt += "<tr><td>Teams:</td><td>" + document.querySelectorAll('.cteamsnames')[0].innerHTML + "</td></tr>";
        txt += "<tr><td>Points:<br>Time:</td><td>" + document.querySelectorAll('.cpointstime')[0].innerHTML + "</td></tr>";
        txt += "<tr><td>ad.cal.:</td><td>" + document.querySelectorAll('.caddcalcul')[0].innerText + "</td></tr>";
        txt += "</TABLE>";
        txt += "<TABLE style='background: #fff;'>";
        txt += document.querySelectorAll('.ctablequarters')[0].innerHTML.replace(/%/g, '');
        txt += "</TABLE>";

        logsave = 'data:application/csv;charset=utf-8,' + encodeURIComponent(txt);

        this.href = logsave;
        this.target = '_blank';
    */
      //let dateSave = new Date().toString().replace(/ GMT[\s\S]*/g, '').replace(/ /g, '_');
      //this.download = 'tableQs_' + dateSave + '.html';
    //});

    /* **************************************************************************************************************** */




    setInterval(function() {

        keyWork = theRecheckSportID(tabMatch, requiredSportID);
        makeForecast(tabMatch, keyWork);



        let screenWidth = screen.width;
        let screenHeight = screen.height;

        let screenSquare = 13;
        let screenMBPPlus = 7;
        let screenMBPMinus = 9;
        let namePlatform = navigator.platform;

        if (namePlatform.indexOf('Mac') > -1) {
            //console.log(namePlatform);
            screenSquare = 16;
            screenMBPPlus = 19;
            screenMBPMinus = 2;
            winPixelRatio = window.devicePixelRatio;
        };

        if (namePlatform.indexOf('Win') > -1) {
            //console.log(namePlatform);
            screenSquare = 25;
            screenMBPPlus = 16;
            screenMBPMinus = 0;
            winPixelRatio = detectZoom.zoom();
        };

        //console.log(screenWidth, screenHeight, "Width/Height =", (screenWidth / screenHeight), " Height/Width =", (screenHeight / screenWidth), "winPixelRatio =", winPixelRatio);

        if (winOrientation == "H") {
            chartListWidth = document.querySelectorAll('.controlbuttons')[0].scrollWidth +
                document.querySelectorAll('.cchartlistscrollxgeneral')[0].scrollWidth;
            tableWidth = document.querySelectorAll('.cdivtablegeneral')[0].scrollWidth +
                document.querySelectorAll('.cdivtotals')[0].scrollWidth;

            mainPanelHeight = document.querySelectorAll('.cuptopic')[0].clientHeight +
                document.querySelectorAll('.cdivheadgeneral')[0].clientHeight +
                document.querySelectorAll('.cblockteams')[0].clientHeight +
                document.querySelectorAll('.cbtopic')[0].clientHeight;

            mainWidthWin = Math.ceil( ( (chartListWidth + tableWidth) * winPixelRatio) + (winPixelRatio * screenSquare) ) + screenMBPMinus;

            mainHeightWin = Math.ceil( (mainPanelHeight * winPixelRatio) + (winPixelRatio * screenSquare) ) + screenMBPPlus;
        } else {
            mainHeightWin = Math.ceil( ( (
                document.querySelectorAll('.cuptopic')[0].clientHeight +
                document.querySelectorAll('.cchartlistandtable')[0].clientHeight + 
                document.querySelectorAll('.cblockteams')[0].clientHeight ) * winPixelRatio) +
                (winPixelRatio * screenSquare) ) + screenMBPPlus;
            
            mainWidthWin = Math.ceil( ( (
                document.querySelectorAll('.controlbuttons')[0].scrollWidth +
                document.querySelectorAll('.cchartlistscrollxgeneral')[0].scrollWidth) * winPixelRatio) +
                (winPixelRatio * screenSquare) ) - screenMBPMinus;
        }
        chrome.windows.getCurrent(null, function(winProperties) {
            chrome.windows.update(winProperties.id, {
                width: mainWidthWin,
                height: mainHeightWin
            });
        });
        document.querySelector('.cbwinorien').disabled = false;

    }, 35);


    /*
        window.onbeforeunload = function(e) {
            var e = e || window.event;
            // For IE and Firefox
            if (e) { e.returnValue = 'Any string'; }
            // For Safari
            //return 'Any string';
        };
    */
});