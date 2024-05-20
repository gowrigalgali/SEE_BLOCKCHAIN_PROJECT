import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import { ethers } from "ethers";
import AuctionPage from "./AuctionPage";


function HomePage() {
  const [account, setAccount] = useState(undefined);
  const router = useRouter(); // Initialize useRouter hook
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const connectAccount = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Account connected: ",accounts[0]);

        // Navigate to AuctionPage once account is connected
        router.push(`/AuctionPage`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container">
      <img
        src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png"
        alt="Auction Image"
      />
      <button id="connectButton" onClick={connectAccount}>
        Connect
      </button>
    </div>
  );
}

export default HomePage;

