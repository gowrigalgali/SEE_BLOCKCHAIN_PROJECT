import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import { ethers } from "ethers";

function PlaceBid() {
    const [highestBid, setHighestBid] = useState('');
    const [bidItem, setBidItem] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [bidderId, setBidderId] = useState('');
    const [viewItem, setViewItem] = useState('');
    
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const atmABI = atm_abi.abi;

    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    const placeBid = async () => {
        try {
            await contract.placeBid(bidAmount, bidItem, bidderId);
            alert('Bid placed successfully!');
        } catch (error) {
            if (error.message.includes("You cannot bid for this price")) {
                alert("Failed to place bid. You cannot bid for this price.");
            } else if (error.message.includes("Item is closed")) {
                alert("Failed to place bid. The item is closed.");
            } else if (error.message.includes("You can't place bid on your own item")) {
                alert("Failed to place bid. You can't place bid on your own item.");
            } else {
                console.error("Error placing bid:", error);
            }
        }

        viewHighestBid();
    };

    const viewHighestBid = async () => {
        try {
            if (!contract) {
              console.error("Contract not initialized.");
              return;
            }
      
            const tx = await contract.getHighestBidDetails(bidItem);
            await tx.wait; // Wait for the transaction to be mined
            console.log(tx.toString());
            setHighestBid(`Highest Bid: ${tx[1]} ETH by ${tx[0]}`);
   
            
          } catch (error) {
            console.error("Error viewing highest bid:", error);
          }
    };

    // useEffect(() => {
    //     viewHighestBid(); // Call viewHighestBid when the component mounts
    // }, []); // Empty dependency array to ensure it runs only once after mounting

    return (
        <div className="container">
            <div className='bid-container'>
                <input type="text" id="bidItem" value={bidItem} placeholder='Enter the Item you want to place bid on' onChange={(e) => setBidItem(e.target.value)} /><br />
                <input type="number" id="bidAmount" value={bidAmount} placeholder='Enter the amount of money you want bid' onChange={(e) => setBidAmount(e.target.value)} /><br />
                <input type="number" id="bidderId" value={bidderId} placeholder='Enter your bidding ID' onChange={(e) => setBidderId(e.target.value)} /><br />
                <button id="placeBidbutton" onClick={placeBid}>Place Bid</button>
            </div>
            <p id="highestBid">{highestBid}</p>
        </div>
    );
}

export default PlaceBid;

