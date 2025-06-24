// JavaScript Document
let ctyID;
const infoPOIWindows = [];
$(document).ready(function () {
	ctyID = $('#plcID').val();
	if ($('#dvPoiMap').length > 0) {
		$('#dvPoiMap').click(function () {
			getMapPoiData(ctyID);
		});

		$('.modal__close').click(function () {
			$('body').removeClass('modal-pack-info-open');
			$('#modal').addClass('is-hidden');
		});
	};
	$('#moreButtonExpl').click(function () {
		$('#dvEachHideExpl').is(':visible') === false ?
			($('#moreButtonExpl span').html('Close All '), $('#dvEachHideExpl').slideDown())
			: ($('#moreButtonExpl span').html('See All '), $('#dvEachHideExpl').slideUp());
	});
	$('#moreButtonReg').click(function () {
		$('#dvEachHideReg').is(':visible') === false ?
			($('#moreButtonReg span').html('Close All '), $('#dvEachHideReg').slideDown())
			: ($('#moreButtonReg span').html('See All '), $('#dvEachHideReg').slideUp());
	});
	$('#moreButtonMr').click(function () {
		$('#dvEachHideMr').is(':visible') === false ?
			($('#moreButtonMr span').html('Close All '), $('#dvEachHideMr').slideDown())
			: ($('#moreButtonMr span').html('See All '), $('#dvEachHideMr').slideUp());
	});
	$("#moreCities").click(function () {
		$('#dvmoreCities').removeClass('is-hidden');
	});
	$("#closeMoreCity").click(function () {
		$('#dvmoreCities').addClass('is-hidden');
	});

});

function toggleClassMoreDetails(packId) {
	$('body').toggleClass('modal-pack-info-open');
	$('#fti-' + packId + '-modal').toggleClass('is-hidden');
}
var goTo = 0;
function otherMoreDetails(objid, cls) {
	switch (cls) {
		case 2:
			goTo = -1;
			break;
	}
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

	cls === 1 ? relPackCall(objid) : '';
}
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
					relTxt = relTxt + '<u>' + echP[0] + ' (' + echP[1] + ')</u>'
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
			if (objPOI.length) {
				var LL = 0;
				jQuery.each(objPOI, function (data) {
					cylat.push(Number(this.poI_Latitude))
					cylon.push(Number(this.poI_Longitude))
					LL++;
				});
				var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
				var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
				delete distLats;
				distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
				delete ctyLatLong;
				ctyLatLong = Number(midLat) + '|' + Number(midLon);
				preBuildMap(data);
			}
        },
        error: function (xhr, desc, exceptionobj) {
            $('#dvGoogleMap').html(xhr.responseText);
        }
    });
}
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
        var locLat = this.poI_Latitude;
        var locLong = this.poI_Longitude;
        var iconImg = 'MapMarker_Ball__Orange_40.gif';
        var poiAnchor = new google.maps.Point(4, 25)

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            labelAnchor: poiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 1 },
            title: this.poI_Title,
            zIndex: 8998
        });
        var message = '<div class="dvBublleStyle">';
        if (this.poI_PictureURL != 'none') {
            message = message + '<img src="' + this.poI_PictureURL + '" align="left"/>';
        }
        message = message + '<div>' + this.poI_Title + '</div>';
        if (this.poI_Description != 'none') {
            message = message + this.poI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); }); 
        infoPOIWindows.push(infoWind);

        var sname = this.poI_Title;
        var infoSTitle = new google.maps.InfoWindow({ content: sname, size: new google.maps.Size(20, 20) });
        google.maps.event.addListener(marker, 'mouseover', function () { infoSTitle.open(map, marker); });
        google.maps.event.addListener(marker, 'mouseout', function () { infoSTitle.close(map, marker); });
    });
};

function preBuildMap(data) {
	$('body').addClass('modal-pack-info-open');
	$('#modal').removeClass('is-hidden');
    buildMapPoi(data);
};
function closePoiInfoW(mp, mrk, winfo) {
    for (var i = 0; i < infoPOIWindows.length; i++) {
        infoPOIWindows[i].close();
    };
    winfo.open(mp, mrk);
};
function openWinCMS(cmsid, jhref) {
	centerWindow(jhref);
	return false;
};