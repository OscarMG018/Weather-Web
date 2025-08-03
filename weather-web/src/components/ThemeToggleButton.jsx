import { useTheme } from '../context/ThemeProvider.jsx'

function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button className="btn btn-outline-primary button-primary" onClick={toggleTheme}>
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        </button>
    )
}

export default ThemeToggleButton;
