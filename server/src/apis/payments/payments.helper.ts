import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (except real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

// TODO: Implement CoreApi types
// @ts-ignore
export const core = new midtransClient.CoreApi({
  // Set to true if you want Production Environment (except real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});
