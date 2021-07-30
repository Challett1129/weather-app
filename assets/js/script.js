//declare dom variables
const weatherEl = document.querySelector("#currentWeather")
const searchEl = document.querySelector("#searchForm");
const searchValue = document.querySelector("#search");
const searchBtnEl = document.querySelector("#search-btn");
const futureWeather = document.querySelector("#futureWeather");

//funciton which handles search inputs
let formSubmitHandler = function() {
    event.preventDefault();

    let search = searchValue.value.trim();
    if(search) {
        getCity(search);
    };
};

//get response from api 
const getCity = function(city) {
    const apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bc5897eea54f7f82154e145b1c1db2dc"
    fetch(apiUrl).then(function(response){
        //check if there is a response
        if(response.ok){ 
            response.json().then(function(data) {
                // displayWeatherData(data, city);
                getWeatherData(data,city);
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

getWeatherData = function(location, city) {
    //set variables to insert in the api 
    let lat = location.city.coord.lat
    let lon = location.city.coord.lon

    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=bc5897eea54f7f82154e145b1c1db2dc`
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data) {
                displayWeatherData(data, city);
            })
        } else {
            alert("Error: City Not Found");
        };
    })
    .catch(function(error) {
        alert("Unable to connect");
    });
}; 

//displays weather data on page
const displayWeatherData = function(data, city) {

    // take unix date and turn it into a readable date
    getDate(data, 0);

    weatherEl.textContent="";

    let weatherBox = document.createElement("div");
    weatherBox.className += "col-12 weatherToday"
    //creates a header element to store the city name, date, and weather icon
    let timeAndCity = document.createElement("h2") 
    timeAndCity.textContent = (`${city.toUpperCase()} ${dateDisplay}`);
    timeAndCity.className += "p-2"

    //creates an unordered list to store the weather descriptions 
    let weatherDesc = document.createElement("div");
    weatherDesc.className += " p-2";

    //creates a listed item for the day's temperature 
    let temp = document.createElement("div");
    temp.textContent = (`Temp: ${data.daily[0].temp.day}℉`);
    temp.className += "p-2";

    //creates a listed item for the day's wind speed
    let wind = document.createElement("div");
    wind.textContent = (`Wind: ${data.daily[0].wind_speed} MPH`)
    wind.className += "p-2";

    //creates a listed item for the day's humidity 
    let humidity = document.createElement("div");
    humidity.textContent = (`Humidity: ${data.daily[0].humidity}%`);
    humidity.className += "p-2";

    let uv = data.daily[0].uvi
    let uvSpan = document.createElement("span");
    uvSpan.textContent = uv;

    let uvEl = document.createElement("div");
    if(uv <=3) {
        uvSpan.className += "safe badge"
    } else if (uv > 3 && uv <=6) {
        uvSpan.className += "moderate badge";
    } else {
        uvSpan.className += "dangerous badge";
    } 

    uvEl.textContent = (`UV Index: `);
    uvEl.className += "p-2";
    uvEl.append(uvSpan);

    weatherDesc.append(temp);
    weatherDesc.append(wind);
    weatherDesc.append(humidity);
    weatherDesc.append(uvEl);
    

    weatherBox.append(timeAndCity);
    weatherBox.append(weatherDesc);
    weatherEl.appendChild(weatherBox);

    displayFutureWeather(data, city);
};

//get the five day forecast
displayFutureWeather = function(data,city) {
    console.log(data);
    console.log(city);
    futureWeather.textContent = "";
    for(i=1; i < 6; i++) {
    let weatherCards = document.createElement("div");
    weatherCards.className += "col-12 col-lg-3 m-2 card1";

    //creates an unordered list to store the weather descriptions 
    let date = document.createElement("h4");
    date.textContent = (getDate(data, [i]));
    date.className += "m-2 p-2";
    
    //creates a listed item for the day's temperature 
    let temp = document.createElement("div");
    temp.textContent = (`Temp: ${data.daily[i].temp.day}℉`);
    temp.className += "m-2 p-2";

    //creates a listed item for the day's wind speed
    let wind = document.createElement("div");
    wind.textContent = (`Wind: ${data.daily[i].wind_speed} MPH`)
    wind.className += "m-2 p-2 ";

    //creates a listed item for the day's humidity 
    let humidity = document.createElement("div");
    humidity.textContent = (`Humidity: ${data.daily[i].humidity}%`);
    humidity.className += "m-2 p-2 ";

    weatherCards.append(date, temp, wind, humidity);
    
    futureWeather.appendChild(weatherCards);
    weatherEl.append(futureWeather);
    }
}

//formats the date 
const getDate = function(data, index) {

    let unixDate = data.daily[index].dt
    let date = new Date(unixDate * 1000);
    
    let month = date.getMonth() +1;
    let day = date.getDate();
    let year = date.getFullYear();
    
    return dateDisplay = `(${month}/${day}/${year})`;
};

searchEl.addEventListener("submit", formSubmitHandler);