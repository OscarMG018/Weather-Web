        import '../styles/SearchBar.css';
        import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
        import { faSearch } from '@fortawesome/free-solid-svg-icons';
        import { useTranslation } from 'react-i18next';
        import { useState, useEffect } from 'react';
        import { useServer } from '../context/ServerContext.jsx';
        import { useCurrentLocation } from '../context/CurrentLocationContext.jsx';
        import { useTheme } from '../context/ThemeProvider';

        function SearchBar() {
            const { t, i18n } = useTranslation();
            const { serverUrl } = useServer();
            const { setCurrentLocation } = useCurrentLocation();
            const [query, setQuery] = useState('');
            const [results, setResults] = useState([]);
            const [showDropdown, setShowDropdown] = useState(false);
            const { theme } = useTheme();

            useEffect(() => {
                if (query.trim().length === 0) {
                    setResults([]);
                    setShowDropdown(false);
                    return;
                }
                const controller = new AbortController();
                fetch(`${serverUrl}/api/locations/search?name=${encodeURIComponent(query)}&lang=${i18n.language}`, { signal: controller.signal })
                    .then(res => res.json())
                    .then(data => {
                        setResults(data);
                        setShowDropdown(true);
                    })
                    .catch(() => {});
                return () => controller.abort();
            }, [query, serverUrl]);

            const fetchWeatherByCoords = (lat, lon) => {
                return fetch(`${serverUrl}/api/weather/all?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`)
                    .then(async (res) => {
                        if (!res.ok) {
                            const error = new Error(`HTTP ${res.status}`);
                            error.status = res.status;
                            throw error;
                        }
                        return res.json();
                    });
            };

            const fetchWeatherByName = (name) => {
                return fetch(`${serverUrl}/api/weather/all?name=${encodeURIComponent(name)}&lang=${i18n.language}`)
                    .then(async (res) => {
                        if (!res.ok) {
                            const error = new Error(`HTTP ${res.status}`);
                            error.status = res.status;
                            throw error;
                        }
                        return res.json();
                    });
            };

            const handleSelect = (loc) => {
                const lat = loc?.lat;
                const lon = loc?.lon;
                if (typeof lat !== 'number' || typeof lon !== 'number') return;
                fetchWeatherByCoords(lat, lon)
                    .then((data) => {
                        setCurrentLocation(data);
                        setShowDropdown(false);
                        setQuery('');
                    })
                    .catch(() => {
                        setShowDropdown(false);
                    });
            };

            const handleSearch = () => {
                const name = query.trim();
                if (name.length === 0) return;
                fetchWeatherByName(name)
                    .then((data) => {
                        setCurrentLocation(data);
                        setShowDropdown(false);
                        setQuery('');
                    })
                    .catch(() => {
                        setShowDropdown(false);
                    });
            };

            return (
                <div className="search-container" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t('search_placeholder')}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                    />
                    <button className="search-btn" onClick={handleSearch} aria-label="Search">
                        <FontAwesomeIcon icon={faSearch} color= {theme === 'dark' ? '#fff' : '#000'} />
                    </button>
                    {showDropdown && results.length > 0 && (
                        <ul className="search-dropdown">
                            {results.map((loc) => (
                                <li
                                    key={loc.id}
                                    className="search-dropdown-item"
                                    onMouseDown={() => handleSelect(loc)}
                                >
                                    {loc.name[i18n.language] || loc.name.en || ''}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        export default SearchBar;