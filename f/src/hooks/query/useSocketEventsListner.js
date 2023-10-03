import { useEffect } from 'react';
import { useSocketSlice } from '../store/useSocketEventsListner';
// import { useSocketSlice } from '../store/useSocketSlice';

export function useSocketEventsListner(events) {

    const { socket } = useSocketSlice();

    useEffect(() => {

        for (const event of events) {
            socket.on(event.name, event.handler);
        }

        return function () {
            // for (const event of events) {
            //     socket.off(event.name);
            // }
        };

    }, [socket]);
}