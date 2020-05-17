
//curent date displayed on summary section
let m = moment();
var dayDate = m.format('MMMM Do YYYY');
$("#dateDisplay").text(dayDate);

//variable to store city name 
var cityName = "Worcester";

//function to get user typed in city search
function cityInput() {
    cityName = document.getElementById("userInput").value;
}
//event listener for search button 
$("#citySearch").on("click", function (e) {
    e.preventDefault();


});

//API key
var apiKey = "64f6bcb2d437b01524b076e349c2d893";

//url we need to query to request the weather summary data for city
var summaryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

//url we need to query forecast for city
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;



//function that runs ajax call for weather summary for city
$.ajax({

    url: summaryURL,
    method: "GET"
})

    //object response stores retrieved data
    .then(function (response) {
        console.log(response);
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
            console.log(r);
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
        });
        //ajax call for 5-Day forecast of that city
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (p) {

            console.log(p);
            console.log(p.list[0].main.temp);
            //variable for the array index
            var forecastArray = 0;

            //for loop to iterate through array and grab the indices that are noon time for 5 subsequent days
            for (forecastArray = 2; forecastArray < 35; forecastArray += 8) {
                //console.log(p.list[forecastArray].main.temp);
                //console.log(p.list[forecastArray]);

                //variable to get the date for each day
                var weathDate = p.list[forecastArray].dt_txt;
                console.log(weathDate);

                //variable to target div in html
                var forecastTiles = $("#forecastDisplay");
                //create p tag for date
                var dateTag = $("<p class = 'title is-6'>").text(weathDate);
                //append the date to the tiles
                (forecastTiles).append(dateTag);


                //variable to target array
                //variable for weather icon
                var forecasticonCode = p.list[forecastArray].weather[0].icon;
                console.log(forecasticonCode);
                //url for the weather icon fc=forecast
                var fciconURL = "http://openweathermap.org/img/w/" + forecasticonCode + ".png";
                //create icon img div
                var fcIconDisp = $("<div class = 'fivedayIcon'><img class='fcIcon' src = '' alt = 'weather icon'>");
                //append div to forecastTiles
                forecastTiles.append(fcIconDisp);
                //display icon in fcIcon image in div
                $(".fcIcon").attr("src", fciconURL);

                //variable to hold temperature and math to F it
                var fcTemp = (p.list[forecastArray].main.temp - 273.15) * 1.80 + 32;
                //create tag to hold temp and round 2 decimals and add degree symbol
                var fcTempDisp = $("<p class = 'title is-6'>").text("Temperature: " + fcTemp.toFixed(2) + "°" + " F");
                //append temperature to forecast tiles
                forecastTiles.append(fcTempDisp);

                //variable to hold forecasted humidity
                var fcHumid = p.list[forecastArray].main.humidity;
                //create tag to hold humidity
                var fcHumidDisp = $("<p class = 'title is-6'>").text("Humidity: " + fcHumid + "%");
                //append humidity to forecast tiles
                forecastTiles.append(fcHumidDisp);



            }

        });

    });



