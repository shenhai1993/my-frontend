<template>
	<view class="content">
		<div class="wrap">
			<view class="right">
				<uni-grid :column="2" :show-border="ture"  :square="false">
					<uni-grid-item>
						<view class="imageWrap"  @click="createPlay">
							<view class="createItem text-align">
								<image src="../../static/add.png" style="height: 24px;width: 24px;"></image>
								<p>创建播出单</p>
							</view>
						</view>
					</uni-grid-item>
					<uni-grid-item v-for="(item,index) in array" :key="index">
						<view class="imageWrap"  @click="operate(item,index)">
							<view class="title">{{item.name}}</view>
							<view class="time">{{item.created_at}}</view>
							<view class="createItem playTab">
								<p>状态: 
									<font v-if="item.status===0" class="pl-15">可使用</font>
									<font v-if="item.status===3"  class="pl-15">已发布</font>
								</p>
								<p>方向: 
									<font v-if="item.direction===0"  class="pl-15">横屏</font>
									<font v-else  class="pl-15">竖屏</font>
								</p>
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</div>
		<!-- 抽屉选择生成播出单 -->
		<drawer :classname="'active'" ref="drawer" v-on:onHide="onHideDrawer">
			<view class="btnWrap">
				<button class="defaultBtn" type="default" v-show="direction===1 && playStatus===0"  @click="toggleDirection(0)" size="mini">选择横屏</button>
				<button class="defaultBtn" type="default" v-show="direction===0 && playStatus===0" @click="toggleDirection(1)" size="mini">选择竖屏</button>
				<button class="defaultBtn" type="default" v-show="playStatus !==0"  @click="previous" size="mini">上一步</button>
				<button class="defaultBtn"  @click="next" type="default" size="mini"  v-show="playStatus !==2 && nextBtn">下一步</button>
				<button class="defaultBtn" v-show="saveNext" type="default" @click="formSubmit" size="mini">保存</button>
			</view>
			<!-- 内容单 -->
			<view v-show="playStatus===0">
				<scroll-view  style='height: 630px;' 
				    :scroll-y="true" 
				    :scroll-top="scrollTop"
				     @scrolltolower="scrollFn">  
					 <view class="drawerList">
						<view class="itemList" v-for="(item,index) in fiterFiles" :key="index"  @click="choosely(index,item.id)">
							<view class="selectMode" :class="{activeAfter:chooseAfterValue.indexOf( item.id )!=-1}"></view>
							<image class="thumbnail-Img" mode="widthFix" :src="item.tpl.thumb_path"
							></image>
						</view>
						<view class="loadmore-tips" v-show="fiterFiles.length<1">{{loadTitle}}</view>
					</view>
				</scroll-view>	
			</view>	
			<!-- 选择标签和分组 -->
			<view v-show="playStatus===1">
				<!-- <p class="label">请选择标签</p>
				<view class="wrapBtns">
					<tags @clickTags:groupArr="tagsArr" ="onClickTags" ref="tagsDom"></tags>
				</view> -->
				<p class="label">请选择群组</p>
				<tki-tree ref="tkitree" :selectParent="true" :range="treeArr" :defaultActive="defaultActive" @confirm="confirmData" :multiple="true" rangeKey="name" confirmColor="#4e8af7">
				</tki-tree>
			</view>
			<!-- 播出单表单 -->
			<view v-if="playStatus===2">
				<view class="formWrap">
					<form @submit="formSubmit" @reset="formReset">
						<view class="blank30"></view>
						<view class="uni-form-item uni-column">
							<text class="tit" maxlength="15">输入名称：</text>
							<view class="uni-form-item__content">
								<input class="input" type="text" v-model="formData.name" placeholder="请输入" placeholder-class="placeholder" />
							</view>
						</view>
						<view class="uni-form-item uni-column">
							<text class="tit">开始时间：</text>
							<picker mode="time" class="uni-form-item__content" :value="timeStart" :start="timeStart" :end="timeOther" @change="bindTimeChange($event,'0')">
							     <view class="uni-input">{{timeStart}}</view>
							</picker>
						</view>  
						<view class="uni-form-item uni-column">
							<text class="tit">结束时间：</text>
							<picker mode="time"  class="uni-form-item__content" :value="timeStart" :start="timeStart" @change="bindTimeChange($event,'1')">
							     <view class="uni-input">{{timeOther}}</view>
							</picker>
						</view>
						<view class="uni-form-item uni-column">
							<text class="tit">开始日期：</text>
							<picker mode="date" class="uni-form-item__content" :value="dateStart" :start="dateStart" :end="endDate" @change="bindDateChange($event,'0')">
							    <view class="uni-input">{{dateStart}}</view>
							</picker>
						</view>
						<view class="uni-form-item uni-column">
							<text class="tit">结束日期：</text>
							<picker mode="date" class="uni-form-item__content" :value="dateStart" :start="dateStart"  @change="bindDateChange($event,'1')">
							    <view class="uni-input">{{endDate}}</view>
							</picker>
						</view>
						<view class="blank30"></view>
					</form>
				</view>	
			</view>
		</drawer>
		<!-- 播出单操作区 -->
		<action-sheet :isOpened="isOpened" :menu="menuArr" @cancelClick="onCancelClick" @onhandClick="onhandClick">
		</action-sheet>
	</view>
