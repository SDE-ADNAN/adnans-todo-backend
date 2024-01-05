import React, { FC, CSSProperties, MouseEventHandler } from 'react';
import './ChevronIcon.scss'
import { generateUniqueID } from '../../../api';

interface ChevronIconProps {
    onClick?: MouseEventHandler<HTMLDivElement>;
    darkMode?: boolean;
    backgroundColor?: string;
    size?: number;
    tooltipText?: string;
}

const ChevronIcon: FC<ChevronIconProps> = ({
    backgroundColor = 'none',
    size = 25,
    tooltipText = 'More',
    darkMode = false,
    onClick = () => { }
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

    const chevRandomUnique32Id = generateUniqueID()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const tooltip = document.getElementById(chevRandomUnique32Id);
        if (tooltip) {
            tooltip.style.opacity = '1';
        }
    };



    const handleMouseLeave = () => {
        const tooltip = document.getElementById(chevRandomUnique32Id);
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    };

    // const Tooltip = ({ tooltipText = '' }) => {
    //     return (
    //         <>
    //             {ReactDOM.createPortal(<div id={chevRandomUnique32Id} style={tooltipStyle}>
    //                 {tooltipText}
    //             </div>, document.body)}
    //         </>
    //     )
    // }

    return (
        <div
            className={`chevron_icon ${darkMode ? 'darkMode' : ''}`}
            style={iconStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={tooltipText}
            onClick={onClick}
        >
            <div className={`line1 ${darkMode ? 'darkMode' : ''}`}></div>
            <div className={`line2 ${darkMode ? 'darkMode' : ''}`}></div>
            {/* <div id={chevRandomUnique32Id} style={tooltipStyle}>
                {tooltipText}
            </div> */}
        </div>
    );
};

export default ChevronIcon;
