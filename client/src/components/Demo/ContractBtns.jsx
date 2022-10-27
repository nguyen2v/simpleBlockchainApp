// This component consists of buttons used to retrieve/send data to ipfs and blockchain

import { useState, useEffect } from 'react';
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
    //http://localhost:8080/ipfs/${ipfsHash}
    // fetch(`http://localhost:8080/ipfs/${ipfsHash}`)
    //   .then((data) => data.json())
    //   .then((e) => {
    //     // setValue(e);
    //     console.log('error', e);
    //   });
    // const value = await contract.methods.read().call({ from: accounts[0] });
    // setValue(value);
    if (!ipfsHash) return;
    let res = await fetch(`http://localhost:8080/ipfs/${ipfsHash}`);
    console.log('response api: ', res);
  };

  // Function to write data to ipfs
  const write = async (e) => {
    if (inputValue.trim() === '') {
      alert('Please enter a value to write.');
      return;
    }
    const buf = Buffer.from(inputValue, 'utf8');
    const created = await client.add(buf);
    const hash = created[0].path;
    //setIpfsHash(hash);
    //console.log('hash type', typeof hash);
    // const newValue = parseInt(inputValue);
    // await contract.methods.write(newValue).send({ from: accounts[0] });
    // write ipfs hash to blockchain
    await contract.methods.write(hash).send({ from: accounts[0] });
  };

  const getIpfsHash = async () => {
    const hash = await contract.methods.read().call({ from: accounts[0] });
    setIpfsHash(hash);
  };

  useEffect(() => {
    getIpfsHash();
  }, []);

  useEffect(() => {
    console.log('initial hash: ', ipfsHash);
    console.log('initial hash type: ', typeof ipfsHash);
    read();
  }, [ipfsHash]);

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
