import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [itemName, setItemName] = useState('');
  const [owner, setOwner] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [bidItem, setBidItem] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidderId, setBidderId] = useState('');
  const [viewItem, setViewItem] = useState('');
  const [highestBid, setHighestBid] = useState('');
  const [_id, setBidId] = useState('');
  const [CandiName, setcandiName] = useState('');
  const [addr, setAddr] = useState('');
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);

  const contractAddress = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
  const atmABI = atm_abi.abi;

  const connectAccount = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        getATMContract();
        console.log("Account connected: ",accounts[0]);
      } catch (error) {
        console.log(error);
      }
    }
  }
  
  const getATMContract = () => {
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setContract(contract);
  }

  const addItem = async () => {
    try {
      if (!contract) {
        console.error("Contract not initialized.");
        return;
      }

      await contract.addItem(itemName, owner, reservePrice);
      alert('Item added successfully!');
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
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };
  
  const placeBid = async () => {
     try{
      await contract.placeBid(bidAmount, bidItem, bidderId);
      alert('Bid placed successfully!');}
      catch(error){
        if (error.message.includes("You cannot bid for this price")) {
          alert("Failed to place bid. You cannot bid for this price.");
      } else if (error.message.includes("Item is closed")) {
          alert("Failed to place bid. The item is closed.");
      } else if (error.message.includes("You can't place bid on your own item")) {
        alert("Failed to place bid. You can't place bid on your own item.");}
      else {
          console.error("Error placing bid:", error);
      }
      }
    
  };

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

  useEffect(() => {
    connectAccount();
  }, []);

  return (
    <div className="App">
      <h1>Auction Contract Interface</h1>
      <div className="container">
        <button id="connectButton" onClick={connectAccount}>
          Connect
        </button>
      </div>
      <div>
        <h2>Add Item</h2>
        <label htmlFor="itemName">Item Name:</label>
        <input type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} /><br />
        <label htmlFor="owner">Owner:</label>
        <input type="text" id="owner" value={owner} onChange={(e) => setOwner(e.target.value)} /><br />
        <label htmlFor="reservePrice">Reserve Price:</label>
        <input type="number" id="reservePrice" value={reservePrice} onChange={(e) => setReservePrice(e.target.value)} /><br />
        <button onClick={addItem}>Add Item</button>
      </div>
      <hr />
      <div>
        <h2>Place Bid</h2>
        <label htmlFor="bidItem">Item Name:</label>
        <input type="text" id="bidItem" value={bidItem} onChange={(e) => setBidItem(e.target.value)} /><br />
        <label htmlFor="bidAmount">Bid Amount:</label>
        <input type="number" id="bidAmount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} /><br />
        <label htmlFor="bidderId">Bidder ID:</label>
        <input type="number" id="bidderId" value={bidderId} onChange={(e) => setBidderId(e.target.value)} /><br />
        <button onClick={placeBid}>Place Bid</button>
      </div>
      <hr/>
      <div>
        <h2>Add Address</h2>
        <label htmlFor="_id">Candidate ID:</label>
        <input type="text" id="_id" value={_id} onChange={(e) => setBidId(e.target.value)} /><br />
        <label htmlFor="CandiName">Candidate Name:</label>
        <input type="text" id="CandiName" value={CandiName} onChange={(e) => setcandiName(e.target.value)} /><br />
        <label htmlFor="addr">Candidate Address:</label>
        <input type="text" id="addr" value={addr} onChange={(e) => setAddr(e.target.value)} /><br />
        <button onClick={addAddress}>Add Address</button>
      </div>
      <hr />
      <div>
        <h2>View Highest Bid</h2>
        <label htmlFor="viewItem">Item Name:</label>
        <input type="text" id="viewItem" value={viewItem} onChange={(e) => setViewItem(e.target.value)} /><br />
        <button onClick={viewHighestBid}>View Highest Bid</button>
        <p id="highestBid">{highestBid}</p>
      </div>
    </div>
  );
}
