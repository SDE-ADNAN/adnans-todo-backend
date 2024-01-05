// import React, { useEffect } from 'react'
import Register from '../../components/Admin/Register/Register'
// import { useNavigate } from 'react-router-dom';

interface RegisterPageProps {
    setIsAuthenticated: any;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setIsAuthenticated }) => {
    // const navigate = useNavigate()
    // useEffect(() => {
    //     const token = localStorage.getItem('Token');
    //     if (!token) {
    //         setIsAuthenticated(false)
    //     } else {
    //         setIsAuthenticated(true)
    //         navigate('/dashboard')
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    return (
        <Register />
    )
}

export default RegisterPage