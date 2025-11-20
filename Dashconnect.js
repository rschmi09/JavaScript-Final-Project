// Random Dog App
const dogContainer = document.getElementById('dog-output');

async function getDogImage () { 
    // Clear previous image (if any)
    dogContainer.innerHTML = "";
    
    //fetch data from the Dog API
    const response = await fetch('https://dog.ceo/api/breeds/image/random'); // await flags code that will take time
    console.log('Fetching dog image from', response.url);
    
    const data = await response.json(); 
    console.log('Dog API response:', data);

    // Create an image element inside the singleDogContainer and display it
    const img = document.createElement('img');
    img.src = data.message;
    console.log('Setting image src to', data.message);

    // Append the image to the container
    dogContainer.appendChild(img);
}


// Random Cat App
const catContainer = document.getElementById('cat-output');

async function getCatImage () { 
    // Clear previous image (if any)
    catContainer.innerHTML = "";
    
    //fetch data from the Cat API
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    console.log('Fetching cat image from', response.url);

    const data = await response.json(); 
    console.log('Cat API response:', data);

    // Create an image element inside the catContainer and display it
    const img = document.createElement('img');
    img.src = data[0].url;
    console.log('Setting image src to', data[0].url);

    // Append the image to the container
    catContainer.appendChild(img);
}


// GitHub User App 
const githubContainer = document.getElementById('github-output');

async function getGitHubUser () {
    // Clear previous user info (if any)
    githubContainer.innerHTML = "";

    // Get username from input field
    const username = document.getElementById('github-username').value;
    console.log('GitHub username input:', username);
    
    // Fetch data from the GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`);
    console.log('Fetching GitHub user from', response.url);

    const data = await response.json();
    console.log('GitHub API response:', data);

    // Display user info
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `
        <p><span>Name:</span> ${data.name || 'N/A'}</p>
        <p><span>Bio:</span> ${data.bio || 'N/A'}</p>
        <p><span>Public Repos:</span> ${data.public_repos}</p>
        <img src="${data.avatar_url}" alt="Avatar" width="100"/>
    `;
    console.log('Displaying GitHub user info', data.name, data.bio, data.public_repos, data.avatar_url);

    // Append the user info to the container
    githubContainer.appendChild(userDiv);   
}


// Random Joke App
const jokeContainer = document.getElementById('joke-output');

async function getJoke () { 
    // Clear previous joke (if any)
    jokeContainer.innerHTML = "";
    
    //fetch data from the Joke API
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    console.log('Fetching joke from', response.url);

    const data = await response.json();
    console.log('Joke API response:', data);

    // Display the joke
    const joke = document.createElement('div');
    joke.innerHTML = `<p><span>${data.setup}</span></p><p>${data.punchline}</p>`; //<p><strong> is 'with importance' / bolded
    console.log('Displaying joke:', data.setup, data.punchline);
    
    // Append the joke to the container
    jokeContainer.appendChild(joke);
}


// Weather Info App
const weatherContainer = document.getElementById('weather-output');

// Fetch coordinates based on city and state
async function getCoordinates() {

    const city = document.getElementById('weather-city').value.trim();
    const state = document.getElementById('weather-state').value.trim();

    if (!city) {
        weatherContainer.innerHTML = "<p>Please enter a city.</p>";
        return null;
    }

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&admin1=${encodeURIComponent(state)}&country=USA`);
        console.log('Fetching coordinates from', response.url);

        const data = await response.json();
        console.log('Geocoding API response:', data);

        if (!data.results || data.results.length === 0) {
            weatherContainer.innerHTML = "<p>Location not found. Please try again.</p>";
            console.error('Location not found for', city, state);
            return null;
        }

        return {
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
        };

    } catch (error) {
        console.error("Error fetching coordinates:", error);
        weatherContainer.innerHTML = "<p>Failed to fetch location data. Please try again later.</p>";
        return null;
    }
}

// Fetch weather data based on coordinates
async function fetchWeatherData(lat, lon) {

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`);
        console.log('Fetching weather data from', response.url);

        const data = await response.json();
        console.log('Weather API response:', data);
        return data.current_weather;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherContainer.innerHTML = "<p>Failed to fetch weather data.</p>";
        return null;
    }
}

// Translate weather code to description (public code)
function getWeatherDescription(code) {
    
    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    return weatherCodes[code] || "Unknown";
}

// Render weather 
function renderWeather(weather) {

    if (!weather) {
        console.error('No weather data to render');
        return;
    }

    const weatherDescription = getWeatherDescription(weather.weathercode);
    console.log('Weather description for code', weather.weathercode, ':', weatherDescription);

    const weatherDiv = document.createElement('div');
    weatherDiv.innerHTML = `
        <p><span>Temperature:</span> ${weather.temperature} °F</p>
        <p><span>Wind Speed:</span> ${weather.windspeed} mph</p>
        <p><span>Condition:</span> ${weatherDescription}</p>
    `;
    console.log('Displaying weather:', weather.temperature, weather.windspeed, weatherDescription);

    weatherContainer.appendChild(weatherDiv);
}

// Show/Hide loading spinner
function toggleLoading(show) {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = show ? 'block' : 'none';
}

