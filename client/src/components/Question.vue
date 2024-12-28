<script setup>
import AppAnswerSelect from "./AnswerSelect.vue"
</script>

<template>
	<pre><template v-for="(textPart, i) of textParts"><template v-if="textPart != '<@question>'">{{textPart}}</template><app-answer-select :modelValue="getValue(i)" @update:modelValue="setValue(i, $event)" v-else></app-answer-select></template></pre>
	<div class="button-container">
		<button class="ready-button" :class="{ready:isReady}" @click="toggleReady()">Ready</button>
	</div>
</template>

<script>
import {state} from "@/utils/state";
import { connectionState, sendAnswers, setReadyState } from "@/utils/socket";

export default {
	data(){
		return {
			answers:[]
		}
	},
	computed:{
		questionText(){
			return state.gameData.currentQuestion.str;
		},
		textParts(){
			let text = this.questionText;
			let index = text.indexOf("<@question>");
			let result = [];
			while (index != -1){
				let preText = text.substring(0, index);
				result.push(preText);
				result.push("<@question>");
				text = text.substring(index + "<@question>".length)
				index = text.indexOf("<@question>");
			}
			result.push(text);
			return result;
		},
		currentPlayer(){
			return state.gameData.players.find(p=>p.username == connectionState.username);
		},
		isReady(){
			if (!this.currentPlayer) return false;
			return this.currentPlayer.ready;
		}
	},
	methods:{
		setAnswersFromGameState(){
			if (!this.currentPlayer) return;
			this.answers = this.currentPlayer.answers;
		},
		getValue(index){
			let offset = 0;
			for (let i = 0; i < this.textParts.length; i++){
				let textPart = this.textParts[i]
				if (i == index){
					return this.answers[offset] || "";
				}
				if (textPart == "<@question>"){
					offset++;
				}
			}
		},
		setValue(index, value){
			let offset = 0;
			for (let i = 0; i < this.textParts.length; i++){
				let textPart = this.textParts[i]
				if (i == index){
					this.answers[offset] = value;
					this.sendAnswers();
					return;
				}
				if (textPart == "<@question>"){
					offset++;
				}
			}
		},
		sendAnswers(){
			sendAnswers(this.answers);
		},
		toggleReady(){
			setReadyState(!this.isReady);
		}
	},
	mounted(){
		this.setAnswersFromGameState();
	}
}
</script>

<style scoped>
pre {
	margin: 5px 10px;
}

.button-container{
	margin: 5px 10px;
}

.ready-button{
	border-left: solid 5px var(--red);
}

.ready-button.ready{
	border-left: solid 5px var(--green);
}
</style>