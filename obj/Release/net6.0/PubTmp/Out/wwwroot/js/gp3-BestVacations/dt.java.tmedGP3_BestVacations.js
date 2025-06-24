// JavaScript Document
/* ***JS VERSION*** */
var jsVersion = 1
/* ***End JS VERSION*** */
var objtPOS
var IDarray = new Array()
var winWidth = (window.screen.width) // - windowWidth) / 2;
var winHeight = (window.screen.height) // - windowHeight) / 2;
var ctyLatLong;
var ctyID;
var isNumber = /[0-9]+/g;
var infoPOIWindows = [];
var markerHotels = [];
var plcTYPE = 'city';
var nameCountry;
var moreExplore;
var titleReg;
var titleArea;
var maskH;
var maskW;
var pics = '';
var aPic = '';
var thumPic = '';
var OthumPic = '';
var TthumPic = '';
var thumMap = '';
var OthumMap = '';
var picSize = 200;
var shwMaps = '';
var isNumber = /[0-9]+/g;
var titleInterest;
var titleAttractions;
var titleCountries;
var titleCities;

$(document).ready(function () {
    maskH = $(document).height();
    maskW = $(window).width();
    ctyID = $('#jplcID').val();
    nameCountry = $('#jplcCo').val();
    moreExplore = $('#moreExplore').val();
    titleReg = $('#regionMore').val();
    titleArea = $('#area').val();
    titleInterest = $('#interests').val();
    titleAttractions = $('#atractions').val();
    titleCountries = $('#ButtonCountries').val();
    titleCities = $('#ButtonCities').val();

    if ($('#jplcTYPE').length > 0) { plcTYPE = $('#jplcTYPE').val(); };
    var feaIti
    var othFea
    if ($('#featItin').length > 0) {
        var feaIti = $('#featItin').val();
        var othFea = $('#otherFeat').val();

        $('#dvfeatPics').html('<div style="height:150px; padding:60px 60px;" ><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"><br>... loading pictures</div>');
        $.ajax({
            type: "GET",
            url: SiteName + "/Api/Packages/PicsForPacks/" + feaIti,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (data) {
                picD = eval(data);
                buildPics(picD);
            },
            error: function (xhr, desc, exceptionobj) {
                $('#dvfeatPics').html(xhr.responseText);
            }
        });
    };
    // check for what is/isn't already checked and match it on the fake ones
    $("input:checkbox").each(function () {
        (this.checked) ? $("#false" + this.id).addClass('falsechecked') : $("#false" + this.id).removeClass('falsechecked');
    });
    // function to 'check' the fake ones and their matching checkboxes
    $(".falsecheck").click(function () {
        ($(this).hasClass('falsechecked')) ? $(this).removeClass('falsechecked') : $(this).addClass('falsechecked');
        $(this.hash).trigger("click");
        return false;
    });
    var cookMark = getCookie('utmcampaign');
    var cookMkVal
    if (cookMark != null) {
        cookMkVal = cookMark.split('=')
        if ($('#qutm_campaign').length != 0) {
            $('#qutm_campaign').val(jQuery.trim(cookMkVal[1]));
            //$('#valCook').html(cookMkVal[1]);
        };
    };
    if ($('#dvPoiMap').length > 0) {
        $('#dvPoiMap, #dvPoiLink').click(function () {
            getMapPoiData(ctyID);
        });

        /* *** TO GET LAT AND LONG FROM CITY NAME ***
        var NAplc = $('#jplcNA').val();
        var geocoder =  new google.maps.Geocoder(); //alert(NAplc);
        geocoder.geocode( { 'address': ''+NAplc+''}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                ctyLatLong = results[0].geometry.location.lat() + '|'+ results[0].geometry.location.lng();
                //alert(ctyLatLong);
                //alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng()); 
            } else {
                alert("Something got wrong " + status);
            };
        }); */
        $('.dvmapClose').click(function () { $('#dvShowMap').hide(); });
    };
    $('.moreButton').click(function () {
        $('.dvEachHide').is(':visible') === false ?
            ($(this).html('Close All ' + titleArea ), $('.dvEachHide').slideDown())
            : ($(this).html('See ' + titleArea ), $('.dvEachHide').slideUp());

    });

    $('.moreButtonExplore').click(function () {
        $('.dvEachHideExpl').is(':visible') === false ?
            ($(this).html('Close All ' + moreExplore ), $('.dvEachHideExpl').slideDown())
            : ($(this).html('See ' + moreExplore ), $('.dvEachHideExpl').slideUp());
    });

    $('.moreButtonInt').click(function () {
        $('.dvEachHideInterest').is(':visible') === false ?
            ($(this).html('Close All ' + titleInterest ), $('.dvEachHideInterest').slideDown())
            : ($(this).html('See ' + titleInterest), $('.dvEachHideInterest').slideUp());
    });
    $('.moreButtonAttractions').click(function () {
        $('.dvEachHideAttractions').is(':visible') === false ?
            ($(this).html('Close All ' + titleAttractions ), $('.dvEachHideAttractions').slideDown())
            : ($(this).html('See ' + titleAttractions ), $('.dvEachHideAttractions').slideUp());
    });
    $('.moreButtonCountries').click(function () {
        $('.dvEachHideCountries').is(':visible') === false ?
            ($(this).html('Close All ' + titleCountries ), $('.dvEachHideCountries').slideDown())
            : ($(this).html('See ' + titleCountries), $('.dvEachHideCountries').slideUp());
    });
    $('.moreButtonCities').click(function () {
        $('.dvEachHideCities').is(':visible') === false ?
            ($(this).html('Close All ' + titleCities ), $('.dvEachHideCities').slideDown())
            : ($(this).html('See ' + titleCities ), $('.dvEachHideCities').slideUp());
    });


    $('#imgForw').click(function () { swichImg('F') });
    $('#imgBack').click(function () { swichImg('B') });
    buildPics2();



});

