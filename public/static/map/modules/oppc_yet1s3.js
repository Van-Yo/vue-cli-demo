/**/_jsload2&&_jsload2('oppc', 'var yh=256,zh=32;function Ah(){this.C=p}var Bh;B.Xe(function(a){if(!a.B.dy){var b=new Ah;Bb(a.Ua,b.va(a.B.Xb));b.C=a.Ua.lastChild;a.R.L0=b}}); Ah.prototype.va=function(a){a=[\'<div id=zoomer style="position:absolute;z-index:0;top:0px;left:0px;overflow:hidden;visibility:hidden;cursor:\'+a+\'">\'];a.push(\'<div class="BMap_zoomer" style="top:0;left:0;"></div>\');a.push(\'<div class="BMap_zoomer" style="top:0;right:0;"></div>\');a.push(\'<div class="BMap_zoomer" style="bottom:0;left:0;"></div>\');a.push(\'<div class="BMap_zoomer" style="bottom:0;right:0;"></div>\');a.push("</div>");return a.join("")}; Ah.prototype.action=function(a,b){if(!Bh){var c=this.C;if(c){var d=4/3,e=Math.ceil((b?60:120)/2),f=Math.max(15,e/d),g=c.style;g.width=2*e+"px";g.height=2*f+"px";g.visibility="visible";c=c.children;b?(c[0].style.backgroundPosition="0 0",c[1].style.backgroundPosition="-7px 0",c[2].style.backgroundPosition="0 -7px",c[3].style.backgroundPosition="-7px -7px"):(c[0].style.backgroundPosition="-7px -7px",c[1].style.backgroundPosition="0 -7px",c[2].style.backgroundPosition="-7px 0",c[3].style.backgroundPosition= "0 0");var c=p,i=a.x-e,k=a.y-f;if(!isNaN(i)&&!isNaN(k)){g.left=i+"px";g.top=k+"px";var l=Math.ceil((b?120:60)/2),m=Math.max(15,l/d),l=l-e,m=Math.ceil(m-f),n=this.C.style;Bh&&Bh.end();Bh=new ub({Hc:20,duration:240,hc:vb.sD,To:100,va:function(a){if(!(a<0.1)){var b=Math.ceil(l*a),a=Math.ceil(m*a);n.width=(e+b)*2+"px";n.height=(f+a)*2+"px";n.left=i-b+"px";n.top=k-a+"px"}},finish:function(){Bh=q;setTimeout(function(){g.visibility="hidden"},300)}})}}}};B.Xe(function(a){function b(a){if(f.B.$o){var b=new N("ondeepzoommousewheel");c(a,ma(b,a));i.C0.call(i,b);Db(a)}}function c(a,b){var c=a.srcElement||a.target,d=a.offsetX||a.layerX||0,e=a.offsetY||a.layerY||0,g=p,i=p;1!==c.nodeType&&(c=c.parentNode);for(;c&&c!==f.Ua;){c.ba&&(x.lang.Lc(c.ba)instanceof ib&&(g=x.lang.Lc(c.ba)),x.lang.Lc(c.ba)instanceof md&&(i=x.lang.Lc(c.ba)));if(!(0===c.clientWidth&&0===c.clientHeight&&c.offsetParent&&"TD"===c.offsetParent.nodeName)&&"http://www.w3.org/2000/svg"!==c.namespaceURI)d+= c.offsetLeft||0,e+=c.offsetTop||0;else if("http://www.w3.org/2000/svg"===c.namespaceURI&&B.qq){var y=B.qq.bt(f).hf;if(-1<navigator.userAgent.indexOf("Opera")&&"svg"!==c.tagName){if(c=x.lang.Lc(c.ba))c=c.Kd(),d+=f.Cc(c.xe()).x,e+=f.Cc(c.pf()).y;break}if(39<=x.da.Te||51<=x.da.Tw)d=a.layerX||0,e=a.layerY||0;if(y&&!(window.ActiveXObject||"ActiveXObject"in window))d+=parseFloat(y.style.left)+f.offsetX,e+=parseFloat(y.style.top)+f.offsetY;if(y&&((window.ActiveXObject||"ActiveXObject"in window)&&"svg"=== c.nodeName.toLowerCase())&&!c.ba)d+=parseFloat(y.style.left)+f.offsetX,e+=parseFloat(y.style.top)+f.offsetY;if((9<=x.da.ma||-1<navigator.userAgent.toLowerCase().indexOf("trident"))&&"svg"!==c.nodeName.toLowerCase()){d+=f.offsetX;e+=f.offsetY;break}if(!x.da.ma)break}c=c.offsetParent}if((65<=x.da.Tw||60<=x.da.Te)&&"ondeepzoommousewheel"===b.type){d=a.clientX+window.scrollX;e=a.clientY+window.scrollY;for(c=f.Ka();c;)d-=c.offsetLeft,e-=c.offsetTop,c=c.offsetParent}b.offsetX=d;b.offsetY=e;b.pixel=b.Wa= new R(d,e);b.pointN=b.Bg=f.Rb(b.Wa);b.point=b.point=f.Ag(b.Wa);b.overlay=b.cb=g;b.domEvent=a;b.Bb=i;return b}function d(a){var b=f.R,d=!b.ty&&!b.uy;if(b.Ky)clearTimeout(b.Ky),b.Ky=p,d&&(f.dispatchEvent(c(a,ma(new N("onrightclick"),a))),f.Sa|=yh,f.dispatchEvent(c(a,ma(new N("onrightdblclick"),a))),f.Sa^=yh);else{d&&f.dispatchEvent(c(a,ma(new N("onrightclick"),a)));var e=c(a,ma(new N("onrightclickex"),a));b.Ky=setTimeout(function(){b.Ky=p;d&&f.dispatchEvent(e)},f.B.BC)}}function e(a){if(f.B.$o){var b= f.R;b.nb&&(b.nb.stop(),b.nb=p,setTimeout(function(){f.dispatchEvent(new N("onmoveend"))},1));f.Sa|=zh;a=window.event||a;f.Mc=f.Na;b=new N("onmousewheel");b.iq=0<=a.wheelDelta||0>a.detail;var d=new Date;b.iq===o&&f.Na===f.oa().Dm()||b.iq===q&&f.Na===f.oa().hp()||220>d-g?f.Sa^=zh:(g=d,c(a,ma(b,a)),f.dispatchEvent(b),f.Sa^=zh,a.returnValue=q);Db(a)}}var f=a;f.RY=a.Wb();a.Ua.h4=ea(q);x.M(f.platform,"mousemove",function(a){0===f.Sa&&f.dispatchEvent(c(a,ma(new N("onmousemove"),a)))});x.M(f.platform,"mousedown", function(a){if(f.B.AD){a=window.event||a;x.da.ma||Db(a);var b=f.R;b.Ic=o;var d=a.srcElement||a.target;b.nb&&(b.nb.stop(),b.nb=p,f.dispatchEvent(new N("onmoveend")));b.yu=a.clientX||a.pageX||0;for(b.zu=a.clientY||a.pageY||0;d&&d!==f.Ua;){if(x.K.nt(d,"BMap_Marker")){b.Ic=q;var e=x.lang.Lc(d.ba);if(e instanceof W&&e.z.jf===o||e.z.Gb===o)return}d=d.parentNode}x.da.ma&&f.Ae.setCapture&&f.Ae.setCapture();f.dispatchEvent(c(a,ma(new N("onmousedown"),a)));f.B.Gb&&(!(f.Sa&8)&&2!==a.button)&&(b.Gp=b.yu,b.Lk= b.zu,b.Gy=f.offsetX,b.m=f.offsetY,f.Sa|=8,f.platform.style.cursor=0===f.R.Re.length?f.B.Id:"pointer")}});x.M(document,"mousemove",function(a){var a=window.event||a,b=f.R,d=a.clientX||a.pageX||0,e=a.clientY||a.pageY||0;if(b.yu||b.zu)b.ty=d-b.yu,b.uy=e-b.zu;var g=cb(),i=40<g-b.KM;if(!(18>g-b.Cp)&&(i&&(b.KM=g),b.Cp=g,f.Sa&8&&f.B.Gb)){var w=f.platform.style;w.cursor.replace(/"|\\s/g,"")!==f.B.Id&&(w.cursor=f.B.Id);b.fk||(f.dispatchEvent(c(a,ma(new N("ondragstart"),a))),f.dispatchEvent(new N("onmovestart")), b.iD=new R(d,e),b.jD=g);0===b.Gp&&(0===b.Lk&&f.R.M3)&&(b.Gp=d,b.Lk=e,b.Gy=f.offsetX,b.m=f.offsetY);if(0!==d-b.Gp||0!==e-b.Lk)f.R.fk=o,f.dispatchEvent(c(a,ma(new N("ondragging"),a))),f.Me(b.Gy+d-b.Gp,b.m+e-b.Lk,p,i)}});x.M(document,"mouseup",function(a){x.da.ma&&f.Ae.releaseCapture&&f.Ae.releaseCapture();var b=f.R;b.q4&&f.C2(o);var a=window.event||a,d=a.clientX||a.pageX,e=a.clientY||a.pageY;if(f.Sa&8&&f.B.Gb){f.Sa^=8;f.platform.style.cursor=0===b.Re.length?f.B.Xb:"pointer";if(f.R.fk){var g=c(a,ma(new N("ondragend"), a));f.dispatchEvent(g);Ch(f,new R(d,e))}b.fk=q}b.Ic=q;2===a.button&&(b.yu=p,b.zu=p,b.ty=0,b.uy=0);f.dispatchEvent(c(a,ma(new N("onmouseup"),a)))});4<=x.da.Te?(x.M(f.Ua,"mouseup",function(a){2===a.button&&d(a)}),x.M(f.Ua,"contextmenu",function(a){f.B.kL||oa(a)})):x.M(f.Ua,"contextmenu",function(a){d(a);f.B.kL||oa(a)});var g=new Date,i;a.B.lL&&(i=new Dh(a),a.n2=i);if(x.da.ma&&9>=x.da.ma||f.RY)i=p;x.M(f.Ua,"mousewheel",i?b:e);window.addEventListener&&f.Ua.addEventListener("DOMMouseScroll",i?b:e,q);x.M(f.platform, "click",function(a){var b=new N("onclick"),d=new N("onclickex"),e=f.R;c(a,ma(b,a));c(a,ma(d,a));if(!f.Sa){var g=!e.ty&&!e.uy;g&&f.dispatchEvent(b);if(!e.Si)e.Si=setTimeout(function(){e.Si=p;g&&f.dispatchEvent(d)},f.B.BC)}e.yu=p;e.zu=p;e.ty=0;e.uy=0});x.M(f.platform,"dblclick",function(a){if(!f.Sa){f.Sa=f.Sa|yh;x.da.ma&&f.dispatchEvent(c(a,ma(new N("onclick"),a)));var b=f.R;if(b.Si){clearTimeout(b.Si);b.Si=p}f.dispatchEvent(c(a,ma(new N("ondblclick"),a)));f.Sa=f.Sa^yh}});x.M(document,"mousedown",function(b){var b= window.event||b,b=b.srcElement||b.target,c=f.R;c.tC=c.tC?x.K.contains(a.Ua,b):x.K.contains(a.platform,b)})}); function Ch(a,b){if(a.B.sx){var c=a.R,d=cb();if(100<d-c.Cp)a.dispatchEvent(new N("onmoveend")),c.fk=q;else{var e=c.iD,f=[0<b.x-e.x?1:-1,0<b.y-e.y?1:-1],d=Gb(e,b)/((d-c.jD)/1E3)/2,g=d/1.8,i=0.4*g*d/1E3,k=Math.abs(e.x-b.x),l=0,m=0;0===Math.abs(e.y-b.y)?l=k:(e=Math.abs(e.x-b.x)/Math.abs(e.y-b.y),m=Math.round(Math.sqrt(i*i/(1+e*e))),l=Math.round(e*m));-1===f[0]&&(l=-l);-1===f[1]&&(m=-m);c.nb&&(c.nb.stop(),c.nb=p,a.dispatchEvent(new N("onmoveend")));var n=d/1E3,s=a.offsetX,u=a.offsetY,w=q;c.nb=new ub({duration:g, Hc:30,hc:function(a){a=a*n/1.8;return n*a-0.9*a*a},va:function(b){b=b*3.6/(n*n);w=!w;a.Me(s+Math.round(b*l),u+Math.round(b*m),p,w)},finish:function(){c.nb=p;a.Me(s+Math.round(l),u+Math.round(m));a.dispatchEvent(new N("onmoveend"))},Pt:function(b){c.nb=p;b=b*3.6/(n*n);a.Me(s+Math.round(b*l),u+Math.round(b*m));setTimeout(function(){a.dispatchEvent(new N("onmoveend"))},1)}})}}else a.dispatchEvent(new N("onmoveend"))} function Dh(a){this.map=a;this.gb=a.gb;this.aW=Eh();this.Rd=0;this.pF=1;this.oF=this.dh=p;this.aF=1;this.bF=-1;this.EE=q;this.Zb=19;this.fc=3;this.NM=0;this.Mk="";this.zt=q;this.TE=this.MM=0;this.oC()}var Fh=Dh.prototype;Fh.oC=function(){var a=this,b=a.map;a.Zb=b.B.Zb||19;a.fc=b.B.fc||3;b.addEventListener("onmaptypechange",function(){a.Zb=b.B.Zb||19;a.fc=b.B.fc||3})}; Fh.C0=function(a){var b=this,c=b.map,d=c.R;b.Zb=c.B.Zb||19;b.fc=c.B.fc||3;d.nb&&(d.nb.stop(),d.nb=p,c.dispatchEvent(new N("onmoveend")));var e=Math.floor(a.domEvent.timeStamp),f=e-this.NM,g=0<=a.domEvent.wheelDelta,d=Math.abs(a.domEvent.wheelDelta),i=Math.abs(a.domEvent.deltaY);100<f&&(this.zt=q,this.Mk=Gh(d,i,a.o2),this.Rd=0,this.SN=p);"padScroll"===this.Mk&&(0===i&&0===f&&this.zt===q)&&(this.zt=o);if(0!==f){this.NM=e;if("padScroll"===this.Mk&&40>f){b.Rd=g?b.Rd+0.13:b.Rd-0.16;var e=a.domEvent.wheelDelta- this.MM,f=e-this.TE,k=this.TE;this.TE=e;this.MM=a.domEvent.wheelDelta;this.LM=g;if("boolean"===typeof this.LM&&g!==this.LM||"padScroll"===this.Mk&&3===d&&!isNaN(f)&&50<Math.abs(e-k))b.bl&&(b.bl.stop(),b.bl=p);else if(0!==this.SN)if(0>e&&0<k||0<e&&0>k)5>i&&(this.zt=q);else return}this.SN=this.Rd;d=a.domEvent.wheelDelta/120||-a.domEvent.detail/3;0===d&&x.da.Te&&(d=-a.domEvent.deltaY);if(0!==d&&(d=Math.ceil(Math.abs(d))*(0<=d?1:-1),"padPinch"===this.Mk&&(d=a.domEvent.deltaY),i=0<d?1:-1,c=c.ga(),0>i&& (b.aF=-1),0<i&&(b.bF=1),e=b.fc,!(c>=b.Zb&&0<i&&1===b.aF||c<=e&&0>i&&-1===b.bF))){"mouseWheel"!==this.Mk&&(d*=0.6);b.Rd+=d;"mouseWheel"===this.Mk&&(b.Rd=b.PM(b.Rd));var l=new R(a.Wa.x,a.Wa.y);if("mouseWheel"!==this.Mk){if(!b.bl&&!b.De&&!(0===b.Rd||b.zt===o))b.De=setTimeout(function(){var a=Math.abs(b.Rd),a=Math.round(a);b.Rd=g?a:-a;b.Rd=b.PM(b.Rd);b.Rd!==0&&b.tP(l,b.Rd);b.De=p},30)}else b.bl&&(b.bl.stop(),b.bl=p),b.De&&clearTimeout(b.De),b.De=setTimeout(function(){b.tP(l,b.Rd);b.De=p},25)}}}; Fh.PM=function(a){var b=this.fc,c=this.Zb,d=this.map.ga(),a=Math.min(Math.max(a,-3),3);d+a>c?a=c-d:d+a<b&&(a=b-d);return a}; Fh.tP=function(a,b){var c=new M(0,0),d=this,e=d.map,f=d.gb,g=Math.pow(2,b),i=d.pF,k,l=e.width,m=e.height,n=(a.x-l/2)/l,s=(a.y-m/2)/m,u=f.Pb,w=u.style,y,D,C=d.aW;d.EE||(d.EE=o,e.dispatchEvent(new N("onzoomstart")));e.rd&&x.K.U(e.rd);f.Fl.style.visibility="hidden";f.nd&&(f.nd.style.visibility="hidden");f.mo.style.visibility="hidden";if(!d.dh){w[C]||(w[C]="translate3d(0,0,0)");var F=d.oF;F&&(F.parentNode&&F.parentNode.removeChild(F),d.oF=p);d.oF=d.dh=u.cloneNode(o);e.platform.insertBefore(d.dh,e.platform.firstChild)}w.visibility= "hidden";var z=d.dh.style;d.bl=new ub({Hc:60,duration:e.B.Zo?400:1,hc:vb.Qs,va:function(a){if(b>0){k=i+a*(g-i);y=-l*(k-1)*n-c.width*a;D=-m*(k-1)*s-c.height*a}else{k=i-a*(i-g);y=l*(1-k)*n;D=m*(1-k)*s}z[C]="translate3d("+y+"px, "+D+"px, 0) scale("+k+")";d.pF=k},finish:function(){var c=e.ga(),c=Math.round(c+b);e.Mc=e.Na;e.Na=c;var c=f.AA(a),g=e.oa().yc(e.ga());e.dc=new K(c.lng+(e.width/2-a.x)*g,c.lat-(e.height/2-a.y)*g);e.re=e.Nd.rh(e.dc,e.Sb);w.visibility="";f.Vf();e.rd&&(x.da.ma&&x.da.ma<8||document.compatMode=== "BackCompat"?x.K.show(e.rd):setTimeout(function(){x.K.show(e.rd)},100));f.Fl.style.visibility="";f.mo.style.visibility="";e.dispatchEvent(new N("onzoomend"));d.Rd=0;d.pF=1;setTimeout(function(){d.ZN()},100);d.ZN();d.bl=p;d.aF=1;d.bF=-1;d.EE=q}})};Fh.ZN=function(){this.dh&&(Id(this.dh),this.dh.parentNode&&(this.dh.parentNode.removeChild(this.dh),this.dh.innerHTML="",this.dh=p))}; function Eh(){var a="transform",b=document.createElement("div"),c=["Webkit","Moz","O","ms"],d=c.length,e="",b=b.style;a in b&&(e=a);for(a=a.replace(/^[a-z]/,function(a){return a.toUpperCase()});d--;){var f=c[d]+a;if(f in b){e=f;break}}return e}function Gh(a,b,c){var d="mouseWheel";if(120===a&&1>b)d="padPinch";else if(!isNaN(a)&&(10>a||120!==a)&&0===b%1)d="padScroll";x.da.Te&&0===c&&(d="padScroll");x.da.BF&&12===a&&(d="mouseWheel");return d};B.Xe(function(a){x.M(document,"keydown",function(b){a.R.Fi==o&&(a.R.Fi=q);if(a.B.tx&&a.R.tC)switch(b=window.event||b,b.keyCode||b.which){case 43:case 189:case 109:a.R.Ic=o;a.dispatchEvent(new N("onminuspress"));break;case 43:case 61:case 187:case 107:a.R.Ic=o;a.dispatchEvent(new N("onpluspress"));break;case 33:a.R.Ic=q;a.R.Fi=o;a.zg(0,Math.round(0.8*a.height));oa(b);break;case 34:a.R.Ic=q;a.R.Fi=o;a.zg(0,-Math.round(0.8*a.height));oa(b);break;case 35:a.R.Ic=q;a.R.Fi=o;a.zg(-Math.round(0.8*a.width), 0);oa(b);break;case 36:a.R.Ic=q;a.R.Fi=o;a.zg(Math.round(0.8*a.width),0);oa(b);break;case 37:a.R.Ic=o;a.R.kc|=1;a.hb();oa(b);break;case 38:a.R.Ic=o;a.R.kc|=2;a.hb();oa(b);break;case 39:a.R.Ic=o;a.R.kc|=4;a.hb();oa(b);break;case 40:a.R.Ic=o,a.R.kc|=8,a.hb(),oa(b)}});x.M(document,"keyup",function(b){if(a.B.tx)switch(b=window.event||b,b.keyCode||b.which){case 37:a.R.kc&=-2;0!=a.R.kc&&a.hb();break;case 38:a.R.kc&=-3;0!=a.R.kc&&a.hb();break;case 39:a.R.kc&=-5;0!=a.R.kc&&a.hb();break;case 40:a.R.kc&=-9, 0!=a.R.kc&&a.hb()}a.R.Ic=q});La.prototype.hb=function(){if(!this.hb.wy||!(this.hb.aB==this.R.kc&&this.R.Fi==o)){var a=this,c=a.R.kc;a.hb.aB=c;a.hb.ay=30;a.hb.duration=999;a.hb.kf=a.hb.lf=0;c&1&&(a.hb.kf=1);c&2&&(a.hb.lf=1);c&4&&(a.hb.kf=-1);c&8&&(a.hb.lf=-1);c&1&&c&4&&(a.hb.kf=0);c&2&&c&8&&(a.hb.lf=0);if(!a.hb.wy){a.hb.wy=o;a.hb.time=cb();a.hb.zV=a.hb.time;a.dispatchEvent(new N("onmovestart"));var d=new ub({Hc:a.hb.ay,duration:a.hb.duration,hc:vb.SM,va:function(){var c=a.hb,f=a.R.kc;if(a.hb.aB!=f){a.hb.aB= f;if(f&1)c.kf=1;if(f&2)c.lf=1;if(f&4)c.kf=-1;if(f&8)c.lf=-1;if(f&1&&f&4)c.kf=0;if(f&2&&f&8)c.lf=0}if(a.R.Fi==o){c.kf=0;c.lf=0}var f=cb(),g=Math.pow((f-c.zV)/c.duration,2);if(!a.R.kc){c.wy=q;d.YF=o;a.hb.time=cb();setTimeout(function(){a.dispatchEvent(new N("onmoveend"))},40)}var i=f-c.time,k=c.kf*i*g>=0?Math.ceil(c.kf*i*g):Math.floor(c.kf*i*g),g=c.lf*i*g>=0?Math.ceil(c.lf*i*g):Math.floor(c.lf*i*g);if(k!=0&&g!=0){k=Math.round(k*0.7);g=Math.round(g*0.7)}c.time=f;a.Me(a.offsetX+k,a.offsetY+g)},finish:function(){a.hb.time= cb();setTimeout(function(){a.hH()},a.hb.ay)}})}}};La.prototype.hH=function(){var a=this,c=a.hb;a.R.Fi&&(c.kf=0,c.lf=0);if(a.R.kc){var d=cb(),e=d-c.time,f=Math.ceil(c.kf*e),e=Math.ceil(c.lf*e);c.time=d;a.Me(a.offsetX+f,a.offsetY+e);setTimeout(function(){a.hH()},c.ay)}else c.wy=q,a.dispatchEvent(new N("onmoveend"))}}); ');