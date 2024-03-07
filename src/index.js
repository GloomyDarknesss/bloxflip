    // ==UserScript==
    // @name         Bloxflip Rain Autojoin
    // @namespace    http://tampermonkey.net/
    // @version      2.5
    // @description  This script can join in rains automatic
    // @author       gabdarkness
    // @match        https://bloxflip.com/*
    // @license      MIT
    // @downloadURL   https://raw.githubusercontent.com/GloomyDarknesss/bloxflip/main/src/index.js
    // @updateURL    https://raw.githubusercontent.com/GloomyDarknesss/bloxflip/main/src/index.js
    // ==/UserScript==

    let joinPath = '//*[@id="__next"]/div[2]/div/div[3]/aside/div[3]/p[2]';
    let buttonPath = '/html/body/div[34]/div/div/button';
    let d = document;
    let timeout = 0;
    let lastRain = null;
    let buttonTimeout = null;

    function checkButton() {
        let button = d.evaluate(buttonPath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) {
            console.log('Button found');  
            if (!buttonTimeout) {
                buttonTimeout = setTimeout(function() {
                    button = d.evaluate(buttonPath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (button) {
                        button.click();
                        console.log('Button clicked');  
                    }
                    buttonTimeout = null;
                }, 3 * 60 * 1000);
            }
        } else {
            console.log('Button not found');  
            if (buttonTimeout) {
                clearTimeout(buttonTimeout);
                buttonTimeout = null;
            }
        }
    }

    setInterval(async function() {
        if (timeout > 0) {
            timeout--;
            return;
        }

        let history = await fetch('https://api.bloxflip.com/chat/history');
        let historyJson = JSON.parse(await history.text());

        if (historyJson.rain.active) {

            if (lastRain && historyJson.rain.prize === lastRain.prize && historyJson.rain.created === lastRain.created) {
                return;
            }

            let element = d.evaluate(joinPath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (element) {
                element.click();
            }
            timeout = 5;

            lastRain = historyJson.rain;
        }

        checkButton();
    }, 1000);
