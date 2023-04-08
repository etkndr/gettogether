import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';
import logo from "./logo.png"
import LoginFormPage from '../LoginFormPage';
import { useState } from 'react';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [loginClass, setLoginClass] = useState("login-modal-hidden")
  const [clearData, setClearData] = useState(false)

  function showModal(e) {
    e.preventDefault()
    setLoginClass("login-modal")
    setClearData(false)
  }
  
  function hideModal(e) {
    e.preventDefault()
    setLoginClass("login-modal-hidden")
    setClearData(true);
  }
  
  useEffect(() => {
    if (sessionUser) {
      setLoginClass("login-modal-hidden")
    }

  }, [sessionUser])
    
    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li className='profile-btn'>
        <ProfileButton user={sessionUser} />
      </li>
    );
    } else {
      sessionLinks = (
          <>
          <li className='nav-link'>
          <button onClick={showModal}>Log In</button>
          </li>
          <li className='nav-link'>
          <button>Sign Up</button>
        </li>
        </>
    );
}

  return (
    <>
    <div className='main-nav'>
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
    </>
  );
}

export default Navigation;