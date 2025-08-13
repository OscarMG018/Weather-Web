import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/ForecastCardSection.css';
import { useTheme } from '../context/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useCurrentLocation } from '../context/CurrentLocationContext.jsx';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { useUnits,
  celsiusToFahrenheit,
  kmhToMph,
} from '../context/UnitsProvider';



function getDateLabel(item) {
  const date = new Date(item.time * 1000);
  console.log(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
}

const ForecastCardSection = () => {
  const [activeMetric, setActiveMetric] = useState('temperature');
  const [dayIndex, setDayIndex] = useState(0);
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { currentLocation } = useCurrentLocation();
  const forecast = currentLocation?.forecast;
  const { units } = useUnits();

  // If no forecast, show prompt
  if (!forecast || forecast.length === 0) {
    return (
      <div className="p-3 rounded-4 background-primary forecast-card-section text-center">
        <h3 className="tx-primary mb-4">{t('24_hour_forecast')}</h3>
        <p className="tx-secondary">{t('search_for_location') || 'Search for a location'}</p>
      </div>
    );
  }

  const groupBy24HourPeriods = (forecastArr) => {
    if (forecastArr.length === 0) return {};
    
    const startTime = forecastArr[0].time * 1000; 
    const hoursIn24 = 24 * 3600 * 1000; 
    
    return forecastArr.reduce((acc, item) => {
      const itemTime = item.time * 1000;
      const timeDiff = itemTime - startTime;
      const periodIndex = Math.floor(timeDiff / hoursIn24);
      
      if (!acc[periodIndex]) {
        acc[periodIndex] = [];
      }
      acc[periodIndex].push(item);
      return acc;
    }, {});
  };

  function getWeatherUnitText(unitState, metric, value) {
    if (value === undefined) return 0;
    if (unitState === 'imperial') {
      switch (metric) {
        case 'temperature':
          return celsiusToFahrenheit(value)
        case 'wind_speed':
          return kmhToMph(value)
        case 'humidity':
          return value
        default:
          return value
      }
    } 
    else {
      return value
    }
  }

  function getDateLabel(date, lang) {
    const format = {
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };
    const locales = {
      'es': 'es-ES',
      'fr': 'fr-FR',
      'en': 'en-US'
    };
    const locale = locales[lang] || 'en-US';
    return date.toLocaleString(locale, format);
  }

  function getWeatherIcons(forecast) {
    return forecast.map(item => {
      const weather = item.weather;
      switch (weather) {
        case 'Thunderstorm':
          return createFontAwesomeIcon('\uf76c');
        case 'Drizzle':
          return createFontAwesomeIcon('\uf743');
        case 'Rain':
          return createFontAwesomeIcon('\uf73d');
        case 'Snow':
          return createFontAwesomeIcon('\uf2dc');
        case 'Mist':
          return createFontAwesomeIcon('\uf75f');
        case 'Smoke':
          return createFontAwesomeIcon('\uf75f');
        case 'Haze':
          return createFontAwesomeIcon('\uf75f');
        case 'Dust':
          return createFontAwesomeIcon('\uf75f');
        case 'Fog':
          return createFontAwesomeIcon('\uf75f');
        case 'Sand':
          return createFontAwesomeIcon('\uf75f');
        case 'Ash':
          return createFontAwesomeIcon('\uf75f');
        case 'Squall':
          return createFontAwesomeIcon('\uf740');
        case 'Tornado':
          return createFontAwesomeIcon('\uf76f');
        case 'Clear':
          return createFontAwesomeIcon('\uf185');
        case 'Clouds':
          return createFontAwesomeIcon('\uf0c2');
        default:
          return createFontAwesomeIcon('\u003f');
      }
    });
  }

  function createFontAwesomeIcon(iconCode) {
    const size = 30;
    const color = theme === 'dark' ? '#fff' : '#333';
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Set font to FontAwesome
    ctx.font = `${size * 0.7}px "FontAwesome"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.zIndex = 10;
    
    // Draw the FontAwesome icon
    ctx.fillText(iconCode, 16, size / 2);
    
    return canvas;
}

  const forecastByPeriod = groupBy24HourPeriods(forecast);
  const periodKeys = Object.keys(forecastByPeriod).map(Number).sort((a, b) => a - b);
  const selectedPeriodKey = periodKeys[dayIndex] || periodKeys[0];
  const selectedPeriodForecast = forecastByPeriod[selectedPeriodKey] || [];

  // Build chart data from selected period's forecast
  const labels = selectedPeriodForecast.map((item) => new Date(item.time * 1000));
  const temperature = selectedPeriodForecast.map(item => getWeatherUnitText(units, 'temperature', item.temp));
  const windSpeed = selectedPeriodForecast.map(item => getWeatherUnitText(units, 'wind_speed', item.wind?.speed));
  const humidity = selectedPeriodForecast.map(item => getWeatherUnitText(units, 'humidity', item.humidity));

  const temperatureIcons = getWeatherIcons(selectedPeriodForecast);

  const forecastData = {
    labels,
    temperature,
    windSpeed,
    humidity
  };

  const metrics = [
    { key: 'temperature', label: t('temperature'), unit: '°C', color: '#ff6b6b', icons: temperatureIcons },
    { key: 'windSpeed', label: t('wind_speed'), unit: 'km/h', color: '#4ecdc4' },
    { key: 'humidity', label: t('humidity'), unit: '%', color: '#4444ff' }
  ];

  ChartJS.defaults.font.family = "'FontAwesome', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
  const getChartData = (metric) => {
    const selectedMetric = metrics.find(m => m.key === metric);
    return {
      labels: forecastData.labels,
      datasets: [
        {
          label: selectedMetric.label,
          data: forecastData[metric],
          borderColor: selectedMetric.color,
          backgroundColor: selectedMetric.color + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: selectedMetric.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointStyle: selectedMetric.icons,
          clip: false
        },
      ],
    };
  };

  const chartOptions = {
    layout: {
      padding: { top: 10, bottom: 10, left: 10, right: 20 }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const selectedMetric = metrics.find(m => m.key === activeMetric);
            return `${selectedMetric.label}: ${context.parsed.y} ${selectedMetric.unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM d, HH:mm',
          }
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.3)',
          borderColor: 'rgba(128, 128, 128, 0.5)',
          borderWidth: 1,
        },
        border: {
          color: 'rgba(128, 128, 128, 0.5)',
          width: 1
        },
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
          font: {
            size: 12,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          },
          callback: function(value) {
            const date = new Date(value);
            return getDateLabel(date, i18n.language);
          }
        }
      },
      y: {
        min: 0,
        grid: {
          color: 'rgba(128, 128, 128, 0.3)',
          borderColor: 'rgba(128, 128, 128, 0.5)',
          borderWidth: 1,
        },
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
          font: {
            size: 12,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }
        },
        border: {
          color: 'rgba(128, 128, 128, 0.5)',
          width: 1
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#fff',
      }
    }
  };

  // Navigation handlers
  const handlePrevDay = () => setDayIndex((prev) => Math.max(prev - 1, 0));
  const handleNextDay = () => setDayIndex((prev) => Math.min(prev + 1, periodKeys.length - 1));

  // Generate period label based on start and end times
  const getPeriodLabel = (periodKey) => {
    if (!forecast || forecast.length === 0) return '';
    
    const startTime = forecast[0].time * 1000;
    const hoursIn24 = 24 * 60 * 60 * 1000;
    const periodStartTime = new Date(startTime + (periodKey * hoursIn24));
    const periodEndTime = new Date(startTime + ((periodKey + 1) * hoursIn24) - 1);
    
    function formatTime(date, lang) {
      const format = {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit'
      };
      const locales = {
        'es': 'es-ES',
        'fr': 'fr-FR',
        'en': 'en-US'
      };
      const locale = locales[lang] || 'en-US';
      return date.toLocaleString(locale, format);
    }
    
    return `${formatTime(periodStartTime, i18n.language)} - ${formatTime(periodEndTime, i18n.language)}`; 
  };

  // Returns a localized label like: "weekday day num, month short"
  const getPeriodWeekdayLabel = (periodKey) => {
    if (!forecast || forecast.length === 0) return '';

    const startTime = forecast[0].time * 1000;
    const hoursIn24 = 24 * 60 * 60 * 1000;
    const periodStartTime = new Date(startTime + (periodKey * hoursIn24));

    const locales = {
      'es': 'es-ES',
      'fr': 'fr-FR',
      'en': 'en-US'
    };
    const locale = locales[i18n.language] || 'en-US';
    const parts = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'short' }).formatToParts(periodStartTime);
    const weekday = parts.find(p => p.type === 'weekday')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    return `${weekday} ${day}, ${month}`;
  };

  return (
    <div className="p-3 rounded-4 background-primary forecast-card-section">
      <h3 className="tx-primary mb-4 text-center">{t('24_hour_forecast')}</h3>
      {/* Toggle Buttons */}
      <div className="forecast-toggle-buttons">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setActiveMetric(metric.key)}
            className={`btn btn-outline-primary forecast-toggle-button ${
              activeMetric === metric.key ? 'active' : ''
            }`}
            style={{
              borderColor: metric.color,
              color: activeMetric === metric.key ? '#fff' : metric.color,
              backgroundColor: activeMetric === metric.key ? metric.color : 'transparent',
            }}
          >
            {metric.label}
          </button>
        ))}
      </div>
      {/* Current day label above the chart */}
      <div className="text-center mb-2">
        <strong>{getPeriodWeekdayLabel(selectedPeriodKey)}</strong>
      </div>
      {/* Chart Container with slider buttons */}
      <div className="chart-slider-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button
          className="slider-btn slider-btn-left"
          onClick={handlePrevDay}
          disabled={dayIndex === 0}
          aria-label="Previous 24-hour period"
        >
          <FontAwesomeIcon color={theme === 'dark' ? '#fff' : '#000'} icon={faChevronLeft}  />
        </button>
        <div className="chart-scroll">
          <div className="chart-container chart-scroll-inner" style={{ height: '300px', flex: 1 }}>
            <Line data={getChartData(activeMetric)} options={chartOptions} />
          </div>
        </div>
        <button
          className="slider-btn slider-btn-right"
          onClick={handleNextDay}
          disabled={dayIndex === periodKeys.length - 1}
          aria-label="Next 24-hour period"
        >
          <FontAwesomeIcon color={theme === 'dark' ? '#fff' : '#000'} icon={faChevronRight}  />
        </button>
      </div>
      {/* Period label */}
      <div className="text-center mt-2 mb-2">
        <strong>{getPeriodLabel(selectedPeriodKey)}</strong>
      </div>
      {/* Current Metric Info */}
      <div className="text-center forecast-info">
        <small className="tx-secondary">
          {t('forecast_for_next_24_hours', { metric: metrics.find(m => m.key === activeMetric)?.label })}
        </small>
      </div>
    </div>
  );
};

export default ForecastCardSection;