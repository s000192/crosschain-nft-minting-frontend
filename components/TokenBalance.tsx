import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useState } from 'react';
import useTokenBalance from "../hooks/useTokenBalance";
import useTokenContract from '../hooks/useTokenContract';
import { parseBalance } from "../util";
import { utils } from "ethers";

type TokenBalanceProps = {
  tokenAddress: string;
  symbol: string;
};

const TokenBalance = ({ tokenAddress, symbol }: TokenBalanceProps) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data } = useTokenBalance(account, tokenAddress);
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState("");
  const tokenContract = useTokenContract(tokenAddress);

  const mintButtonClick = async () => {
    if (account !== undefined || !loading) {
      setLoading(true);

      try {
        const estimatedGasLimit = await tokenContract.estimateGas.mint(
          account,
          utils.parseEther("10000")
        );
        const gasPrice = await library.getGasPrice();
        let receipt = await tokenContract.mint(account, utils.parseEther("10000"), {
          gasPrice,
          gasLimit: estimatedGasLimit.mul(12).div(10),
        });
        setReminder(`Check status: https://goerli.etherscan.io/tx/${receipt.hash}`);

        try {
          let tx = await receipt.wait();
          setReminder(`Successful transaction: https://goerli.etherscan.io/tx/${tx.transactionHash}`)
          console.log(tx);
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
        {`${symbol} Balance`}: {parseBalance(data ?? 0)}
        <button
          disabled={loading}
          onClick={mintButtonClick}
        >
          {loading ? "loading" : "mint"}
        </button>
      </p>
      {reminder}
    </>
  );
};

export default TokenBalance;
