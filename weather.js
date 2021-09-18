let key = config.SECRET_API_KEY; 


getWeather(cityName) 
{
    cityName = cityName.toLowerCase();
    response = await fetch(
        "api.openweathermap.org/data/2.5/weather?q=cityName&appid=key",
        )
    let json
    if(response.ok) {
       json = await response.body();
    } else {
        alert("HTTP-ERROR: " + response.status)
    } 
    console.log(json)
}