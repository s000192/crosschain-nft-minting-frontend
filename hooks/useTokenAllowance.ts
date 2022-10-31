import useSWR from "swr";
import type { ERC20 } from "../contracts/types";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useTokenContract from "./useTokenContract";

function getTokenAllowance(contract: ERC20) {
  return async (_: string, owner: string, spender: string) => {
    const allowance = await contract.allowance(owner, spender);

    return allowance;
  };
}

export default function useTokenAllowance(
  owner: string,
  spender: string,
  tokenAddress: string,
  suspense = false
) {
  const contract = useTokenContract(tokenAddress);

  const shouldFetch =
    typeof owner === "string" &&
    typeof spender === "string" &&
    typeof tokenAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["TokenAllowance", owner, spender, tokenAddress] : null,
    getTokenAllowance(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
