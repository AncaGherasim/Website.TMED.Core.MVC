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
	//alert(obj)
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
	//$.ajax({
	//	url: "/europe/A_Get_ImagForProducts.aspx",
	//	data: "name=" + obj + "&ship=" + shipNa + "&imag0=" + imag + "",
	//	type: "GET",
	//	success: function (html) {
	//		//alert(html)
	//		processResponse(html)
	//	},
	//	error: function (xhr, desc, exceptionobj) {
	//		$('#content').html(xhr.responseText);
	//		alert(xhr.responseText + ' = error');
	//	}
	//});
	//alert("que pasa")
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
	//alert(idNum +' | '+ totP)
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
	//shipOverview<
	var imgP = ""
	//alert(imgSrc)
	imgP = imgSrc.indexOf("Plus");
	//alert(imgP)
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
//openInfo(" & prodID & ",this.src)
//divv" & prodID & "
//<img src="' + dirFolder + 'images/ajax-loader.gif" width="50" height="50">
//url = '/A_Get_PackInfo.aspx?PackID='+ packID +'&placeID='+ feedPlaceID +'&PlaceURL=Country'
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
		//eval("document.images.pic"+ ID +".src = '/images/Minus.jpg'");
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


	//	$.ajax({
	//		url: SiteName + "/CruiseInfo",
	//		data: JSON.stringify({ PackID: ID.toString(), PlaceID: pID.toString(), PgType: pgType.toString() }),
	//		type: "GET",
	//		success: function (html) {
	//			//alert(html)
	//			//processResponse (html)
	//			$('#' + divHandle + '').html(html)
	//		},
	//		error: function (xhr, desc, exceptionobj) {
	//			//$('#content').html(xhr.responseText);
	//			$('#' + divHandle + '').html(xhr.responseText)
	//			//alert(xhr.responseText +' = error');
	//		}
	//	});
	}
	else {
		//eval("document.images.pic"+ ID +".src = '/images/Plus.jpg'");
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

	/*switch (tab){
	case 'tabOv':
		$('#Overview').show();
		document.getElementById('Over').style.display='block';
		document.getElementById('tabB').className='TabActive_B';
		document.getElementById('bodyF').style.display='none';
		document.getElementById('tabF').className='TabOut_F';
	break;
	case 'tabIt':
		document.getElementById('bodyF').style.display='block';
		document.getElementById('tabF').className='TabActive_F';
		document.getElementById('bodyB').style.display='none';
		document.getElementById('tabB').className='TabOut_B';
	
	break;
	case 'tabSh':
	
	break;
	case 'tabDp':
	
	break;
	
	}*/
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
