import React, { useEffect } from "react";
import { Form, Input, Button, Modal, message, Space } from "antd";
import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from  "react-router-dom"
import images from"../Assest/img/images.jpg";
import { socketEmitEvent } from "../hooks/query/usesocketEmitEvent";


const Login = () => {
    const cookies = new Cookies();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [modal2Open, setModal2Open] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
  
    // useEffect(() => {
    //   socket.on('login', (loginData) => {
    //     console.log('loginData------------', loginData);
    //     console.log("#####");
    //     if (!loginData.data) {
    //       window.alert(loginData.message);
    //     }                                                                                                     
    //     else {
    //       alert(loginData.message);
    //       // cookies.set('userId', loginData.data._id)
    //       // localStorage.setItem('userId', loginData.data._id);
    //     // console.log("logindata",loginData)
    //     }
    //   });
    // }, [])
  
    const info = () => {};
    const userData = cookies.get("name") ? cookies.get("name") : [];
  
    console.log("userData", userData)
    const handleSubmit = (e) => {
      const data = {
          
          email: e.email,
          password: e.Password,
        };
        socketEmitEvent("login",data)
        // if (data) {
        //   console.log("data",data)
        // //   socket.emit("login", data);
        //   cookies.set("abc",data)
        //   navigate(`/Mainpage`)
        // }
    
     
     
    };
  
    const onReset = () => {
      console.log("padddd");
      form.resetFields();
    };
    console.log("hello===============")
    return (
      <div className="maindiv1">
        <div className="modelD1">
        <div className="main-wraper1">
        <div className="heading-h1">
            <h2>SIGN IN WITH EMAIL</h2>
          </div>
          <div className="aekline">
      <div className="loginpage">
        {contextHolder}
        
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            className=""
            name="email"
            // label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input placeholder="Enter Your Email" />
          </Form.Item>
          <Form.Item
            // label="Password"
            className="Password"
            name="Password"
            rules={[{ required: true }]}
          >
            <Input.Password autoComplete="false" placeholder="Enter Your Password"/>
          </Form.Item>
          <Form.Item>
          <Space wrap>
            <Button type="primary" htmlType="submit" className="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset} className="reset">
              Reset
            </Button>
            </Space>
          </Form.Item>
          <a className="login-form-forgot" onClick={() => setModal2Open(true)}>
            Forgot password ?
          </a>
        </Form>
  
        <Modal
          title="FORGOT YOUR PASSWORD"
          centered
          open={modal2Open}
          onOk={() => setModal2Open(false)}
          onCancel={() => setModal2Open(false)}
        >
          <Form.Item
            className=""
            name="chemail"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Modal>
      </div>
      <div className="modelImg">
      <img src={images} />
          </div>
          </div>
      </div>
      </div>
      </div>
    )
  }

export default Login
