'use client';

import React, { useState } from 'react';
import Web3 from 'web3';
import PersonalRecordsABI from '../PersonalRecordsABI.json'; // ABI JSON file
import styles from './fetchstudent.module.css'; // Import the CSS file

const contractAddress = '0xaE036c65C649172b43ef7156b009c6221B596B8b'; // Replace with your contract address

function StudentDetails() {
    const [studentId, setStudentId] = useState('');
    const [personalDetails, setPersonalDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchStudentDetails = async () => {
        setError('');
        setPersonalDetails(null);
        setLoading(true);

        try {
            if (!studentId) {
                setError('Please enter a student ID.');
                setLoading(false);
                return;
            }

            // Create a Web3 provider and contract instance
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(PersonalRecordsABI, contractAddress);

                // Request account access if needed
                const accounts = await web3.eth.requestAccounts();

                // Fetch personal details
                const details = await contract.methods.getPersonalDetails(studentId).call();
                setPersonalDetails(details);
            } else {
                setError('Ethereum browser extension not detected.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch student details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Fetch Student Details</h1>
            <input
                className={styles.input}
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter 16-digit ID"
            />
            <button className={styles.button} onClick={fetchStudentDetails} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Details'}
            </button>

            {error && <p className={styles.error}>{error}</p>}

            {personalDetails && (
                <div className={styles.details}>
                    <h2>Personal Details</h2>
                    <p><strong>Name:</strong> {personalDetails.name}</p>
                    <p><strong>Age:</strong> {personalDetails.age}</p>
                    <p><strong>Aadhar Number:</strong> {personalDetails.aadharNumber}</p>
                    <p><strong>Father's Name:</strong> {personalDetails.fatherName}</p>
                    <p><strong>Mother's Name:</strong> {personalDetails.motherName}</p>
                    <p><strong>Qualifications:</strong> {personalDetails.qualification.join(', ')}</p>
                    <p><strong>Current Position:</strong> {personalDetails.currentPosition}</p>
                    <p><strong>Current Address:</strong> {personalDetails.currentAddress}</p>
                    {personalDetails.photo && (
                        <p><strong>Photo:</strong> <img src={personalDetails.photo} alt="Student Photo" className={styles.photo} /></p>
                    )}
                </div>
            )}
        </div>
    );
}

export default StudentDetails;
