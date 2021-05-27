"use strict";
const delayMillisecond = 1000; // 1 sec
const displayTimeElement = document.getElementById("displayTime");
const overDisplayTimeElement = document.getElementById("overDisplayTime");
const screenUnder920px = window.matchMedia("(max-width: 920px)");

// Menu button and sliders
const buttonPlayPause = document.getElementById("btnPlayPause");
const sliderTimer = document.getElementById("rangeTime");
const sliderFontSize = document.getElementById("rangeDisplaySize");
const btnTextColor = document.getElementById("btnBgSwitch");
const btnFullSize = document.getElementById("btnToggleFullScreen");
const btnHelper = document.getElementsByClassName("nav-helper")[0];

// Menu icon
const iconMenu = document.getElementsByClassName("nav-toggle")[0];
const navMenu = document.getElementsByClassName("nav")[0];
const iconBox = document.querySelector('#btnPlayPause > i');
const actionBox = document.getElementsByClassName("btn-play-pause-style")[0];

const iconTimeDisplay = document.querySelector("#nav > div:nth-child(1) > div > div > div.icon-settings");
const iconFontSizeDisplay = document.querySelector("#nav > div:nth-child(2) > div > div > div.icon-settings");

// Timer
let stopWatch;
let startPause = true;

let setTime = 18;
let timeCount = 0;

let changeSetupTime = true;
let overTimeCounterValue = 1;

let countOverTime = 0;

let minutes = 0;
let seconds = 0;
let displayMin = 0;
let displaySec = 0;

let setTimePadStart = "";

// Style
let bgColor = document.body;
let currentFontSize = 26;
let valueFontSize = 0;
let currentSliderFontSize = 26;
let percentOfFontSize = 0;
let secondTimeSizeDisplay = 0;

// Listener
window.onload = screenIconMenu;
screenUnder920px.onchange = screenIconMenu;

document.addEventListener('keydown', logKey => {
    if (logKey.code === 'Space') return startPauseEvent(logKey);

    if (logKey.code === 'ArrowUp') return upTimer();

    if (logKey.code === 'ArrowDown') return downTime();

    if (logKey.code === 'ArrowRight') return fontSizeUp();

    if (logKey.code === 'ArrowLeft') return fontSizeDown();

    if (logKey.code === 'KeyB') return backgroundColorSwitch();

    if (logKey.code === 'KeyF') return toggleFullScreen();

    if (logKey.code === 'KeyR') return setNewTime();

    if (logKey.code === 'KeyH') return btnNavHelper();
}, false);

buttonPlayPause.onclick = (e) => {
    return startPauseEvent(e);
}

sliderTimer.oninput = function () {
    setTime = Number(sliderTimer.value);

    clearInterval(stopWatch);
    startPause = true;

    changeSetupTime = true;

    if (displayTimeElement.textContent === "00:00") {
        overTimeReset();
    }

    if (screenUnder920px.matches === true) {
        iconTimeDisplay.innerHTML = `<p>${setTime} min</p>`;
    }

    setTimeDisplay();
    btnPlayPauseResetStyle();
}

sliderFontSize.oninput = function () {
    currentSliderFontSize = sliderFontSize.value;

    if (currentSliderFontSize > currentFontSize) {
        fontSizeUp();
    } else {
        fontSizeDown();
    }

    if (screenUnder920px.matches === true) {
        percentOfFontSize = parseInt(((sliderFontSize.value - 14) / 25) * 100);
        iconFontSizeDisplay.innerHTML = `<p>${percentOfFontSize}%</p>`;
    }

    secondDisplayOverTime();
}

// Function
function btnBoxPlayPause() {
    if (actionBox.className === "btn-play-pause-style") {
        actionBox.className = "btn-play-pause-style hover-opacity";
        iconBox.className = "fas fa-pause fa-2x";

        navMenu.className = "nav";
        iconMenu.className = "nav-toggle hover-opacity";
    } else if (actionBox.className === "btn-play-pause-style hover-opacity" && navMenu.className === "nav") {
        actionBox.className = "btn-play-pause-style";
        iconBox.className = "fas fa-play fa-2x";

        iconMenu.className = "nav-toggle";
        navMenu.className = "nav";
    } else if (actionBox.className === "btn-play-pause-style hover-opacity expanded") {
        actionBox.className = "btn-play-pause-style";
        iconBox.className = "fas fa-play fa-2x";

        iconMenu.className = "nav-toggle expanded";
        navMenu.className = "nav expanded";
    }
}

