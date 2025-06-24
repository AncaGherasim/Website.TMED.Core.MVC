//Javascript for BYO Calendar
var depAirport = [];
var arrAirport = [];
var arrCty = [];
var prevSq;
var stayLength = [];
var childAge = [];
var isNumber = /[0-9]+/g;
var totalPax = 0;
var myDate = new Date();
var today = new Date();
var fixdates = [];
var blockdates = [];
var indate = "";
for (c = 2; c <= 11; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childAge.push(chilObj);
}
var airCabin = [{ label: 'Coach', value: 'Coach', id: 'Y' }, { label: 'Premium Economy', value: 'Premium Economy', id: 'W' }, { label: 'Business', value: 'Business', id: 'C' }, { label: 'First Class', value: 'First Class', id: 'F' }];
$(document).ready(function () {
    for (i = 1; i <= 14; i++) {
        var stayObj;
        if (i == 1) { stayObj = { label: i + ' night', value: i + ' night', id: i }; } else { stayObj = { label: i + ' nights', value: i + ' nights', id: i }; };
        stayLength.push(stayObj);
    }
    packID = $('#pakID').val();
    packNA = $('#pakNA').val();
    // -- fix dates
    fixdates = $('#fixDates').val().split(',');
    // -- fix dates
    blockdates = $('#blockDates').val().split('|');
    totCity = $('#inpCities').val();
    $('#xcabinRoomPax').click(function () { showdialog(); });
    //$('.dvMbyodialogDone').click(function () { hidedialog(); });
    $('#dvpaxRoom').click(function () { openPaxRoomlist(); });
    $('#dvpxroomlst li').click(function () { roomTravelers(this); });
    $('span[id^="adultPlus"]').click(function () { $('input[id^="xRoom' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultPlus(this) });
    $('span[id^="adultMinus"]').click(function () { $('input[id^="xRoom' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultMinus(this) });
    $('span[id^="childrenPlus"]').click(function () { childPlus(this); });
    $('span[id^="childrenMinus"]').click(function () { childMinus(this); });
    $('#xiAdults, input[id^="xRoom"], select[id^="xRoom"], select[id^=xiChild]').click(function () { $(this).removeClass('errorClass') });
    $('.spMbtnReset').click(function () { resetPage(); });
    $('.spMnextbutt').click(function () { submitToBook(); });
    dateByDest();
    $('.radioCtn input').click(function () {
        var valChk = $(this).val();
        switch (valChk) {
            case "False":
                $('#dvLeavingFrom').hide('slow');
                $('.divAirAdvance').hide('slow');
                break;
            case "True":
                $('#dvLeavingFrom').show('slow');
                $('.divAirAdvance').show('slow');
                break;
        }
    });
    $(document.body).on('click', '.iconEdit', function () {
        $('#xArrCity' + this.id + '').hide();
        $('#xsCityNA' + this.id + '').removeAttr('style');
        $('#xsCityNA' + this.id + '').removeAttr('disabled');
        $('#xsCityNA' + this.id + '').removeAttr('readonly');
        doAutoComple('xsCityNA' + this.id);
    });
    $(document.body).on('click', '.iconUp', function () {
        var no = $(this).attr('id');
        var noprev = Number(no) - Number(1);
        var inpUp = $('#xsCityNA' + no + '');
        var iidUp = $('#xsCityID' + no + '');
        var inpDn = $('#xsCityNA' + noprev + '');
        var iidDn = $('#xsCityID' + noprev + '');
        var inpUval = $(inpUp).val();
        var iidUval = $(iidUp).val();
        var inpDval = $(inpDn).val();
        var iidDval = $(iidDn).val();
        $(inpUp).animate({ 'margin-top': '-100px', 'opacity': '0' }, 300, function () {
            $(inpUp).val(inpDval);
            $(inpDn).val(inpUval);
            $(iidUp).val(iidDval);
            $(iidDn).val(iidUval);
        });
        $(inpDn).animate({ 'opacity': '0', 'margin-top': '100px' }, 300); //.animate({'margin-top': '30px'}, 300);
        $(inpUp).animate({ 'margin-top': '0px', 'opacity': '1' }, 300); //.animate({'opacity': '1'}, 300); 
        $(inpDn).animate({ 'opacity': '1', 'margin-top': '0px' }, 300, function () { newCitySeq(); });
    });
    $(document.body).on('click', '.iconDwn', function () {
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
        $(inpDn).animate({ 'margin-top': '30px', 'opacity': '0' }, 300, function () {
            $(inpDn).val(inpUval);
            $(inpUp).val(inpDval);
            $(iidDn).val(iidUval);
            $(iidUp).val(iidDval);
        });
        $(inpUp).animate({ 'opacity': '0', 'margin-top': '-30px' }, 300); //.animate({'margin-top': '-30px'},300);
        $(inpDn).animate({ 'margin-top': '0px', 'opacity': '1' }, 300); //.animate({'opacity': '1'}, 300);
        $(inpUp).animate({ 'opacity': '1', 'margin-top': '0px' }, 300, function () { newCitySeq(); });
    });
    $(document.body).on('click', '.iconTrsh', function () {
        $('#cityTo' + this.id + '').remove();
        newCitySeq();
    });
    $(document.body).on('click', 'span[id^="spTransRank"]', function () { modifyTranspOption(this); });
    $(document.body).on('click', '.pMaddcity', function () {
        addnewcity(this);
    });
    $('.inpChild').autocomplete({
        autoFocus: true,
        source: childAge,
        minLength: 0,
        select: function (event, ui) {
            $(this).val(ui.item.value).blur();
            return false;
        },
        response: function (event, ui) {
            if (ui.content.length === 0) {
                errorAlert(this.id, "No valid age");
                $(this).blur();
            };
        }
    }).click(function () {
        $(this).removeClass('errorClass');
        $(this).val('');
        $(this).attr('readonly', false);
    }).focus(function () {
        $(this).keydown();
        $(this).attr('readonly', true);
    }).blur(function () {
        if ($(this).val() === '0' || $(this).val() === '1') { errorAlert(this.id, "No valid age"); }
    });

    //$(document.body).on('click', '#xCabinTxt', function(){
    //    $('#xCabinTxt').autocomplete({
    //        autoFocus: true,
    //        source: airCabin,
    //        minLength: 0,
    //        select: function (event, ui) {
    //            $('#xCabinTxt').val(ui.item.label);
    //            $('#xCabin').val(ui.item.id);
    //            $('#xrdAWair').focus();
    //            return false;
    //        }
    //    }).click(function () {
    //        $(this).val('');
    //    }).focus(function () {
    //        $(this).keydown();
    //    });
    //});
    /*  ****  USA DEPARTURE AIRPORTS/CITIES  *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/DepCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            var jsonData = res;
            depAirport = $.map(jsonData, function (m) {
                return {
                    label: m.plC_Title + " - " + m.plC_Code,
                    value: m.plC_Title, // + " - " + m.plcCO ,
                    id: m.plcid,
                    code: m.plC_Code
                };
            });
            doitDeparture('xtxtLeavingFrom');
            doitDeparture('xtxtReturningTo');
        },
        error: function (xhr, desc, exceptionobj) {
        }
    });
    /*  ****  ALL DESTINATIONS ARRIVAL AIRPORTS/CITIES *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/PriorCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            var jsonData = res;
            arrCty = $.map(jsonData, function (m) {
                return {
                    label: m.ctyNA + " - " + m.ctyCOD,
                    value: m.ctyNA, // + " - " + m.plcCO ,
                    id: m.ctyID,
                    code: m.ctyCOD,
                    dept: m.deptNA,
                    hoapi: m.hotelAPI
                };
            });
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText);
        }
    });
    /* *** BUILD CALENDAR FROM XML OR FROM COOKIE BACK *** */
    backCook = Cookies.get('TMEDpkbyoBack'); //jQuery.extendedjsoncookie('getCookieValueDecoded','TMEDpkbyoBack');
    //alert(backCook +" = backCook");
    if (backCook == null || backCook == undefined) {
        //alert("backCook is: " + backCook);
        //$('#xtotCities').val(totCity);
        itineraryModifed(packID, packNA);
    }
    else {
        //alert("backCook need to build calendar");
        buildFromCookie1();
    }

    $(document.body).on('change', 'select[id^="xdropoffCityTxt"]', function () { modifyDropOffOption(this); });

    $('#DoneModal').click(function () { hidedialog() });
    $('#BackModal').click(function () { hidedialog() });

})

// *** TO BUILD CALENDAR FROM COOKIE ***//
function buildFromCookie1() {
    var NtsStay;
    var MiniIs;
    var Naprod;
    var categSel;
    var categSelNA;
    var cookieValues = jQuery.parseJSON(Cookies.get('TMEDpkbyoBack'));
    var Flyadd = cookieValues.xrdAWair;
    if (Flyadd == 'True') {
        $('#xtxtLeavingFrom').val(cookieValues.xtxtLeavingFrom);
        $('#xIDLeavingFrom').val(cookieValues.xIDLeavingFrom);
        $('#xtxtReturningTo').val(cookieValues.xtxtReturningTo);
        $('#xIDReturningTo').val(cookieValues.xIDReturningTo);
        $('#xCabinTxt').val(cookieValues.xCabinTxt);
        $('#xCabin').val(cookieValues.xCabin);

    }
    var totCty = cookieValues.xtotCities;
    $('#xtotCities').val(totCty);
    for (i = 1; i <= totCty; i++) {
        //1|Rome|967,2|Florence|1199,3|Venice|1002,4|London|3,5|Paris|4,6|Amsterdam|983,7|Madrid|965

        //console.log(cookieValues['xsCityNA' + i]);
        var ctyNa = cookieValues['xsCityNA' + i]
        var ctyId = cookieValues['xsCityID' + i]
        var ctyTransField = cookieValues['xrdselTransField' + i]
        var ctyTrans = cookieValues['xrdselTrans' + i]
        if (i == 1) {
            citiesStr = i + '|' + ctyNa + '|' + ctyId + '|' + ctyTransField + '|' + ctyTrans;
        }
        else {
            citiesStr = citiesStr + '$$$' + i + '|' + ctyNa + '|' + ctyId + '|' + ctyTransField + '|' + ctyTrans;
        }
        if (i == totCty) { itineraryModifed("0", "0", citiesStr) }
    }

    $('#xiRoomsAndPaxText').val(cookieValues.xiRoomsAndPaxText);
    var roomOpt = cookieValues.xiRoomsAndPax;
    $('#dvpxroomlst').find('li[id="' + roomOpt + '"]').trigger('click');


}

function buildFromCookie2() {
    var cookieValues = jQuery.parseJSON(Cookies.get('TMEDpkbyoBack'));
    $('#xtxtBYArriving').val(cookieValues.xtxtBYArriving);
    var tCty = cookieValues.xtotCities;
    var nS = 1;
    for (n = nS; n <= tCty; n++) {
        $('#xOfNtsTxt' + n + '').val(cookieValues['xOfNtsTxt' + n]);
        $('#xselNoOfNts' + n + '').val(cookieValues['xselNoOfNts' + n]);
        $('#xSTCity' + n + '  option').removeAttr("selected");
        var NoOfNights = cookieValues['xselNoOfNts' + n];
        //$('#xSTCity' + n + '  option[value=' + NoOfNights + ']').attr('selected', 'selected');
        //$('#xSTCity' + n + '  option:selected').change();
        $('#xSTCity' + n + '').val(NoOfNights);
        n == tCty ? Cookies.set('TMEDpkbyoBack', '', { expires: -1 }) : '';
        if (n == tCty) {
            backCook = null;
        }
    }
    //setCookie('TMEDpkbyoBack','',1);
    //$.removeCookie('TMEDpkbyoBack');
}

// -- Home Town
function sethometown(htw) {
    var hmtw = htw.split('|');
    $("#qLeaveID").val(hmtw[0]);
    $("#qLeaveCO").val(hmtw[2]);
    $("#qsRetCity").val(hmtw[0]);
    $("#qDepCode").html(hmtw[2]);
    $("#qDepCity").html(hmtw[1]);
    $("#qLeaveNA").val(hmtw[1]).hide();
    $(".pdepcode, .pdepcity, .pdepnocode").show();
    return false;
}



/*  ****  NEW list of destinations *** */
function newDest() {
    $('select[id^="xSTCity"]').change(function () {
        doitStay(this, this.id);
    });
    $('select').change(function () {
        doitCar(this);

    });
    //$('input:text[id^="xdropoff"]').each(function () {
    //    doitCar(this.id);
    //});
}

function doitCar(obj) {
    var id = $(obj).attr('id').match(isNumber);
    if (obj.value == 'Downtown') {
        $('#xpickupPlace' + id + '').val(obj.value.substring(0, 1));
    } else if (obj.value == 'Airport') {
        $('#xpickupPlace' + id + '').val(obj.value.substring(0, 1));
    } else if (obj.value == 'First Day') {
        $('#xpickupDay' + id + '').val(obj.value.substring(0, 1));
    } else if (obj.value == 'Last Day') {
        $('#xpickupDay' + id + '').val(obj.value.substring(0, 1));
    }
}

function doitStay(opt, id) {
    $('#xOfNtsTxt' + id.match(isNumber) + '').val($(opt).find('option:selected').val());
    $('#xselNoOfNts' + id.match(isNumber) + '').val($(opt).find('option:selected').val());
}

// **** DATEPICKER **** //
// include block dates
// var blkdates = ["2016-12-15", "2016-12-16"]
var between = [];
function dateByDest() {
    var fixedDates = $('#fixDates').val();
    if (fixedDates != 0) { return false; }
    else {


        var rangeBlk = $('#blockDates').val(); //replace(blockdates,'B-', '');
        if (rangeBlk == 0) {
            // -- Calendar DatePicker
            var strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            var yearRange = '"' + today.getFullYear() + ":" + Number(today.getFullYear() + 1) + '"';
            $('#xtxtBYArriving').datepicker({
                defaultDate: strDate,
                yearRange: yearRange, //"2015:2016",
                changeMonth: false,
                changeYear: false,
                numberOfMonths: 1,
                showButtonPanel: true,
                format: 'yyyy-mm-dd',
                hideIfNoPrevNext: true,
                prevText: '',
                nextText: '',
                minDate: strDate,
                showOtherMonths: false,
                maxDate: "+365d"
                //beforeShowDay: DisableSpecificDates
            }).click(function () { $(this).attr('style', '').removeClass('errorClass'); });


        }
        else {
            rangeBlk = rangeBlk.replace('B-', '');
            rangeBlk = rangeBlk.trim().split('-');
            var rangeBlkS = rangeBlk[0].split('*');
            var rangeBlkE = rangeBlk[1].split('*');

            var dteToday = new Date();
            var dteS;
            var dteE;
            var dte;
            for (i = 0; i <= rangeBlkS.length - 1; i++) {
                var ds = rangeBlkS[i];
                var de = rangeBlkE[i];
                var date1 = stringToDate('' + de + '', 'mm/dd/yyyy', '/');
                var date2 = stringToDate('' + ds + '', 'mm/dd/yyyy', '/');
                var day;
                while (date2 <= date1) {
                    day = date1.getDate()
                    between.push(jQuery.datepicker.formatDate('yy-mm-dd', date1));
                    date1 = new Date(date1.setDate(--day));
                };
            };

            var strDate = '';
            //var myDate = new Date();
            strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);

            var today90Days = new Date(myDate.getTime() + 90 * 24 * 60 * 60 * 1000);
            var strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
            if (between.indexOf(strDateString) != -1) {
                while (between.indexOf(strDateString) != -1) {
                    strDate.setDate(strDate.getDate() + 1);
                    strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
                }
                if (today90Days <= strDate)
                    $('#InDate1').val(jQuery.datepicker.formatDate('mm/dd/yy', strDate));
            }

            $("#xtxtBYArriving").datepicker("destroy");
            $('#xtxtBYArriving').datepicker({
                orientation: 'top',
                defaultDate: strDate,
                changeMonth: false,
                changeYear: false,
                numberOfMonths: 1,
                showButtonPanel: true,
                format: 'yyyy-mm-dd',
                hideIfNoPrevNext: true,
                prevText: '',
                nextText: '',
                minDate: strDate,
                maxDate: "+1Y",
                showOtherMonths: false,
                beforeShowDay: function (date) {
                    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                    return [between.indexOf(string) === -1]
                },
                beforeShow: function (input, inst) {
                    var calendar = inst.dpDiv;
                    setTimeout(function () {
                        calendar.position({
                            my: 'right top',
                            at: 'right bottom',
                            collision: 'flip',
                            of: input
                        });
                    }, 1);
                }

            }).click(function () { $(this).attr('style', '').removeClass('errorClass'); });
        };
    };
};
function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function bbdates(objvd) {
    $("#xtxtBYArriving").datepicker("destroy");
    var fixDatesdiv = $('#fxdates').val();
    builFixDatediv(fixDatesdiv, objvd);
    objPOS = $('#' + objvd + '').offset();
    $('#dvFixDates').show();
    $('#dvFixDates').offset({ left: objPOS.left - 0, top: objPOS.top + 20 });
};
function builFixDatediv(dates, dvObj) {
    var postDate;
    var postField;
    var m = '';
    var dtsDV = '';
    var fecha = dates.split(',');
    var dtct;
    for (i = 0; i < fecha.length; i++) {
        if (m != dateFormat(fecha[i], "mmm")) {
            m = dateFormat(fecha[i], "mmm");
            dtct = 0;
            if (i == 0) {
                dtsDV = '<div class="dvFixDates">';
            }
            else {
                dtsDV = dtsDV + '</div><div class="dvFixDates">';
            };
            dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
        };
        if (dtct == 0) {
            postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
            postField = "'" + dvObj + "'";
            dtsDV = dtsDV + '<span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')" class="spFixDates">' + dateFormat(fecha[i], "dd") + '</span>';
        }
        else {
            postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
            postField = "'" + dvObj + "'";
            dtsDV = dtsDV + ', <span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')" class="spFixDates">' + dateFormat(fecha[i], "dd") + '</span>';
        };
        dtct = dtct + 1;
    };
    dtsDV = dtsDV + '</div>';
    $('#dvFixDates').html(dtsDV);
    setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function changeDaysLenght1(ddate, dobj) {
    $('#' + dobj + '').val(ddate).removeClass('errorClass');
};

