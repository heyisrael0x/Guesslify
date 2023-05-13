import { FaEthereum } from "react-icons/fa";
import { SiChainlink } from "react-icons/si";
import { GiFrog } from "react-icons/gi";

const ServicesCard = ({ color, title, icon, subtitle }) => (
  <div className="flex flex-row justify-start items-center p-3 w- m-2 cursor-pointer white-glassmorphism hover:shadow-xl">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h1 className="mt-2 text-white text-lg font-epilogue">{title}</h1>
      <p className="mt-2 text-white font-epilogue font-light md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);
const More = () => {
  return (
    <div className="flex flex-col justify-center items-center" id="about">
      <div className="flex md:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-white font-epilogue text-3xl sm:text-5xl py-2 text-center">
            What to know
            <br />
            about the Guesslify game
          </h1>
          <p className="text-white font-epilogue font-extralight text-center max-w-[1000px]">
            Guesslify is a game developed by @gbogo. It is built on the Ethereum
            Blockchain (Currently running on the sepolia testnet), it also uses 
            the chainlink Verifiable Random Function to get random number from the
            blockchain making it extremly hard to predict. But Guesslify was built
            for devlopers or anybody(who cares)* to play a little bit with there guessing 
            skills and there is a prize for winning and as well as the opposite, but everyone 
            get something either they win or loss. when to know more connect your wallet and start
            winning 🚀🚀 
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row justify-start items-center">
        <ServicesCard
          color="bg-[#2952E3]"
          title="Chainlink Protocol"
          icon={<SiChainlink fontSize={21} className="text-white" />}
          //   subtitle="Security is guaranted. We always maintain privacy and maintain the quality of our products."
        />
        <ServicesCard
          color="bg-[#8945F8]"
          title="Ethereum Blockchain"
          icon={<FaEthereum fontSize={21} className="text-white" />}
          //   subtitle="Security is guaranted. We always maintain privacy and maintain the quality of our products."
        />
        <ServicesCard
          color="bg-[#F84550]"
          title="Patrick A Collins"
          icon={<GiFrog fontSize={21} className="text-white" />}
          //   subtitle="Security is guaranted. We always maintain privacy and maintain the quality of our products."
        />
      </div>
    </div>
  );
};

export default More;
