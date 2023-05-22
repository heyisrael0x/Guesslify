import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Link,
} from "react-router-dom";
import router from "./routes";
import "./App.css";
import { Navbar, Content, Footer } from "./components/index";
import { MoralisProvider } from "react-moralis";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  mainnet,
  polygon,
  sepolia,
  goerli,
  hardhat,
} from "wagmi/chains";

const chains = [hardhat];
const projectId = "1149ae46317fe7bd538d3d996c37b30d";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ routes }) {
  return (
    <>
      <MoralisProvider initializeOnMount={false}>
        <WagmiConfig config={wagmiConfig}>
          <RouterProvider router={router} />
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </MoralisProvider>
    </>
  );
}
