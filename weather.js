var key = config.SECRET_API_KEY; 


function sumbitName(ev){
    ev.preventDefault(); 
    getWeather()
}

const loader = document.createElement("div");
loader.classList.add("spinner-border", "spinner")

document.getElementById("search").addEventListener("click", sumbitName) 

async function getWeather() 
{
    city = document.getElementById("city-name")
    cityName = (city.value).toLowerCase()

    const content = document.querySelector('.content'); 
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
    "https://api.openweathermap.org/data/2.5/onecall?lat="+lat +"&lon="+lon+"&appid=" +key
    );

    let json = await detailed_response.json(); 
    console.log(json); 


    content.classList.remove("d-flex", "justify-content-center", "align-items-center")

    const weather_table = document.createElement("table"); 
    weather_table.classList.add("table", "table-dark")
    const row1 = document.createElement("tr")
    const row2 = document.createElement("tr")

    row1.appendChild(create_td("sunrise", json["current"]["sunrise"]))
    row1.appendChild(create_td("sunset", json["current"]["sunset"]))
    row1.appendChild(create_td("wind_speed", json["current"]["wind_speed"]))

    weather_table.appendChild(row1);
    content.appendChild(weather_table); 

   content.removeChild(loader)
    
}

function create_td(name, value){
    let td = document.createElement("td");
    let h5 = document.createElement("h5"); 
    h5.innerText = name; 
    let p = document.createElement("p"); 
    p.innerText=value; 
    td.appendChild(h5); 
    td.appendChild(p); 
    return td;  
}
  




getWeather()