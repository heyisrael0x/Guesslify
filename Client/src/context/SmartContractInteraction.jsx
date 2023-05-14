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
  console.log(provider, signer, contract);
};
export const ContractProvider = () => {
  // const [state, setState] = useState("12");
  const someValue = "Hey bro";
  // useEffect(() => {
  //   getSmartContract();
  // }, []);
  return (
    <ContractContext.Provider value={ someValue }>
      <GameBody />
    </ContractContext.Provider>
  );
};
