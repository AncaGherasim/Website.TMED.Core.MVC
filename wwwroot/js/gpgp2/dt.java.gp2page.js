// JavaScript Document
var objtPOS
var IDarray = new Array()
var winWidth = (window.screen.width) 
var winHeight = (window.screen.height) 
var ctyLatLong;
var ctyID;
var isNumber = /[0-9]+/g;
var infoPOIWindows = [];
var markerHotels = [];
var plcTYPE = 'city';
var SiteName;
$(document).ready(function(){
	ctyID = $('#jplcID').val();	
	if($('#jplcTYPE').length > 0){plcTYPE = $('#jplcTYPE').val();};
	var feaIti
	var othFea
	if(	$('#featItin').length > 0){
		var feaIti = $('#featItin').val();
		var othFea = $('#otherFeat').val();
	
		$('#dvfeatPics').html('<div style="height:150px; padding:60px 60px;" ><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"><br>... loading pictures</div>');
	$.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/PicsForPacks/" + feaIti,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			picD = data;
			buildPics(picD);
		},
		error: function (xhr, desc, exceptionobj) {
			$('#dvfeatPics').html(xhr.responseText);
		}
	});
	};
	// check for what is/isn't already checked and match it on the fake ones
	$("input:checkbox").each( function() {
		(this.checked) ? $("#false"+this.id).addClass('falsechecked') : $("#false"+this.id).removeClass('falsechecked');
	});
	// function to 'check' the fake ones and their matching checkboxes
	$(".falsecheck").click(function(){
		($(this).hasClass('falsechecked')) ? $(this).removeClass('falsechecked') : $(this).addClass('falsechecked');
		$(this.hash).trigger("click");
		return false;
	});
		var cookMark = getCookie('utmcampaign');
		var cookMkVal
		if (cookMark != null){
			cookMkVal = cookMark.split('=')
			if($('#qutm_campaign').length != 0){
				$('#qutm_campaign').val(jQuery.trim(cookMkVal[1]));
			};
		};
	    if($('#dvPoiMap').length > 0){
		    $('#dvPoiMap, #dvPoiLink').click(function(){
			    getMapPoiData(ctyID);								  
		    });
	    
			$('.dvmapClose').click(function(){$('#dvShowMap').hide();});
		};
});
var num;
var cookVal;
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return null
}
var setTop;
var topSet;
var txtMorCls
function ShowHideMoreInfo(picID){
	if (picID.indexOf('pic') > -1){
		var moreDiv = 'div'+ picID.replace('pic','');
		var moreText = 'text'+ picID.replace('pic','');
		var idImg = picID
		var srcImg = $('#'+idImg+'').attr("src");
		var valImg = srcImg.indexOf("Plus");
		if (valImg != -1){
			txtMorCls = $('#'+moreText+'').html();
			$('#' + idImg + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');
			$('#'+moreText+'').html('close');
			$('#'+moreDiv+'').show();
		}
		else{
			$('#' + idImg + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg');
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
			if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');};
			$('#'+moreText+'').html('close');
			$('#'+moreDiv+'').show();
		}
		else{
			if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg');};
			$('#'+moreText+'').html(txtMorCls);
			$('#'+moreDiv+'').hide();
		}
		
	}
}
function dvOpenMain(objID){
	$('#dv'+objID+'').show();
}
function dvCloseMain(dvM){
	$('#'+dvM+'').hide();
}
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
		num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num*100+0.50000000001);
		cents = num%100;
		num = Math.floor(num/100).toString();
	if(cents<10)
		cents = "0" + cents;
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+','+
		num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + '$' + num + '.' + cents);
}
function scrollToHere(obj){
	var objPos = ObjectPosition(document.getElementById(obj));
	var posL 
	posL = objPos[0];
	var posT 
	posT = objPos[1] - 10;
	if (obj.indexOf('dvTabs') > -1){posT = objPos[1] + 25};
	if (obj.indexOf('aMore') > -1){posT = objPos[1] -30;};
	if (obj.indexOf('dvItinRel') > -1){posT = objPos[1] +5;};
	$('#popUp').attr('style','position:absolute; z-index:9999; width:auto; left:50%; margin-left:-387px; top:'+ posT +'px;');
	$('#popUp').fadeIn(2000);
	var objTOGO
   	objTOGO = $('#'+obj+'').offset(); 
  	$('html,body').animate({
	scrollTop: objTOGO.top - Number(170)},2000);
}
function closeDiv(){
	$('#divRecomended').hide();
}
function divToShow(dv){
	$('#dv'+dv+'').show();
	
}
function divToHide(dv){
	$('#dv'+dv+'').hide();
}
function scrollToMore(jbo){
  var objTOGO
  objTOGO = jbo
  objTOGO = $('#'+objTOGO+'').offset(); 
  $('html,body').animate({
	  scrollTop: objTOGO.top - 80},2000);
}
//used in GP_BestVacations
function buildPics(img) {
	var dvShw
	var aPic = ""
	var noPic = 0
	jQuery.each(img, function(data){
		if (noPic <= 2) {	
            aPic = aPic + '<img src="https://pictures.tripmasters.com' + this.imG_Path_URL.toLowerCase() + '" width="140" height="145" alt="' + this.imG_Title + '" style="background-color:#fff;	padding:1px; border:1px solid #ccc; -moz-border-radius:4px; -webkit-border-radius:4px; border-radius:4px; margin-left:1px;"/>'
				}
				noPic++
	});
	$('#dvfeatPics').html(aPic);
}
//used
function openDivInfFNw(objID){
	var picPM = $('#pic'+objID+'').attr('src');
	if (picPM.indexOf('Plus') > -1){
		$('#dvWait' + objID + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" />');
		$('#dvWait'+objID+'').show();
		$('#moreTx'+objID+'').html('Close more details');
		$('#pic' + objID + '').attr("src",  "https://pictures.tripmasters.com/siteassets/d/minus.jpg");
		relPackCallFNw(objID);	
	}
	else if (picPM.indexOf('Minus') > -1){
		$('#moreTx'+objID+'').html('More details');
		$('#pic' + objID + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
		$('#pkInf'+objID+'').slideUp();
	}
}
//used from openDivInfFNw()
function relPackCallFNw(packID, dvRel) {
	var relTxt = '';
	var mrChoice = '';
	var divCom = 'dvComF'+packID;
	var divInf = 'pkInf'+packID;
    var divRel = 'dvRelF' + packID;

    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/getDataRelPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            //console.log("Succes: " + data);
            msg = data;
            if (msg != '') {
                relTxt = '<div class="Text_Arial11_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                mrChoice = '<div class="Text_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    if (strPrts[i].indexOf('^^') > -1) { strPrts[i] = strPrts[i].replace('^^', ''); };
                    echP = strPrts[i].split('|');
					relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
					relTxt = relTxt + '<a href="'+ SiteName +"/" + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                    relTxt = relTxt + '<span class="Text_Arial11_Light">'
                    relTxt = relTxt + '<u>' + echP[0] + '</u>'
                    relTxt = relTxt + '</span></a></span>'
                    if (echP[2] != 5) {
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '" >' + echP[0] + '</a>'
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '" id="dop' + echP[3] + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                        mrChoice = mrChoice + '</span>'
                    }
                }
                relTxt = relTxt + '<br style="clear:both"/></div>';
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
            console.log("Error");
            $('#' + divWai + '').html('');
            $('#' + divWai + '').hide();
            $('#' + divInf + '').show();
        }
    });
}

