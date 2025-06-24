// JavaScript Document
var isNumber = /[0-9]+/g;
var winWidth = (window.screen.width);
var winHeight = (window.screen.height);
// --- GET MOBILES
function IsMobileDevice() {
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
// *** GET BROWSERS *** //
function identifyBrowser(userAgent, elements) {
    var regexps = {
            'Chrome': [ /Chrome\/(\S+)/ ],
            'Firefox': [ /Firefox\/(\S+)/ ],
            'MSIE': [ /MSIE (\S+);/ ],
            'Opera': [
                /Opera\/.*?Version\/(\S+)/,     /* Opera 10 */
                /Opera\/(\S+)/                  /* Opera 9 and older */
            ],
            'Safari': [ /Version\/(\S+).*?Safari\// ]
        },
        re, m, browser, version;
 
    if (userAgent === undefined)
        userAgent = navigator.userAgent;
 
    if (elements === undefined)
        elements = 2;
    else if (elements === 0)
        elements = 1337;
 
    for (browser in regexps)
        while (re = regexps[browser].shift())
            if (m = userAgent.match(re)) {
                version = (m[1].match(new RegExp('[^.]+(?:\.[^.]+){0,' + --elements + '}')))[0];
                return browser + ' ' + version;
            }
 
    return null;
};
// *** TEXT FUNCTIONS *** //
function changeIt(val, sta){
var state   = sta //"urlenc" //setRadio();
var len     = val.length;
var backlen = len;
var i = 0;
var newStr  = "";
var frag    = "";
var encval  = "";
var original = val;
	if (state == "none"){// needs to be converted to normal chars
		while (backlen > 0){
			lastpercent = val.lastIndexOf("%");
			if (lastpercent != -1){ // we found a % char. Need to handle everything *after* the %
				frag = val.substring(lastpercent+1,val.length);
				// re-assign val to everything *before* the %
				val  = val.substring(0,lastpercent);
				if (frag.length >= 2) { // end contains unencoded
					//  alert ("frag is greater than or equal to 2");
					encval = frag.substring(0,2);
					newStr = frag.substring(2,frag.length) + newStr;
					//convert the char here. for now it just doesn't add it.
					if ("01234567890abcdefABCDEF".indexOf(encval.substring(0,1)) != -1 &&  "01234567890abcdefABCDEF".indexOf(encval.substring(1,2)) != -1){
						encval = String.fromCharCode(parseInt(encval, 16)); // hex to base 10
						newStr = encval + newStr; // prepend the char in
					}
					// if so, convert. Else, ignore it.
				}
				// adjust length of the string to be examined
				backlen = lastpercent;
				// alert ("backlen at the end of the found % if is: " + backlen);
			}
			else{
				newStr = val + newStr; backlen = 0;
			} // if there is no %, just leave the value as-is
		
		} // end while
	} // end 'state=none' conversion
	else { // value needs to be converted to URL encoded chars
		for (i=0;i<len;i++){
			if (val.substring(i,i+1).charCodeAt(0) < 255){  // hack to eliminate the rest of unicode from this
				if (isUnsafe(val.substring(i,i+1)) == false){
					newStr = newStr + val.substring(i,i+1);
				}
				else{
					newStr = newStr + convert(val.substring(i,i+1));
				}
			}
			else { // woopsie! restore.
					alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
					// set back to "no encoding"
					newStr = original; i=len; // short-circuit the loop and exit
			}
		}

	}
return newStr
};
// ***  CURRENCY *** //
var num;
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if (isNaN(num)) num = '0';
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) cents = '0' + cents;
	var untilTO = Math.floor(num.length);
	untilTO = Number(untilTO) - 1;
	for (var i = 0; i < Math.floor(Number(untilTO + i) / 3) ; i++)
	num = num.substring(0,Number(num.length) - (4*i+3)) + ',' + num.substring(Number(num.length) - (4*i+3));
	return (((sign) ? '' : '-') + '$' + num ); //+ '.' + cents);
};
// --- GET POSITION *** //
function ObjectPosition(obj) {
    var curleft = 0;
    var curtop = 0;
	if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    };
	
    return [curleft, curtop];
};
// --- BUSINESS DAY *** ///
function getBusinessDateObj(businessDays) {
  var now = new Date();
  now.setTime(now.getTime() - 0 * 24 * 60 * 60 * 1000);
  var dayOfTheWeek = now.getDay();
  var calendarDays = businessDays;
  var bookDay = dayOfTheWeek + businessDays;
  if (bookDay >= 6) {
    businessDays -= 6 - dayOfTheWeek;  //deduct this-week days
	calendarDays += 2;  //count this coming weekend
	bookWeeks = Math.floor(businessDays / 5); //how many whole weeks?
	calendarDays += bookWeeks * 2;  //two days per weekend per week
  }
  now.setTime(now.getTime() + calendarDays * 24 * 60 * 60 * 1000);
  return now;
};
// *** POP UP SEARCH *** ///
var $dvSearch;
var $dvSearchDes;
var	$dvMAsk;
//var $dvSelDst;
$(document).ready(function() {
	$dvSearch=$('#search_box');
	$dvSearchDes=$('#search_Destinos');
	$dvMAsk=$('#mask');
	//$dvSelDst=$('#dvSelDst');
		var popID
		var objGO
		$('#qq').click(function (e) {
		    popID =  'search_box'
			var maskH = $(document).height();
			var maskW = $(window).width();
			$('#mask').css({'width':maskW,'height':maskH}); 
			$('#mask').fadeIn(1000);
			$('#mask').fadeTo("slow",0.8);
			var popL = ObjectPosition(this);
			var popW = popL[0] - 200
			var popH = popL[1] //+ 100
			$dvSearch.attr('style','padding:20px; position:absolute; width:480px; height: 110px; display:none; z-index:9999; left:'+ popW + 'px; top:'+ popH +'px'); // popW/2- $(popID).width()/2); 
			$dvSearch.fadeIn(2000);
			$dvSearch.hAlign();
		});
		$('#mask').click(function () {
			$(this).hide();
			$('#'+popID+'').hide();
		});
	
		$('#pcls').click(function () {
			$('#search_box').hide();
			$('#mask').hide();
		});
		
		$('.imgCityInfo').click(function(){
			var left;
    		var top = $(this).position().top - 30 ;
			var dvShw = 'dv'+this.id.match(isNumber);
			if ($.browser.msie)
			{
				left = $(this).position().left;
				$('#dvPopUp').css({ "left": left + "px", "top": top  + "px" });
			}
			else
			{
				left = $(this).position().left;
				$('#dvPopUp').css({ "left": left + 30 + "px", "top": top + "px" });
			}
			$('#dvPopUp').hide();
			$('#dvPopContent').empty();
			$('#dvPopContent').html($('#'+dvShw+'').html());
			$('#dvPopUp').show();
			return false;
		});
		$('.dvBoxClose').click(function(){
				$('#dvDetailInfo').html('');
				$('#dvInfoContainer').css({'display':'none'});						
		});
		$('.clkMore').click(function(){
				var idNum = this.id.match(isNumber);
				var imgSrc = $('#img'+idNum+'').attr('src') 
				//https://pictures.tripmasters.com/siteassets/d/Plus.jpg -- pLeftNoWrap
				imgSrc.indexOf('Plus') > - 1 ? 
				($('#img'+idNum+'').attr('src', imgSrc.replace('Plus','Minus')), $('#plus'+idNum+'').hide().removeClass('pLeftNoWrap'), $('#minus'+idNum+'').show().addClass('pLeftNoWrap'), $('#spMore'+idNum+'').html('close more info'))
				: ($('#img'+idNum+'').attr('src', imgSrc.replace('Minus','Plus')), $('#plus'+idNum+'').show().removeClass('pLeftNoWrap'), $('#minus'+idNum+'').hide().addClass('pLeftNoWrap'), $('#spMore'+idNum+'').html('more info')) ; 
		});
});

