import React from 'react'
import "./CTAIconWrapper.scss"
import { includeDarkClass } from '../../../CONFIG'
import { useSelector } from 'react-redux'
import { RootState } from '../../../ReduxStore/store'

type Props = {
    children: React.ReactNode,
    onClick: any
}

const CTAIconWrapper: React.FC<Props> = ({ children, onClick }) => {
    const darkMode = useSelector((state: RootState) => state.UI.theme.dark)
    return (
        <div className={includeDarkClass("icon_Wrapper", darkMode)} onClick={onClick}>
            {children}
        </div>
    )
}

export default CTAIconWrapper