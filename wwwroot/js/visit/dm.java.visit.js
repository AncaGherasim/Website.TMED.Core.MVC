$(document).ready(function () {
    replaceSeoNoOfItems($('#placeID').val());

	$('button[id*="readMore"]').click(function () {
		const num = this.id.replace('readMore', '');
		const value = $('#readMore' + num + ' span:nth-child(1)').text();

		$('#readMore' + num + ' span:nth-child(1)').text(value === 'Read more' ? 'Read less' : 'Read more');

		if (value === 'Read more') {
			$('#textMore' + num + ' p').css("height", "100%");
			var h = $('#textMore' + num + ' p').height();
			$('#textMore' + num + ' p').css("height", "85px");
			$('#textMore' + num + ' p').animate({ height: h }, 800);
			$('#textMore' + num + ' button span:nth-child(2)').attr('style', 'transform: scaleY(0.6) rotate(0)');
			$('#textMore' + num + ' p').css("color", "#000");
		}
		else {
			$('#textMore' + num + ' p').animate({ height: '85px' }, 800);
			$('#textMore' + num + ' button span:nth-child(2)').attr('style', 'transform: scaleY(0.6) rotate(180deg)');
			$('#textMore' + num + ' p').css("color", "#999999");
		}
	})
	$(".buttonViewMore").click(function () {
		var thisID = this.id;
		var parentSec = thisID == "HalfPackImages" ? "template-HalfPackImages" : thisID == "SmallPackImages" ? "template-SmallPackImages" : "";
		$("." + parentSec + " .li-Hide").length > 0 ?
			($("." + parentSec + " .li-Hide").slideDown().toggleClass('li-Hide li-Show').removeAttr('style'), $("#" + thisID + "").text($("#" + thisID + "").text().replace("View", "Close"))) :
			($("." + parentSec + " .li-Show").slideUp().toggleClass('li-Show li-Hide').removeAttr('style'), $("#" + thisID + "").text($("#" + thisID + "").text().replace("Close", "View")));
	});
});

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
			if (msg !== '') {
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
function findPackst4(formID) {
	if ($('#' + formID + ' #allID').val() != '') {
		$('#' + formID + ' #allID').val('')
	}
	if ($('#' + formID + ' #allNA').val() != '') {
		$('#' + formID + ' #allNA').val('')
	}
	var idForm = formID
	var idString = $('#' + idForm + '').serialize();;
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