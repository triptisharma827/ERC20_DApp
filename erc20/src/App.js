import React, { useState, useEffect } from 'react';
import {Web3} from 'web3';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import Img from './erc20.png';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          const contractAddress = "0xED6A860fEBd84EadFcA6837114D44c634C2f99c8";
          const contractABI =  [
            {
              "inputs": [],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "transfer",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
          const contract = new web3.eth.Contract(contractABI, contractAddress);

          setWeb3(web3);
          setAccount(accounts[0]);
          setContract(contract);

          var balance = await contract.methods.balanceOf(accounts[0]).call();
          balance = balance.toString();

          setBalance(balance);

          const name = await contract.methods.name().call();
          setName(name);

          const symbol = await contract.methods.symbol().call();
          setSymbol(symbol);
        }
        else{
          console.error('Web3 not found');
        }

      } catch (error) {
        console.error('Error in initialization:', error);
      }
    };

    init();
  },[]);

  const handleTransfer = async () => {
    if (transferTo && transferAmount) {
      try {
        await contract.methods.transfer(transferTo, transferAmount).send({ from: account
          ,gasPrice: 50000000000
         });
        const balance = await contract.methods.balanceOf(account).call();
        setBalance(balance);
        setStatus('Transfer successful!');
      } catch (error) {
        console.error('Error in transfer:', error);
        setStatus('Transfer failed!');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
        
          <h1 className="text-primary">CyberForge Token DApp</h1>
          <img src={Img} alt="CyberForge Token" width="1000" />
          <p>Account: <strong>{account}</strong></p>
          <p>Balance: <strong>{balance}</strong> </p>
          <p>Name: <strong>{name}</strong></p>
          <p>Symbol: <strong>{symbol}</strong></p>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipient Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter recipient address"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleTransfer}>
              Transfer Tokens
            </Button>
          </Form>

          {status && <Alert className="mt-3" variant={status.includes('successful') ? 'success' : 'danger'}>{status}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
