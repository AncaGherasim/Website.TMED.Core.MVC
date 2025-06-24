// JavaScript Document
var mycarousel_itemList = new Array;
$(document).ready(function () {
    if (document.getElementById("map_canvas") != null) {
        initialize(Latitude, Longitude);
    };
    getProdImg(hotelID);
    $('.dvRevClose').click(function () {
        $('.dvReviewInfo').html('');
        $('#dvRevContainer').toggle();
        openMask();
    });
    $('.locateMap').click(function () { gotoMap() });
    $('.modal__close').click(function () {
        closeModal();
    });
    $(document).on('hidden.bs.modal', '#revTrustYou', function () {
        $('.dvExpediaRev').html('');
    });
});
function initialize(lat, long) {
    var map = '<iframe style="border: 0" ' +
        'src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAd8S1lOSNhEy2FUzkGT34S1KCvadNLkz8&q=' +
        lat + ',' + long + '&zoom=14"' +
        ' width = "100%" height = "100%" frameborder = "0" ></iframe >';
    $("#map_canvas").html(map);
}
function gotoMap() {
    var mapPos = $('#map_canvas').offset();
    mapPos = mapPos.top - 150
    $('body,html').animate({ scrollTop: mapPos }, 500);
};
var goTo = 0;
function toggleClassMoreDetails(packId) {
    $('body').toggleClass('modal-pack-info-open');
    $('#fti-' + packId + '-modal').toggleClass('is-hidden');
}
function otherMoreDetails(objid, cls) {
    switch (cls) {
        case 2:
            goTo = -1;
            break;
    }
    if (goTo == -1) { return false; }

    $('.secPackInfo').each(function () {
        var secID = $(this).attr('id');
        var numID = secID.match(isNumber);
        numID == objid ? (
            !$(this).is(':visible') ?
                (
                    $(this).slideDown(),
                    $('p[id="down' + numID + '"]').slideDown(),
                    $('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(-135deg)', 'margin': '7px 10px' })
                ) : (
                    $(this).slideUp(),
                    $('p[id="down' + numID + '"]').slideUp(),
                    $('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(45deg)', 'margin': '5px 10px' })
                )
        ) : (
            $(this).slideUp(),
            $('p[id="down' + numID + '"]').slideUp(),
            $('p[id="p' + numID + '"]').find('span').css({ 'transform': 'rotate(45deg)', 'margin': '5px 10px' })
        );
    });

    cls === 1 ? relPackCallt4(objid) : '';
}

