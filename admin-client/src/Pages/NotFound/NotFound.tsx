import { useSelector } from "react-redux";
import { includeDarkClass } from "../../CONFIG";
import "./NotFound.scss";
import { RootState } from "../../ReduxStore/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../ReduxStore/UISlice";

interface NotFoundProps {
    isAuthenticated: boolean
}

const NotFound: React.FC<NotFoundProps> = ({ isAuthenticated = false }) => {
    const darkMode = useSelector((state: RootState) => state.UI.theme.dark)
    const token = useSelector((state: RootState) => state.User.token)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setLoading(true))
        if (token) {
            navigate('/todos')
        }
        dispatch(setLoading(false))
    }, [dispatch, navigate, token])
    if (isAuthenticated) {
        return (
            <div className={includeDarkClass(`notfound_main_container  ${isAuthenticated ? "isAuthenticated" : ""}`, darkMode)}>
                <h1>NOT FOUNDsdfsdf</h1>
            </div>
        )
    }
    return (
        <div className={includeDarkClass(`notfound_main_container  ${isAuthenticated ? "isAuthenticated" : ""}`, darkMode)}>
            <h1>NOT FOUND</h1>
        </div>
    )
}

export default NotFound;