import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Prediction from "./views/Prediction";
import Leaderboard from "./views/Leaderboard";
import Tournaments from "./views/Tournaments";
import { useAuth0 } from "@auth0/auth0-react";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter basename="/atppredictions">
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path={["/leaderboard"]} component={Leaderboard} />
            <Route path="/tournaments" component={Tournaments} />
            <Route path="/prediction/:tournamentId/:tournamentName/:tournamentStartDate/:tournamentEndDate" component={Prediction} />
          </Switch>
        </Container>
        {/*<Footer />*/}
      </div>
    </BrowserRouter>
  );
};

export default App;
