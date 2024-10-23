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

fetchWeatherData();