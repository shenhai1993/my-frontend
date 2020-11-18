<template>
	<image @click.stop="chooseImg($event)" class="imageschild"
		:style="{
			width: datalist.width*rates+'px',
			height: datalist.height*rates+'px',
			top: datalist.top*rates+'px',
			left: datalist.left*rates+'px',
			transform:'translate3d('+datalist.transform.e*rates+'px,'+datalist.transform.f*rates+'px,'+datalist.transform.b*rates+'px) scale3d('+datalist.transform.a+','+datalist.transform.d+',1'+')'
			}" 
		:src="slipe(datalist.backgroundImage)">
	</image>
</template>

<script>
export default {
	props:{
		datalist: {
			type: Object,
			default: {}
		},
		rates: {
			type: Number,
			default: 1
		},
		url: {
			type: String,
			default: ''
		}
	
	},
	data() {
		return {
		}
	},
	methods:{
		chooseImg(e) {
			this.$emit('onClickImg',e)
		},
		slipe(href) {
			let str = new String()
			let newStr= href.indexOf("http")
			 if(newStr==0){
			   str = href
			}
			if(newStr==-1){
			 str =  this.url+href
			}
			return str
		}
	}
}	
</script>

<style>
</style>
