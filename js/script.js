window.onload = () => {

    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    // Event listener for getWeather onclick 
    getWeatherButton.addEventListener("click", event => {

        // Get the zipcode inputted from user
        let zipcode = zipcodeInput.value; 

        // Form the request URL 
        let zipcodeURL = createURL(zipcode); 

        let xhr = new XMLHttpRequest(); 

        // open XHR for request 1: get lat/lon 
        getLatLon(xhr, zipcodeURL); 

        // open XHR for request 2: actual weather data
        
    });

    /**
     * Returns a string containing a URL requesting data for 
     * the zipcode entered by user 
     */
    const createURL = (zipcode) => {

        return `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipcode}&maxRows=1&username=jenmann`; 
        

    }

    const getLatLon = (xhr, zipcodeURL) => {
        
        xhr.open("get", zipcodeURL); // We are only using get for this app

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                // We are using the JSON request, so all responses should be JSON
                console.log(xhr.responseText);
            }
        }

        xhr.send(null); 

    }


}