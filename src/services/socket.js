// src/services/socket.js
import { io } from 'socket.io-client';
import {baseURL_} from'../utils/env';

const socket = io(baseURL_);
// const socket = io(baseURL_, { withCredentials: true });

export default socket;
