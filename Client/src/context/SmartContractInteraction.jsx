import React, { useState, useEffect } from "react";
import { ethers, providers } from "../utils/ethers-5.1.esm.min.js";
import { contractAddress, ContractAbi } from "../utils/constants.js";

export const ContractContext = React.createContext();

const { ethereum } = window;

const getSmartContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, ContractAbi, signer);
  console.log(provider, signer, contract);
};
export const ContractProvider = ({ children }) => {
  // const [state, setState] = useState("12");
  const someValue = "Hey bro";
  useEffect(() => {
    getSmartContract();
    alert("Hello World!!");
  }, []);
  console.log("hi");
  return (
    <ContractContext.Provider value={{ someValue }}>
      {children}
    </ContractContext.Provider>
  );
};
