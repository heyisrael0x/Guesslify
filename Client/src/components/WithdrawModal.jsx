import { RxCross2 } from "react-icons/rx";
// import { WithdrawModal } from ".";
import { useState } from "react";

const WithdrawModal = ({ setWithdrawModal, balance }) => {
  const [value, setValue] = useState(balance);
  console.log(value);
  const handleChange = (e) => {
    setValue(Math.max(Number(e.target.value), ""))
  };
  return (
    <>
      <div
        onClick={() => setWithdrawModal(false)}
        className="w-screen h-screen text-white modal-glassmorphism rounded-none flex items-center justify-center z-10 top-0 left-0 right-0 bottom-0 absolute font-epilogue"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="rounded-xl p-5 eth-card flex flex-col relative"
        >
          <div className="flex  items-center justify-between">
            <label className="text-white">
              Withdraw Proceeds:
            </label>
            <div
              onClick={() => setWithdrawModal(false)}
              className="h-7 w-7 cursor-pointer bg-[#CB0000] rounded-full border-2 border-[#CB0000] flex top-0 right-0 absolute mr-2 mt-2 items-center justify-center"
            >
              <RxCross2 />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <input
              type="number"
              name="fundAmount"
              value={value}
              placeholder="Enter amount"
              className="numInput white-glassmorphism rounded-sm my-2 p-3 outline-none"
              onChange={handleChange}
              min="0"
            />
            <button
              type="button"
              onClick={() => {}}
              className="flex white-glassmorphism justify-center items-center p-3 px-4 mr-2 rounded-lg cursor-pointer"
            >
              <p className="text-white text-base font-meduim">Withdraw</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawModal;
