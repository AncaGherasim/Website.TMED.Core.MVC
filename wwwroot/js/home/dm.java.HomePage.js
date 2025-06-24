let isShowSugg = false;
$(document).ready(function () {
	/*  ****  utm Campaign  *** */
	var cookMark = Cookies.get('utm_campaign');
	var cookMkVal;

	if (Cookies.get('ut2') != undefined) {
		var vstIDs = Cookies.get('ut2').split('&');
		var vstID = vstIDs[0].split('=');
		visitID = vstID[1];
	}
	else {
		_ut2Functions.push(function () {
			utValues = _ut2;
			jQuery.each(utValues, function (i, val) {
				if (i == '_utvId') { visitID = val; };
			});
		});
	};	
    $('#btnMore').click(function () {
        $('#toHide').is(':visible') === false ?
            ($(this).html('Close More'), $('#toHide').slideDown())
            : ($(this).html('Show More'), $('#toHide').slideUp());
    });
    $('#seeAllImg').click(function () {
        buildPics();
	});
	$('#imgForw').click(nextPicture);
	$('#imgBack').click(prevPicture);
	$('.img-modal__close, .img-modal__title').click(moreMediaClose);
	$('#seeMoreSuggested').click(function () { moreSuggestPacks() });
});
const swiper1 = new Swiper('.mySwiper1', {
	speed: 400,
	spaceBetween: 100,
	navigation: {
		nextEl: '.swiper-button-next1',
		prevEl: '.swiper-button-prev1',
	},
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 0
		},
		// when window width is >= 640px
		768: {
			slidesPerView: 3,
			spaceBetween: 24
		}
	}
});
const swiper2 = new Swiper('.mySwiper2', {
	speed: 400,
	spaceBetween: 100,
	navigation: {
		nextEl: '.swiper-button-next2',
		prevEl: '.swiper-button-prev2',
	},
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 0
		},
		// when window width is >= 640px
		768: {
			slidesPerView: 3,
			spaceBetween: 24
		}
	}
});
const swiper3 = new Swiper('.mySwiper3', {
	speed: 400,
	spaceBetween: 100,
	navigation: {
		nextEl: '.swiper-button-next3',
		prevEl: '.swiper-button-prev3',
	},
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1,
			spaceBetween: 0
		},
		// when window width is >= 640px
		768: {
			slidesPerView: 3,
			spaceBetween: 24
		}
	}
});
function buildPics() {
	var packID = $('#imgItemID').val();
	$('#dvmediaPopUp').removeClass('is-hidden');
	$('body').addClass('modal-open');
	$.ajax({
		type: "GET",
		url: SiteName + "/Api/Packages/PicsForPacks/" + packID,
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
function moreMediaClose() {
	$('#dvmediaPopUp').addClass('is-hidden');
	$('body').removeClass('modal-open');
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
				relTxt = '<div  style="padding:5px 3px;font-weight: 600;">Related Package</div><div style="padding:2px 2px;" align="left">'
				mrChoice = '<div style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
				strPrts = msg.split('@');
				for (i = 0; i <= strPrts.length - 1; i++) {
					echP = strPrts[i].split('|');
					relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
					relTxt = relTxt + '<a href="' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
					relTxt = relTxt + '<span>'
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
function moreSuggestPacks() {
	if (isShowSugg === false) {
		isShowSugg = true;
		$('.suggested__hide-item').slideDown();
		$('.suggested__button-text').text('Close More Vacation Packages');
		$('.suggested__button-arrow').css({"transform": 'rotate(-90deg)', 'right': '15px'})
	} else {
		isShowSugg = false;
		$('.suggested__hide-item').slideUp();
		$('.suggested__button-text').text('See More Vacation Packages');
		$('.suggested__button-arrow').css({ "transform": 'rotate(90deg)', 'right': '10px' })
    }
};