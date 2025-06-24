//Javascript Document
// *************************************** //
// NEW HOME PAGE
// *************************************** //
	var regionCheck = 'TMLD';
	var depCities = [];
	var arrivalCities = [];
	var latinCities = [];
	var arrvCTY = [];
	var myDate = new Date();
	var BorF = 'BYO';
	var docH ;
	var backCookie;
	var visitID;
	var chnC = 0;
var visCook = 0;
//var SiteName = "/latin";
	$(document).ready(function(){	
		/*  ****  utm Campaign  *** */
		var cookMark = Cookies.get('utmcampaign');
		var cookMkVal;

		$('.template-RecentlyViewed').hide(),
		$('.moreViewed').hide()
		if(Cookies.get('ut2') != undefined){
			var vstIDs = Cookies.get('ut2').split('&');
				var vstID = vstIDs[0].split('=');
			visitID = vstID[1];
		}
		else{
			_ut2Functions.push(function() {
				utValues = _ut2;
				jQuery.each(utValues, function(i, val) {
					if (i == '_utvId') { visitID = val; };
				});
			});
        };	
		$('#dvHeaderGap').css('margin-bottom','0px');
		$('.dvhGreyBG').css('margin-bottom','0px');
		$('.moreViewed, .buildButton, .btnRevMore').click(function () { winlocation(this.getAttribute("data-go-to")); });	
		$('.dvshowPIC').on('click','img', function(){popupThisImages(this)});
		$('.moreImgButt').click(function(){popupThisImages()});
		$('.moreSuggButton').click(function(){moreSuggestPacks()});
		$('#imgForw').click(function () { swichImg('F') });
		$('#imgBack').click(function () { swichImg('B') });
		buildPackImg();
		$('.dvEachOtherMore').click(function () {
			var eachID = this.getAttribute("data-id");
			otherMoreDetails(eachID, 1);
		});
		$('.dvOtherClose span').click(function () {
			var closeID = this.id;
			otherMoreDetails(closeID, 0);
		});
});

