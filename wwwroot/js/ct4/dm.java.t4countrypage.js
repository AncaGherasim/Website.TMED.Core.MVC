// JavaScript Document
var pics = '';
var aPic = '';
var thumPic = '';
var OthumPic ='';
var TthumPic ='';
var thumMap = '';
var OthumMap = '';
var picSize = 200;
var shwMaps = '';
var maskH;
var	maskW;	
var isNumber = /[0-9]+/g;
var placeID;
var placeNA;
var citiesAll = [];
let currentPic = 0;
let arrCities = [];
$(document).ready(function () {
	maskH = $(document).height();
	maskW = $(window).width();
	placeID = $('#placeID').val();
	placeNA = $('#placeNA').val();
	bestPackID = $('#imgItemID').val(); 

	getTop1Feedback(bestPackID);

	$('.browseButton, .buildButton, .eachHigh, .dvCustomIt, .dvSuggCustomIt').click(function () {
		winlocation(this.getAttribute("data-go-to"));
	});

	$('button[id*="faq-"]').click(function () { onClickFAQInfo(this); })
	$('#moreButtonT4').click(function () {
		$('#toHide').is(':visible') === false ?
			($("#toHide").slideDown(), $('#toHide').removeClass('toHide'), $('#toHide').attr('style', 'display: flex'), $('#moreButtonT4').html('Show Less')) : ($("#toHide").slideUp(), $('#toHide').addClass('toHide'), $('#moreButtonT4').html('Show More'));
	});

	$('.dveachOtherMore').click(function () {
		var eachID = this.getAttribute("data-id");
		otherMoreDetails(eachID, 1);
	});
	$('.dvotherClose span').click(function () {
		var closeID = this.id;
		otherMoreDetails(closeID, 0);
	});
	$('.img-modal__close, .img-modal__title').click(moreMediaClose);
	$('#seeAllImg').click(function () {
		buildPics();
	});
	$('#imgForw').click(nextPicture);
	$('#imgBack').click(prevPicture);

	$('#seeAllCities').click(function () { getPlacesOnCountry(placeID) });
	$('.modal__close').click(closeAllCities);

	const targetElement = document.querySelector('.suggested__buttons');
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				getNoOfPacksFeaturedItin(placeID);
				observer.unobserve(entry.target);
			}
		});
	}, {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	}
	);
	observer.observe(targetElement);
});

function getNoOfPacksFeaturedItin(plcId) {
	const url = `${SiteName}/Api/GetNoOfPacksFeaturedItin/${parseInt(plcId)}`;
	fetch(url, {
		method: 'GET',
		headers: {
			contentType: 'application/json;charset=utf-8'
		}
	})
	.then(response => {
		if (!response.ok) {
			return response.text().then(text => { throw new Error(text) });
		}
		return response.json();
	})
	.then(data => {
		if (data[0] != 0) {
			const elements = document.querySelectorAll('.btnHide');
			elements.forEach(element => {
				element.classList.remove('btnHide');
			})
			document.querySelector('.noPacks').innerHTML = data[0].noOfPacks;
		}
	})
	.catch(error => {
		// Handle errors
		console.error('Error fetching data of getNoOfPacksFeaturedItin :', error.message);
	});
}
function onClickFAQInfo(el) {
	const idInfo = el.id.replace('faq', 'faqInfo');
	const elInfo = $('#' + idInfo);

	elInfo.is(':visible') == false ? (elInfo.show(300), $('#' + el.id).addClass('active')) : (elInfo.hide(300), $('#' + el.id).removeClass('active'));
}

