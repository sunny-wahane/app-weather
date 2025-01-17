var key = "8edcc5a863302c9c94f3ab8ce983617d"; 

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
        alert("Not able to find the weather data for the city"); 
        city.value = 'bhopal'
        getWeather(); 
        return; 
    } 



    let lat = location_data["coord"]["lat"]; 
    let lon = location_data["coord"]["lon"]; 

    detailed_response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat="+lat +"&lon="+lon+"&units=metric" + "&appid=" +key
    );

    let json = await detailed_response.json(); 

    content.classList.remove("d-flex", "justify-content-center", "align-items-center")

    create_main_info(json, cityName); 
    create_info(json); 
    create_week_data(json);    

    content.removeChild(loader)
    
}


function create_main_info(json, cityName){
    const generic_info = document.createElement("div"); 
    generic_info.classList.add("generic-info"); 

    const weather_overview = document.createElement("div"); 
    weather_overview.classList.add("weather-overview", "p-4"); 

    const h1 = document.createElement("h1"); 
    h1.innerText = cityName[0].toUpperCase() + cityName.slice(1);  
    const h3 = document.createElement("h3"); 
    h3.innerText = json["current"]["weather"][0]["main"]; 
    const p = document.createElement("p"); 
    p.classList.add("main-temp");
    p.innerText = json["current"]["temp"] + "°C"; 

    const p2 = document.createElement("p"); 
    p2.innerText = "H: " + json["daily"][0]["temp"]["max"]+"°" + " L: " + json["daily"][0]["temp"]["min"]+"°"; 
    p2.classList.add("fs-5");

    weather_overview.appendChild(h1); 
    weather_overview.appendChild(h3); 
    weather_overview.appendChild(p); 
    weather_overview.appendChild(p2); 


    const hourly_info = document.createElement("div"); 
    hourly_info.classList.add("two-four-weather"); 

    for(let i = 2 ;i<=24; ++i){
        hourly_info.appendChild(create_hour_divs(json["hourly"][i])); 
    }


    generic_info.appendChild(weather_overview); 
    generic_info.appendChild(hourly_info); 
    content.appendChild(generic_info); 
  
   


}

function create_hour_divs(hour_info){ 
    const div = document.createElement("div"); 

    div.classList.add("hour-info")

    const h4 = document.createElement("h4"); 
    const img = document.createElement("img"); 
    const p = document.createElement("p"); 

    h4.innerText = (new Date(hour_info["dt"]*1000)).getHours(); 
    img.setAttribute("src", "http://openweathermap.org/img/wn/" + hour_info["weather"][0]["icon"] +"@2x.png");
    p.innerText = hour_info["temp"] +"°C"; 

    div.appendChild(h4); 
    div.appendChild(img); 
    div.appendChild(p); 
    return div; 

}





function create_info(json){

    const weather_table = document.createElement("div"); 
    weather_table.classList.add("middle-info", "p-5")

    let sunrise_time = new Date(json["current"]["sunrise"]*1000)
    sunrise_time = sunrise_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    let sunset_time = new Date(json["current"]["sunset"]*1000)
    sunset_time = sunset_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  

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
    div.classList.add("general-weather-spec"); 
    div.style.width = "350px"
    let h5 = document.createElement("h5"); 
    h5.innerText = name; 
    let p = document.createElement("p"); 
    p.innerText= (value+" " + unit); 
    div.appendChild(h5); 
    div.appendChild(p); 
    return div;  
}
  
function create_week_data(json){

    const responsive_div = document.createElement("div"); 
    responsive_div.classList.add("table-responsive", "seven-day", "m-5", "p-3"); 

    const table = document.createElement("table"); 

    table.classList.add("table", "table-striped", "table-hover"); 

    const thead = document.createElement("thead"); 
    const thead_tr = document.createElement("tr"); 

    thead_tr.appendChild(create_table_value("Day", "th"))
    thead_tr.appendChild(create_table_value("", "th"))
    thead_tr.appendChild(create_table_value("Temperature", "th"))
    thead_tr.appendChild(create_table_value("Clouds", "th"))
    thead_tr.appendChild(create_table_value("Humidity", "th"))

    thead.appendChild(thead_tr); 
    const tbody = document.createElement("tbody");


    for(let i=1;i<=7; ++i){
        tbody.appendChild(create_table_content(json["daily"][i])); 
    }

    table.appendChild(thead); 
    table.appendChild(tbody); 

    responsive_div.appendChild(table); 

    content.appendChild(responsive_div); 

}

function create_table_value(heading, type){
    let th1 = document.createElement(type);
    th1.innerText = heading; 
    return th1; 
}

function create_table_content(daily_data){
    let tbody_tr = document.createElement("tr");    
    tbody_tr.appendChild(create_table_value(new Date(daily_data["dt"]*1000).toLocaleDateString('en-US', {weekday:'short'}), "th")); 
    let img = document.createElement("img"); 
    img.setAttribute("src", "http://openweathermap.org/img/wn/" + daily_data["weather"][0]["icon"] +"@2x.png");
    let td_img = create_table_value("", "td");
    td_img.appendChild(img); 
    tbody_tr.appendChild(td_img);  
    tbody_tr.appendChild(create_table_value(daily_data["temp"]["day"] + "°C", "td")); 
    tbody_tr.appendChild(create_table_value(daily_data["clouds"] + "%", "td")); 
    tbody_tr.appendChild(create_table_value(daily_data["humidity"] +"%", "td")); 

    return tbody_tr; 

}

getWeather(); 
