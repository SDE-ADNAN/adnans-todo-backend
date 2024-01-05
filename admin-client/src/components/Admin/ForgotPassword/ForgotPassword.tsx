import React, { /*useEffect,*/ useState } from 'react';
import { LoginPageProps } from '../../../Pages/Admin/LoginPage';
import PasswordInput from '../../UIComponents/PasswordInput';
import "./ForgotPassword.scss"
import GlassmorphicBackground from '../../UIComponents/Modal/DesignComponents/GlassmorphicBackground';
// import Loader from '../../UIComponents/Loader/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { setLoading } from '../../../ReduxStore/UISlice';
import { useDispatch } from 'react-redux';
import { getUrl, includeDarkClass } from '../../../CONFIG';
import { RootState } from '../../../ReduxStore/store';
import { useSelector } from 'react-redux';
import { setToken } from '../../../ReduxStore/UserSlice';

interface ForgotPasswordProps extends LoginPageProps {
    setIsAuthenticated: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setIsAuthenticated, fetchAllUserData }) => {
    const [email, setEmail] = useState('');
    const [OTP, setOTP] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [OTPSent, setOTPSent] = useState(false)

    const darkMode = useSelector((state: RootState) => state.UI.theme.dark)

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const token = useSelector((state: RootState) => state.User.token)

    const handlEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOTP(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };


    const handleOTPFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(setLoading(true))

        const formdata = new FormData();
        formdata.append('email', email);
        // formdata.append('OTP', OTP);

        fetch(getUrl('/auth/forgotPassword'), {
            method: 'POST',
            body: formdata,
        }).then((response) => {
            if (response.status === 200 || response.ok) {
                setOTPSent(true)
                console.log('OTP sent successfully !!.')
            }
            return response.json()
        }).then((jsonResponse) => {
            dispatch(setLoading(false))
            setError(jsonResponse && jsonResponse.message)
            if (jsonResponse && jsonResponse.token) {
                localStorage.setItem("Token", jsonResponse && jsonResponse.token)
                dispatch(setToken(jsonResponse.token))
                // dispatch(setLoading(true))
                // fetchAllUserData(jsonResponse.token)
                // dispatch(setLoading(false))
                if (token) {
                    navigate('/todos')
                }
            }
        })
            .catch(err => {
                console.error(err)
                setError(err)
                dispatch(setLoading(false))
            })
    };
    const handleResetPasswordFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch(setLoading(true))

        const formdata = new FormData();
        formdata.append('email', email);
        formdata.append('newPassword', password);
        formdata.append('OTP', OTP);

        fetch(getUrl('/auth/resetPassword'), {
            method: 'POST',
            body: formdata,
        }).then((response) => {
            if (response.status === 200 || response.ok) {
                // setOTPSent(true)
                console.log('Password resetted successfully !!.')
                navigate('/login')
            }
            return response.json()
        }).then((jsonResponse) => {
            dispatch(setLoading(false))
            setError(jsonResponse && jsonResponse.message)
            if (jsonResponse && jsonResponse.token) {
                localStorage.setItem("Token", jsonResponse && jsonResponse.token)
                dispatch(setToken(jsonResponse.token))
                // dispatch(setLoading(true))
                // fetchAllUserData(jsonResponse.token)
                // dispatch(setLoading(false))
                if (token) {
                    navigate('/todos')
                }
            }
        })
            .catch(err => {
                console.error(err)
                setError(err)
                dispatch(setLoading(false))
            })
    };

    return (
        <div className={includeDarkClass("main_login_container", darkMode)} >
            <GlassmorphicBackground>
                <h2>Forgot Password</h2>
                <form className={includeDarkClass('login__form', darkMode)} onSubmit={OTPSent ? handleResetPasswordFormSubmit : handleOTPFormSubmit}>
                    {!OTPSent ? <div className={includeDarkClass('inputdiv', darkMode)}>
                        <label htmlFor="email">Registered-email:</label>
                        <input type="text" id="email" value={email} onChange={handlEmailChange} />
                    </div> : ''}


                    {OTPSent ? <>
                        <div className={includeDarkClass('inputdiv', darkMode)}>
                            <input
                                type="text"
                                value={OTP}
                                onChange={handleOTPChange}
                                maxLength={6}
                                placeholder="Enter OTP"
                            />
                        </div>
                        <div className={includeDarkClass('inputdiv', darkMode)}>
                            <PasswordInput label="Password:" id="OTP" value={password} onChange={handlePasswordChange} />
                        </div>
                    </> : ''}
                    <button className={includeDarkClass("login__btn", darkMode)} type="submit">{OTPSent ? 'Reset Password' : 'Generate OTP'}</button>
                </form>
                {error && <p>{JSON.stringify(error)}</p>}
                <div className={includeDarkClass('sign_in_redirect', darkMode)}>
                    Don't have an account ?&nbsp;
                    <Link to='/register'><span>&nbsp;Sign Up / Register</span></Link>
                </div>
            </GlassmorphicBackground>
        </div>
    );
};

export default ForgotPassword;
