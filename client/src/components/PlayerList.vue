<template>
	<div class="player-list" :class="extraClasses">
		<div class="title">Players
			<div class="spacer"/>
			<button class="hide-lg" @click="toggleScoreBoard()">X</button>
		</div>
		<div class="player" v-for="player in players" :key="player.username" :class="{ready:player.ready, disconnected:!player.connected, currentPlayer:isCurrentPlayer(player)}">
			<div class="name">{{player.username}}</div>
			<div class="score">Score: {{player.score}}</div>
		</div>
		<div class="spacer"></div>
		<button class="exit-button" @click="exitClicked()">Exit</button>
	</div>
</template>


<script>
import {state} from "@/utils/state";
import {connectionState, disconnect} from "@/utils/socket";

export default {
	computed:{
		players(){
			return state.gameData.players;
		},
		extraClasses(){
			return {
				closed:!state.sideBarOpen
			}
		}
	},
	methods:{
		exitClicked(){
			disconnect();
		},
		isCurrentPlayer(player){
			return player.username == connectionState.username;
		},
		toggleScoreBoard(){
			state.sideBarOpen = !state.sideBarOpen;
		}
	}
}
</script>

<style scoped>
.player-list {
	display: flex;
	flex-direction: column;
	width: 250px;
	overflow-y: auto;
	height:100%;
	flex-shrink: 0;
	flex-grow: 0;
	background-color: rgb(26, 29, 31);
	border-right: solid 1px black;
}

.player, .title{
	border-bottom: solid 1px black;
}

.title {
	font-size: 25px;
	padding: 10px;
	display: flex;
	flex-direction: row;
}

.player {
	border-left: solid 5px transparent;
	display: flex;
	flex-direction: column;
	padding: 5px 10px;
}

.player .name {
	font-size: 17px;
}

.player .score {
	font-size: 13px;
}

.player.ready {
	border-left: solid 5px var(--green);
}

.player.disconnected {
	border-left: solid 5px var(--red);
}

.player.currentPlayer {
	background-color: #116186;
}

.spacer {
	flex-grow: 1;
	flex-shrink: 1;
}

.exit-button{
	margin: 10px
}

@media screen and (max-width: 600px) {
	.player-list.closed {
		width: 0;
	}

	.player-list{
		width: 100%;
		transition: width 1s;
	}
}
</style>