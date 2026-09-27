import { wrapFetchWithPaymentFromConfig } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error('Set PRIVATE_KEY to a Base wallet key holding USDC (the facilitator covers gas).');
}

const account = privateKeyToAccount(privateKey as `0x${string}`);

const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: 'eip155:*', client: new ExactEvmScheme(account) }],
});

const item = process.argv[2] ?? 'used playstation 5 console';
const url = `https://reusefulshop.com/api/worth?q=${encodeURIComponent(item)}`;

const response = await fetchWithPayment(url, { method: 'GET' });
console.log('status:', response.status);

const settlement = response.headers.get('PAYMENT-RESPONSE');
if (settlement) console.log('settlement header present');

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