// Main function to get and display weather
async function getWeather() {

    weatherContainer.innerHTML = "";
    toggleLoading(true);

    try {
        const coords = await getCoordinates();
        console.log('Obtained coordinates:', coords);

        if (!coords) {
            toggleLoading(false);
            console.error('No coordinates obtained');
            return;
        }

        const weather = await fetchWeatherData(coords.latitude, coords.longitude);
        console.log('Obtained weather data:', weather);

        renderWeather(weather);
        toggleLoading(false);

    } catch (error) {
        console.error("Error in getWeather:", error);
        toggleLoading(false);
    }
}


// Currency Exchange App
const currencyContainer = document.getElementById('currency-output');

// Fetch exchange rates for USD and EUR from API
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        console.log('Fetching exchange rates from', response.url);

        const data = await response.json();
        console.log('Exchange Rates API response:', data);
        
        const usd = data.rates.USD;
        console.log('USD rate:', usd);
        const eur = data.rates.EUR;
        console.log('EUR rate:', eur);

        return { usd, eur };

    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        currencyContainer.innerHTML = "<p>Failed to fetch exchange rates.</p>";
        return null;
    }
}

// Convert currency and display results
function displayExchangeRates(rates) {
    if (!rates) {
        console.error('No exchange rates to display');
        return;
    }

    // Convert from USD to EUR and vice versa
    function usdToEur(usd) {
        return (usd * (rates.eur / rates.usd)).toFixed(2);
    }

    function eurToUsd(eur) {
        return (eur * (rates.usd / rates.eur)).toFixed(2);
    }

    // if there is a value, convert to the other currency 
    const usdInput = document.getElementById('USD');
    console.log('USD input value:', usdInput.value);

    const eurInput = document.getElementById('EUR');
    console.log('EUR input value:', eurInput.value);

    if (usdInput.value) {
        eurInput.value = usdToEur(parseFloat(usdInput.value));
        console.log('Converted USD to EUR:', eurInput.value);
    } else if (eurInput.value) {
        usdInput.value = eurToUsd(parseFloat(eurInput.value));
        console.log('Converted EUR to USD:', usdInput.value);
    }
    
    // Display exchange rates
    const exchangeDiv = document.createElement('div');
    exchangeDiv.innerHTML = `
        <h4>Exchange Rate:</h4>
        <p>1 USD = ${(rates.eur / rates.usd).toFixed(2)} EUR</p>
        <p>1 EUR = ${(rates.usd / rates.eur).toFixed(2)} USD</p>
    `;  

    currencyContainer.appendChild(exchangeDiv);
}

// Main function to get and display exchange rates
async function getExchangeRates () { 
    // Clear previous rates (if any)
    currencyContainer.innerHTML = "";   

    const rates = await fetchExchangeRates();
    
    displayExchangeRates(rates);
}


// Movie Trends App
const movieContainer = document.getElementById('movies-output');

async function getMovies () { 
    // Clear previous movie info (if any)
    movieContainer.innerHTML = "";  

    /* i really dont want to sign up for something just for an assignment
       this code will fail and throw the 'catch' error unless a valid TMDB API key is provided
    */

    //fetch data from the Movie Trends API 
    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=<<YOUR_TMDB_API_KEY>>');
        console.log('Fetching movie trends from', response.url);
        
        const data = await response.json();
        console.log('Movie Trends API response:', data);

        // Display the movie trends
        data.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.innerHTML = `<p>${movie.title}</p>`;
            movieContainer.appendChild(movieDiv);
        });

    } catch (error) {
        console.error("Error fetching movie trends:", error);
        movieContainer.innerHTML = "<p>Failed to fetch movie trends.</p>";
    }
        movieContainer.appendChild(movieDiv);
}


// Random Beer App
const beerContainer = document.getElementById('publicapi-output');

function toggleBeerLoading(show) {
    const loadingBeerDiv = document.getElementById('loading-beer');
    loadingBeerDiv.style.display = show ? 'block' : 'none';
}

async function getPublicApiInfo () { 
    // Clear previous info (if any)
    beerContainer.innerHTML = "";
    toggleBeerLoading(true);

    // Fetch random beer
    try {
        const response = await fetch('https://punkapi.online/v3/beers/random');
        console.log('Fetching random beer from', response.url);
        
        const data = await response.json();
        console.log('Random Beer API response:', data);

        // Display the random beer
        const beer = data;
        const imgURL = `https://punkapi.online/v3/images/${beer.image}`;

        const beerDiv = document.createElement('div');
        beerDiv.innerHTML = `
            <p><span>Name:</span> ${beer.name}</p>
            <p><span>Tagline:</span> ${beer.tagline}</p>
            <p><span>Description:</span> ${beer.description}</p>
            <p><span>Food Pairing:</span> ${beer.food_pairing.join(', ')}</p>
            <p><span>Brewers Tips:</span> ${beer.brewers_tips}</p>
            <img src="${imgURL}" alt="Beer Image" width="100"/>
        `;
        console.log(
            'Displaying random beer:', 
            beer.name, 
            beer.tagline, 
            beer.description, 
            beer.food_pairing, 
            beer.brewers_tips,
            imgURL,
        );
        
        beerContainer.appendChild(beerDiv);
        toggleBeerLoading(false);

    } catch (error) {
        console.error("Error fetching random beer:", error);
        toggleBeerLoading(false);
        beerContainer.innerHTML = "<p>Failed to fetch random beer.</p>";
    }
}