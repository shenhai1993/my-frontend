<template>
	<view class="content">
		<div class="blank30"></div>
		<div style="overflow: auto;">
			<view class="terminalsTop" v-for="(item,$index) in terminalsArr" :key="$index" @click="getTerminalsItem(item.id)">
				<view class="terminalsDir">
					<font v-if="item.direction===0">横</font>
					<font v-if="item.direction===1">竖</font>
					<font v-if="item.direction===2">横(反)</font>
					<font v-if="item.direction===3">竖(反)</font>
				</view>
				<view class="terminalsName">
					<p>终端名称:{{item.name}}</p>
					<p>终端型号:{{item.type}}</p>
				</view>
			</view>
		</div>	
		<div class="blank30"></div>
		<drawer :classname="'active'" ref="drawer" v-on:onHide="onHideDrawer">
			<view class="terminalsWrap">
				<view class="terminalsTitle" style="text-align: center;">
					{{terminalsDetails.name}}
				</view>
				<view class="terminalsContent">
					<p>IP:{{terminalsDetails.ip}}</p>
					<p>MAC:{{terminalsDetails.mac}}</p>
					<p>群组ID:{{terminalsDetails.tree_id}}</p>
					<p>版本:{{terminalsDetails.version}}</p>
					<p>屏幕方向:
						<font v-if="terminalsDetails.direction===0">横屏</font>
						<font v-if="terminalsDetails.direction===1">竖屏</font>
						<font v-if="terminalsDetails.direction===2">横屏（反）</font>
						<font v-if="terminalsDetails.direction===3">竖屏（反）</font>
					</p>
					<p>状态:
						<font v-if="terminalsDetails.online_status===1">在线</font>
						<font v-if="terminalsDetails.online_status===0">离线</font>
						<font v-if="terminalsDetails.online_status===2">待机</font>
					</p>
					<p>城市:{{terminalsDetails.city.name}}</p>
				</view>
			</view>
		</drawer>
	</view>
</template>

<script>
	import api from "../../api/index.js"
	import drawer from "../components/drawer/index.vue"
	export default {
		components: {drawer},
		data() {
			return {
				title: '终端管理',
				terminalsArr: [],
				terminalsDetails: {}
			}
		},
		onLoad() {
			uni.showLoading({
			    title: '加载中'
			 })
			//this.getTerminalsList()
		},
		onShow() {
			this.getTerminalsList()
		},
		onPullDownRefresh(){
			this.terminalsArr= []
			this.getTerminalsList()
		 },
		methods: {
			/**
			 *  获取终端列表
			 *  */
			getTerminalsList:function(){
				api.getTerminalsList('GET','/bank/app/terminals').then(res =>{
					 uni.hideLoading()   
					 this.terminalsArr = res.data.message 
				})
			},
			getTerminalsItem(id){
				let url = '/bank/app/terminals/one/'+id
				api.getTerminalsItem('GET',url).then(res =>{
					 console.log(res.data.message ) 
					 this.terminalsDetails = res.data.message
					 uni.hideTabBar()
					 this.$refs.drawer.open()
				})
			},
			onHideDrawer(){
				uni.showTabBar()
			}
		}
	}
</script>

<style lang="scss">
	$bgw-color: #FFFFFF;
	.content{
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: rgb(246,246,246);
	}
	.terminalsTop{
		background: $bgw-color;
		display: table;
		width: 100%;
		padding: 30upx 20upx;
		margin-bottom: 10px;
		.terminalsDir{
			display: table-cell;
			font-size: 24upx;
			text-align: center;
			width: 100upx;
			height: 100upx;
			line-height: 100upx;
			vertical-align: middle;
			background: #007AFF;
			color: #FFFFFF;
			font-weight: bold;
			border-radius: 50%;
		}
		.terminalsName{
			padding-left: 50upx;
		}
	}
	.terminalsWrap{
		padding: 45upx 30upx;
	}
	.terminalsContent{
		padding-top: 60upx;
		._p{
			padding: 15upx 20upx;
			background: #00BFFF;
			border-bottom: 1px solid #00BFFF;
		}
	}
</style>
