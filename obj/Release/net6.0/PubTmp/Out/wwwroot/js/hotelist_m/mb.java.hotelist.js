var $loader = "<div class='loader'></div>";
var hotObj;
var page = 1;
var prevInt = 0;
var nxtPg = 1;
var initHotObj;
var facilPropC = 0;
var facilRoomC = 0;
var roomType = '';
var propType = '';
var map;
var distLats;
var isNumber = /[0-9]+/g;
var totPag;
var plcID = $('#plcID').val();
$(document).ready(function () {
    $('.Page').hide();
    $('.hotelist').html($loader);

    init();
    getFacilities();
    $(document).on('click', '.getReview', function (e) {
        e.preventDefault();
        getTrustRev(this);
    });
    //$('.selPage option:eq(0)').attr('selected', "selected");
    $(document).on('click', '.pageNext, .pagePrev', function (e) {
        e.preventDefault();
        pagination(this, this);
    });
    $('.selPage').change(function () {
        pagination(this.val, this);
    });
    $(document).on('show.bs.collapse', '#dvMHOMap', function () {
        $('#dvMHOMap').html() == '' ? initMap() : '';
    });
    $(document).on('show.bs.collapse', '#dvRoomFacil', function () {
        $('.btnRoomFacil').hide();
    });
    $(document).on('hidden.bs.collapse', '#dvRoomFacil', function () {
        $('.btnRoomFacil').show();
    });
    $(document).on('show.bs.collapse', '#dvHotelFacil', function () {
        $('.btnHotelFacil').hide();
    });
    $(document).on('hidden.bs.collapse', '#dvHotelFacil', function () {
        $('.btnHotelFacil').show();
    });
    $(document).on('hidden.bs.modal', '#revTrustYou', function () {
        $('.dvExpediaRev').html('');
    });
    $(document).on('click', '.btnSortby', function () {
        $('.btnSortby').removeClass('btn-primary').addClass('btn-secondary');
        $(this).removeClass('btn-secondary').addClass('btn-primary');
        sortBy(this.textContent);
    });
    $(document).on('change', '#selZone', function () {
        filteronly(this);
    });
    $(document).on('click', '.aOnly', function () { filteronly(this); });
    $(document).on('click', '#butGO', function () { filteronly(this); });
    $(document).on('click', '.btnReset', function () { resetFilters(); });
    $(document).on('click', '.btnApply', function () { applyFilters(); });
});
function init() {
    NAcou = $('#countryNA').val();
    NAplc = $('#placeNA').val();
    var dt = { Id: plcID };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/AllHotelsByPlace/",
        data: JSON.stringify(dt),
        contentType: 'application/json; charset=UTF-8',
        success: function (data) {
            hotObj = data;
            initHotObj = hotObj;
            createPagination();
            builtHotelList();
        },
        error: function (xhr, desc, exceptionobj) {
            //$('#' + dvHtml + '').html(xhr.responseText);
            console.log(xhr.responseText);
        }
    });
    //$('.getReview').click(function (event) { event.preventDefault(); getTrustRev(this.id); });
}

function getFacilities() {
    var dt = { Id: plcID };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/GetHotelsFacilities/",
        data: JSON.stringify(dt),
        contentType: "application/json; charset=UTF-8",
        success: function (dt) {
            buildFacilities(dt);
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
}

function gethotelsidsbyfacilid(fid, plcid, typeid, nam, obj) {
    var idshotl
    var sfid = fid.join();
    var dt = { FacilID: sfid, PlcID: plcid, TypeId: typeid };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/GetHotelsByFacilityID/",
        data: JSON.stringify(dt),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: function (dt) {
            var data = JSON.parse(dt);
            idshotl = data[0].name;
            var filterLabel;
            if (nam != 'none') {
                var filterList = [];
                filterList = hotObj;
                filterList = $.grep(filterList, function (fav) { return idshotl.match(new RegExp(fav.pdlid)) });
                //$('.dvMHOeach').html('<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + nam + '"</p>')
                filterLabel = '<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + nam + '"</p>';
            } else {
                var filterList = [];
                filterList = obj;
                filterList = $.grep(filterList, function (fav) { return idshotl.match(new RegExp(fav.pdlid)) });
                //$('.dvMHOeach').append('<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match sort & filter criteria</p>')
                filterLabel = '<p class="pMHOsrtfilLabel"> ' + filterList.length + ' properties match sort & filter criteria </p>';
            };
            hotObj = filterList;
            $('.header').html(filterLabel);
            createPagination();
            builtHotelList();
            delete filterList;
            $('#filterSort').modal('hide');
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    })
}

