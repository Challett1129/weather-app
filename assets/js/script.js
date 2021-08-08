//declare dom variables
const weatherEl = document.querySelector("#currentWeather")
const searchEl = document.querySelector("#searchForm");
const searchValue = document.querySelector("#search");
const searchBtnEl = document.querySelector("#search-btn");
const futureWeather = document.querySelector("#futureWeather");
const prevSearched = document.querySelector("#previous-searches");
const clearBtn = document.querySelector("#clearBtn");
//things to do: remove duplicates from array and limit total number allowed in array, print array to screen, fix spacing. 

let searchedCity = []; 

//funciton which handles search inputs
let formSubmitHandler = function() {
    event.preventDefault();

    let search = searchValue.value.trim();
    if(search) {
        getCity(search);
    };
};

if(localStorage.getItem("search")) {
    searchedCity = JSON.parse(localStorage.getItem("search"));
} 

saveSerach = function() {
    let search = searchValue.value.trim().toLowerCase();
    if(searchedCity.length == 10) {
        searchedCity.splice(0, 1)
    }
    if(searchedCity.includes(search) == false) {
        searchedCity.push(search);
    }
    localStorage.setItem("search", JSON.stringify(searchedCity));
    
    let firstCapital = search.substring(0,1).toUpperCase() + search.substring(1);
    searchValue.value ="";
    renderSidebar();
    console.log(firstCapital)
}

//get response from api 
const getCity = function(city) {
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bc5897eea54f7f82154e145b1c1db2dc"
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

    const apiUrl = `httpss://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=bc5897eea54f7f82154e145b1c1db2dc`
    fetch(apiUrl).then(function(response){  
        if(response.ok) {
            response.json().then(function(data) {
                displayWeatherData(data, city);
                saveSerach();
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

    //creates a div list to store the weather descriptions 
    let weatherDesc = document.createElement("div");
    weatherDesc.className += " p-2";

    //creates a div item for the day's temperature 
    let temp = document.createElement("div");
    temp.textContent = (`Temp: ${data.daily[0].temp.day}℉`);
    temp.className += "p-2";

    //creates a div item for the day's wind speed
    let wind = document.createElement("div");
    wind.textContent = (`Wind: ${data.daily[0].wind_speed} MPH`)
    wind.className += "p-2";

    //creates a div item for the day's humidity 
    let humidity = document.createElement("div");
    humidity.textContent = (`Humidity: ${data.daily[0].humidity}%`);
    humidity.className += "p-2";

    //creates a span for the uv color-coded element
    let uv = data.daily[0].uvi
    let uvSpan = document.createElement("span");
    uvSpan.textContent = uv;

    //creates a div to hold the uv span element
    let uvEl = document.createElement("div");
    if(uv <=3) {
        uvSpan.className += "safe badge"
    } else if (uv > 3 && uv <=6) {
        uvSpan.className += "moderate badge";
    } else {
        uvSpan.className += "dangerous badge";
    } 

    console.log(data.daily[0].weather[0].icon);
    uvEl.textContent = (`UV Index: `);
    uvEl.className += "p-2";
    uvEl.append(uvSpan);

    //create image element for the weather
    let icon = document.createElement("img") 
    icon.src = "https://openweathermap.org/img/w/" + data.daily[0].weather[0].icon + ".png";

    weatherDesc.append(temp);
    weatherDesc.append(wind);
    weatherDesc.append(humidity);
    weatherDesc.append(uvEl);
    
    timeAndCity.append(icon);
    weatherBox.append(timeAndCity);
    weatherBox.append(weatherDesc);
    weatherEl.appendChild(weatherBox);

    displayFutureWeather(data, city);
};

//get the five day forecast
displayFutureWeather = function(data, city) {
    console.log(data);
    console.log(city);
    futureWeather.textContent = "";
    
    //create header 
    let header = document.createElement("h2");
    header.textContent = "5-day Forecast: "
    header.className += "col-12"
    futureWeather.append(header);
    for(i=1; i < 6; i++) {
    let weatherCards = document.createElement("div");
    weatherCards.className += "col-12 col-lg-4  card1";

    let icon = document.createElement("img");
    icon.src = "https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";

    //creates an unordered list to store the weather descriptions 
    let date = document.createElement("h4");
    date.textContent = (getDate(data, [i]));
    date.className += " p-2";
    
    //creates a listed item for the day's temperature 
    let temp = document.createElement("div");
    temp.textContent = (`Temp: ${data.daily[i].temp.day}℉`);
    temp.className += " p-2";

    //creates a listed item for the day's wind speed
    let wind = document.createElement("div");
    wind.textContent = (`Wind: ${data.daily[i].wind_speed} MPH`)
    wind.className += " p-2 ";

    //creates a listed item for the day's humidity 
    let humidity = document.createElement("div");
    humidity.textContent = (`Humidity: ${data.daily[i].humidity}%`);
    humidity.className += " p-2 ";

    weatherCards.append(date, icon, temp, wind, humidity);
    
    futureWeather.appendChild(weatherCards);
    weatherEl.append(futureWeather);
    }
}

renderSidebar = function() {
 prevSearched.innerHTML = ""; 
 for(i = 0; i < searchedCity.length; i++) {
    let prevSearch = document.createElement("button");
    let search = searchedCity[i];
    let firstCapital = search.substring(0,1).toUpperCase() + search.substring(1);
    if(search === "") {

    } else {
        prevSearch.textContent = firstCapital;
        console.log(prevSearch);
        prevSearch.className += "sidebarBtn btn-success"
        prevSearched.append(prevSearch);
        prevSearch.addEventListener("click", searchByBtn);
        }
    }
}

const searchByBtn = function() {
    getCity(this.textContent)
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
renderSidebar();
searchEl.addEventListener("submit", formSubmitHandler);
clearBtn.addEventListener("click", function(){
    localStorage.clear();
    searchedCity = [];
    prevSearched.innerHTML = ""
});