import React from "react";
import { motion, Transition } from "framer-motion";
import './MenuButton.scss'
import { useSelector } from "react-redux";
import { RootState } from "../../../ReduxStore/store";
import { useDispatch } from "react-redux";
import { toggleMobSidebar } from "../../../ReduxStore/UISlice";

interface Props {
    color?: string;
    strokeWidth?: number;
    transition?: Transition;
    lineProps?: any;
    width?: number;
    height?: number;
}

const MenuButton: React.FC<Props> = ({
    width = 24,
    height = 24,
    strokeWidth = 1,
    color = "#000",
    transition = null,
    lineProps = null,
    ...props
}) => {
    const isMobSidebarOpen = useSelector((state: RootState) => state.UI.isMobSidebarOpen);
    const dispatch = useDispatch()
    const variant = isMobSidebarOpen ? "opened" : "closed";
    const top = {
        closed: {
            rotate: 0,
            translateY: 0,
        },
        opened: {
            rotate: 45,
            translateY: 2,
        },
    };
    const center = {
        closed: {
            opacity: 1,
        },
        opened: {
            opacity: 0,
        },
    };
    const bottom = {
        closed: {
            rotate: 0,
            translateY: 0,
        },
        opened: {
            rotate: -45,
            translateY: -2,
        },
    };
    lineProps = {
        stroke: color,
        strokeWidth: strokeWidth,
        vectorEffect: "non-scaling-stroke",
        initial: "closed",
        animate: variant,
        transition,
        ...lineProps,
    };
    const unitHeight = 4;
    const unitWidth = (unitHeight * (width)) / (height);




    return (
        <motion.svg
            viewBox={`0 0 ${unitWidth} ${unitHeight}`}
            overflow="visible"
            preserveAspectRatio="none"
            width={width}
            height={height}
            {...props}
            onClick={() => dispatch(toggleMobSidebar())}
        >
            <motion.line
                x1="0"
                x2={unitWidth}
                y1="0"
                y2="0"
                variants={top}
                {...lineProps}
            />
            <motion.line
                x1="0"
                x2={unitWidth}
                y1="2"
                y2="2"
                variants={center}
                {...lineProps}
            />
            <motion.line
                x1="0"
                x2={unitWidth}
                y1="4"
                y2="4"
                variants={bottom}
                {...lineProps}
            />
        </motion.svg>
    );
};

export { MenuButton };