function builtHotelList() {
    $('.hotelist').html('');
    var nx = page * 10;
    var listH = "";
    var int = prevInt * nxtPg * 10;
    var hotlist = hotObj.slice(int, nx);
    $.each(hotlist, function () {
        listH = listH + "<div class='row mx-auto bg-white mb-2'><div class='col-12 pl-1 pr-1 dvHotelTitle'>" + this.pdL_Title + "</div>" +
            "<div class='col-12 pl-1 pr-1 pb-2 dvHotelArea'>" + this.cityZone + "</div><div class='col-12'>" +
            "<div class='row'><div class='col-4 pl-1 pr-0'><img class='img-fluid' src='https://pictures.tripmasters.com" + this.imG_Path_URL.toLowerCase() + "?growid=" + this.giphid + "'/></div>" +
            "<div class='col-8 pr-1 '><div class='row mx-auto'>";
            //"</div>";
        var imgSrcCode = '';
        switch (true) {
            case /Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                imgSrcCode = 'Stars_' + this.gipH_TNTournetRating.replace(/\s/g, "_");
                break;
            case !/Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                imgSrcCode = this.gipH_TNTournetRating.replace(/\s/g, "_").toLowerCase();
                break;
        }
        var textStars = /Stars/g.test(this.gipH_TNTournetRating) ? this.gipH_TNTournetRating : '';
        listH = listH + "<div><img class='img-fluid align-middle' src='https://pictures.tripmasters.com/siteassets/d/" + imgSrcCode.replace(/\+/g, "_Plus") + ".gif'/><span class='pl-1 align-middle'>" + textStars +"</span>";
        if (this.pdL_SequenceNo > 49 && this.pdL_SequenceNo < 60) {
            listH = listH + "<img class='img-fluid align-middle pl-2' src='https://pictures.tripmasters.com/siteassets/d/favorite.gif' />";
        }
        listH = listH + '</div>';
        if (this.ghS_FinalScore != 0) {
            var solNA = "";
            var clsNA = "";
            var scrST = this.ghS_FinalScore;
            var solScore = expediaNoRange(this.ghS_FinalScore);
            switch (solScore) {
                case 'EX':
                    solNA = "Excellent";
                    clsNA = "EX";
                    break;
                case 'VG':
                    solNA = "Very Good";
                    clsNA = "VG";
                    break;
                case 'GD':
                    solNA = "Good";
                    clsNA = "GD";
                    break;
                case 'FR':
                    solNA = "Fair";
                    clsNA = "FR";
                    break;
                case 'PO':
                    solNA = "Poor";
                    clsNA = "PO";
                    break;
                case 'NA':
                    solNA = "No Review available";
                    clsNA = "NA";
                    scrST = 'NA';
                    break;
            }
            listH = listH + '<div><span><b>' + scrST + '/5 </b>' + solNA + '</span> ' 
            if (this.ghS_ExpediaReviewCount != 0)
                listH = listH + '<a href="#" class="getReview" id="' + this.pdlid + '" data-title="' + this.pdL_Title + '"><span>(' + this.ghS_ExpediaReviewCount + ' reviews)</span></a></div>';
            else {
                listH = listH + '</div>';
            }
        } 
        listH = listH + '</div></div>'
        if (this.gipH_TNHighlights != '') {
            listH = listH + "<div class='col-12'><img src='https://pictures.tripmasters.com/siteassets/d/bluetag.gif'/> " + this.gipH_TNHighlights + "</div>";
        }
        listH = listH + "";
        listH = listH + "<div class='col-12 pt-3 pb-2 pr-1'><a href='" + SiteName + "/" + NAcou.replace(/\s/g, "_").toLowerCase() + "/" + NAplc.replace(/\s/g, "_").toLowerCase() + "/" + this.pdL_Title.replace(/\s/g, "_").replace("&", "and").toLowerCase()  + "/hotel-" + this.pdlid + "' role='button' class='btn btn-primary float-right aDet'>Details, photos, map</a></div>"
        listH = listH + "</div></div></div>";
        $('.getReview').click(function (event) { event.preventDefault(); getTrustRev(this); });
    });
    $('.hotelist .loader').remove();
    $('.hotelist').append(listH);
}

function buildFacilities(d) {
    var listFilter = [];
    listFilter = d;
    //** Room Facilities **//
    var roomfacil = $.grep(listFilter, function (rom) {
        return (rom.facilityStrType.match(new RegExp('Room', 'i')));
    });
    var frc = 0;
    facilRoomC = roomfacil.length;
    if (roomfacil.length > 0) {
        var facilOnRoom = '';
        $.each(roomfacil, function () {
           roomType = this.sourceNA
           facilOnRoom = facilOnRoom + "<div class='col-12 pl-0 pr-0 clearfix'>" +
                "<input type='checkbox' class='rom' id='chkroom" + this.facilID + "' value='" + this.facilID + "' checked='checked'/>" +
                "<label for='chkroom" + this.facilID + "' class='css-label rev elegant float-left'>" + this.facilityName + "</label>" +
                "<button type='button' class='btn btn-link float-right pt-0 pb-0 aOnly' id='rom|chkroom" + this.facilID + "|" + this.sourceNA + "|" + this.facilityName + "'><u>only</u></button>" +
                "</div>";
            frc++;
            frc == 5 ? facilOnRoom = facilOnRoom + "<button class='btn btn-link btnRoomFacil' data-toggle='collapse' data-target='#dvRoomFacil' aria-expanded='false'>show more</button><div class='collapse' id='dvRoomFacil'>" : '';
            //facilOnRoom = facilOnRoom + "<p>" + this.facilityName + "</p>";

        });
        frc > 5 ? facilOnRoom = facilOnRoom + "<button class='btn btn-link' data-toggle='collapse' data-target='#dvRoomFacil'>hide more facilities</button></div>" : '';
    }
    $('.dvFac').append(facilOnRoom);
    //** Hotel facilities **//
    var hotfacil = $.grep(listFilter, function (hot) { return (hot.facilityStrType == 'Facilities' || hot.facilityStrType == 'Property'); });
    var fhc = 0;
    facilPropC = hotfacil.length;
    if (hotfacil.length > 0) {
        var facilOnHotel = '';
        $.each(hotfacil, function () {
            propType = this.sourceNA
            facilOnHotel = facilOnHotel + "<div class='col-12 pl-0 pr-0 clearfix'>" +
                "<input type='checkbox' class='pro' id='chkprop" + this.facilID + "' value='" + this.facilID + "' checked='checked'/>" +
                "<label for='chkprop" + this.facilID + "' class='css-label pro elegant float-left'>" + this.facilityName + "</label>" +
                "<button type='button' class='btn btn-link float-right pt-0 pb-0 aOnly' id='pro|chkprop" + this.facilID + "|" + this.sourceNA + "|" + this.facilityName + "'><u>only</u></button>" +
                "</div>";
            fhc++;
            fhc == 5 ? facilOnHotel = facilOnHotel + "<button class='btn btn-link btnHotelFacil' data-toggle='collapse' data-target='#dvHotelFacil' aria-expanded='false'>show more</button><div class='collapse' id='dvHotelFacil'>" : '';
        });
        fhc > 5 ? facilOnHotel = facilOnHotel + "<button class='btn btn-link' data-toggle='collapse' data-target='#dvHotelFacil'>hide more facilities</button></div>" : '';
    }
    $('.dvHotelFacil').append(facilOnHotel);
}

