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
const { Title } = Typography;

// Function to fetch data
const fetchData = async () => {
  // Simulate a data fetch. Replace with actual data fetching logic.
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ address: "1234 Main St, Springfield, USA", balance: "1000" });
    }, 1000);
  });
  return response;
};

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
  const [data, setData] = useState({ address: "", balance: "" });
  const navigate = useNavigate();
  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      fetchedData.address = <Button type="primary">Connect Wallet</Button>;
      setData(fetchedData);
    };

    getData();
  }, []);
  const [inputValue, setInputValue] = useState("1 tokens");
  const onChange = (newValue) => {
    setInputValue(newValue);
  };
  const navigateToMatch = () => {
    navigate("/match");
  };
  return (
    <div class="main-container">
      <div class="main-inside-container">
        <div class="top-left">
          <Typography.Title style={{ color: "rgb(127, 25, 127)" }} level={5}>
            Address: <span style={{ color: "#d78c09" }}>{data.address}</span>
          </Typography.Title>
          <Typography.Title
            style={{ color: "rgb(127, 25, 127)", textAlign: "left" }}
            level={5}
          >
            Balance: <span style={{ color: "#d78c09" }}>{data.balance}</span>
          </Typography.Title>
        </div>
        <div class="center">
          <Title level={2} style={{ color: "rgb(255, 0, 255)" }}>
            {" "}
            Enigma Duel
          </Title>
        </div>
        <div class="bottom">
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
                min={1}
                max={10}
                onChange={onChange}
                value={typeof inputValue === "number" ? inputValue : 0}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={10}
                style={{
                  margin: "0 16px",
                }}
                value={inputValue}
                onChange={onChange}
              />
            </Col>
          </Row>
          <div class="bottom-buttons">
            <Button
              // style={{ backgroundColor: "rgb(127, 25, 127)" }}
              icon={<ArrowDownOutlined />}
              iconPosition={"start"}
              type="primary"
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

  const [inputValue, setInputValue] = useState("1");
  const onChange = (newValue) => {
    setInputValue(newValue);
  };
  const navigate = useNavigate();

  const navigateToEndMatch = () => {
    navigate("/endmatch");
  };
  return (
    <div class="main-container">
      <div class="info-container">
        <div class="info-item">
          <Typography level={5}>
            Opponent:{" "}
            <span style={{ color: "#a312aa", margin: "0 0 0 10px" }}>
              {gameData.opponent}
            </span>
          </Typography>
        </div>
        <div class="info-item">
          <Typography level={5}>Questions left: </Typography>
          <span style={{ color: "#a312aa", margin: "0 0 0 10px" }}>
            {gameData.questions}
          </span>
        </div>
      </div>
      <div class="question-container">
        <Typography>{question.body}</Typography>
      </div>
      <div class="options-container">
        <div class="options-row">
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
        <div class="options-row">
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
  const [inputValue, setInputValue] = useState("1");
  const onChange = (newValue) => {
    setInputValue(newValue);
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
    <div className="main-container">
      <div style={{ margin: "15% 0 35% 0" }}>
        {" "}
        <Typography.Title level={4}>Results</Typography.Title>
        <div className="table-container">
          <table className="results-table">
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
