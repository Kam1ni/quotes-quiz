<template>
	<select name="" id=""  :value="modelValue" @input="setValue($event)">>
		<option v-for="item of items" :key="item.id" :value="item.id">{{item.value}}</option>
	</select>
</template>

<script>
import {state} from "@/utils/state"
export default {
	props:{
		modelValue:{
			type:String
		}
	},
	computed:{
		items(){
			return [
				{
					id:"",
					value:""
				},
				...state.gameData.answers.sort((a,b)=>{
					return a.value.localeCompare(b.value)
				})
			];
		}
	},
	methods:{
		setValue(event){
			this.$emit("update:modelValue", event.target.value)
		}
	}
}
</script>