function getTrustRev(obj) {
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/AWSExpediaReviewHotel",
        data: JSON.stringify({ Id: parseInt(obj.id) }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var dt = data;

            $('.dvExpediaRev').append('<p class="pMHOhotrevtitle">' + obj.dataset.title + '</p>');

            if (dt.propertyRatings == null) {
                var $norev = $('<div><img src = "https://pictures.tripmasters.com/siteassets/d/no-review-icon.png" alt = "NoReview"></div>')
                $('.dvExpediaRev').append($norev);
            } else {
                $('.dvExpediaRev').append('<div class="dvHotRevScores row"></div>');
                $('.dvExpediaRev').append('<div class="dvHotRevFeedbacks row"></div>')
                //GuestReviews
                var expediaReview = dt.propertyRatings.guestReviews.overall >= 4.5 ? "Excelent" : dt.propertyRatings.guestReviews.overall >= 4 ? "Very good" : dt.propertyRatings.guestReviews.overall >= 3.5 ? "Good" : "Okay";
                var $guestReview = $('<div class="review_comment_overall col-12"><span>' + dt.propertyRatings.guestReviews.overall + '/5 ' + expediaReview + '</span>' +
                    '<span>' + dt.propertyRatings.guestReviews.count + ' reviews</span></div>');
                $('.dvHotRevScores').append($guestReview);
                //Cleanliness
                if (dt.propertyRatings.guestReviews.cleanliness != undefined) {
                    var $clean = $('<div class="prop-pbar col-12"><div class="scRating"><span>Cleanliness</span><span>' + dt.propertyRatings.guestReviews.cleanliness + '/5</span></div>' +
                        '<progress id="clean" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.cleanliness + '"></progress></div>');
                    $('.dvHotRevScores').append($clean);
                }

                //Service
                if (dt.propertyRatings.guestReviews.service != undefined) {
                    var $service = $('<div class="prop-pbar col-12"><div class="scRating"><span>Service</span>' + dt.propertyRatings.guestReviews.service + '/5</span></div>' +
                        '<progress id="service" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.service + '"></progress></div>');
                    $('.dvHotRevScores').append($service);
                }

                //Comfort
                if (dt.propertyRatings.guestReviews.comfort != undefined) {
                    var $comfort = $('<div class="prop-pbar col-12"><div class="scRating"><span>Comfort</span>' + dt.propertyRatings.guestReviews.comfort + '/5</span></div>' +
                        '<progress id="confort" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.comfort + '"></progress></div>');
                    $('.dvHotRevScores').append($comfort);
                }

                //Condition
                if (dt.propertyRatings.guestReviews.condition != undefined) {
                    var $condition = $('<div class="prop-pbar col-12"><div class="scRating"><span>Condition</span>' + dt.propertyRatings.guestReviews.condition + '/5</span></div>' +
                        '<progress id="condition" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.condition + '"></progress></div>');
                    $('.dvHotRevScores').append($condition);
                }

                //Location
                if (dt.propertyRatings.guestReviews.location != undefined) {
                    var $location = $('<div class="prop-pbar col-12"><div class="scRating"><span>Location</span>' + dt.propertyRatings.guestReviews.location + '/5</span></div>' +
                        '<progress id="location" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.location + '"></progress></div>');
                    $('.dvHotRevScores').append($location);
                }

                //Neighborhood
                if (dt.propertyRatings.guestReviews.neighborhood != undefined) {
                    var $neighborhood = $('<div class="prop-pbar col-12"><div class="scRating"><span>Neighborhood</span>' + dt.propertyRatings.guestReviews.neighborhood + '/5</span></div>' +
                        '<progress id="neighborhood" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.neighborhood + '"></progress></div>');
                    $('.dvHotRevScores').append($neighborhood);
                }

                //Amenities
                if (dt.propertyRatings.guestReviews.amenities != undefined) {
                    var $amenities = $('<div class="prop-pbar col-12"><div class="scRating"><span>Amenities</span>' + dt.propertyRatings.guestReviews.amenities + '/5</span></div>' +
                        '<progress id="amenities" class="pbar" max="5" value="' + dt.propertyRatings.guestReviews.amenities + '"></progress></div>');
                    $('.dvHotRevScores').append($amenities);
                }

                ExpediaFeedbacks = dt.guestReviews;
                expediaFeedbacks(1);
            }

        },
        fail: function (sender, message, details) {
            console.log("something wrong: " + sender + " | " + message + " | " + details);
        },
        error: function (xhr, desc, exceptionobj) {
            console.log("something wrong: " + xhr.responseJSON + " | " + desc + " | " + exceptionobj);
        }
    });
    //var hotList = hotObj;
    //hotList = $.grep(hotObj, function (h) { return h.pdlid == id; });
    //var iframe = "<div class='col pl-0 pr-0'><iframe class='w-100 mx-auto ifrTrustYou' src='https://api.trustyou.com/hotels/" + hotList[0].gipC_HotelCode + "/meta_review.html?key=922b057b-9203-4a3c-8e66-888c1d15119e&detail=normal' allowtransparency='true' frameborder='0'></iframe></div>";
    $('#revTrustYou').modal('toggle');
    //$('.dvExpediaRev').html(iframe);
}
function expediaFeedbacks(pg) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var filterList = ExpediaFeedbacks;
    var pgS = (pg - 1) * 10;
    var pgE = pgS + 9;
    var nextpg = pg + 1;
    var totalFeed = ExpediaFeedbacks.length;
    pgE > filterList.length ? pgE = filterList.length : ''
    var totPages = Math.ceil((filterList.length) / 10);
    filterList = filterList.slice(pgS, pgE + 1);
    if (filterList.length > 0) {
        $.each(filterList, function () {
            var fdRating = this.rating == undefined ? '0' : this.rating;
            var fdTextRating = this.rating == undefined ? "" : parseInt(this.rating) == 5 ? "Excellent" : parseInt(this.rating) == 4 ? "Good" : parseInt(this.rating) == 3 ? "Okay" : parseInt(this.rating) == 2 ? "Poor" : "Terrible";
            var fdImageHotel = this.verification_source == undefined ? "" : this.verification_source.indexOf("Hotels.com") >= 0 ? "https://pictures.tripmasters.com/siteassets/d/Hotels_Logo_Horizontal_RED_RGB_TM.png" : this.verification_source.indexOf("Expedia") >= 0 ? "https://pictures.tripmasters.com/siteassets/d/ExpediaLogo_Color.png" : "https://pictures.tripmasters.com/siteassets/d/VRBO_Logo_Blue.png";
            var fdReviewer_name = this.reviewer_name == "Verified traveler" ? ' style="display: none;">' : '>';
            var fdTitle = this.title == undefined ? ' style = "display: none;"> ' : '>';
            var fdTrip_reason = this.trip_reason == undefined ? ' style="display: none;">' : '>';
            var fdTravel_companion = this.travel_companion == undefined ? ' style = "display: none;" > ' : '>';
            var fdDate = new Date(this.date_submitted);
            var month = fdDate.getMonth();
            var day = fdDate.getDate();
            var year = fdDate.getFullYear();
            var $fdReviewText = this.text == undefined ? 'No review available' : this.text;
            var $feedbacks = $('<div class="review_comment col-12"><div class="review_rating"><div><span>' + parseInt(fdRating) + '/5 </span><span>' + fdTextRating + '</span></div><div><img src="' + fdImageHotel + '" alt="' + fdImageHotel + '" /></div></div>' +
                '<div class="review_comment_name"' + fdReviewer_name + this.reviewer_name + '</div>' +
                '<div class="review_comment_title"' + fdTitle + '"' + this.title + '"' + '</div>' +
                '<div class="review_comment_date">' + monthNames[month] + ' ' + day + ', ' + year + '</div>' +
                '<div class="review_comment_reason"' + fdTrip_reason + this.trip_reason + '</div>' +
                '<div class="review_comment_companion"' + fdTravel_companion + ' Travel with: <span>' + this.travel_companion + '</span></div>' +
                '<div class="review_comment_text">' + $fdReviewText + '</div></div>');

            $('#dshowmore').remove();
            $('.dvHotRevFeedbacks').append($feedbacks);
            if (pgS + 9 < totalFeed) {
                var $showmore = $('<div id="dshowmore" class="review__comments-button col-12">' +
                    '<button type = "button" id = "show_more-comments" onclick="expediaFeedbacks(' + nextpg + ');" class= "show_more-button">Show more reviews</button >' + '</div>');
                $('.dvHotRevFeedbacks').append($showmore);
            }
        })
    }
}

function createPagination() {
    prevInt = 0;
    totPag = Math.ceil(hotObj.length / 10);
    $('.totPag').text('Total: ' + totPag);
    var opt = '';
    for (i = 1; i <= totPag; i++) {
        opt = opt + '<option value="' + i + '">' + i + '</option>';
    }
    $('.selPage').html(opt);
    $('.Page').removeClass('d-none').removeAttr('style');
    $('.pagePrev').parent().addClass('disabled');
    if (totPag == 1) {
        $('.pageNext').parent().addClass('disabled');
    }
    else {
        $('.pageNext').parent().removeClass('disabled');
    }
}

function pagination(n, othis) {
    //var pg = $('.selPage').val();
    $('.pagePrev').parent().removeClass('disabled');
    $('.pageNext').parent().removeClass('disabled');
    var pg;
    pg = othis.value;
    if (n === undefined) {
        prevInt = pg - 1;
        page = pg;
        if (pg == 1) {
            $('.pagePrev').parent().addClass('disabled');
        }
        if (pg == totPag) {
            $('.pageNext').parent().addClass('disabled');
        }
        $('.selPage option').each(function () {
            if ($(this).val() != pg) {
                $(this).removeAttr('selected');
            } else if ($(this).val() == pg) {
                //$(this).attr('selected', 'selected');
                $(this).prop("selected", "selected");
            }
        })
    } else {
        pg = parseInt($('.selPage').val());
        if (n.id === "pagePrev") {
            if (pg === 0) { return; }
            var sel = pg - 1;
            page = sel;
            prevInt = page - 1;
            if (sel == 1) {
                $('.pagePrev').parent().addClass('disabled');
            }
            $('.selPage option').each(function () {
                if ($(this).val() == pg) {
                    $(this).removeAttr('selected');
                } else if ($(this).val() == sel) {
                    //$(this).attr('selected', 'selected');
                    $(this).prop("selected", "selected");
                }
            })
        } else if (n.id === "pageNext") {
            $('.pagePrev').parent().removeClass('disabled');
            page = pg + 1;
            prevInt = page - 1;
            var selbk = page - 2;
            if (page == totPag) {
                $('.pageNext').parent().addClass('disabled');
            }
            $('.selPage option').each(function () {
                if ($(this).val() == pg) {
                    $(this).removeAttr('selected');
                } else if ($(this).val() == page) {
                    //$(this).attr('selected', 'selected');
                    $(this).prop("selected", "selected");
                }
            })
        }
    }
    //init();
    builtHotelList();
}

Number.prototype.between = function (first, last) {
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
};

function numberRange(num) {
    if (num.between(86, 100)) {
        return 'EX';
    }
    else if (num.between(80, 85)) {
        return 'VG';
    }
    else if (num.between(75, 79)) {
        return 'GD';
    }
    else if (num.between(68, 74)) {
        return 'FR';
    }
    else if (num.between(0, 67)) {
        return 'NA';
    }
}
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
    else if (no.between(3, 3.49)) {
        return 'FR'
    }
    else if (no.between(0, 2.99)) {
        return 'PO'
    }
}

function sortBy(obj) {
    sortList = hotObj;
    
    switch (true) {
        case /Name/i.test(obj):
            sortList = sortList.sort(function (a, b) { return b.pdL_Title < a.pdL_Title ? 1 : b.pdL_Title > a.pdL_Title ? -1 : 0 });
            break;
        case /Rating/i.test(obj):
            sortList = sortList.sort(function (a, b) { return a.gipH_TNTournetRating < b.gipH_TNTournetRating ? 1 : a.gipH_TNTournetRating > b.gipH_TNTournetRating ? -1 : 0; })
            break;
        case /Score/i.test(obj):
            sortList = sortList.sort(function (a, b) { return a.ghS_FinalScore < b.ghS_FinalScore ? 1 : a.ghS_FinalScore > b.ghS_FinalScore ? -1 : 0; })
            break;
    }
    hotObj = sortList;
    builtHotelList();
    delete sortList;
    $('#filterSort').modal('hide');
}

// ** Reset Filters ** //
function resetFilters() {
    $('#selZone').val(0);
    $('#hotContain').val('');
    $('.rat:checkbox, .rev:checkbox, .rom:checkbox, .pro:checkbox').prop("checked", true);
    $('.fav:checkbox').prop("checked", false);
    hotObj = initHotObj;
    $('.header').html('');
    createPagination();
    builtHotelList();
    $('#filterSort').modal('hide');
}

// *** Filter this only ***
function filteronly(obj) {
    var onlyF;
    var selElement;
    obj.id === 'selZone' ?
        (selElement = 'zon|' + $('#' + obj.id + '').val() + '|' + $('#' + obj.id + '>option:selected').text(), onlyF = selElement.split('|'))
        : (obj.id === 'butGO' ? (selElement = 'nam|' + $('#hotContain').val() + '|' + $('#hotContain').val(), onlyF = selElement.split('|')) : onlyF = obj.id.split('|'));
    $('.rat:checkbox, .rev:checkbox, .fav:checkbox, .rom:checkbox, .pro:checkbox').prop("checked", false);
    $('#' + onlyF[1] + '').prop("checked", true);
    var filterList = [];
    filterList = initHotObj;
    //console.log("filterList = ");
    //console.log(filterList);
    var filLabel = "";
    switch (onlyF[0]) {
        case 'rat':
            var mapObj = { 'chkStar': '', '_': ' ' };
            var keyw = onlyF[1].replace(/chkStar|_/gi, function (matched) { return mapObj[matched]; });
            //console.log("keyw = ");
            //console.log(keyw);
            filterList = $.grep(filterList, function (rat) { return new RegExp(keyw).test(rat.gipH_TNTournetRating.replace(/\+/g, "plus")) });
            //console.log("filterList = ");
            //console.log(filterList);
            filLabel = '<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + keyw.replace('plus', '+') + '"</p>';
            //$('.hotelist').html('<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + keyw.replace('plus', '+') + '"</p>')
            break;
        case 'rev':
            var keyw = onlyF[1].replace(/chkRevw/i, '');
            var revw = "";
            keyw == 4.5 ? (filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore >= 4.5)) }), revw = "Excellent") : '';
            keyw == 4 ? (filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(4.0, 4.49))) }), revw = "Very Good") : '';
            keyw == 3.5 ? (filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(3.5, 3.99))) }), revw = "Good") : '';
            keyw == 3 ? (filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(3, 3.49))) }), revw = "Fair") : '';
            keyw == 0 ? (filterList = $.grep(filterList, function (rev) { return ((rev.ghS_FinalScore.between(0, 2.99))) }), revw = "Poor") : '';
            filLabel = '<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + revw + '"</p>';
            //$('.hotelist').html('<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + revw + '"</p>')
            break;
        case 'fav':
            var keyw = onlyF[1];
            filterList = $.grep(filterList, function (fav) { return (fav.pdL_SequenceNo > 49 && fav.pdL_SequenceNo < 60) })
            filLabel = '<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "Favorite"</p>';
            //$('.hotelist').html('<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "Favorite"</p>')
            break;
        case 'rom':
            var keyw = onlyF[1].replace(/chkroom/i, '');
            //console.log("keyw = " + keyw); 
            //console.log("plcID = " + plcID);
            //console.log("onlyF[2] = " + onlyF[2]);
            //console.log("onlyF[3] = " + onlyF[3]);
            gethotelsidsbyfacilid(keyw, plcID, onlyF[2], onlyF[3]);
            return false;
            break;
        case 'pro':
            var keyw = onlyF[1].replace(/chkprop/i, '');
            //console.log("keyw = " + keyw);
            //console.log("plcID = " + plcID);
            //console.log("onlyF[2] = " + onlyF[2]);
            //console.log("onlyF[3] = " + onlyF[3]);
            gethotelsidsbyfacilid(keyw, plcID, onlyF[2], onlyF[3]);
            return false;
            break;
        case 'zon':
            var keyw = onlyF[1];
            onlyF[1] === "0" ? '' : (filterList = $.grep(filterList, function (fav) { return onlyF[1].match(new RegExp(fav.gipH_TNZoneID)); }),
                filLabel = '<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + onlyF[2] + '"</p>');
            break;
        case 'nam':
            var keyw = onlyF[1];
            !/Type/.test(onlyF[2]) ? (
                filterList = $.grep(filterList, function (fav) { return (compareAccent(fav.pdL_Title).match(new RegExp(compareAccent(onlyF[2]), 'i'))); }),
                filLabel = '<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match "' + onlyF[2] + '"</p>'
            ) : '';
            break;
    };

    //console.log("filterList = ");
    //console.log(filterList);

    hotObj = filterList;
    $('.header').html(filLabel);
    createPagination();
    builtHotelList();
    delete filterList;
    $('#filterSort').modal('hide');
}

