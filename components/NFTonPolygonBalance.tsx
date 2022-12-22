import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from 'react';
// import useTokenBalance from "../hooks/useTokenBalance";
import useTokenContract from '../hooks/useTokenContract';
import { parseBalance } from "../util";
import { constants, utils } from "ethers";
import usePaymentGatewayContract from '../hooks/usePaymentGatewayContract';
import useNftBalance from '../hooks/useNftBalance';
import addresses from "../constants/addresses.json";
import CHAIN_IDS from "../constants/chainIds.json";
import useTokenAllowance from '../hooks/useTokenAllowance';

const NFTonPolygonBalance = () => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data } = useNftBalance(account, addresses.crossmintNft)
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState("");
  const tokenContract = useTokenContract(addresses.mockToken);
  const paymentGatewayContract = usePaymentGatewayContract();
  const tokenAllowance = useTokenAllowance(account, addresses.paymentGateway, addresses.mockToken).data;
  const isAllowanceEnough = useMemo(() =>
    // TODO: avoid hardcode
    tokenAllowance ? tokenAllowance.gte(utils.parseEther("0.1")) : false
    , [tokenAllowance])


  const approveButtonClick = async () => {
    if (account !== undefined || !loading) {
      setLoading(true);

      try {
        const estimatedGasLimit = await tokenContract.estimateGas.approve(
          addresses.paymentGateway,
          constants.MaxUint256
        );
        const gasPrice = await library.getGasPrice();
        let receipt = await tokenContract.approve(
          addresses.paymentGateway,
          constants.MaxUint256, {
          gasPrice,
          gasLimit: estimatedGasLimit.mul(12).div(10),
        });
        setReminder(`Check status: https://goerli.etherscan.io/tx/${receipt.hash}`);

        try {
          let tx = await receipt.wait();
          setReminder(`Successful transaction: https://goerli.etherscan.io/tx/${tx.transactionHash}`)
        } catch (err) {
          setReminder(`Transaction failed: ${err}`)
          console.log(err);
        }
      } catch (err) {
        setReminder(`Transaction failed: ${err}`)
        console.error(err);
      }
      setLoading(false);
    }
  }

  const mintButtonClick = async () => {
    if (account !== undefined || !loading) {
      setLoading(true);

      try {
        const estimatedGasLimit = await paymentGatewayContract.estimateGas.crossmint(
          CHAIN_IDS["mumbai"], {
          value: utils.parseEther("0.0001") // TODO: avoid hardcode
        });
        const gasPrice = await library.getGasPrice();
        let receipt = await paymentGatewayContract.crossmint(CHAIN_IDS["mumbai"], {
          gasPrice,
          gasLimit: estimatedGasLimit.mul(12).div(10),
          value: utils.parseEther("0.0001") // TODO: avoid hardcode
        });
        setReminder(`Check status: https://goerli.etherscan.io/tx/${receipt.hash}`);

        try {
          let tx = await receipt.wait();
          setReminder(`Successful transaction: https://goerli.etherscan.io/tx/${tx.transactionHash}. Please wait for confirmation on Polygon`)
        } catch (err) {
          setReminder(`Transaction failed: ${err}`)
          console.log(err);
        }
      } catch (err) {
        setReminder(`Transaction failed: ${err}`)
        console.error(err);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <p>
        {`NFT on Polygon Balance`}: {data ? data.toString() : 0}
      </p>
      <p>
        Price: 0.1 MOCK
      </p>
      <button
        disabled={loading}
        onClick={isAllowanceEnough ? mintButtonClick : approveButtonClick}
      >
        {loading ? "loading" : isAllowanceEnough ? "mint" : "approve"}
      </button>
      {reminder}
    </>
  );
};

export default NFTonPolygonBalance;