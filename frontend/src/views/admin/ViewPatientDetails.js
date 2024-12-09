import React from "react";

// components

import CardTable from "./components/CardTable";

export default function ViewPatientDetails() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" />
        </div>
      </div>
    </>
  );
}
