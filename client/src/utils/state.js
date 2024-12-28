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
		questionCount:0,
		sideBarOpen:false
	}
}

export function setState(val){
	state = val;
}