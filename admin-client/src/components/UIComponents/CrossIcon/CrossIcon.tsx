import React, { FC, CSSProperties } from 'react';
import './CrossIcon.scss'

interface CrossIconProps {
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    darkMode?: boolean;
    backgroundColor?: string;
    size?: number;
    tooltipText?: string;
    showToolTip?: boolean;
}

const CrossIcon: FC<CrossIconProps> = ({
    backgroundColor = 'none',
    size = 25,
    tooltipText = 'Cross',
    darkMode = false,
    showToolTip = false,
    onClick = () => { },
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
        const tooltip = document.getElementById('cross_tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const tooltip = document.getElementById('cross_tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    };

    return (
        <div
            className={`cross_icon danger ${darkMode ? 'darkMode' : ''}`}
            style={iconStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title="DELETE"
            onClick={onClick}
        >
            <div className={`line1 danger ${darkMode ? 'darkMode' : ''}`}></div>
            <div className={`line2 danger ${darkMode ? 'darkMode' : ''}`}></div>
            {showToolTip ?
            <div id="cross_tooltip" style={tooltipStyle}>
                    {tooltipText}
                </div> : <></>
            }

        </div>
    );
};

export default CrossIcon;
