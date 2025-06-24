// JavaScript Document
var map = null;
var rlatlng;
var objHOT = [];
var NAplc;
var IDplc;
var NAcou;
var IDcou;
var isNumber = /[0-9]+/g;
var infoPOIWindows = [];
var markerHotels = [];
var PGfilter;
var PGtotal;
var PGfiltertxt;
var clickPG = 0;
var mapid = 0;
var thisBrowser = 0;
var distLats;
var hotelsOn = [];
let page = 1;
let typeModal = 'default';
window.navigator.userAgent.indexOf('Firefox') > -1 ? thisBrowser = 1 : '';
$(document).ready(function () {
    init();
});
function init() {
    /* --- TO GET LAT AND LONG FROM CITY NAME --- */
    NAplc = $('#placeNA').val();
    IDplc = $('#placeID').val();
    NAcou = $('#countryNA').val();
    IDcou = $('#countryID').val();
    //console.log(NAplc);
    //console.log(IDplc);
    //console.log(NAcou);
    //console.log(IDcou);
    var geocoder = new google.maps.Geocoder();
    //geocoder.geocode({ 'address': '' + NAplc + '' + '' + NAcou + '' }, function (results, status) {
    //    if (status == google.maps.GeocoderStatus.OK) {
    //        //console.log("Status ok");
    //        ctyLatLong = results[0].geometry.location.lat() + '|' + results[0].geometry.location.lng();
    //        buildThumbMap();
    //    } else {
    //console.log("Something got wrong ");
    //alert("Something got wrong " + status);
    //var LaLo = 0;
    //var cylat = [];
    //var cylon = [];
    //jQuery.each(objHOT, function (objHOT) {
    //    cylat.push(Number(this.PTY_Latitude))
    //    cylon.push(Number(this.PTY_Longitude))
    //    LaLo++;
    //});
    //var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
    //var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
    //delete distLats;
    //distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
    //delete ctyLatLong;
    //ctyLatLong = Number(midLat) + '|' + Number(midLon);
    //buildThumbMap();
    //    };
    //});
    //console.log("After google");
    $('#dvMapLegend').popupWindow({
        windowURL: SiteName + '/' + NAcou.replace(/\s/g, '_').toLowerCase() + '/' + NAplc.replace(/\s/g, '_').toLowerCase() + '/HotelsMap',
        windowName: 'mapPop',
        centerBrowser: 1,
        height: 920,
        width: 1020,
        resizable: 1,
        scrollbars: 1
    });
    $('#dvMapCanvas').popupWindow({
        windowURL: SiteName + '/' + NAcou.replace(/\s/g, '_').toLowerCase() + '/' + NAplc.replace(/\s/g, '_').toLowerCase() + '/HotelsMap',
        windowName: 'mapPop',
        centerBrowser: 1,
        height: 920,
        width: 1020,
        resizable: 1,
        scrollbars: 1
    });
    $('#selZone').change(function () {
        $('#hotContain').val('Type word');
        $("input[name=rad][value='1']").prop("checked", true);
        clickPG = 0;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        setTimeout(function () { applyFilter(0, 0) }, 500);
    });
    $('#hotContain').click(function () {
        this.select();
        $('#selZone').val(0);
        $('.rat:checkbox').prop("checked", false);
        $('.fav:checkbox').prop("checked", false);
        $('.rev:checkbox').prop("checked", false);
        $('.rad:radio[value=1]').prop("checked", true);
    }).keypress(function (e) {
        if (e.keyCode == 13) {
            applyFilter(0, 0);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    });
    $('.rev:checkbox').click(function () {
        $('#hotContain').val('Type word');
        $("input[name=rad][value='1']").prop("checked", true);
        clickPG = 0;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        setTimeout(function () { applyFilter(0, 0) }, 500);
    });

    $('#favorite').click(function () {
        $('#hotContain').val('Type word');
        clickPG = 0;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        setTimeout(function () { applyFilter(0, 0) }, 500);
    });
    $('.rat:checkbox').click(function () {
        $('#hotContain').val('Type word');
        $("input[name=rad][value='1']").prop("checked", true);
        clickPG = 0;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        setTimeout(function () { applyFilter(0, 0) }, 500);
    });
    $('#resetButton').click(function () {
        $('#selZone').val(0);
        $('#hotContain').val('Type word');
        $('.rat:checkbox').prop("checked", true);
        $('.fav:checkbox').prop("checked", false);
        $('.rev:checkbox').prop("checked", true);
        $('.rad:radio[value=1]').prop("checked", true);
        scroll(0, 0);
        clickPG = 0;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        setTimeout(function () { applyFilter(0, 0) }, 500);;
    });
    $('label[id*="sortBy"]').click(function (e) {
        $('label[id*="sortBy"]').removeClass('active');
        $("#" + this.id).addClass('active');
    });
    $('.rad').click(function () {
        clickPG = 0;
        var txObj;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        switch (this.value) {
            case "1":
                txObj = "Name";
                break;
            case "2":
                txObj = "Rating";
                break;
            case "3":
                txObj = "Review";
                break;
        }
        sortBy(txObj);
    });
    $('.aOnly').click(function () {
        $('#selZone').val(0);
        $('#hotContain').val('Type word');
        this.id.indexOf('chkRevw') > -1 ? $('.rat:checkbox').prop("checked", true) : $('.rat:checkbox').prop("checked", false);
        $('.fav:checkbox').prop("checked", false);
        $('.rev:checkbox').prop("checked", false);
        $('.rad:radio[value=1]').prop("checked", true);
        var chkd = this.id.split('|');
        $('#' + chkd[1].replace(' ', '') + '').prop("checked", true);
        scroll(0, 0);
        clickPG = 0;
        $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
        $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
        setTimeout(function () { applyFilter(0, 0) }, 500);
        return false;
    });
    $('.dvboxCloseImg').click(function () {
        $('.pgwSlideshow').remove();
        $('.dvHotImages').toggle();
        openMask();
    });
    $('.dvboxCloseMapOne').click(function () {
        $('.dvBigMap').html('');
        $('.dvBigMapCanvas').toggle();
        openMask();
    });
    $('#showMoreHotels').click(function () { showMoreHotels(); });
    $('.modal__close, #applyButton').click(function () {
        closeModal();
    });
    $('#modalMap').click(function () { openModalMap(); });
    $('#modalFilter').click(function () { openModalFilter(); });
    $('.dvBoxClose').click(function () { closeMapBubble(); });
    //console.log("before loadHotelList");

    loadHotelList(1, "", "", "", "", "", 1);
}

function createPagination() {
    $('.dvPaginas').pagination('destroy');
    PGtotal = Math.ceil((hotelsObj.length) / 10);
    $('.dvPaginas').pagination({
        pages: PGtotal,
        itemsOnPage: 10,
        cssStyle: 'light-theme',
        onPageClick: function (page, event) {
            scroll(0, 0);
            clickPG = 1;
            $('#updateContenedor').before('<div id="imgWait" style="padding:10px; text-align:center"><img id="imgWait" src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/></div>');
            $('#updateContenedor').animate({ 'opacity': '.0' }, 0);
            //setTimeout(function(){applyFilter(page,0)},500);
            BuildHotelList(page);
            return false;
        }
    });
};
function applyFilter(jsPg, jsSort) {
    filterList = initList;
    var jsName = $('#hotContain').val();
    console.log("jsName: " + jsName);
    if (jsName != "Type word") {
        filterList = $.grep(filterList, function (fav) {
            return (compareAccent(fav.pdL_Title).match(new RegExp(compareAccent(jsName), 'i')));
        });
    };
    var jsZone = $('#selZone').val();
    console.log("jsZone: " + jsZone);
    if (jsZone != 0) {
        filterList = $.grep(filterList, function (fav) {
            return jsZone.match(new RegExp(fav.gipH_TNZoneID));
        });
    };
    var jsRat = '';
    var jsRatC = 0
    $('.rat:checkbox').each(function () {
        this.checked ? (jsRatC == 0 ? jsRat = this.value : jsRat = jsRat + '|' + this.value) : '';
        this.checked ? jsRatC++ : '';
    });
    console.log("jsRat: " + jsRat);
    if (jsRat != '') {
        filterList = $.grep(filterList, function (rat) { return new RegExp(jsRat).test(rat.gipH_TNTournetRating.replace(/\s/g, "_").replace(/\+/g, "plus")) });
    }
    var jsRev = "";
    var jsRevC = 0;
    $('.rev:checkbox').each(function () {
        this.checked ? jsRev = (jsRevC == 0 ? jsRev = this.value.replace(/chkRevw/i, '') : jsRev = jsRev + '|' + this.value.replace(/chkRevw/i, '')) : '';
        this.checked ? jsRevC++ : '';
    });
    console.log("jsRev: " + jsRev);
    console.log("jsRevC: " + jsRevC);
    console.log("split: " + jsRev.split('|').length);
    if (jsRev.split('|').length > 1) {
        var list4_5 = [], list4 = [], list3_5 = [], list3 = [], list0_3 = [];
        jQuery.each(jsRev.split('|'), function (i, val) {
            switch (val.replace('_', '.')) {
                case '4.5':
                    list4_5 = filterList
                    list4_5 = $.grep(list4_5, function (rev) { return ((rev.ghS_FinalScore >= 4.5)) });
                    console.log("jsRlist4_5ev: " + list4_5);
                    break;
                case '4':
                    list4 = filterList
                    list4 = $.grep(list4, function (rev) { return ((rev.ghS_FinalScore.between(4.0, 4.49))) });
                    break;
                case '3.5':
                    list3_5 = filterList
                    list3_5 = $.grep(list3_5, function (rev) { return ((rev.ghS_FinalScore.between(3.5, 3.99))) });
                    break;
                case '3':
                    list3 = filterList
                    list3 = $.grep(list3, function (rev) { return ((rev.ghS_FinalScore.between(3.0, 3.49))) });
                    break;
                case '0':
                    list0_3 = filterList
                    list0_3 = $.grep(list0_3, function (rev) { return ((rev.ghS_FinalScore.between(0, 2.99))) });
                    break;
            }
        });
        filterList = [].concat.apply([], [list4_5, list4, list3_5, list3, list0_3]);
    } else {
        jsRev = jsRev.replace('_', '.')
        jsRev == 4.5 ? filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore >= 4.5)) }) : '';
        jsRev == 4 ? filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(4, 4.49))) }) : '';
        jsRev == 3.5 ? filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(3.5, 3.99))) }) : '';
        jsRev == 3 ? filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(3.0, 3.49))) }) : '';
        jsRev == '' ? '' : jsRev == 0 ? filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(0, 2.99))) }) : '';
    }
    var jsFav = "";
    $('.fav:checkbox').each(function () {
        this.checked ? jsFav = 'gipH_TNSequence > 49 and gipH_TNSequence < 60' : '';
    });
    if (jsFav != "") {
        filterList = $.grep(filterList, function (fav) { return (fav.gipH_TNSequence.between(49, 60)) })
    }
    hotelsObj = filterList;
    createPagination();
    BuildHotelList(1);
    delete filterList;
};

