var visitID;
$(document).ready(function () {
    //console.log("base");
    //console.log(userid);
    var tmpath = "/";
    var csite;
    var vacTxt = "";
    var tourTxt = "";


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
    console.log("visitID = " + visitID);

    $(".deskDestinations").click(function () {
        $('#destinationsContent').is(':visible') === false ?
            ($('#destinationsContent').slideDown(), $('#manageContent').hide(), $('#whoContent').hide(), $('#des').css({ 'transform': 'rotate(270deg)' }), $('#book').css({ 'transform': 'rotate(90deg)' }), $('#contact').css({ 'transform': 'rotate(90deg)' }))
            : ($('#destinationsContent').slideUp(), $('#des').css({ 'transform': 'rotate(90deg)' }));
        getMostPop();
        $('.dvCloseDesk').click(function () { $('#destinationsContent').slideUp(); $('#des').css({ 'transform': 'rotate(90deg)' }); $("li.deskDestinations").removeClass("navTriangle"); });

        $("li.deskMyBooking").removeClass("navTriangle");
        $("li.deskContact").removeClass("navTriangle");
        if ($('li.navTriangle').length) { $("li.deskDestinations").removeClass("navTriangle") }
        else { $("li.deskDestinations").addClass("navTriangle"); }
    });

    $(".deskMyBooking").click(function () {
        $('#manageContent').is(':visible') === false ?
            ($('#manageContent').slideDown(), $('#destinationsContent').hide(), $('#whoContent').hide(), $('#book').css({ 'transform': 'rotate(270deg)' }), $('#des').css({ 'transform': 'rotate(90deg)' }), $('#contact').css({ 'transform': 'rotate(90deg)' }))
            : ($('#manageContent').slideUp(), $('#book').css({ 'transform': 'rotate(90deg)' }));
        getRecentlyView();
        $('.dvCloseBook').click(function () { $('#whoContent').slideUp(); $('#book').css({ 'transform': 'rotate(90deg)' }); $("li.deskMyBooking").removeClass("navTriangle"); });

        $("li.deskDestinations").removeClass("navTriangle");
        $("li.deskContact").removeClass("navTriangle");
        if ($('li.navTriangle').length) { $("li.deskMyBooking").removeClass("navTriangle") }
        else { $("li.deskMyBooking").addClass("navTriangle"); }
    });

    $(".deskContact").click(function () {
        $('#whoContent').is(':visible') === false ?
            ($('#whoContent').slideDown(), $('#destinationsContent').hide(), $('#manageContent').hide(), $('#contact').css({ 'transform': 'rotate(270deg)' }), $('#des').css({ 'transform': 'rotate(90deg)' }), $('#book').css({ 'transform': 'rotate(90deg)' }))
            : ($('#whoContent').slideUp(), $('#contact').css({ 'transform': 'rotate(90deg)' }));
        $('.dvCloseWho').click(function () { $('#whoContent').slideUp(); $('#contact').css({ 'transform': 'rotate(90deg)' }); $("li.deskContact").removeClass("navTriangle"); });

        $("li.deskDestinations").removeClass("navTriangle");
        $("li.deskMyBooking").removeClass("navTriangle");
        if ($('li.navTriangle').length) { $("li.deskContact").removeClass("navTriangle") }
        else { $("li.deskContact").addClass("navTriangle"); }
    });

    $(".btnMob").click(function () {
        $('.navBarMob').is(':visible') === false ?
            ($('.navBarMob').slideDown(600), $('.hdrBrand').css('background-color', '#eeeff3'), $('.site-search__mob').css({ 'background-color': 'unset' }))
            : ($('.navBarMob, .worldRegion,.packagesRes, .mostPopRes, .myBookings, .contactUs').slideUp(600), $('.hdrBrand').css('background-color', 'transparent'), $('.site-search__mob').css({ 'background-color': '#1A2360' }));
    });
    $(".acetrnt-toggle").click(function () {
        $(this).toggleClass("active")
    })
    $('.thtitleRes').click(function () {
        var id = $(this).attr('id');
        id == undefined ? /who/i.test(this.textContent) ? id = 1 : /additional/i.test(this.textContent) ? id = 2 : /secured/i.test(this.textContent) ? id = 3 : '' : '';
        console.log(id);
        showInfoList(id);
    });

    $('#worldReg').click(function () {
        thisPos = $(this).offset().top;
        $('.worldRegion').show('slide', { direction: 'right' }, 'slow');
        window.scrollTo(0, 0);
    });
    $('#packages').click(function () {
        thisPos = $(this).offset().top;
        $('.packagesRes').show('slide', { direction: 'right' }, 'slow');
        window.scrollTo(0, 0);
    });
    $('#mostPop').click(function () {
        thisPos = $(this).offset().top;
        $('.mostPopRes').show('slide', { direction: 'right' }, 'slow');
        window.scrollTo(0, 0);
        getMostPop();
    });
    $('#myBooking').click(function () {
        thisPos = $(this).offset().top;
        $('.myBookings').show('slide', { direction: 'right' }, 'slow');
        window.scrollTo(0, 0);
    });
    $('#contactUs').click(function () {
        thisPos = $(this).offset().top;
        $('.contactUs').show('slide', { direction: 'right' }, 'slow');
        window.scrollTo(0, 0);
    });

    $('.dvMtopPage').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 200);
    });

    $('.dvBackRes').click(function () {
        $('.worldRegion').hide('slide', { direction: 'right' }, 'slow');
        $('.packagesRes').hide('slide', { direction: 'right' }, 'slow');
        $('.mostPopRes').hide('slide', { direction: 'right' }, 'slow');
        $('.myBookings').hide('slide', { direction: 'right' }, 'slow');
        $('.contactUs').hide('slide', { direction: 'right' }, 'slow');
        window.scrollTo(0, 0);

    });  




    $.ajax({
        type: "GET",
        url: SiteName + "/Api/DestinationCities/",
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            //console.log("Api/DestinationCities/ succes");
            msg = data;
            if (msg != '') {
                relTxt = '<div style="padding:2px 2px;" >';
                tourTxt = '<div style="padding:2px 2px;" >';
                strPrts = msg.split("@");
                var SiteNameCMS = "https://www.tripmasters.com/europe/";
                for (i = 0; i <= strPrts.length - 1; i++) {
                    echP = strPrts[i].split('|');
                    //console.log(strPrts[i]);

                    if (echP[4] == 1) {
                        if (i > 0) {
                            vacTxt = vacTxt + '&nbsp;|&nbsp;';
                            tourTxt = tourTxt + '&nbsp;|&nbsp;';
                        }
                        vacTxt = vacTxt + '<a href="' + SiteNameCMS + echP[1].replace(/\s/g, '_').toLowerCase() + '/vacations">' + echP[1] + ' Vacations:</a>&nbsp;';
                        vacTxt = vacTxt + '<a href="' + SiteNameCMS + echP[3].replace(/\s/g, '_').toLowerCase() + '/vacations" >' + echP[3] + '</a>';

                        tourTxt = tourTxt + '<a href="' + SiteNameCMS + echP[1].replace(/\s/g, '_').toLowerCase() + '/vacations">' + echP[1] + ':</a>&nbsp;' +
                            '<a href="' + SiteNameCMS  + echP[1].replace(/\s/g, '_').toLowerCase() + '/tours">' + echP[1] + ' Tours</a>, ' +
                            '<a href="' + SiteNameCMS + echP[1].replace(/\s/g, '_').toLowerCase() + '/trips'  + '">Trips to ' + echP[1] + '</a>, ' +
                            '<a href="' + SiteNameCMS + echP[1].replace(/\s/g, '_').toLowerCase() + '/holidays">' + echP[1] + ' Holidays</a>, ' +
                            '<a href="' + SiteNameCMS + echP[1].replace(/\s/g, '_').toLowerCase() + '/travel">' + echP[1] + ' Travel</a>, ' +
                            '<a href="' + SiteNameCMS + echP[1].replace(/\s/g, '_').toLowerCase() + '/visit' + '">Visit ' + echP[1] + '</a>';
                    }
                }
                vacTxt = vacTxt + '<br style="clear:both"/></div>';
                tourTxt = tourTxt + '<br style="clear:both"/></div>';
                //console.log(vacTxt);
                //console.log(tourTxt);
                //$('div.dvCityList_footer').html(vacTxt);
                $('.citylist').html(vacTxt + '<br/><br/><br/>' + tourTxt);
            }
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }
    });
   
});