function btnPlayPauseResetStyle() {
    if (actionBox.className === "btn-play-pause-style hover-opacity" && iconMenu.className === "nav-toggle hover-opacity") {
        actionBox.className = "btn-play-pause-style";
        iconBox.className = "fas fa-play fa-2x";

        iconMenu.className = "nav-toggle";
        navMenu.className = "nav";
    } else if (actionBox.className === "btn-play-pause-style hover-opacity" && iconMenu.className === "nav-toggle hover-opacity expanded") {
        actionBox.className = "btn-play-pause-style";
        iconBox.className = "fas fa-play fa-2x";

        iconMenu.className = "nav-toggle expanded";
        navMenu.className = "nav expanded";
    }
}

function setNewTime() {
    setTimeDisplay();
    overTimeReset();

    clearInterval(stopWatch);
    startPause = true;

    displayTimeElement.textContent = '18:00';
    overTimeCounterValue = 1;

    setTime = Number(18);
    timeCount = (setTime * 60) - 1;

    rangeTime.value = 18;

    if (screenUnder920px.matches === true) {
        iconTimeDisplay.innerHTML = '<p>18 min</p>';
    }

    btnPlayPauseResetStyle();
}

function startPauseEvent(event) {
    event.preventDefault();
    btnBoxPlayPause();

    if (changeSetupTime) {
        setTimeParam();
    }

    if (btnHelper.className === "nav-helper expanded") {
        btnNavHelper();
    }

    if (startPause == true) {
        stopWatch = setInterval(countDown, delayMillisecond);
        startPause = false;

    } else {
        clearInterval(stopWatch);
        startPause = true;

        overDisplayTimeElement.textContent = '00:00';
        overDisplayTimeElement.style.display = 'none';

        overTimeCounterValue = 1;

        if (displayTimeElement.textContent === "00:00") {
            setNewTime();
        } else {
            btnPlayPauseResetStyle();
        }
    }

    changeSetupTime = false;
}

function countDown() {
    if (timeCount >= 0) {
        minutes = Math.floor(timeCount / 60);
        seconds = Math.floor(timeCount % 60);

        displayMin = String(minutes).padStart(2, 0);
        displaySec = String(seconds).padStart(2, 0);

        displayTimeElement.textContent = `${displayMin}:${displaySec}`;

        timeCount--;
    } else {
        countOverTime++;

        overDisplayTimeElement.style.display = 'block';

        overTimeCounter();
    }
}

function overTimeReset() {
    overDisplayTimeElement.textContent = '00:00';
    overDisplayTimeElement.style.display = 'none';
}

function overTimeCounter() {
    minutes = Math.floor(overTimeCounterValue / 60);
    seconds = Math.floor(overTimeCounterValue % 60);

    displayMin = String(minutes).padStart(2, 0);
    displaySec = String(seconds).padStart(2, 0);

    overDisplayTimeElement.textContent = `${displayMin}:${displaySec}`;

    overTimeCounterValue++;
}

function secondDisplayOverTime() {
    secondTimeSizeDisplay = Math.round((sliderFontSize.value / 2) * 0.77);

    if (secondTimeSizeDisplay >= 8) {
        overDisplayTimeElement.style.fontSize = `${secondTimeSizeDisplay}vw`;
    }
}

function setTimeParam() {
    setTime = Number(displayTimeElement.textContent.split(':')[0]);
    timeCount = (setTime * 60) - 1;
}

