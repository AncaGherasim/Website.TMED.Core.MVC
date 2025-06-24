// JavaScript Document
var packID;
var packNA;
var plcNA;
var pakNTS;
var picSize = 200;
var hwMnyCts; 
var prodID;
var maskH;
var maskW;
var windW;
var windH;
var popID;
var fixDatesdiv;
var totCities;
var msg = '';
var picD = '';
var vidD = '';
var pics = '';
var aPic = '';
var aPicDw = '';
var thumPic = '';
var thumMap = '';
var video = '';
var activeLink = 0;
var picThu = '';
var tCityIDs = '';
var hotQty = 0;
var ssQty = 0;
var imgC = 0;
var shwMaps = '';
var fixedDays = [];
var fxDatesNET;
var citiesAll = [];
var citySelID;
var backCook;
$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
var ctySSPRO = [];
var ctyHotPRO = [];
var allCtySSPRO = [];
var allCtyHotPRO = [];
var HotDispl = [];
var SSDispl = [];
var objPics;
var objImag;
var objMaps;

$(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {       
        //page is loaded from cache
        $('#imgPriceIt1').show();
        $('#imgLoading1').hide();        
    }
});
$(document).ready(function() {
	maskH = $(document).height();
	maskW = $(window).width();	
	windW = maskW;
	windH = $(window).height();
	packID = $('#pakID').val();
	packNA = $('#pakNA').val();
	plcNA = $('#plcNA').val();
	pakNTS = $('#pakNTS').val();
	prodID = $('#prodID').val();
	fxDatesNET = $('#fxNetDates').val();
	fixedDays = fxDatesNET
	fixDatesdiv = fxDatesNET
	
	$('#imgPriceIt1').show();    
    $('#imgLoading1').hide();        
	$('span[id^="#ntsBubble"]').each(function (idex, item) {
		$(this).tooltip();
	})

	if ($('#ntsBubble').length > 0) { priceBubble('ntsBubble', pakNTS); };
	$("#samPriceaAll").scrollable({ vertical: true, mousewheel: true });
	totCities = $('#hwMnyCty').val();
    tCityIDs = $('#tCityIDs').val();
	var cookMark = getCookie('utmcampaign');
		var cookMkVal;
		if (cookMark != null){
			cookMkVal = cookMark.split('=');
			if($('#utm_campaign').length != 0){
				$('#utm_campaign').val(jQuery.trim(cookMkVal[1]));
				$('#valCook').html(cookMkVal[1]);
			};
		};
		
	$('.paxRoomChAg').click(function(){
		$(this).select();
	});
// *****************************************************
	$('span[id^="bubble"]').each(function (idex, item) {
		$(this).tooltip();
	})

	if ($('#bubbleP').length > 0) {
		$('#bubbleP').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<div class="Text_Arial12" style="margin:10px"><b>Itinerary:</b><br>Arrival City, name of Itinerary trying to book, and categories that you can		 select.</div>'
		}
		)
	};
	if ($('#bubble1').length > 0) {
		$('#bubble1').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<div class="Text_Arial12" style="margin:10px"><b>Destination:</b><br>First city may be different than arrival airport.</div>'
		}
		)
	};
	if ($('#bubble2').length > 0) {
		$('#bubble2').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<div class="Text_Arial12" style="margin:10px"><b>Arrival Date:</b><br>Hotel check-in date for your selected city. May be different than flight departure date.</div>'
		}
		)
	};
	if ($('#bubble3').length > 0) {
		$('#bubble3').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<div class="Text_Arial12" style="margin:10px"><b>Flex Stay:</b><br>Adjust number of nights as you wish.</div>'
		}
		)
	};
	if ($('#bubbleStaggerO').length > 0) {
		$('#bubbleStaggerO').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<div class="Text_Arial12" style="margin:10px"><b>Stagger your Payments:</b><br>If you are traveling more than 60 days from now and your package is more than $3,000, you will be able to stagger your payments in several installments!</div>'
		}
		)
	};
	if ($('#bubbleStaggerB').length > 0) {
		$('#bubbleStaggerB').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<b>Stagger your Payments:</b><br>If you are traveling more than 60 days from now and your package is more than $3,000, you will be able to stagger your payments in several installments!'
		}
		)


	};
	if ($('#catego').length > 0) {
		$('#bubble1').tooltip({
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function (position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			},
			content: '<b>Category:</b><br>Select a category.'
		}
		)
	};
	$('.jxCoInf').click(function () {
		var jsHref = $(this).attr('href');
		var jsQuest = jsHref.indexOf('?');
		jsQuest > -1 ? jsHref = jsHref.substr(0, jsQuest) : '';
		var dom = document.domain;
		var buildjs = jsHref.match(/[0-9]+/g)
		var xyObj = $(this).position();
		openCMSpopUp(buildjs, xyObj, $(this).attr('href'));
		return false;
	});
	$('.jxCoInf').click(function () {
	    var jhref = $(this).attr("href");
	    winOpenCMS(jhref);
	    return false;
	})
	/* ******* Docement elements functions ******* */
	$('#imgForw').click(function(){swichImg('F')});
	$('#imgBack').click(function(){swichImg('B')});
	$('div[id*="dvTab"]').mouseover(function(){tabBgChange(this.id,'ov')}).mouseout(function(){tabBgChange(this.id,'ot')}).click(function(){tabBgChange(this.id,'cl')});
	$("input:radio[name=addFlight]").click(function() {
    	if(this.value == 'True'){
			$('#wair').toggleClass('Text_Arial12_BlueBold');
			$('#woair').attr('class','Text_Arial12_Blue');
			$('#AirParam').show();
		}
		else{
			$('#wair').attr('class','Text_Arial12_Blue');
			$('#woair').toggleClass('Text_Arial12_BlueBold');
			$('#AirParam').hide();
		}
		
	});
	$('span[id*="aboutSP"]').mouseout(function () {
		$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#4E73AB');								   
	}).mouseover(function () {
		$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#000; background-color:#D9FFFF');	
	});
	
	$('span[id*="aboutSP"]').click(function (e) {
		popID =  $(this).attr('id').replace('aboutSP','aboutDIV');
		var maskH = $(document).height();
		var maskW = $(window).width();
		$('#mask27').css({'width':maskW,'height':maskH}); 
		$('#mask27').fadeIn(1000);
		$('#mask27').fadeTo("slow",0.8);
		var posObj = $(this).offset();
		var posT = posObj.top;
		var posL = posObj.left - 600
		$('#'+popID+'').attr('style','padding:5px; position:absolute; width:800px; display:none; z-index:9998; left:'+ popL + 'px; top:'+ popT +'px'); 
		$('#'+popID+'').fadeIn(2000);
	});
	
	$('input[id*="ecityCatNA"]').mouseout(function(){$(this).attr('class','t20_downSelect');}).mouseover(function(){$(this).attr('class','t20_downSelectOver');});
	$('input[id*="ecityCatNA"]').click(function(){categoryDiv(this.id);});


	$('#buttAddDel').click(function(){
		window.location = document.URL.replace("_pk", "_pkbyo");				
	});
	$('#buttReorder').click(function(){
		window.location = document.URL.replace("_pk", "_pkbyo"); 
	});
	$('#buttAddDel1').click(function(){
	    window.location = document.URL.replace("_pk", "_pkbyo");
	});
	$('#buttReorder1').click(function(){
	    window.location = document.URL.replace("_pk","_pkbyo");
	});

	aboutBUT();
	newDest();
	buildPics();
	readCookVal();
	if (fxDates == '0') { dateByDest2426(); } 

    var pkId = $('#Pkgid').val();
    var topvalues = $("#PVal" + pkId).val().split('|');
    if (topvalues[1] == 0) { $('#TopOverAllFeeds').hide(); } else { $('#TopOverAllFeeds').show(); }
    $("#dvTopStarsOverAll").css("width", topvalues[2] + "px");
    $("#dvTopStarsOverAllStr").text(topvalues[1] + " out of 5 stars");

	/*end docuement ready*/						  
});
/*end docuement ready*/
function openCMSpopUp(cmsid, xyPos, jhref) {
	$.ajax({
		type: "GET",
		url: SiteName + '/Api/Packages/getDataThisCMS/' + cmsid,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			msg = data[0].cmS_Content;
			if (msg != '') {
				'https:' === document.location.protocol ? (msg = msg.replace(/http:/g, 'https:')) : '';
				if (RegExp(/\b(dvCMS\w*)\b/).test(msg) == false) {
					$('#popUpCMS').html(msg)
					$('#popUpConteiner').attr('style', 'top:' + xyPos.top + 'px;');
					$('#popUpConteiner').fadeIn(1000);
					var objTOGO
					objTOGO = $('#popUpConteiner').offset();
					$('html,body').animate({
						scrollTop: objTOGO.top - Number(100)
					}, 2000);
				} else {
					centerWindow(jhref);
					return false;
				};
			};
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
};
function readCookVal(){
	backCook =  jQuery.extendedjsoncookie('getCookieValueDecoded','bpBack');
	var NtsStay;
	var MiniIs;
	var Naprod;
	var categSel;
	var categSelNA;
    if (backCook != null || backCook != 'undefined') {
		var cpackID = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'Pkgid');
		if (cpackID != packID){
			Cookies.set('bpBack', '', { expires: -1 });
			backCook =  jQuery.extendedjsoncookie('getCookieValueDecoded','bpBack');
		}
		else{
			var qtyCities = Number(jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'hwMnyCtyfrm')) + 1;
			var Flyadd = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'addFlight');
			if (Flyadd == 'True'){
				$('#wair').attr('class','Text_Arial12_BlueBold');
				$('#woair').attr('class','Text_Arial12_Blue');
				$('input[name="addFlight"]')[0].checked = true;
			}
			else{
				$('#wair').attr('class','Text_Arial12_Blue');
				$('#woair').attr('class','Text_Arial12_BlueBold');
				$('input[name="addFlight"]')[1].checked = true;
				$('#AirParam').hide();
			}
			var dateIn = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'InDate1');
			$('#InDate1').val(dateIn);
			var ctyDepNA = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'sDepCity');
			$('#ecalsDepCity').val(ctyDepNA);
			$('#sDepCity').val(ctyDepNA);
			var ctyDepID = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'iDepCity');
			$('#iDepCity').val(ctyDepID);
			
			var roomAndpax = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iRoomsAndPax');
			if(roomAndpax == undefined){			  
				var adultE = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iAdults');
				$('#iAdults').val(adultE);
				var childsE = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'iChildren');
				$('#iChildren').val(childsE);
				$("#iChildren option[value='"+childsE+"']").attr('selected','selected');
				if (childsE > 0){
					$('#divChild0').show();
					for (c = 1; c <= childsE; c++) {
						var chidAge = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iChild' + c + '');
						$('#iChild' + c + '').val(chidAge);
						$('#divChild' + c + '').show();
					};
				};
			}else{			    
				$('#iRoomsAndPax option[value="'+roomAndpax+'"]').attr('selected','selected');
				var jsRoom = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Rooms');
				$('#Rooms').val(jsRoom); $('#iRoom').val(jsRoom); rom = jsRoom
				if(roomAndpax.indexOf('Other')>-1){showDivRoom(jsRoom);};
				var adultE = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iAdults');
				$('#iAdults').val(adultE);
				$('#AiAdults option[value="'+adultE+'"]').attr('selected','selected');
				var childsE = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'iChildren');
				$("#iChildren option[value='"+childsE+"']").attr('selected','selected');
				if (childsE > 0){
					for (c = 1; c <= childsE; c++) {
						$('#dvR1child'+c+'').show();
						var chidAge = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iChild' + c + '');
						$('#iChild' + c + '').val(chidAge);						
					}
				}			
				if (jsRoom > 1){
					var jsAdult;
					var jsChild;
					var jsChilAge;
					for (r=2;r<=jsRoom;r++){
						jsAdult = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Room'+r+'_iAdults');
						$('#Room'+r+'_iAdults').val(jsAdult);
						$('#ARoom'+r+'_iAdults option[value="'+jsAdult+'"]').attr('selected','selected');
						jsChild = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'Room'+r+'_iChildren');
						$("#Room"+r+"_iChildren option[value='"+jsChild+"']").attr('selected','selected');
						if(jsChild > 0){
							for (c=1;c<=jsChild;c++){
								$('#dvR'+r+'child'+c+'').show(); $('#BdvR'+r+'child'+c+'').show();
								jsChilAge = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'Room'+r+'_iChild'+c);
								$("#Room"+r+"_iChild"+c+"").val(jsChilAge);								
							};
						};	
					};
				};
			};
			for (i=1;i<=qtyCities; i++){
				NtsStay = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'StayNite'+i+'')
				$("#StayNite" + i + " option[value='"+NtsStay+"']").attr('selected','selected');
				categSel = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'ecityCat'+i+'');
				if ($('#ecityCat'+i+'').length > -1){$('#ecityCat'+i+'').val(categSel);};
				categSelNA = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'ecityCatNA'+i+'');
				if ($('#ecityCatNA'+i+'').length > -1){$('#ecityCatNA'+i+'').val(categSelNA);};
            }
			Cookies.set('bpBack', '', { expires: -1 });
		}
	}
}
function newDest() {
    /*  ****  NEW list ofo destinations *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/depCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            citiesAll = res
            doit();
        }
    });
    $("#sDepCity").click(function () {
        citySelID = "sDepCity";
        if (IsMobileDevice()) { $('#sDepCity').val(''); } else { $("#sDepCity").select() };
    });
}
function doit() {
    $("#sDepCity").autocomplete({
        autoFocus: true,
        minLength: 3,
        select: function (event, ui) {
            $("#sDepCity").val(ui.item.label);
            $('#iDepCity').val(ui.item.id);
            return false;
        },
        open: function () {
            $('.ui-autocomplete').css('width', '300px');
        },
        response: function (event, ui) {
            if (ui.content.length === 0) {
                alert('No valid airport found')
                return false;
            };
        },
		source: $.map(citiesAll, function (m) {
			var code = m.plC_Code ? m.plC_Code.trim() : "";
			if (code.toLowerCase() !== "none") {
				return {
					value: m.plC_Title + " - " + m.plC_Code, label: m.plC_Title + " - " + m.plC_Code, id: m.plcid
				};
			}
		}),
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var $a = $("<span></span>").text(item.label);
        highlightText(this.term, $a);
        return $("<li></li>").attr("data-value", item.value).append($a).appendTo(ul);
    };
};
function stayChange(sid,svalue){
	if (sid.indexOf('B') > -1){
		sid = sid.replace('B','');
		$('#'+sid+'').val(svalue);
	}
	else{
		$('#B'+sid+'').val(svalue);
	}
}
function selCabin(objt,valu){
	var indxObj = objt.indexOf('B');
	if (indxObj == 0){
		$('#Cabin').val($('#BCabin').val());
	}
	else {
		$('#BCabin').val($('#Cabin').val());
	}
}
function imageSize(thisPic,thisTyp){
	if(thisPic.match(img500) != null || thisTyp == 'M0'){
		picW='290px';
		picMtp='0px'; 
		$('.selM').css('width','399px'); 
		$('#dvallTHU').attr('style','width:258px;');
	}
	else{
		picW='200px';
		picMtp='45px'; 
		$('.selM').css('width','399px'); 
		$('#dvallTHU').attr('style','width:258px;');
	};
	return [picW,picMtp];
};
function buildPics(){
    var dvShw;
	var hvMap = 0;
	var hvBigMap = 0;
	var picU;
	var picW, picH, picMtp;
	var fstPic;
	var picClass;
	var idIMG ='Bipic';
	var idNUM = 3
	$.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/PicsForPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{packID:"' + packID + '"}',
        success: function(data) {
            objPics = data;  
            objImgs = $.grep(objPics, function (n, i) { return (n.imG_ImageType == 'P0');});
			picTotal = objPics.length;
			for(i=0;i<3;i++){
                aPic = aPic + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="140" height="140" id="Bipic' + Number(i + 1) + '" alt="' + objPics[i].imG_500Path_URL + '" title="' + objPics[i].imG_Title + '" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>';
			};
			$('#dvImgT26').html(aPic);
			if(objPics[3]){
                picW = imageSize(objPics[3].imG_500Path_URL, objPics[3].imG_ImageType)
				if(objPics[3].imG_ImageType == 'M0'){ 
					idIMG = 'KipicMap';
					idNUM = 1;
					hvBigMap = 1;
				}
                $('#dvshowPIC').html('<img src="https://pictures.tripmasters.com' + objPics[3].imG_500Path_URL.toLowerCase() + '" id="' + idIMG + idNUM + '" alt="' + objPics[3].imG_500Path_URL + '" title="' + objPics[3].imG_Title + '" width="'+ picW[0] +'" height="'+picW[0]+'" style="margin-top:'+picW[1]+'" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>');
				$('#dvshowPIC').show();
			};
			for(m=0;m<Number(picTotal-1);m++){
				if (objPics[m].imG_ImageType == 'M0'){
                    $('#dvsmalMAP').html('<image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL.toLowerCase() + '" width="325" height="325" alt="' + objPics[m].imG_500Path_URL + '" title="' + objPics[m].imG_Title +'"/>');
					$('#dvsmalMAP').show();
					shwMaps = shwMaps + '<div align="center"><span class="Text_Arial12_LightBold">' + objPics[m].imG_Title + '</span><br/><br/><image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL.toLowerCase() + '" alt="' + objPics[m].imG_500Path_URL + '" title="' + objPics[m].imG_Title +'"/></div>';
					$('#dvShwMap').html(shwMaps);
					m = Number(picTotal-1)
				}
				else{ 

					if(hvBigMap == 1){
					$('#dvShwMap').html(shwMaps);
					}
					else{
					$('#dvTabMap').hide();
					};
				};
			};
	},
		error: function (xhr, desc, exceptionobj) {
			$('#packPics').html(xhr.responseText);
		}
    });
	$('img.picSel').click(function(){changePic(this.id, this.src, this.title, this.alt)});
	$('img.picNSel').click(function(){changePic(this.id, this.src, this.title, this.alt)});
};
var wkr = 0;
function tabBgChange(tabid,evt){
	var wktab = $('#'+tabid+'');
	var wkcls = wktab.attr('class');
	var tabshow = tabid.replace('dvTab','');
	switch(evt){
		case 'ov':
			if(wkcls == 'tabNSel'){wktab.attr('class','tabSel');wkr = 1};
		break;
		case 'ot':
			if(wkr == 2){}else if(wkr == 1){wktab.attr('class','tabNSel'); wkr = 0};
		break;
		case 'cl':
			wkr = 2;
			$('div.tabSel').attr('class','tabNSel');
			wktab.attr('class','tabSel');
			opentabDiv(tabshow);
		break;
	}
};
function opentabDiv(dvshw) {
    var newdvShw = $('#dvShw' + dvshw + '');
    var newdvCnt = 'dvCont' + dvshw
    $('div.shwSel').attr('class', 'shwNSel');
    newdvShw.attr('class', 'shwSel');
    $('body,html').animate({ scrollTop: 300 }, 800);

    switch (dvshw) {
        case 'View':
            closeAllPopups();
            break;
        case 'Itin':
            if ($('#cmsIti').val() == 0) { } else { callCMS($('#cmsIti').val(), newdvCnt); };
            closeAllPopups();
            break;
        case 'Book':
            if ($('#cmsPri').val() == 0) { } else { callCMS($('#cmsPri').val(), newdvCnt); };
            closeAllPopups();
            break;
        case 'Acco':
            if ($('#cmsAcc').val() == 0) { getHotels(); } else { callCMS($('#cmsAcc').val(), newdvCnt); };
            closeAllPopups();
            break;
        case 'Acti':
            if ($('#cmsAct').val() == 0) { getSS(); } else { callCMS($('#cmsAct').val(), newdvCnt); };
            closeAllPopups();
            break;
        case 'Tran':
            if ($('#cmsTra').val() == 0) { } else { callCMS($('#cmsTra').val(), newdvCnt); };
            closeAllPopups();
            break;
        case 'Map':
            closeAllPopups();
            break;
        case 'Cou':
            closeAllPopups();
            break;
        case 'FAQ':
            if ($('#cmsFaq').val() == 0) { } else { callCMS($('#cmsFaq').val(), newdvCnt); };
            closeAllPopups();
            break;
        case 'Feed':
            var n = $('#PackCustFeedIds').val()
            //console.log("n.length = ")
            //console.log(n.length)
            if (typeof n === 'undefined')
            {
                $("input[id^='CoutryFeedIds']").each(function () {
                    n = $(this).val();
                    if (n.length > 0) {
                        var cid = $(this).attr('id').replace('CoutryFeedIds', '');
                        openFeedsContainer('C', cid);
                        return false;
                    }
                });
            }
            else {
                if (n.length > 0) {
                    openFeedsContainer('P', $('#Pkgid').val());
                }
                else {
                    $("input[id^='CoutryFeedIds']").each(function () {
                        n = $(this).val();
                        if (n.length > 0) {
                            var cid = $(this).attr('id').replace('CoutryFeedIds', '');
                            openFeedsContainer('C', cid);
                            return false;
                        }
                    });
                }
            }
            closeAllPopups();
            break;
    };
};

// function to close all popups when you click on tabs
function closeAllPopups() {
    dvHotMoreInfCL();
    if ($('.dvPageBox').is(':visible')) {
        $('.dvPageBox').html('');
        $('.dvPageBox').hide();
    }
    if ($('#divRecomended').is(':visible')) {
        closeDiv();
    }
};
function swichImg(bf){
	var totPic;
	totPic = newPicTot 
	var thisPic = $('img.picSel[id*="K"]');
	var iID = thisPic.attr('id');
	iID = iID.replace('ipic','');
	if (iID.indexOf('O') > -1){iID = iID.replace('O','');};
	if (iID.indexOf('K') > -1){iID = iID.replace('K','');};
	var newID;
	var newPic, newImg;
	if(bf == 'F'){
		if (iID == totPic){alert('No more photos')}
		else { 
			newID = Number(iID) + 1;
			newImg = objImgs[iID].imG_500Path_URL;
			if (newImg == '') { newImg = objImgs[newID].imG_Path_URL; };			
			newPic = $('#Kipic'+newID+'');
			$('#dvFstPic').html('<img src="https://pictures.tripmasters.com'+ newImg.toLowerCase() +'" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
			$('#dvimG_Title').html(newPic.attr('title'));
			newPic.attr('class','picSel');
			thisPic.attr('class','picNSel');
		}
	}
	if(bf == 'B'){
		if (iID == 1){alert('No more photos')}
		else { 
			newID = Number(iID) - 1;
			newImg = objImgs[newID - 1].imG_500Path_URL;
			if (newImg == ''){newImg = objImgs[newID - 1].picURL;};			
			newPic = $('#Kipic'+newID+'');
			$('#dvFstPic').html('<img src="https://pictures.tripmasters.com'+ newImg.toLowerCase() +'" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '" />');
			$('#dvimG_Title').html(newPic.attr('title'));
			newPic.attr('class','picSel');
			thisPic.attr('class','picNSel');
		};
	};
};
function changePic(picID,picSRS,picTTL, picALT){
	
	var picURL = 'https://pictures.tripmasters.com'+ picALT.toLowerCase()
	if(picALT == 'none'){picURL = picSRS;};
	if (picID.indexOf('O') == -1){
		$('#dvbk').hide();
		$('#dvfr').hide();
		$('#dvmediaPopUp').attr('style','position:absolute; z-index:9998; width:1010px; left:50%; margin-left:-505px; top:25%; height:auto; background-color:#FFF;');
		$('#dvmediaPopUp').show();
		$('img.picSel[id*="Kipic"]').attr('class','picNSel');
		$('img.picSel[id*="Mipic"]').attr('class','picNSel');
		$('#'+picID+'').attr('class','picSel');	
		$('#dvFstPic').html('<img src="' + picURL +'" id="'+ picID.replace('O','B') +'"  alt="' + picALT + '" title="' + picTTL + '" />');
		if(picID.indexOf('M') > -1){
			$('#dvMV').hide();
			var pattern = /[0-9]+/ 
			var num = picID.match(pattern);
			$('#Mipic'+num+'').attr('class','picSel');
		}else{
			$('#dvMV').show();
			$('#dvimG_Title').html(picTTL);
		};
	}
	else{
		$('img[id*="Oipic"]').attr('class','picNSel');
		$('#'+picID+'').attr('class','picSel');	
		if (picID.indexOf('Map') > -1 || picURL.match(img500) != null){$('#dvshowPIC').html('<img src="' + picURL +'" id="'+ picID.replace('O','B') +'" alt="' + picALT + '" title="' + picTTL + '" width="290" height="290" onclick="moreMediaB(this.id, this.src, this.title, this.alt); " class="clsCursor"/>'); $('.selM').css('width','399px'); $('#dvallTHU').attr('style','width:258px;');}
		else{$('#dvshowPIC').html('<img src="' + picURL +'" id="'+ picID.replace('O','B') +'"  alt="' + picALT + '" title="' + picTTL + '" style="margin:45px;" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>');$('.selM').css('width','399px'); $('#dvallTHU').attr('style','width:258px;');};
	};
};
function priceBubble(obj, ntsPrts) {
	var pakNTSs = ntsPrts.split('|');
	$('#' + obj + '').tooltip({
		position: {
			my: "center bottom-20",
			at: "center top",
			using: function (position, feedback) {
				$(this).css(position);
				$("<div>")
					.addClass("arrowgrey")
					.addClass(feedback.vertical)
					.addClass(feedback.horizontal)
					.appendTo(this);
			}
		},
		content: function () {
			var pakNTSs = ntsPrts.split('|');
			return '<div class="Text_Arial12" style="margin:10px">This packages is recommended for ' + pakNTSs[0] + '.<br/><br/><b>Customize it </b> ' + pakNTSs[1] + '</div>';
		}
	})
};
function popUpImagesNav(){
	thumPic = '';
	thumMap = '';
	hvMap = 0;
	var Cpic=0;
	var Cmap=0;
	var thumClass = 'picNSel';
	for (i=0;i<Number(picTotal-1);i++){
		if (i==0){var thumClass = 'picSel'}else{var thumClass = 'picNSel'};
		if (objPics[i].imG_ImageType == 'P0'){
			Cpic++
			thumPic = thumPic + '<img id="Kipic' + Cpic + '" class="' + thumClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase()  + '" title="' + objPics[i].imG_Title + '"/>';
			
		}
		else if (objPics[i].imG_ImageType == 'M0' || objPics[i].imG_ImageType == 'M1'){
			Cmap++
			thumMap = thumMap + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="Mipic' + Cmap + '" class="' + thumClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase()  + '" title="' + objPics[i].imG_Title + '"/>';
			hvMap = 1;						
		};
	 };
	 newPicTot = Cpic;
	 $('#dvThuPic').html('Photos<br/>'+ thumPic);
	 if (hvMap == 1){
		$('#dvThMp').show();
		$('#dvThuMap').html('Map<br/>'+ thumMap);
	}
	else{
		$('#dvThMp').hide();
		$('#dvTabMap').hide();
	};
	 $('img.picSel').click(function(){changePic(this.id, this.src, this.title, this.alt)});
	 $('img.picNSel').click(function(){changePic(this.id, this.src, this.title, this.alt)});
};
function moreMedia(){
	var img1S = objPics[0].imG_500Path_URL;
	if (img1S == undefined) { img1S = objPics[0].imG_Path_URL; };
	var img1T = objPics[0].imG_Title;
	$('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + img1S.toLowerCase() +'" title="' + img1T + '" alt="' +img1S +'"/>');
	$('#dvimG_Title').html(img1T);
	popUpImagesNav();
	var dvW = 1010;
	var dvML = -505;
	$('#mask27').css({'width':maskW,'height':maskH});
	$('#mask27').fadeTo("slow",0.8);
	$('#dvmediaPopUp').attr('style','position:absolute; z-index:9999; width:'+dvW+'px; left:50%; margin-left:'+dvML+'px; top:25%; height:auto; background-color:#FFF;');
	$('#dvmediaPopUp').show();
	scrollToTop();
};
function moreMediaB(picID,picSRS,picTTL, picALT){
	popUpImagesNav();
	var dvW = 1010;
	var dvML = -505;
	$('#mask27').css({'width':maskW,'height':maskH});
	$('#mask27').fadeTo("slow",0.8);
	$('#dvmediaPopUp').attr('style','position:absolute; z-index:9999; width:'+dvW+'px; left:50%; margin-left:'+dvML+'px; top:25%; height:auto; background-color:#FFF;');
	$('#dvmediaPopUp').show();
	scrollToTop();
	changePic(picID.replace('B','K'), picSRS,picTTL, picALT);
};
function moreMediaCLS(){
	$('#mask27').hide();
	$('#dvmediaPopUp').hide();
};
function cityActCLS(){
	$('#mask27').hide();
	$('#dvcityActions').hide();
};
function relIntAjax(IDrel, objID){
	showRecomm(objID);
	$('#divContent').attr('style','height:auto; width:auto; padding:15px 40px;');
	$('#divContent').html(' <img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" />');
	var infoLN;
	var infoPK;
	var dvInfo = '';
	var stylUndLn = "'styleOver'";
	var stylNone = "'styleOut'";
	$.ajax({
		type: "POST",
		url: SiteName + "/Api/PackInfoXID/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function (data) {
			infoPK = data;
			$('#divContent').html(infoPK);
			infoLN = infoPK.split('|');
			var toNts = Number(infoLN[6]) + (Math.ceil(infoLN[6] / 2));
			dvInfo = dvInfo + '<div style="margin:10px 5px;">';
			dvInfo = dvInfo + '<div style="float:left; width:19%;"><img src="https://pictures.tripmasters.com' + infoLN[7].toLowerCase() + '" width="100" height="100" style="background-color: #fff; padding: 2px; border: 1px solid #ccc; -moz-border-radius: 4px; -webkit-border-radius: 4px;"/></div>';
			dvInfo = dvInfo + '<div style="float:left; width:53%;">';
			dvInfo = dvInfo + '<div class="Text_Arial14_BlueBold" style="margin-bottom:10px;" >' + infoLN[1] + '</div>';
			dvInfo = dvInfo + '<div class="Text_Arial12" style="margin-bottom:15px;" >' + infoLN[2] + '</div>';
			dvInfo = dvInfo + '<div class="Text_Arial12_Bold" style="margin-bottom:5px;" >This ' + infoLN[6] + ' night sample itinerary includes:</div>';
			var pkIncl = infoLN[9].replace(/\<br\/\>/g, '<br/>');
			pkIncl = pkIncl.replace(/\<br\/\><br\/\>/g, '<br/>');
			pkIncl = pkIncl.replace(/\<br\/\>/g, '<br/> &bull; ');
			dvInfo = dvInfo + '<div class="Text_Arial12" >' + pkIncl + ' </div>';
			dvInfo = dvInfo + '</div>';
			dvInfo = dvInfo + '<div style="float:right; width:27%; margin-top:15px; height:120px;" align="center" class="bgRelPakPrc">';
			if (formatCurrency(infoLN[4]) != '$0') {
				if (infoLN[3] == 1) { 
					dvInfo = dvInfo + '<div class="Text_Arial12" style="padding:15px 0px;" ><span style="color:#333">' + infoLN[6] + ' nights from</span> <span style="color:#F60;"><b>' + formatCurrency(infoLN[4]) + '</b></span></div>';
				}
				else {
					dvInfo = dvInfo + '<div class="Text_Arial12" style="padding:15px 0px;" ><span style="color:#333">' + infoLN[6] + ' to ' + toNts + '+ nights from</span> <span style="color:#F60;"><b>' + formatCurrency(infoLN[4]) + '</b></span></div>';
				};
			} else {
				dvInfo = dvInfo + '<div class="Text_Arial12" style="padding:15px 0px;" ><span style="color:#333"></span> <span style="color:#F60;"></span></div>';
			};
			var packLink = "'" + SiteName + "/" + plcNA.replace(/\s/g, '_').toLowerCase() + "/" + infoLN[1].replace(/\s/g, '_').toLowerCase() + "/package-" + infoLN[0].replace('\"', "") + "'";
			dvInfo = dvInfo + '<div><img src="https://pictures.tripmasters.com/siteassets/d/BOT-Customize.gif" width="120" height="28" style="cursor:pointer;" onclick="window.location=' + packLink + '"/></div>';
			dvInfo = dvInfo + '<div class="Text_Arial12_Light" style="padding:15px 0px;">';

			if (infoLN[7] > 0) {
				var feedLink = "'" + SiteName + "/" + plcNA.replace(/\s/g, '_').toLowerCase() + "/" + infoLN[1].replace(/\s/g, '_') + "/feedback-" + infoLN[0].replace('\"', "") + "'";
				dvInfo = dvInfo + '<span class="styleOut" onmouseover="this.className=' + stylUndLn + '" onmouseout="this.className=' + stylNone + '" style="cursor:pointer;" onclick="window.location=' + feedLink + '">Customer feedback (' + infoLN[7] + ')</span>';
			} else {
				dvInfo = dvInfo + '&nbsp;';
			};
			dvInfo = dvInfo + '</div>';
			dvInfo = dvInfo + '</div>';
			dvInfo = dvInfo + '<div style="clear:both;"></div>';
			dvInfo = dvInfo + '</div>';
			$('#divContent').attr('style', 'height:auto; width:auto; padding:15px 15px;');
			$('#divContent').html(dvInfo);
		},
		error: function (xhr, desc, exceptionobj) {
			$('#divContent').html(xhr.responseText);
		}
	});
};
function callThisItin(itinID, tot, sm) {
	var ntsSet = $('#setNts').val();
	showRecomm('samPriceaAll');
	$('#divContent').html('<div style="padding:15px 15px"><img src="https://pictures.tripmasters.com/siteassets/d/wait.gif"></div>');
    var ntsPrts;
	var ntsTextP = pakNTS.split('|');
	var ntsText;
    $.ajax({
        type: "POST",
		url: SiteName + "/Api/Packages/SamplePrices/" + itinID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
			sampl = data;
			var samPrice = ""
            jQuery.each(sampl, function(data) {
			ntsText = ntsTextP[1];
			var ntsHalf = this.samNTS + (Math.round(this.samNTS / 2));
			var ntsString 
			ntsString = this.samNTS +' nights';
			ntsPrts = ntsString +'|'+ntsText;
			samPrice = '<div class="Text_Arial15_Orange" style="padding:15px 15px 5px 15px">';
			if(ntsSet == 1){
				samPrice = samPrice + '<span>';
			}
			else{
				samPrice = samPrice + '<span id="intsBubble'+itinID+'">';
			}
			samPrice = samPrice + '<b>' + ntsString + '.</b></span><b> from ' + this.samPRC + ' w/air, hotel and air taxes *</b></div>';
			samPrice = samPrice + '<div class="Text_Arial12" style="padding:5px 15px"><b>This sample price includes ALL air taxes & fuel surcharges:</b> priced within the past 7 days for arrival on ' + this.samDTE + ', departure from ' + this.samAIP + '. Choose your own departure city and dates.</div>';
			samPrice = samPrice + '<div class="Text_Arial14_BlueBold" style="padding:20px 15px 10px 15px">This '+ this.samNTS +' night sample itinerary includes:</div><div class="Text_Arial12" style=" margin-bottom:20px; padding:2px 30px;">' + this.samITIN + '</div>';

            });
			$('#divContent').html(samPrice);
         },
		error: function (xhr, desc, exceptionobj) {
			$('#divContent').html(xhr.responseText);
        }
    });
};
function bbdates(objvd){
		builFixDatediv(fixDatesdiv,objvd);
		objPOS = $('#'+ objvd +'').offset();
		$('#dvFixDates').show();
		$('#dvFixDates').offset({left:objPOS.left - 0,top:objPOS.top + 20});
};
function builFixDatediv(dates, dvObj) {
    var postDate;
    var postField;
    var m = '';
    var dtsDV = '';
    var fecha = dates.split(',');
    var dtct;
    var startDate;
    var endDate;

    for (i = 0 ; i < fecha.length; i++) {
        if (fecha[i] != "") {
            startDate = dateFormat(fecha[i], 'mm/dd/yyyy');
            endDate = dateFormat(new Date(), 'mm/dd/yyyy');

            if (new Date(startDate) > new Date(endDate)) {
                if (m != dateFormat(fecha[i], "mmm")) {
                    m = dateFormat(fecha[i], "mmm");
                    dtct = 0;
                    if (i == 0) {
                        dtsDV = '<div style="padding:3px 1px;">';
                    }
                    else {
                        dtsDV = dtsDV + '</div><div style="padding:3px 1px;">';
                    }
                    dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
                }
                if (dtct == 0) {
                    postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
                    postField = "'" + dvObj + "'";
                    dtsDV = dtsDV + '<span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
                }
                else {
                    postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
                    postField = "'" + dvObj + "'";
                    dtsDV = dtsDV + ', <span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
                }
                dtct++ 
            }
        }
    };
    dtsDV = dtsDV + '</div>';
    $('#dvFixDates').html(dtsDV);
    setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function changeDaysLenght1(ddate,dobj){
	$('#'+dobj+'').val(ddate);
};
function newCategory(catID,catNA,ctySQ){
	$('#ecityCat'+ctySQ+'').val(catID);
	$('#ecityCatNA'+ctySQ+'').val(catNA);
	$('#compSeleCat'+ctySQ+'').hide();
};
function categoryDiv(objDiv){
	var seq = objDiv.replace('ecityCatNA','');
		var divPOS = $('#'+ objDiv +'').position();
		$('#compSeleCat'+seq+'').attr('style','border:1px solid #ccc; width:330px; background:#FFF; position:absolute; z-index:2; left:'+ Number(divPOS.left -0) +'px; top:'+ Number(divPOS.top+20) +'px;');
		$('#compSeleCat'+seq+'').show();
};
function showChild(qty,objt) {
	var idxoC = objt.indexOf('ei');
		if (idxoC == -1){
			$("#e" + objt + " option[value='"+qty+"']").attr('selected','selected');
		}
		else if(idxoC == 0){
			objt = objt.replace('e','');
			$("#" + objt + " option[value='"+qty+"']").attr('selected','selected');
		}
	
 for (i = 0; i <= 2; i++) {
        if (i <= qty) {
            $('#divChild' + i + '').show();
			$('#edivChild' + i + '').show();
        }
        else {
            $('#divChild' + i + '').hide();
			$('#edivChild' + i + '').hide();
        }
    }
	if (qty == 0 ){$('#divChild0').hide();}
};
function CheckAge(value,name){
	if (value > 11){
		var objPos = $('#'+name+'').offset();
		var messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
		$('#divError').html(messg);
		$('#divError').show();
		$('#divError').offset({left:objPos.left - 85,top: objPos.top - 50});
		$('#'+name+'').val('');
		$('#'+name+'').focus();
		$('#'+name+'').select();
	}
	else{
		$('#divError').hide();
		var idxo = name.indexOf('e')
		if (idxo == -1){
			$('#e'+name+'').val(value);
		}
		else if(idxo == 0){
			name = name.replace('e','');
			$('#'+name+'').val(value);
		};
	};
};
function chkValid(name,messg){
		var objPos = $('#'+name+'').offset();
		$('#divError').html(messg);
		$('#divError').show();
		if (messg.indexOf('All infants') != -1) {
		    $('#divError').offset({ left: objPos.left - 160, top: objPos.top - 50 });
		}
		else {
		    $('#divError').offset({ left: objPos.left - 85, top: objPos.top - 50 });
		};
		$('#'+name+'').val('');
		$('#'+name+'').focus();
		$('#'+name+'').select();
		setTimeout("$('#divError').hide()", 2000);
};


/* ***** MULTIROOM ***** */
var ropx; 
var rom = '1'; 
var pax = '2'; 
var pax2;
var pax3;
var paxMr;
var hwMCh;
function xSelChildren(ch,ro,ty,tID){
	 if(tID.indexOf('B')>-1){$('#'+tID.replace('B','')+'').val(ch);}else{$('#B'+tID+'').val(ch);};
	 if(rom > 1){hwMCh = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val()) + Number($('#Room3_iChildren').val());};
	 if(ty==0){
		 $('#spChAg').hide(); 
	 }else{
		if(ty==1){
		   if(ch==0){
				if(hwMCh == 0){
					$('#spChAg').hide(); 
				};
			}else{
				$('#spChAg').show();
			};
		};
	 };
	switch (ro){
		case 1:
			for (s=1;s<=4;s++){
				if (s<ch || s==ch){
					$('#dvR1child'+s+'').show(); 
				}else{
					$('#dvR1child'+s+'').hide(); 
					$('#dvR1child'+s+'').val(''); 
				};
				$('#iChild'+s+'').val('');
			};
		break;
		case 2:
		case 3:
			for (s=1;s<=4;s++){
				if (s<ch || s==ch){
					$('#dvR'+ro+'child'+s+'').show(); 
				}else{
					$('#dvR'+ro+'child'+s+'').hide(); 
				};
				$('#Room'+ro+'_iChild'+s+'').val(''); 
			};
		break;
	};
};
function showDivRoom(ro){
	if(ro==0){$('#dvPaxLabel').hide()};
	for (i=1;i<=3;i++){
		if(i<=ro){
			$('#dvPaxLabel').show(); 
			$('#dvRoom'+i+'').show(); 
		}
		else{
			$('#dvRoom'+i+'').hide();
		};
	};
};
function cleanValues(ro){
		$('#spChAg').hide();
		var roArr = [];
		switch(ro){
		case 0:
			roArr = [1,2,3];
			roArr.forEach(function(ro) {
    			for (s=1;s<=4;s++){
					$('#dvR'+ro+'child'+s+'').hide();
					$('#Room'+ro+'_iChild'+s+'').val('');
				};
			});
		break;
		case 1:
			roArr = [2,3];
			roArr.forEach(function(ro) {
    			for (s=1;s<=4;s++){
					$('#dvR'+ro+'child'+s+'').hide();
					$('#Room'+ro+'_iChild'+s+'').val(''); 
				};
			});
		break;
		case 2:
			roArr = [1,3];
			roArr.forEach(function(ro) {
    			for (s=1;s<=4;s++){
					$('#dvR'+ro+'child'+s+'').hide(); 
					$('#Room'+ro+'_iChild'+s+'').val(''); 
				};
			})
		break;
		case 3:
			roArr = [1,2];
			roArr.forEach(function(ro) {
    			for (s=1;s<=4;s++){
					$('#dvR'+ro+'child'+s+'').hide(); 
					$('#Room'+ro+'_iChild'+s+'').val(''); 
				};
			})
		break;
	}
};
function changePaxByRoom(valM, objID){
	if(valM == -1){
		var tObj = "'"+objID+"'";
		messg = '<ol><li>Please select a valid option!</li></ol><span></span>';
		popError(objID,messg);
		$('#'+objID+'').select();
		return false;
	}
	else{
	 pax = '';
	 pax2 = '';
	 pax3 = '';
	 ropx = valM.split('|');
	 rom = ropx[0];
	 pax = ropx[1];
	
	 if(pax.indexOf('-') > 0){
		 paxMr=pax.split('-');
		 pax=paxMr[0];
		 pax2=paxMr[1];
		 if(paxMr[2]!=undefined){
			 pax3=paxMr[2];
		 };
	 };
	 switch (rom){
		case '1':
			$("#iChildren option[value=0]").attr('selected','selected');
			if (pax != 'Other'){
				showDivRoom(0);
				cleanValues(0);
				$("#iAdults option[value='" + pax + "']").attr('selected', 'selected');
				$("#Room2_iAdults option[value='1']").attr('selected', 'selected');
				$("#Room3_iAdults option[value='1']").attr('selected', 'selected');
			}
			else{
				$("#AiAdults option[value=2]").attr('selected','selected');
				showDivRoom(1);
				cleanValues(0);
			};
		break;
		case '2':
			$("#iChildren option[value=0]").attr('selected','selected');
			$("#Room2_iChildren option[value=0]").attr('selected','selected');
			if(pax != 'Other'){
				showDivRoom(0);
				cleanValues(0);
				$("#iAdults option[value='"+pax+"']").attr('selected','selected');
				$("#Room2_iAdults option[value='"+pax2+"']").attr('selected','selected');
				$("#Room3_iAdults option[value='1']").attr('selected','selected');
			}
			else{
				showDivRoom(2);
				cleanValues(0);
				$("#iAdults option[value=2]").attr('selected','selected')
				$("#Room2_iAdults option[value=2]").attr('selected','selected');
			};
		break;
		
		case '3':
			$("#iChildren option[value=0]").attr('selected','selected');
			$("#Room2_iChildren option[value=0]").attr('selected','selected');
			$("#Room3_iChildren option[value=0]").attr('selected','selected');
			if(pax != 'Other'){
				showDivRoom(0);
				cleanValues(0);
				$("#iAdults option[value='"+pax+"']").attr('selected','selected');
				$("#Room2_iAdults option[value='"+pax2+"']").attr('selected','selected');
				$("#Room3_iAdults option[value='"+pax3+"']").attr('selected','selected');
			}
			else{
				showDivRoom(3);
				cleanValues(0);
				$("#iAdults option[value=2]").attr('selected','selected');
				$("#Room2_iAdults option[value=2]").attr('selected','selected')
				$("#Room3_iAdults option[value=2]").attr('selected','selected')
		 };
		break;
	 };
 };
  $('#iRoom').val(rom);
  $('#Rooms').val(rom);
};
function T24submitForm(pos){
   var messg;
   var addFly;
	addFly = $('input[id^="addFlight"]:checked').val();
   switch(addFly){
	   case 'True':
		   if ($('#iDepCity').val() == -1){
			   messg = '<ol><li>Please select your departure city</li></ol><span></span>';
			   chkValid('sDepCity',messg);
			   return false;
		   }
		   $('#iRetCity').val($('#iDepCity').val());  
	   break;
	   case 'False':
		   $('#iRetCity').val(-1)
		   $('#iDepCity').val(-1)
	   break;
   }
   var idate = $.trim($('#InDate1').val());
   switch(idate){
	   case 'mm/dd/yyyy':
	   	   messg = '<ol><li>Please select your departure date</li></ol><span></span>';
		   chkValid('InDate1',messg);
		   return false;
	   break;
	   case '':
	   		messg = '<ol><li>Please select your departure date</li></ol><span></span>';
		    chkValid('InDate1',messg);
		    return false;
	   break;
	   default:
	   break;
   }
   var ziCabin = $('#Cabin').val()
    $('#iRoom').val(rom);
	$('#Rooms').val(rom);
	var paxAdult;
	var paxChild;
	var paxTotal;
	var arrayRoom =[];
	var roomVal;
	switch(rom){
		case '1':
			paxAdult = $('#iAdults').val();
			paxChild = $('#iChildren').val();
			$('#iAdults').val($('#iAdults').val());
			$('#Room2_iAdults').val('');
			$('#Room3_iAdults').val('');
			break;
		case '2':	
			paxAdult = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val());
			paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val());
			$('#iAdults').val($('#iAdults').val());
			$('#Room2_iAdults').val($('#Room2_iAdults').val());
			$('#Room3_iAdults').val([]);
			break;
		case '3':
			paxAdult = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val()) + Number($('#Room3_iAdults').val());
			paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val()) + Number($('#Room3_iChildren').val());
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val($('#Room2_iAdults').val());
			$('#Room3_iAdults').val($('#Room3_iAdults').val());
			break;
	};
	paxTotal = Number(paxAdult) + Number(paxChild);
    if (paxTotal > 6){
		messg = '<ol><li>Max guest allowed (adults + children) are 6 !</li></ol><span></span>';
		if (pos == 1){
			chkValid('dvRoom1',messg);
		}else{
			chkValid('BdvRoom1',messg);	
		}
		return false;
	};
	if (paxChild > 0){
		var hwCh = $('#iChildren').val();
		var hwCh2 =  $('#Room2_iChildren').val();
		var hwCh3 =  $('#Room3_iChildren').val();
		if (hwCh > 0 && rom>=1) {
           for (i = 1; i <= hwCh; i++) {
               var childAge = $('#iChild' + i + '').val();
			   var ageCH;
               if (isNaN(childAge) || childAge == '' || (!isNaN(childAge) && (childAge < 2 || childAge > 11))) {
                   if (isNaN(childAge) || childAge == ''){
                       messg = '<ol><li>Please enter a valid age !</li></ol><span></span>'; 
					   ageCH = '';
				   }
                   else if (childAge < 2){
                       messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
					   ageCH = 2;
				   }
                   else{
                       messg = '<ol><li>Child age is 11 or less</li></ol><span></span>'; 
					   ageCH = 11;
				   };
                   
				    if (pos == 1){
					   chkValid('iChild' + i, messg);                   
						if (isNaN(childAge) || childAge == '')
						   $('#iChild' + i + '').val('');                               
					   	else
						   $('#iChild' + i + '').val(ageCH);                       
					   
					  	$('#iChild' + i + '').val($('#iChild' + i + '').val());
					}else{
						chkValid('iChild' + i, messg);                   
						if (isNaN(childAge) || childAge == '')
						   $('#iChild' + i + '').val('');                               
					   	else
						   $('#iChild' + i + '').val(ageCH);                       
					   
					  	$('#iChild' + i + '').val($('#iChild' + i + '').val());
					};
				   
                   return false;
               };
           };
       };
	   
	   if (hwCh2 > 0 && rom>=2) {
           for (i = 1; i <= hwCh2; i++) {
               var childAge2 = $('#Room2_iChild' + i + '').val();
			   var ageCH;
               if (isNaN(childAge2) || childAge2 == '' || (!isNaN(childAge2) && (childAge2 < 2 || childAge2 > 11))) {
                  if (isNaN(childAge2) || childAge2 == ''){
                       messg = '<ol><li>Please enter a valid age !</li></ol><span></span>'; 
					   ageCH = '';
				   }
                   else if (childAge2 < 2){
                       messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
					   ageCH = 2;
				   }
                   else{
                       messg = '<ol><li>Child age is 11 or less</li></ol><span></span>'; 
					   ageCH = 11;
				   }; 
					   
                     if (pos == 1){       
					   chkValid('Room2_iChild' + i, messg);                   
	
					   if (isNaN(childAge2) || childAge2 == '')
						   $('#Room2_iChild' + i + '').val('');                               
					   else
						   $('#Room2_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room2_iChild' + i + '').val($('#Room2_iChild' + i + '').val());
					 }else{
						chkValid('Room2_iChild' + i, messg);                   
	
					   if (isNaN(childAge2) || childAge2 == '')
						   $('#Room2_iChild' + i + '').val('');                               
					   else
						   $('#Room2_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room2_iChild' + i + '').val($('#Room2_iChild' + i + '').val());
					 };
                   return false;
               };
           };
       };
	   
	   if (hwCh3 > 0 && rom>=3) {
           for (i = 1; i <= hwCh3; i++) {
               var childAge3 = $('#Room3_iChild' + i + '').val();
               if (isNaN(childAge3) || childAge3 == '' || (!isNaN(childAge3) && (childAge3 < 2 || childAge3 > 11))) {
                    if (isNaN(childAge3) || childAge3 == ''){
                       messg = '<ol><li>Please enter a valid age !</li></ol><span></span>'; 
					   ageCH = '';
				   }
                   else if (childAge3 < 2){
                       messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
					   ageCH = 2;
				   }
                   else{
                       messg = '<ol><li>Child age is 11 or less</li></ol><span></span>'; 
					   ageCH = 11;
				   }; 
					   
                    if (pos == 1){       
					   chkValid('Room3_iChild' + i, messg);                   
	
					   if (isNaN(childAge3) || childAge3 == '')
						   $('#Room3_iChild' + i + '').val('');                               
					   else
						   $('#Room3_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room3_iChild' + i + '').val($('#Room3_iChild' + i + '').val());
					}else{
						chkValid('Room3_iChild' + i, messg);                   
	
					   if (isNaN(childAge3) || childAge3 == '')
						   $('#Room3_iChild' + i + '').val('');                               
					   else
						   $('#Room3_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room3_iChild' + i + '').val($('#Room3_iChild' + i + '').val());
						
					};
                   return false;
               };
           };
       };
	};
	//end adult / children validation  
	
	//$('#imgPriceIt'+pos).hide();
	//$('#imgLoading'+pos).show();
	
    var qtyCity = Number($('#hwMnyCty').val()) + 1;
	var ctyCat = '';
	for (i=0;i<=qtyCity;i++){
		var catval = $('#ecityCat'+i+'').val(); if (catval == undefined){catval = ''};
		if (i==0){ctyCat = ctyCat + catval}
		else if(i==qtyCity){ctyCat = ctyCat + catval +','}
		else{ctyCat = ctyCat +','+ catval};
	}
	$('#MiniPackCat').val(ctyCat);
	var booProcess
	var pckType = $('#PackType').val();
	var pckID = $('#Pkgid').val();
	switch (pckType)
			{
			case 'TP3':
				_bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
				bookProcess=_bpURL + "?" + pckID		
			break;
			case 'MC':
			    bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID 				
			break;
	}
	$('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
	$('#frmToBook').attr('action',bookProcess);		
	$('#frmToBook').submit();	
	var stringQuery = ''	
	stringQuery = JSON.stringify($('#frmToBook').serializeObject());
	Cookies.set('bpBack', stringQuery, { expires: 1 });
};
function submitForm(pos){
var messg 
   var addFly;
	addFly = $('input[id^="addFlight"]:checked').val();
   switch(addFly){
	   case 'True':
	   if ($('#iDepCity').val() == -1){
		   messg = '<ol><li>Please select your departure city</li></ol><span></span>';
		   if (pos == 1){
		   	chkValid('sDepCity',messg);
		   }
		   else{
		   	chkValid('ecalsDepCity',messg);
		   }
		   return false;
	   }
	 	$('#iRetCity').val($('#iDepCity').val());  
	   break;
	   case 'False':
	   $('#iRetCity').val(-1)
	   $('#iDepCity').val(-1)
	   break;
   }
   var idate = $.trim($('#InDate1').val());
   switch(idate){
	   case 'mm/dd/yyyy':
	   case 'Select Date':
	   case '':
	   	   messg = '<ol><li>Please select your departure date</li></ol><span></span>';
		   if (pos == 1){
		   		chkValid('InDate1',messg);
		    }
		   else{
		   		chkValid('BInDate1',messg);
		    }
		   return false;
	   break;
	   default:
	   break;
   }
   var ziCabin = $('#Cabin').val()
   //adult validation
   var adults = $('#iAdults').val();
   if (isNaN(adults) || adults == '' || (!isNaN(adults) && (adults < 1 || adults > 6))) {
       messg = '<ol><li>Max allowed is 6 adults!</li></ol><span></span>';
       chkValid('iAdults', messg);
       if (isNaN(adults) || adults == '')
           $('#iAdults').val('');
       else
           $('#iAdults').val(2);
           
       return false;
   }
   //end adult validation  
   
    //adult / child validation
    $('#iRoom').val(rom);
	$('#Rooms').val(rom);
	var paxAdult;
	var paxChild;
	var paxTotal;
	var arrayRoom =[];
	var roomVal;
	switch(rom){
		case '1':
		    paxAdult = $('#iAdults').val();
		    paxChild = $('#iChildren').val();
		    $('#iAdults').val($('#iAdults').val());
		    $('#Room2_iAdults').val('');
		    $('#Room3_iAdults').val('');
			break;
		case '2':	
		    paxAdult = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val());
		    paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val());
		    $('#iAdults').val($('#iAdults').val());
		    $('#Room2_iAdults').val($('#Room2_iAdults').val());
		    $('#Room3_iAdults').val($('#Room3_iAdults').val([]));
			break;
		case '3':
		    paxAdult = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val()) + Number($('#Room3_iAdults').val());
		    paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val()) + Number($('#Room3_iChildren').val());
		    $('#iAdults').val($('#iAdults').val());
		    $('#Room2_iAdults').val($('#Room2_iAdults').val());
		    $('#Room3_iAdults').val($('#Room3_iAdults').val());
			break;
	};
	paxTotal = Number(paxAdult) + Number(paxChild);
    if (paxTotal > 6){
		messg = '<ol><li>Max guest allowed (adults + children) are 6 !</li></ol><span></span>';
		if (pos == 1){
			chkValid('dvRoom1',messg);
		}else{
			chkValid('BdvRoom1',messg);	
		}
		return false;
	};
	if (paxChild > 0){
		var hwCh = $('#iChildren').val();
		var hwCh2 =  $('#Room2_iChildren').val();
		var hwCh3 =  $('#Room3_iChildren').val();
		if (hwCh > 0 && rom>=1) {
           for (i = 1; i <= hwCh; i++) {
               var childAge = $('#iChild' + i + '').val();
			   var ageCH;
               if (isNaN(childAge) || childAge == '' || (!isNaN(childAge) && (childAge < 2 || childAge > 11))) {
                   if (isNaN(childAge) || childAge == ''){
                       messg = '<ol><li>Please enter a valid age !</li></ol><span></span>'; 
					   ageCH = '';
				   }
                   else if (childAge < 2){
                       messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
					   ageCH = 2;
				   }
                   else{
                       messg = '<ol><li>Child age is 11 or less</li></ol><span></span>'; 
					   ageCH = 11;
				   };
                   
				    if (pos == 1){
					   chkValid('iChild' + i, messg);                   
						if (isNaN(childAge) || childAge == '')
						   $('#iChild' + i + '').val('');                               
					   	else
						   $('#iChild' + i + '').val(ageCH);                       
					   
					  	$('#iChild' + i + '').val($('#iChild' + i + '').val());
					}else{
						chkValid('iChild' + i, messg);                   
						if (isNaN(childAge) || childAge == '')
						   $('#iChild' + i + '').val('');                               
					   	else
						   $('#iChild' + i + '').val(ageCH);                       
					   
					  	$('#iChild' + i + '').val($('#iChild' + i + '').val());
					};
				   
                   return false;
               };
           };
       };
	   
	   if (hwCh2 > 0 && rom>=2) {
           for (i = 1; i <= hwCh2; i++) {
               var childAge2 = $('#Room2_iChild' + i + '').val();
			   var ageCH;
               if (isNaN(childAge2) || childAge2 == '' || (!isNaN(childAge2) && (childAge2 < 2 || childAge2 > 11))) {
                  if (isNaN(childAge2) || childAge2 == ''){
                       messg = '<ol><li>Please enter a valid age !</li></ol><span></span>'; 
					   ageCH = '';
				   }
                   else if (childAge2 < 2){
                       messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
					   ageCH = 2;
				   }
                   else{
                       messg = '<ol><li>Child age is 11 or less</li></ol><span></span>'; 
					   ageCH = 11;
				   }; 
					   
                     if (pos == 1){       
					   chkValid('Room2_iChild' + i, messg);                   
	
					   if (isNaN(childAge2) || childAge2 == '')
						   $('#Room2_iChild' + i + '').val('');                               
					   else
						   $('#Room2_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room2_iChild' + i + '').val($('#Room2_iChild' + i + '').val());
					 }else{
						chkValid('Room2_iChild' + i, messg);                   
	
					   if (isNaN(childAge2) || childAge2 == '')
						   $('#Room2_iChild' + i + '').val('');                               
					   else
						   $('#Room2_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room2_iChild' + i + '').val($('#Room2_iChild' + i + '').val());
					 };
                   return false;
               };
           };
       };
	   
	   if (hwCh3 > 0 && rom>=3) {
           for (i = 1; i <= hwCh3; i++) {
               var childAge3 = $('#Room3_iChild' + i + '').val();
               if (isNaN(childAge3) || childAge3 == '' || (!isNaN(childAge3) && (childAge3 < 2 || childAge3 > 11))) {
                    if (isNaN(childAge3) || childAge3 == ''){
                       messg = '<ol><li>Please enter a valid age !</li></ol><span></span>'; 
					   ageCH = '';
				   }
                   else if (childAge3 < 2){
                       messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
					   ageCH = 2;
				   }
                   else{
                       messg = '<ol><li>Child age is 11 or less</li></ol><span></span>'; 
					   ageCH = 11;
				   }; 
					   
                    if (pos == 1){       
					   chkValid('Room3_iChild' + i, messg);                   
	
					   if (isNaN(childAge3) || childAge3 == '')
						   $('#Room3_iChild' + i + '').val('');                               
					   else
						   $('#Room3_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room3_iChild' + i + '').val($('#Room3_iChild' + i + '').val());
					}else{
						chkValid('Room3_iChild' + i, messg);                   
	
					   if (isNaN(childAge3) || childAge3 == '')
						   $('#Room3_iChild' + i + '').val('');                               
					   else
						   $('#Room3_iChild' + i + '').val(ageCH);                       
					   
					   $('#Room3_iChild' + i + '').val($('#Room3_iChild' + i + '').val());
						
					};
                   return false;
               };
           };
       };
	};
	//end adult / children validation 
    
	var qtyCity = Number($('#hwMnyCty').val()) + 1;
	var ctyCat = '';
    for (i = 0; i <= qtyCity; i++){

		var catval = $('#ecityCat'+i+'').val(); if (catval == undefined){catval = ''};
		if (i==0){ctyCat = ctyCat + catval}
		else if(i==qtyCity){ctyCat = ctyCat + catval +','}
		else{ctyCat = ctyCat +','+ catval};
    }
	$('#MiniPackCat').val(ctyCat);
		//$('#imgPriceIt'+pos).hide();
	//$('#imgLoading'+pos).show();
	var booProcess
	var pckType = $('#PackType').val();
	var pckID = $('#Pkgid').val();
	switch (pckType)
			{
			case 'TP3':
			    _bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create" ;
				bookProcess=_bpURL + "?" + pckID;				
			break;
			case 'MC':
			    bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID ;				
			break;
	}
	$('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
	$('#frmToBook').attr('action',bookProcess);		
	$('#frmToBook').submit();
	var stringQuery = ''
	stringQuery = JSON.stringify($('#frmToBook').serializeObject());
	Cookies.set('bpBack', stringQuery, { expires: 1 });
};
$.fn.serializeObject = function()
	{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function relItinMore(objID){
	showRecomm(objID);
	$('#divContent').attr('style','height:auto; width:auto; padding:15px 40px;');
	$('#divContent').html(' <img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" />');
	var relPrts = $('#inpRelItin').val();
	var strRelP = relPrts.split('@');
	var dvRhtmlL = '';
	var eachC = 0;
	var bgCol = '';
	var margT = '';
	 dvRhtmlL = dvRhtmlL + '<div style="padding:15px 15px;"><div class="Text_Arial14_BlueBold" style="padding: 10px 0px" align="left">Related Itineraries:</div>';
	$.each(strRelP, function() {
		strRel = this.split('|');					 
		if (strRel[0] != packID){					 
			if (eachC%2 == 1 ){bgCol = 'white'};
			if (eachC%2 == 0 ){bgCol = '#EAF2FF'};
			if(eachC == 0){margT = '10px'}else{margT = '5px'};
				dvRhtmlL = dvRhtmlL + '<div style="margin-top:'+margT+'; background-color:'+bgCol+'; padding:5px 5px 5px 15px;">';
			    dvRhtmlL = dvRhtmlL + '<div id="dvRpkL' + strRel[0] + '" class="Text_Arial12_Blue" style=" width:65%px; padding:2px 0px 2px 0px; float:left; word-wrap:break-word;"><a href="' + SiteName + '/' + plcNA.replace(/\s/g, '_').toLowerCase() + '/' + strRel[1].replace(/\s/g, '_').toLowerCase() + '/package-' + strRel[0] + '"><b>' + strRel[1] + '</b></a></div>';
				if (strRel[2] != 9999 && strRel[2] != ''){
					if (strRel[4] == 1){ 
						dvRhtmlL = dvRhtmlL + '<div style="padding:2px 0px 2px 0px; float:right; width:35%;" align="right"><span class="Text_12_Gray">'+ strRel[3] +' nights from </span><span class="Orange-Arial12">'+ formatCurrency(strRel[2]) +'</span></div>';
					}
					else{
						var toNts = Number(strRel[3])+(Math.ceil(strRel[3]/2));
						dvRhtmlL = dvRhtmlL + '<div style="padding:2px 0px 2px 0px; float:right; width:35%;" align="right"><span class="Text_12_Gray">'+ strRel[3] +' to '+ toNts +'+ nights from </span><span class="Orange-Arial12">'+ formatCurrency(strRel[2]) +'</span></div>';
					}
				}
				else{
					dvRhtmlL = dvRhtmlL + '<div class="Orange-Arial12" style="padding:2px 0px 2px 0px; float:right; width:35%;" align="right">&nbsp;</div>';
				}
				dvRhtmlL = dvRhtmlL + '<div style="clear:both;"></div>';
				dvRhtmlL = dvRhtmlL + '</div>';
		
	 	eachC +=1;
		}
	});
	dvRhtmlL = dvRhtmlL + '</div>';
	$('#divContent').html(dvRhtmlL);
};
function clkshowItin(fed) {
    var objShw = $('#dvFDinclu' + fed + '');
    if (objShw.is(':visible')) {
        objShw.hide();
        $("#dvItinDetail" + fed).html("Itinerary details &#709;");
    }
    else {
        objShw.show();
        $("#dvItinDetail" + fed).html("Itinerary details &#708;");
    }
};
function clkhideIrin(fed){
	$('#dvFDinclu'+fed+'').hide();
};
function relIntForm(hLnk,linkPackID){
	window.location = hLnk +'?relItin='+linkPackID;
};
/*  ***** H E L P   F U N C T I O N ***** */
var num;
var cookVal;
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return null;
};
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
	return (((sign) ? '' : '-') + '$' + num ); 
};
function showRecomm(obj){
	var dvSet ;
	var objPos = ObjectPosition(document.getElementById(obj));
	var posL; 
	posL = objPos[0];
	var posT ;
	posT = objPos[1] - 10;
	var dvW = 710;
	var dvMgLf;
	if (obj.indexOf('picAccom') > -1){posL = objPos[0] - 400};
	if (obj.indexOf('aMore') > -1){posT = objPos[1] -30;};
	if (obj.indexOf('dvItinRel') > -1){posT = objPos[1] - 150;};
	if (obj.indexOf('samPriceaAll') > -1){posT = objPos[1] - 60};
	if (obj.indexOf('dvTabView') > -1){posT = objPos[1] - 60; dvW = 780;};
	dvMgLf = dvW / 2;
	dvSet = 'position:absolute; z-index:9999; width:'+dvW+'px; left:50%; margin-left:-'+dvMgLf+'px; top:'+ posT +'px;'
	$('#divRecomended').attr('style', dvSet);
	$('#divRecomended').fadeIn(2000);
	var objTOGO;
   	objTOGO = $('#'+obj+'').offset(); 
  	$('html,body').animate({
	scrollTop: objTOGO.top - Number(170)},2000);
};
function closeDiv(){
	$('#divRecomended').hide();
};
function divToShow(dv){
	$('#dv'+dv+'').show();
};
function divToHide(dv){
	$('#dv'+dv+'').hide();
};
function scrollToTop(){
	$('body,html').animate({
				scrollTop: 0
			}, 800);
};
var setTop;
var topSet;
function callCMS(cmsid,dvshow){
	$.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/getDataThisCMS/" + cmsid,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
            msg = data;
			if (msg != ''){
                $('#' + dvshow + '').html(data[0].cmS_Content);
				cmsoptimizeLinks(dvshow);
			};
		},
		error: function (xhr,desc, exceptionobj) {
			$('#'+dvshow+'').html(xhr.responseText)
			alert(xhr.responseText +' = error');
		}
	});
};
function cmsoptimizeLinks(dvshow){
	$('#'+dvshow+'').find("a").each(function (){
		var hrefTxt = $(this).attr('href');
		if (this.className != 'aCMStxtLink'){
			var aS;
			var aE;					
			var lastQuote;					
			/javascript:/.test(hrefTxt) ?
			(
				aS = hrefTxt.indexOf('('), 
				aE = hrefTxt.indexOf(')'),
				lastQuote = hrefTxt.lastIndexOf("'"),
				lastQuote == -1 ? 
						hrefTxt = hrefTxt.substring(Number(aS + 2), Number(aE - 1)) 
					  : hrefTxt = hrefTxt.substring(Number(aS + 2), Number(lastQuote))
			) 
			: '';
			if (!/\/latin\/|\/asia\//.test(hrefTxt)){
				/tripmasters.com/.test(hrefTxt) ? 
				(
					
					hrefTxt = hrefTxt.replace("https://", ''),
					hrefTxt = hrefTxt.replace(/tripmasters.com\/|www.tripmasters.com\//, '')
					
				) 
				: '';
				/europeandestinations.com/.test(hrefTxt) ?
				(
					hrefTxt = hrefTxt.replace("https://", ''),
					hrefTxt = hrefTxt.replace(/europeandestinations.com\/|www.europeandestinations.com\//, '')
				) : ''		       
				!/\?/.test(hrefTxt) ? hrefTxt = hrefTxt + "?cms&wh=0&wf=0" : '';		
				!/\/europe\//.test(hrefTxt) ? this.href = "/europe/" + hrefTxt : this.href = "/" + hrefTxt;
				this.className != 'aCMStxtLink' ? $(this).addClass('aCMStxtLink').attr('rel','700,500').popupCMSNewWindow({centerBrowser:1,heigh:500,width:700}) : '';
			};
			 
		}
		else{
			!/\?/.test(hrefTxt) ? hrefTxt = hrefTxt + "?cms&wh=0&wf=0" : '';
			!/\/europe\//.test(hrefTxt) ? hrefTxt = hrefTxt : '';
			$(this).attr('href', ''+ hrefTxt +'').popupCMSNewWindow({centerBrowser:1,heigh:500,width:700})
		};
	});
};
function ShowHideMoreInfo(picID){
	if (picID.indexOf('pic') > -1){
		var moreDiv = 'div'+ picID.replace('pic','');
		var moreText = 'text'+ picID.replace('pic','');
		var idImg = picID;
		var srcImg = $('#'+idImg+'').attr("src");
		var valImg = srcImg.indexOf("Plus");
		if (valImg != -1){
			txtMorCls = $('#'+moreText+'').html();
			$('#' + idImg + '').attr('src','https://pictures.tripmasters.com/siteassets/d/minus.jpg');
			$('#'+moreText+'').html('close');
			$('#'+moreDiv+'').show();
		}
		else{
			$('#' + idImg + '').attr('src','https://pictures.tripmasters.com/siteassets/d/Plus.jpg');
			$('#'+moreText+'').html(txtMorCls);
			$('#'+moreDiv+'').hide();
		}
		
	}
	else {
		var moreDiv = 'div'+ picID.replace('text','');
		var moreText = 'text'+ picID.replace('text','');
		var valImg = $('#'+moreText+'').html().indexOf('close');
		var picIF = picID.replace('text','pic');
		if (valImg == -1){
			txtMorCls = $('#'+moreText+'').html()
			if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src','https://pictures.tripmasters.com/siteassets/d/minus.jpg');};
			$('#'+moreText+'').html('close');
			$('#'+moreDiv+'').show();
		}
		else{
			if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src','https://pictures.tripmasters.com/siteassets/d/Plus.jpg');};
			$('#'+moreText+'').html(txtMorCls);
			$('#'+moreDiv+'').hide();
		}
		
	}
};
function aboutBUT(){
	var popID;
	var objGO;
	for (i=0;i<=totCities;i++){
		$('#aboutPL'+i+'').click(function (e) {
			e.preventDefault();	
			var posObj = $(this).offset();
			var posT = posObj.top + 50;
			popID =  $(this).attr('id').replace('aboutPL','aboutDIV');
			var SqCy = $(this).attr('id').replace('aboutPL','jxTrick');
			$('.'+ SqCy+'').popupWindow({centerBrowser:1, height:600, width:750, resizable:1, scrollbars:1});
			var maskH = $(document).height();
			var maskW = $(window).width();
			$('#mask27').css({'width':maskW,'height':maskH});
			$('#mask27').fadeIn(1000);
			$('#mask27').fadeTo("slow",0.8);
			$('#'+popID+'').attr('style','padding:5px; position:absolute; width:800px; margin-left:-400px; display:none; z-index:9998; left:50%; top:'+posT+'px;'); 
			$('#'+popID+'').fadeIn(2000);
			scrollToMorePop(popID);
	
		});

 	    $('#aboutSP'+i+'').mouseout(function () {
			$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#4E73AB');								   
		}).mouseover(function () {
			$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#000; background-color:#D9FFFF');	
		});
		
		$('#aboutSP'+i+'').click(function (e) {
			popID =  $(this).attr('id').replace('aboutSP','aboutDIV');
			var maskH = $(document).height();
			var maskW = $(window).width();
			$('#mask27').css({'width':maskW,'height':maskH}); 
			$('#mask27').fadeIn(1000);
			$('#mask27').fadeTo("slow",0.8);
			if($('#Calendar').length = 1){
				if($('#Calendar').is(':visible') == true){
					$('#mask27').css({'width':'100%','height':maskH}); 
					$('#mask27').fadeIn(1000);
					$('#mask27').fadeTo("slow",0.8);
					$('#'+popID+'').attr('style','padding:5px; position:absolute; display:none; z-index:9998; left:50%; top:50%; width:800px; margin-left:-400px; height:auto; margin-top:-280px;');  
					$('#'+popID+'').fadeIn(2000);
				}
			}
			else{
				$('#mask27').css({'width':maskW,'height':maskH}); 
				$('#mask27').fadeIn(1000);
				$('#mask27').fadeTo("slow",0.8);
				var posObj = $(this).offset();
				var posT = posObj.top + 50;
				var posL = posObj.left - 600
				$('#'+popID+'').attr('style','padding:5px; position:absolute; width:800px; display:none; z-index:9998; left:'+ popL + 'px; top:'+ popT +'px'); 
				$('#'+popID+'').fadeIn(2000);
				scrollToMorePop(popID);
			};
		});

   		$('#aboutCls'+i+'').click(function (e) {
			$('#'+popID+'').hide();
			$('#mask27').hide();
		});
		
		if($('#aboutCAL'+i+'').length > 0){
			$('#aboutCAL'+i+'').mouseout(function () {
				$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#4E73AB');}).mouseover(function () {
				$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#000; background-color:#D9FFFF');	
			});
			$('#aboutCAL'+i+'').click(function (e) {
				e.preventDefault();	
				popID =  $(this).attr('id').replace('aboutCAL','aboutDIV');
				var SqCy = $(this).attr('id').replace('aboutCAL','jxTrick');
				$('.'+ SqCy+'').popupWindow({centerBrowser:1, height:600, width:750, resizable:1, scrollbars:1});
				var maskH = $(document).height();
				var maskW = $(window).width();
				$('#mask27').css({'width':maskW,'height':maskH});
				$('#mask27').fadeIn(1000);
				$('#mask27').fadeTo("slow",0.8);
				var posObj = $(this).offset();
				var posT = posObj.top + 10;
				var posL = posObj.left - 600
				$('#'+popID+'').attr('style','padding:5px; position:absolute; width:800px; margin-left:-400px; display:none; z-index:9998; left:50%; top:'+posT+'px;'); 
				$('#'+popID+'').fadeIn(2000);
				scrollToMorePop(popID);
				
			});
		};
		
		if($('#aboutOVR'+i+'').length > 0){
			$('#aboutOVR'+i+'').mouseout(function () {
				$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#4E73AB');								   			}).mouseover(function () {
				$(this).attr('style','border-bottom:2px dotted #4E73AB; cursor:pointer; color:#000; background-color:#D9FFFF');	
			});
			$('#aboutOVR'+i+'').click(function (e) {
				e.preventDefault();									
				popID = $(this).attr('id').replace('aboutOVR', 'aboutDIV');
				var SqCy = $(this).attr('id').replace('aboutOVR','jxTrick');
				$('.'+ SqCy+'').popupWindow({centerBrowser:1, height:600, width:750, resizable:1, scrollbars:1});
				var maskH = $(document).height();
				var maskW = $(window).width();
				$('#mask27').css({'width':maskW,'height':maskH});
				$('#mask27').fadeIn(1000);
				$('#mask27').fadeTo("slow",0.8);
				var posObj = $(this).offset();
				var posT = posObj.top + 10;
				var posL = posObj.left - 600
				$('#'+popID+'').attr('style','padding:5px; position:absolute; width:800px; margin-left:-400px; display:none; z-index:9998; left:50%; top:'+posT+'px;');  
				$('#'+popID+'').fadeIn(2000);
				scrollToMorePop(popID);
			});
		};
		
	};	
};
function scrollToMorePop(jbo) {
  var objTOGO;
  objTOGO = jbo;
   objTOGO = $('#'+objTOGO+'').offset(); 
  $('html,body').animate({
	  scrollTop: objTOGO.top - Number(170)},2000);
};
function dvHotMoreInf(dvid){
	var posObj = $('#'+dvid+'').offset();
	var posT = posObj.top + 15;
	var posL = posObj.left - 90;
	var winW = $(window).width();
	if (posObj.left > 800 && winW > 1000){posL = posObj.left - 250};
	$('#dvhotInfo').html($('#'+dvid+'Info').html());
	$('#dvhotInfo').attr('style','position:absolute; z-index:100; width:350px;left:'+posL+'px; top:'+ posT +'px; border:1px solid #000066; padding:15px; background-color:#fff; overflow:visible; -moz-box-shadow: 0 0 30px 5px #999; -webkit-box-shadow: 0 0 30px 5px #999;');
	$('#dvhotInfo').show();
};
function dvHotMoreInfCL(dvid){
	$('#dvhotInfo').html('');
	$('#dvhotInfo').hide();
};
var arrAllHotCty = [];
var arrAllSSCty = [];
function getSS(){
	arrAllSSCty = [];
	SSDispl = [];
	var ctiD = 0;
	var ctiC = 0;
	var cityC = 0;
	var ssC = 0;
	var ssCr = 0;
	var dvSSs = "";
	var dvSSsr = "";
	var modCty = 0;
	var ssdes1 = "";
	var ssdes2 = "";
	var brek;
	var brak;
	var toSSInfo = "";
	var toSSNA = "";
	var winSet = "";
	var lastCityID = 0;
	var arrEchSSCty = [];
	var arrEchSSPro = [];
	var arrCtySSPro = [];
	var proC = 0;
	$('#dvShwActi').html('<div style="padding:20% 0;" align="center"><img src="https://pictures.tripmasters.com/siteassets/d/world-globe-animated-ajax-loaders.gif" align="absmiddle"/><br/>Loading ..</div></div>');
	$.ajax({
        type: "POST",
        url: "/europe/WS_PackPage.asmx/sqlActivitiesTab",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{ctyIDs:"' + $('#tCityIDs').val() + '"}',
        success: function(data) {
			 msg = eval("(" + data.d + ")");
			 jQuery.each(msg, function(data){
				ctiD = this.hotCty;					   
			 	if(ctiD != lastCityID){
					arrEchSSCty = [];
					arrCtySSPro = [];
				  jQuery.each(msg, function(data){
						if(this.hotSEQ > 49 && this.hotSEQ < 60 && this.hotCty == ctiD){
							arrEchSSPro = []
							arrEchSSPro.push(this.hotNA, this.hotDES, this.hotID, this.hotIMG);
							arrCtySSPro.push(arrEchSSPro);
						}
				  });
				  arrEchSSCty.push(this.hotCtyNa, arrCtySSPro);
				  arrAllSSCty.push(arrEchSSCty);
				}
				lastCityID = ctiD;
			 });
			 buildSS();
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText +' = error');
  		}
    });
};
function buildSS(){
	var dvSSs = "";
	var dvSSsr = "";
	var ccC = 0;
	var ctyQ = arrAllSSCty.length;
	for(i=0;i<arrAllSSCty.length;i++){
		var rrEchCty = [];
		rrEchCty = arrAllSSCty[i];
		var rrEchPro = [];
		rrEchPro = rrEchCty[1]
		for (p=0;p<rrEchPro.length;p++){
			dvSSsr = dvSSsr + '<div class="carousel-item">';
			dvSSsr = dvSSsr + '<div align="left" class="Text_Arial14_BlueBold">'+rrEchPro[p][0]+'</div>';
			dvSSsr = dvSSsr + '<div align="left" class="Text_11">';
			dvSSsr = dvSSsr + '<div align="left" class="Text_Arial12" style="height:45px; padding:3px 0px; font-style:italic;">';
			var result =  $(rrEchPro[p][1]).text();                        
			var resultArray = result.split(' ');
			if(resultArray.length > 10){
				resultArray = resultArray.slice(0, 10);
				result = resultArray.join(' ');
			}
			hotdes1 = result ;
			dvSSsr = dvSSsr + hotdes1.toUpperCase() + '...  <a id="dvMore'+rrEchPro[p][2]+'" onclick="dvHotMoreInf(this.id)" style="cursor:pointer; color:blue;"><u>more[+]</u></a>';
			dvSSsr = dvSSsr + '</div>';
			dvSSsr = dvSSsr + '<div id="dvMore'+rrEchPro[p][2]+'Info" style="padding:10px; border:solid 1px #999; display:none;">';
			dvSSsr = dvSSsr + '<div align="right"><a onclick="dvHotMoreInfCL();" style="cursor:pointer; color:blue;"><u>close[x]</u></a></div>';
			dvSSsr = dvSSsr + '<div align="left" class="Text_Arial14_BlueBold" style="padding:5px 0;">'+rrEchPro[p][0]+'</div>';
			dvSSsr = dvSSsr + '<table><tr><td>' + rrEchPro[p][1] + '</td></tr></table>';  
			dvSSsr = dvSSsr + '</div>';
			dvSSsr = dvSSsr + '</div>';
			dvSSsr = dvSSsr + '<div align="left"><img src="https://pictures.tripmasters.com'+rrEchPro[p][3].toLowerCase()+'" width="100" height="100" align="absmiddle"/></div>';
			dvSSsr = dvSSsr + '</div>';
			ctySSPRO.push(dvSSsr);
			dvSSsr = ""
			if (p==2){
				dvSSs = dvSSs + '<div id="wrap">'; 
				dvSSs = dvSSs + '<div class="dvCarrCityTitle Text_Arial14_BlueBold">'+rrEchCty[0]+' Activities: '+rrEchPro.length+' favorite</div>'; 
				dvSSs = dvSSs + '<div class="carousel-container">'; 
				dvSSs = dvSSs + '<div class="dvPrev">'
				if (rrEchPro.length > 3){
					dvSSs = dvSSs + '<img src="https://pictures.tripmasters.com/siteassets/d/T27_ForwH.jpg" id="prevS'+i+'">'
				}
				dvSSs = dvSSs + '</div>'
				dvSSs = dvSSs + '<div id="SSfoo'+i+'" class="container-horizontal">';
				for(y=0;y<ctySSPRO.length;y++){
					dvSSs = dvSSs + ctySSPRO[y];
				}
				dvSSs = dvSSs + '<div style="clear:both"></div>';
				dvSSs = dvSSs + '</div>';
				dvSSs = dvSSs + '<div class="dvPrev">'
				if (rrEchPro.length > 3){
					dvSSs = dvSSs + '<img src="https://pictures.tripmasters.com/siteassets/d/T27_BackH.jpg" id="nextS'+i+'">'
				}
				dvSSs = dvSSs + '</div>' ;
				dvSSs = dvSSs + '<div style="clear:both;"></div>';
				dvSSs = dvSSs + '</div>';
				dvSSs = dvSSs + '</div>' ;
				SSDispl.push(i+'|'+0+'|'+2);
			}
			if (p==rrEchPro.length-1){
				allCtySSPRO.push(ctySSPRO);
				ctySSPRO = [];
			};
		}
		dvSSsr = ""
		ccC++
	};
	$('#dvShwActi').html(dvSSs);
	$('img[id*="prev"]').mouseover(function () { $(this).attr('src', 'https://pictures.tripmasters.com/siteassets/d/T27_ForwH_Over.gif'); }).mouseout(function () { $(this).attr('src','https://pictures.tripmasters.com/siteassets/d/T27_ForwH.jpg');}).click(function(){moveCarr(this.id)});
	$('img[id*="next"]').mouseover(function () { $(this).attr('src', 'https://pictures.tripmasters.com/siteassets/d/T27_BackH_Over.gif'); }).mouseout(function () { $(this).attr('src','https://pictures.tripmasters.com/siteassets/d/T27_BackH.jpg');}).click(function(){moveCarr(this.id)});
};
function moveCarr(eId){
	var Ide = eId.substr(eId.length - 1); 
	var TypPro;
	var TypMov;
	var nwProDispl = [];
	var nwAllCtyPro = [];
	var ssF='';
	var ssE='';
	var nwDvPro;
	var slidDirH;
	var slidDirS;
	var dvProsr = ""
	if(eId.indexOf('next') > -1){
		TypMov = 'Nx';
		slidDirH = 'left';
		slidDirS = 'right';
	}
	else if(eId.indexOf('prev') > -1){
		TypMov = 'Pv';
		slidDirH = 'right';
		slidDirS = 'left';
	};
	if(eId.indexOf('S') > -1){
		TypPro = 'S'
		nwDvPro = $('#SSfoo'+Ide+'');
		nwProDispl = SSDispl;
		SSDispl = [];
		nwAllCtyPro = allCtySSPRO
	}
	else if (eId.indexOf('H') > -1){
		TypPro = 'H'
		nwDvPro = $('#Hotfoo'+Ide+'');
		nwProDispl = HotDispl;
		HotDispl = [];
		nwAllCtyPro = allCtyHotPRO
	};
	for (s=0;s<nwProDispl.length;s++){
		var dispPRO = nwProDispl[s].split('|');
		if (dispPRO[0] == Ide){
			if(TypMov == 'Nx'){ssF = Number(dispPRO[1])+3;ssE = Number(dispPRO[2])+3}else if (TypMov == 'Pv'){ssF = Number(dispPRO[1])-3;ssE = Number(dispPRO[2])-3};
			if (ssE <= -1 || ssF  > nwAllCtyPro[Ide].length){
			    if(TypPro == 'S'){SSDispl = nwProDispl;}else if (TypPro == 'H'){HotDispl = nwProDispl;};
				return false;
			};
			if(TypPro == 'S'){SSDispl.push(Ide+'|'+ssF+'|'+ssE);}else if (TypPro == 'H'){HotDispl.push(Ide+'|'+ssF+'|'+ssE);};
			for(r=ssF;r<=ssE;r++){
				if(nwAllCtyPro[Ide][r] != undefined){
					dvProsr = dvProsr + nwAllCtyPro[Ide][r];
				}
			}
		}
		else{
			if(TypPro == 'S'){SSDispl.push(nwProDispl[s]);}else if (TypPro == 'H'){HotDispl.push(nwProDispl[s]);};	
		}
	}
	nwDvPro.hide("slide", { direction: slidDirH }, 200);
	nwDvPro.html(dvProsr);
	nwDvPro.show("slide", { direction: slidDirS }, 500);
}
function getFeed(){
	var feeds
	$.ajax({
        type: "POST",
        url: "/europe/WS_PackPage.asmx/sqlFeedBacksXpackID",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{packID:"' + packID + '"}',
        success: function(data) {
            feeds = eval("(" + data.d + ")");
			jQuery.each(msg, function(data){
									   
			});
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText +' = error');
  		}
    });
};
function fooSS(tot){
	for (i=1;i<=tot;i++){
		$('#foo'+i+'').carouFredSel({
			width: 870,
			height: 250,
			prev: '#prev'+i,
			next: '#next'+i,
			pagination: '#pager'+i,
			auto: false
		});
	};
};
function winOpenCMS(jhref) {
    centerWindow(jhref);
    return false;
};
function ObjectPosition(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}

