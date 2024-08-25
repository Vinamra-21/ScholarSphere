// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PersonalRecords {

    struct PersonalDetails {
        string name;
        uint age;
        string aadharNumber;
        string fatherName;
        string motherName;
        string[5] qualification;  // Using string[5]
        string currentPosition;
        string currentAddress;
        string photo;  // URL or IPFS hash of the photo
    }

    struct DegreeDetails {
        string degreeName;
        string issuer;
        string degreeScan;  // URL or IPFS hash of the degree scan image
        string verified; 
    }

    struct IDCardDetails {
        string idCardScan;  // URL or IPFS hash of the ID card scan image
        uint validity; 
        string issuer;
        string verified;
    }

    mapping(address => PersonalDetails) private personalRecords;
    mapping(address => DegreeDetails) private degreeRecords;
    mapping(address => IDCardDetails) private idCardRecords;

    event PersonalDetailsUpdated(
        address indexed user, 
        string name, 
        uint age, 
        string aadharNumber,
        string fatherName, 
        string motherName,
        string[5] qualification,
        string currentPosition,
        string currentAddress,
        string photo
    );
    
    event DegreeDetailsUpdated(
        address indexed user, 
        string degreeName, 
        string issuer, 
        string degreeScan
    );
    
    event IDCardDetailsUpdated(
        address indexed user, 
        string idCardScan, 
        uint validity, 
        string issuer
    );

    function setPersonalDetails(
        string memory _name,
        uint _age,
        string memory _aadharNumber,
        string memory _fatherName,
        string memory _motherName,
        string[5] memory _qualification,  // Correct data type to string[5]
        string memory _currentPosition,
        string memory _currentAddress,
        string memory _photo
    ) public {
        personalRecords[msg.sender] = PersonalDetails(
            _name, 
            _age, 
            _aadharNumber, 
            _fatherName, 
            _motherName, 
            _qualification,
            _currentPosition,
            _currentAddress,
            _photo
        );
        emit PersonalDetailsUpdated(
            msg.sender, 
            _name, 
            _age, 
            _aadharNumber, 
            _fatherName, 
            _motherName, 
            _qualification,
            _currentPosition,
            _currentAddress,
            _photo
        );
    }

    function getPersonalDetails(address _user) public view returns (PersonalDetails memory) {
        return personalRecords[_user];
    }

    function setDegreeDetails(
        string memory _degreeName,
        string memory _issuer,
        string memory _degreeScan,
        string memory _verified
    ) public {
        degreeRecords[msg.sender] = DegreeDetails(
            _degreeName, 
            _issuer, 
            _degreeScan, 
            _verified
        );
        emit DegreeDetailsUpdated(
            msg.sender, 
            _degreeName, 
            _issuer, 
            _degreeScan
        );
    }

    function getDegreeDetails(address _user) public view returns (DegreeDetails memory) {
        return degreeRecords[_user];
    }

    function setIDCardDetails(
        string memory _idCardScan,
        uint _validity,
        string memory _issuer,
        string memory _verified
    ) public {
        idCardRecords[msg.sender] = IDCardDetails(
            _idCardScan, 
            _validity, 
            _issuer, 
            _verified
        );
        emit IDCardDetailsUpdated(
            msg.sender, 
            _idCardScan, 
            _validity, 
            _issuer
        );
    }

    function getIDCardDetails(address _user) public view returns (IDCardDetails memory) {
        return idCardRecords[_user];
    }
}