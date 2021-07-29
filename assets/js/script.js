//declare dom variables
const weatherEl = document.querySelector("#currentWeather")
const searchEl = document.querySelector("#searchForm");
const searchValue = document.querySelector("#search");
const searchBtnEl = document.querySelector("#search-btn");

//funciton which handles search inputs
let formSubmitHandler = function() {
    event.preventDefault();

    let search = searchValue.value.trim();
    if(search) {
        getWeatherData(search);
    };
};

//get response from api 
const getWeatherData = function(city) {
    const apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bc5897eea54f7f82154e145b1c1db2dc"
    fetch(apiUrl).then(function(response){
        //check if there is a response
        if(response.ok){ 
            response.json().then(function(data) {
                // console.log(data.list[0].main.temp, data.list[0].main.humidity, data.list[0].wind.speed);
                displayWeatherData(data, city);
            })
        } else {
            //let user know if there was an issues 
                alert("Error: City Not Found");
        };     
    })
    //catch network errors
    .catch(function(error) {
        alert("Unable to connect");
    });
};

//displays weather data on page
const displayWeatherData = function(data, city) {
    console.log(data.list)
    //take unix date and turn it into a readable date
    getDate(data, 0);
    console.log(data.list[0].uv)
    weatherEl.textContent="";

    let weatherBox = document.createElement("div");
    // weatherBox.innerHTML = (
    //     `<h2>${city} ${dateDisplay}</h2>
    //     <ul> 
    //     <li>Temp: ${data.list[0].main.temp}℉</li>
    //     <li>Wind: ${data.list[0].wind.speed} MPH</li>
    //     <li>Humidity: ${data.list[0].main.humidity}%</li>
    //     </ul>`
        
    // )
    //creates a header element to store the city name, date, and weather icon
    let timeAndCity = document.createElement("h2") 
    timeAndCity.textContent = (`${city.toUpperCase()} ${dateDisplay}`);

    //creates an unordered list to store the weather descriptions 
    let weatherDesc = document.createElement("ul");
    //creates a listed item for the day's temperature 
    let temp = document.createElement("li");
    temp.textContent = (`Temp: ${data.list[0].main.temp}℉`);

    //creates a listed item for the day's wind speed
    let wind = document.createElement("li");
    wind.textContent = (`Wind: ${data.list[0].wind.speed} MPH`)

    //creates a listed item for the day's humidity 
    let humidity = document.createElement("li");
    humidity.textContent = (`Humidity: ${data.list[0].main.humidity}%`);

    //creates a colord-coded item for the day's UV 
    // let uv = document.createElement("li"); 
    // uv = data.list[0].
    
    
    weatherDesc.append(temp);
    weatherDesc.append(wind);
    weatherDesc.append(humidity);
    

    weatherBox.append(timeAndCity);
    weatherBox.append(weatherDesc);
    weatherEl.appendChild(weatherBox);
};

//formats the date 
const getDate = function(data, index) {

    let unixDate = data.list[index].dt
    let date = new Date(unixDate * 1000);
    
    let month = date.getMonth() +1;
    let day = date.getDate();
    let year = date.getFullYear();
    
    return dateDisplay = `(${month}/${day}/${year})`;
};

searchEl.addEventListener("submit", formSubmitHandler);