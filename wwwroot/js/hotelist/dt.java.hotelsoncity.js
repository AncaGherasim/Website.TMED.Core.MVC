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
var hotelsObj;
window.navigator.userAgent.indexOf('Firefox') > -1 ? thisBrowser = 1 : '';
$(document).ready(function () {
    NAplc = $('#placeNA').val();
    IDplc = $('#placeID').val();
    NAcou = $('#countryNA').val();
    IDcou = $('#countryID').val();
    var geocoder = new google.maps.Geocoder();
    BuildFiltersList();
    getHotelPlacePackagesIdeas(IDplc);
    buildThumbMap();
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
});
function UpdateHotelList() {
    $('#updateContenedor').html('');
    $('#showMoreHotels').hide();
    page = 1;
    loadHotelList(1);
}
async function BuildFiltersList() {
    try {

        $('#selZone').change(function () {
            $('#hotContain').val('Type word');
            $("input[name=rad][value='1']").prop("checked", true);
            clickPG = 0;
            UpdateHotelList();
        });
        $('#hotContain').click(function () {
            this.select();
            $('#selZone').val(-1);
            $('.rat:checkbox').prop("checked", false);
            $('.fav:checkbox').prop("checked", false);
            $('.rev:checkbox').prop("checked", false);
            $('.rad:radio[value=1]').prop("checked", true);
        }).keypress(function (e) {
            if (e.keyCode == 13) {
                UpdateHotelList();
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });
        $('.rev:checkbox').click(function () {
            $('#hotContain').val('Type word');
            $("input[name=rad][value='1']").prop("checked", true);
            clickPG = 0;
            UpdateHotelList();
        });
        $('#favorite').click(function () {
            $('#hotContain').val('Type word');
            clickPG = 0;
            UpdateHotelList();
        });
        $('.rat:checkbox').click(function () {
            $('#hotContain').val('Type word');
            $("input[name=rad][value='1']").prop("checked", true);
            clickPG = 0;
            UpdateHotelList();
        });
        $('#resetButton').click(function () {
            $('#selZone').val(-1);
            $('#hotContain').val('Type word');
            $('.rat:checkbox').prop("checked", true);
            $('.fav:checkbox').prop("checked", false);
            $('.rev:checkbox').prop("checked", true);
            $('.rad:radio[value=1]').prop("checked", true);
            scroll(0, 0);
            clickPG = 0;
            UpdateHotelList();
        });
        $('label[id*="sortBy"]').click(function (e) {
            $('label[id*="sortBy"]').removeClass('active');
            $("#" + this.id).addClass('active');
        });
        $('.aOnly').click(function () {
            $('#selZone').val(-1);
            $('#hotContain').val('Type word');
            this.id.indexOf('chkRevw') > -1 ? $('.rat:checkbox').prop("checked", true) : $('.rat:checkbox').prop("checked", false);
            $('.fav:checkbox').prop("checked", false);
            $('.rev:checkbox').prop("checked", false);
            $('.rad:radio[value=1]').prop("checked", true);
            var chkd = this.id.split('|');
            $('#' + chkd[1].replace(' ', '') + '').prop("checked", true);
            scroll(0, 0);
            clickPG = 0;
            UpdateHotelList();
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
        $('.dvRevClose').click(function () {
            $('.dvReviewInfoLeft').html('');
            $('.dvReviewInfoRight').html('');
            $('.dvReviewTitle').html('');
            $('#dvRevContainer').toggle();
            openMask();
        });
        $('.dvBoxClose').click(function () { closeMapBubble(); });
        $('.rad').click(function () {
            UpdateHotelList();
        });
        $('#showMoreHotels').click(function () { showMoreHotels(); });
        $('.modal__close, #applyButton').click(function () {
            closeModal();
        });
        $('#modalMap').click(function () { openModalMap(); });
        $('#modalFilter').click(function () { openModalFilter(); });
    }
    catch (error) { console.error('BuildFiltersList error:', error); }
}
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
        url: SiteName + "/Api/getDataExpediaReviewHotel",
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
async function loadHotelList(pageno) {
    var HotelName = "";
    var isHotelName = false;
    if ($('#hotContain').val() != "Type word") {
        HotelName = $('#hotContain').val();
        isHotelName = true;
    };

    var CityZone = 0;
    var isCityZone = false;
    if ($('#selZone').val() != -1) {
        CityZone = $('#selZone').val();
        isCityZone = true;
    };

    var Ratings = [];
    var jsRat = '';
    var jsRatC = 0;
    var jsRatCT = 0;
    var isRatings = false;
    $('.rat:checkbox').each(function () {
        this.checked ? (jsRatC == 0 ? jsRat = this.value : jsRat = jsRat + ',' + this.value) : '';
        this.checked ? jsRatC++ : '';
        jsRatCT++;
    });
    if (jsRat != '' && jsRatC != jsRatCT) {
        isRatings = true;
        var arrRat = jsRat.split(',');
        arrRat.forEach(function (item) {
            Ratings.push(item.replace(/_/g, " ").replace(/plus/g, "+"));
        });
    }

    var Reviews = [];
    var jsRev = "";
    var jsRevC = 0;
    var jsRevCT = 0;
    $('.rev:checkbox').each(function () {
        this.checked ? jsRev = (jsRevC == 0 ? jsRev = this.value.replace(/chkRevw/i, '') : jsRev = jsRev + ',' + this.value.replace(/chkRevw/i, '')) : '';
        this.checked ? jsRevC++ : '';
        jsRevCT++;
    });
    if (jsRev != '' && jsRevC != jsRevCT) {
        var arrRev = jsRev.split(',');
        arrRev.forEach(function (item) {
            Reviews.push(item);
        });
    }

    var isFavorite = false;
    var jsFav = "";
    $('.fav:checkbox').each(function () {
        this.checked ? isFavorite = true : false;
    });

    $('#hotelList').append('<div id="loadingAcco" style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
    var sort = 1;
    $('.rad').each(function () {
        if ($(this).prop('checked') == true) {
            sort = $(this).prop('value');
        }
    });

    var options = {};
    var gethotelsparams = {
        PlaceId: IDplc,
        PageNo: pageno,
        RatingsList: Ratings,
        HotelName: HotelName,
        isHotelName: isHotelName,
        isFavorite: isFavorite,
        isRatings: isRatings,
        isCityZone: isCityZone,
        ReviewsList: Reviews,
        CityZone: CityZone,
        Sort: sort
    }
    try {
        options.traditional = true;
        options.url = SiteName + "/Api/Hotels/HotelsOnPagePgs";
        options.type = "GET";
        options.data = gethotelsparams,
            options.dataType = "json";
        options.cache = false;
        options.success = function (data) {
            hotelsObj = data;
            BuildHotelList(pageno);
            $('#loadingAcco').remove();
        };
        options.error = function (xhr, desc, exceptionobj) {
            console.log("Call HotelsOnPagePgs error: " + xhr.responseText);
        };
        $.ajax(options);
    }
    catch (error) { console.error('HotelsOnPagePgs error:', error); }
}
function BuildHotelList(pg, cls) {
    let mockup = '';
    const hotlist = hotelsObj;
    if (hotlist.length > 0) {
        $('.desk-nav__num span').html(hotelsObj[0].totalCount);
        $('.mobile-nav__num span').html(hotelsObj[0].totalCount);
        jQuery.each(hotlist, function () {
            let HOTtitle = this.pdl_title;
            HOTtitle.substr(-1) === '.' ? HOTtitle = HOTtitle.replace(/.([^.]*)$/, '') : '';
            const linkDetails = `${SiteName}/${NAcou.replace(/\s/g, "_").toLowerCase()}/${NAplc.replace(/\s/g, "_").toLowerCase()}/${HOTtitle.replace(/\s/g, "_").replace("&", "and").toLowerCase()}/hotel-${this.pdlid}`;
            const favorite = this.giph_tnsequence > 49 && this.giph_tnsequence < 60 ? '<img src="https://pictures.tripmasters.com/siteassets/d/favorite.gif" align="absmiddle" />' : '';
            const textStars = /Stars/g.test(this.giph_tntournetrating) ? this.giph_tntournetrating : '';
            let imgStar = '';
            switch (true) {
                case /Stars|Lodge|Cruise/g.test(this.giph_tntournetrating):
                    imgStar = 'Stars_' + this.giph_tntournetrating.replace(/\s/g, "_");
                    if (imgStar.includes("+")) {
                        imgStar = imgStar.replace("+", "_Plus");
                    }
                    break;
                case !/Stars|Lodge|Cruise/g.test(this.giph_tntournetrating):
                    imgStar = this.giph_tntournetrating.replace(/\s/g, "_").toLowerCase();
                    break;
            };
            const solScore = expediaNoRange(this.ghs_finalscore);
            const NoOfReviews = this.ghs_expediareviewcount > 0 ? `(<button type="button" onclick="getReview(${this.pdlid},'${this.pdl_title}',this)">${this.ghs_expediareviewcount} reviews</button>)` : '';
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

            var imG_Url = this.img_500path_url || this.img_path_url || "";

            var cityZone = this.cityzone;
            if (cityZone == null) cityZone = "----";
            mockup += `<li class="hotels__item">
                           <div class="hotels__mobile-title">
                               <h2><a href="${linkDetails}"><span>${this.pdl_title}</span>${favorite}</a></h2>
                               <p>${this.cityzone}</p>
                           </div>
                           <div class="hotels__wrapper">
                               <div class="hotels__image">
                                   <img src="https://pictures.tripmasters.com${imG_Url.toLowerCase()}?growid=${this.giphid}"/>
                                   <a href="${linkDetails}">Details, photos, map<span>&#8250;</span></a>
                               </div>
                               <div class="hotels__info">
                                   <div class="hotels__desk-title">
                                       <h2><a href="${linkDetails.toLowerCase()}"><span>${this.pdl_title}</span>${favorite}</a></h2>
                                       <p>${cityZone}</p>
                                   </div>
                                   <div class="hotels__review">
                                       <div>
                                           <img src="https://pictures.tripmasters.com/siteassets/d/${imgStar}.gif" />
                                           <span>${textStars}</span>
                                       </div>
                                       <p>
                                           <span>${this.ghs_finalscore}</span> ${solNA} ${NoOfReviews}                         
                                       </p>
                                   </div>
                                   ${this.tnhighlights !== '' ? `<p class="hotels__text"><span>&#9751;</span>${this.tnhighlights}</p>` : ''}
                               </div>
                           </div>
                       </li>`
        });
    }
    else {
        $('.desk-nav__num span').html(0);
        $('.mobile-nav__num span').html(0);
        mockup += `<div>
                       <p class="hotels__no-results">No hotels match filter criteria,<br/> please select another combination and try again.<br/> Thank you!</p>
                  </div>`
    };

    if (hotlist.length > 0) {
        if (pg * 12 < hotelsObj[0].totalCount) {
            $('#showMoreHotels').show();
        } else {
            $('#showMoreHotels').hide();
        }
    }
    $('#imgWait').remove();
    $('#updateContenedor').append(mockup);
    $("#updateContenedor").animate({ 'opacity': '1' }, 100);
};
function showMoreHotels() {
    page++;
    loadHotelList(page);
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
    else if (no.between(3.0, 3.49)) {
        return 'FR'
    }
    else if (no.between(0, 2.99)) {
        return 'PO'
    }
}
function openHotelPage(url) {
    window.location = url;
}

function compareCityZone(a, b) {
    if (a.cityZone < b.cityZone) {
        return -1;
    }
    if (a.cityZone > b.cityZone) {
        return 1;
    }
    return 0;
}

function comparegipH_TNTournetRating(a, b) {
    if (a.GIPH_TNTournetRating < b.GIPH_TNTournetRating) {
        return 1;
    }
    if (a.GIPH_TNTournetRating > b.GIPH_TNTournetRating) {
        return -1;
    }
    return 0;
}

function compareGHS_FinalScore(a, b) {
    if (a.ghS_FinalScore < b.ghS_FinalScore) {
        return 1;
    }
    if (a.ghS_FinalScore > b.ghS_FinalScore) {
        return -1;
    }
    return 0;
}
function getHotelPlacePackagesIdeas(pid) {
    var options = {};
    var oId = {
        Id: parseInt(pid)
    }
    try {
        options.traditional = true;
        options.url = SiteName + "/Api/Hotels/HotelPlacePackagesIdeas";
        options.type = "GET";
        options.data = oId,
            options.dataType = "json";
        options.cache = false;
        options.success = function (data) {
            objListPrices = data;
            if (objListPrices.length > 0) {
                var listPacks = '';
                objListPrices.slice(0, 4).forEach((pr) => {
                    listPacks += '<li>';
                    listPacks += '<a href="' + SiteName + '/' + pr.CountryName.replace(/ /g, '_').toLowerCase() + '/' + pr.PDL_Title.replace(/ /g, '_').toLowerCase() + '/package-' + pr.PDLID + '">' + pr.PDL_Title;
                    listPacks += '</a>';
                    listPacks += '<p>' + pr.PDL_Duration + ' nights from <span>' + formatCurrency(pr.STP_Save, 0) + '*</span></p>';
                    listPacks += '</li>';
                });
                listPacks += '</ul>';

                $('.hotels__packages-list').append(listPacks);
            }
        };
        options.error = function (xhr, desc, exceptionobj) {
            console.log("Call getHotelPlacePackagesIdeas error: " + xhr.responseText);
        };
        $.ajax(options);
    }
    catch (error) { console.error('getHotelPlacePackagesIdeas error:', error); }
};
function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = '0';
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10) cents = '0' + cents;
    var untilTO = Math.floor(num.length);
    untilTO = Number(untilTO) - 1;
    for (var i = 0; i < Math.floor(Number(untilTO + i) / 3); i++)
        num = num.substring(0, Number(num.length) - (4 * i + 3)) + ',' + num.substring(Number(num.length) - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num);
};

