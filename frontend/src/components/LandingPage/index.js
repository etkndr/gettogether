import React from "react";
import "./LandingPage.css"
import introImg from "../../assets/online_events.svg"

export default function LandingPage() {
    return (
        <div className="main">
            <div className="sec-1">
                <div className="intro-txt">
                    <h1>
                        The people platform—Where interests become friendships
                    </h1>
                    <p>
                        Whatever your interest, from hiking and reading 
                        to networking and skill sharing, 
                        there are thousands of people who share it on Meetup. 
                        Events are happening every day—log in to join the fun.
                    </p>
                </div>
                <div className="intro-img">
                    <img src={introImg}/>
                </div>
            </div>
            <div className="sec-2">
                <h1>

                </h1>
            </div>
            <div className="sec-3">
                <h1>

                </h1>
            </div>
            <div className="sec-4">
                <h1>

                </h1>
            </div>
        </div>
    )
}