<template>
	 <view class="content">
		 <view class="login">
			 <h2 class="title">TCL易秀信发</h2>
			 <h5 v-if="scanStatus" class="title">终端编号不存在，请联系客服</h5>
			 <h5 v-if="!loginFormStatus" class="title">正在登录。。。。</h5>
			 <form  v-if="loginFormStatus">
			 	<view class="uni-form-item uni-column">
			 		<input class="uni-input" v-model="name"  placeholder="请输入账号" />
			 	</view>
			 	<view class="uni-form-item uni-column">
			 		<input class="uni-input" type="password" v-model="password" placeholder="请输入密码" />
			 	</view>
			 	<view class="uni-btn-v">
			 		<button form-type="submit"  @click="formSubmit" class="loginBtn">登录</button>
			 	</view>
			 </form>
		 </view>
    </view>
</template>

<script>
	import urlConfig from '../../common/config.js'
	export default {
		data() {
			return {
				title: 'Hello',
				loginFormStatus: false,
				scanStatus: false,
				code: '',
				name: '',
				password: '',
				formData: {
					name: '',
					password: ''
				}
			}
		},
		onLoad(option) {
			uni.showLoading({
			    title: '加载中'
			 })
			let _that = this
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
					if(option.number !== undefined){
						_that.scanLogin(option.number,loginRes.code)
					} else {
						_that.onLogin(loginRes.code)
					}
				}
			})
		},
		methods: {
			// 根据识别appid去获取token
			onLogin: function(code) {
				uni.request({
					url: urlConfig+'/bank/app/authorizations',
					data:{
						code: code
					},
					method: 'POST',
					header: {
						'content-type': 'appliscation/json'
					},
					success: (res) => {
						if(res.data.success){
							// 存储token
							uni.setStorage({
								 key:'Token',
								 data: res.data.message.access_token
							 }) 
							 setTimeout( ()=> {
							 	this.getMe()              
							 }, 500)
						} else {
							this.loginFormStatus = true
							uni.hideLoading() 
							uni.showToast({
							  	title: res.data.message,
							  	icon: 'none', 
							  	duration: 1000
							});
						}
					}
				})
			 },
			 // 用户账号密码登录
			 formSubmit: function(){
				 let _that = this
				 uni.login({
				   provider: 'weixin',
				   success: function (loginRes) { 
					  uni.request({
					  	url: urlConfig+'/bank/app/authorizations',
					  	data:{
					  		code: loginRes.code,
							name: _that.name,
							password: _that.password
					  	},
					  	method: 'POST',
					  	header: {
					  		'content-type': 'application/json'
					  	},
					  	success: (res) => {
					  		if(res.data.success){
					  			// 存储token
					  			uni.setStorage({
					  				 key:'Token',
					  				 data: res.data.message.access_token
					  			 }) 
					  			 setTimeout( ()=> {
					  			 	_that.getMe()              
					  			 }, 500)
					  		} else {
								uni.showToast({
									title: res.data.message,
									icon: 'none', 
									duration: 1000
								});
							}
					  	}
					  }) 
				   }
				})   
			},
			// 通过扫码登录
			scanLogin: function(number,code){
				 let _that = this
				uni.request({
					url: urlConfig+'/bank/app/scan/authorizations',
					data:{
						code: code,
						number: number
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if(res.data.success){
							// 存储token
							uni.setStorage({
								 key:'Token',
								 data: res.data.message.access_token
							 }) 
							 setTimeout(()=> {
							 	_that.getMe()              
							 }, 500)
							 
						} else {
							uni.showToast({
							    title: res.data.message,
								icon: "none", 
							    duration: 2000
							})
							this.scanStatus = true
						}
					},
					fail: (res) => {
					      console.log("fail:===="+res)
					}
				})
			},
			// 获取用户信息
			 getMe:function () {
				this.$req({
						method:'GET',
						url:'/bank/app/me',
						data: {}
					}).then(res=>{
						if(res.data.success) {
							uni.hideLoading()   
							this.setStorage(res)
							uni.showToast({
								title: '登录成功',
								duration: 300
							});
							setTimeout(function () {
								// 跳转到首页
								uni.switchTab({
								    url: '../../pages/terminals/index'
								})               
							}, 500)
							
						}
						
				   })
				   .catch(error=>{
						console.log(error);
					})
			},
			setStorage: function (res) {
				uni.setStorageSync('name', res.data.message.name) 
				uni.setStorageSync('group_id', res.data.message.group_id)
				uni.setStorageSync('time', res.data.message.last_time)	
			} 
		}
	}
</script>

<style lang="scss">
	.content {
		height: 100vh;
		box-sizing: border-box;
		background: rgb(27,29,45);
		position: relative;
		.login{
			position: absolute;
			top: 20%;
			left: 8vw;
			padding:60upx 50upx;
			box-sizing: border-box;
			width:84vw;
			background-color: #292C3D;
			border-radius: 10upx;
			box-shadow: 0px 0px 5px rgba(0,0,0,0.2);
			.title{
				text-align: center;
				color: #FFFFFF;
				margin-bottom: 50upx;
			}
		}
		.uni-form-item{
			margin-bottom: 50upx;
			.uni-input{
				height: 80upx;
				padding: 0upx 40upx;
				border-radius: 4px;
				font-size: 14px;
				border: 1px solid #FFFFFF;
				color: #FFFFFF;
			}
		}
		
	}
</style>
