import { useTheme } from '../context/ThemeProvider.jsx'

function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button className="btn btn-primary" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
    )
}

export default ThemeToggleButton;
