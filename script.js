'use strict';

// start

let startButton = document.querySelector('.start-screen__button');
let startScreen = document.querySelector('.start-screen');
let appScreen = document.querySelector('.app-screen');
let appScreenSpeed = document.querySelector('.app-screen__speed');
let appScreenAccuracy = document.querySelector('.app-screen__accuracy');

function changeScreen() {
    startScreen.classList.toggle('start-screen_hidden');
    appScreen.classList.toggle('app-screen_hidden');
    appScreen.classList.toggle('flex');
}

function start() {
    changeScreen();
    showSpeed();
    showAccuracy();
}

startButton.addEventListener('click', start);

// text

let loremText;
let loremArray = [];
let appScreenText = document.querySelector('.app-screen__text');
let current = 0;
let mispress = 0;

function pressKey() {
    if (event.key == loremArray[current].innerText) {
        loremArray[current].classList.remove('span_background_orange');
        loremArray[current].classList.remove('span_background_red');
        loremArray[current].classList.add('span_color_orange');
        current++;
        loremArray[current].classList.add('span_background_orange');
    } else if (!(event.key == 'Shift') && !(event.key == 'CapsLock')) {
        loremArray[current].classList.remove('span_background_orange');
        loremArray[current].classList.add('span_background_red');
        setTimeout(() => {
            loremArray[current].classList.remove('span_background_red');
            loremArray[current].classList.add('span_background_orange'); 
        }, 1000);
        mispress++;
    }
}

let url = 'https://baconipsum.com/api/?type=meat-and-filler&sentences=5&format=text';

function getText(url) {
    fetch(url)
    .then(responce => responce.text())
    .then(respValue => {
    loremText = respValue;
    for(let i = 0; i < loremText.length; i++) {
        appScreenText.innerHTML += `<span>${loremText[i]}</span>`;
        }
        loremArray = document.querySelectorAll('span');
        loremArray[0].classList.add('span_background_orange');
        document.addEventListener('keydown', pressKey);
    });
}

getText(url);

// speed and accuracy

let speedTimerId;

function showSpeed() {
    let speed = 0;
    let startTime = new Date();
    speedTimerId = setInterval(() => {
        let currentTime = new Date();
        let minutesPassed = (currentTime-startTime)/1000/60;
        speed = current/minutesPassed;
        appScreenSpeed.innerHTML = `${Math.round(speed)} <span class="span_font-size_16">Знак/Мин</span> `;
    }, 1000);
}

let accuracyTimerId;

function showAccuracy() {
    let accuracy = 1;
    accuracyTimerId = setInterval(() => {
        if (current+mispress != 0)
            accuracy = 1 - mispress/(current+mispress);
        if (accuracy >= 1)
            accuracy = 1;
        appScreenAccuracy.innerHTML = `${Math.round(accuracy*100)} <span class="span_font-size_16">% Точность</span> `;
    }, 1000);
}

// restart

let restartButton = document.querySelector('.app-screen__restart-button');

function restart() {
    changeScreen();
    appScreenText.innerHTML = '';
    current = 0;
    mispress = 0;
    clearTimeout(speedTimerId);
    clearTimeout(accuracyTimerId);
    appScreenSpeed.innerHTML = `0 <span class="span_font-size_16">Знак/Мин</span> `;
    appScreenAccuracy.innerHTML = `100 <span class="span_font-size_16">% Точность</span> `;
    getText(url);
}

restartButton.addEventListener('click', restart);

//