var imgSrc;
var imgVal;
var idPack;
function openDivInfF(objID, typ){
	var divOpen = 'pkInf'+objID
	var picChan = 'pic'+objID
	var spnText = 'moreTx'+objID
	var dvMrTx = 'dvMrTxt'+objID
	var dvMrPic = 'dvMrPic'+objID
	var dvRelP = 'dvRelF'+objID
	
	if (typ == 1){
		var dvOp = $('div[id^="dvMrTxt"]');
		for (i=0;i<=dvOp.length-1;i++){
			var estaTx 
			var estaPi
			if (dvOp[i].id.indexOf(objID) > -1){
				$('#'+dvMrTx+'').hide();
				$('#'+dvMrPic+'').show();
				$('#'+divOpen+'').show();
				$('#otherMr').hide();
				relPackCall(objID, dvRelP);
				$('#otherMr').slideDown(); 
			}	
			if (dvOp[i].id.indexOf(objID) == -1){
				var esta = dvOp[i].id
				var endStr = esta.length 
				var clsID = esta.substring(7,endStr)
				$('#'+'pkInf'+clsID+'').hide();
				$('#'+'dvMrTxt'+clsID+'').show();
				$('#'+'dvMrPic'+clsID+'').hide();
				$('#dvajx'+clsID+'').hide();
			}
		}
	}
	else if (typ == 2){
		$('#'+dvMrTx+'').show();
		$('#'+dvMrPic+'').hide();
		$('#'+divOpen+'').hide();
		$('#otherMr').slideUp();
		$('#dvajx'+objID+'').hide();
	}
	else{
		imgSrc = $('#'+picChan+'').attr("src");
		imgVal = imgSrc.indexOf("Plus");
		if (imgVal != -1){
			$('#' + picChan + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");
			$('#'+spnText+'').html('Close more details');
			$('#'+divOpen+'').show();
			if (typ == 1){
				$('#otherMr').slideDown();
			}
			relPackCall(objID, dvRelP);
		}
		else{
			if (typ == 1){
				$('#otherMr').slideUp();
			}
			$('#' + picChan + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
			$('#'+spnText+'').html('More details');
			$('#'+divOpen+'').hide();
			$('#dvajx'+objID+'').hide();
			
			$('#'+dvRelP+'').html('')
		}
	}
}
function relPackCall(packID, dvRel) {
	var divCom = 'dvComF' + packID;
	var relTxt = '';
	var mrChoice = '';
	var divCom = 'dvComF'+packID;
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/getDataRelPacks/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function (data) {
			//console.log("Succes: " + data);
			msg = data;
			if (msg != '') {
						relTxt = '<div class="Text_Arial11_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
						mrChoice = '<div class="Text_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
						strPrts = msg.split('@');
						for(i=0;i<=strPrts.length -1;i++){
							if (strPrts[i].indexOf('^^') > -1){ strPrts[i] = strPrts[i].replace('^^','');};
							 echP = strPrts[i].split('|');
							relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
							relTxt = relTxt + '<a href="/' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
							 relTxt = relTxt + '<span class="Text_Arial11_Light">'
							 relTxt = relTxt + '<u>'+echP[0]+'</u>'
							 relTxt = relTxt + '</span></a></span>'
							  if (echP[2] != 5){
								 mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop'+echP[3]+packID+'" >'+echP[0]+'</a>'
								 mrChoice = mrChoice + '<input type="checkbox" name="dop'+echP[3]+packID+'" id="dop'+echP[3]+packID+'" style="display:none" value="'+echP[3]+'|'+echP[0]+'"/>'
								 mrChoice = mrChoice + '</span>'
							 }
						}
						relTxt = relTxt + '<br style="clear:both"/></div>';
						mrChoice = mrChoice + '<br style="clear:both"/></div>';
						$('#'+dvRel+'').html(relTxt);
						$('#'+divCom+'').html(mrChoice);
						$('#'+divCom+'').show();
						$('#dvajx'+packID+'').slideDown();
						$('#otherMr').slideDown();
						activeCckBx('frm'+packID);
					}
				},
				error: function (xhr, desc, exceptionobj) {
					//alert(xhr.responseText +' = error');
				}
			});
}
//used in GP2_CityPage.cshtml
function openDivInfo(packID, whr, plcNA, packNA){     
    //console.log("whr: ");
    //console.log(whr);
	var mrChoice = '';
	var relTxt = '';
	pic = 'pic'+whr+packID;
	divInf = 'dvInf'+whr+packID; 
	divTxt = 'dvTxt'+whr+packID;
	divFee = 'dvFeed'+whr+packID;
	divRel = 'dvRel'+whr+packID;
	divWai = 'dvWait'+whr+packID;
	var divCom = 'dvCom'+whr+packID;
	
	$('#' + divWai + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" />');
	$('#'+divWai+'').show();
		
    //console.log("pic = ");
    //console.log(pic);
    imgSrc = $('#' + pic + '').attr("src");
    //console.log("imgSrc = ");
    //console.log(imgSrc);
	imgVal = imgSrc.indexOf("Plus");
    //console.log("imgVal = ");
    //console.log(imgVal);
if (imgVal != -1){
	$('#' + pic + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");
        //console.log("packID = ");
        //console.log(packID);

			$.ajax({
                type: "GET",
                url: SiteName + "/Api/Packages/getDataRelPacks/" + packID,
				contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    //console.log("Succes: " + data);
					msg = data;
					if (msg != ''){
						
						relTxt = '<div class="Text_Arial11_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
						mrChoice = '<div class="Text_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                        strPrts = msg.split('@');
                        //console.log("strPrts.length: ");
                        //console.log(strPrts.length);
						for(i=0;i<=strPrts.length -1;i++){
							if (strPrts[i].indexOf('^^') > -1){ strPrts[i] = strPrts[i].replace('^^','');};
							 echP = strPrts[i].split('|');
							relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
							relTxt = relTxt + '<a href="' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
							 relTxt = relTxt + '<span class="Text_Arial11_Light">'
							 relTxt = relTxt + '<u>'+echP[0]+'</u>'
							 relTxt = relTxt + '</span></a></span>'
							 if (echP[2] != 5){
								 mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop'+echP[3]+packID+'" >'+echP[0]+'</a>'
								 mrChoice = mrChoice + '<input type="checkbox" name="dop'+echP[3]+packID+'" id="dop'+echP[3]+packID+'" style="display:none" value="'+echP[3]+'|'+echP[0]+'"/>'
								 mrChoice = mrChoice + '</span>'
							 }
						}
						relTxt = relTxt + '<br style="clear:both"/></div>';
                        //console.log("relTxt: ");
                        //console.log(relTxt);
						mrChoice = mrChoice + '<br style="clear:both"/></div>';
						
						$('#'+divRel+'').html(relTxt);
						$('#'+divRel+'').show();
						$('#'+divTxt+'').attr("class","Text_Arial12");
						$('#'+divCom+'').html(mrChoice);
						$('#'+divCom+'').show();
						$('#'+divWai+'').html('');
						$('#'+divWai+'').hide();
						$('#'+divInf+'').slideDown(); 
						activeCckBx('frm'+packID);
					}
				},
                error: function (xhr, desc, exceptionobj) {
                    console.log("Error");
					$('#'+divWai+'').html('');
					$('#'+divWai+'').hide();
					$('#'+divInf+'').show();
				}
			});
	}
	else{
	$('#' + pic + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
		$('#'+divWai+'').html('');
		$('#'+divWai+'').hide();
		$('#'+divInf+'').slideUp(); 
	}
}
function activeCckBx(frm){
	$('#'+frm+' input:checkbox').each( function() {
		(this.checked) ? $('#false'+this.id+'').addClass('falsecheckeddop') : $("#false"+this.id+'').removeClass('falsecheckeddop');
	});
	// function to 'check' the fake ones and their matching checkboxes
	$('#'+frm+' .falsecheckdop').click(function(){
		var replID = this.id.replace('false','');
		if (($(this).hasClass('falsecheckeddop'))) {
			$(this).removeClass('falsecheckeddop')
			$('#'+replID+'').removeAttr('checked');
		} else {
			$(this).addClass('falsecheckeddop');
			$('#'+replID+'').attr('checked', true);
		}
		$(this.hash).trigger("click");

		return false;
	});
}
var totpg
var strMsg
var strDiv
var placeNA
var placeID
var FrToTxt = new Array

function findPackst4(formID) {
	if ($('#' + formID + ' #allID').val() != '') {
		$('#' + formID + ' #allID').val('')
	}
	if ($('#' + formID + ' #allNA').val() != '') {
		$('#' + formID + ' #allNA').val('')
	}

	var idForm = formID
	var idString = $('#' + idForm + '').serialize();
	if (idString.indexOf("&__RequestVerificationToken")) {
		idString = idString.substring(0, idString.indexOf("&__RequestVerificationToken"))

    }
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
				idID = idID + ',' + idValN[0];
				idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
			}
			else {
				idID = idValN[0];
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
}

function findPacks2(formID) {
	var idForm = formID
	var idString = $('form#' + idForm + '').serialize();
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
				idID = idID + ',' + idValN[0];
				idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
			}
			else {
				idID = idValN[0];
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
}
//used in GP2_CityPage.cshtml
function countryDest(thisCou) {
    var $dvPos = $('#dvlinkHeader');
    var $dvCont = $('#navDest');
    var dvPos = document.getElementById('dvTtl');
    var dvIns = '<div style="float:left; margin:0px; width:150px; pading-left:5px;" align="left">'
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Vacations/EDDestinos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            var plcD = data;
            var dtC = 0
            var nwurl
            jQuery.each(plcD, function(data) {
				if (dtC % 8 == 0 && dtC > 0) { dvIns = dvIns + '</div><div style="float:left; margin:0px; width:150px;" align="left">' }
				nwurl = SiteName + "/" + this.plcNA.replace(/\s/g, '_').toLowerCase() + "/vacations'"
                dvIns = dvIns + '<div id="eachDST" onclick="window.location=' + "'" + nwurl + '">' + this.plcNA + '</div>'
                ++dtC
            });
            dvIns = dvIns + '</div><div style="clear:both"></div>'
            $('#destVal').html(dvIns);
            var popP = $dvPos.offset();
            var popT = popP.top + 35;
            var popL = popP.left - 570;
            $dvCont.attr('style', 'position:absolute; z-index:9999; width:auto; margin-left:-340px; left:50%;  top:' + popT + 'px;');
            $dvCont.slideDown("slow");
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }
    });
}
function windowCMS(id, w, h) {
	var jhref = 'https://www.tripmasters.com/cms/' + id + '?cms&wh=0&wf=0';
    centerWindow(jhref);
    return false;
}
function openWinCMS(cmsid, jhref) {
	centerWindow(jhref);
	return false;
};
/* *** POI MAP *** */
var objPOI;
var map;
var ctylocLat = 0;
var ctylocLong = 0;
function getMapPoiData(plcid) {
	ctylocLat = 0;
	ctylocLong = 0;
	var cylat = [];
	var cylon = [];
	var dt = { Id: plcid };
	$.ajax({
		type: "POST",
		url: SiteName + "/Api/Hotels/POIHotels/",
		contentType: "application/json; charset=UTF-8",
		data: JSON.stringify(dt),
		success: function (data) {
			objPOI = data;
			var LL = 0;
			jQuery.each(objPOI, function (data) {
				cylat.push(Number(this.POI_Latitude))
				cylon.push(Number(this.POI_Longitude))
				LL++;
			});
			var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
			var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
			delete distLats;
			distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
			delete ctyLatLong;
			ctyLatLong = Number(midLat) + '|' + Number(midLon); 
			preBuildMap(data);
		},
		error: function (xhr, desc, exceptionobj) {
			$('#dvGoogleMap').html(xhr.responseText);
		}
	});
};

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
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function buildMapPoi(data) {
    map = null;
    var useLatLong = ctyLatLong.split('|');
    var regLat = useLatLong[0];
    var regLong = useLatLong[1];
    var rlatlng = new google.maps.LatLng(regLat, regLong);
    var poiZoom = 10;
	switch (true) {
	    case (distLats < 50):
	        poiZoom = 11;
	        break;
	    case (distLats > 50 && distLats < 150):
	        poiZoom = 10;
	        break;
	    case (distLats > 150):
	        poiZoom = 9
	        break;
    }
    var myOptions = {
        zoom: poiZoom,
        center: rlatlng,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        panControl: true,
        zoomControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvGoogleMap"), myOptions);
    var Pcont = 0;
    jQuery.each(objPOI, function (data) {
        Pcont++;
        var locLat = this.POI_Latitude;
        var locLong = this.POI_Longitude;
        var iconImg = 'MapMarker_Ball__Orange_40.gif';
        var poiAnchor = new google.maps.Point(4,25)
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
			icon:  'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            labelAnchor: poiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 1 },
            title: this.POI_Title,
            zIndex: 8998
        });
        var message = '<div class="dvBublleStyle">';
        if (this.POI_PictureURL != 'none') {
            message = message + '<img src="' + this.POI_PictureURL + '" align="left"/>';
        }
        message = message + '<div>' + this.POI_Title + '</div>';
        if (this.POI_Description != 'none') {
            message = message + this.POI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); }); 
        infoPOIWindows.push(infoWind);
	
	    var sname = this.POI_Title;
		var infoSTitle = new google.maps.InfoWindow({ content: sname, size: new google.maps.Size(20, 20) });
		google.maps.event.addListener(marker, 'mouseover', function () { infoSTitle.open(map, marker); });
		google.maps.event.addListener(marker, 'mouseout', function () { infoSTitle.close(map, marker); });
	});
};

