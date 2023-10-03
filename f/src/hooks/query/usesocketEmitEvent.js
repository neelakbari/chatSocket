import { useEffect } from "react";
import { useSocketEventsListner } from "./useSocketEventsListner";
import {
  socketConnetion,
  useSocketSlice,
} from "../store/useSocketEventsListner";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export const socketEmitEvent = (eventName, payload) =>
  useSocketSlice.getState().socket.emit(eventName, payload);

export function useSocket() {
  const socketClientSlice = useSocketSlice();
  const { socket, setState, msgstore, chatstore ,userData} = socketClientSlice
  const navigate = useNavigate();
  const cookies = new Cookies();
  const events = [
    {
      name: "connected",
      handler() {
        setState({ isSocketConnected: true });
      },
    },

    {
      name: "res",
      handler(response) {
        console.log({ response });
        const { event, data } = response;

        switch (event) {
          case "register":
            // console.log('res',data)
            break;

          case "login":
            // console.log("res", data);
            cookies.set("abc", data?.data?.token, { path: '/' });
            localStorage.setItem('userData', JSON.stringify(data?.data))
            setState({ user: data, socket: socketConnetion(data?.data?.token, data?.data?.id) });
            navigate(`/Mainpage`);

            // window.location()
            break;

          case "getAllUser":
            // console.log("res", data.data);
            setState({ users: data?.data });
            break;

            case "sendMessage":
              
              // console.log("res", response,data.data.message);
              // console.log("sendMessage : ----------------------",data );
              const prevChatStore = socketClientSlice.getState().chatstore;
  
              setState({ chatstore: [...prevChatStore, data.data] });
              break;

          case "getChatHistory":
            // console.log("res", data.data);
            setState({ chatstore: data.data.reverse() });
            break;


          default:
            break;
        }
      },
    },
  ];

  useSocketEventsListner(events);

  useEffect(() => {
    // const payload = { firstName : 'Test', lastName: 'test', email : 'test@getDefaultNormalizer.com', password : 'Admin@123' }

    // socketEmitEvent("register", payload);

    socketEmitEvent("join", {});

    // return () => {
    //     socket.disconnect();
    // };
  }, []);

  return {};
}
