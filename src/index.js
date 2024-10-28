import './style.css';

import humidityIcon from './img/humid.png';
import rainIcon from './img/rain.png';
import umbrellaIcon from './img/umbrella.png';
import snowIcon from './img/snow.png';
import windIcon from './img/wind.png';
import sunIcon from './img/sun.png';
import sunriseIcon from './img/sunrise.png';
import sunsetIcon from './img/sunset.png';
import dayBackground from './img/dayBack.jpg';
import nightBackground from './img/nightBack2.jpg';


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('weatherBtn').addEventListener('click', getData);
    document.getElementById('prevDay').addEventListener('click', showPrevDay);
    document.getElementById('nextDay').addEventListener('click', showNextDay);
    
    document.getElementById('cityInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            getData();
        }
    });
})

let currentDayIndex= 0;
let weeklyWeatherData = [];


async function getData() {
    const city = document.getElementById('cityInput').value.trim();

    if (!city) {
        alert('Please enter a city');
    }

    const weatherData = await fetchWeatherData(city);
    const processedWeatherData =processWeatherData(weatherData);
    const solarData = await fetchSolarData(city);
    const processedSolarData = processSolarData(solarData);

    if (processedWeatherData) {
        weeklyWeatherData = processedWeatherData.weatherData;
        currentDayIndex = 0;

        if (processedSolarData && processedWeatherData.timezoneOffset) {
            switchBackground(processedSolarData.sunrise, processedSolarData.sunset, processedWeatherData.timezoneOffset);
        }

        updateDisplay(processedWeatherData.cityName, currentDayIndex, processedSolarData);
    }


}

async function fetchWeatherData(location) {
    const weatherKey = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&elements=datetime%2Ctempmax%2Ctempmin%2Ctemp%2Chumidity%2Cprecip%2Cprecipprob%2Csnow%2Cwindspeed&key=6XFU6XDGM3UREAQCXGA8UAKQZ&contentType=json`;
    
    try{
        const response = await fetch(weatherKey);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.log('Error weather fetching data');
    }
}

function processWeatherData(data) {
    if (!data || !data.days || data.days.length < 7) {
        return null;
    }

    const weatherData = data.days.slice(0, 7).map(day => ({
        date: day.datetime,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        currentTemp: day.temp,
        humidity: day.humidity,
        precip: day.precip,
        precipProbability: day.precipprob,
        snow: day.snow,
        windSpeed: day.windspeed
    }))

    const timezone = data.timezone;
    const timezoneOffset = data.tzoffset;

    return {
        cityName: data.resolvedAddress,
        weatherData: weatherData,
        timezone,
        timezoneOffset
    }
}

async function fetchSolarData(location) {
    const solarKey = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&elements=datetime%2Csunrise%2Csunset&key=6XFU6XDGM3UREAQCXGA8UAKQZ&contentType=json`;

    try { 
        const response = await fetch(solarKey);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const solarData = await response.json();
        console.log(solarData);
        return solarData;
        

    } catch (error) {
        console.log('Error solar fetching data');
    }
}

function processSolarData(solarData) {
    if (!solarData || !solarData.days || solarData.days.length === 0) {
        console.error('Invalid solar data structure', solarData);
        return null;
    }

    const date = solarData.days[0].datetime;
    const sunriseRaw = solarData.days[0].sunrise;
    const sunsetRaw = solarData.days[0].sunset;
    const sunriseTime = new Date(`${date}T${sunriseRaw}`);
    const sunsetTime = new Date(`${date}T${sunsetRaw}`);

    const options = { hour: '2-digit', minute: '2-digit' };
    const sunriseLocalTime = sunriseTime.toLocaleTimeString([], options);
    const sunsetLocalTime = sunsetTime.toLocaleTimeString([], options);

    return {
        sunrise: sunriseLocalTime,
        sunset: sunsetLocalTime
    };
}



