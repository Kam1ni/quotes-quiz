import {io} from "socket.io-client";
import {state} from "./state"
import Axios from "axios";

export let connectionState = {
	connected:false,
	loggedIn:false,
	username:"",
	socket:null
}

export function setConnectionState(val){
	connectionState = val;
}

let connecting = false;

async function getSocketOrigin(){
	if (process.env.NODE_ENV == "development"){
		return "ws://localhost:3000"
	}

	let response = await Axios.get("/server-port");
	let port = await response.data;
	response = await Axios.get("/has-ssl");
	let hasSsl = response.data;

	if (hasSsl) {
		return `wss://${location.hostname}:${port}`;
	}
	return `ws://${location.hostname}:${port}`;
}

export async function connect(username){
	if (connectionState.connected) return;
	if (connectionState.loggedIn) return;
	if (connecting) return;

	connecting = true;

	let origin = await getSocketOrigin();

	username = username.trim();
	let socket = io(origin, {reconnectionDelay:3000, query:{username}});
	console.log("Connecting", origin)
	connectionState.socket = socket;
	connectionState.username = username;

	
	socket.io.on("error", (error)=>{
		console.error(error);
		connectionState.connected = false;
	})

	socket.on("connect", ()=>{
		console.log("Connected")
		localStorage.setItem("username", username)
		connecting = false;
		connectionState.loggedIn = true;
		connectionState.connected = true;
	})

	socket.on("disconnect", ()=>{
		console.log("Disconnected")
		connecting = false;
		if (connectionState.socket){
			connectionState.socket.disconnect();
			connectionState.socket = null;
		}
		connectionState.loggedIn = false;
		connectionState.connected = false;
		socket.close();
	})

	socket.on("state", (gameData)=>{
		console.log("Received gameData", gameData);
		state.gameData = gameData;
	})
}

export function setReadyState(ready){
	if (!connectionState.socket) return;
	connectionState.socket.emit("ready", ready);
}

export function sendAnswers(answers){
	if (!connectionState.socket) return;
	connectionState.socket.emit("answers", answers)
}

export function disconnect(){
	if (connectionState.socket){
		connectionState.socket.disconnect();
	}
}