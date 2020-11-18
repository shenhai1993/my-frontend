<template>
	<view class="wrapContent" :class="{ sheetContent: isOpened }">
		<view class="container">
			<view class="row" v-for="(item,index) in menu" :key="index"  @click="handClick(item)">{{item.title}}</view>
			 <view class="row text-gray margin-top" @click="cancel">取 消</view>
		</view>
		<view class="mask" @click="cancel"></view>
	</view>
</template>

<script>
	export default {
		props: {
			menu: {
				type: Array,
				default: []	
			},
			isOpened: {
				type: Boolean,
				default: false
			},
			
		},
		data() {
			return {
			}
		},
		methods: {
			cancel() {
			  this.$emit('cancelClick')
			},
			handClick(item) {
				this.$emit('onhandClick', item.type)
			}
		}
	}
</script>
<style lang="scss">
	.wrapContent{
		position:fixed;right:0;bottom: 0;left:0;
		transition: height 0.4s ease-out, width 0.4s ease-out, opacity 0.6s ease-in, visibility 0.2s ease-in;
		overflow: hidden;
		height: 0px;
	}
	.sheetContent{
		height: 100%;
	}
	.mask{
	  height: 100%;	
	  background:#000;opacity:0.5;position:absolute;top:0;right:0;bottom: 0;left:0;z-index:600  
	}
	.row{
	  width: 100%;text-align: center;line-height: 50px;background: #fff;
	  border-bottom: 1px solid #f0f0f0;
	}
	.text-gray{color: gray}
	.bg-red{color:#fff;background-color:#e54d42;}
	.margin-top{margin-top:10px}
	.container{
		width: 100%;
		transition: width 0.4s ease-out, opacity 0.6s ease-in, visibility 0.2s ease-in;
		background:#f0f0f0;position:absolute;width:100vw;bottom:0;z-index:888;font-size:30rpx;
	}
</style>