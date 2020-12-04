'use strict'

import {
  SET_CONTENT_LIST, ADD_CONTENT_LIST
} from './mutation-types.js'
import http from '../request.js'

export default {
  async getContentLists({ commit, state }, {page,pagesize,d}) {
	// type存在的时候查询添加单条数据  
    let res = null
    try {
  	res = await http({
  		method: 'GET',
  		url: '/bank/app/contents',
  		data:{
  			"page": page,
  			"per_page": pagesize,
			"d": d
  		}
  	})   
    } catch (e) {
  	  console.log(e)
    }
	if (res) {
		commit(SET_CONTENT_LIST, res.data.message.data)
		// if (type) {
		// 	 commit(ADD_CONTENT_LIST, res.data.message.data[0])
		// }
	}
    return res
  }
}
