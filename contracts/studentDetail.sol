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

    mapping(address => string) private userIdMapping;
    mapping(string => PersonalDetails) private personalRecords;
    mapping(string => DegreeDetails) private degreeRecords;
    mapping(string => IDCardDetails) private idCardRecords;

    uint64 private idCounter;

    event PersonalDetailsUpdated(
        string indexed userId,
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
        string indexed userId,
        string degreeName, 
        string degreeNumber,
        string issuer, 
        string degreeScan
    );
    
    event IDCardDetailsUpdated(
        string indexed userId,
        string idCardScan, 
        string idCardNumber,
        uint validity, 
        string issuer
    );

    function generateUniqueId() internal returns (string memory) {
        idCounter++;
        return uintToStr(idCounter);
    }

    function uintToStr(uint64 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0000000000000000";
        }
        uint64 j = _i;
        uint64 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(16);
        for (uint64 k = 0; k < 16 - len; k++) {
            bstr[k] = "0";
        }
        while (_i != 0) {
            bstr[--len + 16 - len] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
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
    ) public returns (string memory) {
        string memory userId = userIdMapping[msg.sender];
        if (bytes(userId).length == 0) {
            userId = generateUniqueId();
            userIdMapping[msg.sender] = userId;
        }

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

    function getPersonalDetails(string memory _userId) public view returns (PersonalDetails memory) {
        return personalRecords[_userId];
    }

    function setDegreeDetails(
        string memory _degreeName,
        string memory _degreeNumber,
        string memory _issuer,
        string memory _degreeScan,
        string memory _verified
    ) public {
        string memory userId = userIdMapping[msg.sender];
        require(bytes(userId).length != 0, "User ID does not exist");

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

    function getDegreeDetails(string memory _userId) public view returns (DegreeDetails memory) {
        return degreeRecords[_userId];
    }

    function setIDCardDetails(
        string memory _idCardScan,
        string memory _idCardNumber,
        uint _validity,
        string memory _issuer,
        string memory _verified
    ) public {
        string memory userId = userIdMapping[msg.sender];
        require(bytes(userId).length != 0, "User ID does not exist");

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

    function getIDCardDetails(string memory _userId) public view returns (IDCardDetails memory) {
        return idCardRecords[_userId];
    }

    function getUserId() public view returns (string memory) {
        return userIdMapping[msg.sender];
    }
}
