/**/_jsload2&&_jsload2('geoctrl', 'x.extend(Rc.prototype,{initialize:function(a){var b=this;Nc.prototype.initialize.call(b,a);b.Ba();b.Ar={"default":B.la+"images/geolocation-control/mobile/default-40x40.png",loading:B.la+"images/geolocation-control/mobile/loading-40x40.gif",success:B.la+"images/geolocation-control/mobile/success-40x40.png",fail:B.la+"images/geolocation-control/mobile/fail-40x40.png"};b.sj=b.C.children[0];b.PD=b.sj.children[0];b.cp=b.PD.children[0];b.ND=b.sj.children[1];b.AL=b.ND.children[0].children[0];var c;b.D.addEventListener("moveend", function(){if(c){var a=b.D.pc();a.lng===c.lng&&a.lat===c.lat?b.Vr(b.Ar.success):(b.Vr(b.Ar["default"]),b.WQ())}});x.M(b.cp,"click",function(){b.Vr(b.Ar.loading);(new Geolocation({timeout:1E4})).getCurrentPosition(function(d){b.Vr(b.Ar.success);if(d.address&&b.k.G_){var e="";d.address.city?e+=d.address.city:d.address.province&&(e+=d.address.province);d.address.district&&(e+=d.address.district);d.address.street&&(e+=d.address.street);d.address.street_number&&(e+=d.address.street_number);b.vU(e)}var f= new K(d.longitude,d.latitude),e=new W(f,{icon:b.k.ZM?b.k.ZM:new jd(B.la+"images/geolocation-control/point/position-icon-14x14.png",new M(14,14))});c=f;b.QD=f;a.Ja(e);a.Gd(f,15);d.address&&(b.ls={province:d.address.province||"",city:d.address.city||"",district:d.address.district||"",street:d.address.street||"",streetNumber:d.address.street_number||""},Ra(7001,{longitude:d.longitude,latitude:d.latitude,accuracy:d.accuracy}));d=new N("locationSuccess");d.point=b.QD;d.marker=e;d.addressComponent=b.ls; b.dispatchEvent(d)},function(a){b.Vr(b.Ar.fail);var c=new N("locationError");c.code=a.errorCode;c.message=a.nf;b.dispatchEvent(c)})});return b.C},location:function(){var a=this;a.u0.push({});(new Geolocation({timeout:1E4})).getCurrentPosition(function(b){a.QD=new K(b.longitude,b.latitude);b.address&&(a.ls={province:b.address.province||"",city:b.address.city||"",district:b.address.district||"",street:b.address.street||"",streetNumber:b.address.street_number||""});b=new N("locationSuccess");b.point= a.QD;b.addressComponent=a.ls;a.dispatchEvent(b)},function(b){var c=new N("locationError");c.code=b.errorCode;c.message=b.nf;a.dispatchEvent(c)})},pX:function(){return this.ls?this.ls:p},uQ:function(){this.D?this.Ie(this.D):this.map&&this.Ie(this.map)},Ba:function(){Nc.prototype.Ba.call(this);this.C.style.cssText="height: 32px;";this.C.innerHTML=this.fr()},fr:function(){return[\'<div class="BMap_geolocationContainer" style="height: 32px; margin: 0px; box-sizing: border-box; border: 1px solid #d9d7d5; border-radius: 3px; -webkit-box-shadow: 1px 1px 1px rgba(0,0,0,.2); overflow: hidden;">\', \'<div class="BMap_geolocationIconBackground" style="float: left; width: 32px; height: 32px; background-image: url(\\\'\'+B.la+"images/geolocation-control/mobile/gradient-bg-1x64.png\'); background-size: 1px 32px; background-repeat: repeat-x;\\">",\'<div class="BMap_geolocationIcon" style="width: 32px; height: 32px; cursor: pointer; background-image: url(\\\'\'+B.la+"images/geolocation-control/mobile/default-40x40.png\'); background-size: 20px 20px; background-repeat: no-repeat; background-position: center center;\\"></div>", "</div>",\'<div class="BMap_geolocationAddress" style="display: none; float: left; min-width: 50px; padding-left: 10px; padding-right: 10px; border-left: 1px solid #d9d7d5; background-image: url(\'+B.la+\'images/geolocation-control/mobile/gradient-bg-1x64.png); background-size: 1px 32px; background-repeat: repeat-x;">\',\'<div style="height: 32px; display: table-cell; vertical-align: middle;"><div class="BMap_geolocationAddressText" style="font-size: 12px; color: #666666; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display: block; min-width: 50px; max-width: 200px;"></div></div></div></div>\'].join("")}, Vr:function(a){this.cp.style.backgroundImage="url(\'"+a+"\')"},vU:function(a){this.ND.style.display="block";this.AL.textContent=a},WQ:function(){this.AL.textContent="";this.ND.style.display="none"}});Rc.prototype.location=Rc.prototype.location;Rc.prototype.getAddressComponent=Rc.prototype.pX; ');