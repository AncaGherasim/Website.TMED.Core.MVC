// JavaScript Document
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
function jShow(obj) {

	var aryPosition = ObjectPosition(document.getElementById(obj));
	document.getElementById("divPics").style.left = aryPosition[0] + 140 + "px";
	document.getElementById("divPics").style.top = aryPosition[1] - 205 + "px";
	document.getElementById("divPics").style.display = "block";
}
function jHide() {
	document.getElementById("divPics").style.display = "none";
	$('#content').html();
}
function showPics(obj, shipNa, imag) {
	$('#content').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50">');
	jShow(obj)

	var a = obj.toString();
	var b = shipNa.toString();
	var c = imag.toString();
	var data = { Name: a, Ship: b, Imag0: c };
	var options = {};
	options.url = SiteName + "/ImagForProducts";
	options.type = "POST";
	options.contentType = "application/json; charset=utf-8";
	options.data = JSON.stringify(data);
	options.dataType = "html";
	options.success = function (html) {
		processResponse(html)
	};
	options.error = function (xhr, desc, exceptionobj) {
		$('#content').html(xhr.responseText);
	};
	$.ajax(options);
}
function processResponse(result) {
	if (window.ActiveXObject) {
		$('#content').html(result);
	}
	else if (document.implementation && document.implementation.createDocument) {
		$('#content').html(result);
	}
	else {
		alert('Your browser cannot handle this script');
	}
}
/* ************ PICTURES FUNCTIONS ************* */
function fixward(idNum, totP, imgPath) {
	i = 0
	do {
		picM = 'IDpic' + i
		if (picM != idNum) {
			eval("document.all[picM].className=''");
		}
		else {
			eval("document.all[idNum].className = 'BG_red'");
			document.images.pictureshow.src = "https://pictures.tripmasters.com" + imgPath.toLowerCase();
		}
		i++
	}
	while (i < totP + 1)
}
/* ************ OVERVIEW FUNCTIONS ************* */
function showOverview(id, imgSrc) {
	var imgP = ""
	imgP = imgSrc.indexOf("Plus");
	if (imgP > 0) {
		$('#shipOverview' + id + '').show();
		eval("document.images.plusMinus" + id + ".src = 'https://pictures.tripmasters.com/siteassets/d/minus.jpg'");
	}
	else {
		$('#shipOverview' + id + '').hide();
		eval("document.images.plusMinus" + id + ".src = 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg'");
	}
}
/* ************ PACK INFO FUNCTIONS ************* */
function openInfo(ID, picSrc, pID, pgType, itype) {
	var picType = ""
	var divHandle = "divv" + ID
	var picChange
	if (itype != undefined) {
		divHandle = itype + "divv" + ID
	}
	if (picSrc == '') {
		picSrc = eval("document.images.pic" + ID + ".src")
		if (itype != undefined) {
			picSrc = eval("document.images.pic" + ID + ".src")
		}
	}
	picType = picSrc.indexOf("Plus");
	picChange = document.getElementById("pic" + ID);
	if (itype != undefined) {
		picChange = document.getElementById("pic" + ID);
	}

	if (picType > 0) {
		picChange.src = 'https://pictures.tripmasters.com/siteassets/d/Minus.jpg'
		$('#' + divHandle + '').show();
		$('#' + divHandle + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50">');

		var a = ID.toString();
		var b = pID.toString();
		var c = pgType.toString();
		var data = { PackID: a, PlaceID: b, PgType: c };
		var options = {};
		options.url = SiteName + "/CruiseInfo";
		options.type = "POST";
		options.contentType = "application/json; charset=utf-8";
		options.data = JSON.stringify(data);
		options.dataType = "html";
		options.success = function (html) {
			$('#' + divHandle + '').html(html)
		};
		options.error = function (xhr, desc, exceptionobj) {
			$('#' + divHandle + '').html(xhr.responseText)
		};
		$.ajax(options);
	}
	else {
		picChange.src = 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg'
		$('#' + divHandle + '').hide();
		$('#' + divHandle + '').html();
	}
}
function changeTab(tab, tot) {
	var dv = 1
	var tb = tab
	do {
		if (tab == 'tab' + dv) {
			$('#content' + dv + '').show();
		}
		else {
			$('#content' + dv + '').hide();
		}

		dv += 1
	}
	while (dv <= 4)
}
function moreOpt(idDiv) {
	$('#' + idDiv + '').show();
	$('#' + 'l' + idDiv + '').hide();
}

$(document).ready(function () {
	$('a[href*="https://pictures.tripmasters.com"]').each(function () {
		$(this).click(function () {
			$('#divPics').show();
			var pos = $(this).offset();
			$('#divPics').css({ left: pos.left + 180 + 'px', top: pos.top - 500 + 'px' });
			$("#divPics").addClass("divPopUp");
			$('#content').removeAttr('style');
			$('#content').css('margin', '15px');
			var msg = '<a href="#" onClick="jHide()" style="float:right;cursor:pointer;margin-right:10px;margin-bottom:10px">Close</a><br/>';
			msg = msg + '<img src="' + this + '"/>';
			$("#content").html(msg);
			return false;
		});
	});
});
