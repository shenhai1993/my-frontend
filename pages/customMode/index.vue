<template>
	<view class="content">
		<view class="methodBox">
			<button type="default" v-show="!saveStatus" @click="saveText" style="float: right; background: #007AFF;color: #FFFFFF;" size="mini">确认</button>
			<button type="default" v-show="saveStatus && disAbledBtn" @click="save" style="float: right; background: #007AFF;color: #FFFFFF;" size="mini">保存</button>
		</view>
		<view class="templateBox" :style="{height: height*rates+'px',width: width*rates+'px'}">
				<div  v-for="(item1,$index) in detaArr" :key="$index" class="childBox">
					<image-div @onClickImg="chooseImg($index,item1)" :class="{ active:$index===indexData}" v-if="item1.type==='image'" :datalist="item1" :rates="rates" :url="base_url"></image-div>
					<wrap-div :datalist="item1"  v-if="item1.type==='wrap'" :rates="rates" :url="base_url" class="childBox">
						<div v-for="(item2,$index2) in item1.childData" :key="$index2" class="childBox">
							<image-div @onClickImg="chooseImg($index2,item2)" :class="{active:$index===indexData}" v-if="item2.type==='image'" :datalist="item2" :rates="rates" :url="base_url"></image-div>
							<text-div  @onClickText="chooseText($index2,item2)" v-if="item2.type==='text'" :datalist="item2" :rates="rates"></text-div>
							<wrap-div :datalist="item2"  v-if="item2.type==='wrap'" :rates="rates" :url="base_url" class="childBox">
								<div v-for="(item3,$index3) in item2.childData" :key="$index3" class="childBox">
									<image-div @onClickImg="chooseImg($index3,item3)" :class="{ active:$index===indexData}" v-if="item3.type==='image'" :datalist="item3" :rates="rates" :url="base_url"></image-div>
									<text-div  @onClickText="chooseText($index3,item3)" v-if="item3.type==='text'" :datalist="item3" :rates="rates"></text-div>
								</div>	
							</wrap-div>
						</div>
					</wrap-div>
					<text-div  @onClickText="chooseText($index,item1)" v-if="item1.type==='text'" :datalist="item1" :rates="rates"></text-div>
				</div>
				<view class="shadeBox" :style="[shadeStyleObject]"></view>	
		</view>	
		<!-- 文本编辑弹出窗 -->
		<view class="editText" v-show="editMode" @click.stop="closeTextModeL">
			<textarea v-model="textValue" @click.stop auto-height placeholder-style="color:#fff" style="color:#fff;margin: 10px auto;"/>
		</view>	
		<gmy-img-cropper ref="gmyImgCropper" :cropperWidth="imageW"  :cropperHeight="imageH" @getImg = "getImg"></gmy-img-cropper>
		<view :hidden="userFeedbackHidden" class="popup_content">
			<view class="popup_title">名称和时长</view>
			<view class="popup_textarea_item">
				 <view class="uni-form-item uni-column">
					<view class="title">名称：</view>
					<input class="uni-input" v-model="name" maxlength="15"/>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">时长：</view>
					<input class="uni-input" type='number' v-model="seconds" maxlength="5"/>
				</view>	
				<view class="uni-form-item uni-column">
					<view @click="closeFeedback()">
						<button class="popup_button">取消</button>
					</view>
					<view @click="submitFeedback()">
						<button class="popup_button">确定</button>
					</view>
				</view>	
			</view>
		</view>
	</view>
</template>

