<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
	// global.isLogin = function(){
	//  try{
	// 	 var name = uni.getStorageSync('name')
	//  } catch (e) {
	//   //TODO handle the exception
	//  }
	//  if(name == '') {
	//   return false;
	//  } else {
	//   return [name]
	//  }}
	// var res = global.isLogin();
	//   if(!res){
	//    uni.showModal({
	//     title:'请登录',
	//     content:"请登录",
	//     success:function(){
	//      uni.navigateTo({
	//       url:"/pages/login/index"
	//      })
	//     }
	//    })
	//   }
</script>

<style>
	/*每个页面公共css */
</style>
