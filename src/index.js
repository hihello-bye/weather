async function fetchWeatherData(location) {
    const weatherKey = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?unitGroup=us&elements=datetime%2Ctempmax%2Ctempmin%2Ctemp%2Chumidity%2Cprecip%2Cprecipprob%2Csnow%2Cwindspeed&key=6XFU6XDGM3UREAQCXGA8UAKQZ&contentType=json';

    try{
        const response = await fetch(weatherKey);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);
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

fetchWeatherData();