import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';
import logo from "./logo.png"
import LoginFormPage from '../LoginFormPage';
import { useState } from 'react';
import SignupFormPage from '../SignupFormPage';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [loginClass, setLoginClass] = useState("login-modal-hidden")
  const [signupClass, setSignupClass] = useState("signup-modal-hidden")
  const [clearData, setClearData] = useState(false)

  function showLoginModal(e) {
    e.preventDefault()
    setLoginClass("login-modal")
    setClearData(false)
  }

  function showSignupModal(e) {
    e.preventDefault()
    setSignupClass("signup-modal")
    setClearData(false)
  }
  
  function hideModal(e) {
    e.preventDefault()
    setLoginClass("login-modal-hidden")
    setSignupClass("signup-modal-hidden")
    setClearData(true);
  }
  
  useEffect(() => {
    if (sessionUser) {
      setLoginClass("login-modal-hidden")
    }

  }, [sessionUser])
    
    let sessionLinks;
    let navBorder
    if (sessionUser) {
        sessionLinks = (
            <li className='profile-btn'>
        <ProfileButton user={sessionUser} />
      </li>
    );
    
    navBorder = "main-nav"
  } else {
    sessionLinks = (
      <>
          <li className='nav-link'>
          <button onClick={showLoginModal}>Log In</button>
          </li>
          <li className='nav-link'>
          <button onClick={showSignupModal}>Sign Up</button>
        </li>
        </>
    );
    
    navBorder = "main-no-border"
}

  return (
    <>
    <div className={navBorder}>
      <div className='logo'>
          <NavLink exact to="/"><img src={logo} width="120px"/></NavLink>
      </div>
      <div className='links'>
          {isLoaded && sessionLinks}
      </div>
    </div>
    <div className={loginClass}>
      <div className='login-modal-content'>
      <button className='close-modal' onClick={hideModal}>X</button>
      <LoginFormPage clearData={clearData} />
      </div>
    </div>
    <div className={signupClass}>
      <div className='signup-modal-content'>
      <button className='close-modal' onClick={hideModal}>X</button>
      <SignupFormPage clearData={clearData} />
      </div>
    </div>
    </>
  );
}

export default Navigation;