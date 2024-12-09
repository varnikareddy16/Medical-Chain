import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import Patient from "layouts/Patient";
import Insurance from "layouts/Insurance";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      <Route path={`/patient/:id`} component={Patient} />
      <Route path="/insurance" component={Insurance} />
      <Route path="/" exact component={Auth} />
      <Redirect from="*" to="/" />
    </Switch>

    
  </BrowserRouter>,
  document.getElementById("root")
);