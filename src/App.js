import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Make sure to import your CSS file
import {
  SearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Col, InputNumber, Row, Slider, Space } from "antd";
import { connect_wallet, deposit } from "./helpers";
import { Buffer } from "buffer";
import process from "process";
import { ConnectionNotOpenError } from "web3";

const { Title } = Typography;
global.Buffer = Buffer;
global.process = process;
// Function to fetch data

const fetchQuestion = async () => {
  // Simulate a data fetch. Replace with actual data fetching logic.
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ body: "this is some serious question" });
    }, 1000);
  });
  return response;
};

const fetchGameData = async () => {
  // Simulate a data fetch. Replace with actual data fetching logic.
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ opponent: "some serious address", questions: "3" });
    }, 1000);
  });
  return response;
};
const fetchResults = async () => {
  // Simulate a data fetch. Replace with actual data fetching logic.
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user_res: [true, false, true],
        opponent_res: [false, false, true],
        status: "congrats you won 🎉",
      });
    }, 1000);
  });
  return response;
};
const Home = () => {
  const [walletData, setWalletData] = useState({ address: "", balance: "" });
  const [inputTokens, setInputTokens] = useState("1");
  const onChange = (newValue) => {
    setInputTokens(newValue);
  };
  const fetchWalletData = async () => {
    let wd = await connect_wallet();
    setWalletData(wd);
    return wd;
  };
  const handleDeposit = async () => {
    await deposit(inputTokens);
  };
  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchWalletData();
      fetchedData.address = (
        <Button
          type="primary"
          disabled={fetchedData.address == "" ? false : true}
          onClick={connect_wallet}
        >
          {fetchedData.address}
        </Button>
      );
      setWalletData(fetchedData);
    };

    getData();
  }, []);

  const navigate = useNavigate();
  const navigateToMatch = () => {
    navigate("/match");
  };
  return (
    <div className="main-container">
      <div className="main-inside-container">
        <div className="top-left">
          <Typography.Title style={{ color: "rgb(127, 25, 127)" }} level={5}>
            Address:{" "}
            <span style={{ color: "#d78c09" }}>{walletData.address}</span>
          </Typography.Title>
          <Typography.Title
            style={{ color: "rgb(127, 25, 127)", textAlign: "left" }}
            level={5}
          >
            Balance:{" "}
            <span style={{ color: "#d78c09" }}>{walletData.balance}</span>
          </Typography.Title>
        </div>
        <div className="center">
          <Title level={2} style={{ color: "rgb(255, 0, 255)" }}>
            {" "}
            Enigma Duel
          </Title>
        </div>
        <div className="bottom">
          <Button
            style={{ backgroundColor: "rgb(200, 78, 158)" }}
            icon={<SearchOutlined />}
            iconPosition={"start"}
            type="primary"
            onClick={navigateToMatch}
          >
            Find Match
          </Button>
          <Row>
            <Col span={12}>
              <Slider
                min={0}
                max={20}
                onChange={onChange}
                value={typeof inputTokens === "number" ? inputTokens : 0}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0}
                max={20}
                style={{
                  margin: "0 16px",
                }}
                value={inputTokens}
                onChange={onChange}
              />
            </Col>
          </Row>
          <div className="bottom-buttons">
            <Button
              // style={{ backgroundColor: "rgb(127, 25, 127)" }}
              icon={<ArrowDownOutlined />}
              iconPosition={"start"}
              type="primary"
              onClick={handleDeposit}
            >
              Deposit
            </Button>

            <Button
              style={{ backgroundColor: "rgb(60, 3144, 60)" }}
              icon={<ArrowUpOutlined />}
              iconPosition={"start"}
              type="primary"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Match = () => {
  const [question, setQuestion] = useState({
    body: "this is the first question",
    opt1: "yes",
    opt2: "no",
    opt3: "yes-no",
    opt4: "no-yes",
  });
  const [gameData, setGameData] = useState({
    opponent: "some sort of address",
    questions: "3",
  });
  useEffect(() => {
    const getQ = async () => {
      const fetchedData = await fetchGameData();
      setGameData(fetchedData);
    };

    getQ();
  }, []);

  const [inputTokens, setInputTokens] = useState("1");
  const onChange = (newValue) => {
    setInputTokens(newValue);
  };
  const navigate = useNavigate();

  const navigateToEndMatch = () => {
    navigate("/endmatch");
  };
  return (
    <div className="main-container">
      <div className="info-container">
        <div className="info-item">
          <Typography level={5}>
            Opponent:{" "}
            <span style={{ color: "#a312aa", margin: "10px" }}>
              {gameData.opponent}
            </span>
          </Typography>
        </div>
        <div className="info-item">
          <Typography level={5}>Questions left: </Typography>
          <span style={{ color: "#a312aa", margin: "10px" }}>
            {gameData.questions}
          </span>
        </div>
      </div>
      <div className="question-container">
        <Typography>{question.body}</Typography>
      </div>
      <div className="options-container">
        <div className="options-row">
          <Button
            style={{
              backgroundColor: "#a312aa",
              opacity: "70%",
              height: "50%",
              top: "25%",
              width: "45%",
              textAlign: "center",
            }}
            type="primary"
          >
            {question.opt1}
          </Button>
          <Button
            style={{
              backgroundColor: "#a312aa",
              opacity: "70%",
              height: "50%",
              top: "25%",
              width: "45%",
              textAlign: "center",
              justifyContent: "center",
            }}
            type="primary"
            onClick={navigateToEndMatch}
          >
            {question.opt2}
          </Button>
        </div>
        <div className="options-row">
          <Button
            style={{
              backgroundColor: "#a312aa",
              opacity: "70%",
              height: "50%",
              top: "12.5%",
              width: "45%",
              textAlign: "center",
            }}
            size="large"
            type="primary"
          >
            {question.opt3}
          </Button>
          <Button
            style={{
              backgroundColor: "#a312aa",
              opacity: "70%",
              height: "50%",
              top: "12.5%",
              width: "45%",
              textAlign: "center",
            }}
            type="primary"
          >
            {question.opt4}
          </Button>
        </div>
      </div>
    </div>
  );
};

