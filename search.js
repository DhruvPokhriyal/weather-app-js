const API_KEY = "J4BL7R2WRB5A6KFZK64VGDPLN";
const params = new URLSearchParams(window.location.search);
const search = params.get("searchbar");

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

async function getWeatherInfo() {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
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

function callLoadingScreen() {}
function removeLoadingScreen() {}

async function main() {
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
}
// Add some content for designing loading page here

// Then in main hide that content once data is loaded
main();

// document.querySelector("body").textContent = search;

//TODO: Loading Screen
//TODO: Error Handling
