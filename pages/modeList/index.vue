<template>
	<view class="content">
		<v-tabs v-model="current" :fixed="true" :scroll="false" height="90rpx" fontSize="30rpx"
			:tabs="['H5列表', '内容列表']" @change="changeTab"></v-tabs>
		<!-- 模板列表 -->
		<div class="wrap" :style="{height: swiperheight + 'px' }" v-show="current===0">
			<view class="left">
				<li class="navList" @click="changeClass(item.value)" v-for="(item,index) in industry" :key="index" :class="{active: isActive === item.value}">{{item.label}}</li>
			</view>
			<view class="right">
				<view>
					<button @click="changeBtn(0)" class="toggleBtn" :class="{active: !toggleActive}">横屏</button>
					<button @click="changeBtn(1)"  class="toggleBtn" :class="{active: toggleActive}">竖屏</button>
				</view>
				<imageList :dataList="array" @onClickImages="onClickImages"></imageList>
			</view>
		</div>
		<!-- 内容列表 -->
		<div class="wrap" :style="{height: swiperheight + 'px' }" v-if="current===1">
			<view class="right">
				<view>
					<button @click="toggleBtnList(0)" class="toggleBtn" :class="{active: !toggleDir}">横屏</button>
					<button @click="toggleBtnList(1)"  class="toggleBtn" :class="{active: toggleDir}">竖屏</button>
				</view>
				<imageList :dataList="fiterFiles" :types="false" @onClickImages="removeArr"></imageList>
				 <view class="loadmore-tips">{{loadTitle}}</view>
			</view>
		</div>
		<!-- 播出单操作区 -->
		<action-sheet :isOpened="isOpened" :menu="menuArr" @cancelClick="onCancelClick" @onhandClick="onhandClick">
		</action-sheet>
	</view>
</template>

