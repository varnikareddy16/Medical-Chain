import React from "react";

import { Switch, Route, Redirect, useParams } from "react-router-dom";

// components


import HeaderStats from "components/Headers/HeaderStats.js";

// views

import Dashboard from "views/patient/Dashboard.js";
import Settings from "views/patient/Settings.js";

import PatientNavbar from "views/patient/components/PatientNavbar";
import PatientSidebar from "views/patient/components/PatientSidebar";

export default function Patient() {
  const {id} = useParams();
  return (
    <>
      <PatientSidebar id = {id} />
      <div className="relative md:ml-64 bg-blueGray-100">
        <PatientNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/patient/:id/dashboard" exact component={Dashboard} />
            <Route path="/patient/:id/settings" exact component={Settings} />

            <Redirect from="/patient/:id" to="/patient/:id/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );

}
