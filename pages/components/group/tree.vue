<template>
	<view>
		<button size="mini" class="marginSm tagsBtn" v-for="(item,index) in groupArr" :key="index"
		  @click="choosely(index,item.id)"
		  :class="{activeAfter:chooseAfterValue.indexOf(item.id )!=-1}"
		  >{{item.name}}</button>
	</view>
</template>

<script>
	export default {
		props: {
			groupArr:{
				type: Array,
				default: []
			}
		},
		data() {
			return {
				chooseAfterValue: [],
			
			}
		},
		onLoad() {
			// console.log(groupArr)
		},
		methods: {
			choosely(n,value){
				if(this.chooseAfterValue.indexOf( value )!=-1){
					this.chooseAfterValue.splice( this.chooseAfterValue.indexOf( value ), 1 )
				}else{
					this.chooseAfterValue.push(value)
				}
				this.$emit('clickTags',this.chooseAfterValue)
			},
			clearChoosely() {
				this.chooseAfterValue = []
				this.$emit('clearChoosely')
			}
		}
	}
</script>

<style lang="scss">
	.marginSm{
		margin: 5upx 8upx}
	.tagsBtn{
		background-color: #FFFFFF;
	}		
	.tagsBtn.activeAfter{
		background: #007AFF;
		color: #FFFFFF;
	}
</style>
