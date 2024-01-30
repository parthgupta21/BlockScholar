import { useEvmNativeBalance } from '@moralisweb3/next';
import { useState, useEffect } from "react";
import abi from "../src/contracts/StuDetails.json";
import { ethers } from "ethers";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { useConnect } from 'wagmi';


function HomePage() {
    const { connectAsync } = useConnect();

  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xBbd3D14d9298F236145bB9B1733837b01871B05E";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const { account, chain } = await connectAsync({
            connector: new MetaMaskConnector(),
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  console.log(state);

  //Web3 Wallet Connection code ends here
    const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
    const { data: nativeBalance } = useEvmNativeBalance({ address });
    console.log(nativeBalance);
    
    return (
        <div>
            <h3>Wallet: {address}</h3>
            <h3>Native Balance: {nativeBalance?.balance.ether} ETH</h3>
        </div>
    );
}

export default HomePage;