</template>

<script>
	import api from "../../api/index.js"
	import uniGrid from "../components/uni-grid/uni-grid.vue"
	import uniGridItem from "../components/uni-grid-item/uni-grid-item.vue"
	import drawer from "../components/drawer/index.vue"
	import tags from "../components/group/tags.vue"
	import tree from "../components/group/tree.vue"
	import tkiTree from "../components/tki-tree/tki-tree.vue"
	import actionSheet from "../components/actionSheet/index.vue"
	import { mapState, mapActions, mapMutations } from 'vuex'
	export default {
		components: {uniGrid,uniGridItem,drawer,tags,tree,actionSheet,tkiTree},
		data() {
			const currentDate = this.getDate({
			    format: true
			})
			return {
				scrollTop: 50, 
				isLoadMore: false,
				loadTitle: '没有数据了',
				title: '播出单',
				array: [], // 播出单列表
				tagsArr: [], // 标签集合
				treeArr: [], // 分组标签
				tags: [], // 选中的标签
				tree: [], // 选中的分组
				// page:1,
				iconType: ['success'],
				playStatus: 0, // 新建播出单弹窗
				nextBtn: false,
				swiperheight: 0,
				pagesize: 12,
				groupId: 0, 
				id: 0, // 播出单Id
				index: 0,
				chooseAfterValue: [],
				formData:{
					name: '',
					schedule: {
					  date: {
						start: '',
						end: ''
					  },
					  time: {
						start: '',
						end: ''
					  }
					},
					etype: 0, // 默认暂不允许修改主播扩展属性
					type: 0, // 默认暂不允许修改播出单类型
				},
				defaultActive: [],
				direction: 0,
				timeStart: '00:00',
				timeEnd: '09:00',
				timeOther: '请选择时间',
				endDate:  '请选择日期',
				selectData: {},
				dateStart: currentDate,
				dateEnd: currentDate,
				isLoadMore:false,  //是否加载中
				isOpened: false,
				menuArr: [
					{title: '发布', type: 0},
					{title: '停止', type: 1},
					{title: '编辑', type: 3},
					{title: '删除', type: 2}
				],
			}
		},
		onLoad() {
			uni.showLoading({ title: '加载中' })
			this.getDataLists() // 获取播出单列表
			if (this.dataList.length===0) {
				this.getContentList()
			}
			// 获取标签列表
			api.getTags().then(res=>{
				this.tagsArr = res.data.message
			})
			// 获取分组
			api.getTrees().then(res=>{
				this.treeArr = [res.data.message]
				// this.seqencingData(res.data.message)
			})
		},
		onPullDownRefresh(){
			this.array= []
		 	this.getDataLists()
		  },
		watch: {
		  chooseAfterValue(n){
			this.nextBtn = (n.length>0)?true:false  
		  },	
		  tree(n){
			  this.nextBtn = (n.length>0)?true:false
		  }
		},  
	   computed: {
			  ...mapState({
				 dataList: state => state.contentLists,
				 page: state => state.page
			  }),
			  fiterFiles: function () {
			    let files = [];
			    files = this.dataList.filter(file => file.direction === this.direction)
			    return files
			  },
			  saveNext () {
				  let ret = true
				  if (this.chooseAfterValue.length===0) {
					  ret = false
				  }
				  if (this.tree.length===0 && this.tags.length===0) {
					  ret = false
				  }
				  if (this.formData.name==='') {
					 ret = false 
				  }
				  return ret
			  }
		},
		methods: {
			...mapMutations([ 'SET_CONTENT_LIST', 'PUT_CONTENT_PAGE'
			]),
			...mapActions([
			  'getContentLists'
			]),
			scrollFn(e) { 
				if(!this.isLoadMore || this.page===1){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.PUT_CONTENT_PAGE(2)
					// this.page+=1
					this.getContentList() // 获取内容列表
				 } 
			  // 防抖，优化性能
			  },
			choosely(n,value){
				if(this.chooseAfterValue.indexOf( value )!=-1){
					this.chooseAfterValue.splice( this.chooseAfterValue.indexOf( value ), 1 )
				}else{
					this.chooseAfterValue.push(value)
				}
			 },
			 // 序列化分组数据
			 seqencingData: function(data){
				 let obj = new Object()
				 Object.keys(data).forEach((item)=>{
					obj[item] = data[item]
				 })
				 if(data.children !==undefined){
					 this.seqencingData(data.children)
				 }
				 this.treeArr.push(obj)
			 },
			/**
			 *  播出单列表查询
			 * */
			getDataLists: function() {
				this.groupId = uni.getStorageSync('group_id')
				this.$req({
						method:'GET',
						url:'/bank/app/playlists',
						data:{
							"group_id": this.groupId // 从缓存中取出group_id
						}
				}).then( res => {
					uni.stopPullDownRefresh()
					uni.hideLoading() 
					this.array = res.data.message
				}).catch( error => {
					console.log(error)
				})
			},
			// 获取选中的标签数据
			onClickTags(data){
				this.tags = data 
			},
			// 创建播出单
			createPlay: function(){ 
				this.id = 0
				uni.hideTabBar()
				this.$refs.drawer.open()
				this.$refs.tkitree._reTreeList()
			},
			// 获取内容列表
			getContentList: function(){
				this.getContentLists({page: this.page,pagesize:this.pagesize})
				.then(res =>{
					if(res.data.message.data){
						// this.SET_CONTENT_LIST(res.data.message.data)
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
						this.PUT_CONTENT_PAGE(3)
						// this.page-=1
					}
				})
			},
			toggleDirection(d){
				this.chooseAfterValue = []
				this.direction = d
			},
			onHideDrawer: function(){
				let curDate = this.getDate({
				    format: true
				})
				this.playStatus = 0
				this.tree = []
				this.formData.name = ''
				this.chooseAfterValue = []
				this.defaultActive = []
				this.timeOther = '请选择时间'
				this.endDate = '请选择日期'
				this.dateStart = curDate
				this.dateEnd = curDate
			},
			// 设置播出单时间段
			bindTimeChange: function(e,n) {
				if (n==='0') { // n等于0时为开始时间 否则为结束时间
					this.timeStart = e.target.value
				} else{
					this.timeEnd = e.target.value
					this.timeOther = this.timeEnd
					this.setData({
					  timeOther: this.timeEnd
					})
				}
			},
			bindDateChange: function(e,n) {
				if (n==='0') { // n等于0时为开始日期 否则为结束日期
					this.dateStart = e.target.value
				} else{
					this.dateEnd = e.target.value
					this.endDate = this.dateEnd
				}
			},
			// 保存为播出单
			formSubmit: function(e) {
				let data = this._setSvaeDate()	// 设置要保存的数据
				api.savePlayList(data).then(res=>{
					if(res.data.success){
						uni.showToast({
							title: '保存成功',
							duration: 1200
						})
						this.getDataLists()
						this.$refs.drawer.hide()
						this.onHideDrawer()
						// this.playStatus = 0
					}else {
						uni.showToast({
							title: res.data.message,
							icon: "none",
							duration: 1200
						})
					}	
				})
			},
			confirmData(val){
				this.tree = val
			},
			// 设置播出单需要提交的数据
			_setSvaeDate: function() {
				let data = this.formData
				data.id = this.id
				data.contents = this.chooseAfterValue
				data.trees = this.tree
				data.tags = this.tags
				data.direction = this.direction
				data.publish = 0
				data.schedule.time.start = this.timeStart
				data.schedule.time.end = this.timeEnd
				data.schedule.date.start = this.dateStart
				data.schedule.date.end = this.dateEnd
				return data
			},
			// 打开底部操作栏
			operate(item,i){
				uni.hideTabBar()
				this.id = item.id
				this.selectData = item
				this.index = i
				this.isOpened = true
			},
			saveStu() {
			  let ret = false
			  return ret
			},
			previous() {
				if (this.playStatus>0) {
					this.playStatus--
				}
			},
			next() {
				if (this.tree.length===0){
					this.nextBtn = false
				}
				if (this.playStatus<2) {
					this.playStatus++
				}	
			},
			// 关闭底部操作栏
			onCancelClick: function(){
				this.isOpened = false
				setTimeout(()=>{
					uni.showTabBar()	
				},380)
				
			},
			// 底部菜单操作
			onhandClick(n){
				let _that = this
				switch (n) {
					case 0: // 发布播出单
						api.publishPlayList(this.id).then(res =>{
							this.onCallback(res)
							this.array[this.index].status = 3
						})
						break
					case 1:
						api.stopPlayList(this.id).then(res =>{
							this.onCallback(res)
							this.array[this.index].status = 0
						})
						break
					case 2: // 播出单
						uni.showModal({
							title: '提示',
							content: '是否删除播出单',
							success: function (ret) {
								if (ret.confirm) {
									api.deletePlayList(_that.id,_that.groupId).then(res =>{
										if(res.data.success){
											_that.array = _that.array.filter(item => item.id !== _that.id)
										}
										_that.onCallback(res)
									})
								} else if (ret.cancel) {
									_that.onCancelClick()
								}
							}
						})
						break
					case 3:
						// 编辑播出单
						this.isOpened = false
						this.$refs.drawer.open()
						this.selectData.trees.forEach((item,i)=>{
							this.defaultActive.push(item.id)
							this.tree.push(item.id) 
						})
						this.chooseAfterValue = this.selectData.contents
						this.formData.name = this.selectData.name
						this.timeStart = this.selectData.schedule.time.start
						this.timeOther = this.selectData.schedule.time.end
						this.dateStart = this.selectData.schedule.date.start
						this.endDate = this.selectData.schedule.date.end
						break	
				}	
			},
			onCallback: function(res){
				if(res.data.success){
					this.isOpened = false
					uni.showToast({
					    title: res.data.message,
					    duration: 1000
					})
				} else {
					this.isOpened = false
					uni.showToast({
					    title: '请求失败',
						image:'/static/Fail.png',
					    duration: 1200
					})
				}
				uni.showTabBar()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
			
		}
	}
</script>

<style lang="scss">
	.wrap{
		width: 100vw;
		height: 100vh;
		padding: 15upx;
		box-sizing: border-box;
		.imageWrap{
			height: 280rpx;
			background: -webkit-gradient(linear, right top, left bottom,
			 color-stop(0%, rgb(28,187,180)), color-stop(100%,rgb(111,87,180)));
			box-shadow: $uni-box-shadow;
			border-radius: 10upx;
			margin: 8px;
			.title {
				text-align: center;
				padding-top: 15rpx;
				color: #FFFFFF;
			}
			.time{
				position: absolute;
				bottom: 40rpx;
				right: 35rpx;
				font-size: 28rpx;
				color: #FFFFFF;
			}
			.playTab{
				line-height: 56rpx;
				font-size: 34rpx;
				._font{
					padding-left: 20rpx;
				}
			}
		}
		.right{
			width: 100%;
			height: 95%;
			overflow-y: auto;
			.toggleBtn{
				margin:10rpx 15rpx;
				font-size: 26rpx;
				line-height: 40rpx;
				border-width: 0px;
				color: rgb(120,124,129);
				display: inline-block;
				background: rgb(240,243,244);
			}
			button.toggleBtn:after{
				border-width:0px ;
				border-radius: 2px;
			}
			button.toggleBtn.active{
				color: rgb(0,92,249);
			}
		}
	}
	.loadmore-tips{
		display: block;
		width: 100%;
		text-align: center;
		padding: 15rpx;
		font-size: 30rpx;
	}
	.createItem{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		color: #FFFFFF;
		width: 140px;
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
	.drawerList{
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		box-sizing: border-box;
		padding: 7.5px;
		.itemList{
			position: relative;
			flex: 0 0 50%;
			padding: 7.5px;
			overflow: hidden;
			box-sizing: border-box;
		}
	}
	.btnWrap{
		position:absolute;
		right: 10px;
		top: 10px;
		.defaultBtn{
			background:#007AFF;
			color: #FFFFFF;
			margin-left: 10upx;
		}
	}
	.selectMode{
		width: 25px;
		height: 25px;
		border: 2px solid #FFFFFF;
		border-radius: 50%;
		position: absolute;
		background: rgba(0,0,0,0);
		top: 20px;
		right: 20px;
	}
	.selectMode.activeAfter{
		background: url(../../static/select.png);
		background-size: 100% 100%;
	}
	.label{
		font-weight: bold;
		color: #000000;
		font-size: 40upx;
		padding: 30upx 15upx;
	}
	.wrapBtns{
		background: $uni-bg-color-grey;
		padding: 20upx 15upx;
	}
	.formWrap{
		background: $uni-bg-color-grey;
		.uni-form-item{
			background: #FFFFFF;
			line-height: 100upx;
			overflow: hidden;
			border-bottom: 1upx solid rgba(0,0,0,0.2);
			.tit{
				width: 120px;
				text-align: right;
				vertical-align: middle;
				float: left;
				font-size: 16px;
				color: #000000;
				line-height: 100upx;
				padding: 0 12px 0 0;
				box-sizing: border-box;
			}
			.uni-form-item__content{
				margin-left: 120px;
				line-height: 100upx;
				position: relative;
				font-size: 16px;
				color: rgb(85,85,85);
				.input{
					line-height: 100upx;
					height: 100upx;
					font-size: 14px;
					width: 100%;
				}
			}
		}
	}
	.pl-15{padding-left: 15rpx;}
</style>
