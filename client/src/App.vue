<script setup>
import AppLogin from "./components/Login.vue";
import AppPlayerList from "./components/PlayerList.vue";
import AppGame from "./components/Game.vue"
</script>


<template>
	<app-login v-if="!loggedIn"></app-login>
	<div class="game-container" v-else>
		<app-player-list></app-player-list>
		<app-game></app-game>
	</div>
</template>

<script>
import {connectionState, setConnectionState} from "@/utils/socket";
import {state, setState} from "@/utils/state";

export default {
	data(){
		return {
			state,
			connectionState
		}
	},
	computed:{
		loggedIn(){
			return this.connectionState.loggedIn;
		}
	},
	created(){
		setConnectionState(this.connectionState);
		setState(this.state)
	}
}
</script>

<style scoped>
.game-container {
	display: flex;
	flex-direction: row;
	height:100%;
}
</style>