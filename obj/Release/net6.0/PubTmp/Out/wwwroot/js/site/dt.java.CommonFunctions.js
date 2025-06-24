// JavaScript Document
var img500 = /-500.jpg|_500.jpg|500.jpg/g;
var isNumber = /[0-9]+/g;
var itisMobile = false;
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();
(function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) itisMobile = true;
})(navigator.userAgent || navigator.vendor || window.opera);

// --- DISTANCE BETWEEN POINTS --- //
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
};
function deg2rad(deg) {
    return deg * (Math.PI / 180)
};
function ObjectPosition(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    };
    return [curleft, curtop];
};
function showPopUp(popID) {
    var mess
    var objLoc
    var objT
    var objL
    var dvMess
    objLoc = ObjectPosition(document.getElementById(popID));
    objL = objLoc[0] - 5 + 'px';
    objT = objLoc[1] + 16 + 'px';
    if (popID.indexOf('Partially') != -1) {
        mess = '<div style="padding:0px 0px 7px 0px;"><b>Partially Guided:</b></div>'
        mess = mess + '<div>' + $('#inpparGuided').val().replace('.', '.<br><br>') + '</div>';
    }
    else if (popID.indexOf('none') != -1) {
        mess = '<div style="padding:0px 0px 7px 0px;"><b>None:</b></div>'
        mess = mess + '<div>has no value</div>';
    }
    else {
        mess = '<div style="padding:0px 0px 7px 0px;"><b>Guided:</b></div>'
        mess = mess + '<div>' + $('#inpGuided').val().replace('.', '.<br><br>') + '</div>';
    };
    dvMpop = $('<div id="dvMess" class="Text_12_Blue"></div>');
    $('body').append(dvMpop);
    $('#dvMess').html(mess);
    $('#dvMess').attr('style', 'left:' + objL + '; top:' + objT + '; position:absolute; display:block; border:solid 1px black; width:300px; padding:10px; background-color:#FFF;')
    $('#dvMess').show();
};
function hidePopUp(popID) {
    $('#dvMess').hide();
};
function MM_findObj(n, d) { //v4.01
    var p, i, x; if (!d) d = document; if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document; n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) x = d.all[n]; for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) x = d.getElementById(n); return x;
};
function MM_swapImage() { //v3.0
    var i, j = 0, x, a = MM_swapImage.arguments; document.MM_sr = new Array; for (i = 0; i < (a.length - 2) ; i += 3)
        if ((x = MM_findObj(a[i])) != null) { document.MM_sr[j++] = x; if (!x.oSrc) x.oSrc = x.src; x.src = a[i + 2]; }
}
function MM_swapImgRestore() { //v3.0
    var i, x, a = document.MM_sr; for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
};
function MM_preloadImages() { //v3.0
    var d = document; if (d.images) {
        if (!d.MM_p) d.MM_p = new Array();
        var i, j = d.MM_p.length, a = MM_preloadImages.arguments; for (i = 0; i < a.length; i++)
            if (a[i].indexOf("#") != 0) { d.MM_p[j] = new Image; d.MM_p[j++].src = a[i]; }
    }
}
function MM_openBrWindow(theURL, winName, features) { //v2.0
    window.open(theURL, winName, features);
};
function IsMobileDevice() {
    if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
         || navigator.userAgent.match(/Windows mobile/i)
         || navigator.userAgent.match(/IEMobile/i)
         || navigator.userAgent.match(/Opera Mini/i)) {
        return true;
    }
    else {
        return false;
    };
};
// ** SCRATCHPAD ** in document.ready execute functions to take new ut cookie values
var utSiteNAparts;
var utSiteNA;
var utValues;
var utVisitorID;
var utMess;
var utVisTotal = 0;
var cookVisTot = 0;
var utVisCookStr = '';
// ** to obtein ut Visitor ID from ut engine
$(document).ready(function () {

    utSiteNAparts = _utInputString.split('@@');
    utSiteNA = utSiteNAparts[0];
    console.log(utSiteNAparts + " | " + utSiteNA + " | " + Cookies.get('ut2'));
    if (Cookies.get('ut2') != undefined) {
        var vp = Cookies.get('ut2').split('&');
        var vpi;
        if (vp[0].indexOf('_utvId') > -1) {
            vpi = vp[0].split('=');
            utVisitorID = vpi[1];
        };
        setTimeout("utUpdated()", 10000);
    }
    else {

        _ut2Functions.push(function () {
            utValues = _ut2;
            jQuery.each(utValues, function (i, val) {
                if (i == '_utvId') { utVisitorID = val; };
            });
            setTimeout("utUpdated()", 10000);
        });
    };
    if (Cookies.get('utTotal') != undefined) {
        $('#spVisTot').html("[" + Cookies.get('utTotal') + "]");
        $('.dvRecentlyTitle').length > 0 ? $('.dvRecentlyTitle').find("span").html("[" + Cookies.get('utTotal') + "]") : "";
        cookVisTot = Cookies.set('utTotal');
    };
	//alert(userHomeTown);
    //userHomeTown != 'none' ? checkCalendar() : ''; //alert('it is none..!!!');  
    console.log("location.protocol = " + location.protocol);

    $('#q').autocomplete({
        minLength: 3,
        select: function (event, ui) {
            $('#q').val(ui.item.value);
            searchGO(ui.item.label);
        },
        source: function (request, response) {
            var q = { Id: request.term };
            $.ajax({
                url: SiteName + "/Api/AWS_Suggestions",
                type: "POST",
                data: JSON.stringify(q),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    response($.map(data, function (m) {
                        return {
                            label: m,
                            value: m.substring(0, m.indexOf("##"))
                        }
                    }))
                },
                error: function (xhr, desc, exceptionobj) {
                    alert(xhr.responseText + ' = error');
                }
            });
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var suggParts = item.label.split('##');
        if (suggParts[1].indexOf("inCt") != -1) {
            var $a = $("<a></a>").html('<span>All ' + suggParts[0] + ' packages (</span><span style="color:orange;font-weight:bold;">city</span>)');
            return $("<li></li>").append($a).appendTo(ul);
        }
        if (suggParts[1].indexOf("inCo") != -1) {
            var $a = $("<a></a>").html('<span>All ' + suggParts[0] + ' packages (</span><span style="color:orange;font-weight:bold;">country</span>)');
            return $("<li></li>").append($a).appendTo(ul);
        }
        if (suggParts[1].indexOf("Sp") != -1) {
            var $a = $("<hr/>").css({ "border": "0", "height": "1px", "background-color": "lightgray" });
            return $('<li style="pointer-events:none;border:0;outline:none;padding:5px;margin:0px;width:95%!important;"></li>').append($a).appendTo(ul);
        }
        var $a = $('<a></a>').text(suggParts[0]).attr("href", "https://" + suggParts[3].toLowerCase() + "?iSrc1=Header");
        highlightText(this.term, $a);
        return $("<li></li>").append($a).appendTo(ul);
    };
});
// ** update number of visits to include the actual visited page under this visitor ID.
function utUpdated() {
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/VisitHistoryXunitraq",
        data: JSON.stringify({ utUserID: utVisitorID }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            utMess = data;
            utVisTotal = utMess.length;
            setVisitViw();
        },
        error: function (xhr, desc, exceptionobj) {
            console.log('Error = ' + xhr.responseText);
        }
    });
};
function setVisitViw() {
    if (utVisTotal > cookVisTot) {
        $('#spVisTot').html("[" + utVisTotal + "]");
        $('.dvRecentlyTitle').length > 0 ? $('.dvRecentlyTitle').find("span").html("[" + utVisTotal + "]") : "";
        Cookies.set('utTotal', utVisTotal, { expires: 1 });
    };
};
function checkImg(div, src, err) {
    var image = new Image();
    image.onload = function () {
        $('#' + div + '').html('<img src="' + src + '"/>');
    };
    image.onerror = function () {
        $('#' + div + '').html('<img src="' + err + '"/>');
    };
    image.src = src;
};
function checkSpotImg(div,src,err){
	var image = new Image();
    image.onload = function () {
        $('#' + div + '').html('<img src="' + src + '"/>');
    };
    image.onerror = function () {
        $('#' + div + '').html('<span class="spselect">' + err + '</span>');
    };
    image.src = src;
};
jQuery.fn.center = function () {
    this.css("position", "fixed");
    this.css("top", "20px");
    this.css("left", "50%");
    this.css("transform", "translateX(-50%)");
    return this;
};
/* COOKIE FUNCTIONS */
function setCookie(c_name,value,expiredays){
 	var exdate=new Date();
	exdate.setTime(exdate.getTime()+(expiredays*24*60*60*1000));
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());	
};
function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
	  	if (c_start!=-1){ 
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1){
				c_end=document.cookie.length
			};
			return unescape(document.cookie.substring(c_start,c_end))
		}; 
	};
	return null
};
/*
txtLeavingFrom - idLeavingFrom  [ TMAS Home Page ]
qLeaveNA - qLeaveID [ TMAS Country T4 ]
sDepCity - iDepCity / iRetCity [ TMAS T21 ]
xtxtLeavingFrom - xIDLeavingFrom [ TMAS PKBYO ]
xtxtReturningTo - xIDReturningTo
sDepCity - iDepCity / iRetCity [ TMAS Hotel Pge ]
*/
function checkCalendar(){
    var rgx = $('input').filter(function () { return this.id.match(/idLeavingFrom|qLeaveID|iDepCity|iDepCityTxt|xIDLeavingFrom/g )}).attr('id');
	var town = userHomeTown.split('|');
	switch(rgx){
		case 'idLeavingFrom':
			$('#txtLeavingFrom').val(town[1]);
			$('#idLeavingFrom').val(town[0]);
		break;
		case 'qLeaveID':
			$('#qLeaveNA').val(town[1]);
			$('#qLeaveID').val(town[0]);
		break;	
		case 'iDepCity':
            if ($('#iDepCity').val().trim() == "" || $('#iDepCity').val().trim() == "-1") {
                $('#sDepCity').attr("value", town[1]);
                $('#iDepCity').val(town[0]);
                $('#iDepCityTxtMob').attr("value", town[1]);
                $('#iDepCityMob').val(town[0]);
            }
			if($('#qLeaveID').length > 0){
				$('#qLeaveNA').val(town[1]);
				$('#qLeaveID').val(town[0]);
			}
		break;		
		case 'xIDLeavingFrom':
			$('#xtxtLeavingFrom').val(town[1]);
			$('#xIDLeavingFrom').val(town[0]);
			$('#xtxtReturningTo').val(town[1]);
			$('#xIDReturningTo').val(town[0]);
        break; 	
        case 'iDepCityTxt':
            $('#iDepCityTxt').val(town[1]);
            $('#iDepCity').val(town[0]);
            $('#iRetCity').val(town[0]);
        break;
	};
};
function highlightText(text, $node) {
    var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
    while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
        newTextNode = currentNode.splitText(matchIndex);
        currentNode = newTextNode.splitText(searchText.length);
        newSpanNode = document.createElement("span");
        newSpanNode.className = "highlight boldText";
        currentNode.parentNode.insertBefore(newSpanNode, currentNode);
        newSpanNode.appendChild(newTextNode);
    };
};
// --- BUSINESS DAY *** ///
function getBusinessDateObj(businessDays) {
  var now = new Date();
  now.setTime(now.getTime() - 0 * 24 * 60 * 60 * 1000);
  var dayOfTheWeek = now.getDay();
  var calendarDays = businessDays;
  var bookDay = dayOfTheWeek + businessDays;
  if (bookDay >= 6) {
    businessDays -= 6 - dayOfTheWeek;  //deduct this-week days
	calendarDays += 2;  //count this coming weekend
	bookWeeks = Math.floor(businessDays / 5); //how many whole weeks?
	calendarDays += bookWeeks * 2;  //two days per weekend per week
  }
  now.setTime(now.getTime() + calendarDays * 24 * 60 * 60 * 1000);
  return now;
};
// --- String TO DAte *** //
function stringToDate(_date,_format,_delimiter){
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
};
function openWinCMS(cmsid, jhref) {
    centerWindow(jhref);
    return false;
};
// Search functionality //
function highlightText(text, $node) {
    var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
    while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
        newTextNode = currentNode.splitText(matchIndex);
        currentNode = newTextNode.splitText(searchText.length);
        newSpanNode = document.createElement("span");
        newSpanNode.className = "highlight boldText";
        currentNode.parentNode.insertBefore(newSpanNode, currentNode);
        newSpanNode.appendChild(newTextNode);
    };
};
function searchGO(label) {
    if (label.indexOf("##P##") != -1) {
    } else {
        var q = $('#q').val().replace(/-/g, '').replace(/_/g, '');
        q == undefined || q == "" ? q = $('#qm').val().replace(/-/g, '').replace(/_/g, '') : '';
        var qurl = '/search?q=' + q.replace(/ /g, '_');
        //('https:' === document.location.protocol ? 'https://' : 'http://') + 'www.tripmasters.com/Search.aspx?q=' + q;
        //$('#frmSearch').attr('action', qurl);
        //$('#frmSearch').submit();
        location.href = qurl;
    }
}
function replaceSeoNoOfItems(plcId) {
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/NoOfSEOItinByPlaceID",
        data: JSON.stringify({ Id: plcId }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var sdata = data;
            $('.DownButtons-allPacks').text("Browse all " + sdata + " customizable packagesdata");
            $('.browseAllPacks').text("Browse all " + sdata + " customizable packagesdata");
        },
        fail: function (sender, message, details) {
            console.log("something wrong: " + sender + " | " + message + " | " + details);
        },
        error: function (xhr, desc, exceptionobj) {
            console.log("something wrong: " + xhr.responseJSON + " | " + desc + " | " + exceptionobj);
        }
    });
}
