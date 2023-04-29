import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import Navigation from "./components/Navigation";
import SignupFormPage from "./components/SignupFormPage";
import LandingPage from "./components/LandingPage";
import * as sessionActions from "./store/session";
import Groups from "./components/Groups";
import Events from "./components/Events"
import GroupDetail from "./components/GroupDetail"
import EventDetail from "./components/EventDetail";

export function convertTime(dateTime) {
  let date = new Date(dateTime)
  let slicedDate = date.toDateString()
  let slicedTime = date.toTimeString()
  let hrs = slicedTime.slice(0,2)
  let mins = slicedTime.slice(3,5)
  let amPm = hrs >= 12 ? "pm" : "am"
  if (hrs > 12) hrs = hrs % 12
  
  return `${slicedDate} · ${hrs}:${mins} ${amPm}`
}

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    setIsLoaded(true);
  }, [dispatch]);


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage/>
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path={`/group/:id`}>
            <GroupDetail />
          </Route>
          <Route path={`/event/:id`}>
            <EventDetail />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
