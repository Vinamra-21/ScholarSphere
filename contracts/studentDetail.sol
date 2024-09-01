// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PersonalRecords {

    struct PersonalDetails {
        string name;
        uint age;
        string aadharNumber;
        string fatherName;
        string motherName;
        string[5] qualification;
        string currentPosition;
        string currentAddress;
        string photo;
    }

    struct DegreeDetails {
        string degreeName;
        string degreeNumber;
        string issuer;
        string degreeScan;
        string verified;
    }

    struct IDCardDetails {
        string idCardScan;
        string idCardNumber;
        uint validity;
        string issuer;
        string verified;
    }

    mapping(address => bytes32) private userIdMapping;
    mapping(bytes32 => PersonalDetails) private personalRecords;
    mapping(bytes32 => DegreeDetails) private degreeRecords;
    mapping(bytes32 => IDCardDetails) private idCardRecords;

    event PersonalDetailsUpdated(
        bytes32 indexed userId,
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
        bytes32 indexed userId,
        string degreeName, 
        string degreeNumber,
        string issuer, 
        string degreeScan
    );
    
    event IDCardDetailsUpdated(
        bytes32 indexed userId,
        string idCardScan, 
        string idCardNumber,
        uint validity, 
        string issuer
    );

    function getBlockHash() internal view returns (bytes32) {
        return blockhash(block.number - 1);
    }

    function setPersonalDetails(
        string memory _name,
        uint _age,
        string memory _aadharNumber,
        string memory _fatherName,
        string memory _motherName,
        string[5] memory _qualification,
        string memory _currentPosition,
        string memory _currentAddress,
        string memory _photo
    ) public returns (bytes32) {
        bytes32 userId = getBlockHash();
        userIdMapping[msg.sender] = userId;

        personalRecords[userId] = PersonalDetails(
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
            userId,
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

        return userId;
    }

    function getPersonalDetails(bytes32 _userId) public view returns (PersonalDetails memory) {
        return personalRecords[_userId];
    }

    function setDegreeDetails(
        string memory _degreeName,
        string memory _degreeNumber,
        string memory _issuer,
        string memory _degreeScan,
        string memory _verified
    ) public {
        bytes32 userId = userIdMapping[msg.sender];
        require(userId != bytes32(0), "User ID does not exist");

        degreeRecords[userId] = DegreeDetails(
            _degreeName, 
            _degreeNumber,
            _issuer, 
            _degreeScan, 
            _verified
        );
        emit DegreeDetailsUpdated(
            userId,
            _degreeName, 
            _degreeNumber,
            _issuer, 
            _degreeScan
        );
    }

    function getDegreeDetails(bytes32 _userId) public view returns (DegreeDetails memory) {
        return degreeRecords[_userId];
    }

    function setIDCardDetails(
        string memory _idCardScan,
        string memory _idCardNumber,
        uint _validity,
        string memory _issuer,
        string memory _verified
    ) public {
        bytes32 userId = userIdMapping[msg.sender];
        require(userId != bytes32(0), "User ID does not exist");

        idCardRecords[userId] = IDCardDetails(
            _idCardScan, 
            _idCardNumber,
            _validity, 
            _issuer, 
            _verified
        );
        emit IDCardDetailsUpdated(
            userId,
            _idCardScan, 
            _idCardNumber,
            _validity, 
            _issuer
        );
    }

    function getIDCardDetails(bytes32 _userId) public view returns (IDCardDetails memory) {
        return idCardRecords[_userId];
    }

    function getUserId() public view returns (bytes32) {
        return userIdMapping[msg.sender];
    }
}