var num;
var cookVal;
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return null
}
function slideUpDiv() {
    //$('#test').slideToggle('slow');
    //$('#test').animate({  height: 'toggle', opacity: 'toggle'}, "slow");
    //$('#test').animate({  left: 50, opacity: 'show'}, 500);
    //$("#divId").slideUp();
    //$("table").slideDown("slow");
    //$("div").slideUp(1000);
}
var setTop;
var topSet;
function openPopUp(cmsid) {
    var objPos = ObjectPosition(document.getElementById('dvTabs'))
    var centerWidth = (winWidth - 800) / 2;
    var objL = centerWidth + 'px'
    var objT = objPos[1] + 20 + 'px'
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/SqlThisCMS/ " + cmsid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            msg = data;
            if (msg != '') {
                'https:' === document.location.protocol ? (msg = msg.replace(/http:/g, 'https:')) : '';
                $('#txtDisplay').html(msg)
                scrollToHere('dvTabs')
            }
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }
    });
}
var txtMorCls
function ShowHideMoreInfo(picID) {
    if (picID.indexOf('pic') > -1) {
        var moreDiv = 'div' + picID.replace('pic', '');
        var moreText = 'text' + picID.replace('pic', '');
        var idImg = picID
        var srcImg = $('#' + idImg + '').attr("src");
        var valImg = srcImg.indexOf("Plus");
        if (valImg != -1) {
            txtMorCls = $('#' + moreText + '').html();
            $('#' + idImg + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg');
            $('#' + moreText + '').html('close');
            $('#' + moreDiv + '').show();
        }
        else {
            $('#' + idImg + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg');
            $('#' + moreText + '').html(txtMorCls);
            $('#' + moreDiv + '').hide();
        }

    }
    else {
        var moreDiv = 'div' + picID.replace('text', '');
        var moreText = 'text' + picID.replace('text', '');
        var valImg = $('#' + moreText + '').html().indexOf('close');
        var picIF = picID.replace('text', 'pic');
        if (valImg == -1) {
            txtMorCls = $('#' + moreText + '').html()
            if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/minus.jpg'); };
            $('#' + moreText + '').html('close');
            $('#' + moreDiv + '').show();
        }
        else {
            if ($('#' + picIF + '').length > 0) { $('#' + picIF + '').attr('src', 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg'); };
            $('#' + moreText + '').html(txtMorCls);
            $('#' + moreDiv + '').hide();
        }

    }
}
function dvOpenMain(objID) {
    $('#dv' + objID + '').show();
}
function dvCloseMain(dvM) {
    $('#' + dvM + '').hide();
}
function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}
function scrollToHere(obj) {
    var objPos = ObjectPosition(document.getElementById(obj));
    var posL
    posL = objPos[0];
    var posT
    posT = objPos[1] - 10;
    if (obj.indexOf('dvTabs') > -1) { posT = objPos[1] + 25 };
    if (obj.indexOf('aMore') > -1) { posT = objPos[1] - 30; };
    if (obj.indexOf('dvItinRel') > -1) { posT = objPos[1] + 5; };
    $('#popUp').attr('style', 'position:absolute; z-index:9999; width:auto; left:50%; margin-left:-387px; top:' + posT + 'px;');
    $('#popUp').fadeIn(2000);
    var objTOGO
    objTOGO = $('#' + obj + '').offset();
    $('html,body').animate({
        scrollTop: objTOGO.top - Number(170)
    }, 2000);
}
function closeDiv() {
    $('#divRecomended').hide();
}
function divToShow(dv) {
    $('#dv' + dv + '').show();

}
function divToHide(dv) {
    $('#dv' + dv + '').hide();
}
function scrollToMore(jbo) {
    var objTOGO
    objTOGO = jbo
    objTOGO = $('#' + objTOGO + '').offset();
    $('html,body').animate({
        scrollTop: objTOGO.top - 80
    }, 2000);
}
function buildPics(img) {
    var dvShw
    var aPic = ""
    var noPic = 0
    jQuery.each(img, function (data) {
        //alert(noPic);		  
        //if (this.picSEQ > 0 && this.picSEQ <= 3) {
        if (noPic <= 2) {
            aPic = aPic + '<img src="https://pictures.tripmasters.com' + this.picURL.toLowerCase() + '" width="140" height="145" alt="' + this.picNA + '" style="background-color:#fff;	padding:1px; border:1px solid #ccc; -moz-border-radius:4px; -webkit-border-radius:4px; border-radius:4px; margin-left:1px;"/>'
        }
        noPic++
    });
    $('#dvfeatPics').html(aPic);
}
function openDivInfFNw(objID) {
    var picPM = $('#pic' + objID + '').attr('src');
    if (picPM.indexOf('Plus') > -1) {
        $('#dvWait' + objID + '').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" />');
        $('#dvWait' + objID + '').show();
        $('#moreTx' + objID + '').html('Close more details');
        $('#pic' + objID + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Minus.jpg");
        relPackCallFNw(objID);
    }
    else if (picPM.indexOf('Minus') > -1) {
        $('#moreTx' + objID + '').html('More details');
        $('#pic' + objID + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
        $('#pkInf' + objID + '').slideUp();
    }
}
function relPackCallFNw(packID, dvRel) {
    var relTxt = '';
    var mrChoice = '';
    var divCom = 'dvComF' + packID;
    var divInf = 'pkInf' + packID;
    var divRel = 'dvRelF' + packID;
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/sqlRelPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            console.log("Success: " + data);
            msg =  data;
            if (msg != '') {
                relTxt = '<div class="Text_Arial11_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                mrChoice = '<div class="Text_11" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    if (strPrts[i].indexOf('^^') > -1) { strPrts[i] = strPrts[i].replace('^^', ''); };
                    echP = strPrts[i].split('|');
                    relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
                    relTxt = relTxt + '<a href="/europe/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                    relTxt = relTxt + '<span class="Text_Arial11_Light">'
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
            //alert(xhr.responseText +' = error');
        }
    });
}
var imgSrc;
var imgVal;
var idPack;
function openDivInfF(objID, typ) {
    var divOpen = 'pkInf' + objID;
    var picChan = 'pic' + objID;
    var spnText = 'moreTx' + objID;
    var dvMrTx = 'dvMrTxt' + objID;
    var dvMrPic = 'dvMrPic' + objID;
    var dvRelP = 'dvRelF' + objID;
    var arrow = 'arrow' + objID;
    if (typ === 1) {
        var dvOp = $("div[id*='dvMrTxt']");
        for (i = 0; i <= dvOp.length - 1; i++) {
            var estaTx;
            var estaPi;
            if (dvOp[i].id.indexOf(objID) > -1) {
                $('#' + dvMrTx + '').show();
                if ($('#' + divOpen + '').is(":visible")) {
                    $('#' + divOpen + '').hide();
                    $('#otherMr').slideUp();
                    $('#' + dvMrPic + '').hide();
                    $('#' + spnText + '').find('span').css('transform', 'rotate(90deg)');
                }
                else {
                    $('#' + dvMrPic + '').show();
                    $('#' + divOpen + '').show();
                    $('#otherMr').hide();
                    $('#' + spnText + '').find('span').css('transform', 'rotate(270deg)');
                    relPackCall3(objID, dvRelP);
                    $('#otherMr').slideDown(); //hide();
                }
            }
            if (dvOp[i].id.indexOf(objID) === -1) {
                var esta = dvOp[i].id;
                var endStr = esta.length;
                var clsID = esta.substring(7, endStr);
                $('#' + 'pkInf' + clsID + '').hide();
                $('#' + 'dvMrTxt' + clsID + '').show();
                $('#' + 'dvMrPic' + clsID + '').hide();
                $('#dvajx' + clsID + '').hide();
                $('#' + 'moreTx' + clsID + '').find('span').css('transform', 'rotate(90deg)');

            }
        }
    }
    else if (typ === 2) {
        $('#' + dvMrTx + '').show();
        $('#' + dvMrPic + '').hide();
        $('#' + divOpen + '').hide();
        $('#' + spnText + '').find('span').css('transform', 'rotate(90deg)');
        $('#otherMr').slideUp();
        $('#dvajx' + objID + '').hide();

    }
    else {
        imgSrc = $('#' + picChan + '').attr("src");
        imgVal = imgSrc.indexOf("Plus");
        if (imgVal !== -1) {
            $('#' + picChan + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");
            $('#' + spnText + '').html('Close more details');
            $('#' + divOpen + '').show();
            if (typ === 1) {
                $('#otherMr').slideDown(); //show();
            }
            relPackCall3(objID, dvRelP);
        }
        else {
            if (typ === 1) {
                $('#otherMr').slideUp();
                $('#' + spnText + '').find('span').css('transform', 'rotate(90deg)');
            }
            $('#' + picChan + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/Plus.jpg");
            //$('#' + spnText + '').html('More details');
            $('#' + divOpen + '').hide();
            $('#dvajx' + objID + '').hide();

            $('#' + dvRelP + '').html('');
        }


    }
}
function relPackCall3(packID, dvRel) {
    var relTxt = '';
    var mrChoice = '';
    var divCom = 'dvComF' + packID;
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/sqlRelPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            msg = data;
            if (msg != '') {
                relTxt = '<div class="Text_Arial12_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                mrChoice = '<div class="Text_12" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                strPrts = msg.split('@');
                for (i = 0; i <= strPrts.length - 1; i++) {
                    if (strPrts[i].indexOf('^^') > -1) { strPrts[i] = strPrts[i].replace('^^', ''); };
                    echP = strPrts[i].split('|');
                    relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;">'
                    relTxt = relTxt + '<a href="/europe/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                    relTxt = relTxt + '<span class="Text_Arial12_Light">'
                    relTxt = relTxt + '<u>' + echP[0] + ' (' + echP[1] + ')</u>'
                    relTxt = relTxt + '</span></a></span>'
                    if (echP[2] != 5) {
                        mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;"><a style="cursor:pointer;font-size:12px;" class="falsecheckdop" id="falsedop' + echP[3] + packID + '" >' + echP[0] + '</a>'
                        mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + packID + '" id="dop' + echP[3] + packID + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                        mrChoice = mrChoice + '</span>'
                    }
                }
                relTxt = relTxt + '<br style="clear:both"/></div>';
                mrChoice = mrChoice + '<br style="clear:both"/></div>';
                $('#' + dvRel + '').html(relTxt);
                $('#' + divCom + '').html(mrChoice);
                $('#' + divCom + '').show();
                $('#dvajx' + packID + '').slideDown();
                $('#otherMr').slideDown();
                activeCckBx('frm' + packID);
            }
        },
        error: function (xhr, desc, exceptionobj) {
            //alert(xhr.responseText +' = error');
        }
    });
}

function openDivInfo(packID, whr, plcNA, packNA) {
    //dvInfO<%=lnOID%>
    //alert(packID + ' | ' + whr);
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
    if (imgVal !== -1) {
        $('#' + pic + '').attr("src", "https://pictures.tripmasters.com/siteassets/d/minus.jpg");

        $.ajax({
            type: "GET",
            url: SiteName + "/Api/Packages/sqlRelPacks/" + packID,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (data) {
                msg =data;
                if (msg != '') {

                    relTxt = '<div class="Text_Arial12_LightBold" style="padding:5px 3px;">Related Package</div><div style="padding:2px 2px;" align="left">'
                    mrChoice = '<div class="Text_12" style="padding:3px 3px 5px 3px;"><b>For more choices, combine cities found in this itinerary:</b></div><div style="padding:2px 2px;" align="left">'
                    strPrts = msg.split('@');
                    for (i = 0; i <= strPrts.length - 1; i++) {
                        //alert(strPrts[i]);
                        if (strPrts[i].indexOf('^^') > -1) { strPrts[i] = strPrts[i].replace('^^', ''); };
                        echP = strPrts[i].split('|');
                        relTxt = relTxt + '<span style="float:left; margin-right:5px; margin-bottom:3px;font-size:12px">'
                        relTxt = relTxt + '<a href="/europe/' + echP[0].replace(/\s/g, '_').toLowerCase() + '/vacations" style="margin-right:10px">'
                        relTxt = relTxt + '<span class="Text_Arial12_Light">'
                        relTxt = relTxt + '<u>' + echP[0] + ' (' + echP[1] + ')</u>'
                        relTxt = relTxt + '</span></a></span>'
                        if (echP[2] != 5) {
                            mrChoice = mrChoice + '<span style="float:left; margin-right:5px; margin-bottom:3px;font-size:12px"><a style="cursor:pointer;font-size:12px;" class="falsecheckdop" id="falsedop' + echP[3] + packID + '" >' + echP[0] + '</a>'
                            mrChoice = mrChoice + '<input type="checkbox" name="dop' + echP[3] + packID + '" id="dop' + echP[3] + packID + '" style="display:none" value="' + echP[3] + '|' + echP[0] + '"/>'
                            mrChoice = mrChoice + '</span>'
                        }
                    }
                    relTxt = relTxt + '<br style="clear:both"/></div>';
                    mrChoice = mrChoice + '<br style="clear:both"/></div>';

                    $('#' + divRel + '').html(relTxt);
                    $('#' + divRel + '').show();
                    $('#' + divTxt + '').attr("class", "Text_Arial14");
                    $('#' + divCom + '').html(mrChoice);
                    $('#' + divCom + '').show();
                    $('#' + divWai + '').html('');
                    $('#' + divWai + '').hide();
                    $('#' + divInf + '').slideDown(); //show();
                    $('#' + 'arrow' + packID + '').css('transform', 'rotate(270deg)');

                    activeCckBx('frm' + packID);
                }
            },
            error: function (xhr, desc, exceptionobj) {
                //alert(xhr.responseText +' = error');
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
        $('#' + divInf + '').slideUp(); //.hide();
        $('#' + 'arrow' + packID + '').css('transform', 'rotate(90deg)');

    }
}
function activeCckBx(frm) {
    $('#' + frm + ' input:checkbox').each(function () {
        (this.checked) ? $('#false' + this.id + '').addClass('falsecheckeddop') : $("#false" + this.id + '').removeClass('falsecheckeddop');
    });
    // function to 'check' the fake ones and their matching checkboxes
    $('#' + frm + ' .falsecheckdop').click(function () {
        var replID = this.id.replace('false', '');
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
}
var totpg
var strMsg
var strDiv
var placeNA
var placeID
var FrToTxt = new Array

/* TO TAKE ID FROM FORM TO FIND PACKAGES */
function findPacks(formID) {
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
function windowCMS(id, w, h) {
    var jhref = '/cms/' + id + '?cms&wh=0&wf=0';
    centerWindow(jhref);
    return false;
}
/* *** POI MAP *** */
var objPOI;
var map;
var ctylocLat = 0;
var ctylocLong = 0;
//var allLat = [];
//var allLong = [];
//var allLatLong = [];
//var lat1, lat2, long1, long2;
//var dynZoom;
//var bPrt;


function dvOpenMore(obj) {
    var pos = $('#' + obj + '').position();
    //var dvhtml = $('#'+obj+'').html();
    var tp = pos.top
    var lf = pos.left + 200
    var hg = $(document).height();
    $('#dvmoreCities').attr('style', 'position:absolute; z-index:100; width:600px; height:auto; top:' + tp + 'px; left:' + lf + 'px; background:#fff; border:solid 1px #ccc; padding: 5px 0 15px 0').show();
    $('#dvmask').attr('style', 'position:absolute;z-index:99;background-color:#369;display:none;top:0;left:0;opacity:.7; width:100%; height:' + hg + 'px');
    $('#dvmask').show();
}
function dvCloseMore(obj) {
    $('#' + obj + '').hide();
    $('#dvmask').removeAttr('style').hide();
}
//function getMapPoiData(plcid) {
//    ctylocLat = 0;
//    ctylocLong = 0;
//    var cylat = [];
//    var cylon = [];
//    $.ajax({
//        type: "POST",
//        url: "/latin/WS_Library.asmx/getPoiToMap",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        data: '{plcID:"' + plcid + '"}',
//        success: function (data) {
//            objPOI = eval("(" + data.d + ")");
//            var LL = 0;
//            //delete allLatLong;
//            jQuery.each(objPOI, function (data) {
//                //allLatLong.push(this.POI_Longitude + '|' + this.POI_Latitude);
//                //allLong.push(this.POI_Longitude);
//                //ctylocLat = Number(ctylocLat) + Number(this.POI_Latitude);
//                cylat.push(Number(this.POI_Latitude))
//                //ctylocLong = Number(ctylocLong) + Number(this.POI_Longitude);
//                cylon.push(Number(this.POI_Longitude))
//                LL++;
//            });
//            var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
//            var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
//            distLats = "";
//            distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
//            ctyLatLong = "";
//            ctyLatLong = Number(midLat) + '|' + Number(midLon); //Number(ctylocLat / LL) +'|'+ Number(ctylocLong / LL);
//            preBuildMap(data);
//            /*delete ctyLatLong;
//            delete dynZoon;
//            ctyLatLong = Number(ctylocLat / LL) + '|' + Number(ctylocLong / LL);
//            var maxLong = Math.max.apply(Math, allLong);
//            var minLong = Math.min.apply(Math, allLong);
//            jQuery.each(allLatLong, function (a, b) {
//                bPrt = b.split('|');
//                if (bPrt[0] = minLong) { lat1 = bPrt[1]; long1 = bPrt[0]; };
//                if (bPrt[0] = maxLong) { lat2 = bPrt[1]; long2 = bPrt[0]; };
//                delete bPrt;
//            });
//            dynZoom = getDistanceFromLatLonInKm(lat1, long1, lat2, long2)
//            preBuildMap(data);*/
//        },
//        error: function (xhr, desc, exceptionobj) {
//            $('#dvGoogleMap').html(xhr.responseText);
//        }
//    });
//};

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
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function buildMapPoi(data) {
    map = null;
    var useLatLong = ctyLatLong.split('|');
    var regLat = useLatLong[0];
    var regLong = useLatLong[1];
    var rlatlng = new google.maps.LatLng(regLat, regLong);
    var poiZoom = 10;
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
    }
    //if (plcTYPE == 'area') { poiZoom = 9 };
    //if (plcTYPE == 'city') { poiZoom = 14 };
    //if (dynZoom > 28) {
    //if ((dynZoom > 30 && dynZoom < 50) || (dynZoom > 50 && dynZoom < 70)) {
    //poiZoom = 10;
    //} else if (dynZoom > 70) {
    //poiZoom = 9;
    //} else {
    //poiZoom = 11;
    //}

    //} else {
    //poiZoom = 10;
    //};
    var myOptions = {
        zoom: poiZoom,
        //maxZoom: 20,
        //minZoom: 5,
        center: rlatlng,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        panControl: true,
        zoomControl: true,
        //zoomControlOptions: {
        //style: google.maps.ZoomControlStyle.SMALL,
        //position: google.maps.ControlPosition.TOP_LEFT
        //},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvGoogleMap"), myOptions);
    var Pcont = 0;
    jQuery.each(objPOI, function (data) {
        Pcont++;
        var locLat = this.POI_Latitude;
        var locLong = this.POI_Longitude;
        var iconImg = 'MapMarker_Ball__Orange_40.gif';
        var poiAnchor = new google.maps.Point(4, 25)
        //var marker = new MarkerWithLabel({
        //    icon: '/latin/images/' + iconImg,
        //    position: new google.maps.LatLng(locLat, locLong),
        //    map: map,
        //    draggable: false,
        //    raiseOnDrag: true,
        //    //labelContent: '<div class="bubble">' + this.POI_Title + '</div>',
        //    labelAnchor: poiAnchor,
        //    labelInBackground: false,
        //    labelStyle: { opacity: 1 },
        //    title: this.POI_Title,
        //    zIndex: 8998
        //});
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
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
        message = message + '<div>' + this.POI_Title + '</div>';
        if (this.POI_Description != 'none') {
            message = message + this.POI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); }); //infoWind.open(map,marker);});
        infoPOIWindows.push(infoWind);

        var sname = this.POI_Title;
        var infoSTitle = new google.maps.InfoWindow({ content: sname, size: new google.maps.Size(20, 20) });
        google.maps.event.addListener(marker, 'mouseover', function () { infoSTitle.open(map, marker); });
        google.maps.event.addListener(marker, 'mouseout', function () { infoSTitle.close(map, marker); });
    });
};

function preBuildMap(data) {
    var $dvMap = $('#dvShowMap');
    var $objpos = $('#dvPoiLink');
    var popP = $objpos.offset();
    var popT;
    if (popP.top <= 600) { popT = 100 } else { popT = popP.top - 300 };
    $dvMap.attr('style', ' top:' + popT + 'px;');
    $dvMap.attr('class', 'dvShowMap');
    $dvMap.show();
    $('html,body').animate({ scrollTop: popT - 30 }, 2000);
    buildMapPoi(data);
};
function closePoiInfoW(mp, mrk, winfo) {
    for (var i = 0; i < infoPOIWindows.length; i++) {
        infoPOIWindows[i].close();
    };
    winfo.open(mp, mrk);
};
var objHotPOI;
//function getHotClosePoiData(plcid, elat, elong, mark) {
//    var infoToClose;
//    for (var i = 0; i < infoPOIWindows.length; i++) {
//        if (infoPOIWindows[i].getMap()) {
//            infoPOIWindows[i].setContent('<div style="height:auto; padding:10px 10px;" ><img src="/latin/images/ajax-loader.gif"><br/>... loading hotels</div>');
//            infoToClose = infoPOIWindows[i];
//        };

//    };
//    for (var i = 0; i < markerHotels.length; i++) {
//        markerHotels[i].setMap(null);;
//    };
//    var myLatLng = new google.maps.LatLng(elat, elong);
//    var zoom = 15;
//    map.setZoom(zoom);
//    map.panTo(myLatLng);
//    $.ajax({
//        type: "POST",
//        url: "/latin/WS_Library.asmx/getHotelClosePOI",
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        data: '{plcID:"' + plcid + '", hLat:"' + elat + '", hLong:"' + elong + '"}',
//        success: function (data) {
//            objHOT = eval("(" + data.d + ")");
//            if (objHOT.length > 0) {
//                infoToClose.close();
//                buildHotelPoi(data);
//            }
//            else {
//                infoToClose.setContent('<div style="height:auto; padding:10px 10px;" >No closer hotels found</div>');
//            }
//        },
//        error: function (xhr, desc, exceptionobj) {
//            alert(xhr.responseText);
//            //$('#dvGoogleMap').html(xhr.responseText);
//        }
//    });
//};
function buildHotelPoi(data) {
    var Phcont = 0;
    jQuery.each(objHOT, function (data) {
        Phcont++;
        var hlocLat = this.PTY_Latitude;
        var hlocLong = this.PTY_Longitude;
        var starNum = this.SCD_CodeTitle.match(isNumber);
        var hiconImg = 'hotel_' + starNum + 'stars_GR.png';
        var hpoiAnchor = new google.maps.Point(-13, 39)
        //var hmarker = new MarkerWithLabel({
        //	icon: '/latin/images/'+ hiconImg,
        //	position: new google.maps.LatLng(hlocLat, hlocLong),
        //	map: map,
        //	draggable: false,
        //	raiseOnDrag: true,
        //	labelContent: '<div class="bubbleH">'+ this.PDL_Title +'</div>',
        //	labelAnchor: hpoiAnchor,
        //	labelInBackground: false,
        //	labelStyle: {opacity: 0.75},
        //	title: this.PDL_Title,
        //	zIndex: 8998
        //});
        var hmarker = new google.maps.Marker({
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + hiconImg,
            position: new google.maps.LatLng(hlocLat, hlocLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelContent: '<div class="bubbleH">' + this.PDL_Title + '</div>',
            labelAnchor: hpoiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 0.75 },
            title: this.PDL_Title,
            zIndex: 8998
        });
        var message = '<div class="dvHotBubble">';
        if (this.IMG_Path_URL != 'none') {
            message = message + '<div class="dvimgHot"><img src="https://pictures.tripmasters.com' + this.IMG_Path_URL.toLowerCase() + '"/></div>';
        };
        message = message + '<div class="dvaddHot"><span>' + this.PDL_Title + '</span><br/><img src="https://pictures.tripmasters.com/siteassets/d/Stars_' + starNum + '_Stars.gif"/><p>' + this.PTY_Address + '</p></div>';
        if (this.POI_Description != 'none') {
            message = message + '<div class="dvdescHot">' + this.PTY_Description + '</div>';
        };
        message = message + '</div>';
        var infoHWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(hmarker, 'click', function () { infoHWind.open(map, hmarker); });
        markerHotels.push(hmarker);
    });
};
function triptaketo(cotogo) {
    if (cotogo == '0') {
        return;
    }
    var goparts = cotogo.split('|');
    var plid = goparts[1];
    var plna = goparts[0];
    window.location = "/europe/" + plna+ "/trips_taken_by_travelers"
}



function imageSize(thisPic, thisTyp) {
    if (thisPic.match(img500) != null || thisTyp == 'M0') {
        picW = '290px';//picH='290px'; 
        picMtp = '0px';
        $('.selM').css('width', '399px');
        $('#dvallTHU').attr('style', 'width:258px;');
    }
    else {
        picW = '200px';//picH='200px'; 
        picMtp = '45px';
        $('.selM').css('width', '399px');
        $('#dvallTHU').attr('style', 'width:258px;');
    };
    return [picW, picMtp];
};
function CarrouPicsBuild(phoN) {
    CoPic = 0;
    CoMap = 0;
    for (i = 0; i < phoN; i++) {
        if (i == 0) { picClass = "picSel" } else { picClass = "picNSel" };
        if (objPics[i].imG_ImageType == 'P0') {
            CoPic++
            TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>';
        } else if (objPics[i].imG_ImageType == 'M0') {
            CoMap++
            TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '"  class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';
            hvBigMap = 1;
        }
        ini = 0;
        fin = i;
    }
    if (picTotal < 6) {
        var leftPadd = 18 * (6 - picTotal);
    } else { leftPadd = 0; }
    $('#dvallTHU #prev').css({ "padding-left": "" + leftPadd + "px", "background-position": "" + leftPadd + "px 0" });
    $('#thumbs').html(TthumPic);
    $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
    $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
};


function sliceThumb(ifrom, ito, idir) {
    TthumPic = ""
    if (idir == 'prev') {
        if (ito == picTotal - 1) {
            var diff = Number(ito - ifrom);
            ifrom = ifrom - 6;
            ito = Number(ito - diff) - 1;
        }
        else {
            ifrom = ifrom - 6;
            ito = ito - 6;
        }
        if (ifrom < 0) { alert('No more images'); return false; }
        else {
            var CoPic = ifrom;
            var CoMap = ifrom;
            for (i = ifrom; i <= ito; i++) {
                picClass = "picNSel"
                if (objPics[i].imG_ImageType == 'P0') {
                    CoPic++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>'

                }
                else if (objPics[i].imG_ImageType == 'M0') {
                    CoMap++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';

                }
                ini = ifrom;
                fin = i;
            }
            $('#thumbs').hide("slide", { direction: 'right' }, 200);
            $('#thumbs').html(TthumPic);
            $('#thumbs').show("slide", { direction: 'left' }, 500);
            $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
            $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });

        };
    }
    if (idir == 'next') {
        if (ito > picTotal - 1) { ito = picTotal - 1 };
        if (ifrom >= picTotal - 1) { alert('No more images'); }
        else {
            var CoPic = ifrom - 1;
            var CoMap = ifrom - 1;
            for (i = ifrom; i <= ito; i++) {
                picClass = "picNSel"
                if (objPics[i].imG_ImageType == 'P0') {
                    CoPic++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/></span>'

                }
                else if (objPics[i].imG_ImageType == 'M0') {
                    CoMap++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/><br/>map</span>';

                };
                ini = ifrom;
                fin = i;
            };
            $('#thumbs').hide("slide", { direction: 'left' }, 200);
            $('#thumbs').html(TthumPic);
            $('#thumbs').show("slide", { direction: 'right' }, 500);
            $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
            $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });

        };
    };
};

function changePic(picID, picSRS, picTTL, picALT) {
    var imG_Path_URL = 'https://pictures.tripmasters.com' + picALT
    if (picALT == 'none') { imG_Path_URL = picSRS; };
    if (picID.indexOf('O') == -1) {
        var objP = $('#dvImgContOv').position();
        $('#dvbk').hide();
        $('#dvfr').hide();
        $('#dvmediaPopUp').attr('style', 'position:absolute; z-index:9998; width:1010px; left:50%; margin-left:-505px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;');
        $('#dvmediaPopUp').show();
        $('img.picSel[id*="Kipic"]').attr('class', 'picNSel');
        $('img.picSel[id*="Mipic"]').attr('class', 'picNSel');
        $('#' + picID + '').attr('class', 'picSel');
        $('#dvFstPic').html('<img src="' + imG_Path_URL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" />');
        if (picID.indexOf('M') > -1) {
            $('#dvMV').hide();
            var pattern = /[0-9]+/ //+/g;
            var num = picID.match(pattern);
            $('#Mipic' + num + '').attr('class', 'picSel');
        } else {
            $('#dvMV').show();
            $('#dvPicNa').html(picTTL);
        }
    }
    else {
        $('img[id*="Oipic"]').attr('class', 'picNSel');
        $('#' + picID + '').attr('class', 'picSel');
        if (picID.indexOf('Map') > -1 || imG_Path_URL.match(img500) != null) { $('#dvshowPIC').html('<img src="' + imG_Path_URL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '" alt="' + picALT + '" title="' + picTTL + '" width="290" height="290" onclick="moreMediaB(this.id, this.src, this.title, this.alt); " class="clsCursor"/>'); $('.selM').css('width', '399px'); $('#dvallTHU').attr('style', 'width:258px;'); }
        else { $('#dvshowPIC').html('<img src="' + imG_Path_URL.toLowerCase() + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" style="margin-top:45px;" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>'); $('.selM').css('width', '399px'); $('#dvallTHU').attr('style', 'width:258px;'); };
    }
};

function popUpImagesNav() {
    thumPic = '';
    thumMap = '';
    hvMap = 0;
    var Cpic = 0;
    var Cmap = 0;
    var thumClass = 'picNSel';
    for (i = 0; i < Number(picTotal); i++) {
        if (i == 0) { thumClass = 'picSel' } else { thumClass = 'picNSel' };
        if (objPics[i].imG_ImageType == 'P0') {
            Cpic++
            thumPic = thumPic + '<img id="Kipic' + Cpic + '" class="' + thumClass + '" src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '"/>';
        }
        else if (objPics[i].imG_ImageType == 'M0' || objPics[i].imG_ImageType == 'M1') {
            Cmap++
            thumMap = thumMap + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" id="Mipic' + Cmap + '" class="' + thumClass + '" width="30" height="30" alt="' + objPics[i].imG_500Path_URL + '" title="' + objPics[i].imG_Title + '"/>';
            hvMap = 1;
        };
    };
    newPicTot = Cpic;
    $('#dvThuPic').html('Photos<br/>' + thumPic);
    if (hvMap == 1) {
        $('#dvThMp').show();
        $('#dvThuMap').html('Map<br/>' + thumMap);
    }
    else {
        $('#dvThMp').hide();
        $('#dvTabMap').hide();
    };
    $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
    $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
};


function swichImg(bf) {
    var totPic;
    totPic = newPicTot // imgC;
    var thisPic = $('img.picSel[id*="K"]');
    var iID = thisPic.attr('id');
    iID = iID.replace('ipic', '');
    if (iID.indexOf('O') > -1) { iID = iID.replace('O', ''); };
    if (iID.indexOf('K') > -1) { iID = iID.replace('K', ''); };
    var newID;
    var newPic;
    var newImg;
    if (bf == 'F') {
        if (iID == totPic) { alert('No more photos') }
        else {
            newID = Number(iID) + 1;
            newImg = objImgs[iID].imG_500Path_URL;
            if (newImg == '') { newImg = objImgs[newID].imG_Path_URL; };
            newPic = $('#Kipic' + newID + '');
            $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
            $('#dvPicNa').html(newPic.attr('title'));
            newPic.attr('class', 'picSel');
            thisPic.attr('class', 'picNSel');
        };
    };
    if (bf == 'B') {
        if (iID == 1) { alert('No more photos') }
        else {
            newID = Number(iID) - 1;
            newImg = objImgs[newID - 1].imG_500Path_URL;
            if (newImg == '') { newImg = objImgs[newID - 1].imG_Path_URL; };
            newPic = $('#Kipic' + newID + '');
            $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
            $('#dvPicNa').html(newPic.attr('title'));
            newPic.attr('class', 'picSel');
            thisPic.attr('class', 'picNSel');
        };
    };
};

function buildPics2() {
    var dvShw;
    var hvMap = 0;
    var hvBigMap = 0;
    var picU;
    var picW, picH, picMtp;
    var fstPic;
    var picClass;
    var idIMG = 'Bipic';
    var idNUM = 3
    var packID = $('#imgItemID').val();

    //p(ct).picURL = dvpicksPack(ct)("IMG_Path_URL")
    //p(ct).picNA = dvpicksPack(ct)("IMG_Title")
    //picSQ = dvpicksPack(ct)("PXI_Sequence") + 1
    //p(ct).picSEQ = picSQ 'dvpicksPack(ct)("PXI_Sequence")
    //p(ct).picTYP = dvpicksPack(ct)("IMG_ImageType")
    //p(ct).picBIG = dvpicksPack(ct)("IMG_500Path_URL")

    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Packages/PicsForPacks/" + packID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            objPics = data;
            //console.log(objPics);
            objImgs = $.grep(objPics, function (n, i) { return (n.imG_ImageType == 'P0'); });
            picTotal = objPics.length;
            for (i = 0; i < 3; i++) {
                aPic = aPic + '<img src="https://pictures.tripmasters.com' + objPics[i].imG_Path_URL.toLowerCase() + '" width="140" height="140" id="Bipic' + Number(i + 1) + '" alt="' + objPics[i].imG_500Path_URL.toLowerCase() + '" title="' + objPics[i].imG_Title + '" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>';
            };
            $('#dvImgT26').html(aPic);
            var imageIndex = 0;
            if (objPics.length <= 3)
                imageIndex = objPics.length - 1;
            if (objPics[imageIndex]) {
                picW = imageSize(objPics[imageIndex].imG_500Path_URL, objPics[imageIndex].imG_ImageType)
                if (objPics[imageIndex].imG_ImageType == 'M0') {
                    idIMG = 'KipicMap';
                    idNUM = 1;
                }
                $('#dvshowPIC').html('<img src="https://pictures.tripmasters.com' + objPics[imageIndex].imG_500Path_URL.toLowerCase() + '" id="' + idIMG + idNUM + '" alt="' + objPics[imageIndex].imG_500Path_URL.toLowerCase() + '" title="' + objPics[imageIndex].imG_Title + '" width="290px"' +  '" height="290px"' +  '" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>');
                $('#dvshowPIC').show();
            };
            if (picTotal == 3) {
                CarrouPicsBuild(3);
            } else if (picTotal == 4) {
                CarrouPicsBuild(4);
            } else if (picTotal == 5) {
                CarrouPicsBuild(5);
            } else {
                CarrouPicsBuild(6);
            }
            for (m = 0; m < Number(picTotal - 1); m++) {
                if (objPics[m].imG_ImageType == 'M0') {
                    $('#dvsmalMAP').html('<image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL + '" width="325" height="325" alt="' + objPics[m].imG_500Path_URL.toLowerCase() + '" title="' + objPics[m].imG_Title + '"/>');
                    $('#dvsmalMAP').show();
                    shwMaps = shwMaps + '<div align="center"><span class="Text_Arial12_LightBold">' + objPics[m].imG_Title + '</span><br/><br/><image src="https://pictures.tripmasters.com' + objPics[m].imG_500Path_URL + '" alt="' + objPics[m].imG_500Path_URL.toLowerCase() + '" title="' + objPics[m].imG_Title + '"/></div>';
                    $('#dvShwMap').html(shwMaps);
                    m = Number(picTotal - 1)
                }
                else {
                    if (hvBigMap == 1) {
                        $('#dvShwMap').html(shwMaps);
                    }
                    else {
                        $('#dvTabMap').hide();
                    };
                };
            };
        },
        error: function (xhr, desc, exceptionobj) {
            $('#packPics').html(xhr.responseText);
        }
    });
    $('a[id*="prev"]').click(function () { sliceThumb(Number(ini), Number(fin), this.id); return false; });
    $('a[id*="next"]').click(function () { sliceThumb(Number(ini + 6), Number(fin + 6), this.id); return false; });
};


function moreMedia() {
    var img1S = objPics[0].imG_500Path_URL;
    if (img1S == undefined) { img1S = objPics[0].imG_Path_URL; };
    var img1T = objPics[0].imG_Title;
    $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + img1S.toLowerCase() + '" title="' + img1T + '" alt="' + img1S.toLowerCase() + '"/>');
    $('#dvPicNa').html(img1T);
    popUpImagesNav();
    var objP = $('#dvImgContOv').position();
    var dvW = 1010;
    var dvML = -505;
    $('#dvMask').css({ 'width': maskW, 'height': maskH });
    $('#dvMask').fadeTo("slow", 0.65);
    $('#dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;'); //top:25%
    $('#dvmediaPopUp').show();
    window.scrollTo(0, Number(objP.top + 600));
    //scrollToTop();
};
function moreMediaB(picID, picSRS, picTTL, picALT) {
    popUpImagesNav();
    var objP = $('#dvImgContOv').position();
    var dvW = 1010;
    var dvML = -505;
    $('#dvMask').css({ 'width': maskW, 'height': maskH });
    $('#dvMask').fadeTo("slow", 0.8);
    $('#dvmediaPopUp').attr('style', 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:' + dvML + 'px; top:' + Number(objP.top + 610) + 'px; height:auto; background-color:#FFF;');
    $('#dvmediaPopUp').show();
    window.scrollTo(0, Number(objP.top + 600));
    //scrollToTop();
    changePic(picID.replace('B', 'K'), picSRS, picTTL, picALT);
};
function moreMediaCLS() {
    $('#dvMask').hide();
    $('#dvmediaPopUp').hide();
};

function scrollToTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 800);
};
function triptaketo(cotogo) {
    if (cotogo == '0') {
        return;
    }
    var goparts = cotogo.split('|');
    var plid = goparts[1];
    var plna = goparts[0];
    window.location = "/europe/" + plna + "/trips_taken_by_travelers" ;
}