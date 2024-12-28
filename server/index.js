const socketio = require("socket.io");
const fs = require("fs");
const data = require(process.argv[process.argv.length-1]);
const express = require("express");
const app = express();
const cors = require("cors")
const path = require("path")

let port = process.env.PORT || 3000;

app.use(cors());
app.get("/server-port", (req, res)=>{
	res.send(`${port}`);
});
app.get("/has-ssl", (req, res)=>{
	res.send(`${process.env.SSL_CERT != null && process.env.SSL_KEY != null}`);
})

let server;
if (process.env.SSL_CERT && process.env.SSL_KEY) {
	server = require("https").createServer({
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT)
	}, app);
}else {
	server = require("http").createServer(app)
}

const io = socketio(server, {cors:{origin:"*"}});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
	return array;
}


const questions = shuffleArray(data.quotes)

let gameData = {
	players:[],
	answers:data.answers,
	state:"question",
	currentQuestion:null,
	questionIndex:-1,
	questionCount:questions.length
}

function shareGameState(){
	io.emit("state", gameData);
}

function setNextQuestion(){
	gameData.questionIndex++;
	if (gameData.questionIndex>=questions.length){
		gameData.state = "game-over";
		shareGameState();
		return;
	}
	let question = questions[gameData.questionIndex];

	for (let player of gameData.players){
		player.answers = [];
		player.ready = false;
	}

	let answers = [];
	let content = question.content;
	let result = question.content;
	console.log(content)
	for (let answer of gameData.answers){
		let offset = 0;
		let index = -1;
		do {
			index = question.content.indexOf(`<@${answer.id}>`, index+1);
			offset++;
			if (index != -1) {
				answers.push({id:answer.id, index});
			}
		} while(index != -1);
		content = content.replaceAll(`<@${answer.id}>`, "<@question>");
		result = result.replaceAll(`<@${answer.id}>`, `@${answer.value}`)
	}
	answers = answers.sort((a,b)=>a.index - b.index).map(a=>a.id);
	gameData.currentQuestion = {
		answers,
		str: content,
		answer:result
	}
	gameData.state = "question"
	for (let player of gameData.players) {
		player.answers = gameData.currentQuestion.answers.map(a=>"");
	}
	shareGameState();
}

function revealAnswer(){
	gameData.state = "answer"
	for (let player of gameData.players) {
		player.lastGainedPoints = 0;
		for (let i = 0; i< player.answers.length; i++) {
			let answer = player.answers[i] || ""
			let correctAnswer = gameData.currentQuestion.answers[i] || "";
			if (answer == correctAnswer){
				player.lastGainedPoints++;
				player.score++;
			}
		}
	}
	shareGameState();
	setTimeout(()=>{
		setNextQuestion();
	}, 10000)
}

function onPlayerReady(){
	for (let player of gameData.players) {
		if (!player.connected) continue;
		if (!player.ready) {
			shareGameState();
			return;
		}
	}
	revealAnswer();
	shareGameState();
}


io.on("connection", (socket)=>{
	console.log("On connection")
	let username = socket.client.request._query.username;
	if (!username) {
		socket.disconnect();
	}
	console.log(`${username} connected`)

	let player = {
		score:0,
		answers:[],
		ready:false,
		username,
		lastGainedPoints:0
	}

	let newPlayer = true;
	for (let p of gameData.players) {
		if (p.username != username) continue;
		newPlayer = false;
		player = p;
		break;
	}
	player.connected = true;

	socket.on("disconnect",()=>{
		console.log(`${username} disconnected`)
		player.connected = false;
		shareGameState();
	})

	socket.on("answers", (data)=>{
		player.answers = data;
		console.log(player.username, player.answers)
	});

	socket.on("ready", (data)=>{
		if (gameData.state != "question") return;
		player.ready = data == true;
		onPlayerReady();
	})

	if (newPlayer) {
		gameData.players.push(player);
	}
	shareGameState();
})

setNextQuestion();

app.use("/", express.static(path.join(__dirname, "public"), {redirect:false}));

server.listen(port, "0.0.0.0", function(){
	console.log("Running on port", port);
});

