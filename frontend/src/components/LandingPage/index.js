import React from "react";
import "./LandingPage.css"
import introImg from "../../assets/online_events.svg"
import joinImg from "../../assets/handsUp.svg"
import findImg from "../../assets/ticket.svg"
import startImg from "../../assets/joinGroup.svg"

export default function LandingPage() {
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
                <h3>
                    See all groups
                </h3>
                <p>
                    Do what you love, meet others who love it, find your community. The rest is history!
                </p>
            </div>
            <div className="find-event">
                <div className="find-img">
                    <img src={findImg}/>
                </div>
                <h3>
                    Find an event
                </h3>
                <p>
                    Events are happening on just about any topic you can think of, 
                    from online gaming and photography to yoga and hiking.
                </p>
            </div>
            <div className="start-group">
                <div className="start-img">
                    <img src={startImg}/>
                </div>
                <h3>
                    Start a group
                </h3>
                <p>
                    You don't have to be an expert to gather people together and explore shared interests.
                </p>
            </div>

            <div className="join">
                <a href="/signup">
                <button>
                    Join getTogether
                </button>
                </a>
            </div>
        </div>
    )
}