import {  } from "react-moralis";
import React, { useState, useEffect, createContext } from "react";
import { ethers, providers } from "../utils/ethers-5.1.esm.min.js";
import { contractAddress, ContractAbi } from "../utils/constants.js";
import { GameBody } from "../components/index.js";

export const ContractContext = createContext();

const { ethereum } = window;

const getSmartContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, ContractAbi, signer);
  return contract;
};
export const ContractProvider = () => {
  const [balance, setBalance] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [withdrawValue, setWithdrawValue] = useState(balance);
  const [fundValue, setFundValue] = useState("");
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [notification, setNotification] = useState(false);
  console.log(notification);
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("No Metamask Wallet Found");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      alert("wallet Connected Successfully🚀.");
    } catch (error) {
      if (error.message.includes("rejected")) {
        alert("You rejected the transaction");
      }
      console.log(error);
    }
  };
  const playerBalance = async () => {
    const contract = getSmartContract();
    const userBalance = await contract.getGamersWalletBalance();
    setBalance(userBalance.toString());
  };
  const fundPlayersWallet = async () => {
    try {
      const contract = getSmartContract();
      const parsedAmount = ethers.utils.parseEther(fundValue.toString());
      const txResponse = await contract.fundGameWallet({
        value: parsedAmount,
      });
      await txResponse.wait();
      setColor("green");
      setText("Your wallet was funded succesfully");
      setNotification(true);
      setTimeout
      location.href = location.href;
    } catch (error) {
      if (error) {
        setColor("red");
        setText("Failed to fund your wallet");
        setNotification(true);
      }
      // alert("Send Failed Please Try Again");
      console.log(error);
    }
  };
  const withdrawPlayersBalance = async () => {
    try {
      const contract = getSmartContract();
      console.log(withdrawValue);
      const parsedAmount = ethers.utils.parseEther(withdrawValue.toString());
      console.log(parsedAmount);
      const txResponse = await contract.withdrawWalletFunds(parsedAmount);
      await txResponse.wait();
      location.href = location.href;
    } catch (error) {
      alert("Withdraw Failed Please Try Again");
      console.log(error);
    }
  };
  useEffect(() => {
    getSmartContract();
    playerBalance();
    // connectWallet();
  }, []);
  return (
    <ContractContext.Provider
      value={{
        connectWallet,
        fundValue,
        fundPlayersWallet,
        balance,
        setFundValue,
        withdrawPlayersBalance,
        withdrawValue,
        setWithdrawValue,
        color,
        text,
        // time,
        notification,
        setNotification,
      }}
    >
      <GameBody />
    </ContractContext.Provider>
  );
};