<script>
	import gmyImgCropper from "../components/crop/cropper.vue"
	import wrapDiv from "../components/module/wrap.vue"
	import imageDiv from "../components/module/image.vue"
	import textDiv from "../components/module/text.vue"
	import urlConfig from '../../common/config.js'
	import {mapState, mapActions, mapMutations} from 'vuex'
	import api from "../../api/index.js"
	export default { 
		 components: {
		    gmyImgCropper,
			wrapDiv,
			imageDiv,
			textDiv
		  },
		data() {
			return {
				detailData: {},
				thumb_path: '',
				Id: 0,
				name: '',
				seconds: 20,
				contentId: 0,
				removeStatu: false, // 编辑还是新建内容单判断:
				imgSrc:'123',
				detaArr: {},
				disAbledBtn: true,
				tpl: {
				  dynamic:{
					words: {},
					images: {}
				  }
				},
				fontObj: {
					content: ''
				},
				saveStatus: true,
				indexData: 'background',
				base_url: '',
				imageW: 0,
				imageH: 0,
				width: 100,
				height: 100,
				zoom: 1,
				imgCropperShow: 2,
				rates: 1,
				editMode: false, //文本弹窗窗
				textValue: '', // 文本默认值
				userFeedbackHidden: true, // 默认隐藏用户名和时长输入窗
				feedbackContent: '', // 用户反馈内容
				shadeStyleObject: {
					top: 0,
					bottom: 0,
					transform: '',
				}
			}
		},
		computed: {
		    ...mapState({
			   modeTpl: state => state.tpl
		    })
		},
		onLoad(option) {
			let _that = this
			 // this.rates = wx.getSystemInfoSync().windowWidth/1920
			 // 初始化数据加载
			this.$req({
				method:'GET',
				url:'/bank/app/h5/templates/'+option.id,
				data:{}
				})
			   .then(res2=>{
				  // 获取并设置模板宽度与小程序屏幕比例
				  if (res2.data.message.direction===0) {
					 this.rates = Math.floor(wx.getSystemInfoSync().windowWidth/res2.data.message.width  * 1000) / 1000    
				  } else {
					  this.rates = Math.floor(wx.getSystemInfoSync().windowWidth/res2.data.message.width  * 700) / 1000
				  }
				  this.height = res2.data.message.height // 获取模板宽度
				  this.width = res2.data.message.width // 模板宽度
				  this.base_url = res2.data.message.base_url // 地址
				  this.detaArr = JSON.parse(res2.data.message.dynamic) 
				  this.thumb_path = res2.data.message.thumb_path // 获取模板缩略图
				  this.Id = res2.data.message.id // 获取当前模板id
				  this.removeStatu = (option.type)?false:true // false 编辑内容，true为新建内容
				  if (!option.type) {
					  this.newBuilt().then(res=>{
						  this.contentId = res.message.id
						  this.name = res.message.name
					  })
				  } else{
					  this.contentId = option.type
					  this.seconds = this.modeTpl.seconds
					  this.name = this.modeTpl.name
					  if(this.modeTpl.tpl.dynamic) {
						  if(this.modeTpl.tpl.dynamic.images.constructor !== Array) {
							  this.tpl.dynamic.images = this.modeTpl.tpl.dynamic.images
							  this.updateList(this.modeTpl.tpl.dynamic.images,this.detaArr,1)
						  } 
						  if (this.modeTpl.tpl.dynamic.words.constructor !== Array) {
							  this.tpl.dynamic.words = this.modeTpl.tpl.dynamic.words
							  this.updateList(this.modeTpl.tpl.dynamic.words,this.detaArr,0)
						 }
					  }
				  }
			   })
			   .catch(error=>{
					console.log(error);
				})
		},
		onUnload: function () {//如果页面被卸载时被执行
			if (this.removeStatu) { // 不保存内容单离开页面的删除新建的内容单据
				api.deleteContentLists(this.contentId)
			}
		},
		methods: {
			...mapActions([ 'getContentLists']),
			...mapMutations(['ADD_CONTENT_LIST' , 'REMOVE_CONTENT_LIST', 'REVISE_CONTENT_LIST'
			]),
			// 图片修改剪切
			chooseImg(index,item){
				let _that = this
				this.imageW = item.width * this.rates
				this.imageH = item.height * this.rates
				this.indexData = index
				this.imgCropperShow = 0
				this.$refs.gmyImgCropper.getImage()
			},
			// 选中当前可编辑文字
			chooseText(index,item){
				this.indexData = index  // 获取当前点击的文字在detaArr中的键值对象
				this.editMode = true // 打开文本编辑区域
				this.saveStatus = !this.saveStatus  // 切换保存和确认按钮
				this.textValue = item.text
			},
			// 关闭文本编辑区域
			closeTextModeL:function() {
				this.editMode = false 
				this.setData(this.textValue,this.detaArr,0) // 回调改变文字图片的函数
				this.saveStatus = !this.saveStatus  // 切换保存和确认按钮
			},
			saveText(){
				this.closeTextModeL() // 关闭文本编辑区域
			},
			getImg(e){
				let Token =uni.getStorageSync('Token')
				wx.uploadFile({
					url: urlConfig+'/bank/app/h5/contents/uploading',
					filePath: e,
					name: 'image',
					header: {
					  'Authorization': 'Bearer'+ Token, //这是要token
					   'content-type': 'multipart/form-data'
					},
					formData: {
						'content_id': this.contentId,
						'image': e
					},
					success: (uploadFileRes) => {
						let url = JSON.parse(uploadFileRes.data).message.image_url
						this.setData(url,this.detaArr,1)
						this.imgCropperShow = false
						// console.log(this.tpl)
					}
				});
				
			},
			// 图片设置完之后回选到对应的dom上
			// e 为当前修改的数据 datas是当前的json数据对象 n为0的时候修改文字，为1的时候修改图片
			setData:function(e,datas,n){ 
				Object.keys(datas).forEach(item => {
					if (item == this.indexData && n===1) {
						datas[this.indexData].backgroundImage = e // 编辑后的图片显示在模板上
						this.tpl.dynamic.images[this.indexData] = e // 上传的图片保存到对象中
					} else if(item == this.indexData && n===0) {
						this.fontObj.content = e
						datas[this.indexData].text = e // 编辑后的文字回填到模板上
						this.tpl.dynamic.words[this.indexData] = JSON.stringify(this.fontObj) // 编辑的文字保存到对象中
					} else {
						if (datas[item].childData){
							this.setData(e,datas[item].childData,n)
						} 
					}
				})
			},
			// 初始化页面模板
			updateList: function(datas,arr,n){
				Object.keys(datas).forEach(item => {
					Object.keys(arr).forEach(list => {
						if (item == list && n===1) {
							arr[list].backgroundImage = datas[item] // 编辑后的图片显示在模板上
						}	else if(item == list && n===0) { // n=0时将文字填充到对象位置
							const strToObj = JSON.parse(datas[item]) // 将获取的文字json字符串转成对象 
							arr[list].text = strToObj.content // 编辑后的文字回填到模板上
						}  else {
							if (arr[list].childData){  // 如果当前对象有子集（childData）将继续循环查询
								this.updateList(datas,arr[list].childData,n)
							} 
						}
					})
				})
			},
			// 设置名称和时长
			save(){
				this.disAbledBtn = false
				this.userFeedbackHidden = false
			},
			closeFeedback() {
				this.disAbledBtn = true
				this.userFeedbackHidden = true
			},
			// 保存内容单
			submitFeedback() {
				if (this.seconds>65535) {
					uni.showToast({
						title: '最大时长65535',
						icon: 'none', 
						duration: 1000
					}) 	
				} else if(this.seconds =='') {
					uni.showToast({
						title: '时长不能为空',
						icon: 'none',  
						duration: 1000	})
				} else if(this.name==='') {
					uni.showToast({
						title: '名称不能为空',
						icon: 'none',  
						duration: 1000
					}) 
				}
				else{
					this.userFeedbackHidden = true
					this.disAbledBtn = false
					uni.showLoading({
					    title: '保存中...'
					 })
					// console.log(this.tpl)
					this.$req({
						method:'PUT',
						url:'/bank/app/h5/contents/'+this.contentId,
						data:{
							"name": this.name,
							"seconds": this.seconds,
							"tpl": this.tpl,
							}
						}).then(res=>{
							if(res.data.success) {
								uni.hideLoading()
								if (this.removeStatu) {
									
									this.ADD_CONTENT_LIST(res.data.message)
									this.removeStatu = false
									this.REVISE_CONTENT_LIST(res.data.message)
									// this.getContentLists({page: 0,pagesize:10})
								} else {
									// this.REVISE_CONTENT_LIST(res.data.message)
									 this.REMOVE_CONTENT_LIST()
									 this.getContentLists({page: 0,pagesize:10})
								}
								uni.showToast({
									title: '保存成功',
									duration: 1000
								}) 
								setTimeout(()=>{
									uni.switchTab({
										url: '/pages/modeList/index'
									})
								},1000)
								
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 1500
								}) 
							} 	
							this.disAbledBtn = true
					   })	
				}
			},	
			newBuilt:function() {
				let p = new Promise ((reslove,reject)=>{
					api.bliudContentLists(this.Id,this.thumb_path).then(res=>{
						   if(res.data.success){
							 reslove(res.data)
						   } else{
							  uni.showToast({
							      title: '保存失败',
								  image:'/static/Fail.png',
							      duration: 2000
							  }) 
						   }
					   }).catch(error=>{
							reject(error)
							console.log(error)
					})
				})
				return p
			},
			show:function(list){
				this[list].showCode();
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100vw;
		height: 100vh;
		position: relative;
		overflow: hidden;
		background: #000000;
	}
	.methodBox{
		overflow: hidden;
		padding: 25rpx;
	}
	.editText{
		position: absolute;
		width: 100%;
		height: 100%;
		background: #000000;
		opacity: 0.7;
		z-index: 2;
		padding: 20px 0px;
		text-align: center;
	}
	.toggleMaterial{
		position: absolute;
		bottom: 0px;
		background: rgb(50,50,50);
		width: 100%;
		text-align: center;
		z-index: 1;
	}
	.templateBox{
		position: absolute;
		top: 50%;
		left: 50%;
		overflow: hidden;
		background: #FFFFFF;
		transform: translate(-50%, -50%);
	}
	.imageschild{
		position: absolute;
	}
	.textchild{
		position: absolute;
	}
	.childBox{
		position: absolute;
	}
	.active .imageschild{
		    box-sizing: border-box;
			border:3px solid #007AFF;
		}
	.materialBtn{
		background-color: rgb(50,50,50);
	}
	.popup_overlay {
			position: fixed;
			top: 0%;
			left: 0%;
			width: 100%;
			height: 100%;
			background-color: black;
			z-index: 1001;
			-moz-opacity: 0.8;
			opacity: .80;
			filter: alpha(opacity=88);
		}
	 
		.popup_content {
			position: fixed;
			top: 50%;
			left: 50%;
			width: 520upx;
			height: 550upx;
			margin-left: -270upx;
			margin-top: -270upx;
			border: 10px solid white;
			background-color: white;
			z-index: 1002;
			overflow: auto;
			border-radius: 20upx;
		}
	 
		.popup_title {
			padding-top: 20upx;
			padding-bottom: 20upx;
			width: 480upx;
			text-align: center;
			font-size: 32upx;
		}
	 
		.popup_textarea_item {
			width: 440upx;
			background-color: #F1F1F1;
			margin: 0px auto;
			padding: 14upx;
			box-sizing: content-box;
		}
	 
		.uni-form-item {
			font-size: 26upx;
			margin-bottom: 15upx;
			.title{
				font-size: 28upx;
				padding: 10upx 0;
			}
			.uni-input{
				height: 65rpx;
				padding: 0rpx 40rpx;
				border-radius: 4px;
				font-size: 14px;
				border: 1px solid #000;
				color: #000;
			}
		}
	 
		.popup_button {
			color: white;
			background-color: #4399FC;
			border-radius: 20upx;
			font-size: 30upx;
			height: 70upx;
			line-height: 70upx;
			margin-bottom: 15upx;
		}
</style>
