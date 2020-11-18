import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		page: 1, // 内容单分页编号
		contentLists: [],
		tpl: {}
	},
    mutations,
    actions
})
export default store
