import React from 'react';
import ReactDOM from 'react-dom';
import './Loader.scss';

interface LoaderProps {
    isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return ReactDOM.createPortal(
        <div className="loader-backdrop">
            <div className="loader-container">
                <div className="ios-gear-loading" />
                <p>Loading...</p>
                <p style={{ fontSize: "8px" }}>Free service takes longer than usual to load</p>
            </div>
        </div>,
        document.getElementById('loader')!
    );
};

export default Loader;
