import { useState } from "react";
import { predictDisasterRisk } from "../services/geminiService";
import { Loader2, AlertTriangle, Info, CloudLightning } from "lucide-react";

export default function RiskDashboard() {
  const [location, setLocation] = useState("San Francisco, CA");
  const [temperature, setTemperature] = useState(75);
  const [humidity, setHumidity] = useState(40);
  const [rainfall, setRainfall] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFetchLiveData = async () => {
    if (!location) {
      setError("Please enter a location to fetch live data.");
      return;
    }
    setFetchingWeather(true);
    setError("");
    try {
      // 1. Geocode the location
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Location not found. Try a different city name.");
      }
      const { latitude, longitude, name, admin1 } = geoData.results[0];
      setLocation(`${name}${admin1 ? `, ${admin1}` : ""}`);
      // 2. Fetch current weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&temperature_unit=fahrenheit&precipitation_unit=inch`,
      );
      const weatherData = await weatherRes.json();
      if (weatherData.current) {
        setTemperature(Math.round(weatherData.current.temperature_2m));
        setHumidity(Math.round(weatherData.current.relative_humidity_2m));
        setRainfall(weatherData.current.precipitation || 0);
      } else {
        throw new Error("Failed to retrieve weather data for this location.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch live weather data.");
    } finally {
      setFetchingWeather(false);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await predictDisasterRisk(location, {
        temperature,
        humidity,
        recentRainfall: rainfall,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to predict risk");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "Low":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "High":
        return "text-orange-500";
      case "Critical":
        return "text-red-500";
      default:
        return "text-slate-500";
    }
  };

  const getStrokeColor = (level) => {
    switch (level) {
      case "Low":
        return "#22c55e"; // green-500
      case "Medium":
        return "#eab308"; // yellow-500
      case "High":
        return "#f97316"; // orange-500
      case "Critical":
        return "#ef4444"; // red-500
      default:
        return "#64748b"; // slate-500
    }
  };

  const renderGauge = () => {
    if (!result) return null;
    const val = parseInt(result.probability.replace("%", "")) || 0;
    const radius = 80;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (val / 100) * circumference;
    const strokeColor = getStrokeColor(result.riskLevel);

    return (
      <div className="relative flex flex-col items-center justify-center h-40">
        <svg className="w-64 h-32" viewBox="0 0 200 100">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div
          className="absolute bottom-0 text-4xl font-bold"
          style={{ color: strokeColor }}
        >
          {result.probability}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
        <AlertTriangle className="h-6 w-6 mr-2 text-blue-500" />
        Localized Risk Predictor
      </h2>

      <div className="flex flex-col gap-6">
        {/* Input Form */}
        <div className="w-full space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-700">
              Environmental Data
            </h3>
            <button
              onClick={handleFetchLiveData}
              disabled={fetchingWeather}
              className="text-xs flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 py-1.5 px-3 rounded-full transition-colors disabled:opacity-50"
            >
              {fetchingWeather ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <CloudLightning className="h-3 w-3 mr-1.5" />
              )}
              Fetch Live Data
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., Miami, FL"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Temp (°F)
              </label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Humidity (%)
              </label>
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rain (in)
              </label>
              <input
                type="number"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              "Predict Risk"
            )}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Results Display */}
        <div className="w-full">
          {result ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm h-full">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                {/* Gauge */}
                <div className="flex flex-col items-center mb-6 md:mb-0 w-full md:w-1/2">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Risk Meter
                  </h4>
                  {renderGauge()}
                  <p className="text-slate-600 font-medium mt-2">Probability</p>
                </div>

                {/* Summary */}
                <div className="flex-1 md:ml-8 space-y-4 w-full">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                      Risk Level
                    </p>
                    <p
                      className={`text-3xl font-bold ${getRiskColor(result.riskLevel)}`}
                    >
                      {result.riskLevel}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                      Primary Threat
                    </p>
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
                      <p className="text-xl font-bold text-slate-800">
                        {result.primaryThreat}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Factors */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  Key Risk Factors
                </h4>
                <ul className="space-y-2">
                  {result.keyRiskFactors.map((factor, idx) => (
                    <li
                      key={idx}
                      className="flex items-start bg-slate-50 p-3 rounded-md border border-slate-100"
                    >
                      <span className="h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3 flex-shrink-0"></span>
                      <span className="text-slate-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg p-8 min-h-[300px]">
              <AlertTriangle className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium text-center">
                Enter environmental data and click predict to see AI risk
                analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
