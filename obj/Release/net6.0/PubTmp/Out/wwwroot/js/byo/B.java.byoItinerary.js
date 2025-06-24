// JavaScript Document
var pakNTS;
var backCook;
var objPics;
var objImag;
var picTotal;
var CoPic = 0;
var CoMap = 0;
var newPicTot;
var depAirport = [];
var arrAirport = [];
var arrCty = [];
var citySelID;
var totCity;
var cookDate;
var newdvCnt;
var airCabin = [{ label: 'Coach', value: 'Coach', id: 'Y' }, { label: 'Premium Economy', value: 'Premium Economy', id: 'W' }, { label: 'Business', value: 'Business', id: 'C' }, { label: 'First Class', value: 'First Class', id: 'F' }];
var carTake = [{ label: 'Airport', value: 'Airport', id: 'A' }];
var carDay = [{ label: 'First Day', value: 'First Day', id: 'F' }, { label: 'Last Day', value: 'Last Day', id: 'L' }];
var stayLength = [];
for (i = 1; i <= 14; i++) {
    var stayObj;
    if (i == 1) { stayObj = { label: i + ' nt', value: i + ' night', id: i }; } else { stayObj = { label: i + ' nts', value: i + ' nights', id: i }; };
    stayLength.push(stayObj);
};
var isNumber = /[0-9]+/g;
var paxRooms = [{ id: '1|1', label: '1 room for 1 adult', value: '1 room for 1 adult' }, { id: '1|2', label: '1 room for 2 adults', value: '1 room for 2 adults' }, { id: '1|3', label: '1 room for 3 adults', value: '1 room for 3 adults' }, { id: '1|4', label: '1 room for 4 adults', value: '1 room for 4 adults' }, { id: '1|5', label: '1 room/suite for 5 adults', value: '1 room/suite for 5 adults' }, { id: '1|6', label: '1 room/suite for 6 adults', value: '1 room/suite for 6 adults' }, { id: '1|Other', label: '1 room with children or other options', value: '1 room with children or other options' }, { id: '-1', label: '----------------------------------------------------', value: '' }, { id: '2|2-2', label: '2 rooms for (2 adults + 2 adults)', value: '2 rooms for (2 adults + 2 adults)' }, { id: '2|3-3', label: '2 rooms for (3 adults + 3 adults)', value: '2 rooms for (3 adults + 3 adults)' }, { id: '2|Other', label: '2 rooms with children or other options', value: '2 rooms with children or other options' }, { id: '-1', label: '----------------------------------------------------', value: '' }, { id: '3|2-2-2', label: '3 rooms for (2 adults + 2 adults + 2 adults)', value: '3 rooms for (2 adults + 2 adults + 2 adults)' }, { id: '3|Other', label: '3 rooms with children or other options', value: '3 rooms with children or other options' }];
var adultPax = [];
var ini;
var fin;
for (a = 1; a <= 6; a++) {
    var adultObj;
    adultObj = { label: a, value: a };
    adultPax.push(adultObj);
};
var childPax = [];
for (c = 0; c <= 2; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childPax.push(chilObj);
};
//var maskH;
//var maskW;
var windW;
var windH;
var vidD = '';
var pics = '';
var aPic = '';
var thumPic = '';
var OthumPic = '';
var TthumPic = '';
var thumMap = '';
var OthumMap = '';
var video = '';
var activeLink = 0;
var picThu = '';
var shwMaps = '';
var ctySSPRO = [];
var ctyHotPRO = [];
var allCtySSPRO = [];
var allCtyHotPRO = []
var sIndex = 11;
var offSet = 10;
var isPreviousEventComplete = true;
var isDataAvailable = true;
var today = new Date();
var fixdates = [];
var blockdates = [];
$.event.special.inputchange = {
    setup: function () {
        var self = this, val;
        $.data(this, 'timer', window.setInterval(function () {
            val = self.value;
            if ($.data(self, 'cache') != val) {
                $.data(self, 'cache', val);
                $(self).trigger('inputchange');
            };
        }, 20));
    },
    teardown: function () {
        window.clearInterval($.data(this, 'timer'));
    },
    add: function () {
        $.data(this, 'cache', this.value);
    }
};
$(document).ready(function () {

    var cookMark = getCookie('utmcampaign');
    var cookMkVal;
    if (cookMark != null) {
        cookMkVal = cookMark.split('=');
        if ($('#xutm_campaign').length != 0) {
            $('#xutm_campaign').val(jQuery.trim(cookMkVal[1]));
        };
    };
    
    packID = $('#pakID').val();
    packNA = $('#pakNA').val();
    totCity = $('#inpCities').val();
    pakNTS = $('#pakNTS').val();
    // -- fix dates
    fixdates = $('#fixDates').val().split(',');
    // -- fix dates
    blockdates = $('#blockDates').val().split('|');
    /*  ****  USA DEPARTURE AIRPORTS/CITIES  *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/DepCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{name:"%"}',
        success: function (res) {
            var msg = res;
            depAirport = $.map(msg, function (m) {
                return {
                    label: m.plC_Title + " - " + m.plC_Code,
                    value: m.plC_Title, // + " - " + m.plcCO ,
                    id: m.plcid
                };
            });
            doitDeparture('xtxtLeavingFrom');
            doitDeparture('xtxtReturningTo');
        },
        error: function (xhr, desc, exceptionobj) {
        }
    });
    $('#aAirDiff').click(function () {
        $('#divAirAdvance').hide();
        $('#divReturnAir').removeClass('dvHide');
    });
    $('#xCabinTxt').autocomplete({
        autoFocus: true,
        source: airCabin,
        minLength: 0,
        position: { collision: "flip" },
        select: function (event, ui) {
            $('#xCabinTxt').val(ui.item.label);
            $('#xCabin').val(ui.item.id);
            $('#xrdAWair').focus();
            return false;
        }
    }).click(function () {
        $(this).val('');
    }).focus(function () {
        $(this).keydown();
    });
    /* **** PAX / ROOMs **** */
    doitPaxRoom('xiRoomsAndPaxText');
    doitPaxRoom('xiAdultsText');
    doitPaxRoom('xiChildrenText');
    $('input:text[id^="xRoom"]').each(function () { if (this.id.indexOf('_iAdults') > -1 || this.id.indexOf('_iChildren') > -1) { doitPaxRoom(this.id); }; });

    /*  ****  ALL DESTINATIONS ARRIVAL AIRPORTS/CITIES *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/PriorCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{name:"%"}',
        success: function (res) {
            var msg = res;
            arrCty = $.map(msg, function (m) {
                return {
                    label: m.ctyNA + " - " + m.couNA,
                    value: m.ctyNA, // + " - " + m.plcCO ,
                    id: m.ctyID
                };
            });
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText);
        }
    });

    $('input:radio[id^="xrdselTrans"]').click(function () {
        (this.checked) ? $(this).parent().addClass('spBoldTxt') : $(this).parent().removeClass('spBoldTxt');
    });

    /* *** BUILD CALENDAR FROM XML OR FROM COOKIE BACK *** */
    backCook = Cookies.get('TMEDpkbyoBack'); //jQuery.extendedjsoncookie('getCookieValueDecoded','TMASpkbyoBack');
    //alert(backCook +" = backCook");
    if (backCook == null || backCook == undefined) {
        //alert("backCook is: " + backCook);
        //$('#xtotCities').val(totCity);
        itineraryModifed(packID, packNA);
    }
    else {
        //alert("backCook need to build calendar");
        buildFromCookie1();
    };

    $('#imgForw').click(function () { swichImg('F') });
    $('#imgBack').click(function () { swichImg('B') });

    $('span[id^="aboutOVR"]').each(function (e) {
        $(this).click(function (e) {
            e.preventDefault();
            var popID = $(this).attr('id').replace('aboutOVR', 'aboutDIV');
            var SqCy = $(this).attr('id').replace('aboutOVR', 'jxTrick');
            $('.' + SqCy + '').popupWindow({ centerBrowser: 1, height: 600, width: 750, resizable: 1, scrollbars: 1 });
            openMask();
            var posObj = $(this).offset();
            var posT = posObj.top + 10;
            var posL = posObj.left - 600
            $('#' + popID + '').attr('style', 'padding:5px; position:absolute; width:800px; margin-left:-400px; display:none; z-index:9998; left:50%; top:' + posT + 'px;');
            $('#' + popID + '').fadeIn(2000);
            scrollToMorePop(popID);
        });
    });
    $('img[id^="aboutCls"]').click(function (e) {
        var popID = $(this).attr('id').replace('aboutCls', 'aboutDIV');
        $('#' + popID + '').hide();
        $('.mask').hide();
    });
    $('img[id^="aboutPL"]').each(function (e) {
        $(this).click(function (e) {
            e.preventDefault();
            var popID = $(this).attr('id').replace('aboutPL', 'aboutDIV');
            var SqCy = $(this).attr('id').replace('aboutPL', 'jxTrick');
            $('.' + SqCy + '').popupWindow({ centerBrowser: 1, height: 600, width: 750, resizable: 1, scrollbars: 1 });
            openMask();
            var posObj = $(this).offset();
            var posT = posObj.top + 10;
            var posL = posObj.left - 600
            $('#' + popID + '').attr('style', 'padding:5px; position:absolute; width:800px; margin-left:-400px; display:none; z-index:9998; left:50%; top:' + posT + 'px;');
            $('#' + popID + '').fadeIn(2000);
            scrollToMorePop(popID);
        });
    });
    //CMS
    $('.jxCoInf').click(function () {
        var jsHref = $(this).attr('href');

        var x = window.screenX + (((window.outerWidth / 2) - (1100 / 2)));
        var y = window.screenY + (((window.outerHeight / 2) - (650 / 2)));
        window.open('/europe' + jsHref, 'new', 'height=200,width=800,left=' + x + ',top=' + y + ',scrollbars=yes').focus();
        //var jsQuest = jsHref.indexOf('?');
        //jsQuest > -1 ? jsHref = jsHref.substr(0, jsQuest - 1) : '';
        //var dom = document.domain;
        //var buildjs = jsHref.match(/[0-9]+/g)
        //var xyObj = $(this).position();
        //openCMSpopUp(buildjs, xyObj, $(this).attr('href'));
        return false;
    });

    console.log("sdfsdfsdfsdf ");
    $('input:text[id*="xdropoffCityTxt"]').change(function () {
        var o = 1; console.log("dfsdfsdfsd"); carSelected($(this).id)
    });
});
function carSelected(dropoffcityid) {
    var carTot = $('.dvEachContent').length;
    if (dropoffcityid.substr(dropoffcityid.length - 2, 1) == "S") {
        var carStr = "S";
    }
    else {
        var non = dropoffcityid.replace(/[^0-9]/g, '');
        var carStr = non;
    }

    carStr === 'S' ? (carStr = 1, carTot = Number(carTot) - 1) : carStr = Number(carStr) + 1;
    var carEnd = $('#xdropoffCity' + non + '').val();
    carEnd === 'E' ? ($('#dvcity_S').length === 1 ? (carEnd = $('.dvEachContent').length - 1, carTot = Number(carTot) - 1) : carEnd = carTot) : '';
    var isCar = 0;
    var i;
    for (i = carStr; i <= carTot; i++) {
        i < carEnd ? (
            $('#xrdselTransField' + i + '').val(''),
            $('p[id^="dvRadios' + i + '').attr('class', 'ptranspSelNoAct'),
            $('#dvCarSet' + i + '').is(':visible') === true ? $($('#dvCarSet' + i + '').hide()) : ''
        ) : '';
        i >= carEnd ? (
            $('#xrdselTransField' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('field')),
            $('p[id^="dvRadios' + i + '').attr('class', 'ptranspSelAct'),
            $('#dvCarSet' + i + '').val() === 'TBA' ? ($('#dvCarSet' + i + '').show(), i++) : ''
        ) : '';
    };
};
function openMask() {
    var maskH = $(document).height();
    $('.mask').css({ 'height': maskH });
    $('.mask').fadeIn(1000);
    $('.mask').fadeTo("slow", 0.8);
};
/*  ****  AUTOCOMPLETE FUNCTIONS *** */
function highlightText(text, $node) {
    var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
    while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
        newTextNode = currentNode.splitText(matchIndex);
        currentNode = newTextNode.splitText(searchText.length);
        newSpanNode = document.createElement("span");
        newSpanNode.className = "highlight";
        currentNode.parentNode.insertBefore(newSpanNode, currentNode);
        newSpanNode.appendChild(newTextNode);
    };
};
function doitDeparture(ctyNa) {

    $('#' + ctyNa + '').autocomplete({
        autoFocus: true,
        source: depAirport,
        minLength: 3,
        position: {
            my: "left top",
            at: "left bottom",
            collision: "flip"
        },
        response: function (event, ui) {
            if (ui.content.length === 0) {
                alert('No valid airport found')
                return false;
            };
        },
        select: function (event, ui) {
            $('#' + ctyNa + '').val(ui.item.value);
            $('#' + ctyNa.replace('xtxt', 'xID') + '').val(ui.item.id);
            if (ctyNa == 'xtxtLeavingFrom') {
                $('#xtxtReturningTo').val(ui.item.value);
                $('#xIDReturningTo').val(ui.item.id);
            }
            return false;
        }
    }).click(function () {
        if (IsMobileDevice()) { $('#' + ctyNa + '').val(''); } else { $('#' + ctyNa + '').select() };
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var $a = $("<span></span>").text(item.label);
        highlightText(this.term, $a);
        return $("<li></li>").append($a).appendTo(ul);
    };
};
function doAutoComple(ctyNa) {
    $('#' + ctyNa).removeAttr('readonly');
    $('#' + ctyNa + '').autocomplete({
        autoFocus: true,
        //source: arrCty,
        source: function (request, response) {
            var matcher
            if (request.term.length < 4) {
                matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
            }
            else if (request.term.length >= 4) {
                matcher = new RegExp("\\b" + $.ui.autocomplete.escapeRegex(request.term), "i");
            }
            response($.map(arrCty, function (item) {
                if (matcher.test(item.value) || matcher.test(item.code)) {
                    return (item)
                }
            }));
        },
        minLength: 3,
        position: {
            my: "left top",
            at: "left bottom",
            collision: "flip"
        },
        response: function (event, ui) {
            if (ui.content.length === 0) {
                alert('No valid Europe destination found')
                return false;
            };
        },
        select: function (event, ui) {
            $('#' + ctyNa + '').val(ui.item.value);
            $('#' + ctyNa.replace('NA', 'ID') + '').val(ui.item.id);
            $('#dvMove' + this.id.match(isNumber)).removeClass('spCityName').addClass('spCityNameOff');
            $('#' + ctyNa + '').attr('disabled', 'disabled');
            newCitySeq();
            return false;
        },
        close: function (event, ui) {
            if ($('#' + event.target.id.replace('NA', 'ID') + '').val() == "-1") {
                var firstElement = $(this).data("ui-autocomplete").menu.element[0].children[0]
                    , inpt = $('.ui-autocomplete')
                    , original = inpt.val()
                    , firstElementText = $(firstElement).text();
                $('#' + this.id + '').val(firstElementText);
                $('#dvMove' + this.id.match(isNumber)).removeClass('spCityName').addClass('spCityNameOff');
                $.map(arrCty, function (item) {
                    $.each(item.label, function (itemVal) {
                        if (item.label == firstElementText) {
                            $('#' + event.target.id.replace('NA', 'ID') + '').val(item.id);

                        }
                    });
                });
            }
            $('#' + ctyNa).attr('readonly', 'readonly');
            $('#' + ctyNa + '').attr('disabled', 'disabled');
        }
    }).click(function () {
        if ($('#' + this.id + '').val() != "type city name here") {
            $('#' + this.id + '').val('type city name here');
        };
        $('#' + this.id.replace('NA', 'ID') + '').val('-1');
        $(this).focus();
        if (IsMobileDevice()) { $('#' + ctyNa + '').val(''); } else { $('#' + ctyNa + '').select() };
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var $a = $("<span></span>").text(item.label);
        highlightText(this.term, $a);
        return $("<li></li>").append($a).appendTo(ul);
    };
};
function doitStay(impTxt) {
    $('#' + impTxt + '').autocomplete({
        autoFocus: true,
        source: stayLength,
        minLength: 0,
        position: { collision: "flip" },
        select: function (event, ui) {
            $('#' + impTxt + '').val(ui.item.value);
            $('#' + impTxt.replace('xOfNtsTxt', 'xselNoOfNts') + '').val(ui.item.id);
            $("#xrdAWair").focus();
            $(this).removeAttr('style');
            return false;
        }
    }).click(function () {
        $(this).val('');
        $(this).attr('style', 'border:1px solid #666;');
    }).focus(function () {
        $(this).keydown();
    });
};
function doitCar(impTxt) {
    var useData = [];
    if (impTxt.indexOf('Place') > 0) { useData = carTake; carAutoComplete(impTxt, useData); }
    else if (impTxt.indexOf('Day') > 0) { useData = carDay; carAutoComplete(impTxt, useData); }
    else if (impTxt.indexOf('City') > 0 && impTxt.match(isNumber) != undefined) {
        var dropData = $('#carCities' + impTxt.match(isNumber) + '').val().split('$$$');
        for (i = 0; i <= dropData.length - 1; i++) {
            var datLn = dropData[i].split('|');
            if (datLn[0] == "E" || datLn[0] == "S") {
                useData.push({ text: datLn[1] + '<font size="3">&raquo;</font> ' + datLn[0], value: datLn[1] });
            } else {
                useData.push({ label: datLn[1] + '. ' + datLn[0], value: datLn[1] + '. ' + datLn[0], id: datLn[1] }); //{label: 'Coach', value: 'Coach', id: 'Y'}
            };
            if (i == dropData.length - 1) { carAutoComplete(impTxt, useData); };
        };
    }
    else {
        var dropData = $('#carCitiesS').val().split('$$$');
        //var resData = dropData.split(',');
        //alert(resData);
        for (i = 0; i <= dropData.length - 1; i++) {
            //alert(dropData[0]);
            var datLn = dropData[i].split('|');
            if (datLn[0] == "E" || datLn[0] == "S") {
                useData.push({ text: datLn[1] + '<font size="3">&raquo;</font> ' + datLn[0], value: datLn[1] });
            }
            else if (datLn[1] == "E" || datLn[1] == "S") {
                useData.push({ text: datLn[0], value: datLn[0] });
            }
            else {
                useData.push({ label: datLn[1] + '. ' + datLn[0], value: datLn[1] + '. ' + datLn[0], id: datLn[1] }); //{label: 'Coach', value: 'Coach', id: 'Y'}
            };
            if (i == dropData.length - 1) { carAutoComplete(impTxt, useData); };
        };
    }
};
function carAutoComplete(impTxt, useData) {
    //console.log("carAutoComplete " + impTxt + "/" + useData);
    $('#' + impTxt + '').autocomplete({
        autoFocus: true,
        source: useData,
        minLength: 0,
        position: { collision: "flip" },
        select: function (event, ui) {
            $('#' + impTxt + '').val(ui.item.value);
            $('#' + impTxt.replace('Txt', '') + '').val(ui.item.id);
            if (impTxt.slice(-1).match(isNumber)) {
                carDropOffX(ui.item.id, impTxt.match(isNumber));
            }
            else {
                carDropOffX(ui.item.id, impTxt.slice(-1));
            }
            $("#xrdAWair").focus();
            return false;
        }
    }).click(function () {
        $(this).val('');
    }).focus(function () {
        $(this).keydown();
    });
    delete useData;
};
/* **** PAX / ROOMs **** */
function doitPaxRoom(inpt) {
    var jdata = [];
    var jwth;
    switch (inpt) {
        case 'xiRoomsAndPaxText':
            jdata = paxRooms;
            $('#' + inpt + '').autocomplete({
                autoFocus: true,
                source: jdata,
                minLength: 0,
                position: { collision: "flip" },
                select: function (event, ui) {
                    $('#' + inpt + '').val(ui.item.value);
                    $('#' + inpt.replace('Text', '') + '').val(ui.item.id);
                    xchangePaxByRoom(ui.item.id);
                    $("#xrdAWair").focus();
                    return false;
                }
            }).click(function () {
                $(this).val('').select();
            }).focus(function () {
                $(this).keydown();
            });
            break;
        case 'xiAdultsText':
            jdata = adultPax;
            $('#' + inpt + '').autocomplete({
                autoFocus: true,
                source: adultPax,
                minLength: 0,
                position: { collision: "flip" },
                select: function (event, ui) {
                    $('#' + inpt + '').val(ui.item.value);
                    $('#' + inpt.replace('Text', '') + '').val(ui.item.value);
                    $("#xrdAWair").focus();
                    return false;
                }
            }).click(function () {
                $(this).val('');
            }).focus(function () {
                $(this).keydown();
            });
            break;
        case 'xiChildrenText':
            jdata = childPax;
            $('#' + inpt + '').autocomplete({
                autoFocus: true,
                source: childPax,
                minLength: 0,
                position: { collision: "flip" },
                select: function (event, ui) {
                    $('#' + inpt + '').val(ui.item.value);
                    $('#' + inpt.replace('Text', '') + '').val(ui.item.value);
                    $("#xrdAWair").focus();
                    xSelChildren(ui.item.value, 1, 1);
                    return false;
                }
            }).click(function () {
                $(this).val('');
            }).focus(function () {
                $(this).keydown();
            });
            break;
        default:
            if (inpt.indexOf('_iAdults') > -1) {
                jdata = adultPax;
                $('#' + inpt + '').autocomplete({
                    autoFocus: true,
                    source: adultPax,
                    minLength: 0,
                    position: { collision: "flip" },
                    select: function (event, ui) {
                        $('#' + inpt + '').val(ui.item.value);
                        $('#' + inpt.replace('Text', '') + '').val(ui.item.value);
                        $("#xrdAWair").focus();
                        return false;
                    }
                }).click(function () {
                    $(this).val('');
                }).focus(function () {
                    $(this).keydown();
                });
            }
            else if (inpt.indexOf('_iChildren') > -1) {
                jdata = childPax;
                $('#' + inpt + '').autocomplete({
                    autoFocus: true,
                    source: childPax,
                    minLength: 0,
                    position: { collision: "flip" },
                    select: function (event, ui) {
                        $('#' + inpt + '').val(ui.item.value);
                        $('#' + inpt.replace('Text', '') + '').val(ui.item.value);
                        $("#xrdAWair").focus();
                        xSelChildren(ui.item.value, inpt.match(isNumber), 1);
                        return false;
                    }
                }).click(function () {
                    $(this).val('');
                }).focus(function () {
                    $(this).keydown();
                });
            };
            break;
    };
    delete inpt;
};
/*  ****  NEW list of destinations *** */
function newDest() {
    $('input:text[id^="xOfNtsTxt"]').each(function () {
        doitStay(this.id);
    });
    $('input:text[id^="xpickup"]').each(function () {
        doitCar(this.id);
    });
    $('input:text[id^="xdropoff"]').each(function () {
        doitCar(this.id);
    });
};
/*  ****  MOVE UP | MOVE DOWN *** */
function setUpDownMove() {
    $('.iconUp').click(function () {
        var no = $(this).attr('id')
        var noprev = Number(no) - Number(1);
        var inpUp = $('#xsCityNA' + no + '');
        var iidUp = $('#xsCityID' + no + '');
        var inpDn = $('#xsCityNA' + noprev + '');
        var iidDn = $('#xsCityID' + noprev + '');
        var inpUval = $(inpUp).val();
        var iidUval = $(iidUp).val();
        var inpDval = $(inpDn).val();
        var iidDval = $(iidDn).val();
        $(inpUp).animate({ 'margin-top': '-30px', 'opacity': '0' }, 300, function () { $(inpUp).val(inpDval); $(inpDn).val(inpUval); $(iidUp).val(iidDval); $(iidDn).val(iidUval); });
        $(inpDn).animate({ 'opacity': '0', 'margin-top': '30px' }, 300); //.animate({'margin-top': '30px'}, 300);
        $(inpUp).animate({ 'margin-top': '0px', 'opacity': '1' }, 300); //.animate({'opacity': '1'}, 300); 
        $(inpDn).animate({ 'opacity': '1', 'margin-top': '0px' }, 300, function () { newCitySeq(); });

    });
    $('.iconDwn').click(function () {
        var no = $(this).attr('id');
        var nonxt = Number(no) + Number(1);
        var inpDn = $('#xsCityNA' + no + '');
        var iidDn = $('#xsCityID' + no + '');
        var inpUp = $('#xsCityNA' + nonxt + '');
        var iidUp = $('#xsCityID' + nonxt + '');
        var inpDval = $(inpDn).val();
        var iidDval = $(iidDn).val();
        var inpUval = $(inpUp).val();
        var iidUval = $(iidUp).val();
        $(inpDn).animate({ 'margin-top': '30px', 'opacity': '0' }, 300, function () { $(inpDn).val(inpUval); $(inpUp).val(inpDval); $(iidDn).val(iidUval); $(iidUp).val(iidDval); });
        $(inpUp).animate({ 'opacity': '0', 'margin-top': '-30px' }, 300); //.animate({'margin-top': '-30px'},300);
        $(inpDn).animate({ 'margin-top': '0px', 'opacity': '1' }, 300); //.animate({'opacity': '1'}, 300);
        $(inpUp).animate({ 'opacity': '1', 'margin-top': '0px' }, 300, function () { newCitySeq(); });
    });
    $('.iconTrsh').click(function () {
        $('#dvcity_' + this.id + '').remove();
        newCitySeq();
    });
    $('.iconEdit').click(function () {
        $('#dvMove' + this.id + '').removeClass('spCityNameOff').addClass('spCityName');
        $('#xsCityNA' + this.id + '').removeAttr('disabled');
        //doitArrival('xsCityNA' + this.id);
        doAutoComple('xsCityNA' + this.id);
    });

};
function newCitySeq() {
    //alert("newCitySeq");
    if (cityValidation($('input[id^="xsCityNA"]').length) != false) {
        var newSeq = [];
        $('input[id^="xsCityNA"]').each(function () {
            var seqN = this.id.match(/[\d\.]+/g);
            if (seqN != null) {

                var toAdd = seqN + '|' + this.value + '|' + $('#xsCityID' + seqN + '').val();
                //alert(toAdd);
                newSeq.push(toAdd);
            };
        });
        fixdates = 0;
        //alert("newCitySeq.itineraryModifed");
       itineraryModifed("0", "0", newSeq.join("$$$"));
    };
};
function cityValidation(tot) {
    //Cities validation
    for (i = 1; i <= tot; i++) {
        if (i > tot) { return true; };
        if ($('#xsCityID' + i + '').val() == -1) {
            var clsClk = "'xsCityNA" + i + "'";
            var errMess = 'Please select a valid city!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
            popCalError('xsCityNA' + i, errMess);
            return false;
        };
    };
};
var prevSq;
function itineraryModifed(id, na, sq) {
    $('#dvWait').show();
    $('#dvCalContainerbyo').hide();

    var data = { pkID: id, pkNA: na, itiSQ: sq};

    var options = {};
    options.url = SiteName + "/BYOitinerary";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify(data);
        options.dataType = "html";
    options.success = function (data) {
            var r = $('<div>' + data + '</div>').find('#hasErr').text();
            if (r == "1") {
                alert('This itinerary city sequence cannot be modified at this moment!');
                if (prevSq == undefined)
                    itineraryModifed(packID, packNA);
                else
                    itineraryModifed(id, na, prevSq);
                return;
            }
            else {
                $('#dvCalContainerbyo').html(data);
                $('.spChange').click(function () {
                    if (this.id.match(isNumber) == null) {
                        var chngDiv = 'dvRadios' + this.id.slice(-1);
                        $('#' + chngDiv + '').children('.spShowChk').removeClass('spShowChk').addClass('spShow');
                        $('#' + chngDiv + '').children('.spHide').removeClass('spHide').addClass('spShow');
                        $('#' + chngDiv + '').children('.spChange').toggle();
                    }
                    else {
                        var chngDiv = 'dvRadios' + this.id.match(isNumber);
                        $('#' + chngDiv + '').children('.spShowChk').removeClass('spShowChk').addClass('spShow');
                        $('#' + chngDiv + '').children('.spHide').removeClass('spHide').addClass('spShow');
                        $('#' + chngDiv + '').children('.spChange').toggle();
                    }
                });
                prevSq = sq;
                setUpDownMove(); // TO SET ACTION EVENTS //
                getTraveldate();  // TO SET CALENDAR POP UP //
                //fixdates != 0 ? $('#xtxtBYArriving').click(function(){bbdates('xtxtBYArriving')}) : getTraveldate();  // TO SET CALENDAR POP UP //
                newDest(); // TO SET NEW DESTINATIONS EVENTS //
                if (backCook != null || backCook != undefined) {
                    buildFromCookie2();
                };
            }
            $('#dvWait').hide();
            $('#dvCalContainerbyo').show();
    };
    options.error = function (xhr, desc, exceptionobj) {
        $('#dvCalContainerbyo').html(xhr.responseText);
    };
    $.ajax(options);
};
function relIntForm(hLnk, linkPackID) {
    Cookies.set('dateVAL', '', { expires: -1 });

    Cookies.set('TMEDpkbyoBack', '', { expires: -1 });;
    window.location = hLnk + '?relItin=' + linkPackID;
};
function listbox_move(listID, direction) {
    var listbox = document.getElementById(listID);
    var selIndex = listbox.selectedIndex;
    if (-1 == selIndex) {
        alert("Please select an option to move.");
        return;
    }
    var increment = -1;
    if (direction == 'up')
        increment = -1;
    else
        increment = 1;
    if ((selIndex + increment) < 0 || (selIndex + increment) > (listbox.options.length - 1)) { return; }
    var selValue = listbox.options[selIndex].value;
    var selText = listbox.options[selIndex].text;
    listbox.options[selIndex].value = listbox.options[selIndex + increment].value
    listbox.options[selIndex].text = listbox.options[selIndex + increment].text
    listbox.options[selIndex + increment].value = selValue; listbox.options[selIndex + increment].text = selText; listbox.selectedIndex = selIndex + increment;
};
function listbox_moveacross(sourceID, destID) {
    var src = document.getElementById(sourceID); var dest = document.getElementById(destID); for (var count = 0; count < src.options.length; count++) {
        if (src.options[count].selected == true) {
            var option = src.options[count]; var newOption = document.createElement("option"); newOption.value = option.value; newOption.text = option.text; newOption.selected = true; try { dest.add(newOption, null); src.remove(count, null); } catch (error) { dest.add(newOption); src.remove(count); }
            count--;
        }
    }
};
function listbox_selectall(listID, isSelect) { var listbox = document.getElementById(listID); for (var count = 0; count < listbox.options.length; count++) { listbox.options[count].selected = isSelect; } };
/* ***** ADD | DELETE CITIES **** */
function qaddCity(fr, to) {
    nwDiv = '';
    if (to > 12) { alert('For best results, no more than 12 cities is allowed. Thank.'); return false; };
    var nwDiv;
    nwDiv = '<!-- City ' + to + ' -->'
    nwDiv = nwDiv + '<div class="dvEachCity" id="dvcity_' + to + '">'
    nwDiv = nwDiv + '<div class="dvNumber"><span>' + to + '</span></div>'
    nwDiv = nwDiv + '<div class="dvAction"><img src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" width="16" height="16" align="absmiddle"/>'
    nwDiv = nwDiv + '</div>'
    nwDiv = nwDiv + '<div class="dvContent">'
    nwDiv = nwDiv + '<input type="text" name="xsCityNA' + to + '" id="xsCityNA' + to + '" value="type city name here" style="position:absolute; overflow:hidden;" class="impTextFirst"/>'
    nwDiv = nwDiv + '<input name="xsCityID' + to + '" type="hidden" id="xsCityID' + to + '" value="-1"/>'
    nwDiv = nwDiv + '</div>'
    nwDiv = nwDiv + '<div class="dvClear"> </div>'
    nwDiv = nwDiv + '</div>'
    nwDiv = nwDiv + '<!-- End City ' + to + ' -->'
    var $divBfr = $('#dvcity_' + fr);
    $(nwDiv).insertAfter($divBfr);
    var nxt = Number(to) + 1;
    totCity = to;
    $('#xtotCities').val(totCity);
    $('#inpCities').val(to);
    doAutoComple('xsCityNA' + to + '');
    $('#URLinpCities').attr("href", "javascript:qaddCity(" + to + ", " + nxt + ");");
};
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
function qDelCty(cty) {
    $('#dvcity_' + cty + '').remove();
    newCitySeq();
};
function rdonChangeX(rd, no, nxct, tname, tfield) {
    var noj;
    noj = no;
    if (no == 'S') {
        noj = "'" + no + "'";
    };
    $('#xrdselTransField' + no + '').val(tfield);
    //$('div[id^="troverNts' + no + '"]').hide();   
    switch (rd) { //rd
        case 'C':
            $('#dvCarSet' + no).show();
            //var dropOffCityNo = $('#xdropoffCity' + no + ' option:selected').val();
            var dropOffCityNo = $('#xdropoffCity' + no + '').val();
            carDropOffX(dropOffCityNo, no);
            radiosStyle(no);
            break;
        case 'T':
            $('#dvCarSet' + no).hide();
            $('#troverNts' + no + tname).show();
            //$('#xdropoffCity' + no + ' option[0]').attr('selected', 'selected');
            ResetTrasportOptions(no);
            radiosStyle(no);
            break;
        case 'O':
            $('#dvCarSet' + no).hide();
            //$('#xdropoffCity' + no + ' option[0]').attr('selected', 'selected');
            ResetTrasportOptions(no);
            radiosStyle(no);
            break;
        case 'A':
        case 'W': //on your own
        case 'G': //groud
            $('#dvCarSet' + no).hide();
            //$('#xdropoffCity' + no + ' option[0]').attr('selected', 'selected');
            ResetTrasportOptions(no);
            radiosStyle(no);
            break;
    };
};
function radiosStyle(no) {
    var chngDiv = 'dvRadios' + no;
    $('#' + chngDiv + ' input:radio').each(function () { if (this.checked) { $(this).parent().removeClass('spShow').addClass('spShowChk') }; });
    $('#' + chngDiv + '').children('.spShow').removeClass('spShow').addClass('spHide');
    $('#' + chngDiv + '').children('.spChange').toggle();
};
function ResetTrasportOptions(StartCity) {
    var reset = false;
    $('div[id^="dvcity_"]').each(function () {
        var idVal = $(this).attr('id');
        var idValArray = idVal.split('_');
        var No = idValArray[1];
        //alert(No);
        //alert($('input[type="radio"][id^="xrdselTrans' + No + '"][value="C"]').prop('checked') + ' = isCar');
        var isCarChecked = $('input[type="radio"][id^="xrdselTrans' + No + '"][value="C"]').prop('checked');
        if (isCarChecked) {
            reset = false;
            return;
        };
        //alert($('div[id^="dvRadios' + No + '"]:checked').length +' = length');
        if ($('div[id^="dvRadios' + No + '"]').length > 0) {
            var firtVisibleOption = $('div[id^="dvRadios' + No + '"]:checked').length;
            if (firtVisibleOption == 0 && reset == true) {
                $('div[id^="dvCarSet' + No + '"]').hide();
                if ($('#dvRadios' + No + ' input:radio[id^="xrdselTrans"]').length > 0) {
                    $('#dvRadios' + No + ' input:radio[id^="xrdselTrans"]').each(function () {
                        if (this.checked) {
                            if (this.value == 'T') {
                                $('#troverNts' + No + 'Train').show();
                            };
                        };
                    });
                    $('#troverNts' + No + 'Train').show();
                    $('div[id^="dvRadios' + No + '"]').show();
                    //alert($('input[type="radio"][id^="xrdselTrans' + No + '"]:checked').attr('data') +' = data');
                    var selectedTransFiled = $('input[type="radio"][id^="xrdselTrans' + No + '"]:checked').attr('data');
                    $('#xrdselTransField' + No).val(selectedTransFiled);
                }
            };
        }
    
        if (StartCity == No)
            reset = true;
    });
};
function carDropOffX(DropOffCity, StartCity) {
    console.log("DropOffCity " + DropOffCity + "/" + StartCity)
    if ($.isNumeric(DropOffCity) == false && DropOffCity != "E") { //if "Airport" is selected or "First/Last day" no need to change al transportation options
        return;
    }

    var reset = false;
    $('div[id^="dvcity_"]').each(function () {
        var idVal = $(this).attr('id');
        var idValArray = idVal.split('_');
        var No = idValArray[1];

        if (reset) {
            $('div[id^="dvCarSet' + No + '"]').hide();
            //$('input[type="radio"][id^="xrdselTrans' + No + '"]:first').attr('checked', 'checked');
            $('div[id^="dvRadios' + No + '"]').show();
            $('div[id^="troverNts' + No + '"]').hide();
            //$('div[id^="dvRadios' + No + '"]').show();
            var selectedTransFiled = $('input[type="radio"][id^="xrdselTrans' + No + '"]:checked').attr('data');
            $('#xrdselTransField' + No).val(selectedTransFiled);
        }

        if (StartCity == No)
            reset = true;
    });

    var isCarSelected = false;
    $('div[id^="dvcity_"]').each(function () {
        var idVal = $(this).attr('id');
        var idValArray = idVal.split('_');
        var No = idValArray[1];

        if (No == DropOffCity) {
            isCarSelected = false;
        }
        else {
            if (isCarSelected) {
                $('div[id^="dvRadios' + No + '"]').hide();
                $('#xrdselTransField' + No).val('');
                $('div[id^="dvCarSet' + No + '"]').hide();
            }
        };
        if (No == StartCity)
            isCarSelected = true;
    });

    // Final check and set controls between cities with car selected
    var AfterCarSelectedUntilDropOff = false;
    var DropOffCity;
    $('div[id^="dvcity_"]').each(function () {
        var idVal = $(this).attr('id');
        var idValArray = idVal.split('_');
        var No = idValArray[1];
        var IsCarSelected = $('input[type="radio"][id^="xrdselTrans' + No + '"]:checked').attr('data');

        if (AfterCarSelectedUntilDropOff) {
            if (DropOffCity != No) {
                $('div[id^="dvRadios' + No + '"]').hide();
                $('#xrdselTransField' + No).val('');
                $('div[id^="dvCarSet' + No + '"]').hide();
                IsCarSelected = ''; //if dvCarSet is hidden IsCarSelected is not TBA
            }
            else {
                AfterCarSelectedUntilDropOff = false;
                DropOffCity = ''
                if (IsCarSelected == 'TBA' && No >= DropOffCity) { //if is Car and current city is after DropOffCity then show options
                    $('div[id^="dvCarSet' + No + '"]').show();
                }
            }
        }

        if (IsCarSelected == 'TBA') {
            AfterCarSelectedUntilDropOff = true;
            DropOffCity = $('#xdropoffCity' + No).val();
        }
    });
};
/* ******************   Multiroom *************************  */
var ropx; // = valM.split('|');
var rom = '1'; // = ropx[0];
var pax = '2'; // = ropx[1];
var pax2;
var pax3;
var paxMr;
var hwMCh;
function xSelChildren(ch, ro, ty) {
    //alert(ch +' | '+ ro +' | ' + ty)
    if (rom > 1) { hwMCh = Number($('#xiChildren').val()) + Number($('#xRoom2_iChildren').val()) + Number($('#xRoom3_iChildren').val()); };
    //alert(hwMCh);
    //if (hwMCh > 0){ty = 1};
    if (ty == 0) {
        $('#spChAg').hide();
    } else {
        if (ty == 1) {
            if (ch == 0) {
                if (hwMCh == 0) {
                    $('#spChAg').hide();
                };
            } else {
                $('#spChAg').show();
            };
        };
    };
    switch (Number(ro)) {
        case 1:
            for (s = 1; s <= 4; s++) {
                if (s <= ch) {
                    $('#dvR1child' + s + '').show();
                } else {
                    $('#dvR1child' + s + '').hide();
                    $('#dvR1child' + s + '').val('');
                };
                $('#xiChild' + s + '').val('');
            };
            break;
        case 2:
        case 3:
            for (s = 1; s <= 4; s++) {
                if (s <= ch) {
                    $('#dvR' + ro + 'child' + s + '').show();
                } else {
                    $('#dvR' + ro + 'child' + s + '').hide();
                };
                $('#xRoom' + ro + '_iChild' + s + '').val('');
            };
            break;
    };
};
function showDivRoom(ro) {
    if (ro == 0) { $('#dvPaxLabel').hide(); };
    for (i = 1; i <= 3; i++) {
        if (i <= ro) {
            $('#dvPaxLabel').show();
            $('#dvRoom' + i + '').show();
            if (i == 1) {
                if ($('#xiChildrenText').val() == '0') {
                    cleanValues(i);
                };
            } else {
                if ($('#xRoom' + i + '_iChildrenText').val() == '0') {
                    cleanValues(i);
                }
            };
        }
        else {
            $('#dvRoom' + i + '').hide();
            xSelChildren(0, i, 0);
            if (i == 1) {
                $('#xiChildren').val('0');
                $('#xiChildrenText').val('0');
            } else {
                $('#xRoom' + i + '_iChildren').val('0');
                $('#xRoom' + i + '_iChildrenText').val('0');
            }

            //xiChildrenText  xRoom3_iChildrenText
            //if (i == 1){if($('#xiChildren').val() > 0){cleanValues(i);};}else{if($('#xRoom'+i+'_iChildren').val()> 0){cleanValues(i);}};
        };

    };
};
function cleanValues(ro) {
    switch (ro) {
        case 1:
            xSelChildren(0, 2, 0);
            $('#xRoom2_iChildren').val('0');
            $('#xRoom2_iChildrenText').val('0');
            xSelChildren(0, 3, 0);
            $('#xRoom3_iChildren').val('0');
            $('#xRoom3_iChildrenText').val('0');
            break;
        case 2:
            xSelChildren(0, 1, 0);
            $('#xiChildren').val('0');
            $('#xiChildrenText').val('0');
            xSelChildren(0, 3, 0);
            $('#xRoom3_iChildren').val('0');
            $('#xRoom3_iChildrenText').val('0');
            break;
        case 3:
            xSelChildren(0, 1, 0);
            $('#xiChildren').val('0');
            $('#xiChildrenText').val('0');
            xSelChildren(0, 2, 0);
            $('#xRoom2_iChildren').val('0');
            $('#xRoom2_iChildrenText').val('0');
            break;
    };
};
function xchangePaxByRoom(valM) {
    //alert(valM);
    $('.paxRoomChAg').click(function () {
        $(this).select();
    });
    if (valM == -1) {
        var clsClk = "'xiRoomsAndPax'";
        var errMess = 'Please select select a valid option!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
        popCalError('xiRoomsAndPax', errMess);
        return false;
    } else {
        pax = '';
        pax2 = '';
        pax3 = '';
        ropx = valM.split('|');
        rom = ropx[0];
        pax = ropx[1];
        //alert(rom +' @ '+ pax);
        if (pax.indexOf('-') > 0) {
            paxMr = pax.split('-');
            pax = paxMr[0];
            pax2 = paxMr[1];
            if (paxMr[2] != undefined) {
                pax3 = paxMr[2];
            };
        };
        //alert(rom);
        switch (rom) {
            case '1':
                //$("#xiChildren option[value=0]").attr('selected','selected');
                if (pax != 'Other') {
                    showDivRoom(0);
                    //$("#xiAdults option[value='"+pax+"']").attr('selected','selected');
                    //$("#xRoom2_iAdults option[value='1']").attr('selected','selected');
                    //$("#xRoom3_iAdults option[value='1']").attr('selected','selected');
                }
                else {
                    //$("#xiAdults option[value=2]").attr('selected','selected');
                    showDivRoom(1);
                };
                break;
            case '2':
                //$("#xiChildren option[value=0]").attr('selected','selected');
                //$("#xRoom2_iChildren option[value=0]").attr('selected','selected');
                if (pax != 'Other') {
                    showDivRoom(0);
                    //xSelChildren(0);
                    //$("#xiAdults option[value='"+pax+"']").attr('selected','selected');
                    //$("#xRoom2_iAdults option[value='"+pax2+"']").attr('selected','selected');
                    //$("#xRoom3_iAdults option[value='1']").attr('selected','selected');
                }
                else {
                    showDivRoom(2);
                    //$("#xiAdults option[value=2]").attr('selected','selected')
                    //$("#xRoom2_iAdults option[value=2]").attr('selected','selected')
                };
                break;
            case '3':
                //$("#xiChildren option[value=0]").attr('selected','selected');
                //$("#xRoom2_iChildren option[value=0]").attr('selected','selected');
                //$("#xRoom3_iChildren option[value=0]").attr('selected','selected');
                if (pax != 'Other') {
                    showDivRoom(0);
                    //xSelChildren(0);
                    //$("#xiAdults option[value='"+pax+"']").attr('selected','selected');
                    //$("#xRoom2_iAdults option[value='"+pax2+"']").attr('selected','selected');
                    //$("#xRoom3_iAdults option[value='"+pax3+"']").attr('selected','selected');
                }
                else {
                    showDivRoom(3);
                    //$("#xiAdults option[value=2]").attr('selected','selected');
                    //$("#xRoom2_iAdults option[value=2]").attr('selected','selected')
                    //$("#xRoom3_iAdults option[value=2]").attr('selected','selected')
                };
                break;
        };
    };
};
function submitToBook() {

    totCity = $('#inpCities').val();

    if ($('#dvError').css('display') == 'block') { return false; };

    //Departure validation
    var withFlight = $('input[id="xrdAWair"][value="True"]').prop("checked");
    if (withFlight == true) {
        if ($('#xIDLeavingFrom').val() == -1) {
            var clsClk = "'xtxtLeavingFrom'";
            var errMess = 'Please select your departure city!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
            popCalError('xtxtLeavingFrom', errMess);
            return false;
        };


        if ($('#xIDReturningTo').val() == -1) {
            var clsClk = "'xtxtReturningTo'";
            var errMess = 'Please select your departure city!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
            popCalError('xtxtReturningTo', errMess);
            return false;
        };

        //Cabin validation
        var cab = $.trim($('#xCabinTxt').val());
        if (cab == '') {
            var clsClk = "'xCabinTxt'";
            var errMess = 'Please select a cabin type!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
            popCalError('xCabinTxt', errMess);
            return false;
        };
    };
    //Date validation
    var idate = $.trim($('#xtxtBYArriving').val());
    if (idate == 'mm/dd/yyyy' || idate == '') {
        var clsClk = "'xtxtBYArriving'";
        var errMess = 'Please select your departure date!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
        popCalError('xtxtBYArriving', errMess);
        return false;
    };

    //Cities validation
    for (i = 1; i <= totCity; i++) {
        if ($('#xsCityID' + i + '').val() == -1) {
            var clsClk = "'xsCityNA" + i + "'";
            var errMess = 'Please select a valid city!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
            popCalError('xsCityNA' + i, errMess);
            return false;
        };
    };

    //Total Adults & children validation
    var paxAdult = 0;
    var paxChild = 0;
    var paxTotal = 0;
    $('#xselRooms').val(rom);
    switch (rom) {
        case '1':
            paxAdult = $('#xiAdults').val();
            paxChild = $('#xiChildren').val();
            paxTotal = Number(paxAdult) + Number(paxChild);
            break;
        case '2':
            paxAdult = Number($('#xiAdults').val()) + Number($('#xRoom2_iAdults').val());
            paxChild = Number($('#xiChildren').val()) + Number($('#xRoom2_iChildren').val());
            paxTotal = Number(paxAdult) + Number(paxChild);
            break;
        case '3':
            paxAdult = Number($('#xiAdults').val()) + Number($('#xRoom2_iAdults').val()) + Number($('#xRoom3_iAdults').val());
            paxChild = Number($('#xiChildren').val()) + Number($('#xRoom2_iChildren').val()) + Number($('#xRoom3_iChildren').val());
            paxTotal = Number(paxAdult) + Number(paxChild);
            break;
    }
    if (paxTotal > 6) {
        var clsClk = "'dvRoom1'";
        messg = 'Max guest allowed (adults + children) are 6 !  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
        popCalError('dvRoom1', messg);
        return false;
    };

    //Children age validation
    if (paxChild > 0) {
        var hwCh = $('#xiChildren').val();
        var hwCh2 = $('#xRoom2_iChildren').val();
        var hwCh3 = $('#xRoom3_iChildren').val();

        //alert(hwCh + ' ' + hwCh2 + ' ' + hwCh3 + ' Rom:' + rom);

        if (hwCh > 0 && rom >= 1) {
            for (i = 1; i <= hwCh; i++) {
                var clsClk = "'xiChild" + i + "'";
                var childAge = $('#xiChild' + i + '').val();
                var ageCH;
                if (isNaN(childAge) || childAge == '' || (!isNaN(childAge) && (childAge < 2 || childAge > 11))) {
                    if (isNaN(childAge) || childAge == '') {
                        messg = 'Please enter a valid age !<br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = '';
                    }
                    else if (childAge < 2) {
                        messg = 'All infants (2 and under) are considered as children age 2. <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = 2;
                    }
                    else {
                        messg = 'Child age is 11 or less! <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = 11;
                    };

                    popCalError('xiChild' + i, messg);
                    $('#xiChild' + i + '').attr('class', 'paxRoomChAg').val(ageCH).select();
                    return false;
                };
            };
        };

        if (hwCh2 > 0 && rom >= 2) {
            for (i = 1; i <= hwCh2; i++) {
                var clsClk = "'xRoom2_iChild" + i + "'";
                var childAge2 = $('#xRoom2_iChild' + i + '').val();
                var ageCH;
                if (isNaN(childAge2) || childAge2 == '' || (!isNaN(childAge2) && (childAge2 < 2 || childAge2 > 11))) {
                    if (isNaN(childAge2) || childAge2 == '') {
                        messg = 'Please enter a valid age !<br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = '';
                    }
                    else if (childAge2 < 2) {
                        messg = 'All infants (2 and under) are considered as children age 2. <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = 2;
                    }
                    else {
                        messg = 'Child age is 11 or less! <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = 11;
                    };

                    popCalError('xRoom2_iChild' + i, messg);
                    $('#xRoom2_iChild' + i + '').attr('class', 'paxRoomChAg').val(ageCH).select();
                    return false;
                };
            };
        };

        if (hwCh3 > 0 && rom >= 3) {
            for (i = 1; i <= hwCh3; i++) {
                var clsClk = "'xRoom3_iChild" + i + "'";
                var childAge3 = $('#xRoom3_iChild' + i + '').val();
                if (isNaN(childAge3) || childAge3 == '' || (!isNaN(childAge3) && (childAge3 < 2 || childAge3 > 11))) {
                    if (isNaN(childAge3) || childAge3 == '') {
                        messg = 'Please enter a valid age !<br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = '';
                    }
                    else if (childAge3 < 2) {
                        messg = 'All infants (2 and under) are considered as children age 2. <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = 2;
                    }
                    else {
                        messg = 'Child age is 11 or less! <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
                        ageCH = 11;
                    };

                    popCalError('xRoom3_iChild' + i, messg);
                    $('#xRoom3_iChild' + i + '').attr('class', 'paxRoomChAg').val(ageCH).select();
                    return false;
                };
            };
        };

    }

    //Reset adults/children values for the other rooms	
    switch (rom) {
        case '1':
            $('#xRoom2_iAdults').val([]);
            $('#xRoom2_iChildren').val([]);
            $('#xRoom3_iAdults').val([]);
            $('#xRoom3_iChildren').val([]);
            break;
        case '2':
            $('#xRoom3_iAdults').val([]);
            $('#xRoom3_iChildren').val([]);
            break;
    }
    $('#xtotCities').val(totCity);
    // END reset
    var queryString = $('#getNewItin').serialize();
    var cookString = ''
    cookString = JSON.stringify($('#getNewItin').serializeObject()); //$('#frmToBook').serializeObject());
    Cookies.set('TMEDpkbyoBack', cookString, { expires: 1 });


    //return;
    console.log("queryString");
    console.log(queryString);

    var options = {};
    options.url = SiteName + "/Calendar/T4BuildComponentList";
    options.type = "POST";
    options.contentType = "application/json";
    options.data = JSON.stringify(queryString);
    options.dataType = "html";
    options.success = function (html) {
        /*console.log("Succes!");*/
        processResponseB(html)
    };
    options.error = function (xhr, desc, exceptionobj) {
        $('#content').html(xhr.responseText);
        alert(xhr.responseText + ' = error');
    };
    $.ajax(options);

};
function processResponseB(result) {
    if (window.ActiveXObject) {
        $('#content').append(result);
    }
    else if (document.implementation && document.implementation.createDocument) {
        $('#content').append(result);
    }
    else {
        alert('Your browser cannot handle this script');
    };
    var goToBook = $('#formSub').val();
    var pck = $('#pakID').val();
    $('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
    if (goToBook == 1) {
        //$('#PkgId').val(pck);
        Cookies.set('dateVAL', '', { expires: -1 });
        document.getElementById("frmToBook").action = 'https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create?' + pck;
        document.getElementById("frmToBook").submit();
    };
};
//divBYOIAir
//divAirAdvance
//divReturnAir
//dvAllAirOpt
function Check_WAir(val, idval) {
    switch (val) {
        case 'False':
            $('#dvAllAirOpt').hide();
            //$('#divBYOIAir').hide();
            //$('#divReturnAir').addClass('dvHide');
            break;
        case 'True':
            $('#dvAllAirOpt').show();
            //$('#divBYOIAir').show();
            //$('#divReturnAir').removeClass('dvHide')
            break;
    };
};
/* *** DATE PICKER HELP FUNCTIONS *** */
function getTraveldate() {
    if (fixdates == 0) {
        var myDate = new Date();
        var strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        var numMnth = 2;
        if (IsMobileDevice()) {
            numMnth = 1;
        };
        $('#xtxtBYArriving').datepicker({
            //defaultDate: strDate, 
            //yearRange: "2014:2015",
            changeMonth: false,
            changeYear: false,
            numberOfMonths: numMnth,
            showButtonPanel: true,
            format: 'yyyy-mm-dd',
            hideIfNoPrevNext: true,
            prevText: '',
            nextText: '',
            minDate: strDate,
            showOtherMonths: false,
            maxDate: "+1Y",
            //beforeShowDay: DisableSpecificDates
        });
        cookDate = Cookies.get('dateVAL');
        if (cookDate != null) { $('#xtxtBYArriving').val(cookDate).removeClass('impTextFirst') };

        $('#xtxtBYArriving').change(function () {
            $(this).removeClass('impTextFirst');
            Cookies.set('dateVAL', this.value, { expires: 1 });
        });
    }
    else {
        $('#xtxtBYArriving').click(function () { bbdates('xtxtBYArriving') });
    };
};
function getBusinessDateObj(businessDays) {
    var now = new Date();
    now.setTime(now.getTime() - 0 * 24 * 60 * 60 * 1000);
    var dayOfTheWeek = now.getDay();
    var calendarDays = businessDays;
    var bookDay = dayOfTheWeek + businessDays;
    if (bookDay >= 6) {
        businessDays -= 6 - dayOfTheWeek;  //deduct this-week days
        calendarDays += 2;  //count this coming weekend
        bookWeeks = Math.floor(businessDays / 5); //how many whole weeks?
        calendarDays += bookWeeks * 2;  //two days per weekend per week
    };
    now.setTime(now.getTime() + calendarDays * 24 * 60 * 60 * 1000);
    return now;
};
function bbdates(objvd) {
    builFixDatediv(fixdates, objvd);
};
function openDates(obj) {
    objPOS = $('#' + obj + '').offset();
    $('#dvFixDates').show();
    $('#dvFixDates').offset({ left: objPOS.left, top: objPOS.top + 22 });
};
function builFixDatediv(dates, dvObj) {
    var postDate;
    var postField;
    var m = '';
    var dtsDV = '';
    var fecha = dates; //.split(',');
    var dtct;
    for (i = 0; i < fecha.length; i++) {
        if (dateFormat(fecha[i], 'mm/dd/yyyy') > dateFormat(new Date(), 'mm/dd/yyyy')) {
            if (m != dateFormat(fecha[i], "mmm")) {
                m = dateFormat(fecha[i], "mmm");
                dtct = 0;
                if (i == 0) {
                    dtsDV = '<div style="padding:3px 1px;">';
                }
                else {
                    dtsDV = dtsDV + '</div><div style="padding:3px 1px;">';
                }
                dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
            }
            if (dtct == 0) {
                postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
                postField = "'" + dvObj + "'";
                dtsDV = dtsDV + '<span id="fxDates" onclick="postnwDate(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
            }
            else {
                postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
                postField = "'" + dvObj + "'";
                dtsDV = dtsDV + ', <span id="fxDates" onclick="postnwDate(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
            }
            dtct++ // = dtct + 1;
        }
    };
    dtsDV = dtsDV + '</div>';
    $('#dvFixDates').html(dtsDV);
    openDates(dvObj);
    setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function postnwDate(ddate, dobj) {
    $('#' + dobj + '').val(ddate);
    $('#dvFixDates').hide();
};
var newDate = [];
var nwwDDD = [];
var endDates = []
function DisableSpecificDates(date) {
    if (fixdates != 0) {
        var m = date.getMonth() + 1;
        var d = date.getDate();


        var y = date.getFullYear();
        var currentdate = m + '/' + d + '/' + y;
        //console.log(currentdate + ' : ' + fixdates + ' : ' + ($.inArray(currentdate, fixdates)));
        for (var i = 0; i < fixdates.length; i++) {
            if ($.inArray(currentdate, fixdates) != -1) {
                return [true];
            };
            return [false];
        };
    }
    else if (blockdates != 0) {
        for (d = 0; d < blockdates.length; d++) {
            var nwD = blockdates[d].split(',');
            var nwDS = nwD[0].split('-');
            var nwDE = nwD[1].split('-');
            var myNwSD = new Date(nwDS[2], nwDS[0] - 1, nwDS[1] - Number(packNoNts))
            var myNwED = new Date(nwDE[2], nwDE[0] - 1, nwDE[1])
            if (date >= myNwSD && date <= myNwED) {
                return [false];
            };
        };
        return [true];
    }
    else {
        return [true];
    };
};

function popCalError(obj, mess) {
    var objPos = $('#' + obj + '').position();
    $('#dvErrMess').html('<img src="https://pictures.tripmasters.com/siteassets/d/Symbols-Warning-icon-32.gif" width="32" height="32" align="absmiddle" style="padding-top:5px;" /> ' + mess + '');
    var popL = objPos.left - 5;
    var popT = objPos.top - 82;
    //alert(popL + ' | ' + popT);
    $('#dvError').attr('style', 'position:absolute; display:none; z-index:9999; left:' + popL + 'px; top:' + popT + 'px; width:auto;');
    $('#dvError').fadeIn(100);
    scrollToTop(popT - 20);
};
function closeClick(obj) {
    $('#dvError').hide();
    if (IsMobileDevice()) { $('#' + obj + '').val(''); }
    $('#' + obj + '').select();
    $('#' + obj + '').trigger('click');
};
function scrollToTop(tp) {
    $('body,html').animate({
        scrollTop: tp
    }, 800);
};
function resetPage() {
    Cookies.set('dateVAL', '', { expires: -1 });
    Cookies.set('TMEDpkbyoBack', '', { expires: -1 });
    var docURL = document.URL.toLowerCase();
    window.location = docURL.replace('_pkbyo', '_pk');
};
function imageSize(thisPic, thisTyp) {
    if (thisPic.match(img500) != null || thisTyp == 'M0') {
        picW = '290px';//picH='290px'; 
        picMtp = '0px';
        $('.selM').css('width', '399px');
        //$('#dvallTHU').attr('style','width:258px;');
    }
    else {
        picW = '200px';//picH='200px'; 
        picMtp = '45px';
        $('.selM').css('width', '399px');
        //$('#dvallTHU').attr('style','width:258px;');
    };
    return [picW, picMtp];
};
function CarrouPicsBuild(phoN) {
    CoPic = 0;
    CoMap = 0;
    for (i = 0; i < phoN; i++) {
        if (i == 3) { picClass = "picSel" } else { picClass = "picNSel" };
        if (objPics[i].picTYP == 'P0') {
            CoPic++
            TthumPic = TthumPic + '<span><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/><br/></span>';
        } else if (objPics[i].picTYP == 'M0') {
            CoMap++
            TthumPic = TthumPic + '<span><img src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/><br/>map</span>';
            hvBigMap = 1;
        };
        ini = 0;
        fin = i;
    };
    if (picTotal < 6) {
        var leftPadd = 18 * (6 - picTotal);
    } else { leftPadd = 0; };
    $('#dvallTHU #prev').css({ "padding-left": "" + leftPadd + "px", "background-position": "" + leftPadd + "px 0" });
    $('#thumbs').html(TthumPic + '<br style="clear:both" / >');
    $('img.picSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
    $('img.picNSel').click(function () { changePic(this.id, this.src, this.title, this.alt) });
};
/*Tab items*/
var arrAllSSCty = [];

function moveCarr(eId) {
    var Ide = eId.substr(eId.length - 1);
    var TypPro;
    var TypMov;
    var nwProDispl = [];
    var nwAllCtyPro = [];
    var ssF = '';
    var ssE = '';
    var nwDvPro;
    var slidDirH;
    var slidDirS;
    var dvProsr = ""
    if (eId.indexOf('next') > -1) {
        TypMov = 'Nx';
        slidDirH = 'left';
        slidDirS = 'right';
    }
    else if (eId.indexOf('prev') > -1) {
        TypMov = 'Pv';
        slidDirH = 'right';
        slidDirS = 'left';
    };
    if (eId.indexOf('S') > -1) {
        TypPro = 'S'
        nwDvPro = $('#SSfoo' + Ide + '');
        nwProDispl = SSDispl;
        SSDispl = [];
        nwAllCtyPro = allCtySSPRO
    }
    else if (eId.indexOf('H') > -1) {
        TypPro = 'H'
        nwDvPro = $('#Hotfoo' + Ide + '');
        nwProDispl = HotDispl;
        HotDispl = [];
        nwAllCtyPro = allCtyHotPRO
    };
    for (s = 0; s < nwProDispl.length; s++) {
        var dispPRO = nwProDispl[s].split('|');
        if (dispPRO[0] == Ide) {
            if (TypMov == 'Nx') { ssF = Number(dispPRO[1]) + 3; ssE = Number(dispPRO[2]) + 3 } else if (TypMov == 'Pv') { ssF = Number(dispPRO[1]) - 3; ssE = Number(dispPRO[2]) - 3 };
            if (ssE <= -1 || ssF > nwAllCtyPro[Ide].length) {
                if (TypPro == 'S') { SSDispl = nwProDispl; } else if (TypPro == 'H') { HotDispl = nwProDispl; };
                return false;
            };
            if (TypPro == 'S') { SSDispl.push(Ide + '|' + ssF + '|' + ssE); } else if (TypPro == 'H') { HotDispl.push(Ide + '|' + ssF + '|' + ssE); };
            for (r = ssF; r <= ssE; r++) {
                if (nwAllCtyPro[Ide][r] != undefined) {
                    dvProsr = dvProsr + nwAllCtyPro[Ide][r];
                };
            };
        }
        else {
            if (TypPro == 'S') { SSDispl.push(nwProDispl[s]); } else if (TypPro == 'H') { HotDispl.push(nwProDispl[s]); };
        };
    };
    nwDvPro.hide("slide", { direction: slidDirH }, 200);
    nwDvPro.html(dvProsr);
    nwDvPro.show("slide", { direction: slidDirS }, 500);
};
// *** TO BUILD CALENDAR FROM COOKIE ***//
function buildFromCookie1() {
    var bkcookie = JSON.parse(backCook);
    //backCook =  jQuery.extendedjsoncookie('getCookieValueDecoded','bpBack');
    var NtsStay;
    var MiniIs;
    var Naprod;
    var categSel;
    var categSelNA;
    //if (backCook != null || backCook != 'undefined'){
    //var cpackID = jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'Pkgid');
    //if (cpackID != packID){
    //$.cookie('bpBack','',{expires: -1});
    //backCook =  jQuery.extendedjsoncookie('getCookieValueDecoded','bpBack');
    //}
    //else{

    //var qtyCities = Number(jQuery.extendedjsoncookie('getCookieVariable','bpBack', 'hwMnyCtyfrm')) + 1;
    //var Flyadd = jQuery.extendedjsoncookie('getCookieVariable', 'TMEDpkbyoBack', 'xrdAWair');
    var Flyadd = bkcookie['xrdAWair'];
    console.log(Flyadd);
    $('input:radio[id="xrdAWair"][value="' + Flyadd + '"]').prop('checked', true);
    Check_WAir(Flyadd, 'xrdAWair')
    if (Flyadd == 'True') {
        $('#xtxtLeavingFrom').val(bkcookie['xtxtLeavingFrom']);
        $('#xIDLeavingFrom').val(bkcookie['xIDLeavingFrom']);
        $('#xtxtReturningTo').val(bkcookie['xtxtReturningTo']);
        $('#xIDReturningTo').val(bkcookie['xIDReturningTo']);
        $('#xCabinTxt').val(bkcookie['xCabinTxt']);
        $('#xCabin').val(bkcookie['xCabin']);
        if ($('#xIDLeavingFrom').val() != $('#xIDReturningTo').val()) {
            $('#divAirAdvance').hide();
            $('#divReturnAir').removeClass('dvHide');
        };
    };
    var tCty = bkcookie['xtotCities'];
    $('#xtotCities').val(tCty);
    //$('#xtxtBYArriving').val(jQuery.extendedjsoncookie('getCookieVariable','TMASpkbyoBack', 'xtxtBYArriving'));
    //alert(tCty)
    var citiesStr = "";
    for (i = 1; i <= tCty; i++) {
        //1|Rome|967,2|Florence|1199,3|Venice|1002,4|London|3,5|Paris|4,6|Amsterdam|983,7|Madrid|965
        var ctyNa = bkcookie['xsCityNA' + i + ''];
        var ctyId = bkcookie['xsCityID' + i + ''];
        var ctyTransField = bkcookie['xrdselTransField' + i + ''];
        var ctyTrans = bkcookie['xrdselTrans' + i + ''];
        if (i == 1) {
            citiesStr = i + '|' + ctyNa + '|' + ctyId + '|' + ctyTransField + '|' + ctyTrans;
        }
        else {
            citiesStr = citiesStr + '$$$' + i + '|' + ctyNa + '|' + ctyId + '|' + ctyTransField + '|' + ctyTrans;
        };
        if (i == tCty) { itineraryModifed("0", "0", citiesStr) }
    };

    $('#xiRoomsAndPaxText').val(bkcookie['xiRoomsAndPaxText']);
    var romOpt = bkcookie['xiRoomsAndPax'];
    xchangePaxByRoom(romOpt);
    if (romOpt.indexOf("Other") > -1) {
        var tRom = bkcookie['xselRooms'];
        $('#xselRooms').val(tRom);
        var rS = 1;
        for (r = rS; r <= tRom; r++) {
            if (r == 1) {
                var tAdul = bkcookie['xiAdults'];
                var tChil = bkcookie['xiChildren'];
                $('#xiAdults , #xiAdultsText').val(tAdul);
                $('#xiChildren , #xiChildrenText').val(tChil);
                if (tChil > 0) {
                    xSelChildren(tChil, r, 1);
                    var chS = 1;
                    for (ch = chS; ch <= tChil; ch++) {
                        $('#xiChild' + ch + '').val(bkcookie['xiChild' + ch + '']);
                    };
                };
            }
            else {
                var tAdul = bkcookie['xRoom' + r + '_iAdults'];
                var tChil = bkcookie['xRoom' + r + '_iChildren'];
                $('#xRoom' + r + '_iAdults , #xRoom' + r + '_iAdultsText').val(tAdul);
                $('#xRoom' + r + '_iChildren , #xRoom' + r + '_iChildrenText').val(tChil);
                if (tChil > 0) {
                    xSelChildren(tChil, r, 1);
                    var chS = 1;
                    for (ch = chS; ch <= tChil; ch++) {
                        $('#xRoom' + r + '_iChild' + ch + '').val(bkcookie['xRoom' + r + '_iChild' + ch + '']);
                    };
                };
            };
        };
    };
};
function buildFromCookie2() {
    var bkcookie = JSON.parse(backCook);
    $('#xtxtBYArriving').val(bkcookie['xtxtBYArriving']);
    var tCty = bkcookie['xtotCities'];
    var nS = 1;
    for (n = nS; n <= tCty; n++) {
        $('#xOfNtsTxt' + n + '').val(bkcookie['xOfNtsTxt' + n + '']);
        $('#xselNoOfNts' + n + '').val(bkcookie['xselNoOfNts' + n + '']);
        n == tCty ? Cookies.set('TMEDpkbyoBack', '', { expires: -1 }) : '';
        if (n == tCty) {
            backCook = null;
        }
    };

};
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function changePic(picID, picSRS, picTTL, picALT) {
    var picURL = 'https://pictures.tripmasters.com' + picALT.toLowerCase()
    if (picALT == 'none') { picURL = picSRS; };
    if (picID.indexOf('O') == -1) {
        $('#dvbk').hide();
        $('#dvfr').hide();
        //$('#dvmediaPopUp').attr('style','position:absolute; z-index:9998; width:1010px; left:50%; margin-left:-505px; top:25%; height:auto; background-color:#FFF;');
        $('#dvmediaPopUp').show();
        $('img.picSel[id*="Kipic"]').attr('class', 'picNSel');
        $('img.picSel[id*="Mipic"]').attr('class', 'picNSel');
        $('#' + picID + '').attr('class', 'picSel');
        $('#dvFstPic').html('<img src="' + picURL + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" />');
        if (picID.indexOf('M') > -1) {
            $('#dvMV').hide();
            var pattern = /[0-9]+/ //+/g;
            var num = picID.match(pattern);
            $('#Mipic' + num + '').attr('class', 'picSel');
        } else {
            $('#dvMV').show();
            $('#dvPicNa').html(picTTL);
        }
    } else {
        $('img[id*="Oipic"]').attr('class', 'picNSel');
        $('#' + picID + '').attr('class', 'picSel');
        if (picID.indexOf('Map') > -1 || picURL.match(img500) != null) { $('#dvshowPIC').html('<img src="' + picURL + '" id="' + picID.replace('O', 'B') + '" alt="' + picALT + '" title="' + picTTL + '" width="290" height="290" onclick="moreMediaB(this.id, this.src, this.title, this.alt); " class="clsCursor"/>'); $('.selM').css('width', '399px'); }
        else { $('#dvshowPIC').html('<img src="' + picURL + '" id="' + picID.replace('O', 'B') + '"  alt="' + picALT + '" title="' + picTTL + '" style="margin-top:45px;height:250px;width:250px;" onclick="moreMediaB(this.id, this.src, this.title, this.alt);" class="clsCursor"/>'); $('.selM').css('width', '399px'); }; //$('#dvallTHU').attr('style','width:258px;');
    };
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
    var newPic, newImg;
    if (bf == 'F') {
        if (iID == totPic) { alert('No more photos') }
        else {
            newID = Number(iID) + 1;
            newImg = objImgs[iID].picBIG;
            if (newImg == '') { newImg = objImgs[newID].picURL; };
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
            newImg = objImgs[newID - 1].picBIG;
            if (newImg == '') { newImg = objImgs[newID - 1].picURL; };
            newPic = $('#Kipic' + newID + '');
            $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + newImg.toLowerCase() + '" alt="' + newPic.attr('alt') + '" title="' + newPic.attr('title') + '"/>');
            $('#dvPicNa').html(newPic.attr('title'));
            newPic.attr('class', 'picSel');
            thisPic.attr('class', 'picNSel');
        };
    };
};
function sliceThumb(ifrom, ito, idir) {
    TthumPic = "";
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
                if (objPics[i].picTYP == 'P0') {
                    CoPic++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/><br/></span>'

                }
                else if (objPics[i].picTYP == 'M0') {
                    CoMap++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/><br/>map</span>';

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
        if (ito > picTotal) { ito = picTotal - 1 };
        if (ifrom >= picTotal - 1) { alert('No more images'); }
        else {
            var CoPic = ifrom - 1;
            var CoMap = ifrom - 1;
            for (i = ifrom; i <= ito; i++) {
                picClass = "picNSel"
                if (objPics[i].picTYP == 'P0') {
                    CoPic++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11" ><img id="Oipic' + CoPic + '" class="' + picClass + '" src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/><br/></span>'

                }
                else if (objPics[i].picTYP == 'M0') {
                    CoMap++;
                    TthumPic = TthumPic + '<span style="float:left;" class="Text_11"><img src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" id="OipicMap' + CoMap + '" class="' + picClass + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/><br/>map</span>';

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
function scrollToTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 800);
};
function moreMedia() {
    if (objPics.length > 0)
        var img1S = objPics[0].picBIG;
    if (img1S == undefined) { img1S = objPics[0].picURL; };
    var img1T = objPics[0].picNA;
    $('#dvFstPic').html('<img src="https://pictures.tripmasters.com' + img1S.toLowerCase() + '" title="' + img1T + '" alt="' + img1S + '"/>');
    $('#dvPicNa').html(img1T);
    popUpImagesNav();
    openMask();
    $('#dvmediaPopUp').show();
    scrollToTop();
};
function moreMediaB(picID, picSRS, picTTL, picALT) {
    popUpImagesNav();
    openMask();
    $('#dvmediaPopUp').show();
    scrollToTop();
    changePic(picID.replace('B', 'K'), picSRS, picTTL, picALT);
};
function popUpImagesNav() {
    thumPic = '';
    thumMap = '';
    hvMap = 0;
    var Cpic = 0;
    var Cmap = 0;
    var thumClass = 'picNSel';
    for (i = 0; i < Number(picTotal); i++) {
        if (i == 0) { var thumClass = 'picSel' } else { var thumClass = 'picNSel' };
        if (objPics[i].picTYP == 'P0') {
            Cpic++
            thumPic = thumPic + '<img id="Kipic' + Cpic + '" class="' + thumClass + '" src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/>';
        }
        else if (objPics[i].picTYP == 'M0' || objPics[i].picTYP == 'M1') {
            Cmap++
            thumMap = thumMap + '<img src="https://pictures.tripmasters.com' + objPics[i].picURL.toLowerCase() + '" id="Mipic' + Cmap + '" class="' + thumClass + '" width="30" height="30" alt="' + objPics[i].picBIG + '" title="' + objPics[i].picNA + '"/>';
            hvMap = 1;
            hvBigMap = 1;
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
function moreMediaCLS() {
    $('.mask').hide();
    $('#dvmediaPopUp').hide();
};
function cityActCLS() {
    $('.mask').hide();
    $('#dvcityActions').hide();
};
function showRecomm(obj) {
    var dvSet;
    var objPos = ObjectPosition(document.getElementById(obj));
    var posL;
    posL = objPos[0];
    var posT;
    posT = objPos[1] - 10;
    var dvW = 710;
    var dvMgLf;
    if (obj.indexOf('picAccom') > -1) { posL = objPos[0] - 400 };
    if (obj.indexOf('aMore') > -1) { posT = objPos[1] - 30; };
    if (obj.indexOf('dvItinRel') > -1) { posT = objPos[1] - 150; };
    if (obj.indexOf('samPriceaAll') > -1) { posT = objPos[1] - 60 };
    if (obj.indexOf('dvTabView') > -1) { posT = objPos[1] - 60; dvW = 780; };
    dvMgLf = dvW / 2;
    dvSet = 'position:absolute; z-index:9999; width:' + dvW + 'px; left:50%; margin-left:-' + dvMgLf + 'px; top:' + posT + 'px;'
    $('#divRecomended').attr('style', dvSet);
    $('#divRecomended').fadeIn(2000);
};
function closeDiv() {
    $('#divRecomended').hide();
};
function tabBgChange(tabid, evt) {
    $('#' + tabid + '').trigger("click");
};
function clkshowItin(fed) {
    var objShw = $('#dvFDinclu' + fed + '');
    if (objShw.is(':visible')) {
        objShw.hide();
        $("#dvItinDetail" + fed).html("Itinerary details &#709;");
    }
    else {
        objShw.show();
        $("#dvItinDetail" + fed).html("Itinerary details &#708;");
    }
};
function scrollToMorePop(jbo) {
    var objTOGO;
    objTOGO = jbo;
    objTOGO = $('#' + objTOGO + '').offset();
    $('html,body').animate({
        scrollTop: objTOGO.top - Number(170)
    }, 2000);
};
function dvHotMoreInf(dvid) {
    closeOther();
    var posObj = $('#' + dvid + '').offset();
    var posT = posObj.top + 15;
    var posL = posObj.left - 90;
    var winW = $(window).width();
    if (990 - posObj.left < 270) { posL = posObj.left - 200 };
    $('#' + dvid + 'Info').attr('style', 'position:absolute; z-index:100; width:350px;left:' + posL + 'px; top:' + posT + 'px; border:1px solid #000066; padding:15px; background-color:#fff; overflow:visible; -moz-box-shadow: 0 0 30px 5px #999; -webkit-box-shadow: 0 0 30px 5px #999;');
    $('#' + dvid + 'Info').show();
};
function dvHotMoreInfCL(dvid) {
    $('#dvMore' + dvid + 'Info').hide();
};
function closeOther() {
    $('.dvMorInf').each(function () {
        if ($(this).is(':visible') == true) { $('#' + this.id + '').hide(); };
    });
    $('#divRecomended').each(function () {
        if ($(this).is(':visible') == true) { $(this).hide(); };
    });
};
function clkhideIrin(fed) {
    $('#dvFDinclu' + fed + '').hide();
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
    return (((sign) ? '' : '-') + '$' + num); //+ '.' + cents);
};
function checkImg(div, src, err) {
    var image = new Image();
    image.onload = function () {
        $('#' + div + '').html('<img src="' + src + '"/>');
    };
    image.onerror = function () {
        $('#' + div + '').html('<img src="' + err + '"/>');
    };
    image.src = src;
};
// **************
// Guide Calendar
// **************
var deflt = 'New York City (all Airports),  NY'
function calreload(val) {
    startDate = ''
    histFilter = [];
    priceFilter = [];
    deflt = $(".spdepair").text();
    val === undefined ? ($('.spdepair').html(deflt), priceFilter = $.grep(priceGuide, function (pr) { return (pr.PLC_Title === deflt); })) : priceFilter = $.grep(priceGuide, function (pr) { return (pr.PLC_Title === val); });

    var dCnt = 0
    jQuery.each(priceFilter, function (priceFilter) {
        var nwDate;
        dCnt === 0 ?
            (
                nwDate = new Date(),
                nwDate = nwDate.setDate(nwDate.getDate() + 45),
                startDate = nwDate //this.RLD_StartDate
            )
            : '';
        var objtitle;
        objtitle = '$' + Math.round(this.RLD_PackagePrice) + '*';
        objtitle = objtitle + '\xa0\xa0\xa0' + ' - ';
        this.RLD_Nights.toString().length === 1 ? objtitle = objtitle + '\xa0\xa0\xa0\xa0' + this.RLD_Nights + ' nights' : objtitle = objtitle + '\xa0\xa0' + this.RLD_Nights + ' nights';
        var ob = { 'title': objtitle, 'start': '' + this.RLD_StartDate + '', 'className': 'gui' + this.RLDID + '' }
        histFilter.push(ob);
        dCnt++;
    });
    $('#PriceGuideCalendar').guideCalendar('destroy');
    $('#PriceGuideCalendar').html('<div style="text-align:center; padding:50px;"><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"/><br/>loading ...<br/></div>');
    setTimeout(guideCal, 1000);
};
/* Guide Calendar */
function guideCal() {
    $('#PriceGuideCalendar').html('');
    $('#PriceGuideCalendar').guideCalendar({
        header: {
            left: 'prev', //'month,agendaWeek,today,prev,next today',
            center: 'title',
            right: 'next' //'month,agendaWeek,agendaDay'
        },
        defaultDate: startDate, //'2016-01-12',
        weekMode: 'liquid',
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: histFilter,
    });
    clickAnchor();
};
function clickAnchor() {
    $(".apriceXXX").click(function () {
        var nwDate = this.id
        $('.dvPopUpOrangeTopR').is(':visible') == true ? $('.dvPopUpOrangeTopR').hide() : '';
        $('.dvPopUpOrangeTopL').is(':visible') == true ? $('.dvPopUpOrangeTopL').hide() : '';
        var maskH = $(document).height();
        var ctyNA = $('#inpFromNA').val()
        var ctyID = $('#inpFromID').val();
        $('#BsDepCity').val(ctyNA);
        $('#sDepCity').val(ctyNA);
        $('#iDepCity').val(ctyID);
        $('#BiDepCity').val(ctyID);
        $('#InDate1').val(nwDate);
        $('#BInDate1').val(nwDate);
        $('#dvCalMask').css({ 'width': '100%', 'height': maskH, 'background': '#666', 'position': 'absolute', 'top': '0', 'z-index': '6000' });
        $('#dvCalMask').fadeTo("slow", 0.8);
        $('#dvThinCal').appendTo('#dvPopCalContent');
        $('#dvPopCal').attr('style', 'z-index:6100; display:block;');
        $('#dvPopCal').center();
        $(window).resize(function () { $('#dvPopCal').center(); });
        $('[id^="gToday"]').css('position', 'fixed');
    });
    $("[class*='gui']").click(function () {
        var prPop = $(this).attr('class').match(isNumber);
        var prInf = [];
        var aOff = $(this).offset();
        var aPos = $(this).position();
        var popInf = '';
        prInf = $.grep(priceGuide, function (inf) { return (inf.RLDID == Number(prPop)); });
        $.each(prInf, function () {
            var priced = new Date(this.RLD_TXMLTime)
            var arrive = new Date(this.RLD_StartDate)
            var priceThis = "'" + this.PLC_Title + "'," + this.PLCID + ",'" + dateFormat(arrive.setDate(arrive.getDate() + 1), "mm/dd/yyyy") + "'"
            popInf = '<p>' +
                '<span><b>' + this.RLD_Nights + ' Nights </b></span>' +
                '<b>from $' + Math.round(this.RLD_PackagePrice) + ' w/air,  hotel &amp; air taxes*</b>' +
                '</p>' +
                '<p> <b>This sample price includes ALL air taxes &amp; fuel surcharges:</b> Priced on ' + dateFormat(priced.setDate(priced.getDate() + 1), "dddd, mmm dd, yyyy") + ' for arrival on ' + dateFormat(arrive.setDate(arrive.getDate()), "dddd, mmm dd, yyyy") + ', departure from ' + this.PLC_Title + '.</p>' +
                '<p>This sample itinerary includes:</p>'

            aPos.left > 600 ?
                (
                    $('.dvPopUpOrangeTopL').is(':visible') == true ? $('.dvPopUpOrangeTopL').hide() : '',
                    $('#dvPopUpGR').show(),
                    $('#dvPopContentR').html(popInf),
                    $('#dvPopUpGR').offset({ left: aOff.left - 245, top: aOff.top + 34 })
                )
                :
                (
                    $('.dvPopUpOrangeTopR').is(':visible') == true ? $('.dvPopUpOrangeTopR').hide() : '',
                    $('#dvPopUpGL').show(),
                    $('#dvPopContentL').html(popInf),
                    $('#dvPopUpGL').offset({ left: aOff.left + 5, top: aOff.top + 34 })
                );

            $.ajax({
                type: "POST",
                url: "/europe/WS_Library.asmx/sqlItineraryContentFromPriceId",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: '{PriceId:"' + prPop + '"}',
                success: function (data) {
                    msg = eval("(" + data.d + ")");
                    if (msg != '') {
                        var itineraryContent = $.map(msg, function (val) { return { id: val.Id, name: val.Name }; });
                        popInf = popInf + '<ul>' + itineraryContent[0].name + '</ul>';
                        aPos.left > 600 ? ($('#dvPopContentR').html(popInf)) : ($('#dvPopContentL').html(popInf));
                    }
                },
                error: function (xhr, desc, exceptionobj) {
                    $('#dvPopContentR').html(xhr.responseText);
                }
            });
        });
    });
};
function priceThinCal(frm, id, when) {
    $('.dvPopUpOrangeTopR').is(':visible') == true ? $('.dvPopUpOrangeTopR').hide() : '';
    $('.dvPopUpOrangeTopL').is(':visible') == true ? $('.dvPopUpOrangeTopL').hide() : '';
    var maskH = $(document).height();
    $('#dvCalMask').css({ 'width': '100%', 'height': maskH, 'background': '#666', 'position': 'absolute', 'top': '0', 'z-index': '6000' });
    $('#dvCalMask').fadeTo("slow", 0.8);
    $('#BsDepCity').val(frm);
    $('#sDepCity').val(frm);
    $('#iDepCity').val(id);
    $('#BiDepCity').val(id);
    $('#InDate1').val(when);
    $('#BInDate1').val(when);
    $('#dvThinCal').appendTo('#dvPopCalContent');
    $('#dvPopCal').attr('style', 'z-index:6100; display:block;');
    $('#dvPopCal').center();
    $(window).resize(function () { $('#dvPopCal').center(); });
    $('[id^="gToday"]').css('position', 'fixed');
};
// --- Open info pop up --- //
function hidePopUpInfo(popid) {
    $('#' + popid + '').hide();
    popid == 'dvPopCal' ?
        (
            $('#dvCalMask').hide(),
            $('#dvThinCal').appendTo('#overviewCal'),
            $('#BsDepCity').val('type here'),
            $('#sDepCity').val('type here'),
            $('#iDepCity').val(-1),
            $('#BiDepCity').val(-1),
            $('#InDate1').val('mm/dd/yyyy'),
            $('#BInDate1').val('mm/dd/yyyy'),
            $('[id^="gToday"]').css('position', 'absolute'),
            document.getElementById('gToday:normal:agenda.js').contentWindow.fHideCal()
        ) : '';
    return false;
};
function DropDown(el) {
    this.dep = el;
    this.placeholder = this.dep.children('span');
    this.opts = this.dep.find('ul.dropdownList > li');
    this.val = '';
    this.index = -1;
    this.initEvents();
};
DropDown.prototype = {
    initEvents: function () {
        var obj = this;
        obj.dep.on('click', function (event) {
            $(this).toggleClass('active');
            return false;
        });
        obj.opts.on('click', function () {
            var opt = $(this);
            obj.val = opt.text();
            obj.index = opt.index();
            $('#inpFromNA').val(obj.val);
            $('#inpFromID').val(opt.find('a').attr('lang'));
            obj.placeholder.text(obj.val);
            calreload(obj.val);
        });
    },
    getValue: function () {
        return this.val;
    },
    getIndex: function () {
        return this.index;
    }
};
$(function () {
    var dep = new DropDown($('#dep'));
    $(document).click(function () {
        $('.dropdownContainer').removeClass('active');
    });
});
function ShowHideMoreInfo(picID) {
    if (picID.indexOf('pic') > -1) {
        var moreDiv = 'div' + picID.replace('pic', '');
        var moreText = 'text' + picID.replace('pic', '');
        var idImg = picID;
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
        };
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
        };

    };
};