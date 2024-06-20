import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { GasPrice } from "@cosmjs/stargate";
import { Buffer } from "buffer";
import process from "process";
import { addresses } from "./constants";
global.Buffer = Buffer;
global.process = process;
const getFormattedString = (str) => `${str.slice(0, 10)}...${str.slice(-5)}`;

const connect_wallet = async () => {
  try {
    // Ensure window.keplr is available
    if (!window.keplr) {
      throw new Error("Keplr wallet is not available");
    }
    // await window.keplr.enable("constantine-3");
    // Get offline signer
    const offlineSigner = await window.keplr.getOfflineSignerAuto(
      "constantine-3"
    );

    // Ensure GasPrice is properly created
    const gasPrice = GasPrice.fromString("0.02aconst");
    if (!gasPrice) {
      throw new Error("Failed to initialize gas price");
    }
    // Connect the signing client
    const signingClient = await SigningArchwayClient.connectWithSigner(
      "https://rpc.constantine.archway.io",
      offlineSigner,
      { gasPrice }
    );

    // Fetch account details
    const account = await offlineSigner.getAccounts();
    let query_msg = {
      get_user_balance: {
        user: `${account[0].address}`,
      },
    };
    const balance = await signingClient.queryContractSmart(
      addresses.enigma_duel,
      query_msg
    );

    return {
      address: getFormattedString(account[0].address),
      // balance: balance.amount / 10 ** 18,
      balance: Number(balance),
    };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
};

async function deposit(amount) {
  // Get offline signer
  const offlineSigner = await window.keplr.getOfflineSignerAuto(
    "constantine-3"
  );

  // Ensure GasPrice is properly created
  const gasPrice = GasPrice.fromString("0.02aconst");
  if (!gasPrice) {
    throw new Error("Failed to initialize gas price");
  }
  // Connect the signing client
  const signingClient = await SigningArchwayClient.connectWithSigner(
    "https://rpc.constantine.archway.io",
    offlineSigner,
    { gasPrice }
  );

  // Fetch account details
  const account = await offlineSigner.getAccounts();
  const balance = await signingClient.getBalance(account[0].address, "aconst");
  // checking if the allowance is less than the amount
  let query_msg = {
    allowance: {
      owner: `${account[0].address}`,
      spender: `${addresses.enigma_duel}`,
    },
  };
  let allowance = await signingClient.queryContractSmart(
    addresses.edt,
    query_msg
  );
  console.log(allowance);
  if (Number(allowance.allowance) <= amount) {
    let increase_allowance_msg = {
      increase_allowance: {
        spender: `${addresses.enigma_duel}`,
        amount: `${Number(amount) * 10 ** 9}`,
        expires: null,
      },
    };
    signingClient
      .execute(
        account[0].address,
        addresses.edt,
        increase_allowance_msg,
        "auto",
        "increasing the balance",
        [{ denom: "aconst", amount: "100000000000000000" }]
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    allowance = await signingClient.queryContractSmart(
      addresses.edt,
      query_msg
    );
  } else {
    let increase_balance_msg = {
      update_balance: {
        update_mode: {
          deposit: {
            user: `${addresses.enigma_duel}`,
            amount: `${Number(amount) * 10 ** 9}`,
          },
        },
      },
    };
    signingClient
      .execute(
        account[0].address,
        addresses.enigma_duel,
        increase_balance_msg,
        "auto",
        "increasing the balance",
        [{ denom: "aconst", amount: "100000000000000000" }]
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // increase allowance msg
}

export { connect_wallet, deposit };
