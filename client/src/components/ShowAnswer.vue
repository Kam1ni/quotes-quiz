<template>
	<pre class="answer">{{currentQuestion.answer}}</pre>
	<div class="points-gained">
		<div class="player" v-for="player in players" :key="player.username">+{{player.lastGainedPoints}} {{player.username}}</div>
	</div>
</template>

<script>
import {state} from "@/utils/state";
import { connect, connectionState } from "@/utils/socket";

export default {
	computed:{
		currentQuestion(){
			return state.gameData.currentQuestion;
		},
		players(){
			let allPlayers = [...state.gameData.players];
			allPlayers.sort((a,b)=>{
				if (a.username == connectionState.username){
					return -1;
				}
				if (b.username == connectionState.username) {
					return 1;
				}
				return b.lastGainedPoints - a.lastGainedPoints;
			});
			allPlayers = allPlayers.filter(p=>{
				if (p.username == connectionState.username){
					return true;
				}
				if (p.lastGainedPoints == 0){
					return false;
				}
				return true;
			})
			return allPlayers;
		}
	}
}
</script>

<style scoped>
.answer {
	margin: 5px 10px;
}

.points-gained {
	margin: 5px 10px;
	font-size: 18px;
}
</style>