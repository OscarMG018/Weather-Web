import '../styles/SearchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchBar() {

    return (
        <div className="search-container">
            <input type="text" className="search-input" placeholder="Search city or ZIP code..." />
            <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    )
}

export default SearchBar;