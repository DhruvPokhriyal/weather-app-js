const API_KEY = "J4BL7R2WRB5A6KFZK64VGDPLN";
const params = new URLSearchParams(window.location.search);
const search = params.get("searchbar");

console.log(search);

let curDate;
let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${search}/today?key=${API_KEY}`;

async function getWeatherInfo() {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function main() {
    let data = await getWeatherInfo();
    console.log(data);
}
// Add some content for designing loading page here

// Then in main hide that content once data is loaded
main();

// document.querySelector("body").textContent = search;
