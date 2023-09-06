import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; 

import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    const data = {
      email,
      password,
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
     
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          toast.error('Invalid credentials');
          throw new Error('Invalid credentials');
        } else if (response.status === 404) {
          toast.error('User not found');
          throw new Error('User not found');
        } else {
          toast.error('Login failed');
          throw new Error('Login failed');
        }
      })
      .then((result) => {
        console.log(result);

        toast.success('Login successful');
        localStorage.setItem('userId', result.userId);
        navigate('/recipe')
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
              <h2 className="text-center">Login Page</h2>
              <form className="form-inline" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email" style={{ marginTop: '10px' }}>Email:</label>
                  <input
                    type="email"
                    className="form-control form-control-sm mx-sm-2"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password" style={{ marginTop: '10px' }}>Password:</label>
                  <input
                    type="password"
                    className="form-control form-control-sm mx-sm-2"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary mt-2">Login</button>
                </div>
              </form>
              <p className="text-center mt-3">Not a user? <Link to="/">Register</Link></p>

            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
