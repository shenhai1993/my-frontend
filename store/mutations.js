'use strict'

import {
  SET_CONTENT_LIST, ADD_CONTENT_LIST, DELETE_CONTENT_LIST, REMOVE_CONTENT_LIST, 
  SET_MODE_TPL, PUT_CONTENT_PAGE
} from './mutation-types'

export default {
  [SET_CONTENT_LIST] (state, permissions) {
	permissions.forEach((item,index)=>{
		item.tpl.thumb_path = item.tpl.thumb_path+'?'+ new Date().getTime()
	})
	state.contentLists = state.contentLists.concat(permissions)
  },
  [DELETE_CONTENT_LIST] (state, id) {
	state.contentLists.forEach((item,index,array)=>{
		if(item.id == id){
		  array.splice(index,1)
		}  
	})
  },
  [REMOVE_CONTENT_LIST] (state) {
  	state.contentLists.length = 0
  },
  [ADD_CONTENT_LIST] (state, permissions) {
		state.contentLists = state.contentLists.concat(permissions)
		state.contentLists.sort((a,b)=>{ return b.id-a.id})
  },
  [SET_MODE_TPL] (state, tpl) {
	  state.tpl = tpl
  },
  [PUT_CONTENT_PAGE] (state, n) {
	  switch (n) {
	  	case 1:
			state.page = 1
	  	break 
		case 2:
			state.page+=1
		break 
		case 3:
			state.page-=1
		break 
	  }		
	  
  }
}
