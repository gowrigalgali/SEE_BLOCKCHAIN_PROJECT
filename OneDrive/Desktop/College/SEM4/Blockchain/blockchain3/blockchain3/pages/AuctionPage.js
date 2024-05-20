import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import { ethers } from "ethers";

function AuctionPage() {
    const [itemName, setItemName] = useState('');
    const [owner, setOwner] = useState('');
    const [reservePrice, setReservePrice] = useState('');
    const [_id, setBidId] = useState('');
    const [CandiName, setcandiName] = useState('');
    const [addr, setAddr] = useState('');
    const [Contract, setContract] = useState(undefined);
    const router = useRouter(); // Initialize useRouter hook
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const atmABI = atm_abi.abi;

    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    

    //setContract(contract);
    async function showWalletAddressInput(event) {
        event.preventDefault();
        document.getElementById("addItemForm").style.display = "none";
        document.getElementById("addAddressForm").style.display = "block";
    }

        async function showAddItemForm(event) {
            event.preventDefault();
            document.getElementById("addItemForm").style.display = "block";
            document.getElementById("addAddressForm").style.display = "none";
        }
    
    const addItem = async () => {
        try {
            if (!contract) {
                console.error("Contract not initialized.");
                return;
            }

            await contract.addItem(itemName, owner, reservePrice);
            alert('Item added successfully!');
            router.push(`/OwnerPage`);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const addAddress = async () => {
        try {
            if (!contract) {
                console.error("Contract not initialized.");
                return;
            }

            await contract.addAddress(_id, CandiName, addr);
            alert('Address added successfully!');
            router.push(`/PlaceBid`);
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

   

    return (
        <div className="container">
            <img src="https://media1.tenor.com/m/MvFFZxXwdpwAAAAC/sold-ray.gif" alt="gif" />
            <div className="buttons">
                <button id="enterButton" onClick={showWalletAddressInput}>Enter into the auction</button>
                <button id="addButton" onClick={showAddItemForm}>Add item in auction</button>
                
            </div>
            <div id="addItemForm" style={{ display: 'none' }}>
            <input type="text" id="itemName" value={itemName} placeholder='Enter the Item Name' onChange={(e) => setItemName(e.target.value)} />
            <input type="text" id="owner" value={owner} placeholder='Enter your address' onChange={(e) => setOwner(e.target.value)} />
            <input type="number" id="reservePrice" value={reservePrice} placeholder='Enter the reserve price' onChange={(e) => setReservePrice(e.target.value)} />           
            <button onClick={addItem}>Submit</button>
            </div>
            <div id="addAddressForm" style={{ display: 'none' }}>
            <input type="text" id="_id" value={_id} placeholder='Enter your ID' onChange={(e) => setBidId(e.target.value)} />
            <input type="text" id="CandiName" value={CandiName} placeholder='Enter your name' onChange={(e) => setcandiName(e.target.value)} />
            <input type="text" id="addr" value={addr} placeholder='Enter you wallet address' onChange={(e) => setAddr(e.target.value)} />
                <button onClick={addAddress}>Submit</button>
            </div>
        </div>
    );
}

export default AuctionPage;

