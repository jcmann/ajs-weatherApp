window.onload = () => {

    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    // Event listener for getWeather onclick 
    getWeatherButton.addEventListener("click", event => {

        // Get the zipcode inputted from user
        let zipcode = 53703;//zipcodeInput.value; 

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

        // Get relevant HTML element hooks 
        let h2 = document.querySelector("h2#placeNameHeader"); 
        let temperatureImage = document.querySelector("img#temperatureImage");
        let temperatureText = document.querySelector("#temperatureText"); 
        let windImage = document.querySelector("img#windImage");
        let windText = document.querySelector("#windText"); 

        // Format temperature displays 
        temperatureText.innerHTML = `${weatherData.temperature} &deg; F`; 

    }

    const convertToF = (celsius) => {
        return (celsius * 1.8) + 32; 
    }


}