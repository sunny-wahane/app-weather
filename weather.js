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

    const weather_table = document.createElement("table"); 
    weather_table.classList.add("table", "table-dark")
    const row1 = document.createElement("tr")
    const row2 = document.createElement("tr")


    //To do : Look into the sunset and sunrise time and veryify whether they are correct
    let sunrise_time = new Date(json["current"]["sunrise"])
    sunrise_time = sunrise_time.toLocaleTimeString()

    let sunset_time = new Date(json["current"]["sunset"])
    sunset_time = sunset_time.toLocaleTimeString();  

    row1.appendChild(create_td("Sunrise",sunrise_time ))
    row1.appendChild(create_td("Sunset", sunset_time))
    row1.appendChild(create_td("Wind Speed", json["current"]["wind_speed"], "m/s"))
    row1.appendChild(create_td("Precipitation", json["hourly"][0]["pop"]*100, "%"))
    row1.appendChild(create_td("Atmospheric Temperature", json["current"]["dew_point"],"°C"))


    row2.appendChild(create_td("Pressure", json["current"]["pressure"], "hPa"))
    row2.appendChild(create_td("Humidity", json["current"]["humidity"], "%"))
    row2.appendChild(create_td("Visibility", json["current"]["visibility"]/1000, "KM"))
    row2.appendChild(create_td("Feels Like", json["current"]["feels_like"], "°C"))
    row2.appendChild(create_td("Uvi Index", json["current"]["uvi"]))


    weather_table.appendChild(row1);
    weather_table.appendChild(row2); 
    content.appendChild(weather_table); 
}


function create_td(name, value, unit=""){
    let td = document.createElement("td");
    let h5 = document.createElement("h5"); 
    h5.innerText = name; 
    let p = document.createElement("p"); 
    p.innerText= (value+" " + unit); 
    td.appendChild(h5); 
    td.appendChild(p); 
    return td;  
}
  
getWeather(); 