import { useWeb3Contract, useMoralis } from "react-moralis";
import React, { useState, useEffect, createContext } from "react";
import { ethers, providers } from "../utils/ethers-5.1.esm.min.js";
import { contractAddress, contractAbi } from "../utils/index.js";
import { GameBody } from "../components/index.js";

export const ContractContext = createContext();

const { ethereum } = window;

const getSmartContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  return contract;
};
export const ContractProvider = () => {
  const [balance, setBalance] = useState("0");
  console.log(balance);
  const [currentAccount, setCurrentAccount] = useState("");
  const [withdrawValue, setWithdrawValue] = useState(balance);
  const [fundValue, setFundValue] = useState("0");
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [notification, setNotification] = useState(false);

  const { isWeb3Enabled } = useMoralis();
  console.log(isWeb3Enabled);
  const chainId = parseInt(window.ethereum.chainId);
  const guesslifyAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  const {
    runContractFunction: getGamersWalletBalance,
    data,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: guesslifyAddress,
    functionName: "getGamersWalletBalance",
    params: {},
  });
  const parsedValue = ethers.utils.parseEther("2");
  const { runContractFunction: fundGameWallet } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: guesslifyAddress,
    functionName: "fundGameWallet",
    params: {},
    msgValue: parsedValue,
  });

  const updateUI = async () => {
    console.log("Hi");
    // const txResult = fundGameWallet();
    try {
      await getGamersWalletBalance();
    } catch (error) {}

    console.log(data);

    // setBalance(userBalance.toString());
    // console.log(userBalance);
    // console.log(txResult);
    // console.log("Hi");
  };
  console.log(updateUI);

  useEffect(() => {
    return () => {
      updateUI();
    };
  }, []);

  // const playerBalance = async () => {
  //   const contract = getSmartContract();
  //   const userBalance = await contract.getGamersWalletBalance();
  //   setBalance(userBalance.toString());
  // };
  // const fundPlayersWallet = async () => {
  //   try {
  //     const contract = getSmartContract();
  //     const parsedAmount = ethers.utils.parseEther(fundValue.toString());
  //     const txResponse = await contract.fundGameWallet({
  //       value: parsedAmount,
  //     });
  //     await txResponse.wait();
  //     setColor("green");
  //     setText("Your wallet was funded succesfully");
  //     setNotification(true);
  //     setTimeout;
  //     location.href = location.href;
  //   } catch (error) {
  //     if (error) {
  //       setColor("red");
  //       setText("Failed to fund your wallet");
  //       setNotification(true);
  //     }
  //     // alert("Send Failed Please Try Again");
  //     console.log(error);
  //   }
  // };
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
    // getSmartContract();
    // playerBalance();
    // connectWallet();
  }, []);
  return (
    <ContractContext.Provider
      value={{
        // connectWallet,
        fundValue,
        fundGameWallet,
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
