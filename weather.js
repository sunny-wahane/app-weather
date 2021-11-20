var key = config.SECRET_API_KEY; 

function sumbitName(ev){
    ev.preventDefault(); 
    getWeather()
}

const loader = document.createElement("div");
loader.classList.add("spinner-border", "spinner")

const content = document.querySelector('.content'); 

document.getElementById("search").addEventListener("click", sumbitName) 

async function getWeather() 
{
    city = document.getElementById("city-name")
    cityName = (city.value).toLowerCase()

    content.innerHTML = ""; 

    content.classList.add("d-flex", "justify-content-center", "align-items-center")
    
    content.appendChild(loader)

    response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+key,
        {
            mode: 'cors'
        }
        ); 
    let location_data; 
    if(response.ok) {
       location_data = await response.json();
    } else {
        alert("HTTP-ERROR: " + response.status)
    } 

    let lat = location_data["coord"]["lat"]; 
    let lon = location_data["coord"]["lon"]; 

    detailed_response = await fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat="+lat +"&lon="+lon+"&units=metric" + "&appid=" +key
    );

    let json = await detailed_response.json(); 
    console.log(json); 


    content.classList.remove("d-flex", "justify-content-center", "align-items-center")

    create_info(json);    

    content.removeChild(loader)
    
}

function create_info(json){

    const weather_table = document.createElement("div"); 
    weather_table.classList.add("middle-info")

    //To do : Look into the sunset and sunrise time and veryify whether they are correct
    let sunrise_time = new Date(json["current"]["sunrise"])
    sunrise_time = sunrise_time.toLocaleTimeString()

    let sunset_time = new Date(json["current"]["sunset"])
    sunset_time = sunset_time.toLocaleTimeString();  

    weather_table.appendChild(create_td("Sunrise",sunrise_time ))
    weather_table.appendChild(create_td("Sunset", sunset_time))
    weather_table.appendChild(create_td("Wind Speed", json["current"]["wind_speed"], "m/s"))
    weather_table.appendChild(create_td("Precipitation", json["hourly"][0]["pop"]*100, "%"))
    weather_table.appendChild(create_td("Atmospheric Temperature", json["current"]["dew_point"],"°C"))
    weather_table.appendChild(create_td("Pressure", json["current"]["pressure"], "hPa"))
    weather_table.appendChild(create_td("Humidity", json["current"]["humidity"], "%"))
    weather_table.appendChild(create_td("Visibility", json["current"]["visibility"]/1000, "KM"))
    weather_table.appendChild(create_td("Feels Like", json["current"]["feels_like"], "°C"))
    weather_table.appendChild(create_td("Uvi Index", json["current"]["uvi"]))

    content.appendChild(weather_table); 
}


function create_td(name, value, unit=""){
    let div = document.createElement("td");
    div.style.width = "350px"
    let h5 = document.createElement("h5"); 
    h5.innerText = name; 
    let p = document.createElement("p"); 
    p.innerText= (value+" " + unit); 
    div.appendChild(h5); 
    div.appendChild(p); 
    return div;  
}
  
getWeather(); 