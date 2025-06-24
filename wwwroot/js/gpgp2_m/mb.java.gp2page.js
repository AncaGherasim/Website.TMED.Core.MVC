var isNumber = /[0-9]+/g;
var cmsData;
var prevCont = "";
$(document).ready(function () {
    $('#btnMore').click(function () {
        $(this).hide();
    });
    $('button[id^="btnCty"]').click(function () {
        var id = this.id.match(isNumber);
        //console.log(id);
        if ($("#dvCtyInfo" + id + '').is(":visible") == false) {
            $(this).addClass("btnCtyShow");
        } else {
            $(this).removeClass("btnCtyShow");
        }
        $('.dvBoxMapLink, .mapOfInterest').click(function () {
            thisPos = $(this).offset().top;
            $('.dvMbGPContainer').hide('slide', { direction: 'right' }, 'slow');
            $('.Mob, .dvCombine, .sectionDescription, .reghighlights').hide('slide', { direction: 'right' }, 'slow');
            window.scrollTo(0, 0);
            $('.dvSlideContainer').show('slide', { direction: 'right' }, 'slow');
            $('#dvContent').css({ 'height': '' + $(window).height() - 150 + 'px' });
            openpoimap($('#plcID').val());
        });
        $('.dvMbBack').click(function () {
            if (prvCt != "") {
                $('#dvContent').html('');
                $('#dvContent').html(prvCt);
                prvCt = "";
            } else {
                $('#dvContent').html('');
                $('.dvMbBack').removeAttr('style');
                $('.dvSlideContainer').hide('slide', { direction: 'right' }, 'slow');
                $('.dvMbGPContainer').show('slide', { direction: 'right' }, 'slow');
                $('.Mob, .dvCombine, .sectionDescription, .reghighlights').show('slide', { direction: 'right' }, 'slow');
                window.scrollTo(0, thisPos - 100);
            }
        });  
    });

    $('#btnClsMore').click(function () {
        $('#btnMore').collapse('hide');
    });
    $("#modalCMS").on("show.bs.modal", function (event) {
        var btn = event.relatedTarget.id.match(isNumber);
        callCMS(btn);
    });
    $(document).on('click', '.aCMStxtLink, .modal-body a', function (e) {
        e.preventDefault();
        prevCont = $('.modal-body').html();
        var cmsId = $(this).attr('href').match(/\d+/);
        callCMS(cmsId[0]);
    });
    $('#backCms').click(function () {
        if (prevCont != '') {
            $('.modal-body').html('');
            $('.modal-body').html(prevCont);
            prevCont = '';
        } else {
            $('.modal-body').html('');
            $('#modalCMS').modal('hide');
        }
    });
});

function callCMS(cmsId) {
    //console.log(cmsId);
    $.ajax({
        ype: 'Get',
        url: SiteName + '/Api/Packages/getDataThisCMS/' + cmsId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            var msg = JSON.stringify(data);
            if (data[0].cmS_Content != '') {
                data[0].cmS_Content = data[0].cmS_Content.replace(/http:/g, 'https:');
                if (RegExp(/\b(dvCMS\w*)\b/).test(data[0].cmS_Content) == true) {
                    $('.modal-body').html(data[0].cmS_Content);
                } else {
                    return false;
                }
            }
        },
        error: function (xhr, desc, exceptionobj) {
            $('.modal-body').html(xhr.responseText);
        }
    });
}
/* *** POI MAP *** */
var objPOI;
var ctylocLat = 0;
var ctylocLong = 0;
var allLat = [];
var allLong = [];
var allLatLong = [];
var lat1, lat2, long1, long2;
var dynZoom;
var bPrt;
var infoPOIWindows = [];
function openpoimap(plcid) {
    ctylocLat = 0;
    ctylocLong = 0;
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/POIHotels/",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "html",
        data: 'placeId=' + plcid,
        success: function (data) {
            objPOI = eval("(" + data.d + ")");
            var LL = 0;
            delete allLatLong;
            jQuery.each(objPOI, function (data) {
                allLatLong.push(this.POI_Longitude + '|' + this.POI_Latitude);
                allLong.push(this.POI_Longitude);
                ctylocLat = Number(ctylocLat) + Number(this.POI_Latitude);
                ctylocLong = Number(ctylocLong) + Number(this.POI_Longitude);
                LL++;
            });
            delete ctyLatLong;
            delete dynZoon;
            ctyLatLong = Number(ctylocLat / LL) + '|' + Number(ctylocLong / LL);
            var maxLong = Math.max.apply(Math, allLong);
            var minLong = Math.min.apply(Math, allLong);
            jQuery.each(allLatLong, function (a, b) {
                bPrt = b.split('|');
                if (bPrt[0] = minLong) { lat1 = bPrt[1]; long1 = bPrt[0]; };
                if (bPrt[0] = maxLong) { lat2 = bPrt[1]; long2 = bPrt[0]; };
                delete bPrt;
            });
            dynZoom = getDistanceFromLatLonInKm(lat1, long1, lat2, long2)
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
};
function deg2rad(deg) {
    return deg * (Math.PI / 180)
};
function preBuildMap(data) {
    $('#dvContent').show();
    var latlong = ctyLatLong.split('|');
    var lat = latlong[0];
    lon = latlong[1];
    var mapOptions = {
        center: new google.maps.LatLng(lat, lon),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true
    };
    var map = new google.maps.Map(document.getElementById("dvContent"), mapOptions);
    var Pcont = 0;
    jQuery.each(objPOI, function (data) {
        Pcont++;
        var locLat = this.POI_Latitude;
        var locLong = this.POI_Longitude;
        var iconImg = 'orange_ball.gif';
        var poiAnchor = new google.maps.Point(-10, 12)
        var marker = new google.maps.Marker({
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelContent: '<div class="bubbletitle">' + this.POI_Title + '</div>',
            labelAnchor: poiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 1 },
            title: this.POI_Title,
            zIndex: 8998
        });
        var message = '<div class="dvBublleStyle">';
        if (this.POI_PictureURL != 'none') {
            message = message + '<img src="' + this.POI_PictureURL + '" align="left"/>';
        }
        message = message + '<div style="font-weight:600; color:navy">' + this.POI_Title + '</div>';
        if (this.POI_Description != 'none') {
            message = message + this.POI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); });
        infoPOIWindows.push(infoWind);
    });
};
function closePoiInfoW(mp, mrk, winfo) {
    for (var i = 0; i < infoPOIWindows.length; i++) {
        infoPOIWindows[i].close();
    };
    winfo.open(mp, mrk);
};