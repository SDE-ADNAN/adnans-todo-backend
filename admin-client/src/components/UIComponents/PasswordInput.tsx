import React, { useState } from 'react';
import "./PasswordInput.scss"
import { hide, show } from '../../medias';

interface PasswordInputProps {
  label: string;
  id:string;
  value:string;
  onChange:any;
  required?: any;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, id, value, onChange, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='passwordInput'>
      <label htmlFor={id}>{label}</label>
      <div className='inputFeild'>
      <input
      id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={handleInputChange}
          required={required}
      />
      <div className='show_hide' onClick={togglePasswordVisibility}>
        {showPassword ? <img src={show} alt="show"></img> : <img src={hide} alt="hide"></img>}
      </div></div>
    </div>
  );
};

export default PasswordInput;
