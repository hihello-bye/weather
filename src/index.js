document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('weatherBtn').addEventListener('click', getWeather);
    document.getElementById('prevDay').addEventListener('click', showPrevDay);
    document.getElementById('nextDay').addEventListener('click', showNextDay);
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
    const weatherKey = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&elements=datetime%2Ctempmax%2Ctempmin%2Ctemp%2Chumidity%2Cprecip%2Cprecipprob%2Csnow%2Cwindspeed&key=6XFU6XDGM3UREAQCXGA8UAKQZ&contentType=json`;
    
    try{
        const response = await fetch(weatherKey);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);

        const processedWeatherData = processWeatherData(data);
        if (!processedWeatherData) {
            console.log('Error processing data');
            return;
        }

        weeklyWeatherData = processedWeatherData.weatherData;
        currentDayIndex = 0;
        updateDisplay(processedWeatherData.cityName, currentDayIndex);

    } catch (error) {
        console.log('Error fetching data');
    }
}

function processWeatherData(data) {
    if (!data || !data.days || data.days.length < 7) return null;

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

    return {
        cityName: data.resolvedAddress,
        weatherData: weatherData
    }
}

function updateDisplay(cityName, dayIndex) {
    if (!weeklyWeatherData || weeklyWeatherData.length === 0) {
        alert('No weekly data available');
        return;
    }

    const dayWeather = weeklyWeatherData[dayIndex];
    if (!dayWeather) {
        console.log('No data available for selected day');
        return;
    }

    document.getElementById('cityName').textContent = `${cityName}`;

    const dayWeatherContainer = document.getElementById('dailyWeather');
    dayWeatherContainer.innerHTML = `
        <h3>${dayWeather.date}</h3>
        <p>High: ${dayWeather.tempMax}, Low: ${dayWeather.tempMin}</p>
        <p>Current Temperature: ${dayWeather.currentTemp}</p>
        <p>Humidity: ${dayWeather.humidity}</p>
        <p>Precipitation: ${dayWeather.precip}</p>
        <p>Chance of Rain: ${dayWeather.precipProbability}</p>
        <p>Snow: ${dayWeather.snow}</p>
        <p>Wind Speed: ${dayWeather.windSpeed}</p>
        `;

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
