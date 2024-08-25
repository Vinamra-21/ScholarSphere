'use client';

import PersonalRecordsABI from '../PersonalRecordsABI.json'; // Import the ABI
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import styles from './header.module.css';
import Link from 'next/link';

const Header = () => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [personalRecordsContract, setPersonalRecordsContract] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const contractAddress = "0x2De2E46c0c7Fdc71709962F670a4540Df2eaeF08"; // Replace with your contract's address

  // Set up Web3 instance and contract
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);

          // Initialize the contract after the account is set
          const contract = new web3Instance.eth.Contract(PersonalRecordsABI, contractAddress);
          setPersonalRecordsContract(contract);
        })
        .catch(err => console.log(err));
    } else {
      console.log('Ethereum wallet is not installed');
    }
  }, []);

  const handleSubmit = async () => {
    if (!personalRecordsContract || !name || !age) {
      alert('Please fill in all fields and ensure the contract is loaded.');
      return;
    }

    try {
      await personalRecordsContract.methods.setPersonalDetails(name, parseInt(age)).send({ from: account });
      alert('Personal details set successfully');
    } catch (error) {
      console.error('Error setting personal details:', error);
      alert('Error setting personal details');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}><Link href="/">ScholarSphere</Link></div>
      <div className={styles.right}>
        {account ? `Connected: ${account}` : 'Connect Wallet'}
      </div>
    </header>
  );
};

export default Header;
