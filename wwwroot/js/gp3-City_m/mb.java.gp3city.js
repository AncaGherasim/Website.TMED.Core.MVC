// JavaScript Document
var nameCountry;

$(document).ready(function () {
    var thisPos = 0;
    var prvCt = "";
    nameCountry = $('#jplcCo').val();
    moreExplore = $('#moreExplore').val();
    var moreArea = $('#moreAreas').val();
    var moreHighlights = $('#moreHighlights').val();
    var moreLO = $('#moreLO').val();
    var moreAreas = $('#moreAreas').val();
    var moreAt = $('#moreAttr').val();
    var moreTravel = $('#moreTravel').val();
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
            ($(".dvEachCityHide").slideDown(), $(this).html("Close More Citites>>"))
            : ($(".dvEachCityHide").slideUp(), $(this).html("More Citites>>"), window.scrollTo(0, thisPos - 60));
    });
    $('.dvEachCity').click(function () {
        var id = this.getAttribute("data-go-to");
        $('#dvCtInf' + id + '').is(':visible') === false ?
            ($('#dvCtInf' + id + '').slideDown(), $('.spCity').addClass('spCityUp'))
            : ($('#dvCtInf' + id + '').slideUp(), $('.spCity').removeClass('spCityUp'));
    });
    $('.dvViewDest, .spCombCou, .dvEachBoxTabMore, .dvEachBoxTabReg').click(function () { window.location = this.getAttribute("data-go-to"); })
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
    $('.spCMSLink').click(function () {
        $('.dvMbBack').removeAttr('style');
        thisPos = $(this).offset().top;
        var id = this.getAttribute("data-go-to").match(/\d+/);
        window.scrollTo(0, 0);
        GetCMsContent(id[0]);
    });
    $(document).on('click', '.aCMStxtLink', function (e) {
        e.preventDefault();
        prvCt = $('#dvContent').html();
        var cmsId = $(this).attr('href').match(/\d+/);
        window.scrollTo(0, 0);
        GetCMsContent(cmsId[0]);
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
            ($(this).html('Close All ' + moreArea + ' <span>&rsaquo;</span>'), $('.dvEachHide').slideDown(), $('div.moreButton span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + moreArea + ' <span>&rsaquo;</span>'), $('.dvEachHide').slideUp(), $('div.moreButton span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonExpl').click(function () {
        $('.dvEachHideExpl').is(':visible') === false ?
            ($(this).html('Close All ' + moreExplore + '  <span>&rsaquo;</span>'), $('.dvEachHideExpl').slideDown(), $('div.moreButtonExpl span').css('transform', 'rotate(270deg)','top','-10px'))
            : ($(this).html('See All ' + moreExplore + '  <span>&rsaquo;</span>'), $('.dvEachHideExpl').slideUp(), $('div.moreButtonExpl span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonAreas').click(function () {
        $('.dvEachHideAreas').is(':visible') === false ?
            ($(this).html('Close All ' + moreAreas + '  <span>&rsaquo;</span>'), $('.dvEachHideAreas').slideDown(), $('div.moreButtonAreas span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + moreAreas + '  <span>&rsaquo;</span>'), $('.dvEachHideAreas').slideUp(), $('div.moreButtonAreas span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonLO').click(function () {
        $('.dvEachHideliInterest').is(':visible') === false ?
            ($(this).html('Close All ' + moreLO + '  <span>&rsaquo;</span>'), $('.dvEachHideliInterest').slideDown(), $('div.moreButtonLO span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + moreLO + '  <span>&rsaquo;</span>'), $('.dvEachHideliInterest').slideUp(), $('div.moreButtonLO span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonTravel').click(function () {
        $('.dvEachHideliTravel').is(':visible') === false ?
            ($(this).html('Close All ' + moreTravel + '  <span>&rsaquo;</span>'), $('.dvEachHideliTravel').slideDown(), $('div.moreButtonTravel span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + moreTravel + '  <span>&rsaquo;</span>'), $('.dvEachHideliTravel').slideUp(), $('div.moreButtonTravel span').css('transform', 'rotate(90deg)'));
    });
    $('.moreButtonAttr').click(function () {
        $('.dvEachHideliAttrt').is(':visible') === false ? 
            ($(this).html('Close All ' + moreAt + '  <span>&rsaquo;</span>'), $('.dvEachHideliAttrt').slideDown(), $('div.moreButtonAttr span').css('transform', 'rotate(270deg)'))
            : ($(this).html('See All ' + moreAt + '  <span>&rsaquo;</span>'), $('.dvEachHideliAttrt').slideUp(), $('div.moreButtonAttr span').css('transform', 'rotate(90deg)'));
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
    $('.dvTitlecities').click(function () {
        $('.hidedvTitlecities').is(':visible') === false ?
            ($('.hidedvTitlecities').slideDown())
            : ($('.hidedvTitlecities').slideUp());
    });
    $('.dvCombine').click(function () {
        $('.hidedvCombine').is(':visible') === false ?
            ($('.hidedvCombine').slideDown())
            : ($('.hidedvCombine').slideUp());
    });
    if (viewUsed == 'GP3_Area' || viewUsed == 'GP3_City') {
        const targetElement = document.querySelector('.browseBuild');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    getNoOfPacksFeaturedItin();
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
    }

});
function getNoOfPacksFeaturedItin() {
    let couId = '';
    if ($("#jplcCoId").val() === undefined) {
        couId = $('#plcID').val();
    } else {
        couId = $('#jplcCoId').val();
    }
    fetch(SiteName + "/Api/GetNoOfPacksFeaturedItin/" + parseInt(couId))
        .then(response => response.json())
        .then(data => {
            if (data[0] != 0) {
                $('.divBrowse').show();
                $('.browseButton').html("Browse all " + data[0].noOfPacks + " customizable packages")
            }
        })
        .catch(error => {
            console.error('Error fetching data of getNoOfPacksFeaturedItin :', error.message);
        });
}
function openArrow(id) {
    $('.BGDown' + id).is(':visible') === false ?
        ($('.BGDown' + id).slideDown())
        : ($('.BGDown' + id).slideUp());

};
function openDivInfo(packID, whr, plcNA, packNA) {
    var mrChoice = '';
    var relTxt = '';
    pic = 'pic' + whr + packID;
    divInf = 'dvInf' + whr + packID;
    divTxt = 'dvTxt' + whr + packID;
    divFee = 'dvFeed' + whr + packID;
    divRel = 'dvRel' + whr + packID;
    divWai = 'dvWait' + whr + packID;
    var divCom = 'dvCom' + whr + packID;

    $('#' + divWai + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" />');
    $('#' + divWai + '').show();

    imgSrc = $('#' + pic + '').attr("src");
    imgVal = imgSrc.indexOf("Plus");
    if (imgVal != -1) {
        $('#' + pic + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");

        $.ajax({
            type: "GET",
            url: SiteName + "/Api/Packages/getDataRelPacks/" + packID,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (data) {
                msg = data;
                //console.log(msg);
                if (msg != '') {
                   relTxt = '<div class="Text_Arial11_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                    strPrts = msg.split('@');
                    for (i = 0; i <= strPrts.length - 1; i++) {
                        if (strPrts[i].indexOf('^^') > -1) { strPrts[i] = strPrts[i].replace('^^', ''); };
                        echP = strPrts[i].split('|');
                        relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
                        relTxt = relTxt + '<a href="' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                        relTxt = relTxt + '<span class="Text_Arial11_Light">'
                        relTxt = relTxt + '<u>' + echP[0] + '</u>'
                        relTxt = relTxt + '</span></a></span>'
                    }
                    relTxt = relTxt + '<br style="clear:both"/></div>';

                    $('#' + divRel + '').html(relTxt);
                    $('#' + divRel + '').show();
                    $('#' + divTxt + '').attr("class", "Text_Arial12");
                    $('#' + divCom + '').html(mrChoice);
                    $('#' + divCom + '').show();
                    $('#' + divWai + '').html('');
                    $('#' + divWai + '').hide();
                    $('#arrow' + packID + '').css({ 'transform': 'rotate(270deg)' })
                    $('#' + divInf + '').slideDown(); 

                }
            },
            error: function (xhr, desc, exceptionobj) {
                $('#' + divWai + '').html('');
                $('#' + divWai + '').hide();
                $('#' + divInf + '').show();
            }
        });
    }
    else {
        $('#' + pic + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
        $('#' + divWai + '').html('');
        $('#' + divWai + '').hide();
        $('#arrow' + packID + '').css({ 'transform': 'rotate(90deg)' })
        $('#' + divInf + '').slideUp(); 

    }
}

function featureItin(objId) {
    $('.dvEachFeatDesc').each(function () {
        var idDiv = $(this).attr('id');
        var isNum = idDiv.match(/[0-9]+/g)
        objId == isNum ? (
            $('#' + idDiv + '').is(':visible') == false ?
                ($('#' + idDiv + '').slideDown(), $('#BGDown' + isNum).slideDown(), $('#spArrow' + isNum + '').css({ 'transform': 'rotate(270deg)', 'right': '16px','top':'-4px' }))
                : ($('#' + idDiv + '').slideUp(), $('#BGDown' + isNum).slideUp(), $('#spArrow' + isNum + '').removeAttr('style')))
            : ($('#' + idDiv + '').slideUp(), $('#BGDown' + isNum).slideUp(), $('#spArrow' + isNum + '').removeAttr('style'));
    })
};
/* *** POI MAP *** */
var objPOI;
var map;
var ctylocLat = 0;
var ctylocLong = 0;
var infoPOIWindows = [];
function openpoimap(plcid) {
    ctylocLat = 0;
    ctylocLong = 0;
    var cylat = [];
    var cylon = [];
    var dt = { Id: plcid };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/POIHotels/",
        contentType: "application/json; charset=utf-8",
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
            ctyLatLong = Number(midLat) + '|' + Number(midLon);
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
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true
    };
    var map = new google.maps.Map(document.getElementById("dvContent"), mapOptions);
    var Pcont = 0;
    jQuery.each(objPOI, function (data) {
        Pcont++;
        var locLat = this.poI_Latitude;
        var locLong = this.poI_Longitude;
        var iconImg = 'orange_ball.gif';
        var poiAnchor = new google.maps.Point(-10, 12)
        var marker = new google.maps.Marker({
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelContent: '<div class="bubbletitle">' + this.poI_Title + '</div>',
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
        message = message + '<div style="font-weight:600; color:navy">' + this.poI_Title + '</div>';
        if (this.poI_Description != 'none') {
            message = message + this.poI_Description;
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