function setTimeDisplay() {
    if (setTime >= 1 && setTime <= 9) {
        setTimePadStart = String(setTime);
        setTimePadStart = setTimePadStart.padStart(2, "0");

        return displayTimeElement.textContent = `${setTimePadStart}:00`;
    } else {
        return displayTimeElement.textContent = `${setTime}:00`;
    }
}

function upTimer() {
    btnPlayPauseResetStyle();

    if (screenUnder920px.matches === true) {
        rangeTime.value++;
        iconTimeDisplay.innerHTML = `<p>${rangeTime.value} min</p>`;
    }

    if (displayTimeElement.textContent === "00:00") {
        overTimeReset();
    }

    if (setTime < 60) {
        setTime++;
        setTimeDisplay();
    }

    if (startPause == false) {
        clearInterval(stopWatch);
        startPause = true;
    }

    rangeTime.value = setTime;
    changeSetupTime = true;
}

function downTime() {
    btnPlayPauseResetStyle();

    if (screenUnder920px.matches === true) {
        rangeTime.value--;
        iconTimeDisplay.innerHTML = `<p>${rangeTime.value} min</p>`;
    }

    if (displayTimeElement.textContent === "00:00") {
        overTimeReset();
    }

    if (setTime > 1) {
        setTime--;
        setTimeDisplay();
    }

    if (startPause == false) {
        clearInterval(stopWatch);
        startPause = true;
    }

    rangeTime.value = setTime;
    changeSetupTime = true;
}

function fontSizeUp() {
    valueFontSize = parseInt(currentFontSize);

    if (valueFontSize < 39) {
        currentFontSize = displayTimeElement.style.fontSize = valueFontSize + 1 + "vw";
        rangeDisplaySize.value = parseInt(currentFontSize);
    }

    if (screenUnder920px.matches === true) {
        percentOfFontSize = parseInt(((rangeDisplaySize.value - 14) / 25) * 100);
        iconFontSizeDisplay.innerHTML = `<p>${percentOfFontSize}%</p>`;
    }

    secondDisplayOverTime();
}

function fontSizeDown() {
    valueFontSize = parseInt(currentFontSize);

    if (valueFontSize > 14) {
        currentFontSize = displayTimeElement.style.fontSize = valueFontSize - 1 + "vw";
        rangeDisplaySize.value = parseInt(currentFontSize);
    }

    if (screenUnder920px.matches === true) {
        percentOfFontSize = parseInt(((rangeDisplaySize.value - 14) / 25) * 100);
        iconFontSizeDisplay.innerHTML = `<p>${percentOfFontSize}%</p>`;
    }

    secondDisplayOverTime();
}

function backgroundColorSwitch() {
    bgColor.classList.toggle("bg-black");
    displayTimeElement.classList.toggle("text-shadow-color");

    if (btnTextColor.textContent === "Black") {
        btnTextColor.textContent = "Red";
    } else {
        btnTextColor.textContent = "Black";
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();

        btnFullSize.textContent = "Off";
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();

            btnFullSize.textContent = "On";
        }
    }
}

function btnNavHelper() {
    btnHelper.classList.toggle('expanded');
}

function screenIconMenu() {
    if (screenUnder920px.matches === true) {
        setTime = Number(displayTimeElement.textContent.split(':')[0]);
        iconTimeDisplay.innerHTML = `<p>${setTime} min</p>`;

        percentOfFontSize = parseInt(((sliderFontSize.value - 14) / 25) * 100);
        iconFontSizeDisplay.innerHTML = `<p>${percentOfFontSize}%</p>`;
    } else {
        iconTimeDisplay.innerHTML = '<i class="fas fa-stopwatch fa-2x"></i>';
        iconFontSizeDisplay.innerHTML = '<i class="fas fa-text-height fa-2x"></i>';
    }
}

// Navigation menu
(function () {
    let hamburger = {
        nav: document.querySelector('#nav'),
        navToggle: document.querySelector('.nav-toggle'),

        initialize() {
            this.navToggle.addEventListener('click', () => { this.toggle(); });
        },

        toggle() {
            this.navToggle.classList.toggle('expanded');
            this.nav.classList.toggle('expanded');
        },
    };

    hamburger.initialize();
}());