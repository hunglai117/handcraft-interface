import { get } from './api';

const PREFIX_PATH = '/payment/vnpay';

export interface IpnResponse {
  rspCode: string;
  message: string;
}

export interface VnpayReturnResponse {
  result: boolean;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleIpn = (query: Record<string, any>) => get<IpnResponse>(`${PREFIX_PATH}/ipn`, query);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleReturn = (query: Record<string, any>) => get<VnpayReturnResponse>(`${PREFIX_PATH}/return`, query);

const vnpayService = {
  handleIpn,
  handleReturn,
};

export default vnpayService;
