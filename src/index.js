document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('weatherBtn').addEventListener('click', getWeather);
})
function getWeather() {
    const city = document.getElementById('cityInput').value.trim();

    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city');
    }
}

let currentDayIndex= 0;
let weeklyWeatherData = [];

async function fetchWeatherData(location) {
    const weatherKey = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&elements=datetime%2Ctempmax%2Ctempmin%2Ctemp%2Chumidity%2Cprecip%2Cprecipprob%2Csnow%2Cwindspeed&key=6XFU6XDGM3UREAQCXGA8UAKQZ&contentType=json';

    try{
        const response = await fetch(weatherKey);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);

        const processedWeatherData = processWeatherData(data);
        updateDisplay(processedWeatherData);

        weeklyWeatherData = processedWeatherData.weatherData;
        currentDayIndex = 0;
        updateDisplay(processedWeatherData.cityName, currentDayIndex);

    } catch (error) {
        console.log('Error fetching data');
    }
}

function processWeatherData(data) {
    if (!data || !data.days || data.length < 7) return null;

    const weatherData = data.days.slice(0, 7).map(day => ({
        date: day.datetime,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        currentTemp: day.temp,
        humidity: day.humidity,
        precipitation: day.precip,
        precipProbability: day.precipprob,
        snow: day.snow,
        windSpeed: day.windspeed
    }))

    return {
        cityName: data.resolvedAddress,
        weatherData: weatherData
    }
}

function updateDisplay(weather) {
    if (!weather) {
        alert('Error fetching data, please try again');
        return;
    }

    document.getElementById('cityName').textContent = `7 Day Weather Forecast for ${weather.cityName}`;

    const weatherContainer = document.getElementById('weekWeather');
    weatherContainer.innerHTML = '';

    weather.weatherData.forEach(day => {
        const weatherDiv = document.createElement('div');
        weatherDiv.innerHTML = `
        <h3>${day.date}</h3>
        <p>High: ${day.tempMax}, Low: ${day.tempMin}<p>
        <p>Current Temperature: ${day.temp}<p>
        <p>Humidity: ${day.humidity}<p>
        <p>Precipitation: ${day.precip}<p>
        <p>Chance of Rain: ${day.precipProbability}<p>
        <p>Snow: ${day.snow}<p>
        <p>Wind Speed: ${day.windSpeed}<p>
        `;

        weatherContainer.appendChild(weatherDiv);
    })

    document.getElementById('weatherDisplay').style.display = 'block';
}
