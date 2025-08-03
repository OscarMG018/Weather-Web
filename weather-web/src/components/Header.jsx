
function Header({ className, children }) {
    return (
        <div className={`w-100 ${className}`}>
            {children}
        </div>
    )
}

export default Header;