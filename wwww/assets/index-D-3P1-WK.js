import{d as w,u as k,r as y,c as n,a as s,w as C,v as b,b as i,e as d,f as T,g as V,h as N,o as t,F as p,i as f,t as c}from"./index-pQ6A5Kw_.js";import{_ as A}from"./load-iGttVXsz.js";const B={class:"w-all pl15 h-all fd-c pr15"},D={class:"flex ai-c mt20 jc-c"},L={class:"flex ai-c nodarg h-50 bb-d w-all"},S={key:0,class:"flex ai-c mr10"},F={class:"flex-1 h-all"},U={class:"w-all mt15 flex ai-c"},$=["onClick"],j={class:"pl5 pr5"},q={class:"pl3 pr3"},E={key:0,class:"iconfont fc-warning fs-18 icon-ting"},H={key:0,class:"mt20 pl5"},K={class:"mt10 lh-24"},M={class:"fs-14 fs-16 mr5"},R={class:"mt20"},z={class:"w-all fs-16 mb15"},G=["onClick"],I={key:0,class:"iconfont fc-warning fs-18 icon-ting"},J={class:"mt10 pl5 w-all"},W=w({__name:"index",setup(O){const h=k(),l=y({serchText:"",phrase:[],isLoad:!1,detail:[]});function m(){l.serchText="",l.phrase=[],l.detail=[]}function u(a){window.storeApi.setUser().then(e=>{console.log(e)})}function _(a){a.src?new Audio(a.src).play():window.storeApi.ipcRenderer("tts-speek",{message:"葫芦娃跌停",...h.ttsConfig}).then(e=>{})}function v(){document.onkeydown=a=>{var e=document.all?window.event:a;e.keyCode==13&&u()}}return(a,e)=>{const x=N("scroll");return t(),n("div",B,[e[5]||(e[5]=s("div",{class:"flex h-33 pt10 ai-c"},[s("span",{class:"fs-13 fb"},"词典互译")],-1)),s("div",D,[s("div",L,[C(s("input",{"onUpdate:modelValue":e[0]||(e[0]=r=>l.serchText=r),onKeydown:v,class:"h-all flex-1 fs-16",placeholder:"在此输入单词或文本",type:"text"},null,544),[[b,l.serchText]]),l.isLoad?(t(),n("div",S,e[1]||(e[1]=[s("img",{class:"w-20",src:A,alt:""},null,-1)]))):i("",!0),l.serchText?(t(),n("span",{key:1,onClick:m,class:"iconfont hand nodarg icon-qingkong mr15 fs-24"})):i("",!0),s("div",{onClick:u,class:"pl11 pr11 pt6 pb6 ra-5 hand fs-15 fc-fff bc-primary"},e[2]||(e[2]=[s("span",{class:"iconfont fb hand fs-16 mr10 icon-search"},null,-1),d("搜索")]))])]),s("div",F,[T(x,null,{default:V(()=>{var r;return[s("div",U,[(t(!0),n(p,null,f(l.detail.pingyin,o=>(t(),n("div",{onClick:g=>_(o),class:"ra-50 nodarg hand mr20 bc-f5 fs-18 h-50 pl20 pr20 flex ai-c"},[s("span",null,c(o.title),1),s("span",j,[e[3]||(e[3]=d("/ ")),s("span",q,c(o.value),1),e[4]||(e[4]=d(" /"))]),o.src?(t(),n("span",E)):i("",!0)],8,$))),256))]),(r=l.detail.detail)!=null&&r.length?(t(),n("div",H,[(t(!0),n(p,null,f(l.detail.detail,o=>(t(),n("div",K,[s("span",M,c(o),1)]))),256))])):i("",!0),s("div",R,[(t(!0),n(p,null,f(l.detail.cnDetail,o=>(t(),n("div",z,[s("div",{onClick:g=>_(o),class:"ra-50 nodarg flex-line hand mr20 bc-f5 fs-18 h-50 pl20 pr20 flex ai-c"},[s("span",null,c(o.pingyin.title),1),o.pingyin.src?(t(),n("span",I)):i("",!0)],8,G),s("div",J,[s("span",null,c(o.detail),1)])]))),256))])]}),_:1})])])}}});export{W as default};