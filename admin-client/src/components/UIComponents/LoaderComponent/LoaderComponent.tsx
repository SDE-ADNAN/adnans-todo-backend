import React from 'react';
import './LoaderComponent.scss';

const LoaderComponent: React.FC = () => {

    return (
        <div className="loader-backdrop">
            <div className="loader-container">
                <div className="ios-gear-loading" />
                <p>Loading...</p>
                <p style={{ fontSize: "8px", color: 'red' }}>** Free service takes longer than usual to load **</p>
            </div>
        </div>
    );
};

export default LoaderComponent;
