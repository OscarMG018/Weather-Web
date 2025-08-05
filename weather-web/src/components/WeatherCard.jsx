import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WeatherCard({ icon, color, text, title }) {
    return (
        <div className="col-12 col-md-4 col-lg-6 col-xl-4">
            <div className="p-3 rounded-3 background-secondary h-100">
                <div className="d-flex flex-column h-100">
                    <div className="d-flex justify-content-start mb-2">
                        <FontAwesomeIcon 
                            icon={icon} 
                            style={{ color: color, fontSize: '1.2rem' }} 
                        />
                    </div>
                    <div className="flex-grow-1 d-flex flex-column justify-content-center">
                        <h2 className="tx-secondary text-center mb-1 fw-light">
                            {text}
                        </h2>
                        <h6 className="tx-secondary text-center mb-0 text-uppercase">
                            {title}
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherCard;