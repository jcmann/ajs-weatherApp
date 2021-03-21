/*
    Jen Mann
    Advanced JavaScript, Spring 2021
*/

/**
 * Init method. 
 */
window.onload = () => {

    // These are used in various methods throughout the app. 
    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    /**
     * This method is the main utility method. It opens the API request, 
     * then calls a helper method which extracts the data used. That method
     * then calls a method to generate the UI based on that data.
     */
    const processRequest = () => {

        // Get the zipcode input from user
        let zipcode = zipcodeInput.value; 

        // Form the request URL 
        let zipcodeURL = createURL(zipcode); 
        
        let xhr = new XMLHttpRequest(); 
        
        xhr.open("get", zipcodeURL); // gets the weather data 

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {

                let res = JSON.parse(xhr.responseText);

                console.log(res);

                if (res.cod == 200) {

                        extractWeatherData(res); // gets wind info, temp, place name

                } else {
                    outputError(); 
                }

                
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
    const extractWeatherData = (res) => {
        
        let data = {
            "name" : res.name, 
            "temperature" : convertToF(parseInt(res.main.temp)), 
            "wind" : {
                "speed" : parseInt(res.wind.speed), 
                "direction" : determineDirection(res.wind.deg)
            }
        }

        generateUI(data); 

    }
    
    /**
     * Generates the actual UI components to represent the weather status. 
     * This method also inserts them into the document by toggling 
     * their display using classes.
     */
    const generateUI = (data) => {

        // Clear out zipcode after displaying information
        zipcodeInput.value = ""; // clear this here for timing purposes

        // If it's here, the zipcode was entered
        // Reverse display toggling 
        document.querySelector("#error").classList.add("displayOff");
        document.querySelector("#data").classList.remove("displayOff"); 

        // Get relevant HTML element hooks 
        let main = document.querySelector("main"); 
        let h2 = document.querySelector("h2"); 

        // Last part of toggling reversal
        h2.classList.remove("displayOff"); 
    
        let temperatureImage = document.querySelector("#temperatureImage");
        let temperatureText = document.querySelector("#temperatureText"); 
        let windImage = document.querySelector("#windImage");
        let windText = document.querySelector("#windText"); 

        // Data section can be displayed once data is added.
        // Remove will only remove if it exists (works with multiple submits)
        main.classList.remove("displayOff"); 

        // Display placeName
        h2.innerHTML = data.name;

        // Format temperature displays 
        temperatureText.innerHTML = `${data.temperature} &deg; F`; 
        if (data.temperature >= 83) {
            temperatureImage.innerHTML = `<i class="fas fa-sun"></i>`; 
        } else if (data.temperature <= 34) {
            temperatureImage.innerHTML = `<i class="far fa-snowflake"></i>`; 
        } else {
            temperatureImage.innerHTML = ``; 
        }

        // Format wind displays
        let windDirectionLabel = data.wind.direction;
        let windTextString = `${data.wind.speed} mph `; 
        if (windDirectionLabel) {
            windTextString += `to the ${windDirectionLabel}.`; 
        }
        windText.innerHTML = windTextString; 
        windImage.innerHTML = (data.wind.speed > 15) ? `<i class="fas fa-wind"></i>` : null;

        // If one field has an icon, un-collapse both so they fit
        // Otherwise, both fields are empty, so collapse the icon spacer 
        if (document.querySelector("#temperatureImage")
                .contains(document.querySelector("#temperatureImage i"))
            || document.querySelector("#windImage")
            .contains(document.querySelector("#windImage i"))) {

            windImage.classList.remove("collapse"); 
            temperatureImage.classList.remove("collapse"); 
            
        } else {
            windImage.classList.add("collapse"); 
            temperatureImage.classList.add("collapse"); 
        }

    }

    /**
     * Displays the output error if a user enters an
     * incorrect zipcode (i.e. one that doesn't return data)
     */
    const outputError = () => {
        document.querySelector("main").classList.remove("displayOff"); 
        document.querySelector("h2").classList.add("displayOff"); 
        document.querySelector("#data").classList.add("displayOff"); 
        document.querySelector("#error").classList.remove("displayOff"); 
    }


    /**
     * A helper method that only exists to convert values that come in as
     * celsius via the API to fahrenheit.
     */
    const convertToF = (celsius) => {
        return Math.round((celsius * 1.8) + 32); 
    }

    /**
     * Returns a string containing a URL requesting data for 
     * the zipcode entered by user 
     */
     const createURL = (zipcode) => {
        return `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=metric&appid=2fe7a246f99c5d0aaf70d4b5716bf731`; 
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

        if (typeof degree !== "number") {
            degree = parseInt(degree); 
            
        }

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