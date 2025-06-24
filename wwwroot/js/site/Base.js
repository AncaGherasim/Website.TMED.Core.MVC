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
    //console.log("visitID = " + visitID);

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
        //console.log(id);
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
   
});

function checkFooterDestinations() {
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/FooterDestinations",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            msg = data;
            buildFooterDestinations(data);
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }
    });
};
function buildFooterDestinations(obj) {
    function getSiteURL(regionid) {
        switch (regionid) {
            case 243: return "https://www.tripmasters.com/europe/";
            case 595: return "https://www.tripmasters.com/asia/";
            case 182: return "https://www.tripmasters.com/latin/";
            default: return "#";
        }
    }

    let markup = { countries: "", cities: "" };

    const arrOrderByCountry = [...obj].sort(function (a, b) { return a.countryname.localeCompare(b.countryname) });
    $.each(arrOrderByCountry, function () {

        const siteURL = getSiteURL(this.regionid);
        markup.countries += `<li class="footer-destinations__item">
            <a href="${siteURL + this.countryname.replace(/\s/g, '_').toLowerCase().trim()}/vacations">
                ${this.countryname.trim()}
            </a>
        </li>`;

    });
    const arrOrderByCities = [...obj].sort(function (a, b) { return a.cityname.localeCompare(b.cityname) });

    $.each(arrOrderByCities, function () {

        const siteURL = getSiteURL(this.regionid);
        markup.cities += `<li class="footer-destinations__item">
            <a href="${siteURL + this.cityname.replace(/\s/g, '_').toLowerCase().trim()}/vacations">
                ${this.cityname.trim()}
            </a>
        </li>`;
    });
    let vacTxt = `<p class="footer-destinations__title"><a href="https://www.tripmasters.com/vacation-packages">Vacation Packages:</a></p>
                  <div class="footer-destinations__grid">
                      <div>
                          <ul class="footer-destinations__list">
                              <li>Regions:</li>
                              <li class="footer-destinations__item"><a href="https://www.tripmasters.com/europe/">Europe, Africa & Middle East</a></li>
                              <li class="footer-destinations__item"><a href="https://www.tripmasters.com/asia/">Asia & South Pacific</a></li>
                              <li class="footer-destinations__item"><a href="https://www.tripmasters.com/latin/">Latin America and Carribean</a></li>
                          </ul>
                          <ul class="footer-destinations__list">
                              <li>Countries:</li>
                              ${markup.countries}
                          </ul>
                          <ul class="footer-destinations__list">
                              <li>Cities:</li>
                              ${markup.cities}
                          </ul>
                      </div>
                  </div>`;

    $('.citylist').html(vacTxt + '<br/>');
    //removeItemF("lsFooterDestinations");
};

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


/// *** Recently View Packages on Header *** //

function getRecentlyView() {
    var recenView = getItemF("objRecentlyView");
    if (recenView !== null) {
        removeItemF("objRecentlyView");
    }
    else {
        var dataID = { Id: visitID };
        var options = {};
        options.url = SiteName + "/Api/HeaderRecentlyViewed";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify(dataID);
        options.dataType = "json";
        options.success = function (data) {
            //data != undefined ? (
            //setItemF("objRecentlyView", data, 0.05);
            buildRecentlyViewedBase(data);
            //) : '';
        };
        options.error = function (xhr, desc, exceptionobj) {
            console.log(xhr);
        };
        $.ajax(options);
    }
};

function buildRecentlyViewedBase(obj) {
    console.log(obj);
    $('#dvMvisit').html('');
    var objC = 0;
    var siteURL;
    var newVisit = "<div class='row w-100 mx-auto border-bottom'>";
    $.each(obj, function () {
        objC++;
        if (objC < 4) {
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
                case 'TMLUX':
                    siteURL = location.protocol + "//www.tripmasters.com/luxury";
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
    // console.log(newVisit);
    $('#dvMvisit').append(newVisit);
};

function showInfoList(id) {
    if ($('#meniu_' + id).is(":hidden")) {
        $('#meniu_' + id).show(), $('#arrow_' + id).css({ 'transform': 'rotate(270deg)' });
    }
    else {
        $('#meniu_' + id).hide(), $('#arrow_' + id).css({ 'transform': 'rotate(90deg)' });
    }
};

/// *** Most Popular Packages on Header *** //

function getMostPop() {
    var mostPop = getItemF("objTMEDMostPop");
    if (mostPop !== null) {
        buildMostPop(mostPop);
    }
    else {
        $.ajax({
            type: "POST",
            url: SiteName + "/Api/MostPop",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var msg = data
                setItemF("objTMEDMostPop", data, 12)
                buildMostPop(data);
            },
            error: function (xhr, desc, exceptionobj) {
                console.log(xhr.responseText + ' = error');
            }
        });
    };
};

function buildMostPop(obj) {
    var relTxt = "";
    $.each(obj, function () {
        var pack = this;
        relTxt = relTxt + '<li class="row liMostPop">';
        relTxt = relTxt + '<div>';
        relTxt = relTxt + '<a href="' + SiteName + '/' + pack.CountryName.replace(/\s/g, '_').toLowerCase() + '/' + pack.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + pack.PDLID + '">';
        relTxt = relTxt + '<img class="delay liImg" src="https://pictures.tripmasters.com' + pack.IMG_Path_URL + '">';
        relTxt = relTxt + '</a>';
        relTxt = relTxt + '</div>';
        relTxt = relTxt + '<div>';
        relTxt = relTxt + '<a href="' + SiteName + '/' + pack.CountryName.replace(/\s/g, '_').toLowerCase() + '/' + pack.PDL_Title.replace(/\s/g, '_').toLowerCase() + '/package-' + pack.PDLID + '">';
        relTxt = relTxt + pack.PDL_Title;
        relTxt = relTxt + '</a>';
        relTxt = relTxt + '<p class="Text_12_GrayLight dvSuggestPrice">' + pack.STP_NumOfNights + ' nights from  <span class="spSuggestPrice"> $' + pack.STP_Save + '*</span></p>';
        relTxt = relTxt + '</div>';
        relTxt = relTxt + '</li>';
    });

    $('#dvRelF').html(relTxt);
    $('#dvRelFMob').html(relTxt);
};