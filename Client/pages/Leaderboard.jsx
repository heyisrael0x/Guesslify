import { Navbar, Content, Footer } from "../src/components";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button } from "@web3modal/react";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

const chains = [arbitrum, mainnet, polygon];
const projectId = "1149ae46317fe7bd538d3d996c37b30d";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const Leaderboard = () => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <div className="min-h-screen">
          <div className="w-screen gradient01">
            <Navbar />
            <Web3Button />
            <Footer />
          </div>
        </div>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
};
export default Leaderboard;
