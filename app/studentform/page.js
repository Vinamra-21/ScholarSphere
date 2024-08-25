'use client';

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import styles from './student-form.module.css';
import contractABI from '../PersonalRecordsABI.json'; // Adjust path to your ABI file

const getWeb3AndContract = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const contractAddress = '0xc95b3467BB972584518473F32DF6682917c85564'; // Replace with your contract's address
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    return { web3, contract };
  } else {
    throw new Error('MetaMask is not installed');
  }
};

export default function StudentForm() {
  const [step, setStep] = useState(1);
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    age: '',
    aadharNumber: '',
    fatherName: '',
    motherName: '',
    qualification: ['', '', '', '', ''],
    currentPosition: '',
    currentAddress: '',
    photo: '', // URL or base64 string for the photo
  });

  const [degreeDetails, setDegreeDetails] = useState({
    degreeName: '',
    degreeNumber: '', // New field
    degreeScan: '', // New field
    issuer: '',     // New field
    verified: ''    // New field
  });

  const [idCardDetails, setIdCardDetails] = useState({
    idCardNumber: '',
    idCardScan: '', // New field
    validity: '',   // New field
    issuer: '',     // New field
    verified: ''    // New field
  });

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [studentID, setStudentID] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const { web3, contract } = await getWeb3AndContract();
        setWeb3(web3);
        setContract(contract);
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error initializing web3:', error);
      }
    };
    init();
  }, []);

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };

  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...personalDetails.qualification];
    updatedQualifications[index] = value;
    setPersonalDetails({
      ...personalDetails,
      qualification: updatedQualifications,
    });
  };

  const handleDegreeDetailsChange = (e) => {
    const { name, value } = e.target;
    setDegreeDetails({
      ...degreeDetails,
      [name]: value,
    });
  };

  const handleIdCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setIdCardDetails({
      ...idCardDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!web3 || !contract) {
        throw new Error('Web3 or contract is not initialized');
      }

      const tx = {
        from: account,
        to: contract.options.address,
        gas: 2000000,
        data: contract.methods.setPersonalDetails(
          personalDetails.name,
          parseInt(personalDetails.age),
          personalDetails.aadharNumber,
          personalDetails.fatherName,
          personalDetails.motherName,
          personalDetails.qualification,
          personalDetails.currentPosition,
          personalDetails.currentAddress,
          personalDetails.photo,
          degreeDetails.degreeName,
          degreeDetails.degreeNumber, // Added field
          degreeDetails.degreeScan,
          degreeDetails.issuer,
          degreeDetails.verified,
          idCardDetails.idCardNumber,
          idCardDetails.idCardScan,
          idCardDetails.validity,
          idCardDetails.issuer,
          idCardDetails.verified
        ).encodeABI()
      };

      const receipt = await web3.eth.sendTransaction(tx);

      // Assuming `setPersonalDetails` emits an event with the user ID
      const userId = await contract.methods.userIdMapping(account).call();
      setStudentID(userId);
      
      console.log('Transaction hash:', receipt.transactionHash);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Personal Details Step */}
        {step === 1 && (
          <>
            <h2>Personal Details</h2>
            {/* Personal Details Form Fields */}
            <div>
              <label htmlFor="name" className={styles.formLabel}>Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={personalDetails.name}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="age" className={styles.formLabel}>Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={personalDetails.age}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="aadharNumber" className={styles.formLabel}>Aadhar Number:</label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={personalDetails.aadharNumber}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="fatherName" className={styles.formLabel}>Father's Name:</label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={personalDetails.fatherName}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="motherName" className={styles.formLabel}>Mother's Name:</label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={personalDetails.motherName}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Qualifications:</label>
              {personalDetails.qualification.map((q, index) => (
                <input
                  key={index}
                  type="text"
                  value={q}
                  onChange={(e) => handleQualificationChange(index, e.target.value)}
                  className={styles.formInput}
                />
              ))}
            </div>
            <div>
              <label htmlFor="currentPosition" className={styles.formLabel}>Current Position:</label>
              <input
                type="text"
                id="currentPosition"
                name="currentPosition"
                value={personalDetails.currentPosition}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="currentAddress" className={styles.formLabel}>Current Address:</label>
              <textarea
                id="currentAddress"
                name="currentAddress"
                value={personalDetails.currentAddress}
                onChange={handlePersonalDetailsChange}
                required
                className={styles.formTextarea}
              />
            </div>
            <div>
              <label htmlFor="photo" className={styles.formLabel}>Photo URL or Base64:</label>
              <input
                type="text"
                id="photo"
                name="photo"
                value={personalDetails.photo}
                onChange={handlePersonalDetailsChange}
                placeholder="Enter photo URL or Base64 string"
                className={styles.formInput}
              />
            </div>
            <div>
              <button type="button" onClick={nextStep} className={styles.formButton}>Next</button>
            </div>
          </>
        )}

        {/* Degree Details Step */}
        {step === 2 && (
          <>
            <h2>Degree Details</h2>
            {/* Degree Details Form Fields */}
            <div>
              <label htmlFor="degreeName" className={styles.formLabel}>Degree Name:</label>
              <input
                type="text"
                id="degreeName"
                name="degreeName"
                value={degreeDetails.degreeName}
                onChange={handleDegreeDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="degreeNumber" className={styles.formLabel}>Degree Number:</label>
              <input
                type="text"
                id="degreeNumber"
                name="degreeNumber"
                value={degreeDetails.degreeNumber}
                onChange={handleDegreeDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="degreeScan" className={styles.formLabel}>Degree Scan URL:</label>
              <input
                type="text"
                id="degreeScan"
                name="degreeScan"
                value={degreeDetails.degreeScan}
                onChange={handleDegreeDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="issuer" className={styles.formLabel}>Issuer:</label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                value={degreeDetails.issuer}
                onChange={handleDegreeDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="verified" className={styles.formLabel}>Verified:</label>
              <input
                type="text"
                id="verified"
                name="verified"
                value={degreeDetails.verified}
                onChange={handleDegreeDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <button type="button" onClick={previousStep} className={styles.formButton}>Back</button>
              <button type="button" onClick={nextStep} className={styles.formButton}>Next</button>
            </div>
          </>
        )}

        {/* ID Card Details Step */}
        {step === 3 && (
          <>
            <h2>ID Card Details</h2>
            {/* ID Card Details Form Fields */}
            <div>
              <label htmlFor="idCardNumber" className={styles.formLabel}>ID Card Number:</label>
              <input
                type="text"
                id="idCardNumber"
                name="idCardNumber"
                value={idCardDetails.idCardNumber}
                onChange={handleIdCardDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="idCardScan" className={styles.formLabel}>ID Card Scan URL:</label>
              <input
                type="text"
                id="idCardScan"
                name="idCardScan"
                value={idCardDetails.idCardScan}
                onChange={handleIdCardDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="validity" className={styles.formLabel}>Validity:</label>
              <input
                type="text"
                id="validity"
                name="validity"
                value={idCardDetails.validity}
                onChange={handleIdCardDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="issuer" className={styles.formLabel}>Issuer:</label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                value={idCardDetails.issuer}
                onChange={handleIdCardDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <label htmlFor="verified" className={styles.formLabel}>Verified:</label>
              <input
                type="text"
                id="verified"
                name="verified"
                value={idCardDetails.verified}
                onChange={handleIdCardDetailsChange}
                required
                className={styles.formInput}
              />
            </div>
            <div>
              <button type="button" onClick={previousStep} className={styles.formButton}>Back</button>
              <button type="submit" className={styles.formButton}>Submit</button>
            </div>
          </>
        )}
      </form>

      {/* Display the Unique Student ID */}
      {studentID && (
        <div className={styles.studentId}>
          <h3>Your Unique Student ID:</h3>
          <p>{studentID}</p>
        </div>
      )}
    </div>
  );
}
