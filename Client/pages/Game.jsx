import { Navbar, GameBody, Footer, Notification } from "../src/components";
import { ContractProvider } from "../src/context/SmartContractInteraction";
import { useState, useEffect } from "react";
import { Web3Button } from "@web3modal/react";

const Game = () => {
  // const [notificationState, setNotificationState] = useState(false);
  return (
    <div className="min-h-screen">
      <div className="w-screen gradient01">
        {/* <Notification color="green" text="A Successfull toast🚀." time="7" notificationState={notificationState} /> */}
        <Navbar />
        {/* <Web3Button /> */}
        <ContractProvider />
        <Footer />
      </div>
    </div>
  );
};

export default Game;
