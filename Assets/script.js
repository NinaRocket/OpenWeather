
//curent date displayed on summary section
let m = moment();
var dayDate = m.format('MMMM Do YYYY');
$("#dateDisplay").text(dayDate);


//variable for saving cities in an array
var cityArray = [];
getCities();

//dynamically creating list of cities for stored cities to display in
function renderCityList() {

    $("#cityList").empty();

    //create a list element for the cityArray to display
    for (var i = 0; i < cityArray.length; i++) {
        //variable for array position
        var cityPos = cityArray[i];

        //dynamically create list for cities with a data-index
        var li = $("<li style = 'padding-bottom: 5px;'>").attr("data-index", i);

        //dynamically create buttons and text is the city name
        var button = $("<button class = 'button cityBtn is-rounded is-danger'>").text(cityPos);

        //append a button on the list item
        li.append(button);
        $("#cityList").append(li);

    };
};

//function to get stored cities from localStorage
function getCities() {

    var storedCities = JSON.parse(localStorage.getItem("cityArray"));

    if (storedCities !== null) {
        cityArray = storedCities;
    }
    //render array to the dom
    renderCityList();
};
//function to store user inputted city name in local storage
function storeCityName() {
    //stringify and set "cityArray" key in localStorage to cityArray array
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

//function to get user typed in city search
function cityInput() {
    cityName = document.getElementById("userInput").value;
}

//event listener for search button 
$("#citySearch").on("click", function (e) {
    e.preventDefault();
    //gets-passes the city name from cityInput function
    cityInput();

    // Return from function early if submitted todoText is blank
    if (cityName === "") {
        return;
    }

    //hid hard-coded icon, when user presses search all unhides
    $(".summaryIcon").removeClass("is-hidden");

    //pushing the city names into the array to store
    cityArray.push(cityName);

    //calling the function to displayWeather and run ajax calls
    displayWeather(cityName);
    //calling the function that stores cities into localStorage 
    storeCityName();
    //invoking the function that renders the button list
    renderCityList();
    //keeping this funciton active after user adds a new city
    retrieveCityWeather();
    //clears the text box after user hits search
    $("#userInput").val('');

});
//event listener for saved city buttons
function retrieveCityWeather() {
    $(".cityBtn").on("click", function (event) {
        event.preventDefault();
        //variable that holds city text displayed on btn
        wordCity = this.innerHTML;
        //passing that city to the displayWeather function
        displayWeather(wordCity);

    })
};
//event listener for clear button to clear the saved cities out of local storage
//function clearSavedCities() {
$(".clear-btn").on("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    $("#cityList").empty();
    cityArray = [];

});



