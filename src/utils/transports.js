import WebTransport from "@ledgerhq/hw-transport-webusb";

export const createWebUSBTransport = async () => {
  const transport = await WebTransport.create();
  return transport;
};
