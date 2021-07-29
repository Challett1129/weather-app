const weatherEl = document.querySelector("#current-weather")
const searchEl = document.querySelector("#searchForm");
const searchValue = document.querySelector("#search");
const searchBtnEl = document.querySelector("#search-btn");

let formSubmitHandler = function() {
    event.preventDefault();

    let search = searchValue.value.trim();
    if(search) {
        getWeatherData(search);
    }
}

const getWeatherData = function(city) {
    const apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bc5897eea54f7f82154e145b1c1db2dc"
    fetch(apiUrl).then(function(response){
        if(response.ok){ 
            response.json().then(function(data) {
                console.log(data.list[0].main.temp, data.list[0].main.humidity, data.list[0].wind.speed);
            })
        }        
    })
}


const displayWeather = function() {
    
}
// getWeatherData("royse city");

searchEl.addEventListener("submit", formSubmitHandler);