function recommendedHotels(plcID, ctyNA, objNA){
		showRecomm(objNA);
		$('#divContent').attr('style','height:auto; width:auto; padding:15px 40px;');
	$('#divContent').html(' <img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" />');
		$.ajax({
        type: "POST",
		url: SiteName + "/Api/RecommHotels/" + plcID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
			hotRec = data;
			var recHot = '<div style="text-align:left; padding: 10px 10px 1px 10px;"><span class="Blue-Arial14">'+ hotRec.length +' hotels offered in '+ ctyNA +'</span></div>'
			recHot = recHot + '<div class="Orange-Arial12NB" align="left" style="padding:10px 10px;">You will be able to select your hotel in the next step</div>'
			var dvHght = 'auto'
			if (hotRec.length > 4){
				dvHght = '270px'
				$('#divContent').attr('style','height:370px; width:auto; padding:15px 40px;');
			}
			recHot = recHot + '<div style="overflow:auto; height:'+ dvHght +'; padding:1px 5px 1px 20px">'
		    jQuery.each(hotRec, function(data) {
				recHot = recHot + '<div align="left" class="Text_12_Bold" style="padding:15px 10px 3px 10px;">' + this.pdL_Title +'</div>'
				recHot = recHot + '<div align="left" class="Text-Light_Med" style="padding:5px 10px 3px 20px;">'
				
				if (this.gipH_TNTournetRating.indexOf("Stars") > -1) {
					recHot = recHot + '<img src="https://pictures.tripmasters.com/siteassets/d/Stars_' + this.gipH_TNTournetRating.replace(/\s/g, "_").replace("+", "_Plus") + '.gif" align="absmiddle" />&nbsp;&nbsp;' + this.gipH_TNTournetRating + ' rating</span>';
				} else {
					recHot = recHot + '<img src="https://pictures.tripmasters.com/siteassets/d/' + this.gipH_TNTournetRating.replace(/\s/g, "_").toLowerCase() + '.gif" align="absmiddle" />&nbsp;&nbsp;' + this.gipH_TNTournetRating + ' rating</span>';
				}
				if (this.sorting < 10) {
					recHot = recHot + '&nbsp;&nbsp;<img src="https://pictures.tripmasters.com/siteassets/d/favorite.gif" align="absmiddle">'
				}
				recHot = recHot + '</div>'
				
				var allKinds = this.spD_Features;
				var strKinds = ""
				if(allKinds.indexOf('400') > -1){
					strKinds = strKinds + "Honeymoon and Romance"
				}
				if (strKinds != ""){
				recHot = recHot + '<div style="padding:2px 10px 10px 20px; margin-bottom:3px;" align="left"><b>Ideal for:</b> '+strKinds+' </div>'
				}
				if( this.hotThumb != 'none'){
				recHot = recHot + '<div style="padding:2px 10px 10px 20px; border-bottom:1px solid #CCCCCC; margin-bottom:5px;" align="left">'+ this.hotThumb +'</div>'
				}
			});
			recHot = recHot + '</div>'
			$('#divContent').html(recHot);
			
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText +' = error');
			$('#divContent').html(xhr.responseText);
          }
    	});
}