// ***************** APPLY FILTERS ******************* //
function applyFilters() {
    var srtBy;
    $('.btnSortby').each(function () {
        $(this).attr('class') === 'btn-primary' ? srtBy = this.textContent : '';
    });
    switch (true) {
        case /Name/i.test(srtBy): sortList = 'A'; break;
        case /Rating/i.test(srtBy): sortList = 'R'; break;
        case /Score/i.test(srtBy): sortList = 'S'; break;
    }
    var zonf = $('#selZone').val();
    var ratArr = [];
    $('.rat:checkbox').each(function () { this.checked ? ratArr.push(this.value) : '' });
    var ratf = ratArr.join('|');

    var favf = 0;
    $('.fav:checkbox').is(':checked') ? favf = 1 : '';

    var revArr = [];
    $('.rev:checkbox').each(function () { this.checked ? revArr.push(this.value) : '' });
    var revf = revArr.join('|');

    var proArr = [];
    $('.pro:checkbox').each(function () { this.checked ? proArr.push(this.value) : '' });
    var prof = proArr.join('|');

    var romArr = [];
    $('.rom:checkbox').each(function () { this.checked ? romArr.push(this.value) : '' });
    var romf = romArr.join('|');

    var filterList = [];
    filterList = hotObj;
    //zone
    zonf === '0' ? '' : filterList = $.grep(filterList, function (fav) { return zonf.match(new RegExp(fav.gipH_TNZoneID)) });
    //rating
    ratf === '' ? '' : filterList = $.grep(filterList, function (rat) { return new RegExp(ratf).test(rat.gipH_TNTournetRating.replace(/\s/g, "_").replace(/\+/g, "plus")) });
    //favorite
    favf === 0 ? '' : filterList = $.grep(filterList, function (fav) { return (fav.pdL_SequenceNo > 49 && fav.pdL_SequenceNo < 60) });
    //review
    var list4_5 = [], list4 = [], list3_5 = [], list3 = [], list0 = [], allList = []
    !/4.5/.test(revf.replace("_", ".")) ? '' : (list4_5 = filterList, list4_5 = $.grep(list4_5, function (rev) { return ((rev.ghS_FinalScore >= 4.5)) }));
    !/4/.test(revf.replace("_", ".")) ? '' : (list4 = filterList, list4 = $.grep(list4, function (rev) { return ((rev.ghS_FinalScore.between(4.0, 4.49))) }));
    !/3.5/.test(revf.replace("_", ".")) ? '' : (list3_5 = filterList, list3_5 = $.grep(list3_5, function (rev) { return ((rev.ghS_FinalScore.between(3.5, 3.99))) }));
    !/3/.test(revf.replace("_", ".")) ? '' : (list3 = filterList, list3 = $.grep(list3, function (rev) { return ((rev.ghS_FinalScore.between(3, 3.49))) }));
    !/0/.test(revf.replace("_", ".")) ? '' : (list0 = filterList, list0 = $.grep(list0, function (rev) { return ((rev.ghS_FinalScore.between(0, 2.99))) }));
    allList = [].concat.apply([], [list4_5, list4, list3_5, list3, list0]);
    var unique = [];
    var unique = allList.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
    allList.length > 0 ? filterList = allList : ''
    //property | room facilities
    var proromFa = [];
    var ftyp;
    if (proArr.length < facilPropC) {
        if (romArr.length < facilRoomC) {
            proromFa = [].concat.apply([], [proArr, romArr]);
            ftyp = roomType;
        } else {
            proromFa = proArr;
            ftyp = propType;
        };
    };
    createPagination();
    if (proromFa.length > 0) {
        gethotelsidsbyfacilid(proromFa, plcID, ftyp, 'none', filterList);
        delete filterList;
    } else {
        //$('.dvMHOeach').append('<p class="pMHOsrtfilLabel">' + filterList.length + ' properties match sort & filter criteria"</p>')
        hotObj = filterList;
        builtHotelList()
        delete filterList;
    };
    $('#filterSort').modal('hide');
}
function initMap() {
    NAplc = $('#plcNA').val();
    IDplc = $('#plcID').val();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': '' + NAplc + '' + '' }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            ctyLatLong = results[0].geometry.location.lat() + '|' + results[0].geometry.location.lng();
            objHotels = hotObj;
            //objPoi = cityPoi;
            buildBigMap(0);
        } else {
            //alert("Something got wrong " + status);
            objHotels = pageHotels;
            //objPoi = cityPoi;
            var LaLo = 0;
            var cylat = [];
            var cylon = [];
            jQuery.each(objHotels, function (objHotels) {
                cylat.push(Number(this.gipH_Latitude))
                cylon.push(Number(this.gipH_Longitude))
                LaLo++;
            });
            var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
            var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
            delete distLats;
            distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
            delete ctyLatLong;
            ctyLatLong = Number(midLat) + '|' + Number(midLon);
            buildBigMap(0);
        };
    });
}
function buildBigMap(tm) {
    map = null;
    if (tm == 0) {
        var useLatLong = ctyLatLong.split('|');
        var regLat = useLatLong[0];
        var regLong = useLatLong[1];
        var rlatlng = new google.maps.LatLng(regLat, regLong);
        var poiZoom = 13;
        if (distLats != '') {
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
            };
        };
    }
    else {
        var LL = 0;
        var allLat = [];
        var allLong = [];
        var allLatLong = [];
        var lat1, lat2, long1, long2;
        var dynZoon = 2;
        var ctylocLat = 0;
        var ctylocLong = 0;
        var cylat = [];
        var cylon = [];
        jQuery.each(objHotels, function (objHotels) {
            cylat.push(Number(this.gipH_Latitude))
            cylon.push(Number(this.gipH_Longitude))
            LL++;
        });
        var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
        var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
        delete distLats;
        distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
        delete ctyLatLong;
        ctyLatLong = Number(midLat) + '|' + Number(midLon);
        useLatLong = ctyLatLong.split('|');
        regLat = useLatLong[0];
        regLong = useLatLong[1];
        rlatlng = new google.maps.LatLng(regLat, regLong);
        var maxLong = Math.max.apply(Math, allLong);
        var minLong = Math.min.apply(Math, allLong);
        jQuery.each(allLatLong, function (a, b) {
            bPrt = b.split('|');
            if (bPrt[0] = minLong) { lat1 = bPrt[1]; long1 = bPrt[0]; };
            if (bPrt[0] = maxLong) { lat2 = bPrt[1]; long2 = bPrt[0]; };
            delete bPrt;
        });
        var poiZoom = 13;
        switch (true) {
            case (distLats < 50):
                poiZoom = 15;
                break;
            case (distLats > 50 && distLats < 150):
                poiZoom = 14;
                break;
            case (distLats > 150):
                poiZoom = 13
                break;
        };

    };
    var myOptions = {
        zoom: poiZoom,
        center: rlatlng,
        mapTypeControl: true,
        panControl: true,
        zoomControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvMHOMap"), myOptions);
    // -- Create the DIV to Display Number of Hotels
    var controlDiv = document.createElement('div');
    var closeControl = new StyleMapControl(controlDiv, '' + objHotels.length + ' Hotels');
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    // -- Create the DIV to show POI
    var controlDiv = document.createElement('div');
    var closeControl = new StyleMapControl(controlDiv, 'Show Hotels');
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    google.maps.event.addDomListener(controlDiv, 'mouseover', function () {
        $(this).addClass('dvHover');
    });
    google.maps.event.addDomListener(controlDiv, 'mouseout', function () {
        $(this).removeClass('dvHover');
    });
    google.maps.event.addDomListener(controlDiv, 'click', function () {
        $('.poi:checkbox').prop("checked", true); buildPois();
    });
    buildHotel();
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
    controlUI.style.width = '93px';
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

function buildHotel() {
    var Phcont = 0;
    var markers = [];
    var plcNa = $('#plcNA').val();
    var bounds = new google.maps.LatLngBounds();
    jQuery.each(objHotels, function (objHotels) {
        Phcont++;
        //if (Phcont < 7){
        var hlocLat = this.gipH_Latitude;
        var hlocLong = this.gipH_Longitude;
        var starNum = this.gipH_TNTournetRating.match(isNumber);
        starNum === null ? starNum = this.gipH_TNTournetRating : '';
        var imgSrc = '';
        var imgName = '';
        switch (true) {
            case /Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                imgName = 'Stars_' + this.gipH_TNTournetRating.replace(/\s/g, "_");
                break;
            case !/Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                imgName = this.gipH_TNTournetRating.replace(/\s/g, "_").toLowerCase();
                break;
        };
        imgSrc = '<img src="https://pictures.tripmasters.com/siteassets/d/' + imgName + '.gif" align="absmiddle" />'

        var hiconImg = '';
        var hpoiAnchor = new google.maps.Point(25, 42);
        var revClass = this.ghS_TrustYouScore;
        var icoFavo = '';
        var bubbMess = '<div class="mapBubb">';
        bubbMess = bubbMess + imgSrc;

        var ltlmessage = '<div class="dvaddHot">';
        ltlmessage = ltlmessage + '<div><b>' + this.pdL_Title + '</b></div>' + imgSrc;
        ltlmessage = ltlmessage + '<div class="jsO">';
        if (revClass < 68) {
            var solNA = '';
            var scrST = this.ghS_SolarToursScore;
            var scrClass = numberRange(this.ghS_SolarToursScore);
            switch (scrClass) {
                case 'EX':
                    solNA = 'Excellent';
                    break;
                case 'VG':
                    solNA = 'Very Good';
                    break;
                case 'GD':
                    solNA = 'Good';
                    break;
                case 'FR':
                    solNA = 'Fair';
                    break;
                case 'PO':
                    solNA = 'Poor';
                    break;
                case 'NA':
                    solNA = 'No Review available';
                    scrST = 'NA';
                    break;
            };
            ltlmessage = ltlmessage + '<div class="jsO' + scrClass + '"><span>' + scrST + '</span></div>';
            ltlmessage = ltlmessage + '<div class="jsO' + scrClass + 'txt">' + solNA + '</div>';
            ltlmessage = ltlmessage + '<br style="clear:both" />';

            bubbMess = bubbMess + '<div class="jsO' + scrClass + '"><span>' + this.ghS_SolarToursScore + '</span></div>';
            bubbMess = bubbMess + '<br style="clear:both" />';
        }
        else {
            var scrClass = numberRange(this.ghS_TrustYouScore);
            switch (scrClass) {
                case 'EX':
                    solNA = 'Excellent';
                    break;
                case 'VG':
                    solNA = 'Very Good';
                    break;
                case 'GD':
                    solNA = 'Good';
                    break;
                case 'FR':
                    solNA = 'Fair';
                    break;
                case 'PO':
                    solNA = 'Poor';
                    break;
                case 'NA':
                    solNA = 'No Review available';
                    scrST = 'NA';
                    break;
            };
            ltlmessage = ltlmessage + '<div class="jsR' + scrClass + '"><span>' + this.ghS_TrustYouScore + '</span></div>';
            ltlmessage = ltlmessage + '<div class="jsR' + scrClass + 'txt">' + solNA + '</div>';
            ltlmessage = ltlmessage + '<br style="clear:both" />';

            bubbMess = bubbMess + '<div>'
            if (this.pdl_SequenceNo > 49 && this.pdl_SequenceNo < 60) {
                bubbMess = bubbMess + '<span class="spFav">&nbsp;</span>';
            }
            bubbMess = bubbMess + '<span class="jsS' + scrClass + '">' + this.ghs_TrustYouScore + '</span><br style="clear:both" /></div>';
        };
        ltlmessage = ltlmessage + '</div>'

        if (this.pdl_SequenceNo > 49 && this.pdl_SequenceNo < 60) {
            ltlmessage = ltlmessage + '<p class="fF"></p>';
        };
        ltlmessage = ltlmessage + '<a id="' + this.pdlid + '" class="mrDet" href="/' + plcNa + '/Hotel/' + this.pdlid + '/' + this.pdL_Title.replace(/\s/g, "_").replace("&", "and") + '">more details</a>';
        ltlmessage = ltlmessage + '</div>';
        bubbMess = bubbMess + '</div>';
        var icoImg;
        /Stars|Lodge|Cruise/g.test(imgName) === false ? icoImg = 'https://pictures.tripmasters.com/siteassets/d/hotel_0star_BG.png' : icoImg =  'https://pictures.tripmasters.com/siteassets/d/HotelStars/hotel_' + starNum + 'stars.png';
        var hmarker = new google.maps.Marker({
            position: new google.maps.LatLng(hlocLat, hlocLong),
            map: map,
            icon: icoImg,
            draggable: false,
            raiseOnDrag: true,
            zIndex: 8998
        });
        markers.push(hmarker);
        var infoHWind = new google.maps.InfoWindow({ content: ltlmessage });
        var infoH = new google.maps.InfoWindow({ content: ltlmessage });
        google.maps.event.addListener(hmarker, 'mouseover', function () { infoHWind.open(map, hmarker) });
        google.maps.event.addListener(hmarker, 'mouseout', function () { infoHWind.close(map, hmarker) });
        google.maps.event.addListener(hmarker, 'click', function () { infoH.open(map, hmarker); map.setCenter(hmarker.getPosition()) });
    });

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