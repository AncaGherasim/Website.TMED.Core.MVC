// JavaScript Document
var packID;
var plcNA;
var pakNTS;
var popID;
var fixDatesdiv;
var totCities;
var msg = '';
var TthumPic = '';
var citiesAll = [];
var newdvCnt;
var backCook;
var ctySSPRO = [];
var ctyHotPRO = [];
var allCtySSPRO = [];
var allCtyHotPRO = [];
var HotDispl = [];
var SSDispl = [];
var objPics;
var picTotal;
var CoPic = 0;
var CoMap = 0;
var priceFilter = [];
var priceGuide = [];
var histFilter = [];
var startDate;
var isNumber = /[0-9]+/g;
let currentPic = 0;
let pagePriceHistory = 1;
var totalPax = 0;
var myDate = new Date();
var fxDatesNET;

$(window).bind("pageshow", function (event) {
	if (event.originalEvent.persisted) {
		//page is loaded from cache
		$('#imgPriceIt1').show();
		$('#imgPriceIt2').show();
		$('#imgLoading1').hide();
		$('#imgLoading2').hide();
	};
});
$(document).ready(function () {

	packID = $('#pakID').val();
	plcNA = $('#plcNA').val();
	pakNTS = $('#pakNTS').val();
	fixDatesdiv = $('#fxNetDates').val();

	$('#imgPriceIt1').show();
	$('#imgPriceIt2').show();
	$('#imgLoading1').hide();
	$('#imgLoading2').hide();

	$('span[id^="#ntsBubble"]').each(function (idex, item) {
		$(this).tooltip();
	})
	if ($('#ntsBubble').length > 0) { priceBubble('ntsBubble', pakNTS); };
	totCities = $('#hwMnyCty').val();
	var cookMark = getCookie('utmcampaign');
	var cookMkVal;
	if (cookMark != null) {
		cookMkVal = cookMark.split('=');
		if ($('#utm_campaign').length != 0) {
			$('#utm_campaign').val(jQuery.trim(cookMkVal[1]));
			$('#valCook').html(cookMkVal[1]);
		};
		if ($('#utm_campaignMob').length != 0) {
			$('#utm_campaignMob').val(jQuery.trim(cookMkVal[1]));
			$('#valCook').html(cookMkVal[1]);
		};
	};
	if ($('#ovrCms').length > 0) { callCMS($('#ovrCms').val(), 'dvContOver'); };

	$('.paxRoomChAg').click(function () {
		$(this).select();
	});
	$('.paxRoomChAg').keyup(function () {
		$('#B' + this.id + '').val(this.value);
	});
	$('select[id*="iAdult"]').change(function () {
		$('#' + this.id.replace('A', 'B') + '').val(this.value);
	});

	$('.jxCoInf').click(function () {
		var jhref = $(this).attr("href");
		winOpenCMS(jhref);
		return false;
	})
	/* ******* Docement elements functions ******* */
	$('li[id*="dvTab"]').click(function () { opentabSection(this.id) });
	$('span[id^="bubble"]').each(function (idex, item) {
		$(this).tooltip();
	})
	$('.img-modal__close, .img-modal__title').click(moreMediaClose);
	$('#imgForw').click(nextPicture);
	$('#imgBack').click(prevPicture);
	$('#prevPriceHistory').click(prevPriceHistory);
	$('#nextPriceHistory').click(nextPriceHistory);
	$('#seeMorePriceHistory').click(seeMorePriceHistory);
	$('#closeMorePriceHistory').click(closeMorePriceHistory);
	$('.modal__close').click(closeModal);
	$('#moreRelatedItineraries').click(showMoreRelatedItineraries);
	$('#staggerPaymentsInfo').click(showStaggerPaymentsInfo);
	$('.mob-tab').click(function () { selectMobTab(this.id) });

	setBubbles()
	aboutBUT();
	newDest();
	buildPics();
	readCookVal();
	getPriceHistory();
	if (fxDates == '0') { dateByDest(); }

	if ($('.history-section__list').children().length <= 7) {
		$('.history-section__wrapper-buttons, .history-section__mob-button').hide();
		$('.history-section__list-wrapper > div:nth-child(1)').attr('style', 'height: auto');
	}

	//Mobile calendar
	$('.dvMpriceItMob').is(':visible') == false ? $('.dvMpriceItMob').show() : '';
	$('.dvMpriceItMob').click(function () { validateForm(); });
	// -- fix dates
	fxDatesNET = $('#fxNetDates').val();
	fixDatesdiv = fxDatesNET;
	// -- fix dates
	blockdates = $('#blockDates').val().split('|');

	$('#cabinRoomPaxMob').click(function (e) {
		$('body').addClass('modal-open');
		$('#paxModalMob').show();
		var cabval = $('#wCabinMob').val();
		cabval === 'No' ? $('#dvSelectCabinMob').hide() : $('#dvSelectCabinMob').show();
		haveCook === 1 ?
			(
				$('#dvpxroomlstMob li[id="' + $("#iRoomsAndPaxMob").val() + '"]').trigger('click'),
				$('#dvpxroomlstMob').hide(), $('div p[id^="pAgeMob"] select').each(function () { this.value > 0 ? $(this).parent('p').show() : '' }),
				$('.mob-calendar__cabin-item[id="' + $("#CabinMob").val() + '"]').trigger('click')
			) : '';

	});

	$('#btnWFlyMob').on('click', function () {
		$('#btnWFlyMob').addClass('active');
		$('#btnFlyMob').removeClass('active');
		$('#iDepCityTxtMob').show();
		$('#addFlight').val('True');
	});
	$('#btnFlyMob').on('click', function () {
		$('#btnWFlyMob').removeClass('active');
		$('#btnFlyMob').addClass('active');
		$('#iDepCityTxtMob').hide();
		$('#addFlight').val('False');
	});
	$('#aChgNtsMob').on('click', function () {
		$('#changeNightsMob').toggle('slow');
	});
	$('select[id^="StayNiteMob"]').click(function () { stayChangeMob(this.id, this.value) });
	$('input[id=InDateMob1]').change(function () { changeDateDesk(this.id, this.value) });
	$('input[id=InDate1]').change(function () { changeDateMob(this.id, this.value) });
	$('#dvpaxRoomMob').click(function () { openPaxRoomlist(); });
	$('#dvpxroomlstMob li').click(function () { roomTravelers(this); changePaxByRoom(this.id, 'iRoomsAndPax') });
	$('span[id^="adultPlusMob"]').click(function () { $('input[id^="RoomMob' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultPlus(this) });
	$('span[id^="adultMinusMob"]').click(function () { $('input[id^="RoomMob' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultMinus(this) });
	$('span[id^="childrenPlusMob"]').click(function () { childPlus(this); });
	$('span[id^="childrenMinusMob"]').click(function () { childMinus(this); });
	$('.mob-calendar__cabin-item').click(function () { changeCabin(this); });
	$('#iAdultsMob, input[id^="RoomMob"], select[id^="RoomMob"], select[id^=iChildMob]').click(function () { $(this).removeClass('errorClass') });
	dateByDestMob();
	$('#DoneModalMob').click(function () { hidedialog() });
	$('#BackModalMob').click(function () { hidedialog() });

	$('#buttReorder').click(function () {
		window.location = document.URL.replace("package", "packagebyo");
	});
	///*end docuement ready*/
});

function setBubbles() {
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
}
var deflt = 'New York City (all Airports),  NY';
function getPriceHistory() {
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/PricesHistory/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			priceGuide = data;
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
};
function readCookVal() {
	backCook = jQuery.extendedjsoncookie('getCookieValueDecoded', 'bpBack');
	var NtsStay;
	if (backCook != null || backCook != undefined) {
		var cpackID = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Pkgid');
		if (cpackID != packID) {
			Cookies.set('bpBack', '', { expires: -1 });
			backCook = jQuery.extendedjsoncookie('getCookieValueDecoded', 'bpBack');
		}
		else {
			var qtyCities = Number(jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'hwMnyCtyfrm')) + 1;
			var dateIn = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'InDate1');
			$('#InDate1').val(dateIn);
			$('#InDateMob1').val(dateIn);
			var ctyDepNA = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'sDepCity');
			$('#sDepCity').attr("value", ctyDepNA);
			$('#iDepCityTxtMob').attr("value", ctyDepNA);
			var ctyDepID = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iDepCity');
			$('#iDepCity').val(ctyDepID);
			$('#iDepCityMob').val(ctyDepID);
			var jsRoom = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Rooms');
			$('#Rooms').val(jsRoom); $('#iRoom').val(jsRoom); rom = jsRoom
			var roomAndpax = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iRoomsAndPax');
			$('#iRoomsAndPax option[value="' + roomAndpax + '"]').attr('selected', 'selected');
			if (roomAndpax.indexOf('Other') > -1) { showDivRoom(jsRoom); };
			var adultE = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iAdults');
			$('#iAdults').val(adultE);
			$('#AiAdults option[value="' + adultE + '"]').attr('selected', 'selected');
			var childsE = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iChildren');
			$("#iChildren option[value='" + childsE + "']").attr('selected', 'selected');
			if (childsE > 0) {
				for (c = 1; c <= childsE; c++) {
					$('#dvR1child' + c + '').show();
					var chidAge = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'iChild' + c + '');
					$('#iChild' + c + '').val(chidAge);
				};
			};
			if (jsRoom > 1) {
				var jsAdult;
				var jsChild;
				var jsChilAge;
				for (r = 2; r <= jsRoom; r++) {
					jsAdult = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Room' + r + '_iAdults');
					$('#Room' + r + '_iAdults').val(jsAdult);
					$('#ARoom' + r + '_iAdults option[value="' + jsAdult + '"]').attr('selected', 'selected');
					jsChild = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Room' + r + '_iChildren');
					$("#Room" + r + "_iChildren option[value='" + jsChild + "']").attr('selected', 'selected');
					if (jsChild > 0) {
						for (c = 1; c <= jsChild; c++) {
							$('#dvR' + r + 'child' + c + '').show();
							jsChilAge = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'Room' + r + '_iChild' + c);
							$("#Room" + r + "_iChild" + c + "").val(jsChilAge);
						};
					};
				};
			};
			for (i = 1; i <= qtyCities; i++) {
				NtsStay = jQuery.extendedjsoncookie('getCookieVariable', 'bpBack', 'StayNite' + i + '')
				$("#StayNite" + i + " option[value='" + NtsStay + "']").attr('selected', 'selected');
			};
			Cookies.set('bpBack', '', { expires: -1 });
		};
	};
};
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
	$("#sDepCity, #iDepCityTxtMob").click(function () {
		$("#sDepCity, #iDepCityTxtMob").select();
	});
}
function doit() {
	$("#sDepCity, #iDepCityTxtMob").autocomplete({
		autoFocus: true,
		minLength: 3,
		select: function (event, ui) {
			$("#sDepCity, #iDepCityTxtMob").val(ui.item.label);
			$('#iDepCity, #iDepCityMob').val(ui.item.id);
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
		source: $.map(citiesAll, function (m) { return { value: m.plC_Title + " - " + m.plC_Code, label: m.plC_Title + " - " + m.plC_Code, id: m.plcid } }),
	}).data("ui-autocomplete")._renderItem = function (ul, item) {
		var $a = $("<span></span>").text(item.label);
		highlightText(this.term, $a);
		return $("<li></li>").attr("data-value", item.value).append($a).appendTo(ul);
	};
};
function stayChange(sid, svalue) {
	$('#' + sid + '').val(svalue);
};
function selCabin(objt, valu) {
	$('#BCabin').val($('#Cabin').val());
};
function buildPics() {
	let mockup = '';

	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/PicsForPacks/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			objPics = data;
			objImgs = $.grep(objPics, function (n, i) { return (n.imG_ImageType === 'P0'); });
			picTotal = objPics.length;

			for (let i = 0; i < 3; i++) {
				mockup += `<li class="images-section__item">
                             <img src="https://pictures.tripmasters.com${objPics[i].imG_500Path_URL.toLowerCase()}" id="bigpicture-${Number(i + 1)}" alt="${objPics[i].imG_500Path_URL}" title="${objPics[i].imG_Title}" onerror="this.src = 'https://pictures.tripmasters.com/siteassets/d/no-image.jpg'"/>
                           </li>`;
			};

			$('.images-section__list').html(mockup);
			$('.images-section__item img').click(function () { moreMediaB(this.id, this.src, this.title, this.alt) });
			if (objPics[picTotal - 1].imG_500Path_URL) {
				$('#bigMap').html(`<img src="https://pictures.tripmasters.com${objPics[picTotal - 1].imG_500Path_URL.toLowerCase()}" alt="${objPics[picTotal - 1].imG_500Path_URL}" title="${objPics[picTotal - 1].imG_Title}" onerror="this.src='https://pictures.tripmasters.com/siteassets/d/no-image.jpg'"/>`);
				$('#seeAllImg, #bigMap').click(function () { seeAllImages('picture-1', objPics[0].imG_500Path_URL.toLowerCase(), objPics[0].imG_Title, objPics[0].imG_500Path_URL) });
			}
		},
		error: function (xhr, desc, exceptionobj) {
			console.error(xhr.responseText);
		}
	});
};
function opentabSection(tabId) {
	var tabshow = tabId.replace('dvTab', '');
	$('li[id*="dvTab"]').removeClass('selected');
	$('section[id*="dvShw"]').removeClass('selected');
	$('#dvTab' + tabshow).addClass('selected');
	$('#dvShw' + tabshow).addClass('selected');
	newdvCnt = 'dvCont' + tabshow;

	switch (tabshow) {
		case 'View':
			$('.history-section, .pay-section, .trip-section').show();
			break;
		case 'Itin':
			$('.history-section, .pay-section, .trip-section').hide();
			if ($('#cmsIti').val() == 0) { } else { callCMS($('#cmsIti').val(), newdvCnt); };
			break;
		case 'Acco':
			$('.history-section, .pay-section, .trip-section').hide();
			break;
		case 'Acti':
			$('.history-section, .pay-section, .trip-section').hide();
			break;
		case 'Tran':
			$('.history-section, .pay-section, .trip-section').hide();
			if ($('#cmsTra').val() == 0) { } else { callCMS($('#cmsTra').val(), newdvCnt); };
			break;
		case 'Cou':
			$('.history-section, .pay-section, .trip-section').hide();
			break;
		case 'FAQ':
			$('.history-section, .pay-section, .trip-section').hide();
			if ($('#cmsFaq').val() == 0) { } else { callCMS($('#cmsFaq').val(), newdvCnt); };
			break;
		case 'Feed':
			$('.history-section, .pay-section, .trip-section').hide();
			var n = $('#PackCustFeedIds');
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
					};
				});
			};
			break;
		case 'Price':
			$('.history-section, .pay-section, .trip-section').hide();
			calreload();
			break;
	}
};
function openFeedbacksSection() {
	selectMobTab('mbTabFeed');
	const element = document.querySelector('#dvShwFeed .feedbacks-section__wrapper');
	element.scrollIntoView();
}
function scrollToCalendar() {
	const element = document.getElementById('formMobT21');
	element.scrollIntoView();
}
function changePic(picID, picSRS, picTTL, picALT) {
	let imG_Path_URL = 'https://pictures.tripmasters.com' + picALT.toLowerCase();

	if (picALT === 'none') {
		imG_Path_URL = picSRS;
	};

	$('.img-modal__list li img').removeClass();
	$('#' + picID).addClass('selected');
	currentPic = picID;
	$('#dvFstPic').html(`<img src="${imG_Path_URL}" id="${picID.replace('O', 'B')}" alt="${picALT}" title=${picTTL}" />`);
	$('#dvPicNa').html(picTTL);

	const arrImg = $('.img-modal__list img[id*="picture"]');
	for (let i = 0; i < arrImg.length; i++) {
		if (arrImg[i].id === picID) {
			$('#totalCurrent').html(`${i + 1}`);
			break;
		}
	}
};
function moreMediaClose() {
	$('#dvmediaPopUp').addClass('is-hidden');
	$('body').removeClass('modal-open');
};
function nextPicture() {
	const arrImg = $('.img-modal__list img[id*="picture"]');

	for (let i = 0; i < arrImg.length; i++) {
		if (arrImg[i].id === currentPic) {
			const index = i + 1 < arrImg.length ? i + 1 : 0;
			changePic(arrImg[index].id, arrImg[index].src, arrImg[index].title, arrImg[index].alt);
			break;
		}
	}
}
function prevPicture() {
	const arrImg = $('.img-modal__list img[id*="picture"]');

	for (let i = 0; i < arrImg.length; i++) {
		if (arrImg[i].id === currentPic) {
			const index = i - 1 < 0 ? arrImg.length - 1 : i - 1;
			changePic(arrImg[index].id, arrImg[index].src, arrImg[index].title, arrImg[index].alt);
			break;
		}
	}
}
function priceBubble(obj, ntsPrts) {
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
function nextPriceHistory() {
	const showElements = 7;
	const elements = $('.history-section__item');
	const pages = Math.ceil(elements.length / showElements);
	if (pagePriceHistory < pages) {
		$('.history-section__list').animate({ "top": -385 * pagePriceHistory + 'px' });
		pagePriceHistory++;
		$('#prevPriceHistory').removeClass('disabled');
		if (pagePriceHistory === pages) {
			$('#prevPriceHistory').removeClass('disabled');
			$('#nextPriceHistory').addClass('disabled');
		}
	}
}
function prevPriceHistory() {
	if (pagePriceHistory > 1) {
		$('.history-section__list').animate({ "top": -385 * (pagePriceHistory - 1) + 385 + 'px' });
		pagePriceHistory--;
		$('#nextPriceHistory').removeClass('disabled');
		if (pagePriceHistory === 1) {
			$('#prevPriceHistory').addClass('disabled');
			$('#nextPriceHistory').removeClass('disabled');
		}
	}
}
function seeMorePriceHistory() {
	const elements = $('.history-section__item');
	elements.removeClass('visually-hidden');
	$('#seeMorePriceHistory').addClass('is-hidden');
	$('#closeMorePriceHistory').removeClass('is-hidden');
}
function closeMorePriceHistory() {
	const showElements = 7;
	const elements = $('.history-section__item');
	elements.addClass('visually-hidden');
	elements.slice(0, showElements).removeClass('visually-hidden');
	$('#seeMorePriceHistory').removeClass('is-hidden');
	$('#closeMorePriceHistory').addClass('is-hidden');
}
function openModal() {
	$('.modal__container').html('<div style="padding:15px 15px;text-align:center;"><img src="https://pictures.tripmasters.com/siteassets/d/wait.gif"></div>');
	$('#modal').removeClass('is-hidden');
	$('body').addClass('modal-open');
}
function closeModal() {
	$('#modal').addClass('is-hidden');
	$('body').removeClass('modal-open');
	if ($('.overview-section__calendar').children().length === 0) {
		hidePopUpInfo('dvPopCal');
	}
}
function popUpImagesNav() {
	let mockup = '';
	let Cpic = 0;

	for (let i = 0; i < picTotal; i++) {

		if (objPics[i].imG_ImageType === 'P0') {
			Cpic++;
			mockup = mockup + `<li>
                                 <img id="picture-${Cpic}" src="https://pictures.tripmasters.com${objPics[i].imG_Path_URL.toLowerCase()}" alt="${objPics[i].imG_500Path_URL}" title="${objPics[i].imG_Title}" onerror="this.src = 'https://pictures.tripmasters.com/siteassets/d/no-image.jpg'"/>
                               </li>`;
		}
		else if (objPics[i].imG_ImageType === 'M0' || objPics[i].imG_ImageType === 'M1') {
			Cpic++;
			mockup = `<li>
                        <img id="picture-${Cpic}" src="https://pictures.tripmasters.com${objPics[i].imG_Path_URL.toLowerCase()}" alt="${objPics[i].imG_500Path_URL}" title="${objPics[i].imG_Title}" onerror="this.src = 'https://pictures.tripmasters.com/siteassets/d/no-image.jpg'"/>
                      </li>` + mockup;

		};
	};
	$('#dvThuPic').html(mockup);
	$('#total').html(`/${picTotal}`);
	$('.img-modal__list li img').click(function () { changePic(this.id, this.src, this.title, this.alt) });
};
function moreMediaB(picID, picSRS, picTTL, picALT) {
	popUpImagesNav();
	changePic(picID.slice(3, picID.length), picSRS, picTTL, picALT);
	$('#dvmediaPopUp').removeClass('is-hidden');
	$('body').addClass('modal-open');
};
function seeAllImages(picID, picSRS, picTTL, picALT) {
	popUpImagesNav();
	changePic(picID, picSRS, picTTL, picALT);
	$('#dvmediaPopUp').removeClass('is-hidden');
	$('body').addClass('modal-open');
};
function showRelatedItineraries(packID) {
	openModal();

	let infoArr;
	let mockup = '';
	$.ajax({
		type: "POST",
		url: SiteName + "/Api/PackInfoXID/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		success: function (data) {
			infoArr = data.split('|');
			const packLink = `${SiteName}/${plcNA.replace(/\s/g, '_').toLowerCase()}/${infoArr[1].replace(/\s/g, '_').toLowerCase()}/package-${infoArr[0].replace('\"', "")}`;
			const toNts = Number(infoArr[6]) + (Math.ceil(infoArr[6] / 2));
			const arrOfIncludes = infoArr[9].split('</br>').slice(0, -1);

			let includesSection = '';
			for (let i = 0; i < arrOfIncludes.length; i++) {
				includesSection += `<li>${arrOfIncludes[i]}</li>`
			}

			let nightSection = '';
			if (formatCurrency(infoArr[4]) !== '$0') {
				nightSection += `<p class="related-modal__price">${infoArr[6]} ${infoArr[3] == 1 ? 'to' + toNts : ''} nights from <span>${formatCurrency(infoArr[4])}</span></p>`;
			}

			let reviewSection = '';
			if (infoArr[7] > 0) {
				reviewSection += `<a class="related-modal__review-link" href="${feedLink}">Customer feedback (${infoArr[7]})</a>`;
			}

			mockup = `<div class="related-modal">
                          <h2>${infoArr[1]}</h2>
                          <p class="related-modal__description">
                              <img src="https://pictures.tripmasters.com${infoArr[7].toLowerCase()}" align="left" />
                              ${infoArr[2]}
                          </p>
                          <div class="related-modal__wrapper">
			                  <div class="related-modal__includes">
                                  <p>This ${infoArr[6]} night sample itinerary includes:</p>
                                  <ul>${includesSection}</ul>
                              </div>
                              <div class="related-modal__customize">
                                  ${nightSection}
                                  <a class="related-modal__customize-link" href="${packLink}">Customize It</a>
                                  ${reviewSection}
                              </div>
                         </div>
                     </div>`


			$('.modal__container').html(mockup);
		},
		error: function (xhr, desc, exceptionobj) {
			$('.modal__container').html(xhr.responseText);
		}
	});
}
function selectMobTab(tabId) {
	if ($('#' + tabId).hasClass('selected')) {
		$('#' + tabId).removeClass('selected');
		$('#' + tabId + '~ .first-container').hide('slow');
	} else {
		$('#' + tabId).addClass('selected');
		$('#' + tabId + '~ .first-container').show('slow');
		var tabshow = tabId.replace('mbTab', '');
		newdvCnt = 'dvCont' + tabshow;

		switch (tabshow) {
			case 'View':
				break;
			case 'Itin':
				if ($('#cmsIti').val() == 0) { } else { callCMS($('#cmsIti').val(), newdvCnt); };
				break;
			case 'Acco':
				break;
			case 'Acti':
				break;
			case 'Tran':
				if ($('#cmsTra').val() == 0) { } else { callCMS($('#cmsTra').val(), newdvCnt); };
				break;
			case 'Cou':
				break;
			case 'FAQ':
				if ($('#cmsFaq').val() == 0) { } else { callCMS($('#cmsFaq').val(), newdvCnt); };
				break;
			case 'Feed':
				var n = $('#PackCustFeedIds');
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
						};
					});
				};
				break;
		}
	}
}
function showThisItineraries(itinID) {
	openModal();

	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/SamplePrices/" + itinID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			const info = data;
			let mockup = "";
			jQuery.each(info, function (data) {
				mockup += `<div class="history-modal">
                                <p class="history-modal__title">${this.samNTS} nights. from ${this.samPRC} w/air, hotel and air taxes *</p>
                                <p class="history-modal__description"><b>This sample price includes ALL air taxes & fuel surcharges:</b> priced within the past 7 days for arrival on ${this.samDTE}, departure from ${this.samAIP}. Choose your own departure city and dates.</div>
                                <p class="history-modal__subtitle">This ${this.samNTS} night sample itinerary includes:</p>
                                <ul class="history-modal__list">${this.samITIN}</ul>
                           </div>`

			});
			$('.modal__container').html(mockup);
		},
		error: function (xhr, desc, exceptionobj) {
			$('.modal__container').html(xhr.responseText);
		}
	});
};
function showStaggerPaymentsInfo() {
	openModal();

	const mockup = `<div class="modal-stagger-payment">
                       <h2>Stagger your Payments:</h2>
                       <p>If you are traveling more than 60 days from now and your package is more than $2,000, you will be able to stagger your payments in several installments!</p>
                   </div>`;
	$('.modal__container').html(mockup);
}
function bbdates(objvd) {
	builFixDatediv(fixDatesdiv, objvd);
	objPOS = $('#' + objvd + '').offset();
	$('#dvFixDates').show();
	$('#dvFixDates').offset({ left: objPOS.left - 0, top: objPOS.top + 20 });
};
function builFixDatediv(dates, dvObj) {
	var postDate;
	var postField;
	var m = '';
	var dtsDV = '';
	var fecha = dates.split(',');
	var dtct;
	for (i = 0; i < fecha.length; i++) {
		if (m != dateFormat(fecha[i], "mmm")) {
			m = dateFormat(fecha[i], "mmm");
			dtct = 0;
			if (i == 0) {
				dtsDV = '<div style="padding:3px 1px;">';
			}
			else {
				dtsDV = dtsDV + '</div><div style="padding:3px 1px;">';
			};
			dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
		};
		if (dtct == 0) {
			postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
			postField = "'" + dvObj + "'";
			dtsDV = dtsDV + '<span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
		}
		else {
			postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
			postField = "'" + dvObj + "'";
			dtsDV = dtsDV + ', <span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
		};
		dtct = dtct + 1;
	};
	dtsDV = dtsDV + '</div>';
	$('#dvFixDates').html(dtsDV);
	setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function changeDaysLenght1(ddate, dobj) {
	$('#' + dobj + '').val(ddate);
};
function chkValid(name, messg) {
	console.log(name)
	var objPos = $('#' + name + '').offset();
	console.log(objPos)
	$('#divError').html(messg);
	$('#divError').show();
	if (messg.indexOf('All infants') != -1) {
		$('#divError').offset({ left: objPos.left - 160, top: objPos.top - 50 });
	}
	else {
		$('#divError').offset({ left: objPos.left - 85, top: objPos.top - 50 });
	};
	$('#' + name + '').val('');
	$('#' + name + '').focus();
	$('#' + name + '').select();
	setTimeout("$('#divError').hide()", 2000);
};
/* ***** MULTIROOM ***** */
var ropx; // = valM.split('|');
var rom = '1'; // = ropx[0];
var pax = '2'; // = ropx[1];
var pax2;
var pax3;
var paxMr;
var hwMCh;
function xSelChildren(ch, ro, ty, tID) {
	if (tID.indexOf('B') > -1) { $('#' + tID.replace('B', '') + '').val(ch); } else { $('#B' + tID + '').val(ch); };
	if (rom > 1) { hwMCh = Number($('#AiChildren').val()) + Number($('#ARoom2_iChildren').val()) + Number($('#ARoom3_iChildren').val()); };
	if (ty == 0) {
		$('#spChAg').hide(); $('#BspChAg').hide();
	} else {
		if (ty == 1) {
			if (ch == 0) {
				if (hwMCh == 0) {
					$('#spChAg').hide(); $('#BspChAg').hide();
				};
			} else {
				$('#spChAg').show(); $('#BspChAg').show();
			};
		};
	};
	switch (ro) {
		case 1:
			for (s = 1; s <= 4; s++) {
				if (s < ch || s == ch) {
					$('#dvR1child' + s + '').show(); $('#BdvR1child' + s + '').show();
				} else {
					$('#dvR1child' + s + '').hide(); $('#BdvR1child' + s + '').hide();
					$('#dvR1child' + s + '').val(''); $('#BdvR1child' + s + '').val('');
				};
				$('#iChild' + s + '').val(''); $('#BiChild' + s + '').val('');
			};
			break;
		case 2:
		case 3:
			for (s = 1; s <= 4; s++) {
				if (s < ch || s == ch) {
					$('#dvR' + ro + 'child' + s + '').show(); $('#BdvR' + ro + 'child' + s + '').show();
				} else {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
				};
				$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
			};
			break;
	};
};
function showDivRoom(ro) {
	if (ro == 0) { $('#dvPaxLabel').hide(); $('#BdvPaxLabel').hide() };
	for (i = 1; i <= 3; i++) {
		if (i <= ro) {
			$('#dvPaxLabel').show(); $('#BdvPaxLabel').show();
			$('#dvRoom' + i + '').show(); $('#BdvRoom' + i + '').show();
		}
		else {
			$('#dvRoom' + i + '').hide(); $('#BdvRoom' + i + '').hide();
		};
	};
};
function cleanValues(ro) {
	$('#spChAg').hide(); $('#BspChAg').hide();
	var roArr = [];
	switch (ro) {
		case 0:
			roArr = [1, 2, 3];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
					$('#AiAdults option').removeAttr('selected');
					$('#iChildren option').removeAttr('selected');
				};
			});
			break;
		case 1:
			roArr = [2, 3];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
				};
			});
			break;
		case 2:
			roArr = [1, 3];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
				};
			})
			break;
		case 3:
			roArr = [1, 2];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
				};
			})
			break;
	};
	$("input[id='iChild1']").val('');
	$("input[id='iChild2']").val('');
	$("input[id='iChild3']").val('');
	$("input[id='iChild4']").val('');
};
function changePaxByRoom(valM, objID) {
	if (valM == -1) {
		var tObj = "'" + objID + "'";
		messg = '<ol><li>Please select a valid option!</li></ol><span></span>';
		popError(objID, messg);
		$('#' + objID + '').select();
		return false;
	} else {
		if (objID.indexOf('B') > -1) { $('#iRoomsAndPax option[value="' + valM + '"]').attr('selected', 'selected'); } else { $('#BiRoomsAndPax option[value="' + valM + '"]').attr('selected', 'selected'); };
		pax = '';
		pax2 = '';
		pax3 = '';
		ropx = valM.split('|');
		rom = ropx[0];
		pax = ropx[1];
		if (pax.indexOf('-') > 0) {
			paxMr = pax.split('-');
			pax = paxMr[0];
			pax2 = paxMr[1];
			if (paxMr[2] != undefined) {
				pax3 = paxMr[2];
			};
		};
		switch (rom) {
			case '1':
				$("#iChildren option[value=0]").attr('selected', 'selected');
				$("#BiChildren option[value=0]").attr('selected', 'selected');
				if (pax != 'Other') {
					showDivRoom(0);
					cleanValues(0);
					$("#AiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value='1']").attr('selected', 'selected');
					$("#ARoom3_iAdults option[value='1']").attr('selected', 'selected');
					$("#BiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value='1']").attr('selected', 'selected');
					$("#BRoom3_iAdults option[value='1']").attr('selected', 'selected');
				}
				else {
					showDivRoom(1);
					cleanValues(0);
					$("#AiAdults option[value=2]").attr('selected', 'selected');
					$("#BiAdults option[value=2]").attr('selected', 'selected');
				};
				break;
			case '2':
				$("#iChildren option[value=0]").attr('selected', 'selected');
				$("#Room2_iChildren option[value=0]").attr('selected', 'selected');
				$("#BiChildren option[value=0]").attr('selected', 'selected');
				$("#BRoom2_iChildren option[value=0]").attr('selected', 'selected');
				if (pax != 'Other') {
					showDivRoom(0);
					cleanValues(0);
					$("#AiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#ARoom3_iAdults option[value='1']").attr('selected', 'selected');
					$("#BiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#BRoom3_iAdults option[value='1']").attr('selected', 'selected');
				}
				else {
					showDivRoom(2);
					cleanValues(0);
					$("#AiAdults option[value=2]").attr('selected', 'selected')
					$("#ARoom2_iAdults option[value=2]").attr('selected', 'selected')
					$("#BiAdults option[value=2]").attr('selected', 'selected')
					$("#BRoom2_iAdults option[value=2]").attr('selected', 'selected')
				};
				break;

			case '3':
				$("#iChildren option[value=0]").attr('selected', 'selected');
				$("#Room2_iChildren option[value=0]").attr('selected', 'selected');
				$("#Room3_iChildren option[value=0]").attr('selected', 'selected');
				$("#BiChildren option[value=0]").attr('selected', 'selected');
				$("#BRoom2_iChildren option[value=0]").attr('selected', 'selected');
				$("#BRoom3_iChildren option[value=0]").attr('selected', 'selected');
				if (pax != 'Other') {
					showDivRoom(0);
					cleanValues(0);
					$("#AiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#ARoom3_iAdults option[value='" + pax3 + "']").attr('selected', 'selected');
					$("#BiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#BRoom3_iAdults option[value='" + pax3 + "']").attr('selected', 'selected');
				}
				else {
					showDivRoom(3);
					cleanValues(0);
					$("#AiAdults option[value=2]").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value=2]").attr('selected', 'selected')
					$("#ARoom3_iAdults option[value=2]").attr('selected', 'selected')
					$("#BiAdults option[value=2]").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value=2]").attr('selected', 'selected')
					$("#BRoom3_iAdults option[value=2]").attr('selected', 'selected')
				};
				break;
		};
	};
};
function submitForm(pos) {
	var messg;
	var addFly;
	addFly = $('input[id^="addFlight"]').val();
	switch (addFly) {
		case 'True':
			if ($('#iDepCity').val() == -1) {
				messg = '<ol><li>Please select your departure city</li></ol><span></span>';
				if (pos == 1) {
					chkValid('sDepCity', messg);
				}
				else {
					chkValid('BsDepCity', messg);
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
	switch (idate) {
		case 'mm/dd/yyyy':
		case 'Select Date':
		case '':
			messg = '<ol><li>Please select your departure date</li></ol><span></span>';
			if (pos == 1) {
				chkValid('InDate1', messg);
			}
			else {
				chkValid('BInDate1', messg);
			}
			return false;
			break;
		default:
			break;
	}
	$('#iRoom').val(rom);
	$('#Rooms').val(rom);
	var paxAdult;
	var paxChild;
	var paxTotal;
	switch (rom) {
		case '1':
			paxAdult = $('#AiAdults').val();
			paxChild = $('#iChildren').val();
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val('');
			$('#Room3_iAdults').val('');
			break;
		case '2':
			paxAdult = Number($('#AiAdults').val()) + Number($('#ARoom2_iAdults').val());
			paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val());
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val($('#ARoom2_iAdults').val());
			$('#Room3_iAdults').val('');
			break;
		case '3':
			paxAdult = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val()) + Number($('#Room3_iAdults').val());
			paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val()) + Number($('#Room3_iChildren').val());
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val($('#ARoom2_iAdults').val());
			$('#Room3_iAdults').val($('#ARoom3_iAdults').val());
			break;
	};
	paxTotal = Number(paxAdult) + Number(paxChild);
	if (paxTotal > 6) {
		messg = '<ol><li>Max guest allowed (adults + children) are 6 !</li></ol><span></span>';
		if (pos == 1) {
			chkValid('dvRoom1', messg);
		} else {
			chkValid('BdvRoom1', messg);
		}
		return false;
	};
	if (paxChild > 0) {
		var hwCh = $('#iChildren').val();
		var hwCh2 = $('#Room2_iChildren').val();
		var hwCh3 = $('#Room3_iChildren').val();
		if (hwCh > 0 && rom >= 1) {
			for (i = 1; i <= hwCh; i++) {
				var childAge = $('#iChild' + i + '').val();
				var ageCH;
				if (isNaN(childAge) || childAge == '' || (!isNaN(childAge) && (childAge < 2 || childAge > 11))) {
					if (isNaN(childAge) || childAge == '') {
						messg = '<ol><li>Please enter a valid age !</li></ol><span></span>';
						ageCH = '';
					}
					else if (childAge < 2) {
						messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
						ageCH = 2;
					}
					else {
						messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
						ageCH = 11;
					};
					if (pos == 1) {
						chkValid('iChild' + i, messg);
						if (isNaN(childAge) || childAge == '')
							$('#iChild' + i + '').val('');
						else
							$('#iChild' + i + '').val(ageCH);

						$('#BiChild' + i + '').val($('#iChild' + i + '').val());
					} else {
						chkValid('BiChild' + i, messg);
						if (isNaN(childAge) || childAge == '')
							$('#BiChild' + i + '').val('');
						else
							$('#BiChild' + i + '').val(ageCH);

						$('#iChild' + i + '').val($('#BiChild' + i + '').val());
					};
					return false;
				};
			};
		};

		if (hwCh2 > 0 && rom >= 2) {
			for (i = 1; i <= hwCh2; i++) {
				var childAge2 = $('#Room2_iChild' + i + '').val();
				var ageCH;
				if (isNaN(childAge2) || childAge2 == '' || (!isNaN(childAge2) && (childAge2 < 2 || childAge2 > 11))) {
					if (isNaN(childAge2) || childAge2 == '') {
						messg = '<ol><li>Please enter a valid age !</li></ol><span></span>';
						ageCH = '';
					}
					else if (childAge2 < 2) {
						messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
						ageCH = 2;
					}
					else {
						messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
						ageCH = 11;
					};

					if (pos == 1) {
						chkValid('Room2_iChild' + i, messg);

						if (isNaN(childAge2) || childAge2 == '')
							$('#Room2_iChild' + i + '').val('');
						else
							$('#Room2_iChild' + i + '').val(ageCH);

						$('#BRoom2_iChild' + i + '').val($('#Room2_iChild' + i + '').val());
					} else {
						chkValid('BRoom2_iChild' + i, messg);

						if (isNaN(childAge2) || childAge2 == '')
							$('#BRoom2_iChild' + i + '').val('');
						else
							$('#BRoom2_iChild' + i + '').val(ageCH);

						$('#Room2_iChild' + i + '').val($('#BRoom2_iChild' + i + '').val());
					};
					return false;
				};
			};
		};

		if (hwCh3 > 0 && rom >= 3) {
			for (i = 1; i <= hwCh3; i++) {
				var childAge3 = $('#Room3_iChild' + i + '').val();
				if (isNaN(childAge3) || childAge3 == '' || (!isNaN(childAge3) && (childAge3 < 2 || childAge3 > 11))) {
					if (isNaN(childAge3) || childAge3 == '') {
						messg = '<ol><li>Please enter a valid age !</li></ol><span></span>';
						ageCH = '';
					}
					else if (childAge3 < 2) {
						messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
						ageCH = 2;
					}
					else {
						messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
						ageCH = 11;
					};

					if (pos == 1) {
						chkValid('Room3_iChild' + i, messg);

						if (isNaN(childAge3) || childAge3 == '')
							$('#Room3_iChild' + i + '').val('');
						else
							$('#Room3_iChild' + i + '').val(ageCH);

						$('#BRoom3_iChild' + i + '').val($('#Room3_iChild' + i + '').val());
					} else {
						chkValid('BRoom3_iChild' + i, messg);

						if (isNaN(childAge3) || childAge3 == '')
							$('#BRoom3_iChild' + i + '').val('');
						else
							$('#BRoom3_iChild' + i + '').val(ageCH);

						$('#Room3_iChild' + i + '').val($('#BRoom3_iChild' + i + '').val());

					};
					return false;
				};
			};
		};
	};
	//end adult / children validation    
	var qtyCity = Number($('#hwMnyCty').val()) + 1;
	var ctyCat = '';
	for (i = 0; i <= qtyCity; i++) {
		var catval = $('#ecityCat' + i + '').val(); if (catval == undefined) { catval = '' };
		if (i == 0) { ctyCat = ctyCat + catval }
		else if (i == qtyCity) { ctyCat = ctyCat + catval + ',' }
		else { ctyCat = ctyCat + ',' + catval };
	}
	$('#MiniPackCat').val(ctyCat);
	$('#imgPriceIt' + pos).hide();
	$('#imgLoading' + pos).show();
	var pckType = $('#PackType').val();
	var pckID = $('#Pkgid').val();
	switch (pckType) {
		case 'TP3':
			_bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
			bookProcess = _bpURL + "?" + pckID
			break;
		case 'MC':
			bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID
			break;
	};
	$('#frmToBook').attr('action', bookProcess);
	$('#frmToBook').submit();
	$('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
	var stringQuery = ''
	stringQuery = $('#frmToBook').serializeObject();
	Cookies.set('bpBack', stringQuery, { expires: 1 });
};

function showMoreRelatedItineraries() {
	openModal();

	const relPrts = $('#inpRelItin').val();
	const strRelP = relPrts.split('@');
	let mockup = '';
	let listMockup = '';

	$.each(strRelP, function () {
		const strRel = this.split('|');
		if (strRel[0] !== packID) {
			listMockup += `<li><a href="${SiteName}/${plcNA.replace(/\s/g, '_').toLowerCase()}/${strRel[1].replace(/\s/g, '_').toLowerCase()}/package-${strRel[0]}"><span class="more-relared-modal__name">${strRel[1]}</span>`;
			if (strRel[2] !== 9999 && strRel[2] !== '') {
				const toNts = Number(strRel[3]) + (Math.ceil(strRel[3] / 2));
				listMockup += `<span class="more-relared-modal__night">${strRel[3]} ${strRel[4] === 1 ? 'to ' + toNts : ''} + nights from <span>${formatCurrency(strRel[2])}</span></span></a></li>`;

			} else {
				listMockup += '</a></li>'
			}
		}
	});
	mockup += `<div class="more-relared-modal">
               <h2 class="more-relared-modal__title">Related Itineraries:</h2>
               <ul class="more-relared-modal__list">
               ${listMockup}  
               </ul>
               </div>`;


	$('.modal__container').html(mockup);
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
function clkhideIrin(fed) {
	$('#dvFDinclu' + fed + '').hide();
};
function relIntForm(hLnk, linkPackID) {
	window.location = hLnk + '?relItin=' + linkPackID;
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
			};
			return unescape(document.cookie.substring(c_start, c_end));
		};
	};
	return null;
};

