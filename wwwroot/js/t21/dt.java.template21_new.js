// JavaScript Document
var packID;
var plcNA;
var pakNTS;
var popID;
var totCities;
var msg = '';
var newdvCnt;
var objPics;
var picTotal;
var priceFilter = [];
var priceGuide = [];
var histFilter = [];
var startDate;
var isNumber = /[0-9]+/g;
let currentPic = 0;
let pagePriceHistory = 1;
var dollarUSLocale = Intl.NumberFormat('en-US');
var allcouFeedNo = [];
var arrCitiesInfo = [];
var isPackageHotelsLoading = false;
var isPackageActivitiesLoading = false;
var isPackageFeedbacksLoading = false;
$(document).ready(function () {

	packID = $('#pakID').val();
	plcNA = $('#plcNA').val();
	pakNTS = $('#pakNTS').val();

	citiesInfo = $('#citiesInfo').val();
	citiesInfo = citiesInfo.substring(0, citiesInfo.length - 1);
	let arrAllCitiesInfo = citiesInfo.split("@").map(function (x) { return x.split("|") }); //id, divion, countryname
	arrCitiesInfo = [
		...new Map(arrAllCitiesInfo.map(item => [JSON.stringify(item), item])).values()
	];


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

	/* ******* Docement elements functions ******* */
	$('li[id*="dvTab"]').click(function () { opentabSection(this.id) });
	$('span[id^="bubble"]').each(function (idex, item) {
		$(this).tooltip();
	})
	$('.img-modal__close, .img-modal__title').click(moreMediaClose);
	$('#imgForw').click(nextPicture);
	$('#imgBack').click(prevPicture);
	$('.modal__close').click(closeModal);
	$('#moreRelatedItineraries').click(showMoreRelatedItineraries);
	$('#staggerPaymentsInfo').click(showStaggerPaymentsInfo);
	$('.mob-tab').click(function () { selectMobTab(this.id) });

	aboutBUT();
	$('#seeAllImg, #bigMap, .images-section__item img').on("click", function () { buildPics(); });
});
var deflt = 'New York City (all Airports),  NY';
function buildPics() {
	if (objPics == undefined) {
		$.ajax({
			type: "GET",
			url: SiteName + "/Api/Packages/PicsForPacks/" + packID,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data) {
				objPics = data;
				objImgs = $.grep(objPics, function (n, i) { return (n.imG_ImageType === 'P0'); });
				picTotal = objPics.length;

				seeAllImages('picture-1', objPics[0].imG_500Path_URL.toLowerCase(), objPics[0].imG_Title, objPics[0].imG_500Path_URL)
			},
			error: function (xhr, desc, exceptionobj) {
				console.error(xhr.responseText);
			}
		});
	} else {
		seeAllImages('picture-1', objPics[0].imG_500Path_URL.toLowerCase(), objPics[0].imG_Title, objPics[0].imG_500Path_URL);
	}
};
function scrollToFeedbackSection() {
	$('html, body').animate({
		scrollTop: $("#dvTabFeed").offset().top
	}, 2000);
}
function opentabSection(tabId) {
	var tabshow = tabId.replace('dvTab', '');
	$('li[id*="dvTab"]').removeClass('selected');
	$('section[id*="dvShw"]').removeClass('selected');
	$('#dvTab' + tabshow).addClass('selected');
	$('#dvShw' + tabshow).addClass('selected');
	newdvCnt = 'dvCont' + tabshow;

	switch (tabshow) {
		case 'View':
			break;
		case 'Itin':
			if ($('#cmsIti').val() == 0) {
				if ($(".hotels-section__list").children().length == 0) {
					GetPackageHotels();
				}
				if ($(".tours-section__list").children().length == 0) {
					GetPackageActivities();
				}
			}
			else {
				if ($("#loadingItin").length != 0) {
					callCMS($('#cmsIti').val(), newdvCnt);
				}
			};
			break;
		case 'Acco':
			if ($(".hotels-section__list").children().length == 0) {
				GetPackageHotels();
			}
			break;
		case 'Acti':
			if ($(".tours-section__list").children().length == 0) {
				GetPackageActivities();
			}
			break;
		case 'Tran':
			if ($('#cmsTra').val() == 0) { }
			else {
				if ($("#loadingTran").length != 0) {
					callCMS($('#cmsTra').val(), newdvCnt);
				}
			};
			break;
		case 'Cou':
			if ($('[id^="cmsLink-"]').length == 0 && $('[id^="coun-cms-"]').children().length == 0) {
				GetPackageCMSs();
			}
			break;
		case 'FAQ':
			if ($('#cmsFaq').val() == 0) { }
			else {
				if ($("#loadingFAQ").length != 0) {
					callCMS($('#cmsFaq').val(), newdvCnt);
				}
			};
			break;
		case 'Feed':
			if ($(".feedbacks-section__button-city").children().length == 0) {
				GetPackageFeedbacks();
			}
			break;
		case 'Price':
			calreload();
			break;
	}
};
function openFeedbacksSection() {
	selectMobTab('mbTabFeed');
	const element = document.querySelector('#dvShwFeed .feedbacks-section__wrapper');
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
		$('.history-section__list').animate({ "top": -259 * pagePriceHistory + 'px' });
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
		$('.history-section__list').animate({ "top": -259 * (pagePriceHistory - 1) + 259 + 'px' });
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
				if ($('#cmsIti').val() == 0) {
					if ($(".tours-section__list").children().length == 0) {
						GetPackageActivities();
					}
					if ($(".hotels-section__list").children().length == 0) {
						GetPackageHotels();
					}
				}
				else {
					if ($("#loadingItin").length != 0) {
						callCMS($('#cmsIti').val(), newdvCnt);
					}
				};
				break;
			case 'Acco':
				if ($(".hotels-section__list").children().length == 0) {
					GetPackageHotels();
				}
				break;
			case 'Acti':
				if ($(".tours-section__list").children().length == 0) {
					GetPackageActivities();
				}
				break;
			case 'Tran':
				if ($('#cmsTra').val() == 0) { }
				else {
					if ($("#loadingTran").length != 0) {
						callCMS($('#cmsTra').val(), newdvCnt);
					}
				};
				break;
			case 'Cou':
				if ($('[id^="cmsLink-"]').length == 0 && $('[id^="coun-cms-"]').children().length == 0) {
					GetPackageCMSs();
				}
				break;
			case 'FAQ':
				if ($('#cmsFaq').val() == 0) { }
				else {
					if ($("#loadingFAQ").length != 0) {
						callCMS($('#cmsFaq').val(), newdvCnt);
					}
				};
				break;
			case 'Feed':
				if ($(".feedbacks-section__button-city").children().length == 0) {
					GetPackageFeedbacks();
				}
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
				let dte = new Date(this.samDTE);

				mockup += '<div class="history-modal">' +
					'<p class="history-modal__title"> ' + this.samNTS + ' nights. from $' + dollarUSLocale.format(this.samPRC) + ' w/air, hotel and air taxes *</p>' +
					'<p class="history-modal__description"><b>This sample price includes ALL air taxes & fuel surcharges:</b> priced within the past 7 days for arrival on ' + dte.toLocaleDateString('en-US') + ', departure from ' + this.samAIP + '. Choose your own departure city and dates.</div>' +
					'<p class="history-modal__subtitle">This ' + this.samNTS + ' night sample itinerary includes:</p>' +
					'<ul class="history-modal__list">' + this.samITIN + '</ul>' +
					'</div>';

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
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/getDataThisCMS/" + cmsid,
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
function aboutBUT() {
	var popID;
	arrCitiesInfo.forEach(function (e) {
		i = e[0];
		$('[id^="aboutPL' + i + '"]').click(function (e) {
			e.preventDefault();
			if ($('[id^="cmsLink-"]').length == 0 && $('[id^="coun-cms-"]').children().length == 0) {
				GetPackageCMSs();
			}
			popID = $(this).attr('id').replace('aboutPL', 'aboutDIV');
			$('.backdrop-about').removeClass('is-hidden');
			$('#' + popID + '').show();
		});

		$('[id^="aboutCls' + i + '"]').click(function (e) {
			$('.backdrop-about').addClass('is-hidden');
			$('#' + popID + '').hide();
		});

		if ($('[id^="aboutCAL' + i + '"]').length > 0) {
			$('[id^="aboutCAL' + i + '"]').click(function (e) {
				e.preventDefault();
				if ($('[id^="cmsLink-"]').length == 0 && $('[id^="coun-cms-"]').children().length == 0) {
					GetPackageCMSs();
				}
				popID = $(this).attr('id').replace('aboutCAL', 'aboutDIV');
				$('.backdrop-about').removeClass('is-hidden');
				$('#' + popID + '').show();
			});
		};
		if ($('[id^="aboutOVR' + i + '"]').length > 0) {
			$('[id^="aboutOVR' + i + '"]').attr('style', 'border-bottom:1px dotted #4E73AB;');
			$('[id^="aboutOVR' + i + '"]').click(function (e) {
				if ($('[id^="cmsLink-"]').length == 0 && $('[id^="coun-cms-"]').children().length == 0) {
					GetPackageCMSs();
				}
				popID = $(this).attr('id').replace('aboutOVR', 'aboutDIV');
				$('.backdrop-about').removeClass('is-hidden');
				$('#' + popID + '').show();
			});
		};
	})
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
//New Feedback template//
function openFeedsContainer(tabType, Id) {
	$(".feedbacks-section__button").removeClass("selected");
	$(".feedbacks-section__button-city").removeClass("selected");
	let noFeeds;
	if (tabType == 'P') {
		$(".feedbacks-section__button").addClass("selected");
		var values = $("#PVal" + Id).val().split('|');
		if (values[1] == 0) { $('#OverAllFeeds').hide(); } else { $('#OverAllFeeds').show(); }
		$("#dvNoOfFeeds").text(values[0] + " Reviews");
		$("#dvStarsOverAll").css("width", values[2] + "px");
		$("#dvStarsOverAllStr").text(values[1] + " out of 5 stars");
		noFeeds = values[0];
	}
	if (tabType == 'C') {
		$(".feedbacks-section__button-city").addClass("selected");
		let currentCouFeedNo = allcouFeedNo.filter((e) => e[0] == Id);
		if (currentCouFeedNo[0][2] == 0) {
			$('#OverAllFeeds').hide();
		} else {
			$('#OverAllFeeds').show();
		}
		$("#dvNoOfFeeds").text(currentCouFeedNo[0][1] + " Reviews");
		$("#dvStarsOverAll").css("width", currentCouFeedNo[0][3] + "px");
		$("#dvStarsOverAllStr").text(currentCouFeedNo[0][2] + " out of 5 stars");
		noFeeds = currentCouFeedNo[0][1];
	}

	createPagination(tabType, Id, 1, noFeeds);
	OpenPage(1, tabType, Id);
};
function createPagination(tabType, Id, page, noFeeds) {
	$('.dvPaginas').pagination('destroy');
	var PGtotal = noFeeds;



	$('.dvPaginas').pagination({
		pages: Math.ceil(PGtotal / 10),
		itemsOnPage: 10,
		cssStyle: 'light-theme',
		onPageClick: function (page, event) {

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
	var dCnt = 0
	jQuery.each(priceFilter, function (priceFilter) {
		var nwDate;
		dCnt === 0 ?
			(
				nwDate = new Date(),
				nwDate = nwDate.setDate(nwDate.getDate() + 45),
				startDate = nwDate
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
		editable: false,
		eventLimit: true, // allow "more" link when too many events
		events: histFilter,
	});
	clickAnchor();
	$('.fc-more').click(function () { clickAnchor() });
};
function clickAnchor() {
	$('.dvPopUpOrangeTopL').hide();
	$('.dvPopUpOrangeTopR').hide();
	$(".aprice").click(function () {
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
		$(window).resize(function () { $('#dvPopCal').center(); });
		$('[id^="gToday"]').css('position', 'fixed');
		scrollToTop();
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
function scrollToTop() {
	$('body,html').animate({
		scrollTop: 0
	}, 800);
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
	$(window).resize(function () { $('#dvPopCal').center(); });
	$('[id^="gToday"]').css('position', 'fixed');
	scrollToTop();
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
function GetPackageSamplePrice(packID) {
	$.ajax({
		type: "POST",
		url: SiteName + "/Api/PackageSamplePrice",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify(packID),
		success: function (data) {
			objListPrices = data;
			if (objListPrices.length > 0) {
				var ulListPrices = '<h2 class="history-section__title">Price history for this itinerary (past 7 days):</h2>';
				ulListPrices += '<div class="history-section__list-wrapper">';
				ulListPrices += '<div>';
				ulListPrices += '<ul class="history-section__list">';
				var count = 0;
				objListPrices.forEach(function (pr) {
					ulListPrices += '<li class="history-section__item ' + (count >= 7 ? 'visually-hidden' : '') + '">';
					ulListPrices += '<button type="button" onclick="showThisItineraries(' + pr[0].REAID + ')">';
					ulListPrices += '<span>From ' + pr[0].PLC_Title + ' for ' + pr[0].REA_Nights + ' nights</span>';
					ulListPrices += '<span> $' + dollarUSLocale.format(pr[0].REA_TotalPrice) + ' * incl.tax</span>';
					ulListPrices += '</button>';
					ulListPrices += '</li>';
					count++;
				});

				ulListPrices += '</ul>';
				ulListPrices += '</div>';
				ulListPrices += '<div class="history-section__mob-button">';
				ulListPrices += '<button id="seeMorePriceHistory" type="button">see more<span>&#129095;</span></button>';
				ulListPrices += '<button id="closeMorePriceHistory" class="is-hidden" type="button">close more<span>&#129093;</span></button>';
				ulListPrices += '</div>';
				ulListPrices += '<div class="history-section__wrapper-buttons">';
				ulListPrices += '<button id="prevPriceHistory" class="history-section__desk-button disabled" type="button" aria-label="Previous price history">&#129093;</button>';
				ulListPrices += '<button id="nextPriceHistory" class="history-section__desk-button" type="button" aria-label="Next price history">&#129095;</button>';
				ulListPrices += '</div>';
				ulListPrices += '</div>';
				$('#history-section__prices').append(ulListPrices);

				$('#prevPriceHistory').click(prevPriceHistory);
				$('#nextPriceHistory').click(nextPriceHistory);
				$('#seeMorePriceHistory').click(seeMorePriceHistory);
				$('#closeMorePriceHistory').click(closeMorePriceHistory);

				if ($('.history-section__list').children().length <= 7) {
					$('.history-section__wrapper-buttons, .history-section__mob-button').hide();
					$('.history-section__list-wrapper > div:nth-child(1)').attr('style', 'height: auto');
				}
			}
		},
		error: function (xhr, desc, exceptionobj) {
			console.log("Call GetPackageSamplePrice error: " + xhr.responseText);
		}
	});
}

function GetPackageCMSs() {
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/PackageCMSs/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			citiesInfo = data;
			let grPlaceId = []; //cities group 
			citiesInfo.filter((city) => city.str_PlaceTypeId == 1 || city.str_PlaceTypeId == 25).forEach(function (e) {
				let group = grPlaceId.find(g => g['placeId'] == e.placeId);
				if (group == undefined) {
					group = { placeId: e.placeId, str_PlaceTitle: e.str_PlaceTitle, stR_UserID: e.stR_UserID };
					grPlaceId.push(group);
				}
			});
			let goTo, x, y;
			var cmsName;
			let cmsButton;
			let tabC;
			citiesInfo.filter((el) => el.str_PlaceTypeId == 5 && el.n == 1).forEach(function (e) {
				citiesInfo.filter((cm) => cm.placeId == e.placeId && cm.cmsW_RelatedCmsID != undefined && cm.cmsW_RelatedCmsID != null && cm.cmsW_Title != "")
					.sort((a, b) => (a.cmsW_Order > b.cmsW_Order) ? 1 : ((b.cmsW_Order > a.cmsW_Order) ? -1 : 0))
					.forEach(function (c) {
						cmsName = c.cmS_Description == "none" ? c.cmsW_Title.replaceAll(" ", "_").toLowerCase() : c.cmS_Description.replaceAll(" ", "_").toLowerCase();
						cmsButton = "<a id=\"ajxTrick\" class=\"jxCoInf\" href=\"/" + cmsName + "/cms?cms=" + c.cmsW_RelatedCmsID + "\">" + c.cmsW_Title + "</a>";
						$("#coun-cms-" + e.placeId).append(cmsButton);
					});
			});
			grPlaceId.forEach(function (e) { //cities CMS
				tabC = 0;
				cmsButton = "<div style=\"height:5px;border-bottom:1px solid #390;\"></div>";
				cmsButton += "<div align=\"center\">";
				citiesInfo.filter((cm) => cm.placeId == e.placeId && cm.cmsW_RelatedCmsID != undefined && cm.cmsW_RelatedCmsID != null && cm.cmsW_Title != "")
					.sort((a, b) => (a.cmsW_Order > b.cmsW_Order) ? 1 : ((b.cmsW_Order > a.cmsW_Order) ? -1 : 0))
					.forEach(function (c) {
						tabC += 1;
						cmsName = c.cmS_Description == "none" ? c.cmsW_Title.replaceAll(" ", "_").toLowerCase() : c.cmS_Description.replaceAll(" ", "_").toLowerCase();
						cmsButton += "<span style=\"padding:0px 2px;margin-top:10px;cursor:pointer;\"><span style=\"margin:0px 2px;\"><span id=\"cmsLink-" + e.placeId + "-" + c.cmsW_RelatedCmsID + "\" lang=\"/" + cmsName + "/cms?cms=" + c.cmsW_RelatedCmsID + "\"><img class=\"lazyload\" src=\"https://pictures.tripmasters.com/siteassets/d/spacer.gif\" data-src=\"https://pictures.tripmasters.com/siteassets/d/lupita.png\" width=\"28px\" height=\"27px\" border=\"0\" align=\"absmiddle\"/><u>" + c.cmsW_Title + "</u></span></span></span>";
					});
				cmsButton += "</div>";
				$('[id^="aboutDIV' + e.placeId + '"]').append(cmsButton);
			});
			$("[id^='cmsLink']").click(function () {
				goTo = $(this).attr("lang");
				x = window.screenX + (((window.outerWidth / 2) - (1100 / 2)));
				y = window.screenY + (((window.outerHeight / 2) - (650 / 2)));
				window.open(goTo, 'new', 'height=650,width=1100,left=' + x + ',top=' + y + ',scrollbars=yes').focus();
			});
			$('.jxCoInf').click(function () {
				var jhref = $(this).attr("href");
				winOpenCMS(jhref);
				return false;
			})
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
}

function GetPackageHotels() {
	if (isPackageHotelsLoading) {
		return;
	}
	$('#dvShwAcco').append('<div id="loadingAcco" style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
	isPackageHotelsLoading = true;
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/PackageHotels/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			citiesInfo = data;
			let grPlaceId = []; //cities group hotels and activities
			citiesInfo.filter((city) => city.str_PlaceTypeId == 1 || city.str_PlaceTypeId == 25).forEach(function (e) {
				let group = grPlaceId.find(g => g['placeId'] == e.placeId);
				if (group == undefined) {
					group = { placeId: e.placeId, str_PlaceTitle: e.str_PlaceTitle, noOfSS: e.noOfSS, noOfHotels: e.noOfHotels, stR_UserID: e.stR_UserID };
					grPlaceId.push(group);
				}
			});
			let ordo = 0;
			var currentCity;
			let goTo, x, y;
			grPlaceId.filter((city) => city.noOfHotels > 0).forEach(function (e) {
				ordo++;
				noHotelsInfo = "&nbsp;&nbsp;<a id=\"hotOff-" + e.placeId + "-" + ordo + "\" onclick=\"recommendedHotels(" + e.placeId + ",\'" + e.str_PlaceTitle + "\',this.id); return false;\" style=\'cursor: pointer\'>" + e.noOfHotels + " hotels offered</a>";
				if ($("div[id^='overn-" + e.placeId + "'] .HotelsInfo").length > 0) { //cached and non-cached pages
					$("div[id^='overn-" + e.placeId + "'] .HotelsInfo").append(noHotelsInfo);
				}
				else {
					$("div[id^='overn-" + e.placeId + "']").append(noHotelsInfo);
				}
				currentCity = arrCitiesInfo.filter((word) => word[0] == e.placeId);
				if (currentCity.length > 0) {
					hotelInfo = "<li class=\"dveachHotinTab\" lang=\'/" + currentCity[0][1] + "/" + currentCity[0][2].replaceAll(" ", "_").toLowerCase() + "/" + e.str_PlaceTitle.replaceAll(" ", "_").toLowerCase() + "/hotels\'>";
					hotelInfo += "<div class=\'hotels-section__image\' id=\'imgHO" + ordo + "\'>";
					hotelInfo += "<img class=\'lazyload\' src=\'https://pictures.tripmasters.com/siteassets/d/spacer.gif\' data-src=\'https://pictures.tripmasters.com/images/destination_icons/ed/cities/" + e.placeId + "_cityimage.jpg\' onerror=\'this.onerror=null;this.src =\"https://pictures.tripmasters.com/images/destination_icons/ed/cities/" + e.placeId + "_placephoto.jpg\"\'/>";
					hotelInfo += "</div>";
					hotelInfo += "<div class=\'hotels-section__button\'>";
					hotelInfo += "<button class=\'dvButtPrim\'>" + e.str_PlaceTitle + " Hotels (" + e.noOfHotels + " total)<span>&#155;</span></button></div>";
					$(".hotels-section__list").append(hotelInfo);
				}
			});
			$('.dveachHotinTab').click(function () {
				goTo = $(this).attr("lang");
				x = window.screenX + (((window.outerWidth / 2) - (1100 / 2)));
				y = window.screenY + (((window.outerHeight / 2) - (650 / 2)));
				window.open(goTo, 'new', 'height=650,width=1100,left=' + x + ',top=' + y + ',scrollbars=yes').focus();
			});
			$('#loadingAcco').remove();
			isPackageHotelsLoading = false;
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
}

function GetPackageActivities() {
	if (isPackageActivitiesLoading) {
		return;
	}
	$('#dvShwActi').append('<div id="loadingActi" style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
	isPackageActivitiesLoading = true;
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/PackageActivities/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			citiesInfo = data;
			let grPlaceId = []; //cities group hotels and activities
			citiesInfo.filter((city) => city.str_PlaceTypeId == 1 || city.str_PlaceTypeId == 25).forEach(function (e) {
				let group = grPlaceId.find(g => g['placeId'] == e.placeId);
				if (group == undefined) {
					group = { placeId: e.placeId, str_PlaceTitle: e.str_PlaceTitle, noOfSS: e.noOfSS, noOfHotels: e.noOfHotels, stR_UserID: e.stR_UserID };
					grPlaceId.push(group);
				}
			});
			let ordo = 0;
			var currentCity;
			let goTo, x, y;
			grPlaceId.filter((city) => city.noOfSS > 0).forEach(function (e) {
				ordo++;
				noHotelsInfo = "<br/>Optional&nbsp;&nbsp;<a id=\"hotOff-" + e.placeId + "-" + ordo + "\" onclick=\"recommendedSS(" + e.placeId + ",\'" + e.str_PlaceTitle + "\',this.id); return false;\" style=\'cursor: pointer\'>" + e.noOfSS + " Things to do</a>";
				if ($("div[id^='overn-" + e.placeId + "'] .ActivitiesInfo").length > 0) { //cached and non-cached pages
					$("div[id^='overn-" + e.placeId + "'] .ActivitiesInfo").append(noHotelsInfo);
				}
				else {
					$("div[id^='overn-" + e.placeId + "']").append(noHotelsInfo);
				}
				currentCity = arrCitiesInfo.filter((word) => word[0] == e.placeId);
				if (currentCity.length > 0) {
					ssInfo = "<li class=\"dveachHotinTab\" lang=\'/" + currentCity[0][1] + "/" + currentCity[0][2].replaceAll(" ", "_").toLowerCase() + "/" + e.str_PlaceTitle.replaceAll(" ", "_").toLowerCase() + "/activities\'>";
					ssInfo += "<div class=\'tours-section__image\' id=\'imgSS" + ordo + "\'>";
					ssInfo += "<img class=\'lazyload\' src=\'https://pictures.tripmasters.com/siteassets/d/spacer.gif\' data-src=\'https://pictures.tripmasters.com/images/destination_icons/ed/cities/" + e.placeId + "_cityimage.jpg\' onerror=\'this.onerror=null;this.src =\"https://pictures.tripmasters.com/images/destination_icons/ed/cities/" + e.placeId + "_placephoto.jpg\"\'/>";
					ssInfo += "</div>";
					ssInfo += "<div class=\'tours-section__button\'>";
					ssInfo += "<button class=\'dvButtPrim\'>Tours in " + e.str_PlaceTitle + " (" + e.noOfSS + " total)<span>&#155;</span></button></div>";
					$(".tours-section__list").append(ssInfo);
				}
			})
			$('.dveachHotinTab').click(function () {
				goTo = $(this).attr("lang");
				x = window.screenX + (((window.outerWidth / 2) - (1100 / 2)));
				y = window.screenY + (((window.outerHeight / 2) - (650 / 2)));
				window.open(goTo, 'new', 'height=650,width=1100,left=' + x + ',top=' + y + ',scrollbars=yes').focus();
			});
			$('#loadingActi').remove();
			isPackageActivitiesLoading = false;
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
}

function GetPackageFeedbacks() {
	if (isPackageFeedbacksLoading) {
		return;
	}
	$('#dvShwFeed').append('<div id="dvShwFeedLoading" style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
	isPackageFeedbacksLoading = true;
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/PackageFeedbacks/" + packID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			citiesInfo = data;
			let feedButton; //Feedbacks
			let country_with_feeds = false;
			let c_overAll, W;
			let couFeedNo = []
			citiesInfo.filter((el) => el.str_PlaceTypeId == 5 && el.noOfFeeds > 0)
				.sort((a, b) => (a.str_PlaceTitle > b.str_PlaceTitle) ? 1 : ((b.str_PlaceTitle > a.str_PlaceTitle) ? -1 : 0))
				.forEach(function (e) {
					couFeedNo = [];
					feedButton = "<button class=\"feedbacks-section__button-city\" onclick=\"openFeedsContainer(\'C\'," + e.placeId + ")\">";
					feedButton += "<span>" + e.str_PlaceTitle + "</span>";
					feedButton += "<span>" + e.noOfFeeds + " Customer Feedbacks</span>";
					feedButton += "</button>";
					feedButton += "<input id=\"CoutryFeedIds" + e.placeId + "\" type=\"hidden\" value=" + e.noOfFeeds + "/>";
					$(".feedbacks-section__buttons").append(feedButton);
					country_with_feeds = true;
					c_overAll = e.overAll.toFixed(2);
					W = ((c_overAll * 120) / 5).toFixed(1);
					couFeedNo.push(e.placeId);
					couFeedNo.push(e.noOfFeeds);
					couFeedNo.push(c_overAll);
					couFeedNo.push(W);
					allcouFeedNo.push(couFeedNo);
					couFeedNo = [];
				})
			$('#dvShwFeedLoading').remove();
			if ($('#packFeedCount').val() == 0 && !country_with_feeds) {
				$('#dvShwFeed').css("display", "none");
				$('#dvTabFeed').css("display", "none");
			}
			else {
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
			}
			isPackageFeedbacksLoading = false;
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText + ' = error');
		}
	});
}

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