function preBuildMap(data){
	var $dvMap = $('#dvShowMap');
	var $objpos = $('#dvPoiLink');
	var popP = $objpos.offset();
	var popT;
	if(popP.top <= 600){popT = 100}else{popT=popP.top - 300};
	$dvMap.attr('style', ' top:'+ popT +'px;'); 
	$dvMap.attr('class','dvShowMap');
    $dvMap.show();
	$('html,body').animate({scrollTop: popT-30},2000);
	buildMapPoi(data);
};
function closePoiInfoW(mp,mrk,winfo){
	for (var i=0;i<infoPOIWindows.length;i++) {
		infoPOIWindows[i].close();
	};
	winfo.open(mp,mrk);
};
var objHotPOI;
function buildHotelPoi(data){
	var Phcont = 0;
	jQuery.each(objHOT, function(data) {
		Phcont++;
		var hlocLat =  this.PTY_Latitude;
		var hlocLong = this.PTY_Longitude;
		var starNum = this.SCD_CodeTitle.match(isNumber);
		var hiconImg = 'hotel_'+starNum+'stars_GR.png';
		var hpoiAnchor=new google.maps.Point(-13,39)
        var hmarker = new google.maps.Marker({
			icon: 'https://pictures.tripmasters.com/siteassets/d' + hiconImg,
            position: new google.maps.LatLng(hlocLat, hlocLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelContent: '<div class="bubbleH">' + this.PDL_Title + '</div>',
            labelAnchor: hpoiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 0.75 },
            title: this.PDL_Title,
            zIndex: 8998
        });
		var message = '<div class="dvHotBubble">';
		if (this.IMG_Path_URL != 'none'){
			message = message + '<div class="dvimgHot"><img src="https://pictures.tripmasters.com'+this.IMG_Path_URL.toLowerCase()+'"/></div>';
		};
		message = message + '<div class="dvaddHot"><span>' + this.PDL_Title + '</span><br/><img src="' + 'https://pictures.tripmasters.com/siteassets/d/Stars_'+starNum+'_Stars.gif"/><p>'+this.PTY_Address+'</p></div>';
		if (this.POI_Description != 'none'){
			message = message + '<div class="dvdescHot">'+this.PTY_Description+'</div>';
		};
		message = message + '</div>';
		var infoHWind = new google.maps.InfoWindow({content:message, size:new google.maps.Size(40,40)});
		google.maps.event.addListener(hmarker, 'click', function() {infoHWind.open(map,hmarker);});
		markerHotels.push(hmarker);
	});
};
function triptaketo(cotogo) {
    if (cotogo == '0') {
        return;
    }
    var goparts = cotogo.split('|');
    var plid = goparts[1];
	var plna = goparts[0];
	window.location = "/europe/" + plna.toLowerCase() + "/trips_taken_by_travelers"
}

    function dvOpenMore(obj){
	var pos = $('#'+obj+'').position();
	var tp = pos.top
	var lf = pos.left +200
	var hg = $(document).height();
	$('#dvmoreCities').attr('style','position:absolute; z-index:100; width:600px; height:auto; top:'+tp+'px; left:'+lf+'px; background:#fff; border:solid 1px #ccc; padding: 5px 0 15px 0').show();
	$('#dvmask').attr('style', 'position:absolute;z-index:99;background-color:#369;display:none;top:0;left:0;opacity:.7; width:100%; height:'+hg+'px');
	$('#dvmask').show();
}
function dvCloseMore(obj){
        $('#' + obj + '').hide();
	$('#dvmask').removeAttr('style').hide();
}
