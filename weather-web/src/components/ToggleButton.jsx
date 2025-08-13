function ToggleButton({ toggleValue, setToggleValue, toggleActiveValue, activeText, inactiveText }) {
    return (
        <button className="btn btn-outline-primary button-primary" onClick={setToggleValue}>
            {toggleValue === toggleActiveValue ? activeText : inactiveText}
        </button>
    )
}

export default ToggleButton;
