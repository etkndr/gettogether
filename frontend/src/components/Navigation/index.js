import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';
import logo from "./logo.png"

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  
  
  const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
    };
    
    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
        <ProfileButton user={sessionUser} />
        {/* <button onClick={logout}>Log Out (MAIN)</button> */}
      </li>
    );
} else {
    sessionLinks = (
        <>
        <li className='nav-link'>
        <NavLink to="/login">Log In</NavLink>
        </li>
        <li className='nav-link'>
        <NavLink to="/signup">Sign Up</NavLink>
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
    </>
  );
}

export default Navigation;