// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {MainStructure} from "./Main_Structure.sol";


contract Cashless is MainStructure{
    struct Preauthorization {
        uint256 patientId;
        uint256 billId;
        address insuranceCompanyAddress;
        uint256 policyId;
        PreauthorizationStatus isPreauthorized; 
        uint256 requestTimestamp;
        uint256 approvedTimestamp;
        uint256 preAuthId;
    }
    mapping(uint256 => Preauthorization)  preauthorizations;
    enum PreauthorizationStatus{ PENDING, APPROVED,REJECTED }
    event PreauthorizationRequested(uint256 preauthorizationId, uint256 patientId, uint256 policyId, uint256 isCashless);
    event PreauthorizationApproved(uint256 preauthorizationId);
    event PreauthorizationRejected(uint256 preauthorizationId);

    function requestPreauthorization(
        uint256 _patientId,
        uint256 _billId
    ) public {
        preauthorizationCount++;
        address insuranceCompany= medicalBills[_patientId][_billId].assignedInsuranceCompany;
        uint256 policyId=patientInsurancePolicies[_patientId][insuranceCompany]; 
        preauthorizations[preauthorizationCount] = Preauthorization(
            _patientId,
            _billId,
            insuranceCompany,
            policyId,
            PreauthorizationStatus.PENDING,
            block.timestamp,
            0,
            preauthorizationCount
        );
        emit PreauthorizationRequested(preauthorizationCount, _patientId, policyId, _billId );
    }

    function approvePreauthorization(uint256 _preauthorizationId) 
    public 
    onlyInsuranceCompany(preauthorizations[_preauthorizationId].insuranceCompanyAddress)
    {
        require(preauthorizations[_preauthorizationId].isPreauthorized != PreauthorizationStatus.APPROVED, "Preauthorization already processed");
        preauthorizations[_preauthorizationId].isPreauthorized = PreauthorizationStatus.APPROVED;
        preauthorizations[_preauthorizationId].approvedTimestamp = block.timestamp;
        emit PreauthorizationApproved(_preauthorizationId);
    }

    function rejectPreauthorization(uint256 _preauthorizationId) 
    public 
    onlyInsuranceCompany(preauthorizations[_preauthorizationId].insuranceCompanyAddress)
    {
        require(preauthorizations[_preauthorizationId].isPreauthorized != PreauthorizationStatus.REJECTED, "It is already rejected");
       preauthorizations[_preauthorizationId].isPreauthorized = PreauthorizationStatus.REJECTED;
       emit PreauthorizationRejected(_preauthorizationId);
   }

    modifier cashlessTreatment(uint256 _preauthorizationId) {
        Preauthorization storage preauth = preauthorizations[_preauthorizationId];
        require(preauth.isPreauthorized == PreauthorizationStatus.APPROVED, "Preauthorization not approved");
        
        Policy storage policy = policies[preauth.policyId];
        require(policy.policyType == PolicyType.CASHLESS || policy.policyType == PolicyType.BOTH, "Policy does not cover cashless treatment");
        _;
    }

   
    function calculateCopayment(uint256 _policyId, uint256 _billAmount) internal view returns (uint256) {
        Policy storage policy = policies[_policyId];
        uint256 copayment;
        if (policy.copayment.fixedCharge > 0)
        copayment= policy.copayment.fixedCharge;
        

        if (policy.copayment.percentageCharge > 0) {
            copayment += (_billAmount * policy.copayment.percentageCharge) / 100;
        }

        return copayment;
    }

    function calculateDeductible(uint256 _policyId, uint256 _billAmount) internal view returns (uint256) {
        Policy storage policy = policies[_policyId];
        uint256 deductible = 0;

        if (_billAmount >= policy.deductible.annual) {
            deductible = policy.deductible.annual;
        }    

        deductible += policy.deductible.perInstance;

        return deductible;
    }

    function isNonCoveredExpense(uint256 _policyId, string memory _expenseType) internal view returns (bool) {
        Policy storage policy = policies[_policyId];
        if (keccak256(bytes(_expenseType)) == keccak256(bytes("facelift"))) {
            return policy.noncoveredExpense.facelift;
        } else if (keccak256(bytes(_expenseType)) == keccak256(bytes("hairTransplant"))) {
            return policy.noncoveredExpense.hairTransplant;
        } else if (keccak256(bytes(_expenseType)) == keccak256(bytes("alternativeTherapy"))) {
            return policy.noncoveredExpense.alternativeTherapy;
        }
        return false;
    }

    function checkSublimits(uint256 _policyId, uint256 _roomRentAmount, uint256 _surgeryAmount) internal view returns (bool, uint256) {
        Policy storage policy = policies[_policyId];
        uint256 sublimitOff = 0; 
        
        if (_roomRentAmount > policy.sublimit.roomRentLimit || _surgeryAmount > policy.sublimit.surgeryLimit) 
            return (false,0);
        

        if (_roomRentAmount <= policy.sublimit.roomRentLimit) {
            sublimitOff += policy.sublimit.roomRentLimit - _roomRentAmount;
        }

        if (_surgeryAmount <= policy.sublimit.surgeryLimit) {
            sublimitOff += policy.sublimit.surgeryLimit - _surgeryAmount;
        }

        return (true, sublimitOff); 
    }


    function getPreauthorizationRequestsByInsuranceCompany(address _insuranceCompanyAddress) public view returns (Preauthorization[] memory) {
    uint256 count = 0;
    for (uint256 i = 1; i <= preauthorizationCount; i++) {
        if (preauthorizations[i].insuranceCompanyAddress == _insuranceCompanyAddress) {
            count++;
        }
    }

    Preauthorization[] memory preauthorizationRequests = new Preauthorization[](count);
    uint256 index = 0;
    for (uint256 i = 1; i <= preauthorizationCount; i++) {
        if (preauthorizations[i].insuranceCompanyAddress == _insuranceCompanyAddress) {
            preauthorizationRequests[index] = preauthorizations[i];
            index++;
        }
    }

    return preauthorizationRequests;
}
}