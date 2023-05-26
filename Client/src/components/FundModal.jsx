import { RxCross2 } from "react-icons/rx";
import { useState, useContext } from "react";
import { ContractContext } from "../context/SmartContractInteraction";

const FundModal = ({ setFundModal }) => {
  const { fundGameWallet, setFundValue, fundValue } =
    useContext(ContractContext);

  const handleChange = (e) => {
    setFundValue(Math.max(Number(e.target.value), 0));
    console.log(fundValue);
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Funding")
    await fundGameWallet();
  };
  return (
    <>
      <div
        onClick={() => setFundModal(false)}
        className="w-screen h-screen text-white modal-glassmorphism rounded-none flex items-center justify-center z-10 top-0 left-0 right-0 bottom-0 absolute font-epilogue"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="rounded-xl p-5 eth-card flex flex-col relative"
        >
          <div className="flex  items-center justify-between">
            <label className="text-white">Fund Wallet:</label>
            <div
              onClick={() => setFundModal(false)}
              className="h-7 w-7 cursor-pointer bg-[#CB0000] rounded-full border-2 border-[#CB0000] flex top-0 right-0 absolute mr-2 mt-2 items-center justify-center"
            >
              <RxCross2 />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center"
          >
            <input
              type="number"
              name="fundAmount"
              placeholder="Enter amount"
              value={fundValue}
              className="numInput white-glassmorphism rounded-sm my-2 p-3 outline-none"
              // min="0"
              onChange={handleChange}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex white-glassmorphism justify-center items-center p-3 px-4 mr-2 rounded-lg cursor-pointer"
            >
              <p className="text-white text-base font-meduim">Fund</p>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FundModal;
