//Javascript Template 24-26
//Date 10/15/2019
//Crated by : Andrei
var verification = "";
var childPax = [{ text: '0', value: 0 }, { text: '1', value: 1 }, { text: '2', value: 2 }];
var childAge = [];
var isNumber = /[0-9]+/g;
var totalPax = 0;
var myDate = new Date();
var prvCont = new Array();
for (c = 2; c <= 11; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childAge.push(chilObj);
}
$(document).ready(function () {
    $('.dvMpriceIt').is(':visible') == false ? $('.dvMpriceIt').show() : '';
    $('.dvMpriceItNo').is(':visible') == true ? $('.dvMpriceItNo').hide() : '';
    //console.log("dvMpriceIt show = " + $('.dvMpriceIt').is(':visible'));
    $('.dvMpriceIt').click(function () { validateForm(); });
    // -- pack No. Of Nights
    packNoNts = $('#packNoNts').val();
    // -- fix dates
    fixdates = $('#fixDates').val().split(',');
    // -- fix dates
    blockdates = $('#blockDates').val().split('|');
    // -- cookie back value 
    var backCookie = Cookies.get('mobTBackTMED');
    backCookie != undefined ? (haveCook = 1, buildFromCook()) : haveCook = 0;
    buildPackImg();
    $('#dvMFaq, #dvMTransp').on('show.bs.collapse', function () {
        if ($('#' + this.id + '').html() == '') {
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
        var parent = $('div[class^="dvCMS"]').closest('[id]').get(0).id;
        var cmsId = $(this).attr('href').match(/\d+/);
        prvCont.push($('#' + parent + '').html());
        $('#' + parent + 'Back').removeClass('d-none').addClass('d-block');
        window.scrollTo(0, $('#' + parent + '').offset().top - 50);
        callCMS(cmsId[0], parent);
    });
    $('.dvCmsBack').click(function () {
        var id = $(this).attr('id').replace('Back', '');
        if (prvCont != '') {
            $('#' + id + '').html('');
            $('#' + id + '').html(prvCont[prvCont.length - 1]);
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
                            '<a href="' + SiteName + '/' + i.name.toLowerCase().replace(" ","_") + '/vacations">' +
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
    $('span[id^="adultPlus"]').click(function () { adultPlus(this); });
    $('span[id^="adultMinus"]').click(function () { adultMinus(this); });
    $('span[id^="childrenPlus"]').click(function () { childPlus(this); });
    $('span[id^="childrenMinus"]').click(function () { childMinus(this); });
    $('.pMdialogCabin').click(function () { changeCabin(this); });
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
    $('.catSel').change(function () {
        var id = this.id.match(isNumber);
        //console.log(id);
        var optselected = "";
        $('.catSel option:selected').each(function() {
            optselected += $(this).text() + " ";
        })
        $('#ecityCatNA' + id).val(optselected);
    });
    $('#paxModal').on('show.bs.modal', function (e) {
        //console.log("cabinRoomPax show.bs.modal");
        var cabval = $('#wCabin').val();
        cabval === 'No' ? $('#dvSelectCabin').hide() : $('#dvSelectCabin').show();
        //console.log("haveCook = " + haveCook);
        haveCook === 1 ?
            (
                $('#dvpxroomlst li[id="' + $("#iRoomsAndPax").val() + '"]').trigger('click'),
                $('#dvpxroomlst').hide(), $('div p[id^="pAge"] select').each(function () { this.value > 0 ? $(this).parent('p').show() : '' }),
                $('.pMdialogCabin[id="' + $("#Cabin").val() + '"]').trigger('click')
            ) : '';

    });
});

function buildPackImg() {
    var imgSrc;
    var carousel = '';
    var packId = $('#idPack').val();
    $.ajax({
        type: 'Get',
        url: SiteName + "/Api/Packages/PicsForPacks/" + packId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var objImg = $.grep(data, function (n, i) { return (n.pxI_Sequence == 0); });
            if (objImg[0].imG_500Path_URL !== "none") {
                imgSrc = objImg[0].imG_500Path_URL;
            } else {
                imgSrc = objImg[0].imG_Path_URL;
            }
            $('.topImg').attr('src', 'https://pictures.tripmasters.com' + imgSrc);
            $.each(data, function(i, e) {
                var src;
                var activ = '';
                i == 0 ? activ = "active" : '';
                if (e.imG_500Path_URL !== 'none') {
                    src = e.imG_500Path_URL;
                } else {
                    src = e.imG_Path_URL;
                }
                carousel = carousel + '<div class="carousel-item ' + activ + '"><img class="img-fluid" src="https://pictures.tripmasters.com' + src + '" /></div>';
            });   
            $('.carousel-inner').html(carousel);
        },
        error: function (xhr, desc, exceptionobj) {
            $('#packPics').html(xhr.responseText);
        }
    });
}

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
                var code = m.plC_Code ? m.plC_Code.trim() : "";
                if (code.toLowerCase() !== "none") {
                    return {
                        label: m.plC_Title + " - " + m.plC_Code,
                        value: m.plC_Title,
                        id: m.plcid
                    };
                }
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
        var rangeBlk = $('#blockDates').val(); 
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
}
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
}
function adultMinus(obj) {
    var nwObj;
    obj.id.match(isNumber) === null ?
        (
            nwObj = $('#iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObj.val() > 0 ? (nwObj.val(nwObjVal - 1)) : ''
        )
        :
        (
            nwObj = $('#Room' + obj.id.match(isNumber) + '_iAdults'),
            nwObjVal = Number(nwObj.val()),
            nwObj.val() > 0 ? (nwObj.val(nwObjVal - 1)) : ''
        );
}
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
}
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
}
function childAgeChange(obj) {
    $(obj).attr('id').match(isNumber) === null ?
        $('#dvroom1 p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#iChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#iChild' + this.id.match(isNumber) + '').val('')) })
        :
        $('#dvroom' + $(obj).attr('id').match(isNumber) + ' p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#Room' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#Room' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('')) });
}
function roomTravelers(obj) {
    $('#iRoomsAndPax').val(obj.id);
    $('#roomPaxTxt').html(obj.innerHTML);
    openPaxRoomlist();
    /Other/.test(obj.id) ? openRooms(obj.id.match(isNumber), 0) : openRooms(obj.id.substring(0, 1), obj.id.substring(2, 3));
}
function openRooms(rms, pax) {
    pax === 0 ? ($('#dvpxperroom').slideDown('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) <= rms ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRooms(this)) })) : ($('#dvpxperroom').slideUp('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) > 1 ? cleanRooms(this) : firstRoom(rms, pax) })); //, $('div[id^="dvroom"]').each(function(){cleanRooms(this)}) );
}
function openPaxRoomlist() {
    $('#dvpxroomlst').is(':visible') === false ? ($('#dvpxroomlst').slideDown('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoom", "dvMdialogRoomROT")) : ($('#dvpxroomlst').slideUp('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoomROT", "dvMdialogRoom"));
}
function firstRoom(rm, px) {
    $('#iAdults').val(px);
    $('#iChildren').val(0);
    $('#iChild1').val('');
    $('#iChild2').val('');
    $('#dvroom1 p[id^="pAge"]').each(function () { $(this).hide() });
}
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
        }
    });
    $('#' + obj.id + ' p[id^="pAge"]').each(function () { $(this).hide() });
}
function hidedialog() {
    //console.log("hidedialog");
    var ValidData = 1;
    var dvC = $('div[id^="dvroom"]').length
    //console.log("dvC = " + dvC);
    $('div[id^="dvroom"]').each(function () {
        //console.log("div[id^=dvroom");
        if ($(this).is(':visible') === true) {
            //console.log("is visible");
            $('#' + this.id + ' p[id^="pAge"] select').each(function () {
                if ($(this).is(':visible') === true) {
                    //console.log("$(this).val()");
                    //console.log($(this).val());
                    if (/^[0-9]*$/.test($(this).val()) == false || $(this).val() == "" || $(this).val() == null) {
                        //console.log("invalid data");
                        errorAlert(this.id, '');
                        ValidData = 0;
                        dvC += 1;
                    }
                    else {
                        $('#' + this.id + '').removeClass('errorClass');
                    };

                };
            });
        };
        dvC -= 1;
        dvC === 0 ? hidedialogCont() : '';
    });

    if ($('#iRoomsAndPax').val() == "-1") {
        $('#dvpaxRoom').addClass('errorClass');
        ValidData = 0;
    }
    else {
        $('#dvpaxRoom').removeClass('errorClass');
    }

    //console.log("ValidData = " + ValidData);
    if (ValidData == 1) {
        $("#paxModal").modal('hide');
    }
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
};
function errorAlert(obj, mess) {
    var poss = $('#' + obj + '').position();
    $('#' + obj + '').addClass('errorClass').val(mess);
    window.scroll(0, poss.top - 100);
    return false;
}

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

