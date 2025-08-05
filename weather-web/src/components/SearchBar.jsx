import '../styles/SearchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

function SearchBar() {
    const { t } = useTranslation()
    return (
        <div className="search-container">
            <input type="text" className="search-input" placeholder={t('search_placeholder')} />
            <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    )
}

export default SearchBar;