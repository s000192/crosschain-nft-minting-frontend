import PAYMENT_GATEWAY_ABI from "../contracts/PaymentGateway.json";
import type { PaymentGateway } from "../contracts/types";
import useContract from "./useContract";

export default function usePaymentGatewayContract() {
  // TODO: avoid hardcode
  return useContract<PaymentGateway>("0x036141Beac53A83B0A5Bc11eA8d7E81d5c48bCe7", PAYMENT_GATEWAY_ABI);
}
