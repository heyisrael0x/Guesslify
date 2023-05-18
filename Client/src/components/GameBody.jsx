import { ethers } from "../utils/ethers-5.1.esm.min.js";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import React, { useState, useContext, useEffect } from "react";
import { FundModal } from "./";
import { WithdrawModal } from "./";
import { ContractContext } from "../context/SmartContractInteraction";
import { Notification } from "./";

const GameBody = () => {
  const { balance } = useContext(ContractContext);
  const [fundModal, setFundModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const parsedBalance = parseInt(balance) / Math.pow(10, 18);

  const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      step="0.0001"
      // onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-xl p-2 outline-none text-white text-sm white-glassmorphism"
    />
  );
  const handleSubmit = (e) => {
    const { amount } = formData;
    e.preventDefault();
  };
  return (
    <>
      {fundModal && <FundModal setFundModal={setFundModal} />}
      {withdrawModal && (
        <WithdrawModal
          setWithdrawModal={setWithdrawModal}
          balance={parsedBalance}
        />
      )}
      <Notification />
      <div className="w-full flex justify-ceter font-epilogue">
        <div className="flex w-full flex-col md:flex-row items-center justify-between md:p-5 py-12 px-4">
          <div className="flex flex-1 justify-start items-center flex-col">
            <div className="p-3 flex justify-center items-start flex-col rounded-xl h-40 sm:w-72 w-72 my-5 eth-card">
              <div className="flex justify-between items-start flex-row w-full h-full">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                {/* <BsInfoCircle fontSize={17} color="#fff" /> */}
              </div>
              <div className="w-full flex flex-col items-center">
                <div className="mb-3 flex flex-col justify-center items-center">
                  <p className="text-white font-light text-sm -m-1">Balance:</p>
                  <p className="text-white font-semibold text-xl">
                    {Number(parsedBalance) + Number(0.0)}ETH
                  </p>
                </div>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setFundModal(true)}
                    className="flex white-glassmorphism-01 flex-row justify-center items-center p-3 px-4 mr-2 rounded-lg cursor-pointer"
                  >
                    <p className="text-white text-base font-meduim font-epilogue">
                      Fund
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawModal(true)}
                    className="flex flex-row justify-center items-center white-glassmorphism-01 p-3 px-4 rounded-lg cursor-pointer"
                  >
                    <p className="text-white text-base font-meduim font-epilogue">
                      Withdraw
                    </p>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center white-glassmorphism"></div>
          </div>

          <div className="flex flex-col flex-1 items-center justify-start w-full mt-10">
            <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
              <Input
                placeholder="Minimum: 0.001"
                name="amount"
                type="number"
                handleChange=""
              />
              <div className="h-[1px] w-full bg-gray-400 my-2"></div>
              <button
                type="button"
                onClick={handleSubmit}
                className="py-2 px-7 mx-4 rounded-lg cursor-pointer hover:bg-[#ffff] white-glassmorphism hover:text-gray-900 text-white font-semibold"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameBody;