function recommendedSS(plcID, ctyNA, objNA){
		objPOS = 0
	   	objPOS = $('#'+ objNA +'').offset();
		showRecomm(objNA);
		$('#divContent').attr('style','height:auto; width:auto; padding:15px 40px;');
	$('#divContent').html(' <img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" />');
		$.ajax({
        type: "POST",
			url: SiteName + "/Api/RecommSS/" + plcID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
			hotRec = data;
			var recHot = '<div style="text-align:left; padding: 10px 10px 1px 10px;"><span class="Blue-Arial14" >'+ hotRec.length +' Things to do in '+ ctyNA +'</span></div>'
			recHot = recHot + '<div class="Orange-Arial12NB" align="left" style="padding:10px 10px;">You will be able to select your activities during the booking process</div>'
			var dvHght = 'auto'
			if (hotRec.length > 4){
				dvHght = '270px'
				$('#divContent').attr('style','height:auto; width:auto; padding:15px 40px;'); 
			}
			recHot = recHot + '<div style="overflow:auto; height:'+ dvHght +'; padding:1px 5px 1px 20px">'
		   
			jQuery.each(hotRec, function (data) {
				recHot = recHot + '<div align="left" class="Text_12_Bold" style="padding:15px 10px 3px 10px;"><span onmouseover="divToShow(' + this.pdlid + ')" style="cursor:pointer">' + this.pdL_Title + '</span></div>'
				recHot = recHot + '<div id="dv' + this.pdlid + '" style="padding:10px 10px; display:none; overflow: auto; height:auto; width: 400px; border:1px solid #CCCCCC;" align="left"><div align="right" style="padding:2px 2px;" class="Text_12"><span onclick="divToHide(' + this.pdlid + ')" style="cursor:pointer;" class="Editor_Package_DaysNts">close [X]</span></div>' + this.spD_Description +'</div>'
				
			});
			recHot = recHot + '</div>'
			$('#divContent').html(recHot);
		
			
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText +' = error');
			$('#divContent').html(xhr.responseText);
          }
    	});
}
function dvCMSMoreOpen(dvid){
	var aObj = document.getElementById (dvid);
    var dvObj = document.getElementById(dvid.replace('a','dv'));
	var posObj = ObjectPosition(document.getElementById(dvid));
	var posT = posObj[1] + 10;
	var posL = posObj[0];
	if (posObj[0] > 950){posL = posObj[0] - 300};
	dvObj.setAttribute('style','display:block; position:absolute; z-index:100; width:350px;left:'+posL+'px; top:'+ posT +'px; border:1px solid #000066; padding:15px; background-color:#fff; overflow:visible; -moz-box-shadow: 0 0 10px 5px #999; -webkit-box-shadow: 0 0 10px 5px #999; box-shadow: 0 0 15px #999;');	
	var adv = dvid.replace('a','dv');
	aObj.innerHTML = "<u>close [-]</u>"
	aObj.setAttribute("onClick","dvCMSMoreClose('"+adv+"'); return false;");
};
function dvCMSMoreClose(dvid){
	var aObj = document.getElementById(dvid.replace('dv','a'))
	var dvObj = document.getElementById (dvid)
	dvObj.setAttribute('style','display:none;');
	aObj.innerHTML = "<u>more [+]</u>"
	aObj.setAttribute("onClick","dvCMSMoreOpen(this.id); return false;"); 
};
/* ************************************* */

