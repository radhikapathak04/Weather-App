const apiKey = "YOUR_API_KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentData = document.getElementById("currentData");
const forecastData = document.getElementById("forecastData");

// Load last searched city from Local Storage
window.onload = () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        getWeather(lastCity);
    }
};

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        localStorage.setItem("lastCity", city);
    }
});

async function getWeather(city) {
    try {
        // Current Weather
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const currentDataJson = await currentRes.json();

        if (currentDataJson.cod !== 200) {
            currentData.innerHTML = "City not found.";
            forecastData.innerHTML = "";
            return;
        }

        currentData.innerHTML = `
            <strong>${currentDataJson.name}</strong><br>
            Temperature: ${currentDataJson.main.temp}°C<br>
            Weather: ${currentDataJson.weather[0].description}<br>
            Humidity: ${currentDataJson.main.humidity}%
        `;

        // 5-Day Forecast
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const forecastJson = await forecastRes.json();

        forecastData.innerHTML = "";
        // Show 5 forecast points (1 per day approx)
        for (let i = 0; i < forecastJson.list.length; i += 8) {
            const f = forecastJson.list[i];
            const card = document.createElement("div");
            card.className = "forecast-card";
            card.innerHTML = `
                <strong>${f.dt_txt.split(" ")[0]}</strong><br>
                Temp: ${f.main.temp}°C<br>
                ${f.weather[0].main}
            `;
            forecastData.appendChild(card);
        }

    } catch (err) {
        currentData.innerHTML = "Error fetching weather data.";
        forecastData.innerHTML = "";
        console.error(err);
    }
}
