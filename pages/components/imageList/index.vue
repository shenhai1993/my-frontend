<template>
	<uni-grid :column="2" :show-border="ture"  :square="false">
		<uni-grid-item v-for="(item,index) in dataList" :key="index">
			<view class="imageWrap"  @click="clickImages(item)">
				<view class="createItem" v-if="types">
					<image class="thumbnail-Img" mode="widthFix" 
						@error="imageError"
						:src="item.thumb_path"></image>
				</view>
				<view class="createItem" v-else="!types">
					<image class="thumbnail-Img" mode="widthFix" 
						@error="imageError"
						:src="item.tpl.thumb_path"></image>
				</view>
			</view>
		</uni-grid-item>
	</uni-grid>		 
</template>

<script>
	import uniGrid from "../uni-grid/uni-grid.vue"
	import uniGridItem from "../uni-grid-item/uni-grid-item.vue"
	export default {
		components: {uniGrid,uniGridItem},
		props: {
			dataList: {
				type: Array,
				default: []	
			},
			types: {
				type: Boolean,
				default: true
			},
			
		},
		data() {
			return {
			}
		},
		methods: {
			imageError: function(e) {
				this.$emit('onImageError')
				console.error('image发生error事件，携带值为' + e.detail.errMsg)
			},
			cancel() {
			  this.$emit('cancelClick')
			},
			clickImages(item) {
				this.$emit('onClickImages', item)
			},
			handClick(item) {
				this.$emit('onhandClick', item.type)
			}
		}
	}
</script>
<style lang="scss">
	.thumbnail-Img{
		width: 100%;
		background-color: #eeeeee;
		border-radius: 5rpx;
	}
	.createItem{
		padding:6rpx 10rpx;
	}
</style>