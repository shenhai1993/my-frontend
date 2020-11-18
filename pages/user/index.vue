<template>
	<view class="content">
		<div class="headTop">
			 <view class="headImg">
			      <image style="width: 80px; height: 80px;border-radius: 50%;" src="../../static/logo.png"></image>
			 </view>
			 <view class="headName">
				 <p>账号:{{name}}</p>
				 <span>登录:{{time}}</span>
			 </view>
		</div>
		<div class="blank20"></div>
		<view class="middleEq">
			<p>我的设计</p>
		</view>
		<div class="blank20"></div>
		<view class="bowOut">
			<p>联系客服</p>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '内容单',
				time: '',
				name: ''
			}
		},
		onLoad() {
			this.name = uni.getStorageSync('name')
			this.time = uni.getStorageSync('time')
		},
		methods: {
			onOut() {
				try {
				    uni.clearStorageSync()
					uni.navigateTo({
					    url: '../../pages/login/index'
					})
				} catch (e) {
				    // error
				}
			}
		}
	}
</script>

<style lang="scss">
	$bgw-color: #FFFFFF;
	.content{
		width: 100vw;
		height: 100vh;
		background: rgb(246,246,246);
	}
	.headTop{
		display: table;
		width: 100%;
		padding: 15px 20px;
		background: $bgw-color;
		.headImg {
			display: table-cell;
			width: 100px;
			vertical-align: middle;
		}
		.headName{
			display: table-cell;
			vertical-align: middle;
		}
	}
	.middleEq{
		background: $bgw-color;
		height: 100px;
		padding-left: 25px;
		line-height: 100px
	}
	.blank20{
		height: 30rpx;
	}
	.bowOut{
		background: $bgw-color;
		color: blue;
		text-align: center;
		height: 100px;
		line-height: 100px
	}
</style>
