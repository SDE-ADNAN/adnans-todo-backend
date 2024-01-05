import { useEffect } from "react";
import Login from "../../components/Admin/Login/Login"
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../../ReduxStore/store";

export interface LoginPageProps {
    setIsAuthenticated: any;
    isAuthenticated: boolean;
    fetchAllUserData: any;
}
const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, isAuthenticated, fetchAllUserData = () => { } }) => {
    const navigate = useNavigate()
    // const reduxToken = useSelector((state: RootState) => state.User.token)
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} fetchAllUserData={fetchAllUserData} />
    )
}

export default LoginPage;