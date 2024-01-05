import React from 'react';
import './GlassmorphicBackground.scss';
import { includeDarkClass } from '../../../../CONFIG';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../ReduxStore/store';

interface GlassmorphicBackgroundProps {
    children: React.ReactNode;
}

const GlassmorphicBackground: React.FC<GlassmorphicBackgroundProps> = ({ children }) => {
    const darkMode = useSelector((state: RootState) => state.UI.theme.dark)
    return (
        <div className={includeDarkClass("glassmorphic-background", darkMode)}>
            {children}
        </div>
    );
};

export default GlassmorphicBackground;
