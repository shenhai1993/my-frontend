<template>
	<view @click.stop="chooseText" class="imageschild"
		:style="{
			width: datalist.width*rates+'px',
			height: datalist.height*rates+'px',
			top: datalist.top*rates+'px',
			left: datalist.left*rates+'px',
			fontSize: datalist.fontSize*rates+'px',
			fontFamily: datalist.fontFamily,
			color: datalist.color,
			transform:'translate3d('+datalist.transform.e*rates+'px,'+datalist.transform.f*rates+'px,'+datalist.transform.b*rates+'px) scale3d('+datalist.transform.a+','+datalist.transform.d+',1'+')'
			}" >{{datalist.text}}
	</view>
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
	
	},
	data() {
		return {
		}
	},
	methods:{
		chooseText(index) {
			this.$emit('onClickText')
		}
	}
}	
</script>

<style>
</style>