function StyleMapControl(controlDiv, txt) {
    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '1px solid #fff';
    controlUI.style.borderRadius = '5px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '10px';
    controlUI.style.marginRight = '5px';
    controlUI.style.textAlign = 'center';
    controlUI.title = '' + txt + '';
    controlUI.style.width = '110px';
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.color = '#333';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.lineHeight = '22px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = txt;
    controlUI.appendChild(controlText);
};

function getReview(id, title, obj) {
    openModal();
    typeModal = 'default';
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/AWSExpediaReviewHotel",
        data: JSON.stringify({ Id: id }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var sdata = data;

            var sdata = data;
            $('.modal__container').html(`<h2 class="modal__title"></h2>
                                         <div class="modal__flex">
                                             <div class="modal__left"></div>
                                             <div class="modal__right"></div>
                                         </div>`)
            if (sdata.propertyRatings == null) {
                var $TitleHotel = '<img src = "https://pictures.tripmasters.com/siteassets/d/no-review-icon.png" alt = "NoReview"></div>'
                $('.modal__title').html($TitleHotel);
            }
            else {
                $('.modal__title').html(title);

                //GuestReviews
                var lcExpediaReview = sdata.propertyRatings.guestReviews.overall >= 4.5 ? "Excellent" : sdata.propertyRatings.guestReviews.overall >= 4 ? "Very good" : sdata.propertyRatings.guestReviews.overall >= 3.5 ? "Good" : "Okay";
                var $guestReviews = $('<div style="display: inline-flex;">' +
                    '<div class="GuestRevOverAllMark">' + sdata.propertyRatings.guestReviews.overall + '</div>' +
                    '<div style="margin-left:5px;">' +
                    '<div class="GuestRevOverAllText">' + lcExpediaReview + '</div>' +
                    '<div class="GuestRevOverAllNo">' + sdata.propertyRatings.guestReviews.count + ' reviews' + '</div>' +
                    '</div>' +
                    '</div>');

                $('.modal__left').append($guestReviews);

                const { cleanliness, service, comfort, condition, location, neighborhood, amenities } = sdata.propertyRatings.guestReviews;
                const arr = [{ value: cleanliness, name: 'Cleanliness' }, { value: service, name: 'Service' }, { value: comfort, name: 'Comfort' }, { value: condition, name: 'Condition' }, { value: location, name: 'Location' }, { value: neighborhood, name: 'Neighborhood' }, { value: amenities, name: 'Amenities' }];

                const mockup = arr.map(function ({ value, name }) {
                    if (value) {
                        const w = Math.round(value * 100 / 5);
                        return (`<div>
                                    <div style="display: flex;justify-content: space-between;">
                                        <div>${name}</div>
                                        <div>${value}/5</div>
                                    </div>
                                    <div class="meter"><span style="width:${w}%;"></span></div>
                               </div>`);
                    }
                }).join('');
                $('.modal__left').append(mockup);

                //Right
                ExpediaFeedbacks = sdata.guestReviews;
                GetExpediaFeedbacks(1);
            }

            openMask();

        },
        fail: function (sender, message, details) {
            console.log("something wrong: " + sender + " | " + message + " | " + details);
        },
        error: function (xhr, desc, exceptionobj) {
            console.log("something wrong: " + xhr.responseJSON + " | " + desc + " | " + exceptionobj);
        }
    });

};
function GetExpediaFeedbacks(jpag) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var filterList = ExpediaFeedbacks;
    var pgS = (jpag - 1) * 10;
    var pgE = pgS + 9;
    var nextpage = jpag + 1;
    var TotalNo = ExpediaFeedbacks.length;
    pgE > filterList.length ? pgE = filterList.length : ''
    var totPages = Math.ceil((filterList.length) / 10)
    filterList = filterList.slice(pgS, pgE + 1);
    var strg = '';
    var jhotlist = '';
    if (filterList.length > 0) {
        jQuery.each(filterList, function (filterList) {
            var lcTextRatings = this.rating == undefined ? "" : parseInt(this.rating) == 5 ? "Excellent" : parseInt(this.rating) == 4 ? "Good" : parseInt(this.rating) == 3 ? "Okay" : parseInt(this.rating) == 2 ? "Poor" : "Terrible";
            var lcImageHotel = this.verification_source == undefined ? "" : this.verification_source.indexOf("Hotels.com") >= 0 ? "https://pictures.tripmasters.com/siteassets/d/Hotels_Logo_Horizontal_RED_RGB_TM.png" : this.verification_source.indexOf("Expedia") >= 0 ? "https://pictures.tripmasters.com/siteassets/d/ExpediaLogo_Color.png" : "https://pictures.tripmasters.com/siteassets/d/VRBO_Logo_Blue.png";
            var lcWidthImageHotel = this.verification_source == undefined ? "" : this.verification_source.indexOf("Hotels.com") >= 0 ? "70" : this.verification_source.indexOf("Expedia") >= 0 ? "49" : "49";
            var lcReviewer_name = this.reviewer_name == "Verified traveler" ? 'style="display: none;">' : '>';
            var lcTrip_reason = this.trip_reason == undefined ? 'style="display: none;">' : '>';
            var lcTravel_companion = this.travel_companion == undefined ? 'style = "display: none;" > ' : '>';
            var lcTitle = this.title == undefined ? 'style = "display: none;" > ' : '>';
            var ldDate = new Date(this.date_submitted);
            var month = ldDate.getMonth();
            var day = ldDate.getDate();
            var year = ldDate.getFullYear();
            var lcRating = this.rating == undefined ? '0' : this.rating;
            var lcReviewText = this.text == undefined ? 'No review available' : this.text;
            var lcTrip_reasonText = this.trip_reason == undefined ? '' : this.trip_reason.replace("_", " ");

            //console.log("lcTextRatings " + lcTextRatings);
            //console.log("lcImageHotel " + lcImageHotel);
            //console.log("lcReviewer_name " + lcReviewer_name);
            //console.log("lcTrip_reason " + lcTrip_reason);
            //console.log("lcTravel_companion " + lcTravel_companion);
            //console.log("lcTitle " + lcTitle);
            //console.log("Date " + monthNames[month] + ' ' + day + ' ' + year);

            var $feedback = $('<div class="review__comment fontSize12 displaynone" style="display: block;">' +
                '<div class="displayFlex justifySpaceBetween mb-10">' +
                '<div class="review__comment-header displayFlex textBlue16 font-weight-bold">' +
                '<span class="review__comment-rating">' + parseInt(lcRating) + '/5</span>' +
                '<span class="review__comment-rating_lable ml-5">' + lcTextRatings + '</span>' +
                '</div>' +
                '<div class="verification__source displayFlex">' +
                '<div class="verification__source-pic">' +
                '<img src="' + lcImageHotel + '" alt="' + lcImageHotel + '" width="' + lcWidthImageHotel + '" height="14">' +
                '</div>' +
                '<span class="displaynone">' +
                '' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="review__comment-reviewer_name textBlue14 font-weight-bold mb-10" ' + lcReviewer_name +
                this.reviewer_name +
                '</div>' +
                '<div class="review__comment-title textBlue14 font-weight-bold mb-10" ' + lcTitle +
                '"' + this.title + '"' +
                '</div>' +
                '<p class="review__comment-date_submitted textGrey">' +
                monthNames[month] + ' ' + day + ', ' + year +
                '</p>' +
                '<p class="review__comment-trip_reason textGrey font-weight-bold" ' + lcTrip_reason +
                lcTrip_reasonText +
                '</p>' +
                '<div class="review__comment-travel_companion textGrey mb-10" ' + lcTravel_companion +
                'Travel with: ' + this.travel_companion +
                '</div>' +
                '<div class="review__comment-text textGrey mb-20">' +
                lcReviewText +
                '</div>' +
                '<hr class="hrRating"/>' +
                '</div>');

            $('#dshowmore').remove();
            $('.modal__right').append($feedback);

            if (pgS + 9 < TotalNo - 1) {
                var $showmore = $('<div id="dshowmore" class="review__comments-button mt-10 mb-10">' +
                    '<button type = "button" id = "show__more-comments" onclick="GetExpediaFeedbacks(' + nextpage + ');" class= "show__more-button textBlue14 font-weight-bold">Show more reviews</button >' +
                    '</div>');
                $('.modal__right').append($showmore);
            }

        });
    }

};
function openModalMap() {
    openModal();
    typeModal = 'map';
    $('.modal__container').html('');
    $('.hotels__map > div').appendTo('.modal__container');
}
function openModalFilter() {
    openModal();
    typeModal = 'sort';
    $('.modal__container').html('');
    $('.desk-nav__sort-wrapper').appendTo('.modal__container');
    $('.hotels__filter > div').appendTo('.modal__container');
}
function openModal() {
    $('.modal__container').html('<div style="padding:15px 15px;text-align:center;"><img src="https://pictures.tripmasters.com/siteassets/d/wait.gif"></div>');
    $('#modal').removeClass('is-hidden');
    $('body').addClass('modal-open');
}
function closeModal() {
    $('#modal').addClass('is-hidden');
    $('body').removeClass('modal-open');

    switch (typeModal) {
        case 'map':
            $('.modal__container > div').appendTo('.hotels__map');
            break;
        case 'sort':
            $('.modal__container > div:first-child').appendTo('.desk-nav__sort');
            $('.modal__container > div:first-child').appendTo('.hotels__filter');
            break;
        case 'default':
            $('.modal__container').html('');
            break;
    }
}
var mskdisplay = false;
function openMask() {
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    if (mskdisplay == false) {
        $('.dvMask').css({ 'width': maskWidth, 'height': maskHeight });
        $('.dvMask').fadeIn(100);
        $('.dvMask').fadeTo("fast", 0.7);
        mskdisplay = true;
    } else {
        $('.dvMask').css({ 'width': 0, 'height': 0 });
        $('.dvMask').fadeOut(100);
        $('.dvMask').fadeTo("fast", 0);
        mskdisplay = false;
    };
};
Number.prototype.between = function (first, last) {
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
};

