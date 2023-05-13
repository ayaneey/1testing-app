let cityInput = document.getElementById("inputNow");
let cityName = document.getElementById("cityName");
let tempValue = document.getElementById("tempValue");
let weatherIcon;
let weatherPressure = document.getElementById("weatherPressure");
let weatherHumidity = document.getElementById("weatherHumidity");
let weatherWind = document.getElementById("weatherWind");

// API Key
let APIKEY = "32ddcf69b981d2d26ae1ab0b60a837c2";

// Get the return button element
const returnButton = document.querySelector(".return-button");

// Hide the return button initially
returnButton.style.display = "none";

// Add an event listener to show the return button when the weather data is displayed in the second container
document.addEventListener("DOMContentLoaded", function () {
	const weatherForecast = document.querySelector(".weather-forecast");

	// Assuming you have a function to display the weather data in the second container, you can add the following code within that function
	weatherForecast.style.display = "block";
	returnButton.style.display = "block";
});

function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

async function getWeather(latitude, longitude) {
	try {
		let APIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`;
		const response = await fetch(APIUrl);
		const data = await response.json();
		showWeather(data);
		let cityNameForFiveDayForecast = data.name;
		getFiveDayForecast(cityNameForFiveDayForecast);
	} catch (error) {
		console.log("Error fetching current weather data:", error);
	}
}

async function getFiveDayForecast(cityName) {
	try {
		let APIURLforFiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKEY}`;
		const response = await fetch(APIURLforFiveDayForecast);
		const data = await response.json();
		showFiveDayForecast(data);
	} catch (error) {
		console.log("Error fetching forecast data:", error);
	}
}

function showWeather(data) {
	console.log(data);

	if (data.weather[0].main == "Clear") {
		weatherIcon = "clear.svg";
	} else if (data.weather[0].main == "Clouds") {
		weatherIcon = "clouds.svg";
	} else if (data.weather[0].main == "Rain") {
		weatherIcon = "rain.svg";
	} else if (data.weather[0].main == "LightRain") {
		weatherIcon = "light-rain.svg";
	} else if (data.weather[0].main == "Snow") {
		weatherIcon = "snow.svg";
	} else if (data.weather[0].main == "Sunny") {
		weatherIcon = "sunny-icon.svg";
	} else if (data.weather[0].main == "Thunderstorm") {
		weatherIcon = "rain-thunder.svg";
	} else if (data.weather[0].main == "Fog") {
		weatherIcon = "fog.svg";
	}

	weatherPressure.innerHTML = data.main.pressure;
	weatherHumidity.innerHTML = data.main.humidity;
	weatherWind.innerHTML = data.wind.speed;
}

function showFiveDayForecast(data) {
	console.log(data);
	const weatherForecast = document.querySelector(".weather-forecast");
	weatherForecast.innerHTML = "";

	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	if (data.list.length > 0) {
		const forecastContainer = document.createElement("div");
		forecastContainer.classList.add("forecast-container");

		for (let i = 0; i < data.list.length; i += 8) {
			console.log(data.list[i]);

			const forecastDate = new Date(data.list[i].dt_txt);
			const dayOfWeek = daysOfWeek[forecastDate.getDay()];

			const div = document.createElement("div");
			div.classList.add(
				"weather-forecast-day-" + (i / 8 + 1).toString().replace(/\s+/g, "-")
			);
			div.innerHTML = `
        <div class="forecast-day">${dayOfWeek}</div>
        <div class="forecast-image">
          <img src="${data.list[i].weather[0].main.toLowerCase()}.svg" alt="${
				data.list[i].weather[0].main
			}">
        </div>
        <div class="forecast-temperature">
          <p>Low: ${(data.list[i].main.temp_min - 273).toFixed(0)}°</p>
          <p>High: ${(data.list[i].main.temp_max - 273).toFixed(0)}°</p>
        </div>
      `;

			forecastContainer.appendChild(div);
		}

		weatherForecast.appendChild(forecastContainer);
		// Show the forecast boxes
		weatherForecast.style.display = "block";
	} else {
		// Hide the forecast boxes
		weatherForecast.style.display = "none";
	}
}

// Initially hide the forecast boxes
const weatherForecast = document.querySelector(".weather-forecast");
weatherForecast.style.display = "none";

async function getCurrentWeather(city) {
	try {
		let getCurrentWeather = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
		);
		let data = await getCurrentWeather.json();
		console.log(data);

		const cityName = document.getElementById("cityName");
		cityName.innerHTML = data.name;

		const tempValue = document.getElementById("tempValue");
		const temperature = (data.main.temp - 273).toFixed(0);
		tempValue.innerHTML = `${temperature}°C`;
		tempValue.classList.remove("hide");

		if (data.weather[0].main == "Clear") {
			weatherIcon = "clear.svg";
		} else if (data.weather[0].main == "Fog") {
			weatherIcon = "fog.svg";
		} else if (data.weather[0].main == "Light-Rain") {
			weatherIcon = "light-rain.svg";
		} else if (data.weather[0].main == "Rain-Thunder") {
			weatherIcon = "rain-thunder.svg";
		} else if (data.weather[0].main == "Rain") {
			weatherIcon = "rain.svg";
		} else if (data.weather[0].main == "Snow") {
			weatherIcon = "snow.svg";
		} else if (data.weather[0].main == "Clouds") {
			weatherIcon = "sun-cloudy.svg";
		} else {
			weatherIcon = "sunny-icon.svg";
		}

		let imageEl = document.createElement("svg");
		imageEl.src = weatherIcon;
		document.getElementsByClassName("weather-forecast")[0].appendChild(imageEl);

		getFiveDayForecast(city);
	} catch (error) {
		console.log("Error fetching current weather data:", error);
	}
}

const btn = document.getElementsByClassName("btn");

btn[0].addEventListener("click", searchButton);

function searchButton(event) {
	event.preventDefault();
	let weatherForecast = document.querySelector(".weather-forecast");
	weatherForecast.innerHTML = "";
	let city = cityInput.value;
	getCurrentWeather(city);
}

(async function () {
	try {
		const position = await getCurrentPosition();
		const { latitude, longitude } = position.coords;
		getWeather(latitude, longitude);
	} catch (error) {
		console.log("Error retrieving geolocation:", error);
	}
})();
