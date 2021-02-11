'use strict';

//

let startButton = document.querySelector('.start-screen__button');
let startScreen = document.querySelector('.start-screen');
let appScreen = document.querySelector('.app-screen');

function changeScreen() {
    startScreen.classList.add('start-screen_hidden');
    appScreen.classList.remove('app-screen_hidden');
    appScreen.classList.add('flex');
}

startButton.addEventListener('click', changeScreen);

//

let loremText;
let loremArray = [];
let appScreenText = document.querySelector('.app-screen__text');
let current = 0;

function pressButton() {
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
    }
}

let promise = fetch('https://baconipsum.com/api/?type=meat-and-filler&sentences=5&format=text')
                    .then(responce => responce.text())
                    .then(respValue => {
                        loremText = respValue;
                        console.log(loremText.length);
                        for(let i = 0; i < loremText.length; i++) {
                            appScreenText.innerHTML += `<span>${loremText[i]}</span>`;
                        }
                        loremArray = document.querySelectorAll('span');
                        loremArray[0].classList.add('span_background_orange');
                        document.addEventListener('keydown', pressButton);
                    });