var hotelsObj;
var initList;

function loadHotelList(pageno, Ratings, CityZone, HotelName, FavCondition, RevCondition, SortCondition) {
    var gethotelsparams = {
        IDplc: IDplc,
        Pageno: pageno,
        Ratings: Ratings,
        HotelName: HotelName,
        Favorites: FavCondition,
        Review: RevCondition,
        CityZone: CityZone,
        Sort: parseInt(SortCondition)
    }
    var options = {};
    options.url = SiteName + "/Api/Hotels/HotelsOnPlace";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify(gethotelsparams);
    options.dataType = "json";
    options.success = function (msg) {
        initList = msg;
        hotelsObj = initList;
        BuildHotelList(1);
        createPagination()
        initSmallMap()
    };
    options.error = function (msg) {
        console.log(msg);
    };
    $.ajax(options);
}

function initSmallMap() {
    objHotels = initList;
    var LaLo = 0;
    var cylat = [];
    var cylon = [];
    jQuery.each(initList, function (initList) {
        cylat.push(Number(this.giphLatitude))
        cylon.push(Number(this.giphLongitude))
        LaLo++;
    });
    var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
    var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
    delete distLats;
    distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
    delete ctyLatLong;
    ctyLatLong = Number(midLat) + '|' + Number(midLon);
    buildThumbMap();
}
function sortBy(obj) {
    console.log(obj);
    sortList = hotelsObj; //initList;
    switch (true) {
        case /Name/i.test(obj):
            sortList = sortList.sort(function (a, b) { return b.pdL_Title < a.pdL_Title ? 1 : b.pdL_Title > a.pdL_Title ? -1 : 0 });
            break;
        case /Rating/i.test(obj):
            sortList = sortList.sort(function (a, b) { return a.gipH_TNTournetRating < b.gipH_TNTournetRating ? 1 : a.gipH_TNTournetRating > b.gipH_TNTournetRating ? -1 : 0; })
            break;
        case /Review/i.test(obj):
            sortList = sortList.sort(function (a, b) { return a.ghS_FinalScore < b.ghS_FinalScore ? 1 : a.ghS_FinalScore > b.ghS_FinalScore ? -1 : 0; })
            break;
    }
    hotelsObj = sortList;
    createPagination();
    BuildHotelList(1);
    delete sortList;
}