/*function getTopSellersPackFeedback() {
	$.ajax({
		type: "POST",
		url: SiteName + "/Api/TopSellersPackFeedback",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify(placeID),
		success: function (data) {
			objListReviews = data;
			var ulListReviews = '<ul class="ul-Flex">';
			var commC = 0;
			for (i = 0; i <= objListReviews.length - 1; i++) {
				ulListReviews = ulListReviews + '<li class="liBkg"><div class="div-ContainerFlex"><a href="' + SiteName + '/' + placeNA.replace(/ /g, "_").toLowerCase() + "/" + objListReviews[i].PDL_Title.replace(/ /g, "_").toLowerCase() + "/package-" + objListReviews[i].PDLID + '"><p class="review_title">' + objListReviews[i].PDL_Title + '</p></a><br/>';
				ulListReviews = ulListReviews + '<div class="review-times review_date"><span>Sold ' + objListReviews[i].NoOfSales.toLocaleString('en-US') + ' times </span></div>';
				var bookingDate = new Date(objListReviews[i].Booking_Date);
				ulListReviews = ulListReviews + '<div class="review-purchase"><span>Last purchase ' + bookingDate.toLocaleDateString('en-US') + '</span></div>';
				ulListReviews = ulListReviews + '<div class="review-custrev review_date"><span>' + objListReviews[i].NoOfFeeds.toLocaleString('en-US') + ' customer reviews</span></div>';
				ulListReviews = ulListReviews + '<div class="review-custrev"><a href="' + SiteName + '/' + placeNA.replace(/ /g, "_").toLowerCase() + "/" + objListReviews[i].PDL_Title.replace(/ /g, "_").toLowerCase() + "/feedback-" + objListReviews[i].PDLID + '">See travelers itineraries and read feedback</a><br/></div>';
				var noNights = "";
				if (objListReviews[i].STP_NumOfNights == 0) {
					if (objListReviews[i].PDL_Duration == 1) {
						noNights = "1 night";
					}
					else {
						noNights = objListReviews[i].PDL_Duration.toLocaleString('en-US') + " nights";
					}
				}
				else {
					if (objListReviews[i].STP_NumOfNights == 1) {
						noNights = "1 night";
					}
					else {
						noNights = objListReviews[i].STP_NumOfNights.toLocaleString('en-US') + " nights";
					}
				}
				ulListReviews = ulListReviews + '<div class="review-nights review_date"><span>' + noNights + ' from <span style="color:#f60;">' + objListReviews[i].STP_Save.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, }) + '*</span></span></div>';
				ulListReviews = ulListReviews + '</div></li>';
			}
			ulListReviews = ulListReviews + '</ul>';
			$('#dReview').html('');
			$('#dReview').append(ulListReviews);
		},
		error: function (xhr, desc, exceptionobj) {
			console.log("Call TopSellersPackFeedback error: " + xhr.responseText);
		}
	});
}*/
function winlocation(url){
	window.location = url;
};
var goTo = 0;
function toggleClassMoreDetails(packId) {
	$('body').toggleClass('modal-pack-info-open');
	$('#fti-' + packId + '-modal').toggleClass('is-hidden');
}
function otherMoreDetails(objid, cls) {
	switch (cls) {
		case 2:
			goTo = -1;
			break;
	}
	//console.log("goTo = " + goTo);
	if (goTo == -1) { return false; }

	$('.secPackInfo').each(function () {
		var secID = $(this).attr('id');
		var numID = secID.match(isNumber);
		numID == objid ? (
			!$(this).is(':visible') ?
				(
					$(this).slideDown(),
					$('p[id="down' + numID + '"]').slideDown(),
					$('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(-135deg)', 'margin': '7px 10px' })
				) : (
					$(this).slideUp(),
					$('p[id="down' + numID + '"]').slideUp(),
					$('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(45deg)', 'margin': '5px 10px' })
				)
		) : (
			$(this).slideUp(),
			$('p[id="down' + numID + '"]').slideUp(),
			$('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(45deg)', 'margin': '5px 10px' })
		);
	});

	cls === 1 ? relPackCallt4(objid) : '';
}
function relPackCallt4(packID) {
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
            alert(xhr.responseText + ' = error');
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
function popUpImagesNav(){
	thumPic = '';
	thumMap = '';
	hvMap = 0;
	var Cpic=0;
	var Cmap=0;
	var thumClass = 'picNSel';
	for (i=0;i<Number(picTotal);i++){
		if (i==0){thumClass = 'picSel'}else{thumClass = 'picNSel'};
		if (objPics[i].imG_ImageType == 'P0'){
			Cpic++
			thumPic = thumPic + '<img id="Kipic'+ Cpic +'" class="'+thumClass+'" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() +'" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/>';
		}
		else if (objPics[i].imG_ImageType == 'M0' || objPics[i].imG_ImageType == 'M1'){
			Cmap++
			thumMap = thumMap + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() +'" id="Mipic'+Cmap+'" class="'+thumClass+'" width="30" height="30" alt="' + objPics[i].imG_500Path_URL + '" title="' + objPics[i].imG_Title + '"/>';
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
function moreMediaClose() {
	$('#dvmediaPopUp').addClass('is-hidden');
	$('body').removeClass('modal-open');
};
function buildPics() {
	$('#dvmediaPopUp').removeClass('is-hidden');
	$('body').addClass('modal-open');
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/PicsForPacks/" + bestPackID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data) {
			const objPics = data;
			const picTotal = objPics.length;

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
			const firstElement = document.querySelector('.img-modal__list li img');
			changePic(firstElement.id, firstElement.src, firstElement.title, firstElement.alt)
		},
		error: function (xhr, desc, exceptionobj) {
			console.error(xhr.responseText);
		}
	});
};
function openWinCMS(cmsid,jhref) {
 	centerWindow(jhref);
    return false;
};
function findPackst4(formID) {
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
};
function getPlacesOnCountry(id) {
	$('#cities_modal').removeClass('is-hidden');
	$('body').addClass('modal-open');
	var options = {};
	options.url = SiteName + "/Api/CountryPlaces";
	options.type = "POST";
	options.contentType = "application/json";
	options.data = JSON.stringify(id);
	options.dataType = "json";
	options.success = function (data) {
		let mockup = "";

		data.map(function (city) {
			mockup += `<li>
                          <a href="/europe/${city.CityName.replaceAll(' ', '_').toLowerCase()}/vacations">${city.CityName}</a>
                      </li>`
        })

		$('.cities__modal-list').html(mockup);
	};
	options.error = function (xhr, desc, exceptionobj) {
		alert(xhr.responseText);
	};
	$.ajax(options);
}
function closeAllCities() {
	$('#cities_modal').addClass('is-hidden');
	$('body').removeClass('modal-open');
};
// ---------------------------------
//  **** OBSERVER ****
// ---------------------------------
//  Activate event on scroll
// ---------------------------------

(function () {
	// The function will be triggered only when the DOM is ready to not make the ajax request witout the payload
	document.addEventListener("DOMContentLoaded", function () {
		// Function to be triggered when the top selling packages review is visible
		let isVisible = false;
		function onTopSellPacksVisible(entries, observer) {

			entries.forEach(entry => {
				if (entry.isIntersecting && !isVisible) {
					isVisible = true;
					// Trigger your desired function here
					getTop3Feedbacks(placeID);
					observer.unobserve(entry.target);
				}
			});
		}
		// Create the observer
		const observer = new IntersectionObserver(onTopSellPacksVisible, {
			root: null,       // Observe the viewport
			threshold: 0.1    // Trigger when at least 10% of the footer is visible
		});

		// Observe the review element
		const review = document.querySelector('#customerReviews');
		observer.observe(review);
	});
})();

async function getTop1Feedback(packId) {
	const url = `${SiteName}/Api/Packages/Top1FeedbackByPackId/${packId}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json;charset=utf-8' }
		});

		if (response.status === 204) {
			//No feedback found
			return;
		}

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText);
		}

		const data = await response.json();

		// No data
		if (!data) return;


		//Creating markup
		const markup = renderFeedback(data);
		$('#bestPackagesTopFeedback').html(markup);
		$('.best-packages__reviews').show();

	} catch (error) {
		console.error('API Top1FeedbackByPackId: Request failed', error.message);
	}
}

async function getTop3Feedbacks(countryId) {
	const url = `${SiteName}/Api/Top3FeedbackByCounId/${countryId}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json;charset=utf-8' }
		});

		if (response.status === 204) {
			//No feedback found
			return;
		}

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText);
		}

		const data = await response.json();

		// No data
		if (!data) return;

		//Creating markup
		let markup = "";
		data.forEach(function (item) {
			markup += `<li class="customer-reviews__item">${renderFeedback(item)}</li>`
		})
	    $('#dReview').html(markup);

	} catch (error) {
		console.error('API Top1FeedbackByPackId: Request failed', error.message);
	}
};

function renderFeedback(data) {
	const date = new Date(data.dep_date).toLocaleDateString('en-US');
	const markup = `
	    <div>
            <div class="customer-reviews__wrapper">
                <span class="customer-reviews__stars" style="--rating: ${data.pcc_overallscore}"></span>
                <div class="customer-reviews__score">${data.pcc_overallscore} out of 5</div>
            </div>
            <p class="customer-reviews__text">${data.pcC_Comment}</p>
	    </div>
        <span class="customer-reviews__date">Traveled on: ${date}</span>   
    `;

	return markup;
}