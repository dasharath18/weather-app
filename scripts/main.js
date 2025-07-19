const apiKey = '5d1f0c7d5ee05fd428845d29eef65df5';

const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const datePicker = document.getElementById('datePicker');
const loader = document.getElementById('loader');

// Weather display elements
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const windDirection = document.getElementById('windDirection');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const weatherIcon = document.getElementById('weatherIcon');
const forecastCards = document.getElementById('forecastCards');

function getWindDirection(degree) 
{
  const directions = ['NORTH', 'NORTH-EAST', 'EAST', 'SOUTH-EAST', 'SOUTH', 'SOUTH-WEST', 'WEST', 'NORTH-WEST'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
}

function convertTime(timestamp) 
{
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function renderForecast(data, selectedDate) 
{
  forecastCards.innerHTML = '';
  let count = 0;

  data.list.forEach(item => {
    const datePart = item.dt_txt.split(' ')[0];
    if (datePart === selectedDate && count < 8) 
    {
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <h4>${item.dt_txt.split(' ')[1].slice(0, 5)}</h4>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"/>
        <p>${item.main.temp.toFixed(1)} °C</p>
        <p>${item.weather[0].description}</p>
      `;
      forecastCards.appendChild(card);
      count++;
    }
  });

  if (count === 0) 
{
    forecastCards.innerHTML = `<p>No forecast available for this date.</p>`;
  }
}

async function fetchWeather() 
{
  const city = cityInput.value.trim();
  const selectedDate = datePicker.value;

  if (!city || !selectedDate) 
{
    alert('Please enter a city and select a date.');
    return;
  }

  loader.style.display = 'block';

  try 
  {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!currentRes.ok) throw new Error('City not found');
    const currentData = await currentRes.json();

    cityName.textContent = `${currentData.name}, ${currentData.sys.country}`;
    temperature.textContent = `${currentData.main.temp.toFixed(1)} °C`;
    description.textContent = `Condition: ${currentData.weather[0].description}`;
    humidity.textContent = currentData.main.humidity;
    windSpeed.textContent = currentData.wind.speed;
    windDirection.textContent = getWindDirection(currentData.wind.deg);
    sunrise.textContent = convertTime(currentData.sys.sunrise);
    sunset.textContent = convertTime(currentData.sys.sunset);
    weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!forecastRes.ok) throw new Error('Forecast data not found');
    const forecastData = await forecastRes.json();

    renderForecast(forecastData, selectedDate);

  } 
  catch (err) 
  {
    alert(err.message);
    console.error(err);
  } finally 
  {
    loader.style.display = 'none';
  }
}

getWeatherBtn.addEventListener('click', fetchWeather);

const today = new Date();
datePicker.value = today.toISOString().split('T')[0];
datePicker.min = datePicker.value;
datePicker.max = new Date(today.setDate(today.getDate() + 4)).toISOString().split('T')[0];

async function fetchWeather() 
{
  const city = cityInput.value.trim();
  const selectedDate = datePicker.value;
  const todayDate = new Date().toISOString().split('T')[0];

  if (!city || !selectedDate) 
{
    alert('Please enter a city and select a date.');
    return;
  }

  loader.style.display = 'block';

  try 
  {
    // Fetch forecast data first
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!forecastRes.ok) throw new Error('Forecast data not found');
    const forecastData = await forecastRes.json();

    renderForecast(forecastData, selectedDate);

    // Fetch current weather only if selected date is today
    if (selectedDate === todayDate) 
    {
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

      if (!currentRes.ok) throw new Error('City not found');
      const currentData = await currentRes.json();

      cityName.textContent = `${currentData.name}, ${currentData.sys.country}`;
      temperature.textContent = `${currentData.main.temp.toFixed(1)} °C`;
      description.textContent = `Condition: ${currentData.weather[0].description}`;
      humidity.textContent = currentData.main.humidity;
      windSpeed.textContent = (currentData.wind.speed * 3.6).toFixed(1); 
      windDirection.textContent = getWindDirection(currentData.wind.deg);
      sunrise.textContent = convertTime(currentData.sys.sunrise);
      sunset.textContent = convertTime(currentData.sys.sunset);
      weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
      document.getElementById('weatherContainer').style.display = 'flex';
    }
    else 
    {
      document.getElementById('weatherContainer').style.display = 'none';
    }

  } 
  catch (err) 
  {
    alert(err.message);
    console.error(err);
  } 
  finally 
  {
    loader.style.display = 'none';
  }
}
getWeatherBtn.addEventListener('click', fetchWeather);

// Auto-fetch weather for default city on page load
window.addEventListener('load', () => {
  fetchWeather();
});

