import React, { useEffect, useState } from "react";
import { useSocketSlice } from "../hooks/store/useSocketEventsListner";
import { socketEmitEvent } from "../hooks/query/usesocketEmitEvent";
import Cookies from "universal-cookie";

const Mainpage = () => {
  const [msgnamestore, setMsgnamestore] = useState("");
  const [sendmsg, setSendmsg] = useState("");
  const [temp, setTemp] = useState("")
  const cookies = new Cookies();
  const { user, users, chatstore, msgstore } = useSocketSlice();
  useEffect(() => {
    
    setTemp(JSON.parse(localStorage.getItem('userData')))
  }, [])
  
  // console.log(JSON.parse(localStorage.getItem('userData')),"temp")
  useEffect(() => {
    socketEmitEvent("getAllUserStatus", {});
  }, []);
  const handleclick = (e) => {
    // setMsgnamestore(e.firstName.concat(e.lastName))
    setMsgnamestore(e);
    const data = {
      id: e._id,
      // loginID:user.data.id
    };
    socketEmitEvent("getChatHistory", data);
  };
  
  const msgsend = (e) => {
    
    const data = {
      id: msgnamestore._id,
      message: sendmsg,
    };
    socketEmitEvent("sendMessage", data);
    
    setSendmsg("");
    
  };
  
  // console.log(msgnamestore,"msgnamestore",temp)
  useEffect(() => {
    if (temp) {
      socketEmitEvent("getChatHistory", { loginID: temp?.id });
    }
    
  }, [temp]);
  
  const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : ''
  
  // console.log(chatstore,"chatstorev")
  return (
    <>
      <div className="Main">
        <div className="list">
          {users?.map((e) => {
            return (
              <div className="name" onClick={() => handleclick(e)}>
                {e.firstName + e.lastName} {userData.id === e._id ? '(Me)' : ''}
              </div>
            );
          })}
        </div>
        <div className="msg">
          <div className="msgName">

            <h1>{msgnamestore?.firstName} {msgnamestore?.lastName}</h1>
          </div>

          {chatstore?.map((e) => {
            return (


              e.sender === msgnamestore._id ? <p className="sender">{e.message}</p> : <p className="receiver">{e.message}</p>

            )
          })}


        </div>
        <div className="sendmsg">
          <input type="text" value={sendmsg} onChange={(e) => setSendmsg(e.target.value)} />
          <button type="submit" className="btn" onClick={msgsend}>
            send
          </button>
        </div>
      </div>
    </>
  );
};

export default Mainpage;