// Autocomplete cabin
function AirCabin() {
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
}

// **** ROOM - TRAVELERS *** //
function changeCabin(obj) {
    $('.pMbyodialogCabin').each(function () {
        this.id === obj.id ? ($('#' + obj.id + '').find('span:first').html('&#10003;'), $('#Cabin, #xCabin').val(obj.id)) : $('#' + this.id + '').find('span:first').html('&nbsp;')
    });
};
function checkTotalPax() {
    var qAdults = Number($('#xiAdults').val()) + Number($('#xRoom2_iAdults').val()) + Number($('#xRoom3_iAdults').val());
    var qChilds = Number($('#xiChildren').val()) + Number($('#xRoom2_iChildren').val()) + Number($('#xRoom3_iChildren').val());
    totalPax = qAdults + qChilds;
    if (totalPax <= 6) {
        return true;
    } else {
        alert('Max guest allowed (adults + children) are 6 !')
        return false;
    };
};
function adultPlus(obj) {
    var nwObj;
    var nwObjVal;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#xiAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal <= 6 ? ($(nwObj).val(nwObjVal + 1), checkTotalPax() === true ? '' : $(nwObj).val(nwObjVal)) : ''
        )
        :
        (
            nwObj = $('#xRoom' + obj.id.match(isNumber) + '_iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal <= 6 ? ($(nwObj).val(nwObjVal + 1), checkTotalPax() === true ? '' : $(nwObj).val(nwObjVal)) : ''
        );
};
function adultMinus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#xiAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal > 1 ? (nwObj.val(nwObjVal - 1)) : (alert('At least one adult should be present at room 1!'), nwObj.val('1'))
        )
        :
        (
            nwObj = $('#xRoom' + obj.id.match(isNumber) + '_iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal > 1 ? (nwObj.val(nwObjVal - 1)) : (alert('At least one adult should be present at room ' + obj.id.match(isNumber) + '!'), nwObj.val('1'))
        );
};
function childPlus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#xiChildren'),
            nwObj.val() === '' || nwObj.val() === '0' ? (nwObj.val('1'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('0')) : nwObj.val() === '1' ? (nwObj.val('2'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('1')) : nwObj.val() === '2' ? alert('Sorry, only 2 Children per room') : ''
        )
        :
        (
            nwObj = $('#xRoom' + obj.id.match(isNumber) + '_iChildren'),
            nwObj.val() === '' || nwObj.val() === '0' ? (nwObj.val('1'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('0')) : nwObj.val() === '1' ? (nwObj.val('2'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('1')) : nwObj.val() === '2' ? alert('Sorry, only 2 Children per room') : ''
        );
};
function childMinus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#xiChildren'),
            nwObj.val() === '2' ? (nwObj.val('1'), childAgeChange(nwObj)) : nwObj.val() === '1' ? (nwObj.val('0'), childAgeChange(nwObj)) : ''
        )
        :
        (
            nwObj = $('#xRoom' + obj.id.match(isNumber) + '_iChildren'),
            nwObj.val() === '2' ? (nwObj.val('1'), childAgeChange(nwObj)) : nwObj.val() === '1' ? (nwObj.val('0'), childAgeChange(nwObj)) : ''
        );
};
function childAgeChange(obj) {
    $(obj).attr('id').match(isNumber) === null ?
        $('#dvroom1 p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#xiChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#xiChild' + this.id.match(isNumber) + '').val('')) })
        :
        $('#dvroom' + $(obj).attr('id').match(isNumber) + ' p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#xRoom' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#xRoom' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('')) });
};
function roomTravelers(obj) {
    $('#xiRoomsAndPax').val(obj.id);
    $('#roomPaxTxt').html(obj.innerHTML);
    openPaxRoomlist();
    /Other/.test(obj.id) ? openRooms(obj.id.match(isNumber), 0) : openRooms(obj.id.substring(0, 1), obj.id.substring(2, 3));
};
function openRooms(rms, pax) {
    pax === 0 ? ($('#dvpxperroom').slideDown('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) <= rms ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRooms(this)) })) : ($('#dvpxperroom').slideUp('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) > 1 ? cleanRooms(this) : firstRoom(rms, pax) }));
};
function openPaxRoomlist() {
    $('#dvpxroomlst').is(':visible') === false ? ($('#dvpxroomlst').slideDown('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoom", "dvMdialogRoomROT")) : ($('#dvpxroomlst').slideUp('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoomROT", "dvMdialogRoom"));
};
function firstRoom(rm, px) {
    $('#xiAdults').val(px);
    $('#xiChildren').val('');
    $('#xiChild1').val('');
    $('#xiChild2').val('');
    $('#dvroom1 p[id^="pAge"]').each(function () { $(this).hide() });
};
function cleanRooms(obj) {
    $('#' + obj.id + '').find('input').each(function (e, v) {
        switch (e) {
            case 0:
                $('#' + v.id + '').val('');
                break;
            case 1:
                $('#' + v.id + '').val('');
                break;
            case 2:
                $('#' + v.id + '').val('');
                break;
            case 3:
                $('#' + v.id + '').val('');
                break;
        };
    });
    $('#' + obj.id + ' p[id^="pAge"]').each(function () { $(this).hide() });
};

function showdialog() {
    //var posTopX = $('.dvByoTitle').position();
    //window.scrollTo(0, posTopX.top - 10);
    $('html, body').animate({ scrollTop: '0px' }, 300);
    $('.dvMMask').show();
    $('.dvMbyoPgContainer').show();
    //var cabval = $('#xwCabin').val();
    //cabval === 'No' ? $('#dvSelectCabin').hide() : $('#dvSelectCabin').show();
    $('.pMbyodialogCabin').click(function () { changeCabin(this); });

}
function hidedialog() {
    var ValidData = 1;
    var dvC = Number($('div[id^="dvroom"]:visible').length);
    $('div[id^="dvroom"]').each(function () {
        if ($(this).is(':visible') === true) {
            var adULT = 0;
            var dvNUM = this.id.match(isNumber);
            var flowSTOP = true;
            var flowCHL = true;
            dvNUM == 1 ? adULT = $('.inpAdult').val() : adULT = $('#xRoom' + dvNUM + '_iAdults').val();
            adULT == "" || adULT == 0 ? dvNUM == null ? flowSTOP = errorAlert('xiAdults', 'Should be at least 1 adult in Room 1') : flowSTOP = errorAlert('xRoom' + dvNUM + '_iAdults', 'Should be at least 1 adult in Room' + dvNUM) : '';
            if (flowSTOP == false) {
                return false;
            };
            $('#' + this.id + ' p[id^="pAge"] select').each(function () {
                if ($(this).is(':visible') == true) {
                    var chdAGE = $(this).val();
                    chdAGE == "" || chdAGE == null || chdAGE == 0 ? (flowCHL = errorAlert(this.id, 'Room' + dvNUM + ': Child age is missing'), dvC++) : $('#' + this.id + '').removeClass('errorClass');
                };
            });
        };
        if (!flowCHL) { return false; };
        dvC--;
        
    });
    dvC === 0 ? hidedialogCont() : '';

}
function errorAlert(obj, mess) {
    var poss = $('#' + obj + '').position();
    $('#' + obj + '').addClass('errorClass'); //.val(mess);
    /qNACity/.test(obj) ? $('#' + obj + '').val(mess) : alert(mess);
    window.scroll(0, poss.top - 100);
    return false;
}
function hidedialogCont() {
    //var qcabin = $('#xCabinTxt').find(':selected').val();
    //switch ($('#xCabin').val()) {
    //    case "Y":
    //        qcabin = ", Economy";
    //        break;
    //    case "W":
    //        qcabin = ", Premium Economy";
    //        break;
    //    case "C":
    //        qcabin = ", Business";
    //        break;
    //    case "F":
    //        qcabin = ", First Class";
    //        break;
    //}
    //alert(qcabin);
    $('#xwCabin').val() === 'No' ? qcabin = "" : '';
    var qpxrm = $('#xiRoomsAndPax').val();
    var qRooms = qpxrm.substring(0, 1);
    $('#xiRoom').val(qRooms);
    $('#xRooms').val(qRooms);
    $('#xselRooms').val(qRooms);
    qRooms > 1 ? qRooms = qRooms + ' Rooms' : qRooms = qRooms + ' Room';
    //alert(qRooms);
    var rompax = qpxrm.split('|');
    var pax;
    var totpax = 0;
    /-/.test(rompax[1]) ? pax = rompax[1].split('-') : pax = rompax[1];
    for (p in pax) { totpax += Number(pax[p]); };
    isNaN(totpax) ? checkTotalPax() === true ? totpax = Number(totalPax) : '' : '';
    haveCook = 0;
    var qPxRoomString = qRooms + ', ' + totpax + ' Travelers';//+ qcabin;
    //alert(qPxRoomString);
    $('#xcabinRoomPax').val(qPxRoomString);
    $("#dvRoomPax").modal('hide');
//    $('.dvMbyoPgContainer').hide();
//    $('.dvMMask').hide();
//    var qposBack = $('.dvMPaxRoom').position();
//    window.scrollTo(0, qposBack.top - 10);
}

/* *** TO SET AUTOCOMPLETE FUNCTION *** */
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
                alert('No valid airport found');
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
        if (IsMobileDevice()) { $('#' + ctyNa + '').val(''); } else { $('#' + ctyNa + '').select(); }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var $a = $("<span></span>").text(item.label);
        highlightText(this.term, $a);
        return $("<li></li>").append($a).appendTo(ul);
    };
}
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
                    return (item);
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
                alert('No valid European destination found');
                return false;
            }
        },
        select: function (event, ui) {
            $('#' + ctyNa + '').attr('value', ui.item.value).hide().attr('readonly');
            $('#' + ctyNa + '').val(ui.item.value);
            $('#xArrCity' + ctyNa.match(isNumber) + '').text(ui.item.value).show();
            $('#' + ctyNa.replace('NA', 'ID') + '').val(ui.item.id);
            //$('#dvMove' + this.id.match(isNumber)).removeClass('spCityName').addClass('spCityNameOff');
            //$('#' + ctyNa + '').attr('disabled', 'disabled');
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
        $('#' + ctyNa + '').val('');
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var $a = $("<span></span>").text(item.label);
        highlightText(this.term, $a);
        return $("<li></li>").append($a).appendTo(ul);
    };
}
function newCitySeq() {
    if (cityValidation($('input[id^="xsCityNA"]').length) != false) {
        var newSeq = [];
        $('input[id^="xsCityNA"]').each(function () {
            var seqN = this.id.match(/[\d\.]+/g);
            if (seqN != null) {

                var toAdd = seqN + '|' + this.value + '|' + $('#xsCityID' + seqN + '').val();
                newSeq.push(toAdd);
            }
        });
        fixdates = 0;
        itineraryModifed("0", "0", newSeq.join("$$$"));
    }
}
function cityValidation(tot) {
    //Cities validation
    for (i = 1; i <= tot; i++) {
        if (i > tot) { return true; };
        if ($('#xsCityID' + i + '').val() == -1) {
            var clsClk = "'xsCityNA" + i + "'";
            //var errMess = 'Please select a valid city!  <br> <a href="javascript:closeClick(' + clsClk + ')">OK</a>';
            //popCalError('xsCityNA' + i, errMess);
            return false;
        }
    }
}
// -- Modify transportation - spTransActive 
function modifyTranspOption(obj) {
    //alert("modifyTranspOption");
    var nwobj = obj.id.substring(0, obj.id.length - 1);
    var objSeq = nwobj[nwobj.length - 1];
    var nwlast = Number(obj.id.substring(obj.id.length - 1, obj.id.length)) + 1;
    var nwobjC = $('span[id^="' + nwobj + '"]').length;
    nwlast > nwobjC ? nwlast = 1 : '';
    nwobj = nwobj + nwlast;
    var carSel;
    //alert(nwobj);
    var trnobj;
    //alert(nwobjC);
    nwobjC > 1 ? ($('#' + obj.id + '').hide('slide', { direction: 'up' }, 'fast').removeClass('spTransActive').addClass('spTransNoActive'),
        $('#' + nwobj + '').show('slide', { direction: 'up' }, 'fast').removeClass('spTransNoActive').addClass('spTransActive'),
        $('#xrdselTransField' + objSeq + '').val($('#' + nwobj + '').data('field')),
        $('#xrdselTrans' + objSeq + '').val($('#' + nwobj + '').data('type')),
        $('#xOverNts' + objSeq + '').val($('#' + nwobj + '').data('ovrnts')),
        /car/.test($('#' + nwobj + '').find('img').attr('src')) === true ?
            ($('#dvCarOpt' + objSeq + '').slideDown('slow'),
                objSeq === 'S' ? ($('#xdropoffCityS option:first-child').attr('selected', 'selected').trigger('change'))
                    : ($('#xdropoffCity' + objSeq + ' option:first-child').attr('selected', 'selected'), modifyDropCarCtyLast(objSeq, $('#xdropoffCity' + objSeq + '').val()))
            )
            :
            ($('#dvCarOpt' + objSeq + '').is(':visible') === true ?
                (carSel = $('#xdropoffCity' + objSeq + ' option:selected').val(),
                    $('#dvCarOpt' + objSeq + '').slideUp('slow'),
                    checkCarSelected(carSel, objSeq),
                    $('#xdropoffCity' + objSeq + ' option:selected').removeAttr('selected')
                ) : ''

            )
    ) : alert("Only this option.");
}
// -- check and modify car drop off
function checkCarSelected(val, seq) {
    //alert("checkCarSelected");
    var objSeq;
    seq === 'S' ? objSeq = 0 : objSeq = seq;
    var drpoff = val;
    $('.dvMtravelto').each(function () {
        var thisL = this.id[this.id.length - 1];
        thisL > objSeq ? ($('#' + this.id + '').show(), $('#xrdselTransField' + thisL + '').val($('#' + this.id + '').show().find('span:visible').data('field'))) : '';
    });
}
// -- Modify Car drop off city
function modifyDropCarCty(obj) {
    console.log("modifyDropCarCty");
    var objSeq = obj.id[obj.id.length - 1];
    console.log("objSeq = " + objSeq);
    var drpoff = $('#' + obj.id + '').find("option:selected").val();
    console.log("drpoff = " + drpoff);
    $('div[id*="dvMtravelTo"]').each(function () {
        console.log("dvMtravelTo id = " + this.id.length);
        var thisL = this.id[this.id.length - 1];
        objSeq === thisL ? ''
            : drpoff != 'E' ?
                (
                    thisL < drpoff ? ($('#' + this.id + '').hide(), $('#xrdselTransField' + thisL + '').val('')) : '',
                    thisL >= drpoff ? ($('#' + this.id + '').show(), $('#xrdselTransField' + thisL + '').val($('#' + this.id + '').show().find('span:visible').data('field'))) : ''
                )
                : ($('#' + this.id + '').hide(), $('#xFIELDCity' + thisL + '').val(''))
    });
}
// -- Modify Car drop off city when city is last
function modifyDropCarCtyLast(seq, droff) {
    //alert("modifyDropCarCtyLast");
    var objSeq = seq;
    var drpoff = droff;
    $('.dvMtravelto').each(function () {
        var thisL = this.id[this.id.length - 1];
        thisL > objSeq ?
            thisL < drpoff ? ($('#' + this.id + '').hide(), $('#xrdselTransField' + thisL + '').val('')) : '' : '';
    });
}
// -- Add New City Selector
function addnewcity(obj) {
    var frmto = obj.lang.split(',')
    var frm = frmto[0];
    var to = frmto[1];
    if (to > 12) { alert('For best results, no more than 12 cities is allowed. Thank.'); return false; };
    var nxt = Number(to) + Number(1);
    var newcity = '<div id="cityTo' + to + '" class="dvMTo">' +
        '<div><span class="spCityNo">' + to + '</span><span class="spbtnicon"></span><br style="clear:both"/></div>' +
        '<span class="L">' +
        '<p id="xArrCode' + to + '" class="parrcode"></p>' +
        '<p id="xArrCity' + to + '" class="parrcity"></p>' +
        '<input name="xsCityNA' + to + '" type="text" id="xsCityNA' + to + '" class="form-control mt-3" value="City name"/>' +
        '<input type="hidden" name="xsCityID' + to + '"  id="xsCityID' + to + '" value="-1"  />' +
        '<input name="xsCityCO' + to + '" type="hidden" id="xsCityAPI' + to + '" value=""/>' +
        '<input name="xsCityAPI' + to + '" type="hidden" id="xsCityAPI' + to + '" value=""/>' +
        '</span>' +

        '<br style="clear:both"/>' +
        '</div>';
    var $divBfr = $('#cityTo' + frm);
    $(newcity).insertAfter($divBfr);
    doAutoComple('xsCityNA' + to + '');
    $('.pMaddcity').attr('lang', to + ',' + nxt);
    //$('.parrcode, .parrcity').click(function () { updatearrcity(this) });
    var opePos = $('#cityTo' + to).position();
    $('html,body').animate({ scrollTop: opePos.top - 200 }, 400);
    //$("#spClose" + to + "").show().click(function () { deletecity(Number(to)) })
    //window.scrollTo(0,opePos.top - 10);
}
function resetPage() {
    Cookies.set('TMEDpkbyoBack', '', { expires: -1 });
    var docURL = document.URL.toLowerCase();
    window.location = docURL.replace('_pkbyo', '_pk');
}
function itineraryModifed(id, na, sq) {
    var data = { pkID: id, pkNA: na, itiSQ: sq };
    //alert(sq);

    var options = {};
    options.url = SiteName + "/BYOitinerary";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify(data);
    options.dataType = "html";
    options.success = function (data) {
        var r = $('<div>' + data + '</div>').find('#hasErr').text();
        if (r == 1) {
            alert('This itinerary city sequence can not be modified at this moment!');

        }
        var fcity = $('<div>' + data + '</div>').find("#xNACity1").val();
        //$('.dvByoCityContainer').removeClass('loader');
        $('.dvByoCityContainer').html(data);
        var cityS = $('<div>' + data + '</div>').has("#cityToS");
        if (cityS[0] != undefined) {
            $('.spSlegend').first().text("Transfer to" + fcity);
        }
        AirCabin();
        dateByDest();
        newDest();
        indate = $('#inDatePromo').val();
        $('#inDatePromo').val() != 9999 ? $('#xtxtBYArriving').val(indate) : '';
        if (backCook != null || backCook != undefined) {
            buildFromCookie2();
        }
    };
    options.error = function (xhr, desc, exceptionobj) {
        $('#dvCalContainerbyo').html(xhr.responseText);
    };
    $.ajax(options);
}