function popError(obj,messg){
	
		var objPos = $('#'+obj+'').offset();
		$('#divError').html(messg);
		$('#divError').show();
		if (messg.indexOf('All infants') != -1) {
		    $('#divError').offset({ left: objPos.left - 100, top: objPos.top - 60 });
		}
		else {
		    $('#divError').offset({ left: objPos.left - 85, top: objPos.top - 50 });
		}
		setTimeout("$('#divError').hide()", 2000);
}
function closeClick(obj){
	$('#dvError').hide();
	if (IsMobileDevice()) { $('#' + obj + '').val(''); }
	$('#'+obj+'').select();
}
//New Feedback template//
function openFeedsContainer(tabType, Id) {
    $("div[id*='FeedTab']").removeClass("TabActiveFeeds").addClass("Tab");
    $("div[id*='CaptionFeed']").removeClass("TabCaptionActive").addClass("TabCaption");
    $("div[id*='CaptionText']").removeClass("CaptionTextActive").addClass("CaptionText");
    $("div[id*='FeedText']").removeClass("CaptionFeedTextActive").addClass("CaptionFeedText");
    if (tabType == 'P') {
        $("#pFeedTab").addClass("TabActiveFeeds");
        $("#pCaptionFeed").addClass("TabCaptionActive");
        $("#pCaptionText").addClass("CaptionTextActive");
        $("#pFeedText").addClass("CaptionFeedTextActive");
        var values = $("#PVal" + Id).val().split('|');
        if (values[1] == 0) { $('#OverAllFeeds').hide(); } else { $('#OverAllFeeds').show(); }
        $("#dvNoOfFeeds").text(values[0] + " Reviews");
        $("#dvStarsOverAll").css("width", values[2] + "px");
        $("#dvStarsOverAllStr").text(values[1] + " out of 5 stars");
    }
    if (tabType == 'C') {
        $("#cFeedTab" + Id).addClass("TabActiveFeeds");
        $("#cCaptionFeed" + Id).addClass("TabCaptionActive");
        $("#cCaptionText" + Id).addClass("CaptionTextActive");
        $("#cFeedText" + Id).addClass("CaptionFeedTextActive");
        var values = $("#CVal" + Id).val().split('|');
        if (values[1] == 0) { $('#OverAllFeeds').hide(); } else { $('#OverAllFeeds').show(); }
        $("#dvNoOfFeeds").text(values[0] + " Reviews");
        $("#dvStarsOverAll").css("width", values[2] + "px");
        $("#dvStarsOverAllStr").text(values[1] + " out of 5 stars");
    }

    createPagination(tabType, Id, 1);
    OpenPage(1, tabType, Id);
}
function createPagination(tabType, Id, page) {
    $('.dvPaginas').pagination('destroy');
    var PGtotal = 0;
    if (tabType == 'P') { PGtotal = $("#PVal" + Id).val().split('|')[0]; }
    if (tabType == 'C') { PGtotal = $("#CVal" + Id).val().split('|')[0]; }

    $('.dvPaginas').pagination({
        pages: Math.ceil(PGtotal / 10),
        itemsOnPage: 10,
        cssStyle: 'light-theme',
        onPageClick: function (page, event) {
            scroll(0, 0);
            OpenPage(page, tabType, Id);
            return false;
        }
    });
};
function OpenPage(currentPage, tabType, Id) {
    $('#dvFeeds').animate({ 'opacity': '.0' }, 100);
	$('#dvFeeds').html('<div id="imgWait" style="padding:100px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
    $('#dvFeeds').animate({ 'opacity': '1' }, 0);
    var allIds = '';
    if (tabType == 'P') {
        var allIds = $('#PackCustFeedIds').val();
    }
    if (tabType == 'C') {
        var allIds = $('#CoutryFeedIds' + Id).val();
    }
    var allIdsPages = allIds.split('|');
    if (allIdsPages[currentPage - 1] != '') {
        $.ajax({
            type: "GET",
            url: SiteName + "/Package/GetCustFeed/" + tabType + "/" + currentPage + "/" + Id,
            success: function (data) {
                $('#dvFeeds').html(data).show();
            },
            error: function (xhr, desc, exceptionobj) {
                $('#dvFeeds').html(xhr.responseText);
            }
        });
    }
    else {
        $('#dvFeeds').html('<div style="margin:20px 20px 0px 20px;font-size:12px;color:navy;">0 customer feedback found.</div>')
        $('#dvFeeds').show();
    }
}
// **** DATEPICKER **** //
// include block dates
// var blkdates = ["2016-12-15", "2016-12-16"]
var between = [];
function dateByDest2426() {
    var rangeBlk = blockDates.replace('B-', '');
    rangeBlk = rangeBlk.trim().split('-');
    var rangeBlkS = rangeBlk[0].split('*');
    var rangeBlkE = rangeBlk[1].split('*');

    var dteToday = new Date();
    var dteS;
    var dteE;
    var dte;
    for (i = 0; i <= rangeBlkS.length - 1; i++) {
        var ds = rangeBlkS[i];
        var de = rangeBlkE[i];
        var date1 = stringToDate('' + de + '', 'mm/dd/yyyy', '/');
        var date2 = stringToDate('' + ds + '', 'mm/dd/yyyy', '/');
        var day;
        while (date2 <= date1) {
            day = date1.getDate()
            between.push(jQuery.datepicker.formatDate('yy-mm-dd', date1));
            date1 = new Date(date1.setDate(--day));
        };
    };

    var strDate = '';
    var myDate = new Date();
    strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    var today90Days = new Date(myDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    var strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
    if (between.indexOf(strDateString) != -1) {
        while (between.indexOf(strDateString) != -1) {
            strDate.setDate(strDate.getDate() + 1);
            strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
        }
        if (today90Days <= strDate)
            $('#InDate1').val(jQuery.datepicker.formatDate('mm/dd/yy', strDate));
    }

    $("#InDate1").datepicker("destroy");
    $('#InDate1').datepicker({
        orientation: 'top',
        defaultDate: strDate,
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 2,
        showButtonPanel: true,
        format: 'yyyy-mm-dd',
        hideIfNoPrevNext: true,
        prevText: '',
        nextText: '',
        minDate: strDate,
        maxDate: "+1Y",
        showOtherMonths: false,
        beforeShowDay: function (date) {
            var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
            return [between.indexOf(string) === -1]
        },
        beforeShow: function (input, inst) {
            var calendar = inst.dpDiv;
            setTimeout(function () {
                calendar.position({
                    my: 'right top',
                    at: 'right bottom',
                    collision: 'flip',
                    of: input
                });
            }, 1);
        }

    });
};
function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
};
