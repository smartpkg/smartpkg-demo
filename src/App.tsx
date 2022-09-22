import { useCallback, useEffect } from "react";
import smartpkg from "smartpkg";
import { ethers } from "ethers";

const chainId = 1;
// UNI token smart contract
const address = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

export default function App() {
  const getContract = useCallback(async (abi: any, address: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    return contract;
  }, []);

  // EXAMPLE 1: SmartPkg
  const runContractFn = useCallback(async () => {
    const abi = await smartpkg.getAbi(chainId, address);

    // Use Contract ABI
    const contract = await getContract(abi, address);
    
    // Actual Contract fn call
    const symbol = await contract.symbol();
    console.log('[EXAMPLE 1] Run with SmartPkg:', symbol);
  }, []);

  // Example 2: Moralis with SmartPkg
  const runContractFnMoralis = useCallback(async () => {
    const abi = await smartpkg.getAbi(chainId, address);
    
    // Actual Contract fn call
    const API_KEY = '<replace-with-your-api-key>';
    const url = `https://deep-index.moralis.io/api/v2/${address}/function?chain=eth&function_name=symbol`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        abi, // abi required
        params: {}
      })
    });
    const data = await res.json();

    console.log('[EXAMPLE 2] Run with Moralis:', data);
  }, []);

  // Example 3: Manually
  const runContractWithoutSmartpkg = useCallback(async () => {
    // Download abi & add to source code: https://etherscan.io/address/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984#code
    const { default: abi } = await import('./contract_abi.json');

    // Use Contract ABI
    const contract = await getContract(abi, address);
    
    // Actual Contract fn call
    const symbol = await contract.symbol();
    console.log('[EXAMPLE 3] Run without SmartPkg:', symbol);
  }, []);


  useEffect(() => {
    runContractFnMoralis();
  }, [runContractFnMoralis]);

  useEffect(() => {
    runContractWithoutSmartpkg();
  }, [runContractWithoutSmartpkg]);

  useEffect(() => {
    runContractFn();
  }, [runContractFn]);

  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}