function BuildHotelList(pg, cls) {
    let mockup = '';
    const startIndex = cls === 'more' ? (pg - 1) * 12 : 0;
    const hotlist = hotelsObj.slice(startIndex, pg * 12);
    $('.desk-nav__num span').html(hotelsObj.length);

    if (hotlist.length > 0) {
        jQuery.each(hotlist, function () {
            let HOTtitle = this.pdL_Title;
            HOTtitle.substr(-1) === '.' ? HOTtitle = HOTtitle.replace(/.([^.]*)$/, '') : '';
            const linkDetails = `${SiteName}/${NAcou.replace(/\s/g, "_").toLowerCase()}/${NAplc.replace(/\s/g, "_").toLowerCase()}/${HOTtitle.replace(/\s/g, "_").replace("&", "and")}/hotel-${this.pdlid}`;
            const favorite = this.gipH_TNSequence > 49 && this.gipH_TNSequence < 60 ? '<img src="https://pictures.tripmasters.com/siteassets/d/favorite.gif" align="absmiddle" />' : '';
            const textStars = /Stars/g.test(this.gipH_TNTournetRating) ? this.gipH_TNTournetRating : '';
            let imgStar = '';
            switch (true) {
                case /Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                    imgStar = 'Stars_' + this.gipH_TNTournetRating.replace(/\s/g, "_");
                    if (imgStar.includes("+")) {
                        imgStar = imgStar.replace("+", "_Plus");
                    }
                    break;
                case !/Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                    imgStar = this.gipH_TNTournetRating.replace(/\s/g, "_").toLowerCase();
                    break;
            };
            const solScore = expediaNoRange(this.ghS_FinalScore);
            const NoOfReviews = this.ghS_ExpediaReviewCount > 0 ? `(<button type="button" onclick="getReview(${this.pdlid},'${this.pdL_Title}',this)">${this.ghS_ExpediaReviewCount} reviews</button>)` : '';
            let solNA = "";
            switch (solScore) {
                case 'EX':
                    solNA = "Excellent";
                    break;
                case 'VG':
                    solNA = "Very Good";
                    break;
                case 'GD':
                    solNA = "Good";
                    break;
                case 'FR':
                    solNA = "Fair";
                    break;
                case 'PO':
                    solNA = "Poor";
                    break;
            };

            mockup += `<li class="hotels__item">
                           <div class="hotels__mobile-title">
                               <h2><a href="${linkDetails}"><span>${this.pdL_Title}</span>${favorite}</a></h2>
                               <p>${this.cityZone}</p>
                           </div>
                           <div class="hotels__wrapper">
                               <div class="hotels__image">
                                   <img src="https://pictures.tripmasters.com${this.imG_Url.toLowerCase()}?growid=${this.giphid}" alt="${this.gipH_Name}"/>
                                   <a href="${linkDetails}">Details, photos, map<span>&#8250;</span></a>
                               </div>
                               <div class="hotels__info">
                                   <div class="hotels__desk-title">
                                       <h2><a href="${linkDetails}"><span>${this.pdL_Title}</span>${favorite}</a></h2>
                                       <p>${this.cityZone}</p>
                                   </div>
                                   <div class="hotels__review">
                                       <div>
                                           <img src="https://pictures.tripmasters.com/siteassets/d/${imgStar}.gif" />
                                           <span>${textStars}</span>
                                       </div>
                                       <p>
                                           <span>${this.ghS_FinalScore}</span> ${solNA} ${NoOfReviews}                         
                                       </p>
                                   </div>
                                   ${this.tnHighlights !== '' ? `<p class="hotels__text"><span>&#9751;</span>${this.tnHighlights}</p>` : ''}
                               </div>
                           </div>
                       </li>`
        });
    }
    else {
        mockup += `<div>
                       <p class="hotels__no-results">No hotels match filter criteria,<br/> please select another combination and try again.<br/> Thank you!</p>
                  </div>`
    };

    if (hotelsObj.slice(0, pg * 12).length < hotelsObj.length) {
        $('#showMoreHotels').show();
    } else {
        $('#showMoreHotels').hide();
    }
    $('#imgWait').remove();
    if (cls === 'more') {
        $('#updateContenedor').append(mockup);
    } else {
        $('#updateContenedor').html(mockup);
    }

    $("#updateContenedor").animate({ 'opacity': '1' }, 100);
};
function showMoreHotels() {
    page++;
    BuildHotelList(page, 'more');
}
function buildThumbMap() {
    var useLatLong = ctyLatLong.split('|');
    var regLat = useLatLong[0];
    var regLong = useLatLong[1];
    var mapFrame = '<iframe style="border:0;position:relative;margin-left:-40px;margin-top:-40px;"' + 'src = "https://www.google.com/maps/embed/v1/view?key=AIzaSyAd8S1lOSNhEy2FUzkGT34S1KCvadNLkz8&' + 'center=' + regLat + ',' + regLong + '&zoom=10" width="300" height="300" frameborder="0"></iframe>';
    $('#dvMapCanvas').html(mapFrame);
};

/* ----------------------------------------------------------------- */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
};
function deg2rad(deg) {
    return deg * (Math.PI / 180);
};
compareAccent = (function () {
    var getaccents = /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊË?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g;
    var tonoaccent = {
        "¹": "1", "²": "2", "³": "3", "á": "a", "à": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "a": "a", "a": "a", "a": "a", "À": "a", "Á": "a", "Â": "a", "Ã": "a", "Ä": "a", "Å": "a", "A": "a", "A": "a",
        "A": "a", "Æ": "a", "c": "c", "c": "c", "ç": "c", "©": "c", "C": "c", "C": "c", "Ç": "c", "Ð": "d", "Ð": "d", "è": "e", "é": "e", "ê": "e", "?": "e", "ë": "e", "e": "e", "e": "e", "e": "e", "e": "e",
        "e": "e", "È": "e", "Ê": "e", "Ë": "e", "?": "e", "E": "e", "E": "e", "E": "e", "E": "e", "E": "e", "€": "e", "g": "g", "G": "g", "i": "i", "ì": "i", "í": "i", "î": "i", "ï": "i", "ì": "i", "i": "i",
        "i": "i", "i": "i", "Ì": "i", "Í": "i", "Î": "i", "Ï": "i", "?": "i", "Ì": "i", "I": "i", "I": "i", "I": "i", "l": "l", "L": "l", "n": "n", "n": "n", "ñ": "n", "N": "n", "N": "n", "Ñ": "n", "ò": "o",
        "ó": "o", "ô": "o", "õ": "o", "ö": "o", "o": "o", "o": "o", "o": "o", "ø": "o", "Ò": "o", "Ó": "o", "Ô": "o", "Õ": "o", "Ö": "o", "O": "o", "O": "o", "O": "o", "Ø": "o", "Œ": "o", "r": "r", "®": "r",
        "R": "r", "š": "s", "s": "s", "?": "s", "ß": "s", "Š": "s", "S": "s", "?": "s", "ù": "u", "ú": "u", "û": "u", "ü": "u", "u": "u", "u": "u", "u": "u", "u": "u", "Ù": "u", "Ú": "u", "Û": "u", "Ü": "u",
        "U": "u", "U": "u", "U": "u", "U": "u", "ý": "y", "ÿ": "y", "Ý": "y", "Ÿ": "y", "ž": "z", "z": "z", "z": "z", "Ž": "z", "Z": "z", "Z": "z"
    };
    return function (s) {
        return (s.replace(getaccents, function (match) { return tonoaccent[match]; }));
    }
})();
function expediaNoRange(no) {
    if (no.between(4.5, 5.0)) {
        return 'EX'
    }
    else if (no.between(4.0, 4.49)) {
        return 'VG'
    }
    else if (no.between(3.5, 3.99)) {
        return 'GD'
    }

}
function openHotelPage(url) {
    window.location = url;
}