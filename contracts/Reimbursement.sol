// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MainStructure} from "./Main_Structure.sol";

contract Reimbursement is MainStructure{
      struct ReimbursementClaim {
        uint256 claimId;
        uint256 patientId;
        uint256 billId;
        uint256 claimAmount;
        uint256 submittedTimestamp;
        bool isSettled;
        address insuranceCompanyAddress;
    }

    mapping(uint256 => ReimbursementClaim) reimbursementClaims;
    uint256 public reimbursementClaimCount;

    event ReimbursementClaimSubmitted(uint256 claimId, uint256 patientId, uint256 billId, uint256 claimAmount);
    event ReimbursementClaimSettled(uint256 claimId, uint256 patientId, uint256 billId, uint256 claimAmount);

    function submitReimbursementClaim(uint256 _patientId, uint256 _billId, uint256 _claimAmount, address _insuranceCompanyAddress) public onlyPatient(_patientId) {
        require(policies[patientInsurancePolicies[_patientId][medicalBills[_patientId][_billId].assignedInsuranceCompany]].policyType == PolicyType.REIMBURSEMENT 
        || policies[patientInsurancePolicies[_patientId][medicalBills[_patientId][_billId].assignedInsuranceCompany]].policyType == PolicyType.BOTH, "Policy does not cover reimbursement claims");
        require(_claimAmount <= medicalBills[_patientId][_billId].amount, "Claim amount cannot exceed the bill amount");

        reimbursementClaimCount++;
        reimbursementClaims[reimbursementClaimCount] = ReimbursementClaim(
            reimbursementClaimCount,
            _patientId,
            _billId,
            _claimAmount,
            block.timestamp,
            false,
            _insuranceCompanyAddress
        );

        emit ReimbursementClaimSubmitted(reimbursementClaimCount, _patientId, _billId, _claimAmount);
    }

    function settleReimbursementClaim(uint256 _claimId) public onlyInsuranceCompany(reimbursementClaims[_claimId].insuranceCompanyAddress) {
        require(!reimbursementClaims[_claimId].isSettled, "Claim already settled");

        ReimbursementClaim storage claim = reimbursementClaims[_claimId];
        claim.isSettled = true;

        emit ReimbursementClaimSettled(_claimId, claim.patientId, claim.billId, claim.claimAmount);
    }
}