import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

/* 🔐 API key from .env (Vite) */
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/* 🌤️ Weather → Emoji mapping (UX polish) */
const weatherEmojiMap = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️",
};

export default function SearchBox() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      /* 1️⃣ Fetch coordinates */
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) {
        throw new Error("City not found");
      }

      const { lat, lon, name, country } = geoData[0];

      /* 2️⃣ Fetch weather */
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await weatherRes.json();

      /* 3️⃣ Format data */
      const formattedData = {
        city: name,
        country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        weather: data.weather[0].main,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      };

      setWeatherData(formattedData);
      setCity("");
    } catch (err) {
      setError(err.message || "Failed to fetch weather data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", p: 3, mt: 6 }}>
      {/* Title */}
      <Typography variant="h4" align="center" gutterBottom>
        Weather App
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        Enter any city name and press Enter
      </Typography>

      {/* Search */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 1, my: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : "Search"}
          </Button>
        </Box>
      </form>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Weather Card */}
      {weatherData && (
        <Card
          sx={{
            mt: 2,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h5">
                  {weatherEmojiMap[weatherData.weather] || "🌤️"}{" "}
                  {weatherData.city}, {weatherData.country}
                </Typography>
                <Typography color="text.secondary">
                  {weatherData.weather} — {weatherData.description}
                </Typography>
              </Box>

              <img
                src={weatherData.icon}
                alt={weatherData.weather}
                width={64}
                height={64}
              />
            </Box>

            <Typography variant="h2" sx={{ my: 2 }}>
              {weatherData.temp}°C
            </Typography>

            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Typography color="text.secondary">
                  Feels like: {weatherData.feelsLike}°C
                </Typography>
                <Typography color="text.secondary">
                  Humidity: {weatherData.humidity}%
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">
                  Wind: {weatherData.wind} m/s
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
