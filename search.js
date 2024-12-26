const API_KEY = "J4BL7R2WRB5A6KFZK64VGDPLN";
const params = new URLSearchParams(window.location.search);
const search = params.get("searchbar");

class Timer {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.overallTime = 0;
    }

    _getTimeElapsedSinceLastStart() {
        if (!this.startTime) {
            return 0;
        }

        return Date.now() - this.startTime;
    }

    start() {
        if (this.isRunning) {
            return console.error("Timer is already running");
        }

        this.isRunning = true;

        this.startTime = Date.now();
    }

    stop() {
        if (!this.isRunning) {
            return console.error("Timer is already stopped");
        }

        this.isRunning = false;

        this.overallTime =
            this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    reset() {
        this.overallTime = 0;

        if (this.isRunning) {
            this.startTime = Date.now();
            return;
        }

        this.startTime = 0;
    }

    getTime() {
        if (!this.startTime) {
            return 0;
        }

        if (this.isRunning) {
            return this.overallTime + this._getTimeElapsedSinceLastStart();
        }

        return this.overallTime;
    }
}

const timer = new Timer();
setInterval(() => {
    const timeInSeconds = Math.round(timer.getTime() / 1000);
    document.getElementById("time").innerText = timeInSeconds;
}, 100);

const errorScreen = document.querySelector(".error-screen");
const errorMessage = document.querySelector(".error-screen h1");

const loadingScreen = document.querySelector(".loading-screen");

const degreeCels = "\u00B0C";
const degreeFahr = "\u00B0F";

const celsButton = document.querySelector("#cels");
const fahrButton = document.querySelector("#fahr");

console.log(search);

let curDate;
let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}/today?key=${API_KEY}`;

function toCelsius(temp) {
    return ((temp - 32) * (5 / 9)).toFixed(1);
}

function toFahr(temp) {
    return (temp * 1.8 + 32).toFixed(1);
}

function weatherInfoDom(
    temp,
    maxTemp,
    minTemp,
    feelsLike,
    dew,
    humidity,
    precipitation,
    icon,
    conditions
) {
    const tempNode = document.querySelector(".temp");
    const maxTempNode = document.querySelector(".max-temp p");
    const minTempNode = document.querySelector(".min-temp p");
    const feelsLikeNode = document.querySelector(".feels-like p");
    const dewNode = document.querySelector(".dew p");
    const humidityNode = document.querySelector(".humidity p");
    const precipitationNode = document.querySelector(".precipitation p");
    const iconNode = document.querySelector(".icon img");
    const conditionNode = document.querySelector(".weather-type");
    humidityNode.textContent = `${humidity} %`;
    precipitationNode.textContent = precipitation
        ? `${precipitation} inches`
        : "0 inches";
    iconNode.src = `./assets/images/icons/${icon}.svg`;
    iconNode.height = "200";
    conditionNode.textContent = conditions;

    function displayTemp(degreeUnit) {
        tempNode.textContent = temp + degreeUnit;
        maxTempNode.textContent = maxTemp + degreeUnit;
        minTempNode.textContent = minTemp + degreeUnit;
        feelsLikeNode.textContent = feelsLike + degreeUnit;
        dewNode.textContent = dew + degreeUnit;
    }

    function configureButton(button, toUnit, degreeUnit) {
        button.addEventListener("change", () => {
            temp = toUnit(temp);
            maxTemp = toUnit(maxTemp);
            minTemp = toUnit(minTemp);
            feelsLike = toUnit(feelsLike);
            dew = toUnit(dew);
            displayTemp(degreeUnit);
        });
    }
    displayTemp(degreeFahr);
    configureButton(celsButton, toCelsius, degreeCels);
    configureButton(fahrButton, toFahr, degreeFahr);
}

function callLoadingScreen() {
    loadingScreen.classList.add("show");
    timer.start();
}
function removeLoadingScreen() {
    timer.stop();
    loadingScreen.classList.remove("show");
}

async function getWeatherInfo() {
    try {
        let response = await fetch(url);
        console.log(response.status);
        if (!response.ok) {
            errorMessage.textContent = `HTTP error! Status: ${response.status}`;
            throw new Error(`HTTP error! Status: ${response.status}`);
            return;
        } else {
            let data = await response.json();
            return data;
        }
    } catch (err) {
        console.log(err);
    }
}

async function main() {
    try {
        callLoadingScreen();
        let data = await getWeatherInfo();
        removeLoadingScreen();
        console.log(data);
        weatherInfoDom(
            data.currentConditions.temp,
            data.days[0]["tempmax"],
            data.days[0]["tempmin"],
            data.currentConditions.feelslike,
            data.currentConditions.dew,
            data.currentConditions.humidity,
            data.currentConditions.precip,
            data.currentConditions.icon,
            data.currentConditions.conditions
        );
    } catch (err) {
        console.log(err);
        errorScreen.classList.add("show");
    }
}
// Add some content for designing loading page here

// Then in main hide that content once data is loaded
main();

// document.querySelector("body").textContent = search;

//TODO: Loading Screen (Optional)
//TODO: Error Handling
