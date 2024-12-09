import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import HeaderStats from "components/Headers/HeaderStats.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import AddPatient from "views/admin/AddPatient";
import ViewPatientDetails from "views/admin/ViewPatientDetails";
import DoctorSidebar from "views/admin/components/DoctorSidebar";
import DoctorNavbar from "views/admin/components/DoctorNavbar";
import CreateBill from "views/admin/CreateBill";

export default function Admin() {
  return (
    <>
      <DoctorSidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <DoctorNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/add" exact component={AddPatient} />
            <Route path="/admin/view" exact component={ViewPatientDetails} />
            <Route path="/admin/CreateBill" exact component={CreateBill} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}