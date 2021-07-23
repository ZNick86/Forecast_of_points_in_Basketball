
function openPanelInWindow(sportId) {

    // [window.location.href, document.getElementsByClassName('sport-category-container').item(0).dataset.sportTreeid, JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText)]
    chrome.tabs.executeScript(null, { "code": "[window.location.href, document.getElementsByClassName('sport-category-container').item(0).dataset.sportTreeid, JSON.parse(document.querySelectorAll('tr > td.hidden').item(0).innerText)]" }, function(tabUrlCategoryMatchInfo) {
        if (chrome.runtime.lastError == null && tabUrlCategoryMatchInfo[0][0] != undefined && tabUrlCategoryMatchInfo[0][0].toString().indexOf('/su/live/') > -1) {
            if (chrome.runtime.lastError == null && tabUrlCategoryMatchInfo[0][1] != undefined) {
                if (chrome.runtime.lastError == null && tabUrlCategoryMatchInfo[0][2] != undefined) {
                    localStorage.setItem('tabMatchTreeId', JSON.stringify(tabUrlCategoryMatchInfo[0][2].treeId));
                }
                const even = (element) => element == tabUrlCategoryMatchInfo[0][1];
                if (sportId.some((element) => element == tabUrlCategoryMatchInfo[0][1])) {

                    localStorage.setItem('requiredSportID', Number(tabUrlCategoryMatchInfo[0][1]));
                    chrome.tabs.getSelected(null, function(tabMatch) { localStorage.setItem('tabMatch', JSON.stringify(tabMatch)); });
                    chrome.windows.getCurrent(null, function(winMatch) { localStorage.setItem('winTabMatch', JSON.stringify(winMatch)); });

                    let osName = 'main.html';
                    switch (true) {
                        case (navigator.platform.indexOf('Win') > -1):
                            osName = 'main.win.html';     
                            break;

                        case (navigator.platform.indexOf('Mac') > -1):
                            osName = 'main.mac.html'; 
                            break;
                    };                    

                    let winTabMatch = JSON.parse(localStorage.getItem('winTabMatch'));
                    let winProperties = {
                        url: osName,
                        left: winTabMatch.left + 5,
                        top: winTabMatch.top + 5,
                        width: 480,
                        height: 280,
                        focused: true,
                        type: 'panel',
                        incognito: false
                    };
                    chrome.windows.create(winProperties, (newWin) => {
                        localStorage.setItem('newWin', JSON.stringify(newWin));
                    });

                }
            }

        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) { openPanelInWindow([45356, 1372932]); });