function updateDisplay(cityName, dayIndex, solarData) {
    if (!weeklyWeatherData || weeklyWeatherData.length === 0) {
        alert('No weekly data available');
        return;
    }

    document.getElementById('cityName').textContent = `${cityName}`;

    const dayWeather = weeklyWeatherData[dayIndex];
    const dayWeatherContainer = document.getElementById('dailyWeather');
    dayWeatherContainer.innerHTML = `
        <h3>${dayWeather.date}</h3>
        <div class='weatherMain'>
        <p>Current Temperature: ${dayWeather.currentTemp}ºF</p>
        <img src='${sunIcon}' alt='Temperature Icon' class='mainIcon'>
        <p>High: ${dayWeather.tempMax}ºF, Low: ${dayWeather.tempMin}ºF</p>
        </div>
        <div class='weatherItems'>
        <div class='weatherItem'>
        <img src='${humidityIcon}' alt='Humidity Icon' class='weatherIcon'>
        <p>Humidity: ${dayWeather.humidity}%</p>
        </div>
        <div class='weatherItem'>
        <img src='${rainIcon}' alt='Precipitation Icon' class='weatherIcon'>
        <p>Precipitation: ${dayWeather.precip} inches</p>
        </div>
        <div class='weatherItem'>
        <img src='${umbrellaIcon}' alt='Precipitation Probability Icon' class='weatherIcon'>
        <p>Chance of Rain: ${dayWeather.precipProbability}%</p>
        </div>
        <div class='weatherItem'>
        <img src='${snowIcon}' alt='Snow Icon' class='weatherIcon'>
        <p>Snow: ${dayWeather.snow} inches</p>
        </div>
        <div class='weatherItem'>
        <img src='${windIcon}' alt='Wind Icon' class='weatherIcon'>
        <p>Wind Speed: ${dayWeather.windSpeed} mph</p>
        </div>
        </div>
        `;

        if (solarData) {
            const solarContainer = document.getElementById('solarData');
            solarContainer.innerHTML = `
            <div class='solarMain'>
            <div class='solarItem'>
            <img src='${sunriseIcon}' alt='Sunrise Icon' class='solarIcon'>
            <p>Sunrise: ${solarData.sunrise}</p>
            </div>
            <div class='solarItem'>
            <img src='${sunsetIcon}' alt='Sunset Icon' class='solarIcon'>
            <p>Sunset: ${solarData.sunset}</p>
            </div>
            </div>
            `;
        }

        document.getElementById('prevDay').style.display = dayIndex > 0 ? 'inline' : 'none';
        document.getElementById('nextDay').style.display = dayIndex < weeklyWeatherData.length - 1 ? 'inline' : 'none';

    document.getElementById('weatherDisplay').style.display = 'block';
}

function showPrevDay() {
    if (currentDayIndex > 0) {
        currentDayIndex--;
        updateDisplay(document.getElementById('cityName').textContent, currentDayIndex);
    }
}

function showNextDay() {
    if (currentDayIndex < weeklyWeatherData.length -1) {
        currentDayIndex++;
        updateDisplay(document.getElementById('cityName').textContent, currentDayIndex);
    }
}

function switchBackground(sunriseTimeString, sunsetTimeString, timezoneOffset) {
    const currentUTC = new Date();
    const cityTime = new Date(currentUTC.getTime() + timezoneOffset * 60 * 60 * 1000);

    const [sunriseHour, sunriseMinute] = sunriseTimeString.split(':').map(Number);
    const [sunsetHour, sunsetMinute] = sunsetTimeString.split(':').map(Number);
    const sunriseTime = new Date(cityTime);
    sunriseTime.setHours(sunriseHour, sunriseMinute, 0, 0);
    const sunsetTime = new Date(cityTime);
    sunsetTime.setHours(sunsetHour, sunsetMinute, 0, 0);

    console.log('Current time in searched city', cityTime);
    console.log('Sunrise Time', sunriseTime)
    console.log('Sunset Time', sunsetTime);;

    if (cityTime < sunriseTime || cityTime > sunsetTime) {
        document.body.style.backgroundImage = `url('${nightBackground}')`;
        console.log('Night Time');
    } else {
        document.body.style.backgroundImage = `url('${dayBackground}')`;
        console.log('Day Time');
    }
}