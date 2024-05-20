import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function OwnerPage() {
 
  const [highestBid, setHighestBid] = useState('');
  const [Contract, setContract] = useState(undefined);
  const [viewItem, setViewItem] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;


  
  
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);
 
  const viewHighestBid = async () => {
    try {
      if (!contract) {
        console.error("Contract not initialized.");
        return;
      }

      const tx = await contract.getHighestBidDetails(viewItem);
      await tx.wait; // Wait for the transaction to be mined
      console.log(tx.toString());
      setHighestBid(`Highest Bid: ${tx[1]} ETH by ${tx[0]}`);
      const owner = await contract.getItemOwner(viewItem);
      console.log(tx[1]);
      const eth=tx[1].toString();
      const ether = ethers.utils.parseEther(eth);
      await transferToOwner(owner, ether);
      
    } catch (error) {
      console.error("Error viewing highest bid:", error);
    }
  };

  const EndItemAuction = async () => {
    try {
      if (!contract) {
        console.error("Contract not initialized.");
        return;
      }
       const tx1 = await contract.endItem(viewItem);
       alert(`The bidding for item ${viewItem} is now closed`);
    } catch (err) {
      console.error("Error ending auction:", err);
    }
  };
  
  const transferToOwner = async (owner, amount) => {
    try {
      const { ethereum } = window;
      if (!ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      
      await window.ethereum.send("eth_requestAccounts");

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: owner,
        value: amount,
      });

      console.log({ amount, owner });
      console.log("tx", tx);
      console.log(`Transaction sent to ${owner} for ${amount} ETH`);
    } catch (err) {
      console.error("Error transferring ETH to owner:", err);
    }
    EndItemAuction();
  };

  return (
    
     <div className="container">
        <img src="https://media.tenor.com/t3qaafR__EwAAAAM/going-once-going-twice-sold-quark.gif" alt="gif" />
        <input type="text" id="viewItem" value={viewItem} placeholder="Enter the item whose auction you want to stop" onChange={(e) => setViewItem(e.target.value)} /><br />
          <button id="endauctionbutton"onClick={viewHighestBid }>End Auction for this item</button>
    </div>
    
    
  );
}