function displayWeather(cityName) {
    //API key
    var apiKey = "64f6bcb2d437b01524b076e349c2d893";

    //url we need to query to request the weather summary data for city
    var summaryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    //url we need to query forecast for city
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;


    //ajax call for weather summary for city
    $.ajax({

        url: summaryURL,
        method: "GET"
    })

        //object response stores retrieved data
        .then(function (response) {

            //city displayed in weather summary tile
            $("#currentCity").text(cityName);
            //variable to store icon code
            var iconCode = response.weather[0].icon;
            //url for the weather icon
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $("#wIcon").attr("src", iconURL);

            //variable to hold temperature, plus math for F
            var cityTemp = (response.main.temp - 273.15) * 1.80 + 32;
            //add the temp to the weather summary tile, round 2 decimals and add degree symbol
            $("#temp").text("Temperature: " + cityTemp.toFixed(2) + "°" + " F");

            //variable to hold humidity
            var cityHum = response.main.humidity;
            //add the humidity to weather summary tile
            $("#humidity").text("Humidity: " + cityHum + "%");

            //variable to hold windspeed
            var cityWind = response.wind.speed;
            //add the wind speed to weather summary tile
            $("#windSpeed").text("Wind Speed: " + cityWind + " MPH");

            //variables to store city longitude and latitude for UV index ajax call
            var cityLong = response.coord.lon;
            var cityLat = response.coord.lat;
            //url we need to query UV index by coordinates
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLong;
            //nested ajax request for UV index using coordinates from above ajax call
            $.ajax({

                url: uvURL,
                method: "GET"
            }).then(function (r) {

                //variable for the ultraviolet index
                var uvIndex = r.value;
                //statements to determine favorability of UV index conditions
                if (uvIndex <= 2) {
                    //variable for created icon for favorable conditions
                    var favuvIcon = $("<i class = 'far fa-grin' style='font-size: 24px; color: green'>");
                    //dispalying UV Index and favorable icon on weather summary tile
                    $("#uv-index").text("UV Index: " + uvIndex + " ");
                    $("#uv-index").append(favuvIcon);
                } else if (uvIndex > 2 && uvIndex <= 5) {
                    //var for moderate UV Index, straight face and yellow icon
                    var moduvIcon = $("<i class = 'far fa-meh' style='font-size: 24px; color: yellow'>");
                    $("#uv-index").text("UV Index: " + uvIndex + " ");
                    $("#uv-index").append(moduvIcon);
                } else if (uvIndex > 5 && uvIndex <= 7) {
                    //var for high UV index, orange sad face icon
                    var highuvIcon = $("<i class = 'far fa-frown' style='font-size: 24px; color: orange'>");
                    $("#uv-index").text("UV Index: " + uvIndex + " ");
                    $("#uv-index").append(highuvIcon);
                } else if (uvIndex >= 8) {
                    //var for severe UV Index, red sad face icon
                    var sevuvIcon = $("<i class = 'far fa-frown' style='font-size: 24px; color: red'>");
                    $("#uv-index").text("UV Index: " + uvIndex + " ");
                    $("#uv-index").append(sevuvIcon);
                }
                weatherForecast(cityName);
            });
            function weatherForecast() {
                //ajax call for 5-Day forecast of that city
                $.ajax({
                    url: forecastURL,
                    method: "GET"
                }).then(function (p) {


                    //empties the forecast tiles to display next city forecast without concatenating them
                    $("#forecast").empty();
                    //variable for the array index
                    var forecastArray = 0;

                    //for loop to iterate through array and grab the indices that are noon time for 5 subsequent days
                    for (forecastArray = 2; forecastArray < 35; forecastArray += 8) {

                        //variable to get the date for each day
                        var weathDate = p.list[forecastArray].dt_txt;
                        weathDate = weathDate.split(" ")[0];


                        //variable to target div in html
                        var forecastTiles = $("#forecast");
                        // variable for div to append to forecastDisplay
                        var fcParent = $("<div class = 'tile is-parent'>");
                        //create article tag
                        var fcArticle = $("<article class = 'tile is-child box'>");

                        //create p tag for date
                        var dateTag = $("<p class = 'title is-6'>").text(weathDate);
                        //append the date to the tiles
                        (fcArticle).append(dateTag);
                        console.log(weathDate);

                        //variable for weather icon
                        var forecasticonCode = p.list[forecastArray].weather[0].icon;

                        //url for the weather icon fc=forecast
                        var fciconURL = "http://openweathermap.org/img/w/" + forecasticonCode + ".png";

                        //create icon img div
                        var fcIconDisp = $("<div class = 'fivedayIcon'><img class='fcIcon' src = " + fciconURL + " alt = 'weather icon'>");
                        //append div to forecast article
                        fcArticle.append(fcIconDisp);


                        //variable to hold temperature and math to F it
                        var fcTemp = (p.list[forecastArray].main.temp - 273.15) * 1.80 + 32;
                        //create tag to hold temp and round 2 decimals and add degree symbol
                        var fcTempDisp = $("<p>").text("Temperature: " + fcTemp.toFixed(2) + "°" + " F");
                        //append temperature to forecast tiles
                        fcArticle.append(fcTempDisp);

                        //variable to hold forecasted humidity
                        var fcHumid = p.list[forecastArray].main.humidity;
                        //create tag to hold humidity
                        var fcHumidDisp = $("<p>").text("Humidity: " + fcHumid + "%");
                        //append humidity to forecast tiles
                        fcArticle.append(fcHumidDisp);

                        fcParent.append(fcArticle);
                        forecastTiles.append(fcParent);

                    }

                });
            }
        });
};

retrieveCityWeather(); 
