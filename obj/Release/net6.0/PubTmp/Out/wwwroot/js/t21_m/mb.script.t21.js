//Javascript Template 21
//Date 03/22/2019
//Created by: Andrei
var verification = "";
var childPax = [{ text: '0', value: 0 }, { text: '1', value: 1 }, { text: '2', value: 2 }];
var childAge = [];
var isNumber = /[0-9]+/g;
var totalPax = 0;
var myDate = new Date();
var prvCont = new Array();
var fixDatesdiv;
var fixedDays = [];
var fxDatesNET;
for (c = 2; c <= 11; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childAge.push(chilObj);
};
$(document).ready(function () {
    $('.dvMpriceIt').is(':visible') == false ? $('.dvMpriceIt').show() : '';
    $('.dvMpriceIt').click(function () { validateForm(); });
    // -- pack No. Of Nights
    packNoNts = $('#packNoNts').val();
    // -- fix dates
    fixdates = $('#fixDates').val().split(',');
    fxDatesNET = $('#fxNetDates').val();
    fixedDays = fxDatesNET;
    fixDatesdiv = fxDatesNET;
    // -- fix dates
    blockdates = $('#blockDates').val().split('|');
    // -- cookie back value 
    var backCookie = Cookies.set('mobTBackTMED');
    //console.log("docuemnt ready backCookie = " + backCookie);
    backCookie != undefined ? (haveCook = 1, buildFromCook()) : haveCook = 0;
    //console.log("haveCook = " + haveCook);

    $('#paxModal').on('show.bs.modal', function (e) {
        console.log("cabinRoomPax show.bs.modal");
        var cabval = $('#wCabin').val();
        cabval === 'No' ? $('#dvSelectCabin').hide() : $('#dvSelectCabin').show();
        console.log("haveCook = " + haveCook);
        haveCook === 1 ?
            (
                $('#dvpxroomlst li[id="' + $("#iRoomsAndPax").val() + '"]').trigger('click'),
                $('#dvpxroomlst').hide(), $('div p[id^="pAge"] select').each(function () { this.value > 0 ? $(this).parent('p').show() : '' }),
                $('.pMdialogCabin[id="' + $("#Cabin").val() + '"]').trigger('click')
            ) : '';

    });


    // -- campaign code
    //$('#utm_campaign').val(jsutmcook);
    var cookMark = getCookie('utmcampaign');
  //  console.log("cookMark");
  //  console.log(cookMark);
  var cookMkVal;
    if (cookMark != null) {
        cookMkVal = cookMark.split('=');
        //console.log("cookMkVal[0]");
        //console.log(cookMkVal[0]);
        //console.log("cookMkVal[1]");
        //console.log(cookMkVal[1]);
        if ($('#utm_campaign').length != 0) {
            //console.log("jQuery.trim(cookMkVal[1])");
            //console.log(jQuery.trim(cookMkVal[1]));
            $('#utm_campaign').val(jQuery.trim(cookMkVal[1]));
            $('#valCook').html(cookMkVal[1]);
        };
    };


    builtPackImg();

    $('#dvMFaq, #dvMItin, #dvMTransp').on('show.bs.collapse', function () {
        //console.log(this.id);
        if ($('#' + this.id + 'Content').html() == '') {
            callCMS($('#' + this.id + 'CmsId').val(), this.id);
        }
        
    });
    $('#changeNights').on('show.bs.collapse', function () {
        $("#changeNights").css({ "background-color": "#fffce7" });
        $('#aChgNts').css("background-color", "rgb(255, 252, 231)");
        $('#aChgNts').css('font-weight', "700");
        $('#aChgNts').css("border-bottom", "none");
        $('#aChgNts').css("margin-bottom", "0");
        $('#changeNights').css("border-bottom", "1px solid #fad105");
    });
    $('#changeNights').on('hide.bs.collapse', function () {
        $('#aChgNts').removeAttr("style");
        $('#changeNights').css("border-bottom", "none");
    });
    $(document).on('click', '.dvCMSThreeLinks a, .aCMStxtLink, .spCMSContentText a', function (e) {
        e.preventDefault();
        var parent = $(this).closest('div[id^="dvM"]').attr("id");//.closest('[id]')//.get(0).id;
        var parentId = parent.substring(0, parent.indexOf('Content'))
        var cmsId = $(this).attr('href').match(/\d+/);
        //var dvID = $('.dvMIncludesRot').attr('id');
        prvCont.push($('#' + parent + '').html());
        $('#' + parentId + 'Back').removeClass('d-none').addClass('d-block');
        window.scrollTo(0, $('#' + parent + '').offset().top - 50);
        callCMS(cmsId[0], parentId);
    });
    $('.dvCmsBack').click(function () {
        var id = $(this).attr('id').replace('Back', '');
        if (prvCont != '') {
            $('#' + id + 'Content').html('');
            $('#' + id + 'Content').html(prvCont[prvCont.length - 1]);
            prvCont.pop();
        }
        prvCont == '' ? $('#' + id + 'Back').removeClass('d-block').addClass('d-none') : '';

    });
    $('#custFeed').on("show.bs.modal", function () {
        var packId = $('#idPack').val();
        var msg = "";        
        if (verification == "") {
            $.ajax({
                type: 'Get',
                url: SiteName + "/Api/Packages/GetCustomerFeedbacks/" + packId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $.each(data, function (n, i) {
                        msg = '<div class="col-12 dvEachCustFeed pt-3 pb-3 pl-2 pr-2 border border-dark border-bottom-0 border-left-0 border-right-0">' +
                            '<a asp-controller="Package" asp-action="Index" asp-route-Country="' + i.name + '" asp-route-id="' + i.id + '">' +
                            '<p class="font-weight-bold">' + i.name + '</p>' +
                            '<p>' + i.noOfFeeds + ' Customer Feedback</p>' +
                            '</a></div>';
                        $(msg).insertAfter(".dvEachCustFeed");
                    });                   
                },
                error: function (xhr, desc, exceptionobj) {
                    $('#packPics').html(xhr.responseText);
                }
            });
            verification = "1";
        }
    });
    $('#dvpaxRoom').click(function () { openPaxRoomlist(); });
    $('#dvpxroomlst li').click(function () { roomTravelers(this); });
    $('span[id^="adultPlus"]').click(function () { $('input[id^="Room' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultPlus(this) });
    $('span[id^="adultMinus"]').click(function () { $('input[id^="Room' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultMinus(this) });
    $('span[id^="childrenPlus"]').click(function () { childPlus(this); });
    $('span[id^="childrenMinus"]').click(function () { childMinus(this); });
    $('.pMdialogCabin').click(function () { changeCabin(this); });
    $('#iAdults, input[id^="Room"], select[id^="Room"], select[id^=iChild]').click(function () { $(this).removeClass('errorClass') });
    getDeparture();
    dateByDest();
    $('#DoneModal').click(function () { hidedialog() });
    $('#BackModal').click(function () { hidedialog() });
    $('#btnWFly').on('click', function () {
        $('#btnWFly').addClass('btn-primary active');
        $('#btnWFly').removeClass('btn-dark');
        $('#btnFly').removeClass('btn-primary active').addClass('btn-dark');
        $('#iDepCityTxt').collapse('show');
        $('#addFlight').val('True');
    });
    $('#btnFly').on('click', function () {
        $('#btnFly').removeClass('btn-dark');
        $('#btnFly').addClass('btn-primary active');
        $('#btnWFly').removeClass('btn-primary active').addClass('btn-dark');
        $('#iDepCityTxt').collapse('hide');
        $('#addFlight').val('False');
    });
});
function getDeparture() {
    /*  ****  USA DEPARTURE AIRPORTS/CITIES  *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/depCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            var jsonData = res;
            depCities = $.map(jsonData, function (m) {
                return {
                    label: m.plC_Title + " - " + m.plC_Code,
                    value: m.plC_Title, // + " - " + m.plcCO ,
                    id: m.plcid
                };
            });
            doitDep();
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = Error');
        }
    });
}
function doitDep() {
    $("#iDepCityTxt").autocomplete({
        autoFocus: true,
        source: depCities,
        minLength: 3,
        response: function (event, ui) {
            if (ui.content.length === 0) {
                alert('No valid airport found')
                return false;
            };
        },
        select: function (event, ui) {
            $("#iDepCityTxt").val(ui.item.value).blur();
            $("#iDepCity").val(ui.item.id);
            $("#iRetCity").val(ui.item.id);
            return false;
        }
    }).click(function () {
        $('#iDepCityTxt').select().removeClass('errorClass');
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var $a = $("<span></span>").text(item.label);
        highlightText(this.term, $a);
        return $("<li></li>").append($a).appendTo(ul);
    };
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
    }).blur(function () { if ($(this).val() === '0' || $(this).val() === '1') { errorAlert(this.id, "No valid age"); }; });
}
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
    }
}
// **** DATEPICKER **** //
// include block dates
// var blkdates = ["2016-12-15", "2016-12-16"]
var between = [];
function dateByDest() {
    var fixedDates = $('#fxNetDates').val();
    if (fixedDates != 0) { return false; }
    else {
        var rangeBlk = $('#blockDates').val(); //replace(blockdates,'B-', '');
        if (rangeBlk == 0) {
            // -- Calendar DatePicker
            var strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            var yearRange = '"' + today.getFullYear() + ":" + Number(today.getFullYear() + 1) + '"';
            $('#InDate1').datepicker({
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
                var ds = rangeBlkS[i].trim();
                var de = rangeBlkE[i].trim(); 
                var date1 = stringToDate('' + de + '', 'mm/dd/yyyy', '/');
                var date2 = stringToDate('' + ds + '', 'mm/dd/yyyy', '/');
                var day;
               while (date2 <= date1) {
                    day = date1.getDate()
                    between.push(jQuery.datepicker.formatDate('yy-mm-dd', date1));
                  date1 = new Date(date1.setDate(--day));
                };
            };

            strDate = '';
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

            $("#InDate1").datepicker("destroy");
            $('#InDate1').datepicker({
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
};
function builtPackImg() {
    var imgSrc;
    var packId = $('#idPack').val();
    $.ajax({
        type: 'Get',
        url: SiteName + "/Api/Packages/PicsForPacks/" + packId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var objImg = $.grep(data, function (n, i) { return (n.pxI_Sequence == 0);});
            var imgmap = $.grep(data, function (n, i) { return (n.imG_ImageType == "M0");});
            if (objImg[0].imG_500Path_URL !== "none") {
                imgSrc = objImg[0].imG_500Path_URL;
            } else {
                imgSrc = objImg[0].imG_Path_URL;
            }
            $('.topImg').attr('src', 'https://pictures.tripmasters.com' + imgSrc);
            $('.imgItinMap').attr('src', 'https://pictures.tripmasters.com' + imgmap[0].imG_500Path_URL);
        },
        error: function (xhr, desc, exceptionobj) {
            $('#packPics').html(xhr.responseText);
        }
    });
}
function callCMS(cmsId, dvHtml) {
    //console.log(cmsId);
    //console.log(dvHtml);
    $.ajax({
        type: 'Get',
        url: SiteName + '/Api/Packages/SqlThisCMS/' + cmsId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            //var msg = JSON.stringify(data);
            if (data[0].cmS_Content != '') {
                data[0].cmS_Content = data[0].cmS_Content.replace(/http:/g, 'https:');
                if (RegExp(/\b(dvCMS\w*)\b/).test(data[0].cmS_Content) == true) {
                    $('#' + dvHtml + 'Content').html(data[0].cmS_Content);
                } else {
                    return false;
                }
            }
        },
        error: function (xhr, desc, exceptionobj) {
            $('#' + dvHtml + '').html(xhr.responseText);
        }
    });
}

function buildFromCook() {
    var cookieValues = jQuery.parseJSON(Cookies.get('mobTBackTMED'));
    var cokC = 0;
    var cokL = Object.keys(cookieValues).length

    var packId = $('#Pkgid').val();
    var cookiePackId;
    for (var prop in cookieValues) {
        if (prop == "Pkgid") {
            cookiePackId = cookieValues[prop];
            break;
        }
    }

    if (packId != cookiePackId) {
        Cookies.set('mobTBackTMED', '', { expires: -1 });
    } else {
        jQuery.each(cookieValues, function (i, e) {
            $('#' + i + '').val(e)
            cokC += 1;
            cokC === cokL ?
                (
                    Cookies.set('mobTBackTMED', '', { expires: -1 }),
                    $('#addFlight').val() === 'False' ? ($('#btnFly').removeClass('btn-dark'),
                                                        $('#btnFly').addClass('btn-primary active'),
                                                        $('#btnWFly').removeClass('btn-primary active').addClass('btn-dark'),
                                                        $('#iDepCityTxt').collapse('hide'),
                                                        $('#addFlight').val('False'))
                        : ''
                ) : '';
        });
    }
};

function validateForm() {
    if ($('#addFlight').val() === 'True') {
        if ($('#iDepCity').val() === '-1') { errorAlert('iDepCityTxt', 'Select a valid departure airport'); return false };
    };
    //console.log("---");
    $('#iRetCity').val($('#iDepCity').val());
    var idate = $.trim($('#InDate1').val());
    //alert("idate = " + idate);
    if (/undefined|Select/.test(idate)) {
        errorAlert('InDate1', 'Select a valid date'); return false;
    };
    dvPriceIt();
}

function changeCabin(obj) {
    $('.pMdialogCabin').each(function () {
        this.id === obj.id ? ($('#' + obj.id + '').find('span:first').html('&#10003;'), $('#Cabin').val(obj.id)) : $('#' + this.id + '').find('span:first').html('&nbsp;')
    });
}

function dvPriceIt() {
    $('.dvMpriceIt').hide();
    $('.btnWait').show();
    var bookProcess
    var pckType = $('#PackType').val();
    var pckID = $('#idPack').val();
    switch (pckType) {
        case 'TP3':
            _bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
            bookProcess = _bpURL + "?" + pckID;
            break;
        case 'MC':
            bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID ;				
            break;
    };
    var stringQuery = '';
    stringQuery = $('#formMobT21').serializeObject();
    Cookies.set('mobTBackTMED', stringQuery, { expires: 1 });
    $('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
    $('#formMobT21').find('input[name^="__RequestVerificationToken"]').remove();
    $('#formMobT21').attr('action', bookProcess);
    $('#formMobT21').submit();

    setTimeout(function () {
        $('.dvMpriceIt').show();
        $('.btnWait').hide();
    }, 3000);
    
}

// **** ROOM - TRAVELERS *** //
function checkTotalPax() {
    var qAdults = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val()) + Number($('#Room3_iAdults').val());
    var qChilds = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val()) + Number($('#Room3_iChildren').val());
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
            nwObj = $('#iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal <= 6 ? ($(nwObj).val(nwObjVal + 1), checkTotalPax() === true ? '' : $(nwObj).val(nwObjVal)) : ''
        )
        :
        (
            nwObj = $('#Room' + obj.id.match(isNumber) + '_iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal <= 6 ? ($(nwObj).val(nwObjVal + 1), checkTotalPax() === true ? '' : $(nwObj).val(nwObjVal)) : ''
        );
};
function adultMinus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal > 1 ? (nwObj.val(nwObjVal - 1)) : (alert('At least one adult should be present at room 1!'), nwObj.val('1'))
        )
        :
        (
            nwObj = $('#Room' + obj.id.match(isNumber) + '_iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObjVal > 1 ? (nwObj.val(nwObjVal - 1)) : (alert('At least one adult should be present at room ' + obj.id.match(isNumber) + '!'), nwObj.val('1'))
        );
};
function childPlus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#iChildren'),
            nwObj.val() === '0' ? (nwObj.val('1'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('0')) : nwObj.val() === '1' ? (nwObj.val('2'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('1')) : nwObj.val() === '2' ? alert('Sorry, only 2 Children per room') : ''
        )
        :
        (
            nwObj = $('#Room' + obj.id.match(isNumber) + '_iChildren'),
            nwObj.val() === '0' ? (nwObj.val('1'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('0')) : nwObj.val() === '1' ? (nwObj.val('2'), checkTotalPax() === true ? childAgeChange(nwObj) : nwObj.val('1')) : nwObj.val() === '2' ? alert('Sorry, only 2 Children per room') : ''
        );
};
function childMinus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#iChildren'),
            nwObj.val() === '2' ? (nwObj.val('1'), childAgeChange(nwObj)) : nwObj.val() === '1' ? (nwObj.val('0'), childAgeChange(nwObj)) : ''
        )
        :
        (
            nwObj = $('#Room' + obj.id.match(isNumber) + '_iChildren'),
            nwObj.val() === '2' ? (nwObj.val('1'), childAgeChange(nwObj)) : nwObj.val() === '1' ? (nwObj.val('0'), childAgeChange(nwObj)) : ''
        );
};
function childAgeChange(obj) {
    $(obj).attr('id').match(isNumber) === null ?
        $('#dvroom1 p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#iChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#iChild' + this.id.match(isNumber) + '').val('')) })
        :
        $('#dvroom' + $(obj).attr('id').match(isNumber) + ' p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#Room' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#Room' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('')) });
};
function roomTravelers(obj) {
    //console.log("roomTravelers obj.id = " + obj.id)
    $('#iRoomsAndPax').val(obj.id);
    //alert("roomTravelers obj.innerHTML = " + obj.innerHTML)
    $('#roomPaxTxt').html(obj.innerHTML);
    openPaxRoomlist();
    /Other/.test(obj.id) ? openRooms(obj.id.match(isNumber), 0) : openRooms(obj.id.substring(0, 1), obj.id.substring(2, 3));
};
function openRooms(rms, pax) {
    //console.log("openRooms rms = " + rms)
    pax === 0 ? ($('#dvpxperroom').slideDown('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) <= rms ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRooms(this)) })) : ($('#dvpxperroom').slideUp('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) > 1 ? cleanRooms(this) : firstRoom(rms, pax) })); //, $('div[id^="dvroom"]').each(function(){cleanRooms(this)}) );
};
function openPaxRoomlist() {
    $('#dvpxroomlst').is(':visible') === false ? ($('#dvpxroomlst').slideDown('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoom", "dvMdialogRoomROT")) : ($('#dvpxroomlst').slideUp('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoomROT", "dvMdialogRoom"));
};
function firstRoom(rm, px) {
    $('#iAdults').val(px);
    $('#iChildren').val(0);
    $('#iChild1').val('');
    $('#iChild2').val('');
    $('#dvroom1 p[id^="pAge"]').each(function () { $(this).hide() });
};
function cleanRooms(obj) {
    $('#' + obj.id + '').find('input').each(function (e, v) {
        switch (e) {
            case 0:
                $('#' + v.id + '').val('0');
                break;
            case 1:
                $('#' + v.id + '').val('0');
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
function errorAlert(obj, mess) {
    var poss = $('#' + obj + '').position();
    $('#' + obj + '').addClass('errorClass'); //.val(mess);
    /qNACity/.test(obj) ? $('#' + obj + '').val(mess) : alert(mess);
    window.scroll(0, poss.top - 100);
    return false;
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
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) {
                c_end = document.cookie.length
            };
            return unescape(document.cookie.substring(c_start, c_end))
        };
    };
    return null
};
function hidedialog() {
    //console.log("hidedialog");
    var ValidData = 1;
    var dvC = Number($('div[id^="dvroom"]:visible').length);
    $('div[id^="dvroom"]').each(function () {
        if ($(this).is(':visible') === true) {
            var adULT = 0;
            var dvNUM = this.id.match(isNumber);
            var flowSTOP = true;
            var flowCHL = true;
            dvNUM == 1 ? adULT = $('.inpAdult').val() : adULT = $('#Room' + dvNUM + '_iAdults').val();
            adULT == "" || adULT == 0 ? dvNUM == null ? flowSTOP = errorAlert('iAdults', 'Should be at least 1 adult in Room 1') : flowSTOP = errorAlert('Room' + dvNUM + '_iAdults', 'Should be at least 1 adult in Room' + dvNUM) : '';
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

};
function hidedialogCont() {
    //console.log("hidedialogCont");
    var qcabin = "";
    switch ($('#Cabin').val()) {
        case "Y":
            qcabin = ", Economy"
            break;
        case "W":
            qcabin = ", Premium Economy"
            break;
        case "C":
            qcabin = ", Business"
            break;
        case "F":
            qcabin = ", First Class"
            break;
    };
    $('#wCabin').val() === 'No' ? qcabin = "" : '';
    var qpxrm = $('#iRoomsAndPax').val()
    var qRooms = qpxrm.substring(0, 1);
    $('#iRoom').val(qRooms);
    $('#Rooms').val(qRooms);
    qRooms > 1 ? qRooms = qRooms + ' Rooms' : qRooms = qRooms + ' Room';
    var rompax = qpxrm.split('|');
    var pax;
    var totpax = 0;
    /-/.test(rompax[1]) ? pax = rompax[1].split('-') : pax = rompax[1];
    for (p in pax) { totpax += Number(pax[p]); };
    isNaN(totpax) ? checkTotalPax() === true ? totpax = Number(totalPax) : '' : '';
    haveCook = 0;
    var qPxRoomString = qRooms + ', ' + totpax + ' Travelers' + qcabin;
    $('#cabinRoomPax').val(qPxRoomString);
    $("#paxModal").modal('hide');
//    $('.dvMuserDialog').hide();
//    $('.dvMdialogDone').hide();
//    $('.dvMlandingContenedor').show('fade');
//    var qposBack = $('.dvMcalandBook').position();
//    window.scrollTo(0, qposBack.top - 10)
};

function bbdates(objvd) {
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
                dtsDV = '<div style="padding:3px 1px;background-color:beige;">';
            }
            else {
                dtsDV = dtsDV + '</div><div style="padding:3px 1px;background-color:beige;">';
            };
            dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
        };
        if (dtct == 0) {
            postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
            postField = "'" + dvObj + "'";
            dtsDV = dtsDV + '<span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
        }
        else {
            postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
            postField = "'" + dvObj + "'";
            dtsDV = dtsDV + ', <span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
        };
        dtct = dtct + 1;
    };
    dtsDV = dtsDV + '</div>';
    $('#dvFixDates').html(dtsDV);
    setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function changeDaysLenght1(ddate, dobj) {
    $('#' + dobj + '').val(ddate);
};
