'use strict';

// start

let startButton = document.querySelector('.start-screen__button');
let startScreen = document.querySelector('.start-screen');
let appScreen = document.querySelector('.app-screen');
let finishScreen = document.querySelector('.finish-screen');
let appScreenSpeed = document.querySelector('.app-screen__speed');
let appScreenAccuracy = document.querySelector('.app-screen__accuracy');

function changeScreen(id = 1) {
    if (event.target == finishScreenButton) id = 3;
    switch(id) {
        case 1:
            startScreen.classList.toggle('hidden');
            appScreen.classList.toggle('hidden');
            appScreen.classList.toggle('flex');
            break;
        case 2:
            appScreen.classList.toggle('hidden');
            appScreen.classList.toggle('flex');
            finishScreen.classList.toggle('hidden');
            finishScreen.classList.toggle('flex');
            break;
        case 3:
            startScreen.classList.toggle('hidden');
            finishScreen.classList.toggle('hidden');
            finishScreen.classList.toggle('flex');
            break;
    }
}

function start() {
    current = 0;
    changeScreen();
    showSpeed();
    showAccuracy();
}

startButton.addEventListener('click', start);

// text

let loremText;
let loremArray = [];
let appScreenText = document.querySelector('.app-screen__text');
let current = -1;
let mispress = 0;

function processKey() {
    if (current != -1) {
        loremArray[current].classList.remove('span_background_orange');
        if (event.key == loremArray[current].innerText) {
            document.querySelector('.keybord-layout-box__message').classList.add('hidden');
            loremArray[current].classList.remove('span_background_red');
            loremArray[current].classList.add('span_color_orange');
            document.body.classList.remove('background_orange-red');
            current++;
            if (current == loremArray.length-2) {
                finishText();
            } else 
                loremArray[current].classList.add('span_background_orange');
        } else if ((event.key != 'Shift') && (event.key != 'CapsLock') && (event.key != 'Alt') && !(event.ctrlkey)) {
            if ((event.key.match(/[a-zA-Z]/)) && (url == urlRu)) {
                document.querySelector('.keybord-layout-box__message').classList.remove('hidden');
            } else if ((event.key.match(/[а-яА-Я]/)) && (url == urlEng)) {
                document.querySelector('.keybord-layout-box__message').classList.remove('hidden');
            }
            loremArray[current].classList.add('span_background_red');
            document.body.classList.add('background_orange-red');
            mispress++;
        }
        showAccuracy();
    }
}

let urlEng = 'https://baconipsum.com/api/?type=meat-and-filler&sentences=5&format=json';
let urlRu = 'https://fish-text.ru/get?type=sentence&number=2';
let url = urlRu;
let ButtonRu = document.querySelector('.start-screen__button_ru');
let ButtonEng = document.querySelector('.start-screen__button_eng');
let Langs = document.querySelector('.start-screen__langs');

function changeActiveButton() {
    ButtonEng.classList.toggle('selected');
    ButtonRu.classList.toggle('selected');
}

Langs.addEventListener('click', () => {
    if ((event.target == ButtonRu) && (url != urlRu)) {
        url = urlRu;
        changeActiveButton();
        getText(url);
    } else if ((event.target == ButtonEng) && (url != urlEng)) {
        url = urlEng;
        changeActiveButton();
        getText(url);
    }

});

function getText(url) {
    startButton.disabled = true;
    fetch(url)
    .then(responce => responce.json())
    .then(respValue => {
        if(url == urlRu) 
            loremText = respValue.text;
        else if(url == urlEng)
            loremText = respValue[0];
        appScreenText.innerHTML = '';
        for(let i = 0; i < loremText.length; i++) {
            appScreenText.innerHTML += `<span>${loremText[i]}</span>`;
        }
        loremArray = document.querySelectorAll('span');
        loremArray[0].classList.add('span_background_orange');
        document.addEventListener('keypress', processKey);
        if (loremText.length > 410) {
            getText(url);
        } else {
            startButton.disabled = false;
        }
        });
}

getText(url);

// finishing

let finishScreenSpeed = document.querySelector('.finish-screen__speed');
let finishScreenAccuracy = document.querySelector('.finish-screen__accuracy');
let finishScreenTitle = document.querySelector('.finish-screen__title');
let finishScreenButton = document.querySelector('.finish-screen__button');

finishScreenButton.addEventListener('click', changeScreen);

function calcQuality() {
    let speedQuality;
    let accuracyQuality;
    if (speed < 200) speedQuality = "ниже среднего";
    else if((speed >= 200) && (speed < 350)) speedQuality = "выше среднего";
    else if((speed >= 350) && (speed < 1060)) speedQuality = "очень высокая";
    else if(speed >= 1060) speedQuality = "рекорд Гиннесса";
    if (accuracy < 0.92) accuracyQuality = "ниже среднего";
    else if((accuracy >= 0.92) && (accuracy < 0.97)) accuracyQuality = "выше среднего";
    else if((accuracy >= 0.97) && (accuracy <= 1)) accuracyQuality = "очень высокая";
    return [speedQuality, accuracyQuality];
}

function finishText() {
    finishScreenSpeed.innerText = `Ваша скорость - ${Math.round(speed)} зн/мин`;
    finishScreenAccuracy.innerText = `Ваша точность - ${Math.round(accuracy*100)}%`;
    finishScreenTitle.innerText = `Тест закончен!
                                   Ваша скорость - ${calcQuality()[0]}.
                                   Ваша точность - ${calcQuality()[1]}.`;
    changeScreen(2);
    clear();
}

// speed and accuracy

let speedTimerId;
let speed = 0;

function showSpeed() {
    let startTime = new Date();
    speedTimerId = setTimeout(function tick(){
        let currentTime = new Date();
        let minutesPassed = (currentTime-startTime)/1000/60;
        speed = current/minutesPassed;
        appScreenSpeed.innerHTML = `${Math.round(speed)} <span class="span_font-size_16">Знак/Мин</span> `;
        speedTimerId = setTimeout(tick, 500);
    }, 500);
}

let accuracyTimerId;
let accuracy = 1;

function showAccuracy() {
    if (current+mispress != 0)
        accuracy = 1 - mispress/(current+mispress);
    appScreenAccuracy.innerHTML = `${Math.round(accuracy*100)}<span class="span_font-size_16">% Точность</span> `;
}

// restart

let restartButton = document.querySelector('.app-screen__restart-button');

function clear() {
    current = -1;
    mispress = 0;
    speed = 0;
    accuracy = 1;
    document.body.classList.remove('background_orange-red');
    document.querySelector('.keybord-layout-box__message').classList.add('hidden');
    clearTimeout(speedTimerId);
    clearTimeout(accuracyTimerId);
    appScreenSpeed.innerHTML = `0 <span class="span_font-size_16">Знак/Мин</span> `;
    appScreenAccuracy.innerHTML = `100<span class="span_font-size_16">% Точность</span> `;
}

function restart() {
    changeScreen();
    clear();
    getText(url);
}

restartButton.addEventListener('click', restart);

//