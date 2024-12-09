// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// pragma optimizer enabled;
pragma experimental ABIEncoderV2;


import {Cashless} from "./Cashless.sol";
import {Reimbursement} from "./Reimbursement.sol";

contract PatientManagementSystem is Cashless, Reimbursement{
    enum PaymentType { CASHLESS, REIMBURSEMENT }

    function calculateFinalAmount(
        uint256 _patientId,
        uint256 _billId,
        uint256 _policyId,
        uint256 _preauthorizationId,
        PaymentType _paymentType
    ) public view returns (uint256) {
        if (_paymentType == PaymentType.CASHLESS) {
            return calculateFinalClaimAmount(_patientId, _billId, _policyId, _preauthorizationId);
        } else if (_paymentType == PaymentType.REIMBURSEMENT) {
            return calculateFinalClaimAmountReimbursement(_patientId, _billId, _policyId);
        }  else {
            revert("Invalid payment type");
        }
    }

    function calculateFinalClaimAmount(uint256 _patientId, uint256 _billId, uint256 _policyId,uint256 _preauthorizationId) 
    public cashlessTreatment(_preauthorizationId) view returns (uint256) {
        MedicalBill storage bill = medicalBills[_patientId][_billId];
        uint256 originalBillAmount = bill.amount;
        uint256 claimableAmount=0;

        uint256 copayment = calculateCopayment(_policyId, originalBillAmount);
        claimableAmount +=  copayment;

        uint256 deductible = calculateDeductible(_policyId, originalBillAmount);
        if (originalBillAmount > deductible) {
            claimableAmount += deductible;
        } else {
            return 0; 
        }

        string[] memory nonCoveredExpenses = new string[](3);
        nonCoveredExpenses[0] = "facelift";
        nonCoveredExpenses[1] = "hairTransplant";
        nonCoveredExpenses[2] = "alternativeTherapy";

        for (uint256 i = 0; i < nonCoveredExpenses.length; i++) {
            if (isNonCoveredExpense(_policyId, nonCoveredExpenses[i])) {
                return 0; 
            }
        }

        (bool sublimitsValid, uint256 sublimitsOff) = checkSublimits(_policyId, 0,0);
        if(sublimitsValid){
            claimableAmount += sublimitsOff; 
        } else {
            return 0;
        }

        if(claimableAmount>20000){
            return 10000;
        }
        else{
            return claimableAmount;
        }

        
    }        

 
    function calculateFinalClaimAmountReimbursement(uint256 _patientId, uint256 _billId, uint256 _policyId) 
    public view returns (uint256) {
        MedicalBill storage bill = medicalBills[_patientId][_billId];
        uint256 originalBillAmount = bill.amount;
        uint256 claimableAmount=0;

        uint256 copayment = calculateCopayment(_policyId, originalBillAmount);
        claimableAmount +=  copayment;

        uint256 deductible = calculateDeductible(_policyId, originalBillAmount);
        if (originalBillAmount > deductible) {
            claimableAmount += deductible;
        } else {
            return 0; 
        }

        string[] memory nonCoveredExpenses = new string[](3);
        nonCoveredExpenses[0] = "facelift";
        nonCoveredExpenses[1] = "hairTransplant";
        nonCoveredExpenses[2] = "alternativeTherapy";

        for (uint256 i = 0; i < nonCoveredExpenses.length; i++) {
            if (isNonCoveredExpense(_policyId, nonCoveredExpenses[i])) {
                return 0; 
            }
        }

        (bool sublimitsValid, uint256 sublimitsOff) = checkSublimits(_policyId, 0,0);
        if(sublimitsValid){
            claimableAmount += sublimitsOff; 
        } else {
            return 0;
        }

        return claimableAmount;
    }

}