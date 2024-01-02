import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="Tennis logo" width="120" />
    <h1 className="mb-4">ATP Predictions</h1>

    <p className="lead">
      This website allows tennis fans to make predictions for ATP Tournaments
      and compare their predictions with other users.
    </p>

    <p>
    Predictions can be submitted in the week leading up to the tournament. To submit
    predictions, you need to login to the website. The website is free to use. Please login
    using a Google Account or create an account for the site.
    </p>
  </div>
);

export default Hero;
