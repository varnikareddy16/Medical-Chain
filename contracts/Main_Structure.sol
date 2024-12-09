// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MainStructure {
    struct Hospital {
        uint256 hospitalId;
        address hospitalAddress;
        string hospitalName;
        string[] doctorList;
    }

    struct InsuranceCompany {
        uint256 insuranceCompanyId;  
        uint256[] networkHospitals;
        string details;
        address insuranceCompanyAddress;

    }
    struct Patient {
        uint256 patientId;
        string name;
        uint256 age;
        string otherDetails;
        address patientAddress;
        uint256 hospitalId;       
        uint256[] billIds;
       
    }

    struct MedicalBill {
        uint256 billId;
        uint256 patientId;
        address assignedInsuranceCompany;
        string details;
        uint256 timestamp;
        uint256 treatmentDate;
        uint256 amount;
    }

    
    struct Policy {
        uint256 policyId;
        string description;
        address insuranceCompany;
        PolicyType policyType;
        uint256 sumAssured;
        Deductible deductible;
        Copayment copayment;
        NoncoveredExpense noncoveredExpense;
        Sublimit sublimit;
    }



    struct Copayment {
        uint256 fixedCharge;
        uint256 percentageCharge;
    }

    struct Deductible {
        uint256 annual;
        uint256 perInstance;
    }

    struct NoncoveredExpense {
        bool facelift;
        bool hairTransplant;
        bool alternativeTherapy;
    }

    struct Sublimit {
        uint256 roomRentLimit;
        uint256 surgeryLimit;
    }


    mapping(uint256 => Hospital)  hospitals;
    mapping(uint256 => InsuranceCompany)  insuranceCompanies;
    mapping(uint256 => Policy)  policies;
    mapping(uint256 => Patient)  patients;
    mapping(uint256 => uint256) public billCounters;
    mapping(uint256 => mapping(uint256 => MedicalBill)) medicalBills;
    mapping(uint256 => mapping(address => uint256))  patientInsurancePolicies;
    
    uint256 public hospitalCount;
    uint256 public insuranceCompanyCount;
    uint256 public policyCount;
    uint256 public patientCount;
    uint256 public preauthorizationCount;

    enum PolicyType{ CASHLESS, REIMBURSEMENT,BOTH }

    event HospitalRegistered(uint256 hospitalId, address hospitalAddress);
    event InsuranceCompanyRegistered(uint256 insuranceCompanyId, uint256[] networkHospitals);
    event PolicyCreated(uint256 policyId, string description);
    event PatientRegistered(uint256 patientId, string name);
    event BillGenerated(uint256 billId, uint256 patientId, uint256 amount);
    event InsuranceCompanyAssigned(uint256 patientId, address insuranceCompany);
    
    modifier onlyHospital(uint256 _hospitalId) {
        require(msg.sender == hospitals[_hospitalId].hospitalAddress, "Only the hospital can perform this action");
        _;
    }

    modifier onlyPatient(uint256 _patientId) {
        require(msg.sender == patients[_patientId].patientAddress, "Only the patient can perform this action");
        _;
    }

    modifier onlyInsuranceCompany(address _insuranceCompanyAddress) {
        require(msg.sender == _insuranceCompanyAddress, "Only the insurance company can perform this action");
        _;
    }

    function registerHospital(string memory _hospitalName, string[] memory _doctorList) public {
        hospitalCount++;
        hospitals[hospitalCount] = Hospital(hospitalCount, msg.sender, _hospitalName, _doctorList);
        emit HospitalRegistered(hospitalCount, msg.sender);
    }

    function registerInsuranceCompany(uint256[] memory _networkHospitals, string memory _details) public {
        insuranceCompanyCount++;
        insuranceCompanies[insuranceCompanyCount] = InsuranceCompany(insuranceCompanyCount, _networkHospitals, _details,msg.sender);
        emit InsuranceCompanyRegistered(insuranceCompanyCount, _networkHospitals);
    }

    function createPolicy(
        string memory _description,
        address _insuranceCompany,
        bool _isPolicyCashless,
        bool _isPolicyReimbursement,
        uint256 _sumAssured,
        Deductible memory _deductible,
        Copayment memory _copayment,
        NoncoveredExpense memory _noncoveredExpense,
        Sublimit memory _sublimit
    ) public onlyInsuranceCompany(_insuranceCompany){
        policyCount++;
        PolicyType policyType;
        if(_isPolicyCashless == false && _isPolicyReimbursement==false){
            revert("Please Select One Type");
        }
        
        if(_isPolicyCashless == true){
            policyType=PolicyType.CASHLESS;
        }else if(_isPolicyReimbursement==true){
            policyType=PolicyType.REIMBURSEMENT;
        }
        else{
            policyType=PolicyType.BOTH;
        }
        policies[policyCount] = Policy(
            policyCount,
            _description,
            _insuranceCompany,
            policyType,
            _sumAssured,
            _deductible,
            _copayment,
            _noncoveredExpense,
            _sublimit
        );
        emit PolicyCreated(policyCount, _description);
    }

    function registerPatient(uint256 _hospitalId, string memory _name, uint256 _age, string memory _otherDetails, address _patientAddress )
    public onlyHospital(_hospitalId){
        patientCount++;
        patients[patientCount] = Patient(patientCount, _name, _age, _otherDetails,_patientAddress,_hospitalId,new uint256[](0));
        emit PatientRegistered(patientCount, _name);
    }

    function assignInsurancePolicy(uint256 _patientId, address _insuranceCompany, uint256 _policyId) 
    public {
        patientInsurancePolicies[_patientId][_insuranceCompany] = _policyId;
    }

    function createMedicalBill(
        uint256 _patientId,
        string memory _details,
        uint256 _amount,
        uint256 _hospitalId
    ) public onlyHospital(_hospitalId) {
        
        uint256 billId = billCounters[_patientId] + 1;
        billCounters[_patientId]++;
        patients[_patientId].billIds.push(billId);
        medicalBills[_patientId][billId] = MedicalBill(
            _patientId,
            billId,
            address(0),     
            _details,
            block.timestamp,
            block.timestamp / 86400,
            _amount
        );
        emit BillGenerated(billId, _patientId, _amount);
    }

    function assignInsuranceCompanyForMedicalBill(uint256 _patientId, uint256 billId, address _insuranceCompany) 
    public onlyPatient(_patientId){
        if (medicalBills[_patientId][billId].assignedInsuranceCompany == address(0)) {
            medicalBills[_patientId][billId].assignedInsuranceCompany = _insuranceCompany;
            emit InsuranceCompanyAssigned(_patientId, _insuranceCompany);
        } else {
            revert("Insurance Company already assigned");
        }
    }



    function getAllMedicalBillByPatientId(uint256 _patientId) public view returns (MedicalBill[] memory)
    {
        require(_patientId > 0 && _patientId <= patientCount, "Invalid patient ID");
        uint256[] memory billIds = patients[_patientId].billIds;
        MedicalBill[] memory medicalRecords = new MedicalBill[](billIds.length);
        for (uint256 i = 0; i < billIds.length; i++) {
            medicalRecords[i] = medicalBills[_patientId][billIds[i]];
        }
        return medicalRecords;
    }

    function getSingleMedicalBill(uint256 _patientId, uint256 _billId) public view returns (MedicalBill memory) {
    require(_patientId > 0 && _patientId <= patientCount, "Invalid patient ID");
    require(_billId > 0 && medicalBills[_patientId][_billId].billId == _billId, "Invalid bill ID");

    return medicalBills[_patientId][_billId];
}

   function getPoliciesByInsuranceCompany(address _insuranceCompanyAddress) public view returns (Policy[] memory) {
    uint256 count = 0;
    for (uint256 i = 1; i <= policyCount; i++) {
        if (policies[i].insuranceCompany == _insuranceCompanyAddress) {
            count++;
        }
    }

    Policy[] memory insuranceCompanyPolicies = new Policy[](count);
    uint256 index = 0;
    for (uint256 i = 1; i <= policyCount; i++) {
        if (policies[i].insuranceCompany == _insuranceCompanyAddress) {
            insuranceCompanyPolicies[index] = policies[i];
            index++;
        }
    }

    return insuranceCompanyPolicies;
    }


    function getAllPatientsByHospital(uint256 _hospitalId) public view returns (Patient[] memory) {
        require(_hospitalId > 0 && _hospitalId <= hospitalCount, "Invalid hospital ID");

        uint256 count = 0;
        for (uint256 i = 1; i <= patientCount; i++) {
            if (patients[i].hospitalId == _hospitalId) {
                count++;
            }
        }

        Patient[] memory patientList = new Patient[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= patientCount; i++) {
            if (patients[i].hospitalId == _hospitalId) {
                patientList[index] = patients[i];
                index++;
            }
        }

        return patientList;
    }
}