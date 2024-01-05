import React, { FC, CSSProperties } from 'react';
import './AddIcon.scss'

interface AddIconProps {
    onClick?: Function;
    darkMode?: boolean;
    backgroundColor?: string;
    size?: number;
    tooltipText?: string;
    showToolTip: boolean;
}

const AddIcon: FC<AddIconProps> = ({
    backgroundColor = 'none',
    size = 25,
    tooltipText = 'Add',
    darkMode = false,
    showToolTip = false,
}) => {
    const iconStyle: CSSProperties = {
        width: size,
        height: size,
        borderRadius: '50%',
        background: backgroundColor,
        backdropFilter: 'blur(4px)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const tooltipStyle: CSSProperties = {
        position: 'absolute',
        bottom: '-112%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '400',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: 0,
        // transition: 'opacity 0.2s ease-in-out',
    };

    const handleMouseEnter = () => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    };

    return (
        <div
            className={`add_icon ${darkMode ? 'darkMode' : ''}`}
            style={iconStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`line1 ${darkMode ? 'darkMode' : ''}`}></div>
            <div className={`line2 ${darkMode ? 'darkMode' : ''}`}></div>
            {showToolTip ? 
            <div id="tooltip" style={tooltipStyle}>
                    {tooltipText}
                </div> : <></>
            }

        </div>
    );
};

export default AddIcon;