function relPackCallt4(packID) {
    var relTxt = '';
    var mrChoice = '';
    var divCom = 'dvCom' + packID;
    var divInf = 'dvpkInf' + packID;
    var divRel = 'dvRel' + packID;
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/sqlRelPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            msg = data;
            if (msg !== '') {
                relTxt = '<div class="txt_grayLight11" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                mrChoice = '<div class="txt_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    echP = strPrts[i].split('|');
                    relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
                    relTxt = relTxt + '<a href="' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                    relTxt = relTxt + '<span class="txt_grayLight11">'
                    relTxt = relTxt + '<u>' + echP[0] + ' (' + echP[1] + ')</u>'
                    relTxt = relTxt + '</span></a></span>'
                    if (echP[2] != 5) {
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '" >' + echP[0] + '</a>'
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '" id="dop' + echP[3] + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                        mrChoice = mrChoice + '</span>'
                    }
                }
                relTxt = relTxt + '<br style="clear:both"/></div>';
                mrChoice = mrChoice + '<br style="clear:both"/></div>';
                $('#' + divRel + '').html(relTxt);
                $('#' + divCom + '').html(mrChoice);
                $('#dvWait' + packID + '').hide();
                $('#dvWait' + packID + '').html('');
                $('#' + divInf + '').slideDown();
                activeCckBx('frm' + packID);
            }
        },
        error: function (xhr, desc, exceptionobj) {
            // alert(xhr.responseText + ' = error');
            $('#dvWait' + packID + '').html(xhr.responseText);
        }
    });
};
// *** ACTIVE CHECK BOX *** ///
function activeCckBx(frm) {
    $('#' + frm + ' input:checkbox').each(function () {
        (this.checked) ? $('#false' + this.id + '').addClass('falsecheckeddop') : $("#false" + this.id + '').removeClass('falsecheckeddop');
    });
    // function to 'check' the fake ones and their matching checkboxes
    var replID;
    $('#' + frm + ' .falsecheckdop').click(function () {
        this.id.indexOf('falsedot') > -1 ? replID = this.id.replace('falsedot', '') : this.id.indexOf('false') > - 1 ? replID = this.id.replace('false', '') : '';
        if (($(this).hasClass('falsecheckeddop'))) {
            $(this).removeClass('falsecheckeddop')
            $('#' + replID + '').removeAttr('checked');
        } else {
            $(this).addClass('falsecheckeddop');
            $('#' + replID + '').attr('checked', true);
        }
        $(this.hash).trigger("click");

        return false;
    });
};
function getProdImg(pid) {
    var objImg = [];
    var imgGallery = '';
    var imgLoad = '<div id="dvImgLoad" class="dvImgLoad"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>';
    $('.dvhotelImgs').append(imgLoad);

    var options = {};
    options.url = SiteName + "/Api/Hotel/ImagesByProdID/" + pid;
    options.type = "GET";
    options.contentType = "application/json; charset=utf-8";
    //options.data = JSON.stringify(pid);
    options.dataType = "json";
    options.success = function (msg) {
        objImg = msg;
        imgGallery = '<ul class="pgwSlideshow">';
        jQuery.each(objImg, function (objImg) {
            var fff = this.imG_Title;
            console.log(fff);
            var jstitle = fff.split("-").join(' ');
            imgGallery = imgGallery + ' <li>';
            imgGallery = imgGallery + ' <img src="https://pictures.tripmasters.com' + this.imG_Path_URL.toLowerCase() + '" data-description="' + jstitle + '">';
            imgGallery = imgGallery + ' </li>';
        });
        imgGallery = imgGallery + '</ul>';
        $('#dvImgLoad').remove();
        $('.dvhotelImgs').append(imgGallery);
        photos();
    };
    options.error = function (msg) {
        console.log(msg);
    };
    $.ajax(options);
};
function photos() {
    $('.pgwSlideshow').pgwSlideshow({
        //listPosition : 'left',
        displayList: true,
        autoSlide: false,
        //displayControls:true,
        maxheight: 500,
        adaptiveHeight: false, //true
        verticalCentering: true
    });
};


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
function getReview(obj) {
    openModal();
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/AWSExpediaReviewHotel",
        data: JSON.stringify({ Id: parseInt(obj.id) }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
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
                $('.modal__title').html(obj.pdL_Title);

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

                ExpediaFeedbacks = sdata.guestReviews;
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
            $('.modal__right').append($feedbacks);
            if (pgS + 9 < totalFeed) {
                var $showmore = $('<div id="dshowmore" class="review__comments-button col-12">' +
                    '<button type = "button" id = "show_more-comments" onclick="expediaFeedbacks(' + nextpg + ');" class= "show_more-button">Show more reviews</button >' + '</div>');
                $('.modal__right').append($showmore);
            }
        })
    }
}
function openModal() {
    $('.modal__container').html('<div style="padding:15px 15px;text-align:center;"><img src="https://pictures.tripmasters.com/siteassets/d/wait.gif"></div>');
    $('#modal').removeClass('is-hidden');
    $('body').addClass('modal-open');
}
function closeModal() {
    $('#modal').addClass('is-hidden');
    $('body').removeClass('modal-open');
}
function findPackst4(formID) {
    if ($('#' + formID + ' #allID').val() != '') {
        $('#' + formID + ' #allID').val('')
    }
    if ($('#' + formID + ' #allNA').val() != '') {
        $('#' + formID + ' #allNA').val('')
    }
    var idForm = formID
    var idString = $('#' + idForm + '').serialize();;
    idString = idString.substring(0, idString.indexOf("&__RequestVerificationToken"))
    var idStrParts
    var idxOf
    var idValP
    var idVal
    var idValN
    var idToFind = ''
    var idID
    var idNA
    var chkCHK = 0
    idString = idString.replace(/\+/g, ' ');
    idString = idString.replace(/\%7C/g, '|');
    idStrParts = idString.split('&');
    for (i = 0; i < idStrParts.length; i++) {
        idValP = idStrParts[i].split('=');
        if (idValP[1] != '') {
            chkCHK = chkCHK + 1
            idValN = idValP[1].split('|');
            if (chkCHK > 1) {
                idID = idID + ',' + idValN[0];
                idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
            }
            else {
                idID = idValN[0];
                idNA = idValN[1].replace(/\s/g, '-');
            }

        }

    }
    if (idID == undefined) {
        alert('Please check at least one box. Thanks!');
        return;
    }
    else {
        $('#allID').val(idID);
        $('#allNA').val(idNA);
        window.location.href = SiteName + '/' + idNA.toLowerCase() + '/find-packages';
    }
};