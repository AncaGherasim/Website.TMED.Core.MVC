// JavaScript Document
// ********************************************
// TO USE TO FIX PATH FROM FOLDER OR SUBDOMAIN
// ********************************************
var seoDir='/';
var seoURL = document.URL.toLowerCase();
var seoMatch = seoURL.match(/\/latin\/|\/asia\/|\/europe\//); 
if (seoMatch != null){seoDir = seoMatch};
// ********************************************
function gotoURL(tourl,w,h){
	var winNAp = tourl.split('/');
	var winNA = winNAp[3]+winNAp[4];
	var newURL = tourl;
	if (typeof(varpsite) != 'undefined'){
		newURL = newURL.replace(varpsite, varssite);
	};
	newURL.charAt(0) === "/" ? newURL.match(/\/latin\/|\/asia\/|\/europe\//) === null ? newURL = seoDir + newURL.substring(1,newURL.length) : '' : '';
	if(newURL.charAt(0) == 'h'){
		var urlF = newURL;
		var urlMatch = newURL.match(/latin\.|asia\.|europe\./);
		if(urlMatch != null){
			newURL = newURL.replace('.com/', '.com'+seoDir);
			winNAp = tourl.split('/');
			winNA = winNAp[4]+winNAp[5];
			if(seoMatch != null){
				newURL = newURL.replace(urlMatch,'www.');
			};
		};
	};
	var LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
	var TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
	settings = 'height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,resizable';
 	window.open(newURL,winNA,settings);
};
function gotoURLwBack(tourl,w,h){
	var LeftPosition ;
	var TopPosition ;
	var settings;
	var navAg = navigator.userAgent;
	var newURL = tourl;
	var winNAp = tourl.split('/');
	var winNA = winNAp[3]+winNAp[4];
	if (typeof(varpsite) != 'undefined'){
		newURL = newURL.replace(varpsite, varssite);
	};
	newURL.charAt(0) === "/" ? newURL.match(/\/latin\/|\/asia\/|\/europe\//) === null ? newURL = seoDir + newURL.substring(1,newURL.length) : '' : '';
	if(newURL.charAt(0) == 'h'){
		var urlF = newURL;
		var urlMatch = newURL.match(/latin\.|asia\.|europe\./);
		if(urlMatch != null){
			newURL = newURL.replace('.com/', '.com'+seoDir);
			winNAp = tourl.split('/');
			winNA = winNAp[4]+winNAp[5];
			if(seoMatch != null){
				newURL = newURL.replace(urlMatch,'www.');
			};
		};
	};
	LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
	TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
	if(navAg.indexOf('Firefox')>=0){
		settings = 'height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,resizable,toolbar=yes';
	}
	else if(navAg.indexOf('Chrome')>=0){
		settings = 'height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+'';
	}
	else{
		settings = 'height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,resizable,location=yes';
	};
	window.open(newURL,winNA,settings);
};
function dvOpenClose(txt,iobj){
	var opcl = document.getElementById(txt).innerHTML;
	if(opcl.indexOf('more') > -1){document.getElementById(iobj).style.display = 'block'; document.getElementById(txt).innerHTML = '<u>close info</u>';};
	if(opcl.indexOf('close') > -1){document.getElementById(iobj).style.display = 'none'; document.getElementById(txt).innerHTML = '<u>more info</u>';};
};
/* MORE Info */
var eleT;
var eleW;
var bxSite = 'infoBox';
var bpDom;
var domainCMS = '';
$( document ).click(function( event ) {
	eleT = event.pageY;
	eleW = event.pageX;
});
var dvPre = 0;
function CMSmoreInfo(id,iW,iH){
	var siteAB = $(location).attr('href');
	if (siteAB.toLowerCase().indexOf('latindestinations.com') > -1){bxSite = 'infoBoxLD';};
	if (siteAB.toLowerCase().indexOf('tvlapi') > -1){
		bpDom = document.domain.toLowerCase();
		switch (bpDom){
			case 'reservations.europeandestinations.com':
				domainCMS = 'http://www.europeandestinations.com';
			break;
			case 'reservations.latindestinations.com':
				doaminCMS = 'http://www.latindestinations.com';
			break;
			case 'reservations.solartours.com':
				domainCMS = 'http://asia.solartours.com';
			break;
			case 'reservations.tripmasters.com':
				domainCMS = 'http://www.tripmasters.com';
			break;
			default:
			break;
		};
	};
	var wW = $(window).width();
	var objT = eleT;
	var dvC = 0;
	var dvIndex
	dvIndex = Number(5000) + dvPre;
	var dvW;
	var dvML = ((iW+25)/2)-(iW+25);
	var insDIV = '<div id="cmsInfo'+dvPre+'" style="display:none; position:absolute;" class="dvPageBox">';
		insDIV = insDIV + '<div id="infoClose'+dvPre+'" onclick="CMScloseInfo('+dvPre+');" class="infoClose">close [x]</div>';
	insDIV = insDIV + '<div id="infoTxt' + dvPre +'" style="width:300px; padding:30px 30px; height:300px; overflow:auto; text-align:center;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" /></div>'
		insDIV = insDIV + '</div>';
	$('body').prepend(insDIV);
	$('#cmsInfo'+dvPre+'').attr('style','position:absolute; z-index:'+dvIndex+'; padding:25px; top:'+ objT +'px; margin-left:'+Number(dvML)+'px; left:50%; text-align:center;');
		$('#cmsInfo'+dvPre+'').fadeIn(2000);
	$.get(domainCMS + seoDir +'cms/'+ id +'/Web_Content.aspx?&iscms=yes', function(data){
	   	$('#infoTxt'+dvPre+'').html(data);
	   	$('#infoTxt'+dvPre+'').attr('style','overflow:auto; width:'+iW+'px; height:'+iH+'px;');
		
		CMSscrollTo(objT);
		dvPre++;
	 });
};
function CMScloseInfo(thisN){
	$('#cmsFIN'+thisN+'').html('').remove();
	$('#infoTxt'+thisN+'').html('').remove();
	$('#infoClose'+thisN+'').html('').remove();
	$('#'+bxSite+thisN+'').html('').remove();
	$('#cmsInfo'+thisN+'').html('').remove();
};
function CMSscrollTo(top){
	$('body,html').animate({
				scrollTop: top - 15
			}, 800);
};