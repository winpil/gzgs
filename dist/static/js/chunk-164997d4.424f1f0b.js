(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-164997d4"],{"0f58":function(e,t,s){"use strict";var a=s("868a"),i=s.n(a);i.a},"133c":function(e,t,s){"use strict";var a=s("7c25"),i=s.n(a);i.a},"348a":function(e,t,s){"use strict";var a=s("84e9"),i=s.n(a);i.a},"7c25":function(e,t,s){},"84e9":function(e,t,s){},"868a":function(e,t,s){},ecac:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"app-container"},[e.user?s("div",[s("el-row",{attrs:{gutter:20}},[s("el-col",{attrs:{span:6,xs:24}},[s("user-card",{attrs:{user:e.user}})],1),s("el-col",{attrs:{span:18,xs:24}},[s("el-card",[s("el-tabs",{model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[s("el-tab-pane",{attrs:{label:"Activity",name:"activity"}},[s("activity")],1),s("el-tab-pane",{attrs:{label:"Timeline",name:"timeline"}},[s("timeline")],1),s("el-tab-pane",{attrs:{label:"Account",name:"account"}},[s("account",{attrs:{user:e.user}})],1)],1)],1)],1)],1)],1):e._e()])},i=[],r=(s("a15b"),s("b0c0"),s("5530")),l=s("2f62"),n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-card",{staticStyle:{"margin-bottom":"20px"}},[s("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[s("span",[e._v("About me")])]),s("div",{staticClass:"user-profile"},[s("div",{staticClass:"box-center"},[s("pan-thumb",{attrs:{image:e.user.avatar,height:"100px",width:"100px",hoverable:!1}},[s("div",[e._v("Hello")]),e._v(" "+e._s(e.user.role)+" ")])],1),s("div",{staticClass:"box-center"},[s("div",{staticClass:"user-name text-center"},[e._v(e._s(e.user.name))]),s("div",{staticClass:"user-role text-center text-muted"},[e._v(e._s(e._f("uppercaseFirst")(e.user.role)))])])]),s("div",{staticClass:"user-bio"},[s("div",{staticClass:"user-education user-bio-section"},[s("div",{staticClass:"user-bio-section-header"},[s("svg-icon",{attrs:{"icon-class":"education"}}),s("span",[e._v("Education")])],1),s("div",{staticClass:"user-bio-section-body"},[s("div",{staticClass:"text-muted"},[e._v(" JS in Computer Science from the University of Technology ")])])]),s("div",{staticClass:"user-skills user-bio-section"},[s("div",{staticClass:"user-bio-section-header"},[s("svg-icon",{attrs:{"icon-class":"skill"}}),s("span",[e._v("Skills")])],1),s("div",{staticClass:"user-bio-section-body"},[s("div",{staticClass:"progress-item"},[s("span",[e._v("Vue")]),s("el-progress",{attrs:{percentage:70}})],1),s("div",{staticClass:"progress-item"},[s("span",[e._v("JavaScript")]),s("el-progress",{attrs:{percentage:18}})],1),s("div",{staticClass:"progress-item"},[s("span",[e._v("Css")]),s("el-progress",{attrs:{percentage:12}})],1),s("div",{staticClass:"progress-item"},[s("span",[e._v("ESLint")]),s("el-progress",{attrs:{percentage:100,status:"success"}})],1)])])])])},c=[],o=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"pan-item",style:{zIndex:e.zIndex,height:e.height,width:e.width}},[s("div",{staticClass:"pan-info"},[s("div",{staticClass:"pan-info-roles-container"},[e._t("default")],2)]),s("div",{staticClass:"pan-thumb",style:{backgroundImage:"url("+e.image+")"}})])},u=[],m=(s("a9e3"),{name:"PanThumb",props:{image:{type:String,required:!0},zIndex:{type:Number,default:1},width:{type:String,default:"150px"},height:{type:String,default:"150px"}}}),p=m,d=(s("133c"),s("2877")),v=Object(d["a"])(p,o,u,!1,null,"799537af",null),f=v.exports,h={components:{PanThumb:f},props:{user:{type:Object,default:function(){return{name:"",email:"",avatar:"",role:""}}}}},b=h,g=(s("348a"),Object(d["a"])(b,n,c,!1,null,"14daffcb",null)),C=g.exports,_=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"user-activity"},[s("div",{staticClass:"post"},[s("div",{staticClass:"user-block"},[s("img",{staticClass:"img-circle",attrs:{src:e.selfImgBaseUrl+"57ed425a-c71e-4201-9428-68760c0537c4.jpg"+e.avatarPrefix}}),s("span",{staticClass:"username text-muted"},[e._v("Iron Man")]),s("span",{staticClass:"description"},[e._v("Shared publicly - 7:30 PM today")])]),s("p",[e._v(" Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore the hate as they create awesome tools to help create filler text for everyone from bacon lovers to Charlie Sheen fans. ")]),s("ul",{staticClass:"list-inline"},[e._m(0),s("li",[s("span",{staticClass:"link-black text-sm"},[s("svg-icon",{attrs:{"icon-class":"like"}}),e._v(" Like ")],1)])])]),s("div",{staticClass:"post"},[s("div",{staticClass:"user-block"},[s("img",{staticClass:"img-circle",attrs:{src:e.selfImgBaseUrl+"9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg"+e.avatarPrefix}}),s("span",{staticClass:"username text-muted"},[e._v("Captain American")]),s("span",{staticClass:"description"},[e._v("Sent you a message - yesterday")])]),s("p",[e._v(" Lorem ipsum represents a long-held tradition for designers, typographers and the like. Some people hate it and argue for its demise, but others ignore the hate as they create awesome tools to help create filler text for everyone from bacon lovers to Charlie Sheen fans. ")]),s("ul",{staticClass:"list-inline"},[e._m(1),s("li",[s("span",{staticClass:"link-black text-sm"},[s("svg-icon",{attrs:{"icon-class":"like"}}),e._v(" Like ")],1)])])]),s("div",{staticClass:"post"},[s("div",{staticClass:"user-block"},[s("img",{staticClass:"img-circle",attrs:{src:e.selfImgBaseUrl+"fb57f689-e1ab-443c-af12-8d4066e202e2.jpg"+e.avatarPrefix}}),s("span",{staticClass:"username"},[e._v("Spider Man")]),s("span",{staticClass:"description"},[e._v("Posted 4 photos - 2 days ago")])]),s("div",{staticClass:"user-images"},[s("el-carousel",{attrs:{interval:6e3,type:"card",height:"220px"}},e._l(e.carouselImages,(function(t){return s("el-carousel-item",{key:t},[s("img",{staticClass:"image",attrs:{src:t+e.carouselPrefix}})])})),1)],1),s("ul",{staticClass:"list-inline"},[e._m(2),s("li",[s("span",{staticClass:"link-black text-sm"},[s("svg-icon",{attrs:{"icon-class":"like"}}),e._v(" Like")],1)])])])])},x=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("li",[s("span",{staticClass:"link-black text-sm"},[s("i",{staticClass:"el-icon-share"}),e._v(" Share ")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("li",[s("span",{staticClass:"link-black text-sm"},[s("i",{staticClass:"el-icon-share"}),e._v(" Share ")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("li",[s("span",{staticClass:"link-black text-sm"},[s("i",{staticClass:"el-icon-share"}),e._v(" Share")])])}],y="?imageView2/1/w/80/h/80",k="?imageView2/2/h/440",S={data:function(){return{carouselImages:[this.selfImgBaseUrl+"9679ffb0-9e0b-4451-9916-e21992218054.jpg",this.selfImgBaseUrl+"bcce3734-0837-4b9f-9261-351ef384f75a.jpg",this.selfImgBaseUrl+"d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg",this.selfImgBaseUrl+"50530061-851b-4ca5-9dc5-2fead928a939.jpg"],avatarPrefix:y,carouselPrefix:k}}},j=S,w=(s("0f58"),Object(d["a"])(j,_,x,!1,null,"69cda21d",null)),P=w.exports,U=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"block"},[s("el-timeline",e._l(e.timeline,(function(t,a){return s("el-timeline-item",{key:a,attrs:{timestamp:t.timestamp,placement:"top"}},[s("el-card",[s("h4",[e._v(e._s(t.title))]),s("p",[e._v(e._s(t.content))])])],1)})),1)],1)},I=[],E={data:function(){return{timeline:[{timestamp:"2019/4/20",title:"Update Github template",content:"PanJiaChen committed 2019/4/20 20:46"},{timestamp:"2019/4/21",title:"Update Github template",content:"PanJiaChen committed 2019/4/21 20:46"},{timestamp:"2019/4/22",title:"Build Template",content:"PanJiaChen committed 2019/4/22 20:46"},{timestamp:"2019/4/23",title:"Release New Version",content:"PanJiaChen committed 2019/4/23 20:46"}]}}},$=E,O=Object(d["a"])($,U,I,!1,null,null,null),T=O.exports,B=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-form",[s("el-form-item",{attrs:{label:"Name"}},[s("el-input",{model:{value:e.user.name,callback:function(t){e.$set(e.user,"name","string"===typeof t?t.trim():t)},expression:"user.name"}})],1),s("el-form-item",{attrs:{label:"Email"}},[s("el-input",{model:{value:e.user.email,callback:function(t){e.$set(e.user,"email","string"===typeof t?t.trim():t)},expression:"user.email"}})],1),s("el-form-item",[s("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("Update")])],1)],1)},J=[],A={props:{user:{type:Object,default:function(){return{name:"",email:""}}}},methods:{submit:function(){this.$message({message:"User information has been updated successfully",type:"success",duration:5e3})}}},L=A,V=Object(d["a"])(L,B,J,!1,null,null,null),z=V.exports,M={name:"Profile",components:{UserCard:C,Activity:P,Timeline:T,Account:z},data:function(){return{user:{},activeTab:"activity"}},computed:Object(r["a"])({},Object(l["b"])(["name","avatar","roles"])),created:function(){this.getUser()},methods:{getUser:function(){this.user={name:this.name,role:this.roles.join(" | "),email:"admin@test.com",avatar:this.avatar}}}},N=M,G=Object(d["a"])(N,a,i,!1,null,null,null);t["default"]=G.exports}}]);