const EndMatch = () => {
  const [results, setResult] = useState({
    user_res: [true, false, true],
    opponent_res: [false, false, true],
    status: "congrats, you won 🎉",
  });
  const [gameData, setGameData] = useState({
    opponent: "some sort of address",
    questions: "3",
  });
  useEffect(() => {
    const getQ = async () => {
      const fetchedData = await fetchResults();
      setResult(fetchedData);
    };

    getQ();
  }, []);
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };
  const [inputTokens, setInputTokens] = useState("1");
  const onChange = (newValue) => {
    setInputTokens(newValue);
  };
  const renderResult = (res) => {
    if (res === true) {
      return <CheckOutlined style={{ color: "green" }} />;
    } else if (res === false) {
      return <CloseOutlined style={{ color: "red" }} />;
    } else {
      return <span>N/A</span>;
    }
  };
  return (
    <div classNameName="main-container">
      <div style={{ margin: "15% 0 35% 0" }}>
        {" "}
        <Typography.Title level={4}>Results</Typography.Title>
        <div classNameName="table-container">
          <table classNameName="results-table">
            <thead>
              <tr>
                <th></th>
                <th>You</th>
                <th>Opponent</th>
              </tr>
            </thead>
            <tbody>
              {results.user_res.map((res, index) => (
                <tr key={index}>
                  <td>Question {index + 1}</td>
                  <td>{renderResult(res)}</td>
                  <td>{renderResult(results.opponent_res[index])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Typography.Title level={5}>{results.status}</Typography.Title>
      <Button
        style={{
          backgroundColor: "#a312aa",
          height: "5%",
          bottom: "5%",
          left: "40%",
          width: "20%",
          textAlign: "center",
          position: "absolute",
        }}
        type="primary"
        icon={<ArrowLeftOutlined />}
        iconPosition={"start"}
        onClick={navigateToHome}
      >
        Home
      </Button>
    </div>
  );
};

export { Home, Match, EndMatch };
