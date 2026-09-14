import { io } from "socket.io-client";

export const socketPayment = io(`${process.env.NEXT_PUBLIC_PAYMENT_ENDPOINT}/notification`, {
    path: "/socket-io"
});