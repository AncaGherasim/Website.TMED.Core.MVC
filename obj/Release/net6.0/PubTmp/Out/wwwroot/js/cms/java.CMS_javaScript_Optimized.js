// JavaScript Document
var myWind = null;
var childWin;
$.fn.popupCMSNewWindow = function(instanceSettings){
	return this.each(function(){
	$(this).click(function(){
		var scrollB = 0;
		//  myWind.close();
		//  alert(window.name);
		window.name == 'one' ? scrollB = 1 : scrollB = 0;
		$.fn.popupCMSNewWindow.defaultSettings = {
			centerBrowser:0, // center window over browser window? {1 (YES) or 0 (NO)}. overrides top and left
			centerScreen:0, // center window over entire screen? {1 (YES) or 0 (NO)}. overrides top and left
			height:500, // sets the height in pixels of the window.
			left:0, // left position when the window appears.
			location:0, // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
			menubar:0, // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
			resizable:0, // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
			scrollbars:1, //scrollB, // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
			status:0, // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
			width:500, // sets the width in pixels of the window.
			windowName:null, // name of window set from the name attribute of the element that invokes the click
			windowURL:null, // url used for the popup
			top:0, // top position when the window appears.
			toolbar:0 // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
		};
		CMSsettings = $.extend({}, $.fn.popupCMSNewWindow.defaultSettings, instanceSettings || {});
		CMSsettings.height > 500 ? CMSsettings.scrollbars = 1 :'';
		var windowCMSFeatures = 'height=' + CMSsettings.height +
								',width=' + CMSsettings.width +
								',toolbar=' + CMSsettings.toolbar +
								',scrollbars=' + CMSsettings.scrollbars +
								',status=' + CMSsettings.status + 
								',resizable=' + CMSsettings.resizable +
								',location=' + CMSsettings.location +
								',menuBar=' + CMSsettings.menubar;
		
		    CMSsettings.windowName = this.name || CMSsettings.windowName;
			CMSsettings.windowURL = this.href || CMSsettings.windowURL;
			var centeredY,centeredX;
			if(CMSsettings.centerBrowser){
				//if ($.browser.msie) {//hacked together for IE browsers
				if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){ //IF IE > 10 
					//alert('is IE');
					centeredY = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (CMSsettings.height/2)));
					centeredX = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (CMSsettings.width/2)));
				}else{
					//alert('is not IE');
					centeredY = window.screenY + (((window.outerHeight/2) - (CMSsettings.height/2)));
					centeredX = window.screenX + (((window.outerWidth/2) - (CMSsettings.width/2)));
				};
				window.open(CMSsettings.windowURL, CMSsettings.windowName, windowCMSFeatures+',left=' + centeredX +',top=' + centeredY).focus()
			}else if(CMSsettings.centerScreen){
				centeredY = (screen.height - CMSsettings.height)/2;
				centeredX = (screen.width - CMSsettings.width)/2;
				window.open(CMSsettings.windowURL, CMSsettings.windowName, windowCMSFeatures+',left=' + centeredX +',top=' + centeredY).focus();
			
			}else{
				window.open(CMSsettings.windowURL, CMSsettings.windowName, windowCMSFeatures+',left=' + CMSsettings.left +',top=' + CMSsettings.top).focus();
			};
			return false;
		});
	});	
};
function IsMobile() {
    if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
         || navigator.userAgent.match(/Windows mobile/i)
         || navigator.userAgent.match(/IEMobile/i)
         || navigator.userAgent.match(/Opera Mini/i)){
        return true;
    }
    else {
        return false;
    };
};
var urlSite = window.location.href.match(/\/latin\/|\/asia\/|\/europe\//);
urlSite === null ? urlSite = "/" : '';
$(document).ready(function() {	   
	setCMSLink()
});
function setCMSLink(){
	IsMobile() ? '' :
	$('.aCMStxtLink').each(function(){	
		var set = $(this).attr('rel');
		set == undefined || set == '' ? set = '700,500' : '';
		var setPrt = set.split(',');
		var setHref = $(this).attr('href')
		setHref.match(/\/latin\/|\/asia\/|\/europe\//) === null ? $(this).attr('href', urlSite + setHref.substring(1,setHref.length)) : '';
		$(this).popupCMSNewWindow({centerBrowser:1,heigh:setPrt[1],width:setPrt[0]});
	});		
};
function centerWindow(jnewurl){	
	if(winOp.closed == false){
		winOp.close();
	}
	var noHnoF = '?CMS&wH=0&wF=0';
	jnewurl.indexOf('?') == -1 ? jnewurl = jnewurl + noHnoF : '';
	var windowCMSFeatures = 'height= 600' +
							',width= 950' +
							',toolbar=0' +
							',scrollbars= 1' +
							',status=0' + 
							',resizable= 0' +
							',location= 0' +
							',menuBar= 0';
		var centeredY,centeredX;
		if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){ //IF IE > 10 
			centeredY = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (600/2)));
			centeredX = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (950/2)));
		}else{
			centeredY = window.screenY + (((window.outerHeight/2) - (600/2)));
			centeredX = window.screenX + (((window.outerWidth/2) - (950/2)));
		};	
    	winOp = window.open(jnewurl, 'one', windowCMSFeatures +',left=' + centeredX +',top=' + centeredY);
		winOp.focus(); 
};