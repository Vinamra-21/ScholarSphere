const Web3 = require('web3');

// Define the RPC URL (e.g., for Infura or Alchemy)
const providerUrl = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'; // Replace with your provider's URL

// Create a web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

// Define the private key (for the signer)
const privateKey = 'YOUR_PRIVATE_KEY'; // Replace with your private key

// Create a contract instance
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract's address
const contractABI = [
  // Add your contract's ABI here
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "uint256", "name": "_age", "type": "uint256"},
      {"internalType": "string", "name": "_aadharNumber", "type": "string"},
      {"internalType": "string", "name": "_fatherName", "type": "string"},
      {"internalType": "string", "name": "_motherName", "type": "string"},
      {"internalType": "string[5]", "name": "_qualification", "type": "string[5]"},
      {"internalType": "string", "name": "_currentPosition", "type": "string"},
      {"internalType": "string", "name": "_currentAddress", "type": "string"},
      {"internalType": "string", "name": "_photo", "type": "string"}
    ],
    "name": "setPersonalDetails",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Add other functions as needed
];

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Create a function to interact with the contract
async function example() {
  // Set personal details
  const accounts = await web3.eth.getAccounts();
  const userAccount = accounts[0];
  
  const tx = {
    from: userAccount,
    to: contractAddress,
    gas: 2000000,
    data: contract.methods.setPersonalDetails(
      'John Doe',
      30,
      '1234-5678-9012',
      'Father Name',
      'Mother Name',
      ['B.Sc', 'M.Sc', '', '', ''],
      'Software Engineer',
      '123 Main St, City',
      'photo-url'
    ).encodeABI()
  };

  // Sign and send the transaction
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log('Transaction hash:', receipt.transactionHash);

  // Get personal details
  const userId = await contract.methods.getUserId().call();
  const details = await contract.methods.getPersonalDetails(userId).call();
  console.log('Personal details:', details);
}

example().catch(console.error);