import React, { useState } from "react";
import { createPolicy } from "../../api/web3Functions";

export default function CreatePolicy() {
  const [formData, setFormData] = useState({
    description: "",
    isPolicyCashless: false,
    isPolicyReimbursement: false,
    sumAssured: 0,
    deductible: {
      annual: 0,
      perInstance: 0,
    },
    copayment: {
      fixedCharge: 0,
      percentageCharge: 0,
    },
    noncoveredExpense: {
      facelift: false,
      hairTransplant: false,
      alternativeTherapy: false,
    },
    sublimit: {
      roomRentLimit: 0,
      surgeryLimit: 0,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [parentName, childName] = name.split(".");
      setFormData({
        ...formData,
        [parentName]: {
          ...formData[parentName],
          [childName]: updatedValue,
        },
      });
    } else {
      setFormData({ ...formData, [name]: updatedValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPolicy(
        formData.description,
        // formData.insuranceCompany,
        formData.isPolicyCashless,
        formData.isPolicyReimbursement,
        formData.sumAssured,
        formData.deductible.annual,
        formData.deductible.perInstance,
        formData.copayment.fixedCharge,
        formData.copayment.percentageCharge,
        formData.noncoveredExpense.facelift,
        formData.noncoveredExpense.hairTransplant,
        formData.noncoveredExpense.alternativeTherapy,
        formData.sublimit.roomRentLimit,
        formData.sublimit.surgeryLimit
      );
      console.log("Policy created successfully");
      // Reset form data or perform any additional actions
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">New Policy</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form onSubmit={handleSubmit}>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Policy Details
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Description/Name
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                   sum Assured
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="sumAssured"
                    value={formData.sumAssured}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Is Policy Cashless?
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blueGray-600"
                    name="isPolicyCashless"
                    checked={formData.isPolicyCashless}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Is Policy Reimbursement?
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blueGray-600"
                    name="isPolicyReimbursement"
                    checked={formData.isPolicyReimbursement}
                    onChange={handleInputChange}
                  />
                </div>
              </div>


            </div>



            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Deductible
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Annual Deductible
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="deductible.annual"
                    value={formData.deductible.annual}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Per Instance Deductible
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="deductible.perInstance"
                    value={formData.deductible.perInstance}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>



            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Copayment
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Fixed Charge
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="copayment.fixedCharge"
                    value={formData.copayment.fixedCharge}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Percentage Charge
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="copayment.percentageCharge"
                    value={formData.copayment.percentageCharge}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>



            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Non-covered Expense
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Facelift
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blueGray-600"
                    name="noncoveredExpense.facelift"
                    checked={formData.noncoveredExpense.facelift}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Hair Transplant
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blueGray-600"
                    name="noncoveredExpense.hairTransplant"
                    checked={formData.noncoveredExpense.hairTransplant}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Alternative Therapy
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blueGray-600"
                    name="noncoveredExpense.alternativeTherapy"
                    checked={formData.noncoveredExpense.alternativeTherapy}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>


            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              sublimit
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    room Rent Limit
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="sublimit.roomRentLimit"
                    value={formData.sublimit.roomRentLimit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    surgery Limit
                  </label>
                  <input
                    type="number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="sublimit.surgeryLimit"
                    value={formData.sublimit.surgeryLimit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>


            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              >
                Create Policy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}