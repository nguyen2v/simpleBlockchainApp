// This component consists of buttons used to retrieve/send data to ipfs and blockchain

import { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';

function ContractBtns({ setValue }) {
  // State to store input data to be sent
  const [inputValue, setInputValue] = useState('');

  // Import data for contracts and accounts from Context Api
  const {
    state: { contract, accounts },
  } = useEth();

  // IPFS setup
  const [ipfsHash, setIpfsHash] = useState(); //Store hash to get data from ipfs
  const ipfsHttpClient = require('ipfs-http-client'); // Import ipfs-http-client
  const client = ipfsHttpClient({ url: 'http://127.0.0.1:5001/api/v0' }); // Initialize ipfs with api port

  // Function handler to handle input
  const handleInputChange = (e) => {
    // set input value if it is positive
    if (e.target.value.trim()) {
      setInputValue(e.target.value);
    }
  };

  // Function to retrieve data
  const read = async () => {
    fetch(`http://localhost:8080/ipfs/${ipfsHash}`)
      .then((data) => data.json())
      .then((e) => {
        setValue(e);
      });
    // const value = await contract.methods.read().call({ from: accounts[0] });
    // setValue(value);
  };

  // Function to write data to ipfs
  const write = async (e) => {
    if (inputValue.trim() === '') {
      alert('Please enter a value to write.');
      return;
    }
    const buf = Buffer.from(inputValue, 'utf8');
    const created = await client.add(buf);
    console.log('hash', created[0].path);
    setIpfsHash(created[0].path);
    const newValue = parseInt(inputValue);
    await contract.methods.write(newValue).send({ from: accounts[0] });
    // const newValue = ipfsHash;
    // await contract.methods.write(ipfsHash).send({ from: accounts[0] });
  };

  return (
    <div
      style={{
        marginLeft: '1rem',
        width: '60rem',
        height: '15rem',
        paddingTop: '3rem',
      }}
    >
      <button onClick={read} style={{ width: '10rem', cursor: 'pointer' }}>
        Retrieve data
      </button>

      <div style={{ width: '100%', marginTop: '1rem' }}>
        <button
          onClick={write}
          style={{ width: '10rem', marginRight: '1rem', cursor: 'pointer' }}
        >
          Send new data
        </button>
        <input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
          style={{ width: '15rem' }}
        />
      </div>
    </div>
  );
}

export default ContractBtns;