<script>
	import api from "../../api/index.js"
	import uniGrid from "../components/uni-grid/uni-grid.vue"
	import uniGridItem from "../components/uni-grid-item/uni-grid-item.vue"
	import vTabs from "../components/tabs/v-tabs.vue"
	import imageList from "../components/imageList/index.vue"
	import actionSheet from "../components/actionSheet/index.vue"
	import {mapState, mapMutations, mapActions } from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				array: [],
				// contentArray: [],
				current: 0,
				isActive: 1,
				// page:1,
				pagesize:12,
				mPage: 0,
				mPagesize: 12,
				id: 0,
				templateId: 0,
				isLoadMore: false,
				modeLoadMore: false,
				direction: 0,
				swiperheight: 0,
				isDirection: 0,
				toggleActive: false,
				toggleDir: false,
				loadTitle: '',
				isOpened: false,
				menuArr: [
					{title: '编辑', type: 0},
					{title: '删除', type: 1}
				],
				industry: [
					{label:'餐饮', value:1},
					{label:'酒店', value:2},
					{label:'商场', value:3},
					{label:'美容美发', value:4},
					{label:'服饰服装', value:5},
					{label:'教育培训', value:6},
					{label:'医疗机构', value:7},
					{label:'房产机构', value:8},
					{label:'超市', value:9},
					{label:'金融', value:10},
					{label:'公司', value:11},
					{label:'旅游', value:12},
					{label:'通信', value:13},
					{label:'节日主题', value:14},
					{label:'案例展示', value:15},
					{label:'其他', value:16}
				]
			}
		},
		components: {uniGrid,uniGridItem,vTabs,imageList,actionSheet},  
		onLoad() {
			uni.showLoading({
			    title: '加载中'
			 })
			uni.getSystemInfo({
				success: (res)=> {
					// 减去头部tab高度
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
			this.getDataList(0,1) // 初始化模板列表
			if (this.contentArray.length===0) {
				this.getContentList() // 初始化内容列表
			}
		},
		computed: {
		    ...mapState({
			   contentArray: state => state.contentLists,
			   page: state => state.page
		    }),
			fiterFiles: function () {
			  let files = [];
			  files = this.contentArray.filter(file => file.direction === this.direction)
			  return files
			}
		},	  
		onShow: function () {
			uni.showTabBar()
			if (this.current===0) {
				this.renovateData()
			}
		},
		// 上拉触底函数
		onReachBottom(){
			 if(!this.isLoadMore && this.current===1){  //此处判断，上锁，防止重复请求
				this.isLoadMore=true
				this.PUT_CONTENT_PAGE(2)
				this.getContentList() // 获取内容列表
			  } 
			  if(!this.modeLoadMore && this.current===0) {
				 this.modeLoadMore=true
				 this.mPage+=1
				 this.getDataList(this.isDirection,this.isActive) // 获取模板列表 
			  }
		 },
		//  下拉刷新数据 
		onPullDownRefresh(){
			this.getDataList(this.isDirection,this.isActive) // 上拉刷新模板列表
			// this.page= 0			// 刷新时重置内容page
			this.PUT_CONTENT_PAGE(1)
			this.REMOVE_CONTENT_LIST()
			this.getContentList()  // 上拉刷新内容列表
		 },
		methods: {
			...mapMutations([ 'DELETE_CONTENT_LIST', 'PUT_CONTENT_PAGE', 
				'SET_MODE_TPL', 'SET_CONTENT_LIST', 'REMOVE_CONTENT_LIST'
			]),
			...mapActions([
			  'getContentLists'
			]),
			// 切换tabs
			changeTab(index) {
				 this.current = index
				 this.onCancelClick()
				 if(index===0) {
					this.renovateData()
				 }
			},
			// 选择生成内容单的模板
			onClickImages(item) {
				uni.navigateTo({
					url: '/pages/customMode/index?id='+item.id
				})
			},
			// 重新加载内容单
			renovateData: function(){
				this.PUT_CONTENT_PAGE(1)
				this.REMOVE_CONTENT_LIST()
				this.getContentList()  
			},
			/**
			 *  切换模板类型
			 * */
			changeClass(i) {
				this.array = []
				this.isActive = i
				this.mPage = 0
				this.getDataList(this.isDirection,this.isActive)
			},
			/**
			 *  切换横竖屏
			 * */
			changeBtn(num){
				this.array = []
				this.isDirection = num
				this.toggleActive = !this.toggleActive
				this.getDataList(this.isDirection,this.isActive)
			},
			toggleBtnList(n){
				this.direction = n
				this.toggleDir = !this.toggleDir
			},
			/**
			 *  查询模板列表
			 * */
			getDataList: function(d,n) {
				this.$req({
						method:'GET',
						url:'/bank/app/h5/templates',
						data:{
							"direction": d,
							"industry": n,
							"page": this.mPage,
						}
				}).then( res => {
					if(res.data.message.data){
						uni.hideLoading() 
						this.array = this.array.concat(res.data.message.data)
							if(res.data.message.data.length<this.mPagesize){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
								  this.modeLoadMore=true                                             
							}else{
								  this.modeLoadMore=false
							}
					  }else{
							this.modeLoadMore=true
					}
				}).catch( error => {
					console.log(error)
					uni.showToast({title:error,icon:'none'})
					this.modeLoadMore=false
					if(this.mPage>1){
						this.mPage=1
					}
				})
			},
			// 获取内容列表
			getContentList: function(){
				this.getContentLists({page: this.page,pagesize:this.pagesize})
				.then(res =>{
					if(res.data.message.data){
						uni.stopPullDownRefresh()
						if(res.data.message.data.length<this.pagesize){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
							  this.isLoadMore=true      
							  this.loadTitle = '没有更多了...'
							  setTimeout(()=>{
									this.loadTitle = ''
							  },3000)		
						}else{
							  this.isLoadMore=false
						}
					  }else{
						this.isLoadMore=true  
					}
				}).catch( error => {
					uni.showToast({title:error,icon:'none'})
					this.isLoadMore=false
					if(this.page>1){
						// this.page-=1
						this.PUT_CONTENT_PAGE(3)
					}
				})
			},
			// 关闭底部操作栏
			onCancelClick: function(){
				this.isOpened = false
				setTimeout(()=>{
					uni.showTabBar()	
				},380)
				
			},
			// 删除内容模板
			removeArr: function(item) {
				uni.hideTabBar()
				this.SET_MODE_TPL(item)
				// uni.setStorageSync('tpl',item)
				this.isOpened = true
				this.id = item.id
				this.templateId = item.template_id
			},
			// 底部菜单操作
			onhandClick(n){
				let _that = this
				this.onCancelClick()
				switch (n) {
					case 0:
						uni.navigateTo({
							url: '/pages/customMode/index?id='+this.templateId+'&type='+this.id
						})
						break
					case 1:
						uni.showModal({
							title: '提示',
							content: '是否删除内容单',
							success: function (ret) {
								if (ret.confirm) {
									api.deleteContentLists(_that.id).then(res=>{
										if(res.data.success){
											_that.DELETE_CONTENT_LIST(_that.id)
											uni.showToast({
											    title: res.data.message,
											    duration: 1000
											})
										} else {
											uni.showToast({
											    title: "无法删除",
											    duration: 1000
											})
										}
									})
								} else if (ret.cancel) {
									console.log('用户点击取消')
								}
							}
						})
						break
				}	
			},	
		}
	}
</script>

<style lang="scss">
	.wrap{
		width: 100vw;
		display: flex;
		.left{
			width: 115px;
			overflow-x: hidden;
			overflow-y: auto;
			background: rgb(248,250,252);
			.navList{
				padding: 18rpx 20rpx;
				font-size: 26rpx;
				color: rgb(120,124,129);
				font-weight: 200;
			}
			.navList.active{
				position: relative;
				background: #FFFFFF;
				color: #000000;
				font-weight: 600;
			}
			.active:after{
				content: '';
				display: block;
				width: 2px;
				height: 20px;
				background: rgb(34,84,244);
				position: absolute;
				left: 0px;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.right{
			width: 100%;
			padding: 10rpx;
			.toggleBtn{
				margin:10rpx 15rpx;
				font-size: 26rpx;
				line-height: 40rpx;
				border-width: 0px;
				color: rgb(120,124,129);
				display: inline-block;
				background: rgb(210,213,214);
			}
			button.toggleBtn:after{
				border-width:0px ;
				border-radius: 2px;
			}
			button.toggleBtn.active{
				color: #fff;
				background: #005cf9;
				// color: rgb(0,92,249);
			}
		}
	}
	.thumbnail-Img{
		width: 100%;
		background-color: #eeeeee;
		border-radius: 5rpx;
	}
	.image-list{
		overflow: hidden;
		margin:5rpx 10rpx;
	}
	.navTab{
		display: inline-block;
	}
	.loadmore-tips{
		text-align: center;
		padding: 15rpx;
		font-size: 30rpx;
	}
</style>
