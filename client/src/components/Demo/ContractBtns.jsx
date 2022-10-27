import { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth';

function ContractBtns({ setValue }) {
  const [ipfsHash, setIpfsHash] = useState();
  const ipfsHttpClient = require('ipfs-http-client');
  const client = ipfsHttpClient({ url: 'http://127.0.0.1:5001/api/v0' });
  console.log(client);
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const read = async () => {
    console.log('Read:', ipfsHash);
    fetch(`http://localhost:8080/ipfs/${ipfsHash}`)
      .then((data) => data.json())
      .then((e) => {
        setValue(e);
      });
    // const value = await contract.methods.read().call({ from: accounts[0] });
    // setValue(value);
  };

  const write = async (e) => {
    if (e.target.tagName === 'INPUT') {
      return;
    }
    if (inputValue === '') {
      alert('Please enter a value to write.');
      return;
    }
    const buf = Buffer.from(inputValue, 'utf8');
    const created = await client.add(buf);
    setIpfsHash(created[0].path);
    const newValue = parseInt(inputValue);
    await contract.methods.write(newValue).send({ from: accounts[0] });
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
