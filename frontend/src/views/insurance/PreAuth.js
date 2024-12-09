import React, { useState, useEffect } from 'react';
import {
  getPreauthorizationRequestsByInsuranceCompany,createPolicy,
  registerHospital, registerInsuranceCompany, registerPatient, createMedicalBillOnChain, calculateFinalAmount, approvePreauthorization, rejectPreauthorization, requestPreauthorization, assignInsurancePolicy, assignInsuranceCompanyForMedicalBill
} from 'api/web3Functions';

export const PreAuth = () => {
  const [preauthorizations, setPreauthorizations] = useState([]);
  const [finalAmounts, setFinalAmounts] = useState({});
  console.log(finalAmounts);

  useEffect(() => {
    const fetchPreauthorizations = async () => {
      try {
         // remove
        // account 1
        // await registerHospital("max",["hemant"])
        // await registerInsuranceCompany ( "1","acko insurance")

        // await createPolicy("policyone",true,false,"20000","100","10","100","10",false,false,false,"100","10")
        // await registerPatient ("1","dhaval patient","25","fever","0x1c1A4bF8A807d90d30B0d979a4D7A7260Fe96998")
        // await createMedicalBillOnChain ("1","bill for cancer","15000","1")

        // by patient
        // await assignInsurancePolicy(1,"0x6af5c5113C004FB8D474939CB9D66C4c0CC5750f",1);

        // await assignInsuranceCompanyForMedicalBill(1,1,"0x6af5c5113C004FB8D474939CB9D66C4c0CC5750f");
        // await requestPreauthorization(1,1);

       

        const requests = await getPreauthorizationRequestsByInsuranceCompany();
        setPreauthorizations(requests);


        const finalAmountsArray = await calculateFinalAmount(
          1             //any number
        );
        const finalAmountsMap = {};
        finalAmountsArray.forEach(item => {
          finalAmountsMap[item.requestTimestamp] = item.finalAmount;
        });
        setFinalAmounts(finalAmountsMap);
        console.log(finalAmountsMap)
      } catch (error) {
        console.error('Error fetching preauthorizations:', error);
      }
    };

    fetchPreauthorizations();
  }, []);

  const handleApprove = async (preauthorizationId) => {
    try {
      console.log("hello",preauthorizationId)
      await approvePreauthorization(preauthorizationId);
      const requests = await getPreauthorizationRequestsByInsuranceCompany();
      setPreauthorizations(requests);
      
    } catch (error) {
      console.error('Error approving preauthorization:', error);
    }
  };

  const handleReject = async (preauthorizationId) => {
    try {
      await rejectPreauthorization(preauthorizationId);
      const requests = await getPreauthorizationRequestsByInsuranceCompany();
      setPreauthorizations(requests);
    } catch (error) {
      console.error('Error rejecting preauthorization:', error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-lg text-blueGray-700">
                Preauthorization Requests
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Patient ID
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Bill ID
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Policy ID
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Request Timestamp
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Status
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Claim Amount
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {preauthorizations.map((preauthorization) => (
                <tr key={preauthorization.requestTimestamp}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {Number(preauthorization[0])}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {Number(preauthorization[1])}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {Number(preauthorization[3])}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {new Date(Number(preauthorization[5]) * 1000).toLocaleString()}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {Number(preauthorization.isPreauthorized) === 0
                      ? 'Pending'
                      : Number(preauthorization.isPreauthorized) === 1
                        ? 'Approved'
                        : Number(preauthorization.isPreauthorized) === 2
                          ? 'Rejected'
                          : "Invalid"}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {finalAmounts[preauthorization.requestTimestamp]
                        ? `₹${finalAmounts[preauthorization.requestTimestamp].toString()}`
                        : 'N/A'}
                    </td>

                  </td>
                  
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {Number(preauthorization.isPreauthorized) === 0 ? (
                      <>
                        <button
                          onClick={() => handleApprove(preauthorization.preAuthId)}
                          className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(preauthorization.preAuthId)}
                          className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
