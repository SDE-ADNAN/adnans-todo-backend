import React, { useState } from 'react'
import "./Register.scss"
import { Link, useNavigate } from 'react-router-dom';
import GlassmorphicBackground from '../../UIComponents/Modal/DesignComponents/GlassmorphicBackground';
import PasswordInput from '../../UIComponents/PasswordInput';
import { setLoading } from '../../../ReduxStore/UISlice';
import { useDispatch } from 'react-redux';
import { getUrl } from '../../../CONFIG';


interface RegisterProps {
}

const Register: React.FC<RegisterProps> = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState('');

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const handleProfilePicUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProfilePicUrl(event.target.value);
    };

    const handleLoginFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setLoading(true))
        const formdata = new FormData();
        formdata.append('userName', userName);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('profilePicUrl', profilePicUrl);

        fetch(getUrl('/auth/register'), {
            method: 'POST',
            body: formdata,
        }).then((response) => {
            if (response.ok) {
                dispatch(setLoading(false))
                navigate('/login')
            }
            dispatch(setLoading(false))
        }).catch(err => {
            console.error(err)
            dispatch(setLoading(false))
        })
    };

    return (
        <div className="main_register_container">
            <GlassmorphicBackground>
                <h1>Register</h1>
                <form className='login__form' onSubmit={handleLoginFormSubmit}>
                    <div className='inputdiv'>
                        <label htmlFor="userName">UserName:</label>
                        <input type="text" id="userName" value={userName} onChange={handleUserNameChange} required />
                    </div>
                    <div className='inputdiv'>
                        <label htmlFor="email">Email-ID:<span style={{ color: 'red' }}>**</span></label>
                        <input type="text" id="email" value={email} onChange={handleEmailChange} required />
                    </div>
                    <div className='inputdiv'>
                        <label htmlFor="profilePicUrl">Profile Pic Url:</label>
                        <input type="text" id="profilePicUrl" value={profilePicUrl} onChange={handleProfilePicUrlChange} required />
                    </div>
                    <div className='inputdiv'>
                        <PasswordInput label="Password:" id="password" value={password} onChange={handlePasswordChange} required />
                    </div>
                    <button className="login__btn" type="submit">Register</button>
                    <div className='sign_in_redirect'>
                        Already have an account ?
                        <Link to='/login'><span>Sign In / Log In</span></Link>
                    </div>
                </form>
            </GlassmorphicBackground>
        </div>
    )
}

export default Register