function submitToBook() {
    var totCity = $('#inpCities').val();
    $('#xtotCities').val(totCity);
    var queryString = $('#getNewItin').serialize();
    var cookString = ''
    cookString = JSON.stringify($('#getNewItin').serializeObject()); //$('#frmToBook').serializeObject());
    Cookies.set('TMEDpkbyoBack', cookString, { expires: 1 })
    //console.log(queryString);
    $.ajax({
        type: "POST",
        url: SiteName + "/Calendar/T4BuildComponentList",
        contentType: "application/json",
        data: JSON.stringify(queryString),
        dataType: "html",
        success: function (html) {
            processResponseB(html);
        },
        error: function (xhr, desc, exceptionobj) {
            $('#content').html(xhr.responseText);
            alert(xhr.responseText + ' = error');
        }
    });
}

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
    var pck = $('#placeID').val();
    $('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
   if (goToBook == 1) {
       document.getElementById("frmToBook").action = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create?" + pck;
       document.getElementById("frmToBook").submit();
   }
}

function modifyDropOffOption(obj) {
    //alert("modifyDropOffOption");
    var drpoff = $('#' + obj.id + '').find("option:selected").val();
    $('#' + obj.id.replace("Txt", "") + '').val(drpoff);
    modifyDropCarCty(obj);
}

// --- GET MOBILES
function IsMobileDevice() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        || navigator.userAgent.match(/Windows mobile/i)
        || navigator.userAgent.match(/IEMobile/i)
        || navigator.userAgent.match(/Opera Mini/i)) {
        return true;
    }
    else {
        return false;
    };
};
