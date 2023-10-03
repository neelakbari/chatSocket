import { io } from "socket.io-client";
import Cookies from "universal-cookie";
import create from "zustand";

const cookies = new Cookies();

export const ENDPOINT = "http://localhost:7000";

export const socketConnetion = (token,id) =>  io(ENDPOINT, {
    transports: ["websocket"],
    auth: {
        token,
        user : {
            id
        }
    },
});

// console.log('socket----', socket);
const initialSocketState = {
    socket: socketConnetion(cookies?.get('abc') ?? '',''),
    isSocketConnected: false,
    user: null,
    users: null,
    notificationCount: null,
    // messages: [],
    chatstore:[],
    msgstore:''

}

export const useSocketSlice = create((set, get) => ({
    ...initialSocketState,
    setState: (nextState) => set({ ...nextState }),
    getState: () => get()
}));
