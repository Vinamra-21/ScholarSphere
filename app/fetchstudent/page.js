'use client';

import React, { useState } from 'react';
import Web3 from 'web3';
import PersonalRecordsABI from '../PersonalRecordsABI.json'; // ABI JSON file
import styles from './fetchstudent.module.css'; // Import the CSS file

const contractAddress = '0x48Ae67E4Db57874AD27CFA1e041484D73C101247'; // Replace with your contract address

function FetchDetailsByBlockHash() {
    const [blockHash, setBlockHash] = useState('');
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchDetails = async () => {
        setError('');
        setDetails(null);
        setLoading(true);
    
        try {
            if (!blockHash) {
                setError('Please enter a block hash.');
                setLoading(false);
                return;
            }
    
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
    
                // Fetch the block from the block hash
                const block = await web3.eth.getBlock(blockHash, true);
                console.log('Fetched Block:', block); // Log the fetched block
                if (!block) {
                    setError('Block not found.');
                    setLoading(false);
                    return;
                }
    
                const transactions = block.transactions;
                if (transactions.length === 0) {
                    setError('No transactions found in the block.');
                    setLoading(false);
                    return;
                }
    
                const contract = new web3.eth.Contract(PersonalRecordsABI, contractAddress);
    
                const detailsPromises = transactions.map(async (transaction) => {
                    try {
                        const receipt = await web3.eth.getTransactionReceipt(transaction);
                        console.log('Transaction Receipt:', receipt); // Log the receipt
                        if (!receipt) {
                            console.error('Receipt not found for transaction:', transaction);
                            return null;
                        }
    
                        const logs = receipt.logs;
                        console.log('Logs:', logs); // Log the logs
    
                        const details = logs.map(log => {
                            try {
                                const decodedLog = web3.eth.abi.decodeLog(
                                    PersonalRecordsABI[0].inputs,
                                    log.data,
                                    log.topics.slice(1)
                                );
                                console.log('Decoded Log:', decodedLog); // Log the decoded log
                                return decodedLog;
                            } catch (err) {
                                console.error('Error decoding log:', err);
                                return null;
                            }
                        });
    
                        return details;
                    } catch (err) {
                        console.error('Error fetching transaction receipt:', err);
                        return null;
                    }
                });
    
                const allDetails = (await Promise.all(detailsPromises)).flat().filter(detail => detail !== null);
                console.log('All Details:', allDetails); // Log all details
                setDetails(allDetails);
            } else {
                setError('Ethereum browser extension not detected.');
            }
        } catch (err) {
            console.error('Error fetching details:', err);
            setError('Failed to fetch details.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className={styles.container}>
            <h1>Fetch Details by Block Hash</h1>
            <input
                className={styles.input}
                type="text"
                value={blockHash}
                onChange={(e) => setBlockHash(e.target.value)}
                placeholder="Enter block hash"
            />
            <button className={styles.button} onClick={fetchDetails} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Details'}
            </button>

            {error && <p className={styles.error}>{error}</p>}

            {details && (
                <div className={styles.details}>
                    <h2>Details</h2>
                    {details.map((detail, index) => (
                        <div key={index}>
                            {/* Display details based on your contract's event data */}
                            <p><strong>Detail {index + 1}:</strong> {JSON.stringify(detail)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FetchDetailsByBlockHash;
