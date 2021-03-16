window.onload = () => {

    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    // Event listener for getWeather onclick 
    getWeatherButton.addEventListener("click", event => {

        // Get the zipcode inputted from user
        let zipcode = zipcodeInput.value; 

        // Form the request URL 
        let zipcodeURL = createURL(zipcode); 

        // open XHR for request 1: get lat/lon 
        getLatLon(zipcodeURL); 
        
    });

    /**
     * Returns a string containing a URL requesting data for 
     * the zipcode entered by user 
     */
    const createURL = (zipcode) => {

        return `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipcode}&maxRows=1&username=jenmann`; 
        

    }

    /**
     * This method is the main utility method. It starts by getting the
     * latitude, longitude, and location name from the API. It then calls a
     * callback method, getWeatherData to actually get the weather data needed.
     */
    const getLatLon = (zipcodeURL) => {

        let xhr = new XMLHttpRequest(); 
        
        xhr.open("get", zipcodeURL); // We are only using get for this app

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                // We are using the JSON request, so all responses should be JSON
                // Extract the latitude, longitude, and place name 
                let res = JSON.parse(xhr.responseText).postalCodes[0];
                let result = [res.lat, res.lng, res.placeName]; // TODO make object
                
                getWeatherData(xhr, result); 
            }
        }

        xhr.send(null); 

    }

    const getWeatherData = (xhr, locationData) => {

        let [lat, lon, placeName] = locationData; 
        
        let url = `http://api.geonames.org/findNearByWeatherJSON?lat=${lat}`
                + `&lng=${lon}&username=jenmann`;
        
        xhr.open("get", url); 

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                let results = JSON.parse(xhr.responseText).weatherObservation; 
                //console.log(results);
                let temperature = Math.round(convertToF(results.temperature)); 
                let wind = {
                    "speed" : parseInt(results.windSpeed), 
                    "direction" : results.windDirection
                }
                //console.log(wind);
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
     * Generates the actual UI components to represent the weather status, and
     * handles appending these 
     */
    const generateUI = (weatherData, locationData) => {

        // TODO add toggle for h3s 

        // Get relevant HTML element hooks 
        let h2 = document.querySelector("h2#placeNameHeader"); 
        let temperatureImage = document.querySelector("#temperatureImage");
        let temperatureText = document.querySelector("#temperatureText"); 
        let windImage = document.querySelector("#windImage");
        let windText = document.querySelector("#windText"); 

        // TODO don't display any HTML if content not displaying, including p's 

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
        windText.innerHTML = `${weatherData.wind.speed} mph to the ${windDirectionLabel}.`;
        windImage.innerHTML = (weatherData.wind.speed > 15) ? `<i class="fas fa-wind"></i>` : null;

    }

    const convertToF = (celsius) => {
        return (celsius * 1.8) + 32; 
    }

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
        }
            
    }


}