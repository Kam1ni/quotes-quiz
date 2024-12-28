<script setup>
import AppQuestion from "./Question.vue";
import AppShowAnswer from "./ShowAnswer.vue";
</script>

<template>
	<div class="container">
		<div class="title">Quotes Quiz</div>
		<app-question v-if="gameState=='question'"></app-question>
		<app-show-answer v-else-if="gameState=='answer'"></app-show-answer>
		<div v-else-if="gameState=='game-over'">Game Over</div>
		<div class="spacer"></div>
		<div class="question-count-text">{{questionCountText}}</div>
	</div>	
</template>


<script>
import {state} from "@/utils/state";

export default {
	data(){
		return {
			state
		}
	},
	computed:{
		gameState(){
			return this.state.gameData.state;
		},
		currentQuestion(){
			return this.state.gameData.currentQuestion;
		},
		questionCountText(){
			return `Question ${this.state.gameData.questionIndex+1} of ${this.state.gameData.questionCount}`;
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	flex-shrink: 1;
	overflow-y: auto;
	overflow-x: auto;
}

.spacer {
	flex-grow: 1;
	flex-shrink: 1;
}

.question-count-text {
	align-self: flex-end;
	text-align: end;
	margin: 5px 10px;
	font-size: 20px;
}

.title {
	margin: 5px 10px;
	font-size: 30px;
}


</style>