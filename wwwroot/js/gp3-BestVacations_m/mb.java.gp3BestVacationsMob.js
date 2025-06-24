// JavaScript Document
var nameCountry;
var area;
var interests;
var attractions;
$(document).ready(function () {
    var thisPos = 0;
    var prvCt = "";
    nameCountry = $('#jplcCo').val();
    moreExplore = $('#moreExplore').val();
    area = $('#area').val();
    interests = $('#interests').val()
    attractions = $('#atractions').val();
    $('.dvFeatViewItTravel').on('click', function () { window.location = $(this).attr('data-go-to'); })
    $('.dvMobCustomIt').on('click', function () { window.location = $(this).attr('data-url'); })

    $('.dvMoreDetail').click(function () { var id = this.getAttribute("data-go-to"); featureItin(id) });

    $(".dvMoreFeatBtn").click(function () {
        thisPos = $('.dvFeatItin').offset().top;
        $(".dvEachFeatItinHide").is(":visible") === false ?
            ($(this).html('Close See all Featured Itineraries <span>›</span>'), $('.dvEachFeatItinHide').slideDown(), $('.dvMoreFeatBtn span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See all Featured Itineraries <span>›</span>'), $('.dvEachFeatItinHide').slideUp(), $('.dvMoreFeatBtn span').css('transform', 'rotate(90deg)'), window.scrollTo(0, thisPos));
    });

    $(".dvEachCityMore").click(function () {
        thisPos = $('.dvEachCity:nth-child(1)').offset().top;
        $(".dvEachCityHide").is(":visible") === false ?
            ($(".dvEachCityHide").slideDown(), $(this).html("Close More Cities>>"))
            : ($(".dvEachCityHide").slideUp(), $(this).html("More Cities>>"), window.scrollTo(0, thisPos - 60));
    });
    $('.dvEachCity').click(function () {
        var id = this.getAttribute("data-go-to");
        $('#dvCtInf' + id + '').is(':visible') === false ?
            ($('#dvCtInf' + id + '').slideDown(), $('.spCity').addClass('spCityUp'))
            : ($('#dvCtInf' + id + '').slideUp(), $('.spCity').removeClass('spCityUp'));
    });
    $('.dvViewDest, .spCombCou, .dvEachBoxTabMore, .dvEachBoxTabReg').click(function () { window.location = this.getAttribute("data-go-to"); })
    $('.dvBoxMapLink').click(function () {
        thisPos = $(this).offset().top;
        $('.dvMbGPContainer').hide('slide', { direction: 'right' }, 'slow');
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
            window.scrollTo(0, thisPos - 100);
        }
    });
    $(window).scroll(function () {
        if ($('.dvSlideContainer').is(':visible')) {
            var body = document.body.getBoundingClientRect();
            if (body.top < -100) {
                $('.dvMbBack').css({
                    position: 'fixed',
                    top: '0',
                    left: '0'
                });
            } else if (body.top > -100) {
                $('.dvMbBack').css({
                    position: 'static'
                });
            }
        }
    })
    $('.dvCMSThreeImages').parent().css('display', 'none')
    $('.moreButton').click(function () {
        $('.dvEachHide').is(':visible') === false ?
            ($(this).html('Close All ' + area + ' <span>&rsaquo;</span>'), $('.dvEachHide').slideDown(), $('div.moreButton span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + area + ' <span>&rsaquo;</span>'), $('.dvEachHide').slideUp(), $('div.moreButton span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonExpl').click(function () {
        $('.dvEachHideExpl').is(':visible') === false ?
            ($(this).html('Close All ' + moreExplore + '  <span>&rsaquo;</span>'), $('.dvEachHideExpl').slideDown(), $('div.moreButtonExpl span').css('transform', 'rotate(270deg)','top','-6px'))
            : ($(this).html('See All ' + moreExplore + '  <span>&rsaquo;</span>'), $('.dvEachHideExpl').slideUp(), $('div.moreButtonExpl span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonInt').click(function () {
        $('.dvEachHideInt').is(':visible') === false ?
            ($(this).html('Close All ' + interests + '  <span>&rsaquo;</span>'), $('.dvEachHideInt').slideDown(), $('div.moreButtonInt span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + interests + '  <span>&rsaquo;</span>'), $('.dvEachHideInt').slideUp(), $('div.moreButtonInt span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonAt').click(function () {
        $('.dvEachHideAt').is(':visible') === false ?
            ($(this).html('Close All ' + attractions + '  <span>&rsaquo;</span>'), $('.dvEachHideAt').slideDown(), $('div.moreButtonAt span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + attractions + '  <span>&rsaquo;</span>'), $('.dvEachHideAt').slideUp(), $('div.moreButtonAt span').css('transform', 'rotate(90deg)'));
    });

    $('#overview').click(function () {
        $('#hideOverview').is(':visible') === false ?
            ($('#hideOverview').slideDown(), $('#overview span').css('transform', 'rotate(270deg)'))
            : ($('#hideOverview').slideUp(), $('#overview span').css('transform', 'rotate(90deg)'));
    });
    $('.dvWhatToExpect').click(function () {
        $('.hidedvWhatToExpect').is(':visible') === false ?
            ($('.hidedvWhatToExpect').slideDown(), $('.dvWhatToExpect span').css('transform', 'rotate(270deg)'))
            : ($('.hidedvWhatToExpect').slideUp(), $('.dvWhatToExpect span').css('transform', 'rotate(90deg)'));
    });
    $('.dvPackages').click(function () {
        $('.hidedvPackages').is(':visible') === false ?
            ($('.hidedvPackages').slideDown())
            : ($('.hidedvPackages').slideUp());
    });
    $('.Countries').click(function () {
        $('.hidedvCountry').is(':visible') === false ?
            ($('.hidedvCountry').slideDown())
            : ($('.hidedvCountry').slideUp());
    });
    $('.Cities').click(function () {
        $('.hidedvCities').is(':visible') === false ?
            ($('.hidedvCities').slideDown())
            : ($('.hidedvCities').slideUp());
    });

    $('.dvCombine').click(function () {
        $('.hidedvCombine').is(':visible') === false ?
            ($('.hidedvCombine').slideDown())
            : ($('.hidedvCombine').slideUp());
    });
    $('.dvBoxCombCounInfo').click(function () {
        var pkIN = $(this).attr('lang')
        document.location.href = pkIN;
    });
});
function openArrow(id) {
    $('.BGDown' + id).is(':visible') === false ?
        ($('.BGDown' + id).slideDown())
        : ($('.BGDown' + id).slideUp());

};

function featureItin(objId) {
    $('.dvEachFeatDesc').each(function () {
        var idDiv = $(this).attr('id');
        var isNum = idDiv.match(/[0-9]+/g)
        objId == isNum ? (
            $('#' + idDiv + '').is(':visible') == false ?
                ($('#' + idDiv + '').slideDown(), $('#BGDown' + isNum).slideDown(), $('#spArrow' + isNum + '').css({ 'transform': 'rotate(270deg)', 'padding-right': '10px', 'top':'-10px' }))
                : ($('#' + idDiv + '').slideUp(), $('#BGDown' + isNum).slideUp(), $('#spArrow' + isNum + '').removeAttr('style')))
            : ($('#' + idDiv + '').slideUp(), $('#BGDown' + isNum).slideUp(), $('#spArrow' + isNum + '').removeAttr('style'));
    })
};
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
        url: "/europe/WS_Library.asmx/getPoiToMap",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{plcID:"' + plcid + '"}',
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
