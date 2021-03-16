window.onload = () => {

    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    // Event listener for getWeather onclick 
    getWeather.addEventListener("click", event => {

        // Get the zipcode inputted from user
        let zipcode = zipcodeInput.value; 

        // Form the request URL 
        let zipcodeURL = createURL(zipcode); 

        // (method, url, callback)
        ajaxRequest("get", zipcodeURL, getLatLon); 
        
    });

    /**
     * Returns a string containing a URL requesting data for 
     * the zipcode entered by user 
     */
    const createURL = (zipcode) => {

        return `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipcode}&maxRows=1&username=jenmann`; 
        

    }

    /**
     * A general ajax request to handle both requests made for this app.
     */
    const ajaxRequest = (method, url, callback) => {

        // Create and use XHR 
        let xhr = new XMLHttpRequest(); 
        //console.log(xhr);
        xhr.open(method, url); // We are only using get for this app

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                
            }
        }

        xhr.send(null); 
    }

    const getLatLon = (response) => {
        console.log(response);
    }


}