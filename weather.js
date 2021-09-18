var key = config.SECRET_API_KEY; 


function sumbitName(ev){
    ev.preventDefault(); 
    getWeather()
}

document.getElementById("search").addEventListener("click", sumbitName) 

async function getWeather(e) 
{
    city = document.getElementById("city")
    cityName = (city.value).toLowerCase()

    response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+key,
        {
            mode: 'cors'
        }
        ); 
    let json
    if(response.ok) {
       json = await response.json();
    } else {
        alert("HTTP-ERROR: " + response.status)
    } 
    console.log(json)
}