function callCMS(cmsId, dvHtml) {
    $.ajax({
        type: 'Get',
        url: SiteName + '/Api/Packages/getDataThisCMS/' + cmsId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            if (data[0].cmS_Content != '') {
                data[0].cmS_Content = data[0].cmS_Content.replace(/http:/g, 'https:');
                if (RegExp(/\b(dvCMS\w*)\b/).test(data[0].cmS_Content) == true) {
                    $('#' + dvHtml + '').html(data[0].cmS_Content);
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
}

function validateForm() {
    if ($('#addFlight').val() === 'True') {
        if ($('#iDepCity').val() === '-1') { errorAlert('iDepCityTxt', 'Select a valid departure airport'); return false };
    };
    //console.log("---");
    $('#iRetCity').val($('#iDepCity').val());
    var idate = $.trim($('#InDate1').val());
    if (/undefined|Select/.test(idate)) {
        errorAlert('InDate1', 'Select a valid date'); return false;
    }
    dvPriceIt();
}

function dvPriceIt() {
    //$('.dvMpriceIt').hide();
    //$('.dvMpriceItNo').show();
    var bookProcess
    var pckType = $('#PackType').val();
    var pckID = $('#idPack').val();
    switch (pckType) {
        case 'TP3':
            _bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
            bookProcess = _bpURL + "?" + pckID;
            break;
        case 'MC':
            bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID;
            break;
    };
    var stringQuery = '';
    //console.log($('#formMobT24-26').serialize())
    stringQuery = $('#formMobT24-26').serializeObject();
    Cookies.set('mobTBackTMED', stringQuery, { expires: 1 });
    $('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
    $('#formMobT24-26').find('input[name^="__RequestVerificationToken"]').remove();
    $('#formMobT24-26').attr('action', bookProcess);
    $('#formMobT24-26').submit();

    //setTimeout(function () {
    //    $('.dvMpriceIt').show();
    //    $('.dvMpriceItNo').hide();
    //}, 3000);
}

function bbdates(objvd) {
    //console.log("bbdates");
    $("#InDate1").datepicker("destroy");
    var fixDatesdiv = $('#fxNetDates').val();
    builFixDatediv(fixDatesdiv, objvd);
    objPOS = $('#' + objvd + '').offset();
    $('#dvFixDates').show();
    $('#dvFixDates').offset({ left: objPOS.left - 0, top: objPOS.top + 52 });
};
function builFixDatediv(dates, dvObj) {
    //console.log("builFixDatediv");
    //console.log(dates);
    //console.log(dvObj);
    var postDate;
    var postField;
    var m = '';
    var dtsDV = '';
    var fecha = dates.split(',');
    var dtct;
    var startDate;
    var endDate;

    for (i = 0; i < fecha.length; i++) {
        if (fecha[i] != "") {
            startDate = dateFormat(fecha[i], 'mm/dd/yyyy');
            endDate = dateFormat(new Date(), 'mm/dd/yyyy');
            //console.log(startDate);
            //console.log(endDate);

            if (new Date(startDate) > new Date(endDate)) {
                //console.log(dateFormat(fecha[i], "mmm"));

                if (m != dateFormat(fecha[i], "mmm")) {
                    m = dateFormat(fecha[i], "mmm");
                    //console.log("m = " + m);
                    dtct = 0;
                    if (i == 0) {
                        dtsDV = '<div style="padding:3px 1px;background-color:beige;">';
                    }
                    else {
                        dtsDV = dtsDV + '</div><div style="padding:3px 1px;background-color:beige;">';
                    }
                    dtsDV = dtsDV + ' ' + m + ' ' + dateFormat(fecha[i], "yyyy") + ': ';
                }
                if (dtct == 0) {
                    postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
                    postField = "'" + dvObj + "'";
                    dtsDV = dtsDV + '<span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
                }
                else {
                    postDate = "'" + dateFormat(fecha[i], 'mm/dd/yyyy') + "'";
                    postField = "'" + dvObj + "'";
                    dtsDV = dtsDV + ', <span id="fxDates" onclick="changeDaysLenght1(' + postDate + ',' + postField + ')">' + dateFormat(fecha[i], "dd") + '</span>';
                }
                dtct++;
            }
        }
    };
    dtsDV = dtsDV + '</div>';
    //console.log("dtsDV= " + dtsDV);
    $('#dvFixDates').html(dtsDV);
    setTimeout(function () { $('#dvFixDates').hide() }, 7000);
};
function changeDaysLenght1(ddate, dobj) {
    //console.log("changeDaysLenght1");
    $('#' + dobj + '').val(ddate);
};

function changeCabin(obj) {
    $('.pMdialogCabin').each(function () {
        this.id === obj.id ? ($('#' + obj.id + '').find('span:first').html('&#10003;'), $('#Cabin').val(obj.id)) : $('#' + this.id + '').find('span:first').html('&nbsp;')
    });
}
