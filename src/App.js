import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import "antd/dist/reset.css";
import "./App.css"; // Make sure to import your CSS file
import {
  SearchOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
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

const Home = () => {
  const [data, setData] = useState({ address: "", balance: "" });

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    getData();
  }, []);
  const [inputValue, setInputValue] = useState("1 tokens");
  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <div class="main-container">
      <div class="main-inside-container">
        <div class="top-left">
          <Title style={{ color: "rgb(127, 25, 127)" }} level={5}>
            Address: <span style={{ color: "#d78c09" }}>{data.address}</span>
          </Title>
          <Title style={{ color: "rgb(127, 25, 127)" }} level={5}>
            Balance: <span style={{ color: "#d78c09" }}>{data.balance}</span>
          </Title>
        </div>
        <div class="center">
          <Title level={2} style={{ color: "rgb(127, 25, 127)" }}>
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

export default Home;
