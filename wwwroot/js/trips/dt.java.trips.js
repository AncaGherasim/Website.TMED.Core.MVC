// JavaScript Document
var pics = '';
var aPic = '';
var thumPic = '';
var OthumPic = '';
var TthumPic = '';
var thumMap = '';
var OthumMap = '';
var picSize = 200;
var shwMaps = '';
var maskH;
var maskW;
var isNumber = /[0-9]+/g;
var userid;
var tmpath;

$(document).ready(function () {
    maskH = $(document).height();
    maskW = $(window).width();
    switch (userid) {
        case 243:
            tmpath = "https://www.tripmasters.com/europe/";
            break;
    }
    $('.browseButton, .buildButton, .eachHigh, .dvCustomIt, .dvSuggCustomIt').click(function () {
        winlocation(this.lang);
    });
    $('a.cms').click(function () {
        window.open(this.href, "_blank", "scrollbars=yes,top=300,left=200,width=600,height=800");
        return false;
    });
    $('.moreButton').click(function () {
        $('.dvEachHide').is(':visible') === false ?
            ($(this).html('Close More Highlights & Attractions <span>&rsaquo;</span>'), $('.dvEachHide').slideDown(), $('div.moreButton span').css('transform', 'rotate(270deg)'))
            : ($(this).html('More Highlights & Attractions <span>&rsaquo;</span>'), $('.dvEachHide').slideUp(), $('div.moreButton span').css('transform', 'rotate(90deg)'));
    });

    $('.moreTours').click(function () {
        var id = $(this).attr('id');
        showList(id, 1);
    });
    $('.dveachOtherMore').click(function () {
        var eachID = this.lang;
        otherMoreDetails(eachID, 1);
    });
    $('.dvotherClose span').click(function () {
        var closeID = this.id;
        otherMoreDetails(closeID, 0);
    });
    $('#imgForw').click(function () { swichImg('F'); });
    $('#imgBack').click(function () { swichImg('B'); });
    replaceSeoNoOfItems($('#placeID').val());
});
function winlocation(url) {
    window.location = url;
}

function showList(id, cls) {
    if ($('#divInfo' + id).is(":visible")) {
        $('#divInfo' + id).hide();
    }
    else {
        $('#divInfo' + id).show();
    }
    cls === 1 ? relPackCallt4(id) : '';
}
var goTo = 0;
function toggleClassMoreDetailsBestCities() {
    $('body').toggleClass('modal-pack-info-open');
    $('.backdrop-best-cities').toggleClass('is-hidden');
}

function toggleClassMoreDetailsMoreCities() {
    $('body').toggleClass('modal-pack-info-open');
    $('.backdrop-more-cities').toggleClass('is-hidden');
}

function otherMoreDetails(objid, cls) {
    switch (cls) {
        case 2:
            goTo = -1;
            break;
    }
    //console.log("goTo = " + goTo);
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
function citiesAccordion(objid) {
    $('#' + objid + ' .cities-section__title span').is(':visible') ? ($('#' + objid + ' ul').is(':visible') == false ? (
        $('#' + objid + ' ul').slideDown(),
        $('#' + objid + ' .cities-section__title').find('span').css({ 'transform': 'rotate(-90deg)', 'right': '14px' })

    ) : (

        $('#' + objid + ' ul').slideUp(),
        $('#' + objid + ' .cities-section__title').find('span').css({ 'transform': 'rotate(90deg)', 'right': '10px' })
    )) : ''

}

function relPackCallt4(packID) {
    //console.log("relPackCallt4");
    //console.log(packID);
    //console.log("userid");
    //console.log(userid);
    var relTxt = '';
    var mrChoice = '';
    var divCom = 'dvCom' + packID;
    var divInf = 'dvpkInf' + packID;
    var divRel = 'dvRel' + packID;
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/getDataRelPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            msg = data;
            if (msg !== '') {
                relTxt = '<div class="txt_grayLight11" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">';
                mrChoice = '<div class="txt_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">';
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    echP = strPrts[i].split('|');
                    relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">';
                    relTxt = relTxt + '<a href="' + SiteName + '/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">';
                    relTxt = relTxt + '<span class="txt_grayLight11">';
                    relTxt = relTxt + '<u>' + echP[0] + '</u>';
                    relTxt = relTxt + '</span></a></span>';
                    if (echP[2] !== 5) {
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '_' + packID + '" >' + echP[0] + '</a>';
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '_' + packID + '" id="dop' + echP[3] + '_' + packID + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>';
                        mrChoice = mrChoice + '</span>';
                    }
                }
                relTxt = relTxt + '<br style="clear:both"/></div>';
                mrChoice = mrChoice + '<br style="clear:both"/></div>';
                //console.log("mrChoice: ");
                //console.log(mrChoice);
                //console.log('#' + divRel + '');
                //console.log('#' + divCom + '');
                $('#' + divRel + '').html(relTxt);
                //console.log($('#' + divRel + '').css('display'));
                $('#' + divCom + '').html(mrChoice);
                $('#dvWait' + packID + '').hide();
                $('#dvWait' + packID + '').html('');
                $('#' + divInf + '').slideDown();
                activeCckBx('frm' + packID);

            }
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
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
            $(this).removeClass('falsecheckeddop');
            $('#' + replID + '').removeAttr('checked');
        } else {
            $(this).addClass('falsecheckeddop');
            $('#' + replID + '').attr('checked', true);
        }
        $(this.hash).trigger("click");

        return false;
    });
};
function imageSize(thisPic, thisTyp) {
    if (thisPic.match(img500) !== null || thisTyp === 'M0') {
        picW = '290px';
        picMtp = '0px';
        $('.selM').css('width', '399px');
        $('#dvallTHU').attr('style', 'width:258px;');
    }
    else {
        picW = '200px';
        picMtp = '45px';
        $('.selM').css('width', '399px');
        $('#dvallTHU').attr('style', 'width:258px;');
    }
    return [picW, picMtp];
}
function scrollToTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 800);
}
function findPackst4(formID) {
    if ($('#' + formID + ' #allID').val() != '') {
        $('#' + formID + ' #allID').val('')
    }
    if ($('#' + formID + ' #allNA').val() != '') {
        $('#' + formID + ' #allNA').val('')
    }

    var idForm = formID
    var idString = $('#' + idForm + '').serialize();
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
}
function openWinCMS(cmsid, jhref) {
    centerWindow(jhref);
    return false;
};