export let state = {
	gameData: {
		players:[],
		answers:[],
		state:"question",
		currentQuestion:{
			answers:[],
			str:"",
			answer:""
		},
		questionIndex:0,
		questionCount:0
	}
}

export function setState(val){
	state = val;
}