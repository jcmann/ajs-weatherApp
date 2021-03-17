/*
    Jen Mann
    Advanced JavaScript, Spring 2021
*/

// TODO: stylesheet 

/**
 * Init method. 
 */
window.onload = () => {

    // These are used in various methods throughout the app. 
    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    /**
     * This method is the main utility method. It starts by getting the
     * latitude, longitude, and location name from the API. It then calls a
     * callback method, getWeatherData to actually get the weather data needed.
     * The UI is then generated in a method called from there. 
     */
    const processRequest = () => {

        // Get the zipcode input from user
        let zipcode = zipcodeInput.value; 

        // Form the request URL 
        let zipcodeURL = createURL(zipcode); 
        
        let xhr = new XMLHttpRequest(); 
        
        xhr.open("get", zipcodeURL); // We are only using get for this app

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                // We are using the JSON request, so all responses should be JSON
                // Extract the latitude, longitude, and place name 
                let res = JSON.parse(xhr.responseText).postalCodes[0];

                let locationData = {
                    "latitude" : res.lat, 
                    "longitude" : res.lng, 
                    "placeName" : res.placeName
                }
                
                getWeatherData(xhr, locationData); 
            }
        }

        xhr.send(null); 

    }

    /**
     * Handles the second API request in the process. This request uses 
     * the latitude and longitude (locationData) from the initial request 
     * and then makes a call for weather data. The weather data we need
     * for the assignment is extracted into an object and passed onto the
     * generateUI method along with location data. 
     */
    const getWeatherData = (xhr, locationData) => {
        
        let url = `http://api.geonames.org/findNearByWeatherJSON?lat=${locationData.latitude}`
                + `&lng=${locationData.longitude}&username=jenmann`;
        
        xhr.open("get", url); 

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {

                let results = JSON.parse(xhr.responseText).weatherObservation; 

                // Rounds to the nearest integer
                let temperature = Math.round(convertToF(results.temperature));

                let wind = {
                    "speed" : parseInt(results.windSpeed), 
                    "direction" : results.windDirection
                }

                let weatherData = {
                    "temperature" : temperature, 
                    "wind" : wind
                };

                generateUI(weatherData, locationData);
            }
        }

        xhr.send(null); 

    }
    
    /**
     * Generates the actual UI components to represent the weather status. 
     * This method also inserts them into the document by toggling 
     * their display using classes.
     */
    const generateUI = (weatherData, locationData) => {

        // Clear out zipcode after displaying information
        zipcodeInput.value = ""; // clear this here for timing purposes

        // Get relevant HTML element hooks 
        let main = document.querySelector("main"); 
        let h2 = document.querySelector("h2#placeNameHeader"); 
        let temperatureImage = document.querySelector("#temperatureImage");
        let temperatureText = document.querySelector("#temperatureText"); 
        let windImage = document.querySelector("#windImage");
        let windText = document.querySelector("#windText"); 

        // Data section can be displayed once data is added.
        // Remove will only remove if it exists (works with multiple submits)
        main.classList.remove("displayOff"); 

        // Display placeName
        h2.innerHTML = locationData.placeName;

        // Format temperature displays 
        temperatureText.innerHTML = `${weatherData.temperature} &deg; F`; 
        if (weatherData.temperature >= 83) {
            temperatureImage.innerHTML = `<i class="fas fa-sun"></i>`; 
        } else if (weatherData.temperature <= 34) {
            temperatureImage.innerHTML = `<i class="far fa-snowflake"></i>`; 
        } else {
            temperatureImage.innerHTML = ``; 
        }

        // Format wind displays
        let windDirectionLabel = determineDirection(weatherData.wind.direction);
        let windTextString = `${weatherData.wind.speed} mph `; 
        if (windDirectionLabel) {
            windTextString += `to the ${windDirectionLabel}.`; 
        }
        windText.innerHTML = windTextString; 
        windImage.innerHTML = (weatherData.wind.speed > 15) ? `<i class="fas fa-wind"></i>` : null;

        // If neither field has an icon, collapse 
        if (document.querySelector("#temperatureImage")
                .contains(document.querySelector("#temperatureImage i"))) {

            windImage.classList.remove("collapse"); 
            temperatureImage.classList.remove("collapse"); 
            
        } else {
            windImage.classList.add("collapse"); 
            temperatureImage.classList.add("collapse"); 
        }

    }

    /**
     * A helper method that only exists to convert values that come in as
     * celsius via the API to fahrenheit.
     */
    const convertToF = (celsius) => {
        return (celsius * 1.8) + 32; 
    }

    /**
     * Returns a string containing a URL requesting data for 
     * the zipcode entered by user 
     */
     const createURL = (zipcode) => {
        return `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipcode}&country=US&maxRows=1&username=jenmann`; 
    }

    /**
     * A helper method that effectively converts the wind direction in degrees, 
     * which is likely what the API will return, to a directional label
     * Ex: 0 degrees = N = North
     */
    const determineDirection = (degree) => {

        /*
            There are a total of 16 directional combinations.
            360 / 16 = 22.5, so each "range" is a total of 22.5 degrees. 
        */ 

        if ((degree >= 0 && degree <= 11.25) || (degree > 348.75 && degree <= 360)) {
            return "N"; 
        } else if (degree > 11.25 && degree <= 33.75) {
            return "NNE"; 
        } else if (degree > 33.75 && degree <= 56.25) {
            return "NE";
        } else if (degree > 56.25 && degree <= 78.75) {
            return "ENE"; 
        } else if (degree > 78.75 && degree <= 101.25) {
            return "E"; 
        } else if (degree > 101.25 && degree <= 123.75) {
            return "ESE"; 
        } else if (degree > 123.75 && degree <= 146.25) {
            return "SE"; 
        } else if (degree > 146.25 && degree <= 168.75) {
            return "SSE"; 
        } else if (degree > 168.75 && degree <= 191.25) {
            return "S"; 
        } else if (degree > 191.25 && degree <= 213.75) {
            return "SSW"; 
        } else if (degree > 213.75 && degree <= 236.25) {
            return "SW"; 
        } else if (degree > 236.25 && degree <= 258.75) {
            return "WSW"; 
        } else if (degree > 258.75 && degree <= 281.25) {
            return "W"; 
        } else if (degree > 281.25 && degree <= 303.75) {
            return "WNW"; 
        } else if (degree > 303.75 && degree <= 326.25) {
            return "NW"; 
        } else if (degree > 326.25 && degree <= 348.75) {
            return "NNW"; 
        } else {
            return ""; 
        }
            
    }

    // Event listener setup
    getWeatherButton.addEventListener("click", processRequest);
    zipcodeInput.addEventListener("keypress", (event) => {
        if (event.key === 'Enter') {
            processRequest(event); 
        }
    })


}