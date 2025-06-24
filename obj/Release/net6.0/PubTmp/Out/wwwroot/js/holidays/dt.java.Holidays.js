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
//var itisMobile = false;
//(function (a) {
//    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| ||a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) itisMobile = true;
//})(navigator.userAgent || navigator.vendor || window.opera);
$(document).ready(function () {
    maskH = $(document).height();
    maskW = $(window).width();
    switch (userid) {
        case 243:
            tmpath = "https://www.tripmasters.com/europe/";
            break;
        //case 595:
        //    tmpath = "https://www.tripmasters.com/europe/";
        //    break;
        //case 182:
        //    tmpath = "https://www.tripmasters.com/latin/";
        //    break;
    }
    $('.browseButton, .buildButton, .eachHigh, .dvSuggCustomIt').click(function () {
        winlocation(this.lang);
    });
    $('.dvCustomIt').click(function () { winlocation(this.getAttribute("data-go-to")); });	

    //$('.buildButton').click(function(){
    //	winlocation(this.lang);								  
    //});
    $('.moreButton').click(function () {
        $('.dvEachHide').is(':visible') === false ?
            ($(this).html('Close More Highlights & Attractions <span>&rsaquo;</span>'), $('.dvEachHide').slideDown(), $('div.moreButton span').css('transform', 'rotate(270deg)'))
            : ($(this).html('More Highlights & Attractions <span>&rsaquo;</span>'), $('.dvEachHide').slideUp(), $('div.moreButton span').css('transform', 'rotate(90deg)'));
    });
    //$('.eachHigh').click(function(){
    //	winlocation(this.lang);												
    //});
    //$('.dvCustomIt').click(function(){
    //	winlocation(this.lang);							  
    //});
    //$('.dveachSuggest').click(function(){//alert(this.class)});
    //$('.dvSuggCustomIt').click(function(){
    //	winlocation(this.lang);							  
    //})
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
    $('.dvSuggestTitle a, .dveachSuggest2ndCol').click(function () {
        var suggestID = this.id;
        var $dvInf = $('#divInfo' + suggestID + '');
        $dvInf.is(':visible') === false ? (
            $dvInf.slideDown(),
            $('.dveachSuggest2ndCol[id="' + suggestID + '"]').css('transform', 'rotate(270deg)'),
            otherMoreDetails(suggestID, 1)
        )
            :
            (
                $dvInf.slideUp(),
                $('.dveachSuggest2ndCol[id="' + suggestID + '"]').css('transform', 'rotate(90deg)', 'color', 'black')
            );
        return false;
    });
    $('#imgForw').click(function () { swichImg('F') });
    $('#imgBack').click(function () { swichImg('B') });
//    buildPics();
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

function toggleClassMoreDetails() {
    $('body').toggleClass('modal-pack-info-open');
    $('.backdrop').toggleClass('is-hidden');
}
function otherMoreDetails(objid, cls) {
    $('.dvotherInfo').each(function () {
        var idDiv = $(this).attr('id');
        var idNum = idDiv.match(isNumber);
        idNum == objid ? (
            $('#' + idDiv + '').is(':visible') == false ? (
                $('#' + idDiv + '').slideDown(),
                $('#dvArrow' + idNum + '').slideDown(),
                $('div.dveachOtherMore[lang="' + idNum + '"]').find('span').css('transform', 'rotate(270deg)')

            ) : (

                $('#' + idDiv + '').slideUp(),
                $('#dvArrow' + idNum + '').slideUp(),
                $('div.dveachOtherMore[lang="' + idNum + '"]').find('span').css('transform', 'rotate(90deg)')
            )

        ) : (
            $('#' + idDiv + '').slideUp(),
            $('#dvArrow' + idNum + '').slideUp(),
            $('div.dveachOtherMore[lang="' + idNum + '"]').find('span').css('transform', 'rotate(90deg)')

        );
    });

    cls === 1 ? relPackCallt4(objid) : '';
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
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;" class="falsecheckdop" id="falsedop' + echP[3] + '_' + packID + '" >' + echP[0] + '</a>'
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + '_' + packID + '" id="dop' + echP[3] + '_' + packID + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                        mrChoice = mrChoice + '</span>'
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
//function imageSize(thisPic, thisTyp) {
//    if (thisPic.match(img500) != null || thisTyp == 'M0') {
//        picW = '290px';//picH='290px'; 
//        picMtp = '0px';
//        $('.selM').css('width', '399px');
//        $('#dvallTHU').attr('style', 'width:258px;');
//    }
//    else {
//        picW = '200px';//picH='200px'; 
//        picMtp = '45px';
//        $('.selM').css('width', '399px');
//        $('#dvallTHU').attr('style', 'width:258px;');
//    };
//    return [picW, picMtp];
//};
//function CarrouPicsBuild(phoN) {
//    CoPic = 0;
//    CoMap = 0;
//    for (i = 0; i < phoN; i++) {
//        if (i === 0) { picClass = "picSel" } else { picClass = "picNSel" };
//        if (objPics[i].imG_ImageType === 'P0') {
//            CoPic++
//            TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>';
//        } else if (objPics[i].imG_ImageType === 'M0') {
//            CoMap++
//            TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '"  class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';
//            hvBigMap = 1;
//        }
//        ini = 0;
//        fin = i;
//    }
//    if (picTotal < 6) {
//        var leftPadd = 18 * (6 - picTotal);
//    } else { leftPadd = 0; }
//    $('#dvallTHU #prev').css({ "padding-left": "" + leftPadd + "px", "background-position": "" + leftPadd + "px 0" });
//    $('#thumbs').html(TthumPic);
//    $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
//    $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
//};
//function sliceThumb(ifrom, ito, idir) {
//    TthumPic = ""
//    if (idir === 'prev') {
//        if (ito === picTotal - 1) {
//            var diff = Number(ito - ifrom);
//            ifrom = ifrom - 6;
//            ito = Number(ito - diff) - 1;
//        }
//        else {
//            ifrom = ifrom - 6;
//            ito = ito - 6;
//        }
//        if (ifrom < 0) { alert('No more images'); return false; }
//        else {
//            var CoPic = ifrom;
//            var CoMap = ifrom;
//            for (i = ifrom; i <= ito; i++) {
//                picClass = "picNSel"
//                if (objPics[i].imG_ImageType == 'P0') {
//                    CoPic++;
//                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>'

//                }
//                else if (objPics[i].imG_ImageType == 'M0') {
//                    CoMap++;
//                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';

//                }
//                ini = ifrom;
//                fin = i;
//            }
//            $('#thumbs').hide("slide", { direction: 'right' }, 200);
//            $('#thumbs').html(TthumPic);
//            $('#thumbs').show("slide", { direction: 'left' }, 500);
//            $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
//            $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });

//        };
//    }
//    if (idir == 'next') {
//        if (ito > picTotal - 1) { ito = picTotal - 1 };
//        if (ifrom >= picTotal - 1) { alert('No more images'); }
//        else {
//            var CoPic = ifrom - 1;
//            var CoMap = ifrom - 1;
//            for (i = ifrom; i <= ito; i++) {
//                picClass = "picNSel"
//                if (objPics[i].imG_ImageType === 'P0') {
//                    CoPic++;
//                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>'

//                }
//                else if (objPics[i].imG_ImageType === 'M0') {
//                    CoMap++;
//                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';

//                };
//                ini = ifrom;
//                fin = i;
//            };
//            $('#thumbs').hide("slide", { direction: 'left' }, 200);
//            $('#thumbs').html(TthumPic);
//            $('#thumbs').show("slide", { direction: 'right' }, 500);
//            $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
//            $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });

//        };
//    };
//};
//function changePic(picID, picSRS, picTTL, picALT) {
//    var imG_Path_URL = 'https://pictures.tripmasters.com' + picALT
//    if (picALT === 'none') { imG_Path_URL = picSRS; };
//    if (picID.indexOf('O') === -1) {
//        var objP = $('#dvImgContOv').position();
//        $('#dvbk').hide();
//        $('#dvfr').hide();
//        $('#dvmediaPopUp').attr('style', 'position:absolute; z-index:9998; width:1010px; left:50%; margin-left:-505px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;');
//        $('#dvmediaPopUp').show();
//        $('img.picSel[id*="Kipic"]').attr('class', 'picNSel');
//        $('img.picSel[id*="Mipic"]').attr('class', 'picNSel');
//        $('#' + picID + '').attr('class', 'picSel');
//        $('#dvFstPic').html('<img src="' + imG_Path_URL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" />');
//        if (picID.indexOf('M') > -1) {
//            $('#dvMV').hide();
//            var pattern = /[0-9]+/ //+/g;
//            var num = picID.match(pattern);
//            $('#Mipic' + num + '').attr('class', 'picSel');
//        } else {
//            $('#dvMV').show();
//            $('#dvPicNa').html(picTTL);
//        }
//    }
//    else {
//        $('img[id*="Oipic"]').attr('class', 'picNSel');
//        $('#' + picID + '').attr('class', 'picSel');
//        if (picID.indexOf('Map') > -1 || imG_Path_URL.match(img500) != null) { $('#dvshowPIC').html('<img src="' + imG_Path_URL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '" alt="' + picALT + '" title="' + picTTL + '" width="290" height="290" onclick="moreMediaB(this.id, this.src, this.title, this.alt); " class="clsCursor"/>'); $('.selM').css('width', '399px'); $('#dvallTHU').attr('style', 'width:258px;'); }
//        else { $('#dvshowPIC').html('<img src="' + imG_Path_URL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" style="margin-top:45px;" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>'); $('.selM').css('width', '399px'); $('#dvallTHU').attr('style', 'width:258px;'); };
//    }
//};
//function popUpImagesNav() {
//    thumPic = '';
//    thumMap = '';
//    hvMap = 0;
//    var Cpic = 0;
//    var Cmap = 0;
//    var thumClass = 'picNSel';
//    for (i = 0; i < Number(picTotal); i++) {
//        if (i === 0) { thumClass = 'picSel' } else { thumClass = 'picNSel' };
//        if (objPics[i].imG_ImageType === 'P0') {
//            Cpic++
//            thumPic = thumPic + '<img id="Kipic' + Cpic + '" class="' + thumClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/>';
//        }
//        else if (objPics[i].imG_ImageType === 'M0' || objPics[i].imG_ImageType == 'M1') {
//            Cmap++
//            thumMap = thumMap + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="Mipic' + Cmap + '" class="' + thumClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL + '" title="' + objPics[i].imG_Title + '"/>';
//            hvMap = 1;
//        };
//    };
//    newPicTot = Cpic;
//    $('#dvThuPic').html('Photos<br/>' + thumPic);
//    if (hvMap == 1) {
//        $('#dvThMp').show();
//        $('#dvThuMap').html('Map<br/>' + thumMap);
//    }
//    else {
//        $('#dvThMp').hide();
//        $('#dvTabMap').hide();
//    };
//    $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
//    $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
//};
//function swichImg(bf) {
//    var totPic;
//    totPic = newPicTot // imgC;
//    var thisPic = $('img.picSel[id*="K"]');
//    var iID = thisPic.attr('id');
//    iID = iID.replace('ipic', '');
//    if (iID.indexOf('O') > -1) { iID = iID.replace('O', ''); };
//    if (iID.indexOf('K') > -1) { iID = iID.replace('K', ''); };
//    var newID;
//    var newPic;
//    var newImg;
//    if (bf === 'F') {
//        if (iID === totPic) { alert('No more photos') }
//        else {
//            newID = Number(iID) + 1;
//            newImg = objImgs[iID].imG_500Path_URL;
//            if (newImg == '') { newImg = objImgs[newID].imG_Path_URL; };
//            newPic = $('#Kipic' + newID + '');
//            $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
//            $('#dvPicNa').html(newPic.attr('title'));
//            newPic.attr('class', 'picSel');
//            thisPic.attr('class', 'picNSel');
//        };
//    };
//    if (bf === 'B') {
//        if (iID === 1) { alert('No more photos') }
//        else {
//            newID = Number(iID) - 1;
//            newImg = objImgs[newID - 1].imG_500Path_URL;
//            if (newImg === '') { newImg = objImgs[newID - 1].imG_Path_URL; };
//            newPic = $('#Kipic' + newID + '');
//            $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
//            $('#dvPicNa').html(newPic.attr('title'));
//            newPic.attr('class', 'picSel');
//            thisPic.attr('class', 'picNSel');
//        };
//    };
//};
//function buildPics() {
//    var dvShw;
//    var hvMap = 0;
//    var hvBigMap = 0;
//    var picU;
//    var picW, picH, picMtp;
//    var fstPic;
//    var picClass;
//    var idIMG = 'Bipic';
//    var idNUM = 3
//    var packID = $('#imgItemID').val();
//    //p(ct).picURL = dvpicksPack(ct)("IMG_Path_URL")
//    //p(ct).picNA = dvpicksPack(ct)("IMG_Title")
//    //picSQ = dvpicksPack(ct)("PXI_Sequence") + 1
//    //p(ct).picSEQ = picSQ 'dvpicksPack(ct)("PXI_Sequence")
//    //p(ct).picTYP = dvpicksPack(ct)("IMG_ImageType")
//    //p(ct).picBIG = dvpicksPack(ct)("IMG_500Path_URL")

//    $.ajax({
//        type: "GET",
//        url: SiteName + "/api/packages/PicsForPacks/" + packID,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (data) {
//            objPics = data;
//            //console.log(objPics);
//            objImgs = $.grep(objPics, function (n, i) { return (n.imG_ImageType == 'P0'); });
//            picTotal = objPics.length;
//            for (i = 0; i < 3; i++) {
//                aPic = aPic + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="140" height="140" id="Bipic' + Number(i + 1) + '" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>';
//            };
//            $('#dvImgT26').html(aPic);
//            var imageIndex = 0;
//            if (objPics.length <= 3)
//                imageIndex = objPics.length - 1;
//            if (objPics[imageIndex]) {
//                picW = imageSize(objPics[imageIndex].imG_500Path_URL, objPics[imageIndex].imG_ImageType)
//                if (objPics[imageIndex].imG_ImageType === 'M0') {
//                    idIMG = 'KipicMap';
//                    idNUM = 1;
//                }
//                $('#dvshowPIC').html('<img src="https://pictures.tripmasters.com' + objPics[imageIndex].imG_500Path_URL.toLowerCase() + '" id="' + idIMG + idNUM + '" alt="' + objPics[imageIndex].imG_500Path_URL.toLowerCase() + '" title="' + objPics[imageIndex].imG_Title + '" width="' + picW[0] + '" height="' + picW[0] + '" style="margin-top:' + picW[1] + '" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>');
//                $('#dvshowPIC').show();
//            };
//            if (picTotal === 3) {
//                CarrouPicsBuild(3);
//            } else if (picTotal === 4) {
//                CarrouPicsBuild(4);
//            } else if (picTotal === 5) {
//                CarrouPicsBuild(5);
//            } else {
//                CarrouPicsBuild(6);
//            }
//            for (m = 0; m < Number(picTotal - 1); m++) {
//                if (objPics[m].imG_ImageType === 'M0') {
//                    $('#dvsmalMAP').html('<image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL + '" width="325" height="325" alt="' + objPics[m].imG_500Path_URL.toLowerCase() + '" title="' + objPics[m].imG_Title + '"/>');
//                    $('#dvsmalMAP').show();
//                    shwMaps = shwMaps + '<div align="center"><span class="Text_Arial12_LightBold">' + objPics[m].imG_Title + '</span><br/><br/><image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL + '" alt="' + objPics[m].imG_500Path_URL.toLowerCase() + '" title="' + objPics[m].imG_Title + '"/></div>';
//                    $('#dvShwMap').html(shwMaps);
//                    m = Number(picTotal - 1)
//                }
//                else {
//                    if (hvBigMap === 1) {
//                        $('#dvShwMap').html(shwMaps);
//                    }
//                    else {
//                        $('#dvTabMap').hide();
//                    };
//                };
//            };
//        },
//        error: function (xhr, desc, exceptionobj) {
//            $('#packPics').html(xhr.responseText);
//        }
//    });
//    $('a[id*="prev"]').click(function () { sliceThumb(Number(ini), Number(fin), this.id); return false; });
//    $('a[id*="next"]').click(function () { sliceThumb(Number(ini + 6), Number(fin + 6), this.id); return false; });
//};
//function moreMedia() {
//    var img1S = objPics[0].imG_500Path_URL;
//    if (img1S == undefined) { img1S = objPics[0].imG_Path_URL; };
//    var img1T = objPics[0].imG_Title;
//    $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + img1S.toLowerCase() + '" title="' + img1T + '" alt="' + img1S.toLowerCase() + '"/>');
//    $('#dvPicNa').html(img1T);
//    popUpImagesNav();
//    var objP = $('#dvImgContOv').position();
//    var dvW = 1010;
//    var dvML = -505;
//    $('#dvMask').css({ 'width': maskW, 'height': maskH });
//    $('#dvMask').fadeTo("slow", 0.65);
//    $('#dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;'); //top:25%
//    $('#dvmediaPopUp').show();
//    window.scrollTo(0, Number(objP.top + 600));
//    //scrollToTop();
//};
//function moreMediaB(picID, picSRS, picTTL, picALT) {
//    popUpImagesNav();
//    var objP = $('#dvImgContOv').position();
//    var dvW = 1010;
//    var dvML = -505;
//    $('#dvMask').css({ 'width': maskW, 'height': maskH });
//    $('#dvMask').fadeTo("slow", 0.8);
//    $('#dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;');
//    $('#dvmediaPopUp').show();
//    window.scrollTo(0, Number(objP.top + 600));
//    //scrollToTop();
//    changePic(picID.replace('B', 'K'), picSRS, picTTL, picALT);
//};
//function moreMediaCLS() {
//    $('#dvMask').hide();
//    $('#dvmediaPopUp').hide();
//};
function scrollToTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 800);
};
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
};
function openWinCMS(cmsid, jhref) {
    centerWindow(jhref);
    return false;
};