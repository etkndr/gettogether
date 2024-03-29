  import React, { useState, useEffect, useRef } from "react";
  import { NavLink } from "react-router-dom";
  import { useDispatch } from 'react-redux';
  import * as sessionActions from '../../store/session';
  
  
  function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const firstInitial = user.firstName[0].toUpperCase()
  
    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };
  
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };
  
      document.addEventListener('click', closeMenu);
  
      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);
  
    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
    };
  
    let ulClassName
    let dropArrow;
    if (showMenu === false) {
        ulClassName = "dropdown-hidden"
        dropArrow = "fa-solid fa-angle-down"
      } else {
        ulClassName = "dropdown-visible"
        dropArrow = "fa-solid fa-angle-up"
      }


    return (
      <>
        <button onClick={openMenu} className="profile">
          <div className="profile-circle">{firstInitial}</div> <i className={dropArrow}></i>
        </button>
        <ul className={ulClassName} ref={ulRef}>
          <li className="profile-link">Hello, {user.firstName}!</li>
          <li className="profile-link">{user.email}</li>
          <hr></hr>
          <div>
            <li className="profile-link"><NavLink to="/groups" className="profile-link">View groups</NavLink></li>
            <li className="profile-link"><NavLink to="/events" className="profile-link">View events</NavLink></li>
          </div>
          <li>
            <button onClick={logout} className="logout">Log Out</button>
          </li>
        </ul>
      </>
    );
  }
  
  export default ProfileButton;