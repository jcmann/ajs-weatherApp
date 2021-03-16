window.onload = () => {

    const zipcodeInput =  document.querySelector("#zipcode"); 
    const getWeatherButton = document.querySelector("#getWeather"); 

    // Event listener for getWeather onclick 
    getWeather.addEventListener("click", event => {

        // Get the zipcode inputted from user
        let zipcode = zipcodeInput.value; 

        // Form the request URL 
        let url = createURL(zipcode); 

        // Create XHR to process request 
        let xhr = new XMLHttpRequest(); 
        
    })

    /**
     * Returns a string containing a URL requesting data for 
     * the zipcode entered by user 
     */
    const createURL = (zipcode) => {

        return `http://api.geonames.org/postalCodeLookupJSON?postalcode=${zipcode}&country=US&username=jenmann`; 

    }

}