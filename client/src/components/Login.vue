<template>
	<form @submit.stop.prevent="login()" class="container">
		<label for="username">Username</label>
		<input type="text" name="username" v-model="username">
		<button @click.stop.prevent="login()" :disabled="loginDisabled">Play</button>
	</form>
</template>

<script>
import {connect} from "@/utils/socket";

export default {
	data(){
		return {
			username:localStorage.getItem("username")
		}
	},
	computed:{
		loginDisabled() {
			return !this.username;
		}
	},
	methods:{
		login(){
			if (this.loginDisabled) return;
			connect(this.username);
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-self: center;
	width: 250px;
}

.container > * {
	margin: 5px;
}


button {
	width: 100px;
}

input{
	height: 20px;
	display: block;
	color: black;
	font-size: 17px;
}
</style>