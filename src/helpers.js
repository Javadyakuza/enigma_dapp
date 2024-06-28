import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { GasPrice } from "@cosmjs/stargate";
import { Buffer } from "buffer";
import process from "process";
import { addresses } from "./constants";
import mockQuestions from "./mock_questions.json";
import axios from "axios";
import qs from "qs";
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
      balance: Number(balance) / 10 ** 9,
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
  if (Number(allowance.allowance) < amount) {
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

async function withdraw(amount) {
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
  // checking if the allowance is less than the amount
  let query_msg = {
    get_user_balance: {
      user: `${account[0].address}`,
    },
  };

  let balance = await signingClient.queryContractSmart(
    addresses.enigma_duel,
    query_msg
  );

  console.log(balance);
  if (Number(balance) < amount) {
    throw Error("insufficient balance");
  } else {
    let increase_balance_msg = {
      update_balance: {
        update_mode: {
          withdraw: {
            user: `${account[0].address}`,
            amount: `${Number(amount) * 10 ** 9}`,
            receiver: `${account[0].address}`,
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
        "decreasing the balance",
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

async function fetch_question() {
  // Get the keys of the questions object
  const questionKeys = Object.keys(mockQuestions);

  // Select a random question key
  const randomKey =
    questionKeys[Math.floor(Math.random() * questionKeys.length)];

  // Get the random question object
  const randomQuestion = mockQuestions[randomKey];

  // Output the random question object
  console.log(randomQuestion);
  let question = {
    body: randomQuestion.body,
    opt1: randomQuestion.opt1,
    opt2: randomQuestion.opt2,
    opt3: randomQuestion.opt3,
    opt4: randomQuestion.opt4,
    correct: randomQuestion.correct,
  };
  // If you need the question with the same structure (e.g., with a key like question_1, question_2)
  return question;
}

async function finish_match(result) {
  const offlineSigner = await window.keplr.getOfflineSignerAuto(
    "constantine-3"
  );
  let accounts = await offlineSigner.getAccounts();

  const urlencoded = new URLSearchParams();
  urlencoded.append("q1", String(result[0]));
  urlencoded.append("q2", String(result[1]));
  urlencoded.append("q3", String(result[2]));
  urlencoded.append("contestant", `${accounts[0].address}`);
  let endpoint = "http://82.115.21.157:8000/api/finish-match";
  let data_fetched = false;
  let data_to_return;
  while (!data_fetched) {
    try {
      let res = await send_request(urlencoded, endpoint);
      if (String(res).includes("Err")) {
        await sleep(3000);
      } else {
        data_fetched = true;
        let raw_res = JSON.parse(String(res));
        data_to_return = raw_res.Ok.split("").map((char) => char === "1");
      }
    } catch (err) {
      await sleep(3000);
    }
  }
  return data_to_return;
}

async function find_match(amount) {
  const offlineSigner = await window.keplr.getOfflineSignerAuto(
    "constantine-3"
  );
  let accounts = await offlineSigner.getAccounts();
  const urlencoded = new URLSearchParams();
  urlencoded.append("user", `${accounts[0].address}`);
  urlencoded.append("entry_amount", `${amount}`);

  let endpoint = "http://82.115.21.157:8000/api/find-match";

  let data_fetched = false;
  let data_to_return;

  while (!data_fetched) {
    try {
      let res = await send_request(urlencoded, endpoint);
      if (String(res).includes("Err")) {
        await sleep(3000);
      } else {
        data_fetched = true;
        data_to_return = JSON.parse(String(res));
      }
    } catch (err) {
      await sleep(3000);
    }
  }
  return data_to_return;
}

async function send_request(urlEncoded, url) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlEncoded,
    redirect: "follow",
  };

  try {
    let response = await fetch(url, requestOptions);
    let result = await response.text();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export {
  connect_wallet,
  deposit,
  withdraw,
  fetch_question,
  getFormattedString,
  sleep,
  find_match,
  finish_match,
};