function showRecently() {
	var idpaks = Cookies.get('utPackView');
	var dataID = { Id: visitID };

	var options = {};
	options.url = SiteName + "/Api/RecentlyViewed";
	options.type = "POST";
	options.contentType = "application/json";
	options.data = JSON.stringify(dataID);
	options.dataType = "json";
	options.success = function (data) {
		pkVisited = data;
		var visC = 0
		pkVisited ? visC = pkVisited.length : "";

		visC > 0 ?
			(
				$('.dvRecentlyTitle').find('span').html("[" + visC + "]"),
				buildRecentlyViewed(pkVisited),
				visC > 5 ? $('.moreViewed').show() : $('.moreViewed').hide()

			)
			:
			(
				$('.template-RecentlyViewed').hide(),
				$('.moreViewed').hide()
			);
	};
	options.error = function (xhr, desc, exceptionobj) {
		console.log(xhr);
	};
	$.ajax(options);
	return false;
};
Date.timeBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;
  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();
  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
  //take out milliseconds
  difference_ms = difference_ms/1000;
  var seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60; 
  var minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60; 
  var hours = Math.floor(difference_ms % 24);  
  var days = Math.floor(difference_ms/24);
  var passTime
  days > 0 ? ( days === 1 ? passTime = days + ' day ago' : passTime = days + ' days ago' ) :  hours > 0 ? ( hours === 1 ? passTime = hours + ' hour ago' : passTime = hours + ' hours ago' ) :  minutes > 0 ? ( minutes === 1 ? passTime = minutes + ' minute ago' : passTime = minutes + ' minutes ago' ) :  ( passTime =  '  just visited' );
  return passTime
};
function buildRecentlyViewed(jsonObj) {
	var objC = 0;
	var siteURL;
	var visitURL = "www.tripmasters.com";
	var newVisit = "";
	var visited = "";
	jQuery.each(jsonObj, function (data) {
		objC++;
		if (objC < 6) {
			switch (this.UTS_Site) {
				case 'TMLD':
					siteURL = "/europe" //"http://www.tripmasters.com/europe";				
					break;
				case 'TMASIA':
					siteURL = "/asia" //"http://www.tripmasters.com/asia";				
					break;
				case 'TMLD':
					siteURL = "/latin" //"http://www.tripmasters.com/latin";				
					break;
			};
			var jsdate = new Date(Date.parse(this.UTS_Date));
			var today = new Date();
			var lastVst = Date.timeBetween(jsdate, today);
			visited = visited +
				'<li>' +
				'<div class="div-ContainerFlex" >' +
				'<div class="wrapper">' +
				'<img src="https://pictures.tripmasters.com' + this.IMG_Path_URL.toLowerCase() + '" alt="' + this.PDL_Title + '">' +
				'<div>' +
				'<h5><a href="' + this.UTS_URL + '">' + this.PDL_Title + '</a></h5>' +
				'</div>' +
				'</div>' +
				'<div class="div-UnderImg">' +
				'<p class="p-under1">Viewed ' + lastVst + '</p>'
			if (this.feedbacks > 0) {
				visited = visited + '<p class="p-under1">' +
					'<a href="' + this.UTS_URL.replace("/package", "/feedback") + '">' + this.feedbacks + ' Customer Reviews</a>' +
					'</p>'
			};
			visited = visited + '<hr class="hr1">' +
				'<a href="' + this.UTS_URL + '" class="allRecViewBtn">Customize It</a>' +
				'</div>' +
				'</div >' +
				'</li >'
		};
	});
	$('#ulRecentlyViewed').append(visited)
	$('.template-RecentlyViewed').slideDown();
};
/*
 * template-RecentlyViewed
*/
function moreSuggestPacks(){
	$('#sugg2').is(':visible') === false? ($('#sugg2').slideDown('slow'),$('.moreSuggButton').removeClass('moreSuggButton').addClass('moreSuggButtonRot')) : ($('#sugg2').slideUp('slow'),$('.moreSuggButtonRot').removeClass('moreSuggButtonRot').addClass('moreSuggButton'));
};
function buildPackImg() {
	var dvShw;
	var hvMap = 0;
	var hvBigMap = 0;
	var picU;
	var picW, picH, picMtp;
	var fstPic;
	var picClass;
	var idIMG = 'Bipic';
	var idNUM = 3
	var packID = $('#imgItemID').val();
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/PicsForPacks/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			objPics = data;
			objImgs = $.grep(objPics, function (n, i) { return (n.imG_ImageType == 'P0'); });
			picTotal = objPics.length;
			var imageIndex = 0;
			if (objPics.length <= 3)
				imageIndex = objPics.length - 1;
			if (objPics[imageIndex]) {
				picW = imageSize(objPics[imageIndex].imG_500Path_URL, objPics[imageIndex].imG_ImageType)
				if (objPics[imageIndex].imG_ImageType == 'M0') {
					idIMG = 'KipicMap';
					idNUM = 1;
				}
				var txtshowpic = '<img src="https://pictures.tripmasters.com' + objPics[imageIndex].imG_500Path_URL.toLowerCase() + '" id="' + idIMG + idNUM + '" alt="' + objPics[imageIndex].imG_500Path_URL.toLowerCase() + '" title="' + objPics[imageIndex].imG_Title + '" width="' + picW[0] + '" height="' + picW[0] + '" class="clsCursor"/>';
				//console.log(txtshowpic);
				$('.dvshowPIC').html(txtshowpic);
				$('.dvshowPIC').show();
			};
			if (picTotal == 3) {
				CarrouPicsBuild(3);
			} else if (picTotal == 4) {
				CarrouPicsBuild(4);
			} else if (picTotal == 5) {
				CarrouPicsBuild(5);
			} else {
				CarrouPicsBuild(6);
			}
			for (m = 0; m < Number(picTotal - 1); m++) {
				if (objPics[m].imG_ImageType == 'M0') {
					$('#dvsmalMAP').html('<image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL + '" width="325" height="325" alt="' + objPics[m].imG_500Path_URL.toLowerCase() + '" title="' + objPics[m].imG_Title + '"/>');
					$('#dvsmalMAP').show();
					shwMaps = shwMaps + '<div align="center"><span class="Text_Arial12_LightBold">' + objPics[m].imG_Title + '</span><br/><br/><image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL + '" alt="' + objPics[m].imG_500Path_URL.toLowerCase() + '" title="' + objPics[m].imG_Title + '"/></div>';
					$('#dvShwMap').html(shwMaps);
					m = Number(picTotal - 1)
				}
				else {
					if (hvBigMap == 1) {
						$('#dvShwMap').html(shwMaps);
					}
					else {
						$('#dvTabMap').hide();
					};
				};
			};
		},
		error: function (xhr, desc, exceptionobj) {
			$('#packPics').html(xhr.responseText);
		}
	});
	$('a[id*="prev"]').click(function () { sliceThumb(Number(ini), Number(fin), this.id); return false; });
	$('a[id*="next"]').click(function () { sliceThumb(Number(ini + 6), Number(fin + 6), this.id); return false; });
};
function winlocation(url) {
    window.location = url;
};
function openMask(){
	var maskH = $(document).height();
	$('.dvMask').css({'height':maskH}); 
	$('.dvMask').fadeIn(1000);
	$('.dvMask').fadeTo("slow",0.9);
};
function popupImages() {	
    var img1S = objPics[0].picBIG;
    if (img1S == undefined) { img1S = objPics[0].picURL; };
    var img1T = objPics[0].picNA;
    $('.dvFstPic').html('<img src="https://pictures.tripmasters.com' + img1S.toLowerCase() + '" title="' + img1T + '" alt="' + img1S.toLowerCase() + '"/>');
    $('#dvPicNa').html(img1T);
    popUpImagesNav();
    var objP = $('.dvImgContOv').position();
    var dvW = 1010;
    var dvML = -505;
    $('#dvMask').css({ 'width': maskW, 'height': maskH });
    $('#dvMask').fadeTo("slow", 0.65);
    $('.dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;'); //top:25%
    $('.dvmediaPopUp').show();
    window.scrollTo(0, Number(objP.top + 600));
};
function popupThisImages(obj) {
  	popUpImagesNav();
    var objP = $('.dvImgContOv').position();
	openMask();
    $('.dvmediaPopUp').css('top',objP.top).show();
	window.scroll(0, objP.top - 150);
	obj === undefined ? (
		obj = $('.dvshowPIC').find('img'), 
		replacePicture(obj.attr('id').replace('B', 'K'), obj.attr('src'), obj.attr('title'), obj.attr('alt'))
	) : replacePicture(obj.id.replace('B', 'K'), obj.src, obj.title, obj.alt); 
};
function replacePicture(picID, picSRS, picTTL, picALT) { 	 
	var picURL;
	picALT === 'none' ? picURL = picSRC : picURL = 'https://pictures.tripmasters.com' + picALT;
	/O/.test(picID) === false ?
	(	$('img.picSel[id*="Kipic"]').attr('class', 'picNSel'),
		$('img.picSel[id*="Mipic"]').attr('class', 'picNSel'),
		$('#' + picID + '').attr('class', 'picSel'),
		$('.dvFstPic').html('<img src="' + picURL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" />'),
		/M/.test(picID) === true ? ($('#dvMV').hide(), $('#Mipic' + picID.match(isNumber) + '').attr('class', 'picSel') ) : ( $('#dvMV').show(), $('#dvPicNa').html(picTTL) ) 
	)
	:
	(	 $('img[id*="Oipic"]').attr('class', 'picNSel'),
		 $('#' + picID + '').attr('class', 'picSel'),
		 /Map/.test(picID) === true || picURL.match(img500) === true ? 
		 (	$('.dvshowPIC').html('<img src="' + picURL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '" alt="' + picALT + '" title="' + picTTL + '" width="290" height="290"  class="clsCursor"/>'),
			$('.selM').css('width', '399px'),
			$('#dvallTHU').attr('style', 'width:258px;')
		 )
		 : 
		 ( 	$('.dvshowPIC').html('<img src="' + picURL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '"  class="clsCursor"/>'),
			$('.selM').css('width', '399px'), 
			$('#dvallTHU').attr('style', 'width:258px;')
		 )
	);
};
function moreMediaCLS() {
	$('.dvMask').hide().removeAttr('height');
    $('.dvmediaPopUp').hide();
};
// ******************************
// OLD HOME PAGE
// ******************************
var pics = '';
var aPic = '';
var thumPic = '';
var OthumPic = '';
var TthumPic = '';
var thumMap = '';
var OthumMap = '';
var picSize = 200;
var shwMaps = '';
var maskH;
var maskW;
var isNumber = /[0-9]+/g;
$(document).ready(function () {
    maskH = $(document).height();
    maskW = $(window).width();
   
    $('.moreButton').click(function () {
        $('.dvEacHighhHide').is(':visible') === false ?
            ($(this).html('Close More Highlights & Attractions '), $('.dvEacHighhHide').slideDown())
        : ($(this).html('More Highlights & Attractions'), $('.dvEacHighhHide').slideUp());
    });
    $('.dvSuggestTitle a, .dvEachSuggest2ndCol').click(function () {
        var suggestID = this.id;
        var $dvInf = $('#divInfo' + suggestID + '');
        $dvInf.is(':visible') == false ? (
           $dvInf.slideDown(),
           $('div.dvEachSuggest2ndCol[id="' + suggestID + '"]').css('transform', 'rotate(270deg)'),
           otherMoreDetails(suggestID, 1)
           )
        :
          (
           $dvInf.slideUp(),
           $('div.dvEachSuggest2ndCol[id="' + suggestID + '"]').css('transform', 'rotate(90deg)')
           );
        return false;
    });
});
function otherMoreDetails(objid, cls) {
    $('.dvOtherInfo').each(function () {
        var idDiv = $(this).attr('id');
        var idNum = idDiv.match(isNumber);
        idNum == objid ? (
            $('#' + idDiv + '').is(':visible') == false ? (
                $('#' + idDiv + '').slideDown(),
                $('#dvArrow' + idNum + '').slideDown(),
                $('div.dveachOtherMore[lang="' + idNum + '"]').find('span').css('transform', 'rotate(270deg)')

            ) : (

                $('#' + idDiv + '').slideUp(),
                $('#dvArrow' + idNum + '').slideUp(),
                $('div.dveachOtherMore[lang="' + idNum + '"]').find('span').css('transform', 'rotate(90deg)')
                )

        ) : (
			$('#' + idDiv + '').slideUp(),
			$('#dvArrow' + idNum + '').slideUp(),
			$('div.dveachOtherMore[lang="' + idNum + '"]').find('span').css('transform', 'rotate(90deg)')

		);
    });
    cls === 1 ? relPackCall(objid) : '';
};
function relPackCall(packID) {
	var relTxt = '';
	var mrChoice = '';
	var divCom = 'dvCom' + packID;
	var divInf = 'dvpkInf' + packID;
	var divRel = 'dvRel' + packID;
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/getDataRelPacks/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function (data) {
			//console.log("Success: " + data);
			msg = data;
			if (msg != '') {
				relTxt = '<div class="txt_grayLight11" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
				mrChoice = '<div class="txt_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
				strPrts = msg.split('@');
				for (i = 0; i <= strPrts.length - 1; i++) {
					echP = strPrts[i].split('|');
					relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
					relTxt = relTxt + '<a href="' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
					relTxt = relTxt + '<span class="txt_grayLight11">'
					relTxt = relTxt + '<u>' + echP[0] + '</u>'
					relTxt = relTxt + '</span></a></span>'
					if (echP[2] != 5) {
						mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '" >' + echP[0] + '</a>'
						mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '" id="dop' + echP[3] + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
						mrChoice = mrChoice + '</span>'
					}
				}
				relTxt = relTxt + '<br style="clear:both"/></div>';
				//console.log("relTxt: " + relTxt);
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
			console.log("Error: " + xhr.responseText);
			$('#dvWait' + packID + '').html(xhr.responseText);
		}
	});
};
// *** ACTIVE CHECK BOX *** ///
function activeCckBx(frm) {
    $('#' + frm + ' input:checkbox').each(function () {
        (this.checked) ? $('#false' + this.id + '').addClass('falsecheckeddop') : $("#false" + this.id + '').removeClass('falsecheckeddop');
    });
    // function to 'check' the fake ones and their matching checkboxes
    var replID;
    $('#' + frm + ' .falsecheckdop').click(function () {
        this.id.indexOf('falsedot') > -1 ? replID = this.id.replace('falsedot', '') : this.id.indexOf('false') > -1 ? replID = this.id.replace('false', '') : '';
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
function imageSize(thisPic, thisTyp) {
    if (thisPic.match(img500) != null || thisTyp == 'M0') {
        picW = '290px';
        picMtp = '0px';
        $('.selM').css('width', '399px');
        $('#dvallTHU').attr('style', 'width:258px;');
    }
    else {
        picW = '200px';
        picMtp = '45px';
        $('.selM').css('width', '399px');
        $('#dvallTHU').attr('style', 'width:258px;');
    };
    return [picW, picMtp];
};
function CarrouPicsBuild(phoN) {
	CoPic = 0;
	CoMap = 0;
	for (i = 0; i < phoN; i++) {
		if (i == 0) { picClass = "picSel" } else { picClass = "picNSel" };
		if (objPics[i].imG_ImageType == 'P0') {
			CoPic++
			TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>';
			//console.log("TthumPic: ");
			//console.log(TthumPic);
		} else if (objPics[i].imG_ImageType == 'M0') {
			CoMap++
			TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '"  class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';
			//console.log("TthumPic: ");
			//console.log(TthumPic);
			hvBigMap = 1;
		}
		ini = 0;
		fin = i;
	}
	if (picTotal < 6) {
		var leftPadd = 18 * (6 - picTotal);
	} else { leftPadd = 0; }
	$('#dvallTHU #prev').css({ "padding-left": "" + leftPadd + "px", "background-position": "" + leftPadd + "px 0" });
	$('#thumbs').html(TthumPic);
	$('img.picSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
	$('img.picNSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
};
function sliceThumb(ifrom, ito, idir) {
	TthumPic = ""
	if (idir == 'prev') {
		if (ito == picTotal - 1) {
			var diff = Number(ito - ifrom);
			ifrom = ifrom - 6;
			ito = Number(ito - diff) - 1;
		}
		else {
			ifrom = ifrom - 6;
			ito = ito - 6;
		}
		if (ifrom < 0) { alert('No more images'); return false; }
		else {
			var CoPic = ifrom;
			var CoMap = ifrom;
			for (i = ifrom; i <= ito; i++) {
				picClass = "picNSel"
				if (objPics[i].imG_ImageType == 'P0') {
					CoPic++;
					TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>'

				}
				else if (objPics[i].imG_ImageType == 'M0') {
					CoMap++;
					TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';

				}
				ini = ifrom;
				fin = i;
			}
			$('#thumbs').hide("slide", { direction: 'right' }, 200);
			$('#thumbs').html(TthumPic);
			$('#thumbs').show("slide", { direction: 'left' }, 500);
			$('img.picSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
			$('img.picNSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });

		};
	}
	if (idir == 'next') {
		if (ito > picTotal - 1) { ito = picTotal - 1 };
		if (ifrom >= picTotal - 1) { alert('No more images'); }
		else {
			var CoPic = ifrom - 1;
			var CoMap = ifrom - 1;
			for (i = ifrom; i <= ito; i++) {
				picClass = "picNSel"
				if (objPics[i].imG_ImageType == 'P0') {
					CoPic++;
					TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>'

				}
				else if (objPics[i].imG_ImageType == 'M0') {
					CoMap++;
					TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';

				};
				ini = ifrom;
				fin = i;
			};
			$('#thumbs').hide("slide", { direction: 'left' }, 200);
			$('#thumbs').html(TthumPic);
			$('#thumbs').show("slide", { direction: 'right' }, 500);
			$('img.picSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
			$('img.picNSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
		};
	};
};
function popUpImagesNav() {
	thumPic = '';
	thumMap = '';
	hvMap = 0;
	var Cpic = 0;
	var Cmap = 0;
	var thumClass = 'picNSel';
	for (i = 0; i < Number(picTotal); i++) {
		if (i == 0) { thumClass = 'picSel' } else { thumClass = 'picNSel' };
		if (objPics[i].imG_ImageType == 'P0') {
			Cpic++
			thumPic = thumPic + '<img id="Kipic' + Cpic + '" class="' + thumClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/>';
		}
		else if (objPics[i].imG_ImageType == 'M0' || objPics[i].imG_ImageType == 'M1') {
			Cmap++
			thumMap = thumMap + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="Mipic' + Cmap + '" class="' + thumClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL + '" title="' + objPics[i].imG_Title + '"/>';
			hvMap = 1;
		};
	};
	newPicTot = Cpic;
	$('#dvThuPic').html('Photos<br/>' + thumPic);
	if (hvMap == 1) {
		$('#dvThMp').show();
		$('#dvThuMap').html('Map<br/>' + thumMap);
	}
	else {
		$('#dvThMp').hide();
		$('#dvTabMap').hide();
	};
	$('img.picSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
	$('img.picNSel').click(function () { replacePicture(this.id, this.src, this.title, this.alt) });
};
function swichImg(bf) {
    var totPic;
    totPic = newPicTot 
    var thisPic = $('img.picSel[id^="K"]');
    var iID = thisPic.attr('id');
    iID = iID.replace('ipic', '');
    if (iID.indexOf('O') > -1) { iID = iID.replace('O', ''); };
    if (iID.indexOf('K') > -1) { iID = iID.replace('K', ''); };
    var newID;
    var newPic;
    var newImg;
    if (bf == 'F') {
        if (iID == totPic) { alert('No more photos') }
        else {
            newID = Number(iID) + 1;
			newImg = objImgs[iID].imG_500Path_URL;
			if (newImg == '') { newImg = objImgs[newID].imG_500Path_URL; };
            newPic = $('#Kipic' + newID + '');
            $('.dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
            $('#dvPicNa').html(newPic.attr('title'));
            newPic.attr('class', 'picSel');
            thisPic.attr('class', 'picNSel');
        };
    };
    if (bf == 'B') {
        if (iID == 1) { alert('No more photos') }
        else {
            newID = Number(iID) - 1;
			newImg = objImgs[newID - 1].imG_500Path_URL;
			if (newImg == '') { newImg = objImgs[newID - 1].imG_500Path_URL; };
            newPic = $('#Kipic' + newID + '');
            $('.dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
            $('#dvPicNa').html(newPic.attr('title'));
            newPic.attr('class', 'picSel');
            thisPic.attr('class', 'picNSel');
        };
    };
};

function moreMedia() {
    var img1S = objPics[0].picBIG;
    if (img1S == undefined) { img1S = objPics[0].picURL; };
    var img1T = objPics[0].picNA;
    $('.dvFstPic').html('<img src="https://pictures.tripmasters.com' + img1S.toLowerCase() + '" title="' + img1T + '" alt="' + img1S.toLowerCase() + '"/>');
    $('#dvPicNa').html(img1T);
    popUpImagesNav();
    var objP = $('.dvImgContOv').position();
    var dvW = 1010;
    var dvML = -505;
    $('#dvMask').css({ 'width': maskW, 'height': maskH });
    $('#dvMask').fadeTo("slow", 0.65);
    $('.dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;'); //top:25%
    $('.dvmediaPopUp').show();
    window.scrollTo(0, Number(objP.top + 600));
};
function moreMediaB(picID, picSRS, picTTL, picALT) {
    popUpImagesNav();
    var objP = $('.dvImgContOv').position();
    var dvW = 1010;
    var dvML = -505;
    $('#dvMask').css({ 'width': maskW, 'height': maskH });
    $('#dvMask').fadeTo("slow", 0.8);
    $('.dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;');
    $('.dvmediaPopUp').show();
    window.scrollTo(0, Number(objP.top + 600));
    replacePicture(picID.replace('B', 'K'), picSRS, picTTL, picALT);
};

function scrollToTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 800);
};
function findPacksHome(formID) {
    $("#" + formID + " input[name=allID]").val("");
	$("#" + formID + " input[name=allNA]").val("");
	$("#" + formID + " input[name=__RequestVerificationToken]").prop("disabled", true);
    var idForm = formID;
	var idString = $('#' + idForm + '').serialize();
	$("#" + formID + " input[name=__RequestVerificationToken]").prop("disabled", false);
    var idStrParts;
    var idxOf;
    var idValP;
    var idVal;
    var idValN;
    var idToFind = '';
    var idID = '';
    var idNA = '';
    var chkCHK = 0;
    idString = idString.replace(/\+/g, ' ');
	idString = idString.replace(/\%7C/g, '|');
	idStrParts = idString.split('&');
	for (i = 0; i < idStrParts.length; i++) {
		idValP = idStrParts[i].split('=');
		if (idValP[1] != '') {
			chkCHK = chkCHK + 1
			//console.log("count = " + chkCHK);
			idValN = idValP[1].split('|');
			if (chkCHK > 1) {
				idID = idID + ',' + idValN[0];
				idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '_');
			}
			else {
				idID = idValN[0];
				idNA = idValN[1].replace(/\s/g, '_');
			}

		}

	}
    if (idID == '') {
        alert('Please check at least one box. Thanks!');
        return;
    }
    else {
		$('#allID').val(idID);
		$('#allNA').val(idNA);
		window.location.href = SiteName + '/' + idNA.toLowerCase() + '/find-packages';
	};
};
