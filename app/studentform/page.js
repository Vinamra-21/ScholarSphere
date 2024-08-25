'use client';

import { useState } from 'react';
import styles from './student-form.module.css';

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
  });

  const [degreeDetails, setDegreeDetails] = useState({
    degreeName: '',
    issuer: '',
    degreeScan: '',
    verified: '',
  });

  const [idCardDetails, setIdCardDetails] = useState({
    idCardScan: '',
    validity: '',
    issuer: '',
    verified: '',
  });

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

    // TODO: Handle form submission logic, e.g., send data to the backend
    console.log('Form submitted:', { personalDetails, degreeDetails, idCardDetails });
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className={styles.formContainer}>
      <h1>Enter Students Details</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
            <button type="button" onClick={nextStep} className={styles.formButton}>Next</button>
          </>
        )}
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
              <label htmlFor="degreeScan" className={styles.formLabel}>Degree Scan (URL):</label>
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
            <button type="button" onClick={previousStep} className={styles.formButton}>Previous</button>
            <button type="button" onClick={nextStep} className={styles.formButton}>Next</button>
          </>
        )}
        {step === 3 && (
          <>
            <h2>ID Card Details</h2>
            {/* ID Card Details Form Fields */}
            <div>
              <label htmlFor="idCardScan" className={styles.formLabel}>ID Card Scan (URL):</label>
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
              <label htmlFor="validity" className={styles.formLabel}>Validity (Year):</label>
              <input
                type="number"
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
            <button type="button" onClick={previousStep} className={styles.formButton}>Previous</button>
            <button type="submit" className={styles.formButton}>Submit</button>
          </>
        )}
      </form>
    </div>
  );
}
