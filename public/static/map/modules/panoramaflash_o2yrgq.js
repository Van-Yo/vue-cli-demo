/**/_jsload2&&_jsload2('panoramaflash', 'x.extend(Pa.prototype,{Vi:function(){for(var a=0;a<B.Fr.length;a++)B.Fr[a](this);this.Nf!=p&&this.dispatchEvent(new N("onvisible_poi_type_changed"),{visiblePOIType:this.Nf});this.kl=this.ih();this.Tr=this.hd=q;this.Nq={};this.gd=new xk(this);this.US();this.DQ();this.FQ();if(this.Ya||this.Kb)this.Ya?this.rc(this.Ya,this.Le):this.ta(this.Kb)},FQ:function(){var a=this;setInterval(function(){if(a.Yb()){var b=a.ih();b.ab(a.kl)||(a.gd.set("size",{width:b.width,height:b.height}),a.kl=b,a.dispatchEvent(new N("size_changed")))}}, 80)},US:function(){var a=this.gd,b=this;a.addEventListener("clicked_position",function(a){b.dispatchEvent(new N("onclicked_position"),a)});a.addEventListener("thumbnail_complete",function(){b.dispatchEvent(new N("onthumbnail_complete"))});a.addEventListener("indoor_enter",function(a){a.data.l4===p?b.Fj({haveBreakId:q}):b.Fj({haveBreakId:o});b.dispatchEvent(new N("onhaveBreakId_changed"))});a.addEventListener("first_thumb_complete",function(){var a,d;if(b.hd!==o){b.hd=o;a=this;b.Ya=a.get("id");"street"!= b.Le&&(b.Le="street",b.Uy("inter"));b.ko=a.get("links");d=a.get("position");b.Kb=d;d=a.get("pov");!b.Ea.heading&&!b.Ea.pitch?b.Ea=d:(d.heading!=b.Ea.heading||d.pitch!=b.Ea.pitch)&&a.set("pov",b.Ea);d=a.get("zoom");1==!b.Kc&&1!=d?b.Kc==d:b.Kc!=d&&a.set("zoom",b.Kc);d=p;for(var e in b.Ke)d=b.Ke[e],delete b.Ke[e],b.Ja(d);b.k.navigationControl===q&&a.set("navigationControlVisible",q);var f=function(b){a.Js("toggleUI",{topo:b.linksControl,wellLid:b.clickOnRoad,innerExit:q,innerFloor:b.indoorFloorControl})}; f(b.k);b.addEventListener("clickonroad_changed",function(){f(b.k)});b.addEventListener("links_visible_changed",function(){f(b.k)});b.addEventListener("onindoorfloor_options_changed",function(){f(b.k)});b.addEventListener("navigation_visible_changed",function(){a.set("navigationControlVisible",b.k.navigationControl)});if(0<b.Ug.length){e=0;for(d=b.Ug.length;e<d;e++)b.Ug[e].register(b.C,b,b.gd);var g="",i=[];e=0;for(d=b.Ir.length;e<d;e++)g=b.Ir[e].hN,i=b.Ir[e].gN,b[g].apply(b,i)}b.k.visible?b.show(): b.U()}});a.addEventListener("pano_error",function(){b.dispatchEvent(new N("error"))});a.addEventListener("id_changed",function(a){if(b.hd||b.Ya==p||"inter"==b.Le)b.Ya=a.data;b.dispatchEvent(new N("onid_changed"))});a.addEventListener("position_changed",function(a){b.hd?b.Kb=b.gd.get("position"):b.Kb==p&&(b.Kb=a.data);b.dispatchEvent(new N("onposition_changed"))});a.addEventListener("pov_changed",function(a){if(b.hd||b.Ea.heading==p)b.Ea=a.data;b.dispatchEvent(new N("onpov_changed"))});a.addEventListener("links_changed", function(a){if(b.hd||0==b.ko.length)b.ko=a.data;b.dispatchEvent(new N("onlinks_changed"))});a.addEventListener("zoom_changed",function(a){if(b.hd||b.Kc==p)b.Kc=a.data;b.dispatchEvent(new N("onzoom_changed"))});a.addEventListener("sdata_loaded",function(a){b.Uy(a.data.panoType);b.dispatchEvent(new N("oncopyright_changed"),{copyright:a.data.copyright});if(b.Tr){for(var d in b.Nq)b[d](b.Nq[d]);b.Tr=q;b.Nq={}}});a.addEventListener("overlay_mouseclick",function(a){a=b.Ke[a.data.markerId];a.dispatchEvent(new N("onclick"), {type:"click",target:a})});a.addEventListener("overlay_mouseover",function(a){a=b.Ke[a.data.markerId];a.dispatchEvent(new N("onmouseover"),{type:"mouseover",target:a})});a.addEventListener("overlay_mouseout",function(a){a=b.Ke[a.data.markerId];a.dispatchEvent(new N("onmouseout"),{type:"mouseout",target:a})})},DQ:function(){var a=this;x.M(this.C,ja.da.Te?"DOMMouseScroll":"onmousewheel",function(b){if(a.k.enableScrollWheelZoom&&a.k.visible){var c=-b.detail/3||b.wheelDelta/120,c=a.ga()+c;a.Oc(c);Db(b)}})}, rc:function(a,b,c){"object"===typeof b&&(c=b,b=j);if(!this.hd||a&&a!=this.Ya)this.hd||(this.Ya=a,this.Le=b||"street",this.Kb=p),this.gd.set("id",{id:a,type:b||"street"}),this.Tr=o,c&&c.pov&&this.Nc(c.pov)},ta:function(a){if(!this.hd||a&&!this.Kb.ab(a))this.hd||(this.Kb=a,this.Ya=p),this.gd.set("position",a),this.Tr=o},Nc:function(a){a&&(90<a.pitch&&(a.pitch=90),-90>a.pitch&&(a.pitch=-90),this.hd?this.Tr?this.Nq.setPov=a:this.gd.set("pov",a):this.Ea=a)},Oc:function(a){a!=this.Kc&&(a>Me&&(a=Me),a<Ne&& (a=Ne),this.hd?this.gd.set("zoom",a):this.Kc=a,this.Nq.setZoom=a)},show:function(){this.k.visible=o;this.Af&&(this.D&&this.D.Ka()===this.C)&&x.K.show(this.Af);this.gd&&this.gd.Er&&(this.gd.Er.style.left="0");this.hd&&(this.xl===this.Yb()&&this.gd.set("id",{id:this.xl,type:this.iT||"street"}),this.dispatchEvent(new N("onvisible_changed")))},U:function(){this.k.visible=q;this.hd&&(this.xl=this.Ya,this.iT=this.Le,this.gd.Js("closePano"));this.Ya=p;this.gd&&this.gd.Er&&(this.gd.Er.style.left="-9999px"); this.dispatchEvent(new N("onvisible_changed"))},hC:function(a){function b(a,b){return function(){a.Ir.push({hN:b,gN:arguments})}}if(this.hd)a.register(this.C,this,this.gd);else for(var c=a.getPanoMethodList(),d="",e=0,f=c.length;e<f;e++)d=c[e],this[d]=b(this,d);this.Ug.push(a)},vF:function(a){this.hd&&a.dispose();for(var b=this.Ug.length;b--;)this.Ug[b]===a&&this.Ug.splice(b,1)},fu:function(a){this.Nf=a||"none";this.dispatchEvent(new N("onvisible_poi_type_changed"),{visiblePOIType:this.Nf})},Ja:function(a){this.Ke[a.kd]= a;this.hd&&this.dispatchEvent(new N("onadd_overlay"),{overlay:a})},Ub:function(a){var b=a.kd;this.hd&&this.dispatchEvent(new N("onremove_overlay"),{overlay:a});delete this.Ke[b]},ap:function(){var a=this.gd.get("indoorData");a&&a.pid&&this.rc(a.pid)},LF:function(a){this.gd.set("interactiveState",a)}});Ij=Pa.prototype; U(Ij,{setId:Ij.rc,setPosition:Ij.ta,setPov:Ij.Nc,setZoom:Ij.Oc,show:Ij.show,hide:Ij.U,addPlugin:Ij.hC,removePlugin:Ij.vF,addOverlay:Ij.Ja,removeOverlay:Ij.Ub,setPanoramaPOIType:Ij.fu,exitInter:Ij.ap,setInteractiveState:Ij.LF});function yk(){this.ET=(this.JA=window.ActiveXObject&&!(window.opera&&!window.opera.nodeType))?\' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"\':\' type="application/x-shockwave-flash"\';this.MI=["id","width","height","align","data"];this.NI="wmode movie flashvars scale quality play loop menu salign bgcolor base allowscriptaccess allownetworking allowfullscreen seamlesstabbing devicefont swliveconnect".split(" ")} x.extend(yk.prototype,{create:function(a,b){var c=this.aS(a);b&&"string"===typeof b&&(b=document.getElementById(b));b?b.innerHTML=c:document.write(c)},remove:function(a){if((a=this.$L(a))&&this.JA){a.style.display="none";for(var b in a)"function"===typeof a[b]&&(a[b]=p);window.CP&&setTimeout(window.CP,0)}a.parentNode.removeChild(a)},AX:function(){function a(){var c=function(){var a=navigator;if(a.plugins&&a.mimeTypes.length){if((a=a.plugins["Shockwave Flash"])&&a.description)return a.description.replace(/([a-zA-Z]|\\s)+/, "").replace(/(\\s)+r/,".")+".0"}else if(b.JA)try{var c=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(c)return c.GetVariable("$version").replace(/WIN/g,"").replace(/,/g,".")}catch(f){}}();a=function(){return c};return c}var b=this;return a()},$L:function(a){return document.getElementById(a)},uH:function(a,b){for(var a=a.split("."),b=b.split("."),c=Math.max(a.length,b.length),d=0;d<c;d++){var e=a[d],f=b[d];if(!e||!f)return!e&&!f?0:e?1:-1;e=Number(e);f=Number(f);if(e<f)return-1;if(e>f)return 1}return 0}, aS:function(a){a=a||{};a.movie=a.url||"";a.altHtml=a.errorMessage||"";if(a.vars){var b=a.vars,c=[],d=p,e=p;for(d in b)e=b[d],c.push(d+"="+encodeURIComponent(e));a.flashvars=c.join("&")}a.minVer=a.ver;b=a.minVer;c=a.maxVer;if(b||c)if(d=this.AX(),!d||b&&0>this.uH(d,b)||c&&0<this.uH(d,c))return a.altHtml||"";d=["<object",this.ET];a.data=a.movie;for(b=0;b<this.MI.length;b++)c=this.MI[b],a.hasOwnProperty(c)&&d.push(" ",c,\'="\',a[c],\'"\');d.push(">");for(b=0;b<this.NI.length;b++)c=this.NI[b],a.hasOwnProperty(c)&& d.push(\'<param name="\',c,\'" value="\',a[c],\'"/>\');d.push("</object>");return d.join("")}});function zk(a,b){this.P=a;this.YR=b;this.Vh={};this.Qz()}x.extend(zk.prototype,{Qz:function(){var a=this,b=a.P;b.addEventListener("add_overlay",function(b){b=b.overlay;b.ra(a.P,a.YR);a.Vh[b.kd]=b});b.addEventListener("remove_overlay",function(b){b=b.overlay;b.remove();delete a.Vh[b.kd]})}});x.extend(Qe.prototype,{ra:function(a,b){this.P=a;this.ia()||this.ta(this.P.ia());this.Ba=b;this.Ab()},Ab:function(){var a=this.ia(),a=Yc.Xd.jy(a),a={markerId:this.kd,catalog:"FD01",name:this.Bk(),rank:this.dp(),x:a.x,y:a.y,color:this.Km(),hoverColor:this.lM,backgroundHoverColor:this.oK,borderColor:this.borderColor,borderHoverColor:this.sK,backgroundColor:this.backgroundColor,padding:this.padding,fontSize:this.fontSize,borderWidth:this.borderWidth};if(this.xE||this.getImageData())a.imageUrl=this.xE, a.imageData=this.getImageData(),a.size=this.vb(),a.image=this.Dx(),a.catalog="FD02",this.vb()&&(a.width=this.vb()[0],a.height=this.vb()[1]);this.Ba.$N(a)},hide:function(){this.Pa=q;this.Ba&&this.Ba.Qo(this.kd,"visible",q)},show:function(){this.Pa=o;this.Ba&&this.Ba.Qo(this.kd,"visible",o)},isVisible:v("Pa"),Mf:function(a,b){this.Ba&&("position"==a&&(b=Yc.Xd.zl(b),b={lng:b.x,lat:b.y}),this.Ba.Qo(this.kd,a,b))},remove:function(){this.dispatchEvent(new N("onremove"),{type:"remove",target:this});this.Ba.WK([this.kd])}});var Ak={none:"",transit:"FE0A",hotel:"FE02",catering:"FE01",movie:"FE06",indoor_scene:"FEFE"},Bk={none:["-1",""],transit:["0","m_transit.png"],hotel:["1","m_hotel.png"],catering:["2","m_catering.png"],movie:["3","m_movie.png"],transit:["4","m_transit.png"],indoor_scene:["5","m_indoor_scene.png"]}; x.extend(Te.prototype,{ra:function(a,b){this.P=a;this.Ba=b;this.Ab()},Ab:function(){var a=this.ia(),a=Yc.Xd.zl(a),b=this.tS(),c=this.iE();this.Ba.$N({markerId:this.kd,catalog:b,name:this.np(),rank:this.dp(),x:a.x,y:a.y,heading:c.heading,pitch:c.pitch,pid:c.panoId,panoIId:c.panoIId})},tS:function(){var a=this.gp().match(/.*\\/(.*)/)[1],b;for(b in Bk)if(Bk[b][1]==a)return Ak[b]},hide:function(){this.Pa=q;this.Ba.Qo(this.kd,"visible",q)},show:function(){this.Pa=o;this.Ba.Qo(this.kd,"visible",o)},isVisible:v("Pa"), Mf:function(a,b){"position"==a&&(b=Yc.Xd.zl(b),b={lng:b.x,lat:b.y});this.Ba.Qo(this.kd,a,b)},remove:function(){this.dispatchEvent(new N("onremove"),{type:"remove",target:this});this.Ba.WK([this.kd])}});xk.qo=new Yc(p,{of:"api"});function xk(a){x.lang.Da.call(this);a&&(this.P=a,this.Ng=p,this.IH=a.C.clientWidth,this.HH=a.C.clientHeight,new zk(a,this))}xk.bQ=B.Sf("pano");x.lang.ua(xk,x.lang.Da,"PanoramaFlashWraper"); x.extend(xk.prototype,{$N:function(a){this.Js("addMarkers",[a])},WK:function(a){this.Js("removeMarkers",[a])},Qo:function(a,b,c){var d={};d.markerId=a;d[b]=c;this.set("markerProperty",d)},get:function(a){var b=p;"position"==a?(b=this.Ng.get("mercatorPosition"),b=Yc.Xd.Ej(new R(b.mercatorX,b.mercatorY))):b=this.Ng.get(a);return b},set:function(a,b){var c=this;"position"==a?xk.qo.tj(b,function(a){a&&a.id?c.P.rc(a.id):c.dispatchEvent(new N("pano_error"))}):"id"==a?c.Ng==p?c.aT(c.P):c.Ng.set&&c.Ng.set("panoOptions", {id:b.id,panoType:b.type,width:c.IH,height:c.HH}):c.Ng&&c.Ng.set&&c.Ng.set(a,b)},Js:function(a,b){return this.Ng.doAction(a,b)},Z2:v("Er"),aT:function(a){var b=this,c=a.k.swfSrc.match(/.*\\//)[0]+"BDStreetScape.swf";b.Ng=o;xk.qo.Ox(function(d){var e="",f="";"inter"===a.Le?f=a.Ya:e=a.Ya;e={pid:e,iid:f,panoType:a.Le,heading:a.Ea.heading,pitch:a.Ea.pitch,width:b.IH,height:b.HH,panoUrl:c,panoTileUrl:xk.bQ.join("|"),domain:Yc.Ru,jsInterfaceNamespace:"BMap.PanoramaFlashInterface",swfIndex:b.ba};f=a.k.swfSrc; d&&(d.panoUdt&&d.panoUdt.version&&e)&&(e.udtVersion=d.panoUdt.version);d&&(d.panoSwfAPI&&d.panoSwfAPI.version&&e)&&(e.panoUrl=e.panoUrl+"?version="+d.panoSwfAPI.version,f=f+"?version="+d.panoSwfAPI.version);b.Ng=b.qR(a.C,e,f)})},qR:function(a,b,c){var d=new yk,e="PanoramaFlash"+this.ba,f=p,f=H("div");f.style.position="absolute";f.id="PanoramaFlashWraper"+this.ba;f.style.top="0";f.style.left="0";f.style.height="100%";f.style.width="100%";f.style.zIndex=1200;this.Er=f;a.appendChild(f);d.create({id:e, width:"100%",height:"100%",allowscriptaccess:"always",scale:"showall",wmode:"opaque",quality:"best",url:c,ver:"10.2",errorMessage:"\\u60a8\\u672a\\u5b89\\u88c5Flash Player\\u64ad\\u653e\\u5668\\u6216\\u8005\\u7248\\u672c\\u8fc7\\u4f4e",vars:b},f);return d.$L(e)}});var Ck=xk.prototype;U(Ck,{get:Ck.get,set:Ck.set,doAction:Ck.Js}); ');