var ctyID;
var infoPOIWindows = [];
$(document).ready(function() {
    // check for what is/isn't already checked and match it on the fake ones
    $("input:checkbox").each(function() {
        (this.checked) ? $("#false" + this.id).addClass('falsechecked_1') : $("#false" + this.id).removeClass('falsechecked_1');
    });
    // function to 'check' the fake ones and their matching checkboxes
    $(".falsecheck_1").click(function() {
        ($(this).hasClass('falsechecked_1')) ? $(this).removeClass('falsechecked_1') : $(this).addClass('falsechecked_1');
        $(this.hash).trigger("click");
        return false;
    });

    var typeId;
    var typeTxt;
    $('div[id^="Type"]').hover(function() {
        typeId = $(this).attr('id');
        typeTxt = $.trim($('#' + typeId).text());
        if (typeTxt.length >= 28) {
            $('#falsedot' + typeId).text(typeTxt.substr(0, 26) + "..");
        }
        $(this).css({ "background-color": "#E9EEF8", "border-radius": "3px" });
        var typeId_ = "'" + typeId + "'";
        $(this).append('<span style="position:relative; float:right; top:-21px; right:13px; color:#6C8BC6;text-decoration:underline;cursor:pointer;" onclick="setCheckboxOnly(' + typeId_ + ')"> only </span>');
    },
    function() {
        $(this).css("background-color", "");
        $(this).find("span:last").remove();
        $('#falsedot' + typeId).text(typeTxt);
    });

    $('a[id^="falsedotType"]').click(function() { GetCitySSData(); });
    $('.ResetFilter').click(function() {
        $('a[id^="falsedotType"]').removeClass().addClass('falsecheck_1').addClass('falsechecked_1');
        $('input[type="checkbox"][id^="dotType"]').prop("checked", true);
        GetCitySSData();
    });

    $('#falseshowFav').click(function() { GetCitySSData(); });
    $('input[type="radio"][name="orderValue"]').click(function() { GetCitySSData(); });

    ctyID = $('#cityId').val();
    if ($('#dvPoiMap').length > 0) {
        $('#dvPoiMap, #dvPoiLink').click(function() {
            getMapPoiData(ctyID);
        });
        $('.dvmapClose').click(function() { $('#dvShowMap').hide(); });
    };

    $('input:text[id^="tourName"]').click(function() {
        var isiPad = navigator.userAgent.match(/iPad/i) != null
        if (isiPad = true) {
            this.value = '';
        }
        this.focus();
        this.select();
    });

    $('#tourName').focusout(function() {
        if ($(this).val() == '') {
            $(this).val('Type word');
        }
    });
    $('#tourName').keypress(function(event) {
        if (event.keyCode == 13) {
            var name = $('#tourName').val();
            if (name == '' || name == 'Type word') {
                messg = '<ol><li>Please insert an activity name!</li></ol><span></span>';
                popError('tourName', messg);
                return;
            } else
                GetCitySSData();
        }
    });
    $('input[type="button"][name="Go"]').click(function() {
        var name = $('#tourName').val();
        if (name == '' || name == 'Type word') {
            messg = '<ol><li>Please insert an activity name!</li></ol><span></span>';
            popError('tourName', messg);
            return;
        }
        GetCitySSData();
    });

    GetCitySSData();
});
function setCheckboxOnly(Id) {
	if (Id == "TypeFavorite"){
		 $('#falseshowFav').trigger( "click" );
	}
	else{
		$('a[id^="falsedot"]').removeClass().addClass("falsecheck_1");
    	$('input[id^="dot"]').prop("checked", false);
		$('#falsedot' + Id).addClass('falsechecked_1');
		$('#dot' + Id).prop("checked", true);
		GetCitySSData();
	};
};
function BuildFilterExpression() {
    var filter = ''
    var typeFilter = ''
    $('input[type="checkbox"][id^="dotType"]:checked').each(function() {
        typeFilter = typeFilter + $(this).val() + 'T'
    });
    var favFilter = ''
    if ($('#showFav').is(":checked")) {
        favFilter = '1';
    } else {
        favFilter = '0';
    };

    var ssName = $('#tourName').val();
    if (ssName == 'Type word')
        ssName = 'none';

    var orderVal = $('input[name="orderValue"]:checked').val();
    if (typeFilter == '') typeFilter = '999999T'
    filter = typeFilter + '|' + favFilter + '|' + ssName + '|' + orderVal;

    return filter;
};
function GetCitySSData(){
    $('#dvResp').hide();
    $('#dvResp').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    var filter = BuildFilterExpression();
    var ids_ = $('#SSIds').val();    
    if (ids_.trim() != '') {        
        var options = {};
        options.url = SiteName + "/Api/CitySSData";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = '{"SSFilter":"' + filter + '", "Ids":"' + ids_ + '"}',
        options.dataType = "text";
        options.success = function (data) {
            msg = data.substr(1, data.length - 2);
            var msgParts = msg.split('@');
            $('#SSIdsPages').val(msgParts[0]);
            $('#spanTotalSS').html('(' + msgParts[1] + ' total)');
            $('#totalSS').val(msgParts[1]);
            OpenPage(1);
       };
        options.error = function (xhr, desc, exceptionobj) {
                $('#dvResp').html(xhr.responseText);
                $('#dvWait').html('');
                $('#dvWait').hide();
                $('#dvResp').show();
        };
        $.ajax(options);
    }
    else {
        $('#dvResp').html('<div style="margin:20px 20px 0px 20px;font-size:14px;color:#19255f;">0 activities found. Please try other combination.</div>')
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvResp').show();
        SetPages(0);
        $('#header').css("visibility", "visible");
    }
};
function OpenPage(currentPage) {
	$('body,html').animate({scrollTop:0}, 500);
    $('#dvResp').hide();
    $('#dvResp').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');   
    $('#dvWait').show();

    var filter = BuildFilterExpression();
    var orderVal = filter.split('|')  
    var allIds = $('#SSIdsPages').val()
    var allIdsPages = allIds.split('|');
    if (allIdsPages[currentPage - 1] != '') {
        var options = {};
        options.url = SiteName + "/Api/CityActivities";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = '{"SSFilter":"' + allIdsPages[currentPage - 1] + '", "Ids":"' + orderVal[3] + '"}',
        options.dataType = "json";
        options.success = function (data) {
            lcHtml = "<div>";
            jQuery.each(data, function () {
                lcHtml = lcHtml + '<div class="dvEachPackContent"><div class="dvEachPkTop">';
                lcHtml = lcHtml + '<span class="spTopTitle" style="margin-bottom:0px;color: #19255f;">' + this.name + '</span>';
                if (this.pdL_SequenceNo > 49 && this.pdL_SequenceNo < 60) {
                    lcHtml = lcHtml + '<span class="spPackLength"><img src="https://pictures.tripmasters.com/siteassets/d/favorite.gif" alt=""/></span>';
                }
                lcHtml = lcHtml + '<br style="clear:both;"/><hr class="grayLine" style="margin:0px 0px 10px 0px; padding:0px;"/><div class="dvEachPkLeft" style="padding:0px;">';
                if (this.imG_Path_URL != "none") {
                    var img = this.imG_Path_URL;
                    lcHtml = lcHtml + '<img src="https://pictures.tripmasters.com' + img.toLowerCase() + '" alt=""/>';
                }
                else {
                    lcHtml = lcHtml + '<img src="https://pictures.tripmasters.com/siteassets/d/NoPicture.jpg" alt=""/>';
                }
                lcHtml = lcHtml + '</div>';
                lcHtml = lcHtml + '<div class="dvEachPkRight" style="padding:0px; line-height:20px">' + this.spD_Description + '</div>';
                lcHtml = lcHtml + '<br style="clear:both;"/><div class="dvEachPkBottom dvbLighBlueBG" style="padding:0px!important;color:#000">';
                if (this.rating > 0 && this.reviews > 0) {
                    lcHtml = lcHtml + '<div><span style="color:Gray;">Score: <b style="color:#000">' + this.rating + '</b> out of 5 | <b style="color:#000">' + this.reviews + '</b> Reviews</span></div>';
                } else {
                    lcHtml = lcHtml + '<div><span style="color:Gray;">Score: <b style="color:#000">Not rated yet</b> | <b style="color:#000">' + this.reviews + '</b> Reviews</span></div>';
                }
                lcHtml = lcHtml + '<div><span style="color:Gray;">Type:</span> ' + this.scD_CodeTitle + '</div>';
                lcHtml = lcHtml + '<div ><span style="color:Gray;">Duration:</span> ' + this.duration + ' ' + this.durationUnit + '</div>';
                
                //if (this.stP_Save != 9999) {
                //    lcHtml = lcHtml + '<div style="width:110px; float:left;border-left:1px solid #ccc;  line-height: 28px; padding:0px 10px"><span class="Orange-Arial12NB"><b>' + this.stP_Save + ' </b></span><span style="color:gray;">per person</span></div>';
                //}
                //else {
                //    lcHtml = lcHtml + '<div style="width:110px; float:left; line-height: 28px; padding:0px 10px">&nbsp;</div>';
                //}
                lcHtml = lcHtml + '<div>';
                lcHtml = lcHtml + '<input type="button" value="Tour detail" class="bookItButton" onclick="OpenDivInfo(\'divInfo' + this.id + '\');" id="butInfo' + this.id + '" style=" padding: 2px 25px !important;text-decoration: underline;"/>';
                lcHtml = lcHtml + '</div><br style="clear:both;"/></div></div></div>';
                lcHtml = lcHtml + '<div id="divInfo' + this.id + '" style="display:none;border:solid 1px #1f67c8;width:450px;background-color:#FFF;position:absolute;">';
                lcHtml = lcHtml + '<div align="right" style="padding:3px 10px;font-size:12px;color:#4056c6;"><span onclick="CloseDivInfoMain(\'divInfo' + this.id + '\');" style="cursor:pointer">close [ - ]</span></div>';
                lcHtml = lcHtml + '<div style="margin:8px 20px 0px 20px;" class="Text_12_Gray">' + this.pdL_Description + ' </div>';
                lcHtml = lcHtml + '</div><hr class="gradLine"/></div>';
                //console.log(lcHtml);
            });

            

            SetPages(currentPage);
            $('#dvResp').html(lcHtml);
                $('#dvWait').html('');
                $('#dvWait').hide();
                $('#dvResp').show();               
        };
        options.error = function (xhr, desc, exceptionobj) {
                $('#dvResp').html(xhr.responseText);
                $('#dvWait').html('');
                $('#dvWait').hide();
                $('#dvResp').show();
        };
        $.ajax(options);;
    } else {
        $('#dvResp').html('<div style="margin:20px 20px 0px 20px;font-size:14px;color:#19255f;">0 activities found. Please try other combination.</div>')
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvResp').show();
        SetPages(0);
        $('#header').css("visibility", "visible");        
    };   
};
function SetPages(currentPage) {
    var totalPacks = $('#totalSS').val();
    var noPages = Math.ceil(totalPacks / 10);
    var pagesStr = ''
    pagesStr = pagesStr + 'Page(s): '

    if (currentPage > 0) {
        if (noPages <= 7) {
            for (i = 1; i <= noPages; i++) {
                if (i != currentPage)
                    pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                else
                    pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
            }
        }
        else {
            if (currentPage < 5) {
                for (i = 1; i <= 5; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                    else
                        pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                }

                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + noPages + ')">' + noPages + '</a></span>';
            }
            else {
                pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(1)">1</a></span>';
                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';

                if (currentPage + 3 < noPages) {
                    for (i = currentPage - 1; i <= currentPage + 2; i++) {
                        if (i != currentPage)
                            pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                        else
                            pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                    }

                    pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                    pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + noPages + ')">' + noPages + '</a></span>';
                }
                else {
                    for (i = noPages - 4; i <= noPages; i++) {
                        if (i != currentPage)
                            pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                        else
                            pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                    }
                }
            }
        }
        $('div[id^="idPages"]').addClass('dvPaginNoContent').html(pagesStr);
        $('div[id="idPages2"] a').click(function() { scrollTo(0, 0); })
    } else {
        pagesStr = pagesStr + '<span class="spNumSelect">0</span>';
        $('div[id^="idPages"]').addClass('dvPaginNoContent').html(pagesStr);
        $('div[id="idPages2"] a').click(function() { scrollTo(0, 0); })
    }       
}
function OpenDivInfo(divID) {
    var img = $('#butInfo' + divID.replace("divInfo", ""));   
    var divInfo = $('#' + divID + '');
    divInfo.css("top", img.offset().top - 4);
    divInfo.css("left", img.offset().left - (divInfo.width() - img.width())+20);
    divInfo.css("z-index", 9999);
    divInfo.show(300);
    $('html, body').animate({ scrollTop: divInfo.offset().top - 200 }, 300);
}
function CloseDivInfoMain(divID) {
    $('#' + divID + '').hide(100);
}
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
    var dt = {Id: plcid};
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/POIHotels/",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(dt),
        success: function (data) {
            objPOI = data;
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
            ctyLatLong = Number(midLat) + '|' + Number(midLon); //Number(ctylocLat / LL) +'|'+ Number(ctylocLong / LL);
            preBuildMap(data);           
        },
        error: function (xhr, desc, exceptionobj) {
            $('#dvGoogleMap').html(xhr.responseText);
        }
    });
};
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
function preBuildMap(data) {
    var $dvMap = $('#dvShowMap');
    var $objpos = $('#dvPoiLink');
    var popP = $objpos.offset();
    var popT;
    if (popP.top <= 600) { popT = 100 } else { popT = popP.top - 300 };
    $dvMap.attr('style', ' top:' + popT + 'px;');
    $dvMap.attr('class', 'dvShowMap');
    $dvMap.show();
    $('html,body').animate({ scrollTop: popT - 30 }, 2000);
    buildMapPoi(data);
};
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
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelAnchor: poiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 1 },
            title: this.POI_Title,
            zIndex: 8998
        });
        var message = '<div class="dvBublleStyle">';
        if (this.POI_PictureURL != 'none') {
            message = message + '<img src="' + this.poI_PictureURL + '" align="left"/>';
        }
        message = message + '<div>' + this.poI_Title + '</div>';
        if (this.POI_Description != 'none') {
            message = message + this.poI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); }); //infoWind.open(map,marker);});
        infoPOIWindows.push(infoWind);

        var sname = this.POI_Title;
        var infoSTitle = new google.maps.InfoWindow({ content: sname, size: new google.maps.Size(20, 20) });
        google.maps.event.addListener(marker, 'mouseover', function () { infoSTitle.open(map, marker); });
        google.maps.event.addListener(marker, 'mouseout', function () { infoSTitle.close(map, marker); });
    });
};
function closePoiInfoW(mp, mrk, winfo) {
    for (var i = 0; i < infoPOIWindows.length; i++) {
        infoPOIWindows[i].close();
    };
    winfo.open(mp, mrk);
};
var objHotPOI;
function getHotClosePoiData(plcid, elat, elong, mark) {
    var infoToClose;
    for (var i = 0; i < infoPOIWindows.length; i++) {
        if (infoPOIWindows[i].getMap()) {
            infoPOIWindows[i].setContent('<div style="height:auto; padding:10px 10px;" ><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"><br/>... loading hotels</div>');
            infoToClose = infoPOIWindows[i];
        };

    };
    for (var i = 0; i < markerHotels.length; i++) {
        markerHotels[i].setMap(null); ;
    };
    var myLatLng = new google.maps.LatLng(elat, elong);
    var zoom = 15;
    map.setZoom(zoom);
    map.panTo(myLatLng);
    $.ajax({
        type: "POST",
        url: "/europe/WS_Library.asmx/getHotelClosePOI",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{plcID:"' + plcid + '", hLat:"' + elat + '", hLong:"' + elong + '"}',
        success: function(data) {
            objHOT = eval("(" + data.d + ")");
            if (objHOT.length > 0) {
                infoToClose.close();
                buildHotelPoi(data);
            }
            else {
                infoToClose.setContent('<div style="height:auto; padding:10px 10px;" >No closer hotels found</div>');
            }
        },
        error: function(xhr, desc, exceptionobj) {
            alert(xhr.responseText);            
        }
    });
};
function buildHotelPoi(data) {
    var Phcont = 0;
    jQuery.each(objHOT, function(data) {
        Phcont++;
        var hlocLat = this.PTY_Latitude;
        var hlocLong = this.PTY_Longitude;
        var starNum = this.SCD_CodeTitle.match(isNumber);
        var hiconImg = 'hotel_' + starNum + 'stars_GR.png';
        var hpoiAnchor = new google.maps.Point(-13, 39)
        var hmarker = new google.maps.Marker({
            position: new google.maps.LatLng(hlocLat, hlocLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            icon: 'https://pictures.tripmasters.com/siteassets/d' + hiconImg,
            labelContent: '<div class="bubbleH">' + this.PDL_Title + '</div>',
            labelAnchor: hpoiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 0.75 },
            title: this.PDL_Title,
            zIndex: 8998
        });
        var message = '<div class="dvHotBubble">';
        if (this.IMG_Path_URL != 'none') {
            message = message + '<div class="dvimgHot"><img src="https://pictures.tripmasters.com' + this.IMG_Path_URL.toLowerCase() + '"/></div>';
        }
        message = message + '<div class="dvaddHot"><span>' + this.PDL_Title + '</span><br/><img src="https://pictures.tripmasters.com/siteassets/d/Stars_' + starNum + '_Stars.gif"/><p>' + this.PTY_Address + '</p></div>';
        if (this.POI_Description != 'none') {
            message = message + '<div class="dvdescHot">' + this.PTY_Description + '</div>';
        }
        message = message + '</div>';
        var infoHWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(hmarker, 'click', function() { infoHWind.open(map, hmarker); });
        markerHotels.push(hmarker);
    });
};
/* *** END POI MAP *** */

function windowCMS(id, w, h) {   
    var LeftPosition
    var TopPosition
    var settings
    var navAg = navigator.userAgent
    var dom = document.domain;
    var newURL = '/cms/' + id + '?cms&wh=0&wf=0'
    LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
    if (navAg.indexOf('Firefox') >= 0) {
        settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable,toolbar=yes'
    }
    else if (navAg.indexOf('Chrome') >= 0) {
        settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ''
    }
    else {
        settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable,location=yes'
    }
    window.open(newURL, "CMS_Window", settings);
}

function popError(obj, messg) {
    var objPos = $('#' + obj + '').offset();
    $('#divError').html(messg);
    $('#divError').show();    
    $('#divError').offset({ left: objPos.left-10 , top: objPos.top - 50 });    
    setTimeout("$('#divError').hide()", 2000);
};
function closeClick(obj) {
    $('#divError').hide();
    if (IsMobileDevice()) { $('#' + obj + '').val(''); }
    $('#' + obj + '').select();
};