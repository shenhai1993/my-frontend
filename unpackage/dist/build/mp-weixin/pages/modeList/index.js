(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/modeList/index"],{1263:function(t,e,i){"use strict";var n=i("942a"),a=i.n(n);a.a},"43de":function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=o(i("a259")),a=i("2f62");function o(t){return t&&t.__esModule?t:{default:t}}function s(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function r(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?s(Object(i),!0).forEach((function(e){c(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):s(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function c(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}var u=function(){i.e("pages/components/uni-grid/uni-grid").then(function(){return resolve(i("16d4"))}.bind(null,i)).catch(i.oe)},l=function(){i.e("pages/components/uni-grid-item/uni-grid-item").then(function(){return resolve(i("39ec"))}.bind(null,i)).catch(i.oe)},d=function(){i.e("pages/components/tabs/v-tabs").then(function(){return resolve(i("011a"))}.bind(null,i)).catch(i.oe)},h=function(){i.e("pages/components/imageList/index").then(function(){return resolve(i("a83b"))}.bind(null,i)).catch(i.oe)},f=function(){i.e("pages/components/actionSheet/index").then(function(){return resolve(i("59b8"))}.bind(null,i)).catch(i.oe)},g={data:function(){return{title:"Hello",array:[],current:0,isActive:1,pagesize:12,mPage:0,mPagesize:12,id:0,templateId:0,isLoadMore:!1,modeLoadMore:!1,direction:0,swiperheight:0,isDirection:0,toggleActive:!1,toggleDir:!1,loadTitle:"",isOpened:!1,menuArr:[{title:"编辑",type:0},{title:"删除",type:1}],industry:[{label:"餐饮",value:1},{label:"酒店",value:2},{label:"商场",value:3},{label:"美容美发",value:4},{label:"服饰服装",value:5},{label:"教育培训",value:6},{label:"医疗机构",value:7},{label:"房产机构",value:8},{label:"超市",value:9},{label:"金融",value:10},{label:"公司",value:11},{label:"旅游",value:12},{label:"通信",value:13},{label:"节日主题",value:14},{label:"案例展示",value:15},{label:"其他",value:16}]}},components:{uniGrid:u,uniGridItem:l,vTabs:d,imageList:h,actionSheet:f},onLoad:function(){var e=this;t.showLoading({title:"加载中"}),t.getSystemInfo({success:function(i){var n=i.windowHeight-t.upx2px(100);e.swiperheight=n}}),this.getDataList(0,1),0===this.contentArray.length&&this.getContentList()},computed:r(r({},(0,a.mapState)({contentArray:function(t){return t.contentLists},page:function(t){return t.page}})),{},{fiterFiles:function(){var t=this,e=[];return e=this.contentArray.filter((function(e){return e.direction===t.direction})),e}}),onShow:function(){t.showTabBar(),0===this.current&&this.renovateData()},onReachBottom:function(){this.isLoadMore||1!==this.current||(this.isLoadMore=!0,this.PUT_CONTENT_PAGE(2),this.getContentList()),this.modeLoadMore||0!==this.current||(this.modeLoadMore=!0,this.mPage+=1,this.getDataList(this.isDirection,this.isActive))},onPullDownRefresh:function(){this.getDataList(this.isDirection,this.isActive),this.PUT_CONTENT_PAGE(1),this.REMOVE_CONTENT_LIST(),this.getContentList()},methods:r(r(r({},(0,a.mapMutations)(["DELETE_CONTENT_LIST","PUT_CONTENT_PAGE","SET_MODE_TPL","SET_CONTENT_LIST","REMOVE_CONTENT_LIST"])),(0,a.mapActions)(["getContentLists"])),{},{changeTab:function(t){this.current=t,this.onCancelClick(),0===t&&this.renovateData()},onClickImages:function(e){t.navigateTo({url:"/pages/customMode/index?id="+e.id})},renovateData:function(){this.PUT_CONTENT_PAGE(1),this.REMOVE_CONTENT_LIST(),this.getContentList()},changeClass:function(t){this.array=[],this.isActive=t,this.mPage=0,this.getDataList(this.isDirection,this.isActive)},changeBtn:function(t){this.array=[],this.isDirection=t,this.toggleActive=!this.toggleActive,this.getDataList(this.isDirection,this.isActive)},toggleBtnList:function(t){this.direction=t,this.toggleDir=!this.toggleDir},getDataList:function(e,i){var n=this;this.$req({method:"GET",url:"/bank/app/h5/templates",data:{direction:e,industry:i,page:this.mPage}}).then((function(e){e.data.message.data?(t.hideLoading(),n.array=n.array.concat(e.data.message.data),e.data.message.data.length<n.mPagesize?n.modeLoadMore=!0:n.modeLoadMore=!1):n.modeLoadMore=!0})).catch((function(e){console.log(e),t.showToast({title:e,icon:"none"}),n.modeLoadMore=!1,n.mPage>1&&(n.mPage=1)}))},getContentList:function(){var e=this;this.getContentLists({page:this.page,pagesize:this.pagesize}).then((function(i){i.data.message.data?(t.stopPullDownRefresh(),i.data.message.data.length<e.pagesize?(e.isLoadMore=!0,e.loadTitle="没有更多了...",setTimeout((function(){e.loadTitle=""}),3e3)):e.isLoadMore=!1):e.isLoadMore=!0})).catch((function(i){t.showToast({title:i,icon:"none"}),e.isLoadMore=!1,e.page>1&&e.PUT_CONTENT_PAGE(3)}))},onCancelClick:function(){this.isOpened=!1,setTimeout((function(){t.showTabBar()}),380)},removeArr:function(e){t.hideTabBar(),this.SET_MODE_TPL(e),this.isOpened=!0,this.id=e.id,this.templateId=e.template_id},onhandClick:function(e){var i=this;switch(this.onCancelClick(),e){case 0:t.navigateTo({url:"/pages/customMode/index?id="+this.templateId+"&type="+this.id});break;case 1:t.showModal({title:"提示",content:"是否删除内容单",success:function(e){e.confirm?n.default.deleteContentLists(i.id).then((function(e){e.data.success?(i.DELETE_CONTENT_LIST(i.id),t.showToast({title:e.data.message,duration:1e3})):t.showToast({title:"无法删除",duration:1e3})})):e.cancel&&console.log("用户点击取消")}});break}}})};e.default=g}).call(this,i("543d")["default"])},"8e7b":function(t,e,i){"use strict";i.r(e);var n=i("d06c"),a=i("e823");for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);i("1263");var s,r=i("f0c5"),c=Object(r["a"])(a["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],s);e["default"]=c.exports},"942a":function(t,e,i){},a3a6:function(t,e,i){"use strict";(function(t){i("8a46");n(i("66fd"));var e=n(i("8e7b"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,i("543d")["createPage"])},d06c:function(t,e,i){"use strict";var n;i.d(e,"b",(function(){return a})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return n}));var a=function(){var t=this,e=t.$createElement;t._self._c},o=[]},e823:function(t,e,i){"use strict";i.r(e);var n=i("43de"),a=i.n(n);for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);e["default"]=a.a}},[["a3a6","common/runtime","common/vendor"]]]);