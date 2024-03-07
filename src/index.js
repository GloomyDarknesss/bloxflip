// ==UserScript==
// @name         Bloxflip Rain Autojoin
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  This script can join in rains automatic
// @author       gabdarkness
// @match        https://bloxflip.com/*
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/GloomyDarknesss/bloxflip/main/src/index.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

let joinPath = '//*[@id="__next"]/div[2]/div/div[3]/aside/div[3]/p[2]';
let buttonPath = '/html/body/div[34]/div/div/button';
let d = document;
let timeout = 0;
let lastRain = null;
let buttonTimeout = null;
let discordWebhookUrl = GM_getValue('discordWebhookUrl', '');

GM_registerMenuCommand('Set Discord Webhook URL', function() {
    let url = prompt('Enter your Discord webhook URL:');
    if (url) {
        GM_setValue('discordWebhookUrl', url); 
        discordWebhookUrl = url;
        alert('Discord webhook URL set successfully!');
        sendDiscordMessage('Webhook configured successfully!'); 
    } else {
        discordWebhookUrl = '';
    }
});

function checkButton() {
    let button = d.evaluate(buttonPath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button) {
        if (!buttonTimeout) {
            buttonTimeout = setTimeout(function() {
                button = d.evaluate(buttonPath, d, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (button) {
                    button.click();
                }
                buttonTimeout = null;
            }, 3 * 60 * 1000);
        }
    } else {
        if (buttonTimeout) {
            clearTimeout(buttonTimeout);
            buttonTimeout = null;
        }
    }
}

function sendDiscordMessage(content) {
    if (!discordWebhookUrl) {
        return; 
    }

    fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: content,
        }),
    }).catch(error => {
        console.error('Error sending message to Discord webhook:', error);
    });
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

        sendDiscordMessage(`⛈️ A new rain has started on Bloxflip! The prize is ${historyJson.rain.prize} robux.`);
    }

    checkButton();
}, 1000);