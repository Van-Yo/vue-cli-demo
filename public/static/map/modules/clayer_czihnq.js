/**/_jsload2&&_jsload2('clayer', 'x.extend(pb.prototype,{fl:{},Jj:[],Su:"",tq:"",QG:"",gl:p,Lg:p,Kg:p,Jg:[],PG:0,Az:t(),wz:t(),Mu:t(),Td:function(){this.YG()},ra:function(a,b){Dd.prototype.ra.call(this,a,b);this.fl={};this.Jj=[];this.D=a;this.YG()},Gt:ea(o),remove:function(){Dd.prototype.remove.call(this);this.dU()},YG:function(){var a=this,b=a.D;b&&(this.Az=function(b){a.wT(b)},this.wz=function(b){a.YS(b)},this.Mu=function(b){a.XS(b)},b.addEventListener("mousemove",this.Az),b.addEventListener("onhotspotover",this.wz),b.addEventListener("onhotspotout", this.Mu),b.addEventListener("onzoomstart",this.Mu))},dU:function(){var a=this.D;a&&(a.removeEventListener("mousemove",this.Az),a.removeEventListener("onhotspotover",this.wz),a.removeEventListener("onhotspotout",this.Mu))},wT:function(a){var b=this,c=b.D,d=c.oa();if(c.ga()<this.fc||c.Wb())b.EB();else if(a=d.Hm().zl(a.point),d=d.k.Ob,a=new R(Math.floor(a.x*Math.pow(2,c.ga()-18)),Math.floor(a.y*Math.pow(2,c.ga()-18))),d=new R(Math.floor(a.x/d),Math.floor(a.y/d)),this.tq=c=d.x+"_"+d.y+"_"+c.ga(),this.fl[c]){if(this.Su!= c){b.EB();b.XG(this.fl[c]);this.Su=c;for(var d=-1,a=0,e=this.Jj.length;a<e;a++)if(c==this.Jj[a]){d=a;break}0<=d&&(this.Jj.splice(d,d),this.Jj.push(c))}}else if(this.QG!=c){this.QG=c;d=Od[parseInt(Math.random()*Od.length)];a=b.nc;c=d+"/data?grids="+c+"&q="+a.hn+"&tags="+a.hz+"&filter="+a.filter+"&sortby="+a.bz+"&ak="+a.bm+"&page_size="+a.QN+"&age="+a.Iw;b.Bf?c+="&geotable_id="+b.Bf:b.Yn&&(c+="&databox_id="+b.Yn);var f=(1E5*Math.random()).toFixed(0);!B._rd&&(B._rd={});B._rd["_cbk"+f]=function(a){b.QS(a); delete B._rd["_cbk"+f]};ra(c+("&callback=BMap._rd._cbk"+f))}},QS:function(a){var b=this.D,c=a.content;if(!(a.status!=this.PG||!c||1>c.length)){for(var a=[],d=c[0].data,b=b.oa().Hm(),e=0,f=d.length;e<f;e++){var g=d[e][2].replace(pb.rU,"").split(","),g=b.rh(new K(g[0],g[1]));a.push({pt:g,userdata:{name:d[e][0]||"name",size:d[e][4]?d[e][4].split("|"):[10,13],uid:d[e][1]||"",zO:d[e][3]||"sid1"}})}c=c[0].grid.join("_");this.fl[c]=a;this.Jj.push(c);30<this.Jj.length&&(c=this.Jj.shift(),delete this.fl[c], delete c);this.Su!=this.tq&&(this.EB(),this.fl[this.tq]&&(this.XG(this.fl[this.tq]),this.Su=this.tq))}},XG:function(a){for(var b=this.D,c=0,d=a.length;c<d;c++){var e=a[c].userdata.size,f=e[0]/2,e=e[1]/2,f=new kb(a[c].pt,{offsets:[e,f,e,f],userData:a[c].userdata});b.Ew(f,this.nc.Ik)}},EB:function(){this.D.lm(this.nc.Ik)},YS:function(a){if(a.spots&&!(1>a.spots.length||a.spots[0].tag!=this.nc.Ik)){this.Jg=a.spots;var b=this,a=this.Jg[0].getUserData().size[0],c="",d=b.D,e="",f=b.nc.UY;0<this.Jg.length&& (c=this.Jg[0].getUserData().name);if(this.Lg)this.Lg.ta(this.Jg[0].ia()),this.Kg.ad(c),this.Kg.Ye(new M(a,0)),this.Lg.show(),c?this.Kg.show():this.Kg.U();else{var g=this.Jg[0].getUserData().size,e=this.Jg[0].getUserData().zO,i=this.Bf||this.Yn;this.gl=new jd(I.pa+"blank.gif",new M(g[0],g[1]),{anchor:new M(g[0]/2+1,g[1]/2+1)});this.GS(i,e,function(){b.Lg&&b.Lg.Vb(b.gl)});this.Lg=new W(this.Jg[0].ia(),{icon:this.gl,enableMassClear:q});d.Ja(this.Lg);this.Kg=new nd(c,{offset:new M(a,0)});this.Kg.bd({backgroundColor:f.backgroundColor, borderColor:f.borderColor});this.Lg.qn(this.Kg);c?this.Kg.show():this.Kg.U();this.Lg.addEventListener("onclick",function(){if(!(b.Jg.length<1)&&b.Jg[0].getUserData().uid){var a=b.nc,c=a.tY;if(b.Bf)c=a.uY;a=c+b.Jg[0].getUserData().uid+"?scope=2&ak="+a.bm;b.Bf&&(a=a+("&geotable_id="+b.Bf));var d=(Math.random()*1E5).toFixed(0);!B._rd&&(B._rd={});B._rd["_cbk"+d]=function(a){b.FS(a);delete B._rd["_cbk"+d]};ra(a+("&callback=BMap._rd._cbk"+d))}})}}},FS:function(a){var b=a.content;this.Bf&&(b=a.contents[0]); if(a&&a.status==this.PG&&b){var a={poiId:b.uid||"",databoxId:b.databox_id||"",title:this.Bf?b.title:b.name,address:this.Bf?b.address:b.addr,phoneNumber:b.tel||"",postcode:b.zip||"",provinceCode:1*b.province_id||-1,province:b.province||"",cityCode:1*b.city_id||-1,city:b.city||"",districtCode:1*b.district_id||-1,district:b.district||"",point:this.Bf?new K(b.location[0],b.location[1]):new K(b.longitude,b.latitude),tags:b.tag&&b.tag.replace(pb.uU,"").split(pb.sU),typeId:1*b.cla||-1,extendedData:b.ext|| {}},c=new x.lang.vz("onhotspotclick");c.customPoi=a;c.content=b;this.dispatchEvent(c)}},XS:function(){this.Lg&&this.Lg.U();this.Kg&&this.Kg.U()},GS:function(a,b,c){var d=this,e=Pd+"?method=getstyle&databox="+a+"&sid="+b,f=(1E5*Math.random()).toFixed(0);if(!d.gl||!(d.gl.databoxid==a&&d.gl.sid==b))!B._rd&&(B._rd={}),B._rd["_cbk"+f]=function(a){var b="";0==a.status&&(b="data:image/png;base64,"+a.content.sid1);0<b.length&&(d.gl.lO(b),c&&c(a));delete B._rd["_cbk"+f]},ra(e+("&callback=BMap._rd._cbk"+f))}}); ');