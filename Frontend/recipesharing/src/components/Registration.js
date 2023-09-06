import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  };

  const handleRegistration = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Password and Confirm Password do not match.');
      return;
    }

    clearErrors();

    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(data)
          })
      .then((response) => {
        if (response.status === 200) {
        toast.success("Registration Succesfull")
        navigate('/login');
        return response.json();
          
        } else if (response.status === 400) {
          toast.error('User already exists'); 
          throw new Error('User already exists'); 
        } else {
          toast.error('Registration failed');
          throw new Error('Registration failed'); 
        }
      })
      .then((result) => {
        console.log(result); 
        toast.success('Registration successful');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Having Container
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers
//Card Body
//https://getbootstrap.com/docs/5.1/layout/containers/#responsive-containers https://getbootstrap.com/docs/5.1/components/card/ 
//form control
//https://getbootstrap.com/docs/5.0/forms/form-control/

  return (
    <div className="container py-6">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Registration Page</h2>
              <form className="form-inline" onSubmit={handleRegistration}>
                <div className="form-group">
                  <label htmlFor="firstName" style={{ marginTop: '10px' }}>First Name:</label>
                  <input type="text" className="form-control form-control-sm mx-sm-2" id="firstName" value={firstName} onChange={(e) => { setFirstName(e.target.value); clearErrors(); }} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" style={{ marginTop: '10px' }}>Last Name:</label>
                  <input type="text" className="form-control form-control-sm mx-sm-2" id="lastName" value={lastName} onChange={(e) => { setLastName(e.target.value); clearErrors(); }} />
                </div>
                <div className="form-group">
                  <label htmlFor="email" style={{ marginTop: '10px' }}>Email:</label>
                  <input type="email" className={`form-control form-control-sm mx-sm-2 ${emailError ? 'is-invalid' : ''}`} id="email" value={email} onChange={(e) => { setEmail(e.target.value); clearErrors(); }} />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="password" style={{ marginTop: '10px' }}>Password:</label>
                  <input type="password" className={`form-control form-control-sm mx-sm-2 ${passwordError ? 'is-invalid' : ''}`} id="password" value={password} onChange={(e) => { setPassword(e.target.value); clearErrors(); }} />
                  {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword" style={{ marginTop: '10px' }}>Confirm Password:</label>
                  <input type="password" className={`form-control form-control-sm mx-sm-2 ${passwordError ? 'is-invalid' : ''}`} id="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearErrors(); }} />
                  {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary mt-2">Register</button>
                </div>
              </form>
              <p className="text-center mt-3">Already a user? <a href="/login">Login</a></p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default RegistrationPage;
