import http from '../request.js'
const api = {
	// 新建内容单
	async bliudContentLists(id,path) {
		let res = null
		try {
			res = await http({
				method:'POST',
				url:'/bank/app/h5/contents',
				data:{
					"template_id": id,
					"tpl": {"thumb_path": path}
				}
			})   
		} catch (e) {
			console.log(e)
		}
		return res
	},
	// 获取内容列表 	
	async getContentLists(method,data) {
	  let res = null
	  try {
		res = await http({
			method: method,
			url: '/bank/app/contents',
			data:{
				"page": data[0],
				"per_page": data[1]
			}
		})   
	  } catch (e) {
		  console.log(e)
	  }
	  return res
	},
	// 删除内容单
	async deleteContentLists (id) {
	    let res = http({
				method: 'DELETE',
				url: '/bank/app/h5/contents/'+id,
				data:{
				}
			})   
	    return res
	},
	// 获取终端列表 		
	async getTerminalsList(method,src) {
	  let res = null
	  try {
		res = await http({
			method: method,
			url: src,
			data:{}
		})   
	  } catch (e) {
		  console.log(e)
	  }
	  return res
	},
	// 获取终端详情
	async getTerminalsItem(method,src) {
		  let res = null
		  try {
			res = await http({
				method: method,
				url: src,
				data:{}
			})   
		  } catch (e) {
			  console.log(e)
		  }
		  return res
	},
	// 获取标签列表
	async getTags() {
		  let res = null
		  try {
			res = await http({
				method: 'GET',
				url: '/bank/app/terminals/tags',
				data:{}
			})   
		  } catch (e) {
			  console.log(e)
		  }
		  return res
	},
	// 获取分组列表	
	async getTrees() {
		  let res = null
		  try {
			res = await http({
				method: 'GET',
				url: '/bank/app/trees',
				data:{}
			})   
		  } catch (e) {
			  console.log(e)
		  }
		  return res
	},
	// 保存播出单	
	async savePlayList(data) {
		  let res = null
		  try {
			res = await http({
				method: 'POST',
				url: '/bank/app/playlists',
				data:{
					"id": data.id,
					"type": data.type,
					"name": data.name,
					"contents": data.contents,
					"trees": data.trees,
					"tags": data.tags,
					"direction": data.direction,
					"publish": data.publish,
					"etype": data.etype,
					"schedule": data.schedule
				}
			})   
		  } catch (e) {
			  console.log(e)
		  } 
		  return res 
	},
	// 发布播出单
	async publishPlayList (id) {
	    let res = http({
				method: 'GET',
				url: '/bank/app/playlists/publish/'+id,
				data:{}
			})   
	    return res
	},
	// 删除播出单
	async deletePlayList (id, groupId) {
	    let res = http({
				method: 'DELETE',
				url: '/bank/app/playlists/'+id,
				data:{
					group_id: groupId
				}
			})   
	    return res
	},
	// 停止播出单
	async stopPlayList (id, groupId) {
	    let res = http({
				method: 'GET',
				url: '/bank/app/playlists/stop/'+id,
				data:{
				}
			})   
	    return res
	}
}

module.exports = api