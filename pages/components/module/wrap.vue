<template>
	<view class="wrapchild"
		style="background-size: contain;"
		:style="{
			height: datalist.height*rates+'px',
			width: datalist.width*rates+'px',
			backgroundImage: 'url('+url+ datalist.backgroundImage+ ')',
			backgroundRepeat: datalist.backgroundRepeat,
			transform:'translate3d('+datalist.transform.e*rates+'px,'+datalist.transform.f*rates+'px,'+datalist.transform.b*rates+'px) scale3d('+datalist.transform.a+','+datalist.transform.d+',1'+')'
			}" >
			<slot></slot>
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
		chooseText(index) {
			this.$emit('onClickText')
		}
	}
}	
</script>

<style>

</style>
