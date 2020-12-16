<template>
	<view>
		<view class="volet_clos" :class="[show?classname:'']" @click="hide">
			<view class="top">
				<icon class="iconfont icon-RectangleCopy18" type="cancel" size="26"></icon>
			</view>
			<view :style="{height: halfHeight}" @click.stop style="margin-top: 80px;background: #FFFFFF; overflow: auto;">
				<slot />
			</view>

		</view>
	</view>

</template>

<script>
	export default {
		props: ["classname"],
		data() {
			return {
				show: false,
				halfHeight: '100%',
			};
		},
		onReachBottom(){
		},
		methods: {
			open() {
				this.show = true;
			},
			hide(){
				this.show=!this.show
				uni.showTabBar()
				//slot  中内容先隐藏
				//setTimeout(()=>{
					this.$emit('onHide')
				//},600)
			}
		}
	}
</script>
<style>
	.top {
		width: 20px;
		margin-top: 10px;
		left: 20rpx;
		height: 20px;
		position: absolute;
	}
	.volet_clos {
		transition: height 0.4s ease-out, opacity 0.6s ease-in, visibility 0.2s ease-in;
		bottom: 0;
		position: fixed;
		height: 0;
		width: 100%;
		background-color: rgba(0,0,0,0.8);
		z-index: 99;
	}
	.active300 {
		opacity: 1;
		visibility: 1;
		height: 30%;
		z-index: 9999;
	}
	.active500 {
		opacity: 1;
		visibility: 1;
		height: 50%;
		z-index: 9999;
	}
	.active600 {
		opacity: 1;
		visibility: 1;
		height: 60%;
		z-index: 9999;
	}
	.active800 {
		opacity: 1;
		visibility: 1;
		height: 80%;
		z-index: 9999;
	}
	.active900 {
		opacity: 1;
		visibility: 1;
		height: 90%;
		z-index: 9999;
	}
	.active {
		opacity: 1;
		visibility: 1;
		height: 100%;
		z-index: 9999;
	}
	.iconfont {
		font-size: 55rpx;

	}
</style>