import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import InsuranceNavbar from "../views/insurance/components/InsuranceNavbar";
import InsuranceSidebar from "../views/insurance/components/InsuranceSidebar";
import HeaderStats from "components/Headers/HeaderStats.js";

// views

import InsuranceDashboard from "views/insurance/InsuranceDashboard";
import CreatePolicy from "views/insurance/CreatePolicy";
import ViewPolicy from "views/insurance/ViewPolicy";
import {PreAuth} from "views/insurance/PreAuth"
export default function Insurance() {
  return (
    <>
      <InsuranceSidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <InsuranceNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/insurance/dashboard" exact component={InsuranceDashboard} />
            <Route path="/insurance/settings" exact component={CreatePolicy} />
            <Route path="/insurance/viewpolicy" exact component={ViewPolicy} />
            <Route path="/insurance/PreAuth" exact component={PreAuth} />
            <Redirect from="/insurance" to="/insurance/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}