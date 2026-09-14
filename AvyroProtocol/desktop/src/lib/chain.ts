import { defineChain } from "viem";

export const ROBINHOOD_CHAIN_ID = 4663;

/**
 * Desktop-local Robinhood Chain definition.
 *
 * Keep this chain object inside the desktop package so viem's strongly typed
 * Chain generics always come from the same viem installation as the desktop
 * clients. Importing a Chain object from the SDK can create incompatible type
 * identities when Bun installs the SDK and desktop with separate node_modules.
 */
export const robinhoodChain = defineChain({
  id: ROBINHOOD_CHAIN_ID,
  name: "Robinhood Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.chain.robinhood.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://robinhoodchain.blockscout.com",
    },
  },
  contracts: {
    entryPoint: {
      address: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    },
  },
});