function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num)) num = '0';
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) cents = '0' + cents;
	var untilTO = Math.floor(num.length);
	untilTO = Number(untilTO) - 1;
	for (var i = 0; i < Math.floor(Number(untilTO + i) / 3); i++)
		num = num.substring(0, Number(num.length) - (4 * i + 3)) + ',' + num.substring(Number(num.length) - (4 * i + 3));
	return (((sign) ? '' : '-') + '$' + num); //+ '.' + cents);
};
function showRecomm(obj) {
	var dvSet;
	var objPos = ObjectPosition(document.getElementById(obj));
	var posL;
	posL = objPos[0];
	var posT;
	posT = objPos[1] - 10;
	var dvW = 710;
	var dvMgLf;
	if (obj.indexOf('picAccom') > -1) { posL = objPos[0] - 400 };
	if (obj.indexOf('aMore') > -1) { posT = objPos[1] - 30; };
	if (obj.indexOf('dvItinRel') > -1) { posT = objPos[1] - 550; };
	if (obj.indexOf('samPriceaAll') > -1) { posT = objPos[1] - 60 };
	if (obj.indexOf('dvTabView') > -1) { posT = objPos[1] - 60; dvW = 780; };
	dvMgLf = dvW / 2;
	dvSet = 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:-' + dvMgLf + 'px; top:' + 100 + '%;'
	$('#divRecomended').attr('style', dvSet);
	$('#divRecomended').fadeIn(2000);
	var objTOGO;
	objTOGO = $('#' + obj + '').offset();
	$('html,body').animate({
		scrollTop: objTOGO.top - Number(170)
	}, 2000);
};
function closeDiv() {
	$('#divRecomended').hide();
};
function divToShow(dv) {
	$('#dv' + dv + '').show();
};
function divToHide(dv) {
	$('#dv' + dv + '').hide();
};
function scrollToTop() {
	$('body,html').animate({
		scrollTop: 0
	}, 800);
};
var setTop;
var topSet;
function callCMS(cmsid, dvshow) {
	console.log("dvshow:")
	console.log(dvshow)
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/SqlThisCMS/" + cmsid,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			msg = data;
			if (msg != '') {
				$('#' + dvshow + '').html(data[0].cmS_Content);
				//setCMSLinkT();
				cmsoptimizeLinks(dvshow);
			};
		},
		error: function (xhr, desc, exceptionobj) {
			$('#' + dvshow + '').html(xhr.responseText)
			alert(xhr.responseText + ' = error');
		}
	});
};
function cmsoptimizeLinks(dvshow) {
	$('#' + dvshow + '').find("a").each(function () {
		var hrefTxt = $(this).attr('href');
		if (this.className != 'aCMStxtLink') {
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
			if (!/\/latin\/|\/asia\//.test(hrefTxt)) {
				/tripmasters.com/.test(hrefTxt) ?
					(

						hrefTxt = hrefTxt.replace("https://", ''),
						hrefTxt = hrefTxt.replace(/tripmasters.com\/|www.tripmasters.com\//, '')

					)
					: '';
				/europeandestinations.com/.test(hrefTxt) ?
					(
						hrefTxt = hrefTxt.replace("https://", ''),
						hrefTxt = hrefTxt.replace("http://", ''),
						hrefTxt = hrefTxt.replace(/europeandestinations.com\/|www.europeandestinations.com\//, '')
					) : ''
				!/\?/.test(hrefTxt) ? hrefTxt = hrefTxt + "?cms&wh=0&wf=0" : '';
				!/\/europe\//.test(hrefTxt) ? this.href = "/" + hrefTxt : this.href = "/" + hrefTxt;
				this.className != 'aCMStxtLink' ? $(this).addClass('aCMStxtLink').attr('rel', '700,500').popupCMSNewWindow({ centerBrowser: 1, heigh: 500, width: 700 }) : '';
			};

		}
		else {
			!/\?/.test(hrefTxt) ? hrefTxt = hrefTxt + "?cms&wh=0&wf=0" : '';
			!/\/europe\//.test(hrefTxt) ? /https:\/\/www.tripmasters.com\// ? '' : hrefTxt = "/europe" + hrefTxt : '';
			$(this).attr('href', '' + hrefTxt + '').popupCMSNewWindow({ centerBrowser: 1, heigh: 500, width: 700 })
		};
	});
};
function ShowHideMoreInfo(picID) {
	if (picID.indexOf('pic') > -1) {
		var moreDiv = 'div' + picID.replace('pic', '');
		var moreText = 'text' + picID.replace('pic', '');
		var idImg = picID;
		var srcImg = $('#' + idImg + '').attr("src");
		var valImg = srcImg.indexOf("Plus");
		if (valImg != -1) {
			txtMorCls = $('#' + moreText + '').html();
			$('#' + idImg + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');
			$('#' + moreText + '').html('close');
			$('#' + moreDiv + '').show();
		}
		else {
			$('#' + idImg + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg');
			$('#' + moreText + '').html(txtMorCls);
			$('#' + moreDiv + '').hide();
		};
	}
	else {
		var moreDiv = 'div' + picID.replace('text', '');
		var moreText = 'text' + picID.replace('text', '');
		var valImg = $('#' + moreText + '').html().indexOf('close');
		var picIF = picID.replace('text', 'pic');
		if (valImg == -1) {
			txtMorCls = $('#' + moreText + '').html()
			if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg'); };
			$('#' + moreText + '').html('close');
			$('#' + moreDiv + '').show();
		}
		else {
			if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg'); };
			$('#' + moreText + '').html(txtMorCls);
			$('#' + moreDiv + '').hide();
		};

	};
};
function aboutBUT() {
	var popID;
	for (i = 0; i <= totCities; i++) {
		$('#aboutPL' + i + '').click(function (e) {
			e.preventDefault();
			popID = $(this).attr('id').replace('aboutPL', 'aboutDIV');
			$('.backdrop-about').removeClass('is-hidden');
			$('#' + popID + '').show();
		});

		$('#aboutCls' + i + '').click(function (e) {
			$('.backdrop-about').addClass('is-hidden');
			$('#' + popID + '').hide();
		});

		if ($('#aboutCAL' + i + '').length > 0) {
			$('#aboutCAL' + i + '').click(function (e) {
				e.preventDefault();
				popID = $(this).attr('id').replace('aboutCAL', 'aboutDIV');
				$('.backdrop-about').removeClass('is-hidden');
				$('#' + popID + '').show();
			});
		};
		if ($('#aboutOVR' + i + '').length > 0) {
			$('#aboutOVR' + i + '').attr('style', 'border-bottom:1px dotted #4E73AB;');
			$('#aboutOVR' + i + '').click(function (e) {

				popID = $(this).attr('id').replace('aboutOVR', 'aboutDIV');
				$('.backdrop-about').removeClass('is-hidden');
				$('#' + popID + '').show();
			});
		};
	};
};
function scrollToMorePop(jbo) {
	var objTOGO;
	objTOGO = jbo;
	objTOGO = $('#' + objTOGO + '').offset();
	$('html,body').animate({
		scrollTop: objTOGO.top - Number(170)
	}, 2000);
};
function dvHotMoreInf(dvid) {
	var posObj = $('#' + dvid + '').offset();
	var posT = posObj.top + 15;
	var posL = posObj.left - 90;
	var winW = $(window).width();
	if (posObj.left > 800 && winW > 1000) { posL = posObj.left - 250 };
	$('#dvhotInfo').html($('#' + dvid + 'Info').html());
	$('#dvhotInfo').attr('style', 'position:absolute; z-index:100; width:350px;left:' + posL + 'px; top:' + posT + 'px; border:1px solid #000066; padding:15px; background-color:#fff; overflow:visible; -moz-box-shadow: 0 0 30px 5px #999; -webkit-box-shadow: 0 0 30px 5px #999;');
	$('#dvhotInfo').show();
};
function dvHotMoreInfCL(dvid) {
	$('#dvhotInfo').html('');
	$('#dvhotInfo').hide();
};
var arrAllHotCty = [];
function getHotels() {
	arrAllHotCty = [];
	HotDispl = [];
	var ctiD = 0;
	var lastCityID = 0;
	var arrEchHotCty = [];
	var arrEchHotPro = [];
	var arrCtyHotPro = [];
	arrAllHotCty = [];
	$('#dvShwAcco').html('<div style="padding:20% 0;" align="center"><img src="https://pictures.tripmasters.com/siteassets/d/world-globe-animated-ajax-loaders.gif" align="absmiddle"/><br/> Loading ..</div></div>');
	$.ajax({
		type: "POST",
		url: "/europe/WS_PackPage.asmx/sqlAccomTab",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: '{ctyIDs:"' + $('#tCityIDs').val() + '"}',
		success: function (data) {
			msg = eval("(" + data.d + ")");
			jQuery.each(msg, function (data) {
				ctiD = this.hotCty;
				if (ctiD != lastCityID) {
					arrEchHotCty = [];
					arrCtyHotPro = [];
					jQuery.each(msg, function (data) {
						if (this.hotSEQ > 49 && this.hotSEQ < 60 && this.hotCty == ctiD) {
							arrEchHotPro = []
							arrEchHotPro.push(this.hotNA, this.hotDES, this.hotID, this.hotIMG, this.hotCtyNa, this.hotStart);
							arrCtyHotPro.push(arrEchHotPro);
						}
					});
					arrEchHotCty.push(this.hotCtyNa, arrCtyHotPro);
					arrAllHotCty.push(arrEchHotCty);
				}
				lastCityID = ctiD;
			});
			buildHOT();
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
};
function buildHOT() {
	var hotdes1 = "";
	var hotdes2 = "";
	var dvHots = "";
	var dvHotsr = "";
	for (i = 0; i < arrAllHotCty.length; i++) {
		var rrEchCty = [];
		rrEchCty = arrAllHotCty[i];
		var rrEchPro = [];
		rrEchPro = rrEchCty[1]
		for (p = 0; p < rrEchPro.length; p++) {
			//this.hotNA, this.hotDES, this.hotID, this.hotIMG, this.hotCtyNa, this.hotStart
			dvHotsr = dvHotsr + '<div class="carousel-item">';
			dvHotsr = dvHotsr + '<div align="left"><img src="https://pictures.tripmasters.com' + rrEchPro[p][3].toLowerCase() + '" width="100" height="100" align="absmiddle"/></div>';
			dvHotsr = dvHotsr + '<div align="left" class="Text_Arial14_BlueBold">' + rrEchPro[p][0] + '</div>';
			dvHotsr = dvHotsr + '<div align="left" class="Text_11">';
			dvHotsr = dvHotsr + '<img src="https://pictures.tripmasters.com/siteassets/d/Stars_' + rrEchPro[p][5].replace(" ", "_") + '.gif" align="absmiddle"/> - ' + rrEchPro[p][5] + '';
			dvHotsr = dvHotsr + '  <img src="https://pictures.tripmasters.com/siteassets/d/favorite.gif" align="absmiddle"/>';
			dvHotsr = dvHotsr + '</div>';
			dvHotsr = dvHotsr + '<div align="left" class="Text_11" style="height:40px;">';
			var result = rrEchPro[p][1];
			var resultArray = result.split(' ');
			if (resultArray.length > 10) {
				resultArray = resultArray.slice(0, 10);
				result = resultArray.join(' ');
			}
			hotdes1 = result; // this.hotDES //this.hotDES.replace(/(([^\s]+\s\s*){8})(.*)/,"$1"); //this.hotDES.substring(0,brak);
			hotdes2 = rrEchPro[p][0].substring(hotdes1.length, rrEchPro[p][0].length);
			dvHotsr = dvHotsr + hotdes1.toUpperCase() + '...  <a id="dvMore' + rrEchPro[p][2] + '" onclick="dvHotMoreInf(this.id)" style="cursor:pointer; color:blue;"><u>more[+]</u></a>';
			dvHotsr = dvHotsr + '</div>';
			dvHotsr = dvHotsr + '<div id="dvMore' + rrEchPro[p][2] + 'Info" style="padding:10px; border:solid 1px #999; display:none;">';
			dvHotsr = dvHotsr + '<div align="right"><a onclick="dvHotMoreInfCL();" style="cursor:pointer; color:blue;"><u>close[x]</u></a></div>';
			dvHotsr = dvHotsr + '<div align="left" class="Text_Arial14_BlueBold" style="padding:5px 0;">' + rrEchPro[p][0] + '</div>';
			dvHotsr = dvHotsr + hotdes1.toUpperCase() + ' ' + hotdes2;
			dvHotsr = dvHotsr + '</div>';
			toHotNA = rrEchPro[p][0];
			if (toHotNA.indexOf('.') > -1) { toHotNA = rrEchPro[p][0].replace('.', ''); };
			winSet = "'hotel" + rrEchPro[p][2] + "','menubar=1,resizable=1,width=1100,height=800,scrollbars=1,'";
			toHotInfo = "'/europe/" + rrEchPro[p][4].replace(/\s/g, '_') + "/Hotel_Description_pp" + rrEchPro[p][2] + "_" + toHotNA.replace(/\s/g, '_') + ".aspx'";
			dvHotsr = dvHotsr + '<div align="left" class="Text_11"><span onclick="window.open(' + toHotInfo + ',' + winSet + ')"><a><u>hotel info</u></a> | <a><u>photos</u></a> | <a><u>map</u></a></span></div>';
			dvHotsr = dvHotsr + '</div>';

			ctyHotPRO.push(dvHotsr);
			dvHotsr = ""
			if (p == 2) {
				dvHots = dvHots + '<div id="wrap">';
				dvHots = dvHots + '<div class="dvCarrCityTitle Text_Arial14_BlueBold">' + rrEchCty[0] + ' Hotels: ' + rrEchPro.length + ' favorite hotels total</div>';
				dvHots = dvHots + '<div class="carousel-container">';
				dvHots = dvHots + '<div class="dvPrev"><span>'
				if (rrEchPro.length > 3) {
					dvHots = dvHots + '<img src="https://pictures.tripmasters.com/siteassets/d/T27_ForwH.jpg" id="prevH' + i + '"></span>'
				}
				dvHots = dvHots + '</div>'
				dvHots = dvHots + '<div id="Hotfoo' + i + '" class="container-horizontal">';
				for (y = 0; y < ctyHotPRO.length; y++) {
					dvHots = dvHots + ctyHotPRO[y];
				}
				dvHots = dvHots + '<div style="clear:both"></div>';
				dvHots = dvHots + '</div>';
				dvHots = dvHots + '<div class="dvPrev"><span>'
				if (rrEchPro.length > 3) {
					dvHots = dvHots + '<img src="https://pictures.tripmasters.com/siteassets/d/T27_BackH.jpg" id="nextH' + i + '"></span>'
				}
				dvHots = dvHots + '</div>';
				dvHots = dvHots + '<div style="clear:both;"></div>';
				dvHots = dvHots + '</div>';
				dvHots = dvHots + '</div>';
				HotDispl.push(i + '|' + 0 + '|' + 2);
			}
			if (p == rrEchPro.length - 1) {
				allCtyHotPRO.push(ctyHotPRO);
				ctyHotPRO = [];
			};
		}
		dvHotsr = ""
		ccH++
	};
	$('#dvShwAcco').html(dvHots);

	$('img[id*="prev"]').mouseover(function () { $(this).attr('src', 'https://pictures.tripmasters.com/siteassets/d/T27_ForwH_Over.gif'); }).mouseout(function () { $(this).attr('src', 'https://pictures.tripmasters.com/siteassets/d/T27_ForwH.jpg'); }).click(function () { moveCarr(this.id) });
	$('img[id*="next"]').mouseover(function () { $(this).attr('src', 'https://pictures.tripmasters.com/siteassets/d/T27_BackH_Over.gif'); }).mouseout(function () { $(this).attr('src', 'https://pictures.tripmasters.com/siteassets/d/T27_BackH.jpg'); }).click(function () { moveCarr(this.id) });
};
var arrAllSSCty = [];
function getSS() {
	arrAllSSCty = [];
	SSDispl = [];
	var ctiD = 0;
	var lastCityID = 0;
	var arrEchSSCty = [];
	var arrEchSSPro = [];
	var arrCtySSPro = [];
	$('#dvShwActi').html('<div style="padding:20% 0;" align="center"><img src="https://pictures.tripmasters.com/siteassets/d/world-globe-animated-ajax-loaders.gif" align="absmiddle"/><br/>Loading ..</div></div>');
	$.ajax({
		type: "POST",
		url: "/europe/WS_PackPage.asmx/sqlActivitiesTab",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: '{ctyIDs:"' + $('#tCityIDs').val() + '"}',
		success: function (data) {
			msg = eval("(" + data.d + ")");
			jQuery.each(msg, function (data) {
				ctiD = this.hotCty;
				if (ctiD != lastCityID) {
					arrEchSSCty = [];
					arrCtySSPro = [];
					jQuery.each(msg, function (data) {
						if (this.hotSEQ > 49 && this.hotSEQ < 60 && this.hotCty == ctiD) {
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
			alert(xhr.responseText + ' = error');
		}
	});
};
function buildSS() {
	var dvSSs = "";
	var dvSSsr = "";
	for (i = 0; i < arrAllSSCty.length; i++) {
		var rrEchCty = [];
		rrEchCty = arrAllSSCty[i];
		var rrEchPro = [];
		rrEchPro = rrEchCty[1]
		for (p = 0; p < rrEchPro.length; p++) {
			dvSSsr = dvSSsr + '<div class="carousel-item">';
			dvSSsr = dvSSsr + '<div align="left" class="Text_Arial14_BlueBold">' + rrEchPro[p][0] + '</div>';
			dvSSsr = dvSSsr + '<div align="left" class="Text_11">';
			dvSSsr = dvSSsr + '<div align="left" class="Text_Arial12" style="height:45px;padding:3px 0px;font-style:italic;">';
			var result = $(rrEchPro[p][1]).text();
			var resultArray = result.split(' ');
			if (resultArray.length > 10) {
				resultArray = resultArray.slice(0, 10);
				result = resultArray.join(' ');
			}
			hotdes1 = result;
			//hotdes2 = rrEchPro[p][1].substring(hotdes1.length,rrEchPro[p][1].length);
			dvSSsr = dvSSsr + hotdes1.toUpperCase() + '...  <a id="dvMore' + rrEchPro[p][2] + '" onclick="dvHotMoreInf(this.id)" style="cursor:pointer; color:blue;"><u>more[+]</u></a>';
			dvSSsr = dvSSsr + '</div>';
			dvSSsr = dvSSsr + '<div id="dvMore' + rrEchPro[p][2] + 'Info" style="padding:10px; border:solid 1px #999; display:none;">';
			dvSSsr = dvSSsr + '<div align="right"><a onclick="dvHotMoreInfCL();" style="cursor:pointer; color:blue;"><u>close[x]</u></a></div>';
			dvSSsr = dvSSsr + '<div align="left" class="Text_Arial14_BlueBold" style="padding:5px 0;">' + rrEchPro[p][0] + '</div>';
			dvSSsr = dvSSsr + '<table><tr><td>' + rrEchPro[p][1] + '</td></tr></table>'; //hotdes1.toUpperCase() +' '+ hotdes2;
			dvSSsr = dvSSsr + '</div>';
			dvSSsr = dvSSsr + '</div>';
			dvSSsr = dvSSsr + '<div align="left"><img src="https://pictures.tripmasters.com' + rrEchPro[p][3].toLowerCase() + '" width="100" height="100" align="absmiddle"/></div>';
			dvSSsr = dvSSsr + '</div>';
			ctySSPRO.push(dvSSsr);
			dvSSsr = ""
			if (p == 2) {
				dvSSs = dvSSs + '<div id="wrap">';
				dvSSs = dvSSs + '<div class="dvCarrCityTitle Text_Arial14_BlueBold">' + rrEchCty[0] + ' Activities: ' + rrEchPro.length + ' favorite</div>';
				dvSSs = dvSSs + '<div class="carousel-container">';
				dvSSs = dvSSs + '<div class="dvPrev"><span>'
				if (rrEchPro.length > 3) {
					dvSSs = dvSSs + '<img src="/images/T27_ForwH.jpg" id="prevS' + i + '"></span>'
				}
				dvSSs = dvSSs + '</div>'
				dvSSs = dvSSs + '<div id="SSfoo' + i + '" class="container-horizontal">';
				for (y = 0; y < ctySSPRO.length; y++) {
					dvSSs = dvSSs + ctySSPRO[y];
				}
				dvSSs = dvSSs + '<div style="clear:both"></div>';
				dvSSs = dvSSs + '</div>';
				dvSSs = dvSSs + '<div class="dvPrev"><span>'
				if (rrEchPro.length > 3) {
					dvSSs = dvSSs + '<img src="/images/T27_BackH.jpg" id="nextS' + i + '"></span>'
				}
				dvSSs = dvSSs + '</div>';
				dvSSs = dvSSs + '<div style="clear:both;"></div>';
				dvSSs = dvSSs + '</div>';
				dvSSs = dvSSs + '</div>';
				SSDispl.push(i + '|' + 0 + '|' + 2);
			}
			if (p == rrEchPro.length - 1) {
				allCtySSPRO.push(ctySSPRO);
				ctySSPRO = [];
			};
		}
		dvSSsr = ""
		ccC++
	};
	$('#dvShwActi').html(dvSSs);
	$('img[id*="prev"]').mouseover(function () { $(this).attr('src', '/images/T27_ForwH_Over.gif'); }).mouseout(function () { $(this).attr('src', '/images/T27_ForwH.jpg'); }).click(function () { moveCarr(this.id) });
	$('img[id*="next"]').mouseover(function () { $(this).attr('src', '/images/T27_BackH_Over.gif'); }).mouseout(function () { $(this).attr('src', '/images/T27_BackH.jpg'); }).click(function () { moveCarr(this.id) });
};
function moveCarr(eId) {
	console.log("moveCarr");
	var Ide = eId.substr(eId.length - 1);
	var TypPro;
	var TypMov;
	var nwProDispl = [];
	var nwAllCtyPro = [];
	var ssF = '';
	var ssE = '';
	var nwDvPro;
	var slidDirH;
	var slidDirS;
	var dvProsr = ""
	if (eId.indexOf('next') > -1) {
		TypMov = 'Nx';
		slidDirH = 'left';
		slidDirS = 'right';
	}
	else if (eId.indexOf('prev') > -1) {
		TypMov = 'Pv';
		slidDirH = 'right';
		slidDirS = 'left';
	};
	if (eId.indexOf('S') > -1) {
		TypPro = 'S'
		nwDvPro = $('#SSfoo' + Ide + '');
		nwProDispl = SSDispl;
		SSDispl = [];
		nwAllCtyPro = allCtySSPRO
	}
	else if (eId.indexOf('H') > -1) {
		TypPro = 'H'
		nwDvPro = $('#Hotfoo' + Ide + '');
		nwProDispl = HotDispl;
		HotDispl = [];
		nwAllCtyPro = allCtyHotPRO
	};
	for (s = 0; s < nwProDispl.length; s++) {
		var dispPRO = nwProDispl[s].split('|');
		if (dispPRO[0] == Ide) {
			if (TypMov == 'Nx') { ssF = Number(dispPRO[1]) + 3; ssE = Number(dispPRO[2]) + 3 } else if (TypMov == 'Pv') { ssF = Number(dispPRO[1]) - 3; ssE = Number(dispPRO[2]) - 3 };
			if (ssE <= -1 || ssF > nwAllCtyPro[Ide].length) {
				if (TypPro == 'S') { SSDispl = nwProDispl; } else if (TypPro == 'H') { HotDispl = nwProDispl; };
				return false;
			};
			if (TypPro == 'S') { SSDispl.push(Ide + '|' + ssF + '|' + ssE); } else if (TypPro == 'H') { HotDispl.push(Ide + '|' + ssF + '|' + ssE); };
			for (r = ssF; r <= ssE; r++) {
				if (nwAllCtyPro[Ide][r] != undefined) {
					dvProsr = dvProsr + nwAllCtyPro[Ide][r];
				}
			}
		}
		else {
			if (TypPro == 'S') { SSDispl.push(nwProDispl[s]); } else if (TypPro == 'H') { HotDispl.push(nwProDispl[s]); };
		}
	}
	nwDvPro.hide("slide", { direction: slidDirH }, 200);
	nwDvPro.html(dvProsr);
	nwDvPro.show("slide", { direction: slidDirS }, 500);
}
function getFeed() {
	var feeds
	$.ajax({
		type: "POST",
		url: "/europe/WS_PackPage.asmx/sqlFeedBacksXpackID",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: '{packID:"' + packID + '"}',
		success: function (data) {
			feeds = eval("(" + data.d + ")");
			jQuery.each(msg, function (data) {

			});
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
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
function recommendedHotels(plcID, ctyNA, objNA) {
	openModal();

	$.ajax({
		type: "POST",
		url: SiteName + "/Api/recommHotels/" + plcID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			hotRec = data;
			var recHot = '<div style="text-align:left; padding: 10px 10px 1px 10px;"><span class="Blue-Arial14">' + hotRec.length + ' hotels offered in ' + ctyNA + '</span></div>'
			recHot = recHot + '<div class="Orange-Arial12NB" align="left" style="padding:10px 10px;">You will be able to select your hotel in the next step</div>'
			var dvHght = 'auto'
			if (hotRec.length > 4) {
				dvHght = '270px'
				$('#divContent').attr('style', 'height:370px; width:auto; padding:15px 40px;');
			}
			recHot = recHot + '<div style="overflow:auto; height:' + dvHght + '; padding:1px 5px 1px 20px">'
			jQuery.each(hotRec, function (data) {
				recHot = recHot + '<div align="left" class="Text_12_Bold" style="padding:15px 10px 3px 10px;">' + this.pdL_Title + '</div>'
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
				if (allKinds.indexOf('400') > -1) {
					strKinds = strKinds + "Honeymoon and Romance"
				}
				if (strKinds != "") {
					recHot = recHot + '<div style="padding:2px 10px 10px 20px; margin-bottom:3px;" align="left"><b>Ideal for:</b> ' + strKinds + ' </div>'
				}
				if (this.ptY_Description != 'none') {
					recHot = recHot + '<div style="padding:2px 10px 10px 20px; border-bottom:1px solid #CCCCCC; margin-bottom:5px;" align="left">' + this.ptY_Description + '</div>'
				}
			});
			recHot = recHot + '</div>'
			$('.modal__container').html(recHot);

		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
			$('.modal__container').html(xhr.responseText);
		}
	});
}

function recommendedSS(plcID, ctyNA, objNA) {
	objPOS = 0
	objPOS = $('#' + objNA + '').offset();

	openModal();
	$.ajax({
		type: "POST",
		url: SiteName + "/Api/RecommSS/" + plcID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			hotRec = data;
			var recHot = '<div style="text-align:left; padding: 10px 10px 1px 10px;"><span class="Blue-Arial14" >' + hotRec.length + ' Things to do in ' + ctyNA + '</span></div>'
			recHot = recHot + '<div class="Orange-Arial12NB" align="left" style="padding:10px 10px;">You will be able to select your activities during the booking process</div>'
			var dvHght = 'auto'
			if (hotRec.length > 4) {
				dvHght = '270px'
				$('#divContent').attr('style', 'height:auto; width:auto; padding:15px 40px;'); //370px
			}
			recHot = recHot + '<div style="overflow:auto; height:' + dvHght + '; padding:1px 5px 1px 20px">'

			jQuery.each(hotRec, function (data) {
				recHot = recHot + '<div align="left" class="Text_12_Bold" style="padding:15px 10px 3px 10px;"><span onmouseover="divToShow(' + this.pdlid + ')" style="cursor:pointer">' + this.pdL_Title + '</span></div>'
				recHot = recHot + '<div id="dv' + this.pdlid + '" style="padding:10px 10px; display:none; overflow: auto; height:auto; width: 400px; border:1px solid #CCCCCC;" align="left"><div align="right" style="padding:2px 2px;" class="Text_12"><span onclick="divToHide(' + this.pdlid + ')" style="cursor:pointer;" class="Editor_Package_DaysNts">close [X]</span></div>' + this.spD_Description + '</div>'

			});
			recHot = recHot + '</div>'
			$('.modal__container').html(recHot);


		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
			$('.modal__container').html(xhr.responseText);
		}
	});
}
function dvCMSMoreOpen(dvid) {
	var aObj = document.getElementById(dvid);
	var dvObj = document.getElementById(dvid.replace('a', 'dv'));
	var posObj = ObjectPosition(document.getElementById(dvid));
	var posT = posObj[1] + 10;
	var posL = posObj[0];
	if (posObj[0] > 950) { posL = posObj[0] - 300 };
	dvObj.setAttribute('style', 'display:block; position:absolute; z-index:100; width:350px;left:' + posL + 'px; top:' + posT + 'px; border:1px solid #000066; padding:15px; background-color:#fff; overflow:visible; -moz-box-shadow: 0 0 10px 5px #999; -webkit-box-shadow: 0 0 10px 5px #999; box-shadow: 0 0 15px #999;');
	var adv = dvid.replace('a', 'dv');
	aObj.innerHTML = "<u>close [-]</u>"
	aObj.setAttribute("onClick", "dvCMSMoreClose('" + adv + "'); return false;");
};
function dvCMSMoreClose(dvid) {
	var aObj = document.getElementById(dvid.replace('dv', 'a'))
	var dvObj = document.getElementById(dvid)
	dvObj.setAttribute('style', 'display:none;');
	aObj.innerHTML = "<u>more [+]</u>"
	aObj.setAttribute("onClick", "dvCMSMoreOpen(this.id); return false;");
};
/* ************************************* */

function popError(obj, messg) {
	var objPos = $('#' + obj + '').offset();
	$('#divError').html(messg);
	$('#divError').show();
	if (messg.indexOf('All infants') != -1) {
		$('#divError').offset({ left: objPos.left - 100, top: objPos.top - 60 });
	}
	else {
		$('#divError').offset({ left: objPos.left - 85, top: objPos.top - 50 });
	};
	setTimeout("$('#divError').hide()", 2000);
};
function closeClick(obj) {
	$('#dvError').hide();
	if (IsMobileDevice()) { $('#' + obj + '').val(''); }
	$('#' + obj + '').select();
};
//New Feedback template//
function openFeedsContainer(tabType, Id) {
	$(".feedbacks-section__button").removeClass("selected");
	$(".feedbacks-section__button-city").removeClass("selected");
	if (tabType == 'P') {
		$(".feedbacks-section__button").addClass("selected");
		var values = $("#PVal" + Id).val().split('|');
		if (values[1] == 0) { $('#OverAllFeeds').hide(); } else { $('#OverAllFeeds').show(); }
		$("#dvNoOfFeeds").text(values[0] + " Reviews");
		$("#dvStarsOverAll").css("width", values[2] + "px");
		$("#dvStarsOverAllStr").text(values[1] + " out of 5 stars");
	}
	if (tabType == 'C') {
		$(".feedbacks-section__button-city").addClass("selected");
		var values = $("#CVal" + Id).val().split('|');
		if (values[1] == 0) { $('#OverAllFeeds').hide(); } else { $('#OverAllFeeds').show(); }
		$("#dvNoOfFeeds").text(values[0] + " Reviews");
		$("#dvStarsOverAll").css("width", values[2] + "px");
		$("#dvStarsOverAllStr").text(values[1] + " out of 5 stars");
	}

	createPagination(tabType, Id, 1);
	OpenPage(1, tabType, Id);
};
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
	$('#dvWaitFeeds').show();

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
};
function calreload(val) {
	startDate = ''
	histFilter = [];
	priceFilter = [];
	deflt = $(".spdepair").text();
	val === undefined ? ($('.spdepair').html(deflt), priceFilter = $.grep(priceGuide, function (pr) { return (pr.plC_Title === deflt); })) : priceFilter = $.grep(priceGuide, function (pr) { return (pr.plC_Title === val); });

	console.log("PriceFilter: ");
	console.log(priceFilter);

	var dCnt = 0
	jQuery.each(priceFilter, function (priceFilter) {
		var nwDate;
		dCnt === 0 ?
			(
				nwDate = new Date(),
				nwDate = nwDate.setDate(nwDate.getDate() + 45),
				startDate = nwDate //this.reD_StartDate
			)

			: '';
		var objtitle;
		objtitle = '$' + Math.round(this.reD_PackagePrice) + '*';
		objtitle = objtitle + '\xa0\xa0\xa0' + ' - ';
		this.reD_Nights.toString().length === 1 ? objtitle = objtitle + '\xa0\xa0\xa0\xa0' + this.reD_Nights + ' nights' : objtitle = objtitle + '\xa0\xa0' + this.reD_Nights + ' nights';
		var ob = { 'title': objtitle, 'start': '' + this.reD_StartDate + '', 'className': 'gui' + this.redid + '' }
		histFilter.push(ob);
		dCnt++;
	});
	$('#PriceGuideCalendar').guideCalendar('destroy');
	$('#PriceGuideCalendar').html('<div style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');

	setTimeout(guideCal, 1000);
};
/* Guide Calendar */
function guideCal() {
	$('#PriceGuideCalendar').html('');
	$('#PriceGuideCalendar').guideCalendar({
		header: {
			left: 'prev', //'month,agendaWeek,today,prev,next today',
			center: 'title',
			right: 'next' //'month,agendaWeek,agendaDay'
		},
		defaultDate: startDate, //'2016-01-12',
		weekMode: 'liquid',
		editable: true,
		eventLimit: true, // allow "more" link when too many events
		events: histFilter,
	});
	clickAnchor();
	$('.fc-more').click(function () { clickAnchor() });
};
function clickAnchor() {
	console.log("Start clickAnchor()");
	$('.dvPopUpOrangeTopL').hide();
	$('.dvPopUpOrangeTopR').hide();
	$(".aprice").click(function () {
		console.log("Start aprice");
		var nwDate = this.id
		$('.dvPopUpOrangeTopR').is(':visible') == true ? $('.dvPopUpOrangeTopR').hide() : '';
		$('.dvPopUpOrangeTopL').is(':visible') == true ? $('.dvPopUpOrangeTopL').hide() : '';
		var ctyNA = $('#inpFromNA').val()
		var ctyID = $('#inpFromID').val();
		$('#BsDepCity').val(ctyNA);
		$('#sDepCity').val(ctyNA);
		$('#iDepCity').val(ctyID);
		$('#BiDepCity').val(ctyID);
		$('#InDate1').val(nwDate);
		$('#BInDate1').val(nwDate);
		openModal();
		$('.modal__container').html('');
		$('#overviewCal').appendTo('.modal__container');
		$(window).resize(function () { $('#dvPopCal').center(); });
		$('[id^="gToday"]').css('position', 'fixed');
	});
	$("[class*='gui']").click(function () {
		var prPop = $(this).attr('class').match(isNumber);
		var prInf = [];
		var aOff = $(this).offset();
		var aPos = $(this).position();
		var popInf = '';
		prInf = $.grep(priceGuide, function (inf) { return (inf.redid == Number(prPop)); });
		$.each(prInf, function () {
			var priced = new Date(this.reD_TXMLTime)
			var arrive = new Date(this.reD_StartDate)
			var priceThis = "'" + this.plC_Title + "'," + this.plcid + ",'" + dateFormat(arrive.setDate(arrive.getDate() + 1), "mm/dd/yyyy") + "'"
			popInf = '<p>' +
				'<span><b>' + this.reD_Nights + ' Nights </b></span>' +
				'<b>from $' + Math.round(this.reD_PackagePrice) + ' w/air,  hotel &amp; air taxes*</b>' +
				'</p>' +
				'<p> <b>This sample price includes ALL air taxes &amp; fuel surcharges:</b> Priced on ' + dateFormat(priced.setDate(priced.getDate() + 1), "dddd, mmm dd, yyyy") + ' for arrival on ' + dateFormat(arrive.setDate(arrive.getDate()), "dddd, mmm dd, yyyy") + ', departure from ' + this.plC_Title + '.</p>' +
				'<p>This sample itinerary includes:</p>'

			aPos.left > 600 ?
				(
					$('.dvPopUpOrangeTopL').is(':visible') == true ? $('.dvPopUpOrangeTopL').hide() : '',
					$('#dvPopUpGR').show(),
					$('#dvPopContentR').html(popInf),
					$('#dvPopUpGR').offset({ left: aOff.left - 245, top: aOff.top + 34 })
				)
				:
				(
					$('.dvPopUpOrangeTopR').is(':visible') == true ? $('.dvPopUpOrangeTopR').hide() : '',
					$('#dvPopUpGL').show(),
					$('#dvPopContentL').html(popInf),
					$('#dvPopUpGL').offset({ left: aOff.left + 5, top: aOff.top + 34 })
				);


			$.ajax({
				type: "Get",
				url: SiteName + "/Api/Packages/ItineraryContentFromPriceId/" + prPop,
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (data) {
					msg = data;
					if (msg != '') {
						var itineraryContent = $.map(msg, function (val) { return { id: val.id, name: val.name }; });
						popInf = popInf + '<ul>' + itineraryContent[0].name + '</ul>';
						popInf = popInf + '<div class="dvPopPriceIt" onclick="priceThinCal(' + priceThis + ');"><span>Price It<font> &rsaquo;</font></span></div>'
						aPos.left > 600 ? ($('#dvPopContentR').html(popInf)) : ($('#dvPopContentL').html(popInf));
					}
				},
				error: function (xhr, desc, exceptionobj) {
					$('#dvPopContentR').html(xhr.responseText);
				}
			});
		});
	});
};
function priceThinCal(frm, id, when) {
	$('.dvPopUpOrangeTopR').is(':visible') == true ? $('.dvPopUpOrangeTopR').hide() : '';
	$('.dvPopUpOrangeTopL').is(':visible') == true ? $('.dvPopUpOrangeTopL').hide() : '';
	$('#BsDepCity').val(frm);
	$('#sDepCity').val(frm);
	$('#iDepCity').val(id);
	$('#BiDepCity').val(id);
	$('#InDate1').val(when);
	$('#BInDate1').val(when);
	openModal();
	$('.modal__container').html('');
	$('#overviewCal').appendTo('.modal__container');
	$(window).resize(function () { $('#dvPopCal').center(); });
	$('[id^="gToday"]').css('position', 'fixed');
};
// --- Open info pop up --- //
function hidePopUpInfo(popid) {
	$('#' + popid + '').hide();
	popid == 'dvPopCal' ?
		(
			$('#overviewCal').appendTo('.overview-section__calendar'),
			$('#BsDepCity').val('type here'),
			$('#sDepCity').val('type here'),
			$('#iDepCity').val(-1),
			$('#BiDepCity').val(-1),
			$('#InDate1').val('mm/dd/yyyy'),
			$('#BInDate1').val('mm/dd/yyyy'),
			$('[id^="gToday"]').css('position', 'absolute'),
			$('#dvPopCalContent').text().includes('Stagger') ? $('#dvPopCalContent').text('') : ''
		) : '';
	return false;
};
function DropDown(el) {
	this.dep = el;
	this.placeholder = this.dep.children('span');
	this.opts = this.dep.find('ul.dropdownList > li');
	this.val = '';
	this.index = -1;
	this.initEvents();
};
DropDown.prototype = {
	initEvents: function () {
		var obj = this;
		obj.dep.on('click', function (event) {
			$(this).toggleClass('active');
			return false;
		});
		obj.opts.on('click', function () {
			var opt = $(this);
			obj.val = opt.text();
			obj.index = opt.index();
			$('#inpFromNA').val(obj.val);
			$('#inpFromID').val(opt.find('a').attr('lang'));
			obj.placeholder.text(obj.val);
			calreload(obj.val);
		});
	},
	getValue: function () {
		return this.val;
	},
	getIndex: function () {
		return this.index;
	}
};
$(function () {
	var dep = new DropDown($('#dep'));
	$(document).click(function () {
		$('.dropdownContainer').removeClass('active');
	});
	$('.dveachHotinTab, #cmsLink').click(function () {
		var goTo = $(this).attr("lang");
		var x = window.screenX + (((window.outerWidth / 2) - (1100 / 2)));
		var y = window.screenY + (((window.outerHeight / 2) - (650 / 2)));
		window.open(goTo, 'new', 'height=650,width=1100,left=' + x + ',top=' + y + ',scrollbars=yes').focus();
	});
});
// **** DATEPICKER **** //
// include block dates
// var blkdates = ["2016-12-15", "2016-12-16"]
var between = [];
function dateByDest() {
	var rangeBlk = blockDates.replace('B-', '');
	rangeBlk = rangeBlk.trim().split('-');
	var rangeBlkS = rangeBlk[0].split('*');
	var rangeBlkE = rangeBlk[1].split('*');
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
			$('.InDate1').val(jQuery.datepicker.formatDate('mm/dd/yy', strDate));
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

//Mobile

var betweenMob = [];
function dateByDestMob() {
	var fixedDates = fxDatesNET;
	if (fixedDates != 0) { return false; }
	else {
		var rangeBlk = $('#blockDates').val();
		if (rangeBlk == 0) {
			// -- Calendar DatePicker
			var strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);
			var yearRange = '"' + today.getFullYear() + ":" + Number(today.getFullYear() + 1) + '"';
			$('#InDateMob1').datepicker({
				defaultDate: strDate,
				yearRange: yearRange, //"2015:2016",
				changeMonth: false,
				changeYear: false,
				numberOfMonths: 1,
				showButtonPanel: true,
				format: 'yyyy-mm-dd',
				hideIfNoPrevNext: true,
				prevText: '',
				nextText: '',
				minDate: strDate,
				showOtherMonths: false,
				maxDate: "+365d"
			}).click(function () { $(this).attr('style', '').removeClass('errorClass'); });
		}
		else {
			rangeBlk = rangeBlk.replace('B-', '');
			rangeBlk = rangeBlk.trim().split('-');
			var rangeBlkS = rangeBlk[0].split('*');
			var rangeBlkE = rangeBlk[1].split('*');

			for (i = 0; i <= rangeBlkS.length - 1; i++) {
				var ds = rangeBlkS[i].trim();
				var de = rangeBlkE[i].trim();
				var date1 = stringToDate('' + de + '', 'mm/dd/yyyy', '/');
				var date2 = stringToDate('' + ds + '', 'mm/dd/yyyy', '/');
				var day;
				while (date2 <= date1) {
					day = date1.getDate()
					betweenMob.push(jQuery.datepicker.formatDate('yy-mm-dd', date1));
					date1 = new Date(date1.setDate(--day));
				};
			};

			strDate = '';
			strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);

			var today90Days = new Date(myDate.getTime() + 90 * 24 * 60 * 60 * 1000);
			var strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
			if (betweenMob.indexOf(strDateString) != -1) {
				while (betweenMob.indexOf(strDateString) != -1) {
					strDate.setDate(strDate.getDate() + 1);
					strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
				}
				if (today90Days <= strDate)
					$('#InDateMob1').val(jQuery.datepicker.formatDate('mm/dd/yy', strDate));
			}

			$("#InDateMob1").datepicker("destroy");
			$('#InDateMob1').datepicker({
				orientation: 'top',
				defaultDate: strDate,
				changeMonth: false,
				changeYear: false,
				numberOfMonths: 1,
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
					return [betweenMob.indexOf(string) === -1]
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

			}).click(function () { $(this).attr('style', '').removeClass('errorClass'); });
		};
	};
};

function validateForm() {
	if ($('#addFlight').val() === 'True') {
		if ($('#iDepCityMob').val() === '-1') { errorAlert('iDepCityTxtMob', 'Select a valid departure airport'); return false };
	};
	$('#iRetCityMob, #iRetCity').val($('#iDepCityMob').val());
	var idate = $.trim($('#InDateMob1').val());
	if (/undefined|Select/.test(idate)) {
		errorAlert('InDateMob1', 'Select a valid date'); return false;
	};
	$('.dvMpriceItMob').hide();
	$('.btnWaitMob').show();

	submitForm(1);

	setTimeout(function () {
		$('.dvMpriceItMob').show();
		$('.btnWaitMob').hide();
	}, 3000);
}

function changeCabin(obj) {
	$('.mob-calendar__cabin-item').each(function () {
		this.id === obj.id ? ($('#' + obj.id + '').find('span:first').html('&#10003;'), $('#CabinMob').val(obj.id)) : $('#' + this.id + '').find('span:first').html('&nbsp;')
	});
	$('#Cabin option').each(function () {
		this.value === obj.id ? this.selected = 'selected' : '';
	})
}

function dvPriceIt() {
	$('.dvMpriceItMob').hide();
	$('.btnWaitMob').show();
	var bookProcess
	var pckType = $('#PackType').val();
	var pckID = $('#PkgidMob').val();
	switch (pckType) {
		case 'TP3':
			_bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
			bookProcess = _bpURL + "?" + pckID;
			break;
		case 'MC':
			bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID;
			break;
	};

	$('#frmToBook').attr('action', bookProcess);
	$('#frmToBook').submit();
	$('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
	var stringQuery = ''
	stringQuery = $('#frmToBook').serializeObject();
	console.log(stringQuery);
	Cookies.set('bpBack', stringQuery, { expires: 1 });

	setTimeout(function () {
		$('.dvMpriceItMob').show();
		$('.btnWaitMob').hide();
	}, 3000);
}

// **** ROOM - TRAVELERS *** //
function checkTotalPax() {
	var qAdults = Number($('#iAdultsMob').val()) + Number($('#RoomMob2_iAdults').val()) + Number($('#RoomMob3_iAdults').val());
	var qChilds = Number($('#iChildrenMob').val()) + Number($('#RoomMob2_iChildren').val()) + Number($('#RoomMob3_iChildren').val());
	totalPax = qAdults + qChilds;
	if (totalPax <= 6) {
		return true;
	} else {
		alert('Max guest allowed (adults + children) are 6 !')
		return false;
	};
};
function adultPlus(obj) {
	var nwObj;
	var nwObjVal;
	if (obj.id.match(isNumber) === null) {
		nwObj = $('#iAdultsMob');
		nwObjVal = Number(nwObj.val());
		if (nwObjVal <= 6) {
			$(nwObj).val(nwObjVal + 1);
			$('#iAdults').val(nwObjVal + 1);
			$('#AiAdults option').each(function () { Number(this.value) === nwObjVal + 1 ? this.selected = 'selected' : '' });
			if (!checkTotalPax()) {
				$(nwObj).val(nwObjVal);
				$('#iAdults').val(nwObjVal);
				$('#AiAdults option').each(function () { Number(this.value) === nwObjVal ? this.selected = 'selected' : '' });
			}
		}
	} else {
		nwObj = $('#RoomMob' + obj.id.match(isNumber) + '_iAdults');
		nwObjVal = Number(nwObj.val());
		if (nwObjVal <= 6) {
			$(nwObj).val(nwObjVal + 1);
			$('#Room' + obj.id.match(isNumber) + '_iAdults').val(nwObjVal + 1);
			$('#ARoom' + obj.id.match(isNumber) + '_iAdults option').each(function () { Number(this.value) === nwObjVal + 1 ? this.selected = 'selected' : '' });
			if (!checkTotalPax()) {
				$(nwObj).val(nwObjVal);
				$('#Room' + obj.id.match(isNumber) + '_iAdults').val(nwObjVal);
				$('#ARoom' + obj.id.match(isNumber) + '_iAdults option').each(function () { Number(this.value) === nwObjVal ? this.selected = 'selected' : '' });
			}
		}
	}
};
function adultMinus(obj) {
	var nwObj;
	if (obj.id.match(isNumber) === null) {
		nwObj = $('#iAdultsMob');
		nwObjVal = Number(nwObj.val());
		if (nwObjVal > 1) {
			nwObj.val(nwObjVal - 1);
			$('#iAdults').val(nwObjVal - 1);
			$('#AiAdults option').each(function () { Number(this.value) === nwObjVal - 1 ? this.selected = 'selected' : '' });
		} else {
			alert('At least one adult should be present at room 1!'), nwObj.val('1');
		}
	} else {
		nwObj = $('#RoomMob' + obj.id.match(isNumber) + '_iAdults');
		nwObjVal = Number(nwObj.val());
		if (nwObjVal > 1) {
			nwObj.val(nwObjVal - 1);
			$('#Room' + obj.id.match(isNumber) + '_iAdults').val(nwObjVal - 1);
			$('#ARoom' + obj.id.match(isNumber) + '_iAdults option').each(function () { Number(this.value) === nwObjVal - 1 ? this.selected = 'selected' : '' });
		} else {
			alert('At least one adult should be present at room ' + obj.id.match(isNumber) + '!'), nwObj.val('1');
		}
	}
};
function childPlus(obj) {
	var nwObj;
	if (obj.id.match(isNumber) === null) {
		nwObj = $('#iChildrenMob');

		switch (nwObj.val()) {
			case '0':
				nwObj.val('1');
				$('#iChildren option').each(function () { this.value === '1' ? this.selected = 'selected' : '' });
				checkTotalPax() === true ? childAgeChange(nwObj) : (nwObj.val('0'), $('#iChildren option').each(function () { this.value === '0' ? this.selected = 'selected' : '' }));
				break;
			case '1':
				nwObj.val('2');
				$('#iChildren option').each(function () { this.value === '2' ? this.selected = 'selected' : '' })
				checkTotalPax() === true ? childAgeChange(nwObj) : (nwObj.val('1'), $('#iChildren option').each(function () { this.value === '1' ? this.selected = 'selected' : '' }));
				break;
			case '2':
				alert('Sorry, only 2 Children per room')
				break;
			default: return;
		}
	}
	else {
		nwObj = $('#RoomMob' + obj.id.match(isNumber) + '_iChildren');

		switch (nwObj.val()) {
			case '0':
				nwObj.val('1');
				$('#Room' + obj.id.match(isNumber) + '_iChildren option').each(function () { this.value === '1' ? this.selected = 'selected' : '' });
				checkTotalPax() === true ? childAgeChange(nwObj) : (nwObj.val('0'), $('#Room' + obj.id.match(isNumber) + '_iChildren option').each(function () { this.value === '0' ? this.selected = 'selected' : '' }));
				break;
			case '1':
				nwObj.val('2');
				$('#Room' + obj.id.match(isNumber) + '_iChildren option').each(function () { this.value === '2' ? this.selected = 'selected' : '' })
				checkTotalPax() === true ? childAgeChange(nwObj) : (nwObj.val('1'), $('#Room' + obj.id.match(isNumber) + '_iChildren option').each(function () { this.value === '1' ? this.selected = 'selected' : '' }));
				break;
			case '2':
				alert('Sorry, only 2 Children per room')
				break;
			default: return;
		}
	}
};
function childMinus(obj) {
	var nwObj;
	obj.id.match(isNumber) === null ?
		(
			nwObj = $('#iChildrenMob'),
			nwObj.val() === '2' ? (nwObj.val('1'), $('#iChildren option').each(function () { this.value === '1' ? this.selected = 'selected' : '' }), childAgeChange(nwObj)) : nwObj.val() === '1' ? (nwObj.val('0'), $('#iChildren option').each(function () { this.value === '0' ? this.selected = 'selected' : '' }), childAgeChange(nwObj)) : ''
		)
		:
		(
			nwObj = $('#RoomMob' + obj.id.match(isNumber) + '_iChildren'),
			nwObj.val() === '2' ? (nwObj.val('1'), $('#Room' + obj.id.match(isNumber) + '_iChildren option').each(function () { this.value === '1' ? this.selected = 'selected' : '' }), childAgeChange(nwObj)) : nwObj.val() === '1' ? (nwObj.val('0'), $('#Room' + obj.id.match(isNumber) + '_iChildren option').each(function () { this.value === '0' ? this.selected = 'selected' : '' }), childAgeChange(nwObj)) : ''
		);
};
function childAgeChange(obj) {
	if ($(obj).attr('id').match(isNumber) === null) {
		$('#dvroomMob1 p[id^="pAgeMob"]').each(function (e, v) {
			if (v.id.match(isNumber) <= obj.val()) {
				$(this).show();
				$('#iChildMob' + this.id.match(isNumber) + '').val('ChildMob ' + this.id.match(isNumber) + ' Age');

			} else {
				$(this).hide(), $('#iChildMob' + this.id.match(isNumber) + '').val('');
			}

		})
	} else {
		$('#dvroomMob' + $(obj).attr('id').match(isNumber) + ' p[id^="pAgeMob"]').each(function (e, v) {
			if (v.id.match(isNumber) <= obj.val()) {
				$(this).show();
				$('#RoomMob' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('ChildMob ' + this.id.match(isNumber) + ' Age');
			} else {
				$(this).hide();
				$('#RoomMob' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('');
			}
		});
	}
};
function roomTravelers(obj) {
	$('#iRoomsAndPaxMob').val(obj.id);
	$('#roomPaxTxtMob').html(obj.innerHTML);
	$('#iRoomsAndPax option').each(function () {
		this.value === obj.id ? this.selected = 'selected' : '';
	})
	openPaxRoomlist();
	/Other/.test(obj.id) ? openRooms(obj.id.match(isNumber), 0) : openRooms(obj.id.substring(0, 1), obj.id.substring(2, 3));
};
function openRooms(rms, pax) {
	pax === 0 ? ($('#dvpxperroomMob').slideDown('slow'), $('div[id^="dvroomMob"]').each(function () { this.id.match(isNumber) <= rms ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRooms(this)) })) : ($('#dvpxperroomMob').slideUp('slow'), $('div[id^="dvroomMob"]').each(function () { this.id.match(isNumber) > 1 ? cleanRooms(this) : firstRoom(rms, pax) }));
};
function openPaxRoomlist() {
	$('#dvpxroomlstMob').is(':visible') === false ? $('#dvpxroomlstMob').slideDown('slow') : $('#dvpxroomlstMob').slideUp('slow');
};
function firstRoom(rm, px) {
	$('#iAdultsMob').val(px);
	$('#iChildrenMob').val(0);
	$('#iChildMob1').val('');
	$('#iChildMob2').val('');
	$('#dvroomMob1 p[id^="pAgeMob"]').each(function () { $(this).hide() });
};
function cleanRooms(obj) {
	$('#' + obj.id + '').find('input').each(function (e, v) {
		switch (e) {
			case 0:
				$('#' + v.id + '').val('0');
				break;
			case 1:
				$('#' + v.id + '').val('0');
				break;
			case 2:
				$('#' + v.id + '').val('');
				break;
			case 3:
				$('#' + v.id + '').val('');
				break;
		};
	});
	$('#' + obj.id + ' p[id^="pAgeMob"]').each(function () { $(this).hide() });
};
function stayChangeMob(sid, svalue) {
	$('#' + sid + '').val(svalue);
	$('#' + sid.replace('Mob', '') + '').val(svalue);
};
function changeDateDesk(id, value) {
	$('input[id="InDate1"]').val(value);
}
function changeDateMob(id, value) {
	$('input[id="InDateMob1"]').val(value);
}
function errorAlert(obj, mess) {
	var poss = $('#' + obj + '').position();
	$('#' + obj + '').addClass('errorClass');
	/qNACity/.test(obj) ? $('#' + obj + '').val(mess) : alert(mess);
	window.scroll(0, poss.top - 100);
	return false;
};

function hidedialog() {
	var dvC = Number($('div[id^="dvroomMob"]:visible').length);
	$('div[id^="dvroomMob"]').each(function () {
		if ($(this).is(':visible') === true) {
			var adULT = 0;
			var dvNUM = this.id.match(isNumber);
			var flowSTOP = true;
			var flowCHL = true;
			dvNUM == 1 ? adULT = $('.inpAdult').val() : adULT = $('#RoomMob' + dvNUM + '_iAdults').val();
			adULT == "" || adULT == 0 ? dvNUM == null ? flowSTOP = errorAlert('iAdultsMob', 'Should be at least 1 adult in Room 1') : flowSTOP = errorAlert('RoomMob' + dvNUM + '_iAdults', 'Should be at least 1 adult in Room' + dvNUM) : '';
			if (flowSTOP == false) {
				return false;
			};
			$('#' + this.id + ' p[id^="pAgeMob"] select').each(function () {
				if ($(this).is(':visible') == true) {
					console.log(this.id)
					var chdAGE = $(this).val();
					if (chdAGE == "" || chdAGE == null || chdAGE == 0) {
						flowCHL = errorAlert(this.id, 'RoomMob' + dvNUM + ': Child age is missing');
						dvC++
					} else {
						$('#' + this.id.replace('Mob', '')).val(chdAGE);
						$('#' + this.id + '').removeClass('errorClass');
					}
				};
			});
		};
		if (!flowCHL) { return false; };
		dvC--;

	});
	dvC === 0 ? hidedialogCont() : '';
};
function hidedialogCont() {
	var qcabin = "";
	switch ($('#CabinMob').val()) {
		case "Y":
			qcabin = ", Economy"
			break;
		case "W":
			qcabin = ", Premium Economy"
			break;
		case "C":
			qcabin = ", Business"
			break;
		case "F":
			qcabin = ", First Class"
			break;
	};
	$('#wCabinMob').val() === 'No' ? qcabin = "" : '';
	var qpxrm = $('#iRoomsAndPaxMob').val()
	var qRooms = qpxrm.substring(0, 1);
	$('#iRoom').val(qRooms);
	$('#Rooms').val(qRooms);
	qRooms > 1 ? qRooms = qRooms + ' Rooms' : qRooms = qRooms + ' Room';
	var rompax = qpxrm.split('|');
	var pax;
	var totpax = 0;
	/-/.test(rompax[1]) ? pax = rompax[1].split('-') : pax = rompax[1];
	for (p in pax) { totpax += Number(pax[p]); };
	isNaN(totpax) ? checkTotalPax() === true ? totpax = Number(totalPax) : '' : '';
	haveCook = 0;
	var qPxRoomString = qRooms + ', ' + totpax + ' Travelers' + qcabin;
	$('#cabinRoomPaxMob').val(qPxRoomString);
	$("#paxModalMob").hide();
	$('body').removeClass('modal-open');
};


function builFixDatediv(dates, dvObj) {
	var postDate;
	var postField;
	var m = ''
	var dtsDV = '';
	var fecha = dates.split(',');
	var dtct;
	for (i = 0; i < fecha.length; i++) {
		if (m != dateFormat(fecha[i], "mmm")) {
			m = dateFormat(fecha[i], "mmm");
			dtct = 0;
			if (i == 0) {
				dtsDV = '<div style="padding:3px 1px;background-color:beige;">';
			}
			else {
				dtsDV = dtsDV + '</div><div style="padding:3px 1px;background-color:beige;">';
			};
			dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
		};
		if (dtct == 0) {
			postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
			postField = "'" + dvObj + "'";
			dtsDV = dtsDV + '<span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
		}
		else {
			postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
			postField = "'" + dvObj + "'";
			dtsDV = dtsDV + ', <span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
		};
		dtct = dtct + 1;
	};
	dtsDV = dtsDV + '</div>';
	$('#dvFixDates').html(dtsDV);
	setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function changeDaysLenght1(ddate, dobj) {
	$('#' + dobj + '').val(ddate);
};

$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function () {
		if (o[this.name.replace('Mob', '')]) {
			if (!o[this.name.replace('Mob', '')].push) {
				o[this.name.replace('Mob', '')] = [o[this.name.replace('Mob', '')]];
			}
			o[this.name.replace('Mob', '')].push(this.value || '');
		} else {
			o[this.name.replace('Mob', '')] = this.value || '';
		}
	});
	return o;
};