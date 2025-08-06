import '../styles/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useServer } from '../context/ServerContext.jsx';
import { useCurrentLocation } from '../context/CurrentLocationContext.jsx';

function SearchBar() {
    const { t, i18n } = useTranslation();
    const { serverUrl } = useServer();
    const { setCurrentLocation } = useCurrentLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        const controller = new AbortController();
        fetch(`${serverUrl}/api/locations/search?name=${encodeURIComponent(query)}`, { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setShowDropdown(true);
            })
            .catch(() => {});
        return () => controller.abort();
    }, [query, serverUrl]);

    const handleSelect = (loc) => {
        fetch(`${serverUrl}/api/weather/all?location=${encodeURIComponent(loc.name.en)}`)
            .then(res => res.json())
            .then(data => {
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
            />
            <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
            </button>
            {showDropdown && results.length > 0 && (
                <ul className="search-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '0 0 8px 8px',
                    zIndex: 10,
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}>
                    {results.map(loc => (
                        <li key={loc.id} style={{ padding: '8px 16px', cursor: 'pointer' }} onMouseDown={() => handleSelect(loc)}>
                            {loc.name[i18n.language] || loc.name.en || ""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;