function getRecentlyView() {
    var dataID = { Id: visitID };
    var options = {};
    options.url = SiteName + "/Api/RecentlyViewed";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify(dataID);
    options.dataType = "json";
    options.success = function (data) {
        console.log(data)
        data != undefined ? buildRecentlyViewedBase(data) : '';
    };
    options.error = function (xhr, desc, exceptionobj) {
        console.log(xhr);
    };
    $.ajax(options);
}
Date.timeBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    var passTime;
    days > 0 ? (days === 1 ? passTime = days + ' day ago' : passTime = days + ' days ago') : hours > 0 ? (hours === 1 ? passTime = hours + ' hour ago' : passTime = hours + ' hours ago') : minutes > 0 ? (minutes === 1 ? passTime = minutes + ' minute ago' : passTime = minutes + ' minutes ago') : (passTime = '  just visited');
    return passTime;
};
function buildRecentlyViewedBase(obj) {
    $('#dvMvisit').html('');
    var objC = 0;
    var siteURL;
    var newVisit = "<div class='row w-100 mx-auto border-bottom'>";
    $.each(obj, function () {
        objC++;
        if (objC < 3) {
            switch (this.UTS_Site) {
                case 'ED':
                    siteURL = location.protocol + "//www.europeandestinations.com";
                    break;
                case 'TMED':
                    siteURL = location.protocol + "//www.tripmasters.com/europe";
                    break;
                case 'TMASIA':
                    siteURL = location.protocol + "//www.tripmasters.com/asia";
                    break;
                case 'TMLD':
                    siteURL = location.protocol + "//www.tripmasters.com/latin";
                    break;
            }
            var jsdate = new Date(Date.parse(this.UTS_Date));
            var today = new Date();
            var lastVst = Date.timeBetween(jsdate, today);
            newVisit = newVisit + '<li class="row liMostPop pl-0 pr-0 ml-0 mr-0 mb-2">';
            newVisit = newVisit + '<div class="col-4 pl-0 pr-0">';
            newVisit = newVisit + '<a href="' + siteURL + '/' + this.STR_PlaceTitle.replace(/ /g, '_').toLowerCase() + '/' + this.PDL_Title.replace(/ /g, '_').toLowerCase() + '/package-' + this.PDLID + '">';
            newVisit = newVisit + '<img class="delay liImg" src="https://pictures.tripmasters.com' + this.IMG_Path_URL + '"/> ';
            newVisit = newVisit + '</a>';
            newVisit = newVisit + '</div>';
            newVisit = newVisit + '<div class="col-8">';
            newVisit = newVisit + '<div class="row pl-2 colTitle">';
            newVisit = newVisit + '<a href="' + siteURL + '/' + this.STR_PlaceTitle.replace(/ /g, '_').toLowerCase() + '/' + this.PDL_Title.replace(/ /g, '_').toLowerCase() + '/package-' + this.PDLID + '">';
            newVisit = newVisit + this.PDL_Title;
            newVisit = newVisit + '</a>';
            newVisit = newVisit + '</div>'
            newVisit = newVisit + '<div class="Text_12_GrayLight dvSuggestPrice row" > Viewed ' + lastVst + '</span>';
            newVisit = newVisit + '</div>'
            newVisit = newVisit + '</div>';
            newVisit = newVisit + '</li>'
        }
    });
    console.log(newVisit);
    $('#dvMvisit').append(newVisit);
}

