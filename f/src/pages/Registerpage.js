import React from 'react'
import {
  Form,
  Input,
  Radio,
  Select,
  Button,
  Image,
  Space,
  Col,
  Row,
} from "antd";
import image from "../Assest/img/images.jpg"
import { useState } from "react";
import { generateAvatar } from "../Assest/style/FunctionComm"
import Cookies from "universal-cookie";
import { socketEmitEvent } from '../hooks/query/usesocketEmitEvent';
import { useNavigate } from "react-router-dom";

const Registerpage = () => {
  const cookies = new Cookies();
    const navigate = useNavigate();
    const [form] = Form.useForm();
  
    const [toggle, setToggle] = useState(false);
  
    
  
    const handleSubmit = (e) => {
      const data = {
        firstName: e.FirstName,
        lastName: e.LastName,
        email: e.email,
        password: e.Password,
      }; 
      
      socketEmitEvent("register",data)
    
        // socket.emit("register", data);
      
  
      navigate(`/Login`);
  
      const userData = cookies.get("name") ? cookies.get("name") : [];
      cookies.set("name", JSON.stringify([...userData, e]));
    };
  
    const onReset = () => {
      console.log("padddd");
      form.resetFields();
    };
  
    const onChangeFn = (e) => {
      // console.log("fffrance", e.target.value);
      var store = e.target.value;
      // const abc = e.target.value === "Yes" ? true : false;
      // setToggle(abc);
      // console.log(store, "store");
    };
    const { Option } = Select;
    return (
        <div className="maindiv">
          <div className="main-wraper">
            <div className="heading-h1">
              <h2>CREATE ACCOUNT PROFILE</h2>
            </div>
            <div className="modelD">
              <div className="modelImg">
                {/* <img src={require("")} /> */}
                <img src={image} />
              </div>
              <div className="signuppage">
                <Form form={form} onFinish={handleSubmit}>
                  <Form.Item
                    className=""
                    name="Avater"
                    rules={[
                      {
                        required: true,
                        type: "Avater",
                      },
                    ]}
                  >
                    <Image src={generateAvatar(`you`)} />
                  </Form.Item>
                  <Form.Item
                    className="FirstName"
                    name="FirstName"
                    rules={[{ required: true, message: "First name is required" }]}
                  >
                    <Input
                      placeholder="Enter Your FirstName"
                      onChange={onChangeFn}
                    />
                  </Form.Item>
                  <Form.Item
                    className="LastName"
                    name="LastName"
                    rules={[{ required: true, message: "LastName is required" }]}
                  >
                    <Input
                      placeholder="Enter Your LastName"
                      onChange={onChangeFn}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    className=""
                    name="email"
                    // label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email",
                        type: "email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Your Email" />
                  </Form.Item>
    
                  <Form.Item
                    className="Password"
                    name="Password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                      {
                        pattern:
                          "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$",
                        message: `Not a valid password`,
                      },
                    ]}
                  >
                    <Input.Password
                      autoComplete="false"
                      placeholder="Enter Your Password"
                    />
                  </Form.Item>
                  <p>
                    {" "}
                    Password must be at least 8 characters and include one lowercase
                    letter, one uppercase letter, one number.
                  </p>
    
                  <Form.Item>
                    <Space wrap>
                      <Button type="primary" htmlType="submit" className="submit">
                        Submit
                      </Button>
                      <Button htmlType="button" onClick={onReset} className="reset">
                        Reset
                      </Button>
                      <a href="/Login">Login</a>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Registerpage