// *** POP UP CAL FUNCTIONS *** ///
(function ($) {
	$.fn.hAlign = function() {
		return this.each(function(i){
			var w=$(this).width();
			var ow=$(this).outerWidth();
			var ml=(w + (ow - w)) / 2;
			$(this).css("position", "absolute");
			$(this).css("left","50%");
			$(this).css("margin-left","-"+ml+"px");
		});
	};
})(jQuery);
// *** ACTIVE CHECK BOX *** ///
function activeCckBx(frm) {
    $('#' + frm + ' input:checkbox').each(function () {
        (this.checked) ? $('#false' + this.id + '').addClass('falsecheckeddop') : $("#false" + this.id + '').removeClass('falsecheckeddop');
    });
    // function to 'check' the fake ones and their matching checkboxes
	var replID;
    $('#' + frm + ' .falsecheckdop').click(function () {
		this.id.indexOf('falsedot') > -1 ? replID = this.id.replace('falsedot', '') : this.id.indexOf('false') > - 1 ? replID = this.id.replace('false', '') : '';				 
        if (($(this).hasClass('falsecheckeddop'))) {
            $(this).removeClass('falsecheckeddop')
            $('#' + replID + '').removeAttr('checked');
        } else {
            $(this).addClass('falsecheckeddop');
            $('#' + replID + '').attr('checked', true);
        }
        $(this.hash).trigger("click");

        return false;
    });
};
// --- DISTANCE BETWEEN POINTS --- //
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
};
function deg2rad(deg) {
    return deg * (Math.PI / 180)
};
// --- TO TAKE ID FROM FORM TO FIND PACKAGES --- //
//used in GP2_CityPage.cshtml instead of the same function from dt.java.gp2page.js
function findPacks(formID) {
	if ($('#' + formID + ' #allID').val() != '') {
		$('#' + formID + ' #allID').val('')
	}
	if ($('#' + formID + ' #allNA').val() != '') {
		$('#' + formID + ' #allNA').val('')
	}

	var idForm = formID
	var idString = $('#' + idForm + '').serialize();
	idString = idString.substring(0, idString.indexOf("&__RequestVerificationToken"))
	var idStrParts
	var idxOf
	var idValP
	var idVal
	var idValN
	var idToFind = ''
	var idID
	var idNA
	var chkCHK = 0
	idString = idString.replace(/\+/g, ' ');
	idString = idString.replace(/\%7C/g, '|');
	idStrParts = idString.split('&');
	for (i = 0; i < idStrParts.length; i++) {
		idValP = idStrParts[i].split('=');
		if (idValP[1] != '') {
			chkCHK = chkCHK + 1
			idValN = idValP[1].split('|');
			if (chkCHK > 1) {
				idID = idID + ',' + idValN[0].replace(/\s/g, '');
				idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
			}
			else {
				idID = idValN[0].replace(/\s/g, '_');
				idNA = idValN[1].replace(/\s/g, '-');
			}

		}

	}
	if (idID == undefined) {
		alert('Please check at least one box. Thanks!');
		return;
	}
	else {
		$('#allID').val(idID);
		$('#allNA').val(idNA);
		window.location.href = SiteName + '/' + idNA.toLowerCase() + '/find-packages';
	}
};
// --- OPEN INFORMATION PACK DIV ---  //
function openDivInf(obj,typ,web,plc){
	//alert(obj +' | '+ typ +' | '+ web +' | '+ plc);
	var dvShow; 
	var picShw;
	plc != undefined ? dvShow = 'dvpkInf'+obj+plc : dvShow = 'dvpkInf'+obj;
	plc != undefined ? picShw = 'pic'+obj+plc : picShw = 'pic'+obj;
	if(typ == 1){
		$('#otherMr').show();
		$('div[id^="dvpkInf"]').each(function(){
			var id = this.id.match(isNumber);								  
			if(id != obj){
				$(this).hide(); //slideUp('slow');
				$('#dvMrTxt'+id+'').show();
				$('#dvMrPic'+id+'').hide();
			}else{
				$(this).slideDown('slow');
				$('#dvMrTxt'+id+'').hide();
				$('#dvMrPic'+id+'').show();
				relPackCall(obj,web,plc);
			};
		});	
	}else if(typ == 2){
		$('#'+dvShow+'').slideUp('slow', function(){
			$('#dvMrTxt'+obj+'').show();
			$('#dvMrPic'+obj+'').hide();									  
			$('#otherMr').hide();										  
		});
	}else if(typ == 3){
		var srcImg = $('#'+picShw+'').attr('src');
		if (srcImg.indexOf('Plus') > -1){
			 $('#'+dvShow+'').slideDown('slow');
			 relPackCall(obj,web,plc);
			$('#' + picShw + '').attr('src','https://pictures.tripmasters.com/siteassets/d/minus.jpg');
		}
		else{
			$('#'+dvShow+'').slideUp('slow');
			$('#' + picShw + '').attr('src','https://pictures.tripmasters.com/siteassets/d/Plus.jpg');
		};
	}else if(typ ==4){
		 var picPM = $('#pic' + obj + '').attr('src');
		if (picPM.indexOf('Plus') > -1) {
			$('#dvWait' + obj + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" />');
			$('#dvWait' + obj + '').show();
			$('#moreTx' + obj + '').html('Close more details');
			$('#pic' + obj + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");
			relPackCall(obj);
		}
		else if (picPM.indexOf('Minus') > -1) {
			$('#moreTx' + obj + '').html('More details');
			$('#pic' + obj + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
			$('#dvpkInf' + obj + '').slideUp();
		};
	
	};
};
function openDivInfFNwXXX(objID) {
    var picPM = $('#pic' + objID + '').attr('src');
    if (picPM.indexOf('Plus') > -1) {
		$('#dvWait' + objID + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" />');
        $('#dvWait' + objID + '').show();
        $('#moreTx' + objID + '').html('Close more details');
		$('#pic' + objID + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");
        relPackCallFNw(objID);
    }
    else if (picPM.indexOf('Minus') > -1) {
        $('#moreTx' + objID + '').html('More details');
		$('#pic' + objID + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
        $('#pkInf' + objID + '').slideUp();
    };
};
function relPackCall(packID) {
    var relTxt = '';
    var mrChoice = '';
    var divCom = 'dvCom' + packID;
    var divInf = 'dvpkInf' + packID;
    var divRel = 'dvRel' + packID;
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/sqlRelPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            console.log("Success: " + data);
            msg = data;
            if (msg != '') {
                relTxt = '<div class="txt_grayLight11" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                mrChoice = '<div class="txt_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    echP = strPrts[i].split('|');
                    relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
					relTxt = relTxt + '<a href="/europe/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                    relTxt = relTxt + '<span class="txt_grayLight11">'
                    relTxt = relTxt + '<u>' + echP[0] + ' (' + echP[1] + ')</u>'
                    relTxt = relTxt + '</span></a></span>'
                    if (echP[2] != 5) {
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '" >' + echP[0] + '</a>'
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '" id="dop' + echP[3] + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                        mrChoice = mrChoice + '</span>'
                    }
                }
                relTxt = relTxt + '<br style="clear:both"/></div>';
                console.log("relTxt: " + relTxt);
                mrChoice = mrChoice + '<br style="clear:both"/></div>';
                $('#' + divRel + '').html(relTxt);
                $('#' + divCom + '').html(mrChoice);
                $('#dvWait' + packID + '').hide();
                $('#dvWait' + packID + '').html('');
                $('#' + divInf + '').slideDown();
                activeCckBx('frm' + packID);
            }
        },
        error: function (xhr, desc, exceptionobj) {
            //alert(xhr.responseText + ' = error');
            console.log("Error: " + xhr.responseText);
            $('#dvWait' + packID + '').html(xhr.responseText);
        }
    });
};
// --- Open info pop up --- //
function hidePopUpInfo() {
    $('.dvPopUp').hide();
    return false;
};
// -- Build Browse destinations w Feed Backs -- //
//function broseDestFeed(){
//	if($('#dvSelDst').length > 0){
//		var $dvSelDst = $('#dvSelDst');	
//		$.ajax({
//			type: "POST",
//			url: "/europe/WS_Library.asmx/allDestOnFeed",
//			contentType: "application/json; charset=utf-8",
//			dataType: "json",
//			data: "{ 'user': '243' }",
//			success: function(data) {
//				var destDT = data.d;
//				dvSelectDst = '<select class="Text_Arial12" name="tripTake" id="tripTake">'+
//							  '<option value="0" selected="selected" class="optItalic">Select a destination</option>'
//				var eachOPT = destDT.split('@');
//				for(d=0;d<=eachOPT.length-2;d++){
//					var optVAL = eachOPT[d].split('|');
//					var x = optVAL[0]; 
//					if (x.charAt(0) == '"'){ optVAL[0] = optVAL[0].replace('"','');}
//					dvSelectDst = dvSelectDst + '<option value="'+ optVAL[1] +'">'+ optVAL[0] +'</option>'
//				}
//				dvSelectDst = dvSelectDst + '</select>'
//				$dvSelDst.html(dvSelectDst);
//				$("#tripTake").change(goToBrowse);
				
//			},
//			error: function (xhr, desc, exceptionobj) {
//				alert(xhr.responseText +' = error');
//				$dvSelDst.html(xhr.responseText);
//			}
//		});
//	};
//};
function goToBrowse(){
	var brwVal
	brwVal = $('#tripTake option:selected');
	window.location = brwVal.val()
};
// *** Guided *** //
function showPopUp(popID){
	var mess
	var objLoc
	var objT
	var objL
	var dvMess 
	objLoc = ObjectPosition(document.getElementById(popID));
	objL = objLoc[0] - 5 + 'px';
    objT = objLoc[1] + 16 + 'px';
	if(popID.indexOf('Partially') != -1){
		mess = '<div style="padding:0px 0px 7px 0px;"><b>Partially Guided:</b></div>'
		mess = mess + '<div>'+ $('#inpparGuided').val().replace('.','.<br><br>') +'</div>';
	}
	else if (popID.indexOf('none') != -1){
		mess = '<div style="padding:0px 0px 7px 0px;"><b>None:</b></div>'
		mess = mess + '<div>has no value</div>';
	}
	else{
		mess = '<div style="padding:0px 0px 7px 0px;"><b>Guided:</b></div>'
		mess = mess + '<div>'+ $('#inpGuided').val() +'</div>';
	}
	dvMpop = $('<div id="dvMess" class="Text_12_Blue"></div>'); 
	$('body').append(dvMpop);
	$('#dvMess').html(mess);
	$('#dvMess').attr('style','left:'+ objL +'; top:'+objT+'; position:absolute; display:block; border:solid 1px black; width:300px; padding:10px; background-color:#FFF;')
	$('#dvMess').show();
};
function hidePopUp(popID){
	$('#dvMess').hide();
};
function windowCMS(id,w,h){
	var LeftPosition; 
	var TopPosition; 
	var settings;
	var navAg = navigator.userAgent;
	var dom = document.domain;
	var newURL = '/europe/cms/' + id + '?cms&wh=0&wf=0'; //tourl.replace('latindestinations.com',dom); //tourl
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
	window.open(newURL,"CMS_Window",settings);
};
function openMapBubble(mess){
	var objPos = $('#dvBigMap').offset();
	$('#dvHotelInfo').html(mess);
	$('#dvHstInfContainer').css({'top':''+ Number(objPos.top + 600) +'px','width':'500px','position':'absolute','left':'50%','margin-left':'-250px','z-index':'8110'});
	$('#dvHstInfContainer').css({'display':'block'}).animate({'top':''+ Number(objPos.top + 300) +'px'}, 'slow');
};
function cmsPopUp(cmsid,obj){
	var objPos = $(obj).offset();
	$.ajax({
		type: "POST",
		url: "/europe/WS_Library.asmx/sqlThisCMS",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: '{cmsID:"' + cmsid + '"}',
		success: function(data) {
			msg = eval("(" + data.d + ")");
			if (msg != ''){
				'https:' === document.location.protocol ? (msg = msg.replace(/http:/g, 'https:')):'';
				$('#dvDetailInfo').html(msg);
				$('#dvInfoContainer').css({'display':'block'});
				$('#dvInfoContainer').css({'top':''+ Number(objPos.top)-200 +'px','z-index':'8110','position':'absolute'}); //,'width':'650px','position':'absolute','left':'50%','margin-left':'-325px'});
				var dvW = $('#dvDetailInfo').outerWidth();
				$('#dvInfoContainer').animate({'width':''+dvW+'px','left':'50%','margin-left':'-'+dvW/2+'px'});		
			};
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText +' = error');
		}
	});	
};