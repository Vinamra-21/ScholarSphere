'use client';

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import styles from './student-form.module.css';
import contractABI from '../PersonalRecordsABI.json'; // Adjust path to your ABI file

const getWeb3AndContract = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const contractAddress = '0xaE036c65C649172b43ef7156b009c6221B596B8b'; // Replace with your contract's address
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
        console.error('Error initializing web3:', error.message);
      }
    };
    init();
  }, []);

  const handleInputChange = (e, stateSetter, state) => {
    const { name, value } = e.target;
    stateSetter({ ...state, [name]: value });
  };

  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...personalDetails.qualification];
    updatedQualifications[index] = value;
    setPersonalDetails({ ...personalDetails, qualification: updatedQualifications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!web3 || !contract) {
        throw new Error('Web3 or contract is not initialized');
      }

      // Send transaction to set personal details
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
          degreeDetails.degreeNumber,
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

      if (receipt.status) {
        // Fetch user ID from the contract
        const userId = await contract.methods.getUserId().call();
        setStudentID(userId); // Set the user ID to state
      } else {
        console.error('Transaction failed');
      }
    } catch (error) {
      console.error('Error sending transaction:', error.message);
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
            {['name', 'age', 'aadharNumber', 'fatherName', 'motherName', 'currentPosition'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className={styles.formLabel}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
                <input
                  type={field === 'age' ? 'number' : 'text'}
                  id={field}
                  name={field}
                  value={personalDetails[field]}
                  onChange={(e) => handleInputChange(e, setPersonalDetails, personalDetails)}
                  required
                  className={styles.formInput}
                />
              </div>
            ))}
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
              <label htmlFor="currentAddress" className={styles.formLabel}>Current Address:</label>
              <textarea
                id="currentAddress"
                name="currentAddress"
                value={personalDetails.currentAddress}
                onChange={(e) => handleInputChange(e, setPersonalDetails, personalDetails)}
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
                onChange={(e) => handleInputChange(e, setPersonalDetails, personalDetails)}
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
            {['degreeName', 'degreeNumber', 'degreeScan', 'issuer', 'verified'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className={styles.formLabel}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
                <input
                  type={field === 'degreeNumber' ? 'number' : 'text'}
                  id={field}
                  name={field}
                  value={degreeDetails[field]}
                  onChange={(e) => handleInputChange(e, setDegreeDetails, degreeDetails)}
                  className={styles.formInput}
                />
              </div>
            ))}
            <div>
              <button type="button" onClick={previousStep} className={styles.formButton}>Previous</button>
              <button type="button" onClick={nextStep} className={styles.formButton}>Next</button>
            </div>
          </>
        )}

        {/* ID Card Details Step */}
        {step === 3 && (
          <>
            <h2>ID Card Details</h2>
            {/* ID Card Details Form Fields */}
            {['idCardNumber', 'idCardScan', 'validity', 'issuer', 'verified'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className={styles.formLabel}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
                <input
                  type={field === 'idCardNumber' ? 'number' : 'text'}
                  id={field}
                  name={field}
                  value={idCardDetails[field]}
                  onChange={(e) => handleInputChange(e, setIdCardDetails, idCardDetails)}
                  className={styles.formInput}
                />
              </div>
            ))}
            <div>
              <button type="button" onClick={previousStep} className={styles.formButton}>Previous</button>
              <button type="submit" className={styles.formButton}>Submit</button>
            </div>
          </>
        )}
      </form>
      {/* Display student ID if available */}
      {studentID && <p>Student ID: {studentID}</p>}
    </div>
  );
}
