import React, { Fragment, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const inputChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const submitForm = async (e) => {
    console.log("SUCCESS");
  };
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' action='create-profile.html' onSubmit={submitForm}>
        <div className='form-group'>
          <input
            onChange={inputChangeHandler}
            value={email}
            type='email'
            placeholder='Email Address'
            name='email'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            onChange={inputChangeHandler}
            value={password}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
