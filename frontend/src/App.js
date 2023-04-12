import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useParams } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import Navigation from "./components/Navigation";
import SignupFormPage from "./components/SignupFormPage";
import LandingPage from "./components/LandingPage";
import * as sessionActions from "./store/session";
import Groups from "./components/Groups";
import Events from "./components/Events"
import GroupDetail from "./components/GroupDetail"

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
        </Switch>
      )}
    </>
  );
}

export default App;