function showInfoList(id) {
    if ($('#meniu_' + id).is(":hidden")) {
        $('#meniu_' + id).show(), $('#arrow_' + id).css({ 'transform': 'rotate(270deg)' });
    }
    else {
        $('#meniu_' + id).hide(), $('#arrow_' + id).css({ 'transform': 'rotate(90deg)' });
    }
};

function getMostPop() {
    var relTxt = "";
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/MostPop",
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            console.log("aici");
            console.log(data)
            var msg = JSON.parse(data);
            if (msg.length > 0) {
                console.log(msg.length)
                for (i = 0; i < msg.length; i++) {

                    var pack = msg[i];

                    relTxt = relTxt + '<li class="row liMostPop">';
                    relTxt = relTxt + '<div class="col-5 pl-0">';
                    relTxt = relTxt + '<a href="' + SiteName + '/' + pack.CountryName.replace(/\s/g, '_').toLowerCase() + '/' + pack.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + pack.PDLID + '">';
                    relTxt = relTxt + '<img class="delay liImg" src="https://pictures.tripmasters.com' + pack.IMG_Path_URL + '">';
                    relTxt = relTxt + '</a>';
                    relTxt = relTxt + '</div>';
                    relTxt = relTxt + '<div class="col-7 pl-0">';
                    relTxt = relTxt + '<a href="' + SiteName + '/' + pack.CountryName.replace(/\s/g, '_').toLowerCase() + '/' + pack.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + pack.PDLID + '">';
                    relTxt = relTxt + pack.PDL_Title;
                    relTxt = relTxt + '</a>';
                    relTxt = relTxt + '<p class="Text_12_GrayLight dvSuggestPrice">' + pack.STP_NumOfNights + ' nights from  <span class="spSuggestPrice"> $' + pack.STP_Save + '*</span></p>';
                    relTxt = relTxt + '</div>';
                    relTxt = relTxt + '</li>';

                    //relTxt = relTxt + '<li class="row liMostPop pl-0 pr-0 ml-0 mr-0 mb-2">';
                    //relTxt = relTxt + '<div class="col-4 pl-0 pr-0">';
                    //relTxt = relTxt + '<a href="' + SiteName + '/' + pack.CountryName.replace(/\s/g, '_').toLowerCase() + '/' + pack.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + pack.PDLID + '">';
                    //relTxt = relTxt + '<img class="delay liImg" src="https://pictures.tripmasters.com' + pack.IMG_Path_URL + '"/> ';
                    //relTxt = relTxt + '</a>';
                    //relTxt = relTxt + '</div>';
                    //relTxt = relTxt + '<div class="col-8">';
                    //relTxt = relTxt + '<div class="row pl-2 colTitle">';
                    //relTxt = relTxt + '<a href="' + SiteName + '/' + pack.CountryName.replace(/\s/g, '_').toLowerCase() + '/' + pack.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + pack.PDLID + '">';
                    //relTxt = relTxt + pack.PDL_Title;
                    //relTxt = relTxt + '</a>';
                    //relTxt = relTxt + '</div>'
                    //relTxt = relTxt + '<div class="Text_12_GrayLight dvSuggestPrice row" >' +  pack.STP_NumOfNights + ' nights from  <span class="spSuggestPrice"> ' +  pack.STP_Save + '</span>';
                    //relTxt = relTxt + '</div>'
                    //relTxt = relTxt + '</div>';
                    //relTxt = relTxt + '</li>'
                }

                $('#dvRelF').html(relTxt);
                $('#dvRelFMob').html(relTxt);

            }
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }

    });

}