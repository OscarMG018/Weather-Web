import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/ForecastCardSection.css';
import { useTheme } from '../context/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useCurrentLocation } from '../context/CurrentLocationContext.jsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForecastCardSection = () => {
  const [activeMetric, setActiveMetric] = useState('temperature');
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLocation } = useCurrentLocation();
  const forecast = currentLocation?.forecast;

  // If no forecast, show prompt
  if (!forecast || forecast.length === 0) {
    return (
      <div className="p-3 rounded-4 background-primary forecast-card-section text-center">
        <h3 className="tx-primary mb-4">{t('24_hour_forecast')}</h3>
        <p className="tx-secondary">{t('search_for_location') || 'Search for a location'}</p>
      </div>
    );
  }

  // Build chart data from forecast
  const labels = forecast.map((item, idx) => `${3 * idx}:00`);
  const temperature = forecast.map(item => item.temp);
  const windSpeed = forecast.map(item => item.wind?.speed);
  const humidity = forecast.map(item => item.humidity);
  const pressure = forecast.map(item => item.pressure || 1013);
  const visibility = forecast.map(item => (item.visibility !== undefined ? item.visibility / 1000 : null));

  const forecastData = {
    labels,
    temperature,
    windSpeed,
    humidity,
    pressure,
    visibility
  };

  const metrics = [
    { key: 'temperature', label: t('temperature'), unit: '°C', color: '#ff6b6b' },
    { key: 'windSpeed', label: t('wind_speed'), unit: 'km/h', color: '#4ecdc4' },
    { key: 'humidity', label: t('humidity'), unit: '%', color: '#8e44ad' },
    { key: 'pressure', label: t('air_pressure'), unit: 'hPa', color: '#e67e22' },
    { key: 'visibility', label: t('visibility'), unit: 'km', color: '#feca57' }
  ];

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
        },
      ],
    };
  };

  const chartOptions = {
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
      },
      y: {
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
      {/* Chart Container */}
      <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
        <Line data={getChartData(activeMetric)} options={chartOptions} />
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
