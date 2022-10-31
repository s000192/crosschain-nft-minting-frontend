import { Contract, providers } from 'ethers';
import { useMemo } from 'react';
import useSWR from "swr";
import type { Crossmint } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import CROSSMINT_ABI from "../contracts/Crossmint.json";

function getTokenBalance(contract: Crossmint) {
  return async (_: string, address: string) => {
    const balance = await contract.balanceOf(address);

    return balance;
  };
}

export default function useNftBalance(
  address: string,
  tokenAddress: string,
  suspense = false
) {
  const contract = useMemo(() => {
    const provider = new providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");

    if (!CROSSMINT_ABI) {
      return null;
    }

    try {
      return new Contract(tokenAddress, CROSSMINT_ABI, provider);
    } catch (error) {
      console.error("Failed To Get Contract", error);

      return null;
    }
  }, [tokenAddress]) as Crossmint;

  const shouldFetch =
    typeof address === "string" &&
    typeof tokenAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["NftBalance", address, tokenAddress] : null,
    getTokenBalance(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
