import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"
import introImg from "../../assets/online_events.svg"
import joinImg from "../../assets/handsUp.svg"
import findImg from "../../assets/ticket.svg"
import startImg from "../../assets/joinGroup.svg"
import * as sessionActions from "../../store/session"
import { useSelector } from "react-redux";
import { useState } from "react";
import SignupFormPage from "../SignupFormPage";

export default function LandingPage() {

    const sessionUser = useSelector(state => state.session.user)
    const [loginClass, setLoginClass] = useState("login-modal-hidden")
    const [signupClass, setSignupClass] = useState("signup-modal-hidden")
    const [clearData, setClearData] = useState(false)

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

    let startGroupClass
    if (sessionUser) {
        startGroupClass = "landing-link"
    } else {
        startGroupClass = "landing-link-disabled"
    }

    return (
        <div className="main">

            <div className="intro">
                <div className="intro-txt">
                    <h1>
                        The people platform—Where interests become friendships
                    </h1>
                    <p>
                        Whatever your interest, from hiking and reading 
                        to networking and skill sharing, 
                        there are thousands of people who share it on getTogether. 
                        Events are happening every day—log in to join the fun.
                    </p>
                </div>
                <div className="intro-img">
                    <img src={introImg}/>
                </div>
            </div>

            <div className="how-it-works">
                <h2>
                    How getTogether works
                </h2>
                <p>
                    Meet new people who share your interests 
                    through online and in-person events. 
                    It's free to create an account.
                </p>
            </div>

            <div className="join-group">
                <div className="join-img">
                    <img src={joinImg}/>
                </div>
                    <Link to="/groups" className="landing-link">See all groups</Link>
                <p>
                    Do what you love, meet others who love it, find your community. The rest is history!
                </p>
            </div>
            <div className="find-event">
                <div className="find-img">
                    <img src={findImg}/>
                </div>
                <Link to="/events" className="landing-link">Find an event</Link>
                <p>
                    Events are happening on just about any topic you can think of, 
                    from online gaming and photography to yoga and hiking.
                </p>
            </div>
            <div className="start-group">
                <div className="start-img">
                    <img src={startImg}/>
                </div>
                <Link to="/group/new" className={startGroupClass}>Start a group</Link>
                <p>
                    You don't have to be an expert to gather people together and explore shared interests.
                </p>
            </div>

            <div className="join">
                {!sessionUser && 
                <button onClick={showSignupModal}>
                    Join getTogether
                </button>
            }
            </div>
            <div className={signupClass}>
                <div className='signup-modal-content'>
                <button className='close-modal' onClick={hideModal}>X</button>
                <SignupFormPage clearData={clearData} />
                </div>
            </div>
        </div>
    )
}