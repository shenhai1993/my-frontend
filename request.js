import urlConfig from './common/config.js'
let baseURL= urlConfig
function req(options){
	let headers={}
	var Token =uni.getStorageSync('Token');
	headers['Authorization'] ='Bearer'+ Token;
	return new Promise((res,rej)=>{
		uni.request({
			url:baseURL + options.url,
			method:options.method || 'GET',
			data: options.data,
			header:headers,
			success(data) {
				if(data.statusCode===422 || data.statusCode===401){
					uni.navigateTo({
						url: '../../pages/login/index'
					})
				}
				res(data)
			},
			fail(e) {
				uni.navigateTo({
					url: '../../pages/login/index'
				})
				rej(e)
			}
		})
	})
	
}
export default req