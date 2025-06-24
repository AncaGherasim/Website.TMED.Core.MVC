// JavaScript Document
var cookVal = getCookie('TM_BackCookie');
var citySelID;
var BorF = 'BYO';
var $addButt;
var bTo;
var bFrom;
var $addCty;
var $noMore;
var depCities = [];
var arrivalCities = [];
var arrvCTY = [];
var airCabin = [{ label: 'Economy', value: 'Coach', id: 'Y' }, { label: 'Premium Economy', value: 'Premium Economy', id: 'W' }, { label: 'Business', value: 'Business', id: 'C' }, { label: 'First Class', value: 'First Class', id: 'F' }];
var stayLength = [];
for (i = 1; i <= 14; i++) {
    var stayObj;
    if (i == 1) { stayObj = { label: i + ' nt', value: i + ' night', id: i }; } else { stayObj = { label: i + ' nts', value: i + ' nights', id: i }; };
    stayLength.push(stayObj);
};
var goingTojs = [{ label: 'Europe', value: 'Europe', id: 'TMED' }, { label: 'Latin America', value: 'Latin America', id: 'TMLD' }, { label: 'Asia, Pacific & Middle East', value: 'Asia, Pacific & Middle East', id: 'TMAS' }];
var pickDay = [{ label: 'First Day', value: 'First Day', id: 'F' }, { label: 'Last Day', value: 'Last Day', id: 'L' }];
var paxRooms = [{ id: '1|1', label: '1 room for 1 adult', value: '1 room for 1 adult' }, { id: '1|2', label: '1 room for 2 adults', value: '1 room for 2 adults' }, { id: '1|3', label: '1 room for 3 adults', value: '1 room for 3 adults' }, { id: '1|4', label: '1 room for 4 adults', value: '1 room for 4 adults' }, { id: '1|5', label: '1 room/suite for 5 adults', value: '1 room/suite for 5 adults' }, { id: '1|6', label: '1 room/suite for 6 adults', value: '1 room/suite for 6 adults' }, { id: '1|Other', label: '1 room with children or other options', value: '1 room with children or other options' }, { id: '-1', label: '----------------------------------------------------', value: '' }, { id: '2|2-2', label: '2 rooms for (2 adults + 2 adults)', value: '2 rooms for (2 adults + 2 adults)' }, { id: '2|3-3', label: '2 rooms for (3 adults + 3 adults)', value: '2 rooms for (3 adults + 3 adults)' }, { id: '2|Other', label: '2 rooms with children or other options', value: '2 rooms with children or other options' }, { id: '-1', label: '----------------------------------------------------', value: '' }, { id: '3|2-2-2', label: '3 rooms for (2 adults + 2 adults + 2 adults)', value: '3 rooms for (2 adults + 2 adults + 2 adults)' }, { id: '3|Other', label: '3 rooms with children or other options', value: '3 rooms with children or other options' }];
var adultPax = [];
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
//added for popup issue
var windowWidth;
var windowHeight;
var maskHeight;
var maskWidth;
var $dvOptions;
var $dvMask;
var $dvTransOptResp;
var isIE;
var $frmCalNextStep;
var myDate = new Date();
var jscal = 'S';
/* *** STARTIN CODE *** */
$(document).ready(function () {
    /*  ****  TO DEFINE CALENDAR SIZE ***  */
    _utRawUrl.indexOf('default.') > -1 || _utRawUrl.indexOf('Default.') > -1 ? jscal = 'B' : '';

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
            alert(xhr.responseText);
        }
    });	
    /*  ****  ALL DESTINATIONS ARRIVAL AIRPORTS/CITIES *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/Api/Packages/priorCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{name:"%"}',
        success: function (res) {
           // console.log("/Api/Packages/priorCity succes");
            jsonDataArr = res;
            arrvCTY = $.map(jsonDataArr, function (m) {
                return {
                    label: m.ctyNA + " (" + m.couNA + ")  - " + m.ctyCOD,
                    value: m.ctyNA + " (" + m.couNA + ")",
                    id: m.ctyID,
                    dept: m.deptNA,
                    code: m.ctyCOD,
                    hotapi: m.hotelAPI
                };
            });
            arrivalCities = arrvCTY;
            doitArr();
            doitFArr(1);
            cookieCheck();

        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText);
        }
    });
    /*  ****  DESTINATIONS SELECTED *** */
    $('input[id^="achk"]').each(function () {
        (this.checked) ? $('#' + this.id.replace('chk', '')).addClass('abRehChoChk').parent().addClass('spRehChoActiv') : $('#' + this.id.replace('chk', '')).removeClass('abRehChoChk').parent().removeClass('spRehChoActiv');
    });
    /*  ****  BYO / FIND SELECTOR *** */
    $('#tabByo').click(function () {
        if ($(this).hasClass('tabInactive')) {
            $(this).attr('class', 'tabActive');
            $('#tabFind').attr('class', 'tabInactive');
            $('#dvbCalByoTools').show();
            $('#dvbCalFindTools').hide();
            BorF = "BYO"
        };
    });
    $('#tabFind').click(function () {
        if ($(this).hasClass('tabInactive')) {
            $(this).attr('class', 'tabActive');
            $('#tabByo').attr('class', 'tabInactive');
            $('#dvbCalFindTools').show();
            $('#dvbCalByoTools').hide();
            BorF = "FIND"
        };
    });
    /*  ****  W OR W/O AIR *** */
    $('#qWair').each(function () {
        (this.checked) ? $(this).parent().addClass('active') : $(this).parent().removeClass('active');
    });
    $("input:radio[name=qWair]").click(function () {
        if (this.value == 'True') {
            $('#spWair').addClass('active');
            $('#spWout').removeClass('active');
            $('#AirParam').show();
        }
        else {
            $('#spWair').removeClass('active');
            $('#spWout').addClass('active');
            $('#AirParam').hide();
        }
    });

    /*  ****  ADD CITY *** */
    $addCty = $('.inpAddCty');
    $noMore = $('#inpNoMore');
    $addCty.click(function () {
        bFrom = 0
        bTo = 0
        switch (BorF) {
            case 'BYO':
                bFrom = $('div[id^="dvCity"]').length;
                break;
            case 'FIND':
                bFrom = $('div[id^="dvFCity"]').length;
                break;
        };
        if (bFrom < 12) {
            bTo = bFrom + 1
            qaddCity(bFrom, bTo);
        } else {
            alert('For Better results, not more than 12 cities is allowed')
        };

    });
    $noMore.click(function () {
        switch (BorF) {
            case 'BYO':
                byoValidation();
                break;
            case 'FIND':
                validateFIND();
                break;
        };
    });
    /*  ****  CALENDAR POP UP  *** */
    $dvOptions = $('#dvOptions');
    $dvMask = $('#dvMask');
    $dvTransOptResp = $('#dvTransOptResp');
    $frmCalNextStep = $('#frameTransOptResp');
    /*  ****  utm Campaign  *** */
    var cookMark = Cookies.get('utmcampaign');
    var cookMkVal;
    if (cookMark != null) {
        cookMkVal = cookMark.split('=');
        if ($('#qutm_campaign').length != 0) {
            $('#qutm_campaign').val(jQuery.trim(cookMkVal[1]));
        };
    };

    if (cookVal != null) {
        initCook();
    } else {
        $('#qIDCity1').val(-1);
        $('#qNACity1').val('US city or airport');
        $('#qAPICity1').val('');
    };
    $('input[id^="qNACity"]').keypress(function () {
        var id = this.id.replace('qNACity', '');
        if ($('#' + this.id).val().length == 1) {
            $('#qIDCity' + id).val(-1);
        }
    });
    $('.btnContinue').click(function (event) { submitPrice(); $(this).off(event); });
    $('select[id*="iChild"]').click(function () {
        /iChild/g.test(this.id) === true ? $('#' + this.id + '').select().removeClass('errorClass') : '';
    });
    /*  ****  DATE PICKER *** */
});

function dateByDest(dest) {
    $("#qArrDate").datepicker("destroy");
    var strDate = '';
    strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    $('#qArrDate').datepicker({
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
        beforeShow: function (input, inst) { $(this).removeClass('errorClass'); }
    });
};
function chcUnchk(thsID) {
    $('input[id^="achk"]').each(function () {
        var idThis = this.id.replace('chk', '')
        if (idThis != thsID) {
            if ($('#' + idThis + '').hasClass('abRehChoChk')) { $('#' + idThis + '').removeClass('abRehChoChk'); };
            if (this.checked) { $(this).trigger("click") };
            $('#' + idThis + '').parent().removeClass('spRehChoActiv');
        };
    });
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
function doitDep() {
    if ($("#qLeaveNA").length > 0) {

        $("#qLeaveNA").autocomplete({
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
                $("#qLeaveNA").val(ui.item.value);
                $("#qLeaveID").val(ui.item.id);
                return false;
            },
            close: function (event, ui) {
                if ($('#' + event.target.id.replace('NA', 'ID') + '').val() == "-1") {
                    var firstElement = $(this).data("ui-autocomplete").menu.element[0].children[0]
                        , inpt = $('.ui-autocomplete')
                        , original = inpt.val()
                        , firstElementText = $(firstElement).text();
                    $('#' + this.id + '').val(firstElementText);
                    $.map(depCities, function (item) {
                        $.each(item.label, function (itemVal) {
                            if (item.label == firstElementText) {
                                $('#' + event.target.id.replace('NA', 'ID') + '').val(item.id);

                            }
                        });
                    });
                }
            }
        }).click(function () {
            $('#' + this.id.replace('NA', 'ID') + '').val('-1');
            $('#qLeaveNA').select().removeClass('errorClass');
            if (IsMobileDevice()) { $('#qLeaveNA').val(''); } else { $("#qLeaveNA").select() };
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var $a = $("<a></a>").text(item.label);
            highlightText(this.term, $a);
            return $("<li></li>").append($a).appendTo(ul);
        };
        $("#qCabinTxt").autocomplete({
            autoFocus: true,
            source: airCabin,
            minLength: 0,
            select: function (event, ui) {
                $("#qCabinTxt").val(ui.item.label);
                $("#qCabin").val(ui.item.id);
                $("#qWair").focus();
                return false;
            }
        }).click(function () {
            $(this).val('');
        }).focus(function () {
            $(this).keydown();
        });
        $('#goingTO, #goingFTO').autocomplete({
            autoFocus: true,
            source: goingTojs,
            minLength: 0,
            select: function (event, ui) {
                $("#goingTO, #goingFTO").val(ui.item.label);
                $("#goingID, #goingFID").val(ui.item.value);
                modifyDest(ui.item.id);
                switch (ui.item.id) {
                    case 'TMAS':
                        $("#aasia").trigger('click');
                        break;
                    case 'TMLD':
                        $("#alatin").trigger('click');
                        break;
                    case 'TMED':
                        $("#aeurope").trigger('click');
                        break;
                };
                $("#qWair").focus();
                return false;
            }
        }).click(function () {
            $(this).val('');
        }).focus(function () {
            $(this).keydown();
        });
    };
};
function doitArr() {
    //console.log("doitArr");
    $('input[id^="qNACity"]').each(function () {
        var cityLegen = 'City or airport';
        var inpID = '' + this.id + '';
        $(this).autocomplete({
            autoFocus: true,
            source: function (request, response) {
                var matcher
                if (request.term.length < 4) {
                    matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                }
                else if (request.term.length >= 4) {
                    matcher = new RegExp("\\b" + $.ui.autocomplete.escapeRegex(request.term), "i");
                }
                response($.map(arrivalCities, function (item) {
                    if (matcher.test(item.value) || matcher.test(item.code)) {
                        return (item)
                    }
                }));
            },
            minLength: 3,
            response: function (event, ui) {
                if (ui.content.length === 0 && $('#' + inpID + '').val().length >= 5) {
                    $('#' + this.id.replace('NA', 'ID') + '').val('-1');
                    ui.content.push({ label: 'No result found', value: "" });
                    return false;
                }
            },
            select: function (event, ui) {
                $('#' + this.id + '').val(ui.item.value).removeClass('errorClass');
                $('#' + this.id.replace('NA', 'ID') + '').val(ui.item.id);
                $('#' + this.id.replace('NA', 'CO') + '').val(ui.item.code);
                $("#" + this.id.replace("NA", "API") + "").val(ui.item.hotapi);
                var objNum = this.id.match(isNumber);
                if (Number(objNum) === 1) {
                    $("#qgoingID, #xgoingID").val(ui.item.dept);
                };
                return false;
            },
            close: function (event, ui) {
                var inpTxt = $('#' + event.target.id + '').val();
                if ($('#' + inpID + '').val().length >= 3) {
                    if ($('#' + event.target.id.replace('NA', 'ID') + '').val() == "-1") {
                        var firstElement = $(this).data("ui-autocomplete").menu.element[0].children[0]
                            , inpt = $('.ui-autocomplete')
                            , original = inpt.val()
                            , firstElementText = $(firstElement).text();
                        $('#' + this.id + '').val(firstElementText.substring(0, firstElementText.indexOf('-')));
                        if (firstElementText == "No result found") {
                            $('#' + event.target.id.replace('NA', 'ID') + '').val('-1');
                            $('#' + event.target.id + '').val(inpTxt);
                        } else {
                            $.map(arrivalCities, function (item) {
                                $.each(item.label, function (itemVal) {
                                    if (item.label == firstElementText) {
                                        $('#' + event.target.id.replace('NA', 'ID') + '').val(item.id);
                                        $('#' + event.target.id.replace('NA', 'CO') + '').val(item.code);
                                        $("#" + event.target.id.replace("NA", "API") + "").val(item.hotapi);
                                        var objNum = event.target.id.match(isNumber);
                                        if (Number(objNum) === 1) {
                                            $("#qgoingID, #xgoingID").val(item.dept);
                                        };
                                    }
                                });
                            });
                        }
                    }
                }
            }
        }).click(function () {
            $(this).select().removeClass('errorClass');
            $('#' + this.id.replace('NA', 'ID') + '').val('-1');
            if (IsMobileDevice()) { $(this).val(''); };
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var $a = $("<span></span>").text(item.label);
            highlightTextBYO(this.term, $a);
            return $("<li></li>").append($a).appendTo(ul);
        };
    });
};
function highlightTextBYO(text, $node) {
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
function doitFArr(to) {
    if ($('#qFNACity' + to + '').length > 0) {
        $('#qFNACity' + to + '').autocomplete({
            autoFocus: true,
            source: arrivalCities,
            minLength: 3,
            response: function (event, ui) {
                if (ui.content.length === 0) {
                    alert('No valid destination found to ' + $("#goingFTO").val() + ' \n\nPlease try again.')
                    return false;
                };
            },
            select: function (event, ui) {
                $('#qFNACity' + to + '').val(ui.item.label);
                $('#qFIDCity' + to + '').val(ui.item.id);
                return false;
            }
        }).click(function () {
            if ($('#goingFTO').val() == "") {
                var thisObj = 'goingFTO';
                var objJS = "'goingFTO'";
                var errMess = 'Please select a valid going to region !  <br> <a href="javascript:spanClick(' + objJS + ')">OK</a>'
                popError(thisObj, errMess);
                return false;
            } else {
                if (IsMobileDevice()) { $('#qFNACity' + to + '').val(''); } else { $('#qFNACity' + to + '').select() };
            };
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var $a = $("<a></a>").text(item.label);
            highlightText(this.term, $a);
            return $("<li></li>").append($a).appendTo(ul);
        };
    };
};



function qaddCity(fr, to, fcook) {
    if (to > 12) {
        alert('For best results, no more than 12 cities is allowed. Thanks.');
        return false;
    }
    else if (to <= 12) {
        var nwDiv = '';
        var lineClass;
        var removeClass;
        jscal === 'B' ? lineClass = 'dvbCalLineConteiner' : lineClass = 'dvbCalSmallConteiner';
        jscal === 'B' ? removeClass = 'spRemove' : removeClass = 'spSmallRemove';

        switch (BorF) {
            case 'BYO':
                var nwDiv = document.querySelector('.template-Calendar') ? ('<!-- city  ' + to + ' -->\
			<div class="mar-bot" style="display: flex;align-items: center;position: relative;" id="dvCity' + to + '">\
			<div class="flex-column input5">\
			<input class="form-input" name="qNACity'+ to + '" type="text" id="qNACity' + to + '" value="US city or airport"/>\
			<input name="qIDCity'+ to + '" type="hidden" id="qIDCity' + to + '" value="-1"/>\
			<input name="qCOCity'+ to + '" type="hidden" id="qCOCity' + to + '" value=""/>\
			<input name="qAPICity'+ to + '" type="hidden" id="qAPICity' + to + '" value=""/>\
			</div>\
			<span class="btnRemove desk" id="spRemove' + to + '" onClick="qDelCty(' + to + ')">Remove City</span>\
            <span class="btnRemove mobile" id="spRemove' + to + '" onClick="qDelCty(' + to + ')">&#10006;</span>\
			<div class="flex-column input4 input-arrow">\
            <select class="select-css form-input" name="qSTCity'+ to + '" id="qSTCity' + to + '">\
            <option value="1"> 1 nights </option>\
            <option value="2"> 2 nights </option>\
            <option value="3" selected> 3 nights </option>\
            <option value="4"> 4 nights </option>\
            <option value="5"> 5 nights </option>\
            <option value="6"> 6 nights </option>\
            <option value="7"> 7 nights </option>\
            <option value="8"> 8 nights </option>\
            <option value="9"> 9 nights </option>\
            <option value="10"> 10 nights </option>\
            <option value="11"> 11 nights </option>\
            <option value="12"> 12 nights </option>\
            <option value="13"> 13 nights </option>\
            <option value="14"> 14 nights </option>\
            </select>\
			</div>\
			<br style="clear:both"/>\
			</div><!-- end city '+ to + ' -->') :
                    ('<!-- city  ' + to + ' -->\
			<div class="'+ lineClass + '" id="dvCity' + to + '">\
			<div>\
			<input name="qNACity'+ to + '" type="text" id="qNACity' + to + '" value="type city name here"/>\
			<input name="qIDCity'+ to + '" type="hidden" id="qIDCity' + to + '" value="-1"/>\
			<input name="qCOCity'+ to + '" type="hidden" id="qCOCity' + to + '" value=""/>\
			<input name="qAPICity'+ to + '" type="hidden" id="qAPICity' + to + '" value=""/>\
			</div>\
			<div >\
			<span class="'+ removeClass + '" id="spRemove' + to + '" onClick="qDelCty(' + to + ')">Remove City</span>\
			</div>\
			<div >\
            <select class="select-css select-css-stay" name="qSTCity'+ to + '" id="qSTCity' + to + '">\
            <option value="1"> 1 nights </option>\
            <option value="2"> 2 nights </option>\
            <option value="3" selected> 3 nights </option>\
            <option value="4"> 4 nights </option>\
            <option value="5"> 5 nights </option>\
            <option value="6"> 6 nights </option>\
            <option value="7"> 7 nights </option>\
            <option value="8"> 8 nights </option>\
            <option value="9"> 9 nights </option>\
            <option value="10"> 10 nights </option>\
            <option value="11"> 11 nights </option>\
            <option value="12"> 12 nights </option>\
            <option value="13"> 13 nights </option>\
            <option value="14"> 14 nights </option>\
            </select>\
			</div>\
			<br style="clear:both"/>\
			</div><!-- end city '+ to + ' -->');
                var $divBfr = $('#dvCity' + fr);
                $(nwDiv).insertAfter($divBfr);
                doitArr();
                break;
            case 'FIND':
                var nwFDiv = '<!-- city  ' + to + ' -->\
			<div class="dvbCalLineConteiner" id="dvFCity'+ to + '">\
			<div>\
			<input type="text" name="qFNACity'+ to + '" id="qFNACity' + to + '" value="type city name here"/>\
			<input name="qFIDCity'+ to + '" type="hidden" id="qFIDCity' + to + '" value="-1"/>\
			</div>\
			<div >\
			<span class="spRemove" id="spFRemove'+ to + '" onClick="qDelCty(' + to + ')">Remove City</span>\
			</div>\
			<br style="clear:both"/>\
			</div><!-- end city '+ to + ' -->'
                var $divFfr = $('#dvFCity' + fr);
                $(nwFDiv).insertAfter($divFfr);
                doitFArr(to);
                break;
        };
    };
};
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
function countElement(objNA) {
    var divTOT;
    for (d = 1; d <= 12; d++) {
        var divC = document.getElementById(objNA + d);
        if (divC) {
            divTOT = d;
        }
        else {
            d = 13;
        };
    };
    return divTOT;
};
/*  **** DELETE CITIES *** */
function qDelCty(cty) {
    switch (BorF) {
        case 'BYO':
            var fr;
            var to;
            var nxt = cty + 1;
            var ctTOT;
            if (IsMobileDevice() != null || identifyBrowser().indexOf('Firefox') > 0) {
                ctTOT = countElement('dvCity');
            }
            else {
                ctTOT = $('div[id*="dvCity"').length;
            };
            $('#dvCity' + cty + '').remove();
            for (i = nxt; i <= ctTOT; i++) {
                if ($('#dvCity' + i + '').length > 0) {
                    var bfr = i - 1;
                    $('#dvCity' + i + '').attr('id', 'dvCity' + bfr + '');
                    $('#qNACity' + i + '').attr('name', 'qNACity' + bfr + '');
                    $('#qNACity' + i + '').attr('id', 'qNACity' + bfr + '');
                    $('#qIDCity' + i + '').attr('name', 'qIDCity' + bfr + '');
                    $('#qIDCity' + i + '').attr('id', 'qIDCity' + bfr + '');
                    $('#qCOCity' + i + '').attr('name', 'qCOCity' + bfr + '');
                    $('#qCOCity' + i + '').attr('id', 'qCOCity' + bfr + '');
                    $('#qAPICity' + i + '').attr('name', 'qAPICity' + bfr + '');
                    $('#qAPICity' + i + '').attr('id', 'qAPICity' + bfr + '');
                    $('#spRemove' + i + '').attr('onClick', 'qDelCty(' + bfr + ');');
                    $('#spRemove' + i + '').attr('id', 'spRemove' + bfr + '');
                    $('#qSTCity' + i + 'Txt').attr('name', 'qSTCity' + bfr + 'Txt');
                    $('#qSTCity' + i + 'Txt').attr('id', 'qSTCity' + bfr + 'Txt');
                    $('#qSTCity' + i + '').attr('name', 'qSTCity' + bfr + '');
                    $('#qSTCity' + i + '').attr('id', 'qSTCity' + bfr + '');
                    doitArr(bfr);
                };
            };
            break;
        case 'FIND':
            var fr;
            var to;
            var nxt = cty + 1;
            var ctTOT;
            if (IsMobileDevice() != null || identifyBrowser().indexOf('Firefox') > 0) {
                ctTOT = countElement('dvFCity');
            }
            else {
                ctTOT = $('div[id*="dvFCity"').length;
            };
            $('#dvFCity' + cty + '').remove();
            for (i = nxt; i <= ctTOT; i++) {
                if ($('#dvFCity' + i + '').length > 0) {
                    var bfr = i - 1;
                    $('#dvFCity' + i + '').attr('id', 'dvFCity' + bfr + '');
                    $('#qFNACity' + i + '').attr('name', 'qFNACity' + bfr + '');
                    $('#qFNACity' + i + '').attr('id', 'qFNACity' + bfr + '');
                    $('#qFIDCity' + i + '').attr('name', 'qFIDCity' + bfr + '');
                    $('#qFIDCity' + i + '').attr('id', 'qFIDCity' + bfr + '');
                    $('#spFRemove' + i + '').attr('onClick', 'qDelCty(' + bfr + ');');
                    $('#spFRemove' + i + '').attr('id', 'spFRemove' + bfr + '');
                    doitFArr(bfr);
                };
            };
            break;
    };
};
/*  **** VALIDATION / ERROR FORMS *** */
function validateFIND() {
    window.scrollTo(0, 0);
    if (IsMobileDevice() != null || identifyBrowser().indexOf('Firefox') > 0) {
        howManyhas = countElement('dvFCity');
    }
    else {
        howManyhas = $('div[id*="dvFCity"]').length;
    };
    if ($('#goingFTO').val() == "") {
        var thisObj = 'goingFTO';
        var objJS = "'goingFTO'";
        var errMess = 'Please select a valid going to region !  <br> <a href="javascript:spanClick(' + objJS + ')">OK</a>'
        popError(thisObj, errMess);
        return false;
    };
    for (y = 1; y <= howManyhas; y++) {
        var valCty = $('#qFIDCity' + y + '').val();
        if (valCty == -1 || valCty == '') {
            var thisObj = 'qFNACity' + y;
            var objJS = "'qFNACity" + y + "'";
            var errMess = 'Please select a valid destination !  <br> <a href="javascript:spanClick(' + objJS + ')">OK</a>'
            popError(thisObj, errMess);
            return false;
        };
    };
    findCombination();
};
function popError(obj, mess) {
    $('#dvErrMess').html('<img src="https://pictures.tripmasters.com/siteassets/d/Symbols-Warning-icon-32.gif" width="32" height="32" align="absmiddle" style="padding-top:5px;" /> ' + mess + '');
    var popP = $('#' + obj + '').offset();
    var popL = popP.left + 10;
    var popT = popP.top - 80;
    $('#dvError').attr('style', 'position:absolute; display:none; z-index:9999; left:' + popL + 'px; top:' + popT + 'px; width:auto;');
    $('#dvError').fadeIn(100);
};
function spanClick(obj) {
    $('#dvError').hide();
    if (IsMobileDevice()) { $('#' + obj + '').val(''); }
    if (obj == 'qArrDate') {
        $('#' + obj + '').datepicker("show");
    }
    else if (obj.indexOf('going') > -1) {
        $('#' + obj + '').focus();
    }
    else if (obj.indexOf('xtxtNoOfNts') > -1) {
        $('#' + obj + '').focus();
    }
    else {
        $('#' + obj + '').trigger('click');
    };
};

/*  **** AFTER VALIDATION - SUBMIT FORMS *** */
function CO_showBg() {
    maskHeight = $(document).height();
    $dvMask.css({ 'height': maskHeight });
    $dvMask.show();
    $dvOptions.html('<div class="dvCalContainer" style="width:600px; height:200px;background: #fff !important; box-shadow: inset 0 0 10px #648ad1 !important; border: 1px solid #648ad1 !important;"><div style="margin:80px 180px; "><img src="https://pictures.tripmasters.com/siteassets/d/loader.gif"></div></div>');
    $dvTransOptResp.dvScroolWait();
    $dvTransOptResp.show();
};
(function ($) {
    $.fn.dvScroolWait = function () {
        var $scrollingDiv = $("#dvTransOptResp");
        var w = $(this).width();
        var ow = $(this).outerWidth();
        var ml = (w + (ow - w)) / 2;
        $(this).css("left", "0%");
        $(this).css("margin-left", "-" + ow / 2 + "px");
        $(this).css("top", "80px");
    };
})(jQuery);
(function ($) {
    $.fn.dvScrool = function () {
        var $scrollingDiv = $("#dvTransOptResp");
        var w = $(this).width();
        var ow = $(this).outerWidth();
        var ml = (w + (ow - w)) / 2;
        $(this).css("left", "50%");
        $(this).css("margin-left", "-" + ow / 2 + "px");
        $(this).css("top", "80px");
        var wH; 
        var dH = $scrollingDiv.outerHeight();
        $(window).scroll(function () {
            wH = $(this).height()
            if (wH > dH) {
                $scrollingDiv
                    .stop()
                    .animate({ "top": ($(window).scrollTop() + 30) + "px" }, "slow");
            };

        });
    };
})(jQuery);
function CO_hideBg() {
    $dvMask.hide();
};
function startOver() {
    $dvTransOptResp.hide();
    $dvOptions.html();
    CO_hideBg();
};
function hiddenDiv() {
    $dvTransOptResp.hide();
    $dvOptions.html();
    CO_hideBg();
};
// *** SUBMIT TO BOOK *** //
function findCombination() {
    var frmDestNA;
    var frmDestID;
    var ctyC, ctyN;
    $('input[id^="qFNACity"]').each(function () {
        ctyC = this.id.match(isNumber);
        ctyN = $('#' + this.id + '').val()
        if (ctyN.indexOf('(') > -1) {
            ctyN = ctyN.substring(0, ctyN.indexOf('(') - 1);
        };
        if (ctyC == 1) {
            frmDestNA = ctyN; 
            frmDestID = $('#' + this.id.replace('NA', 'ID') + '').val();
        }
        else {
            frmDestNA += '_' + ctyN; 
            frmDestID += ',' + $('#' + this.id.replace('NA', 'ID') + '').val();
        };
    });
    var findSite = '';
    findSite = $('#goingFID').val();
    var jsSite = '';
    switch (findSite) {
        case 'TMED':
        case 'ED':
            jsSite = 'europe'
            break;
        case 'TMLD':
        case 'LD':
            jsSite = 'latin'
            break;
        case 'TMAS':
            jsSite = 'asia'
            break;
    };
    $('#allID').val(frmDestID);
    $('#allNA').val(frmDestNA);
    document.FormFIND.action = "http://www.tripmasters.com/" + jsSite + "/" + frmDestNA + "/find-packages";
    document.FormFIND.submit();
};
//---------------- BACK cookie -------------------------------------
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            };
            return unescape(document.cookie.substring(c_start, c_end));
        };
    };
    return null;
};
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};


function byoValidation() {

    if ($("input[name='qWair']:checked").val() == 'True') {
        if ($('#qLeaveID').val() == -1 || $('#qLeaveID').val() == '') {
            { errorAlert('qLeaveNA', 'Select a valid city or airport'); return false; }
        }
    }
    if ((/\//).test($('#qArrDate').val()) == false) { errorAlert('qArrDate', 'Date is not valid'); return false; }
    var cC = 0;
    $('form#formBYO input[id^="qIDCity"]').each(function () {
        if (this.value == '-1' && $('#' + this.id.replace('ID', 'NA') + '').val() == 'City or airport') {
            errorAlert(this.id.replace('ID', 'NA'), 'Select a valid city or airport');
            cC -= 1;
        } else if (this.value == '-1') {
            errorAlert(this.id.replace('ID', 'NA'), $('#' + this.id.replace('ID', 'NA') + '').val());
            cC -= 1;
        }
        cC += 1;
        cC === $('form#formBYO input[id^="qIDCity"]').length ? submitFormT4('formBYO') : '';
    });
};
function submitFormT4(frmNA) {
    var templateCal = document.querySelector('.template-Calendar');
    $('#myModal').slideDown(function () {
        if (templateCal) {
            $('.dvTransportation').show()
        } else {
            var ofset = $noMore.offset();
            var lft = ($(window).width() - $('.dvTransportation').outerWidth()) / 2;
            $('.dvTransportation').show().offset({ top: ofset.top + 40, left: lft });
            $(window).scrollTop(ofset.top + 20);
        }
    });
    var stringQuery = '';
    stringQuery = JSON.stringify($('#formBYO').serializeObject());
    Cookies.set('backCookieTMED', stringQuery, { expires: 1 });
    var stringForm = '';
    stringForm = $('#' + frmNA + '').serialize();
    //console.log("stringForm = ");
    //console.log(stringForm);

    var options = {};
    options.url = SiteName + "/Api/Packages/webservTransportationOption";
    options.type = "POST";
    options.contentType = "application/json";
    options.data = JSON.stringify(stringForm);
    options.dataType = "json";
    options.success = function (data) {
        //console.log("/Api/Packages/webservTransportationOption succes: ")
        //console.log(data)
        cityData = data.Cities;
        //console.log("cityData: ");
        //console.log(cityData);
        buildTransportationFrom();
    };
    options.error = function (msg) {
        console.log(msg);
    };
    $.ajax(options);
};
function length(obj) {
    return Object.keys(obj).length;
};
function buildTransportationFrom() {
    $('.dvSpin').hide();
    $('.dvtranspByoCalTools').show();

    var cookSaved = JSON.parse(Cookies.get('backCookieTMED'));
    //console.log("cookSaved = ");
    //console.log(cookSaved);
    $('#xaddFlight').val(cookSaved.qWair);
    cookSaved.qWair === 'True' ? ($('span:contains("With Air")').addClass('spselect'), $('span:contains("Without")').removeClass('spselect'), $('.dvtranspAirParam').show()) : '';
    cookSaved.qWair === 'False' ? ($('span:contains("Without")').addClass('spselect'), $('span:contains("With Air")').removeClass('spselect'), $('.dvtranspAirParam').hide()) : '';
    $('#xLeaveCO').val(cookSaved.qLeaveNA);
    $('#xtxtLeavingFrom').val(cookSaved.qLeaveNA);
    $('#xidLeavingFrom').val(cookSaved.qLeaveID);
    $('#xtxtBYArriving').val($('#qArrDate').val());
    $('#xCabin option[value="' + cookSaved.qCabinOpt + '"]').attr('selected', 'selected');
    $('#xgoingID').val(cookSaved.qgoingID);
    // *** CITY LIST WITH TRANSPORTATION
    var jsCity = [];
    var jsCtyInfo = '';
    var jsC = 0;
    var coC = 0;
    var objC = length(cookSaved) - 1;
    $.each(cookSaved, function (i, e) {
        if (i.match(/\d+/g) != null) {
            if (jsC != i.match(/\d+/g)) {
                jsC = Number(i.match(/\d+/g));
                jsC > 1 ? (jsCity.push(jsCtyInfo), jsCtyInfo = '') : '';
                jsCtyInfo = jsCtyInfo + i.match(isNumber) + '@' + e;
            };
            /qNACity/.test(i) === false ? jsCtyInfo = jsCtyInfo + '@' + e : '';
        };
        coC++;
        coC === objC ? (jsCity.push(jsCtyInfo), jsCtyInfo = '', buildTransportationTo(jsCity), dvTrans = '') : '';
    });
};
function buildTransportationTo(jscity) {
    //console.log("buildTransportationTo " + jscity);
    try {
        var dvCities = '';
        var dvCarOpt = '';
        var totCtys = cityData.length;
        if (totCtys === undefined) {
           // console.log("totCtys === undefined");
            var dataCity = JSON.parse(JSON.stringify(cityData));
            var infocity = jscity[0].split('@');
            dvCities = dvCities + '<div id="cityTo' + dataCity['No'] + '" class="dvtranspCityList">' +
                '<!-- City Name / ' + this.No + ' /-->' +
                '<div><span>' + dataCity['No'] + '. <b>' + decodeURIComponent(dataCity['PlaceName']) + '</b></span>' +
                '<input type="hidden" id="xNOCity' + dataCity['No'] + '" name="xNOCity' + dataCity['No'] + '" value="' + dataCity['No'] + '" />' +
                '<input name="xNACity' + dataCity['No'] + '" type="hidden" id="xNACity' + dataCity['No'] + '" value="' + decodeURIComponent(dataCity['PlaceName']) + '"/>' +
                '<input type="hidden" name="xIDCity' + dataCity['No'] + '"  id="xIDCity' + dataCity['No'] + '" value="' + dataCity['PlaceID'] + '"  />' +
                '<input name="xCOCitx' + dataCity['No'] + '" type="hidden" id="xCOCitx' + dataCity['No'] + '" value="' + infocity[3].trim() + '"/>' +
                '<input name="xAPICity' + dataCity['No'] + '" type="hidden" id="xAPICity' + dataCity['No'] + '" value="' + decodeURIComponent(infocity[4]).trim() + '"/>' +
                '</div>' +
                '<!-- Date / Edit-Remove -->' +
                '<div>' +
                '<span>';
            if (this.No === '1') {
                dvCities = dvCities + '<b>' + $('#qArrDate').val() + '</b>'
            } else {
                dvCities = dvCities + '<span class="sptranspRemoveCity goToStartAgain">Edit/Remove</span>';

            }
            dvCities = dvCities + '</span>' +
                '</div>' +
                '<!-- Staying for -->' +
                '<div> <span>' +
                '<select name="xSTCity' + dataCity['No'] + '" id="xSTCity' + dataCity['No'] + '" class="select-css select-css-stayT">';
            for (i = 1; i <= 14; i++) {
                if (i == infocity[5]) { dvCities = dvCities + '<option value="' + i + '" selected>' + i + ' nights</option>'; }
                else { dvCities = dvCities + '<option value="' + i + '">' + i + ' nights</option>'; }
            };
            dvCities = dvCities + '</select>' +
                '</span>' +
                '</div><br style="clear:both;"></div>';
            //console.log("dvCities = " + dvCities);

        }
        else {
            //console.log("totCtys != undefined");
            $.each(cityData, function (city) {
                var nxtCity = findNextCity(this.PlaceToID);
                if (isNaN(Number(this.No)) === true) {
                    if (this.No === 'S') {
                        var infocityS = jscity[0].split('@');
                        dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvtranspCityList" style="margin:0">' +
                            '<!-- City Name / S /-->' +
                            '<div><span><font size="3">&#8224;</font> Must arrive to <b>' + this.PlaceName + '</b> </span>' +
                            '<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
                            '<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + this.PlaceName + '"/>' +
                            '<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
                            '<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocityS[3].trim() + '"/>' +
                            '<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + decodeURIComponent(infocityS[4]).trim() + '"/>' +
                            '</div>' +
                            '<!-- Date / Edit-Remove -->' +
                            '<div>' +
                            '<span>' +
                            '</span>' +
                            '</div>' +
                            '<!-- Staying for -->' +
                            '<div> <span>' +
                            '<input type="hidden" id="xSTCity' + this.No + '" name="xSTCity' + this.No + '" value="0"/>' +
                            '</span>' +
                            '</div>' +
                            '<div>'
                        if (this.Options !== null) {
                            var dvTranOpt = '';
                            var dvTranChck = '<!-- Checkboxes for trasnsport options -->' +
                                '<p class="ptranspCheck" id="pCheckBox' + this.No + '">'
                            var ctyNo = this.No
                            var transpOpt = this.Options;
                            var selfCss = 'ptranspSelAct';
                            var optCS = 1
                            dvCities = dvCities + '<!-- Transport options -->'
                            if (transpOpt.Ranking === undefined) {
                                $.each(transpOpt, function () {
                                    if (this.Ranking === 1) {
                                        dvCities = dvCities + '<input name="xFIELDCityS" type="hidden" id="xFIELDCityS" value="' + this.ProductFreeField1 + '"/>'
                                        dvCities = dvCities + '<input name="xTRANSCityS" type="hidden" id="xTRANSCityS" value="' + this.ProductType + '"/>'
                                        dvCities = dvCities + '<input type="hidden" id="xOVNCityS" name="xOVNCityS" value="' + this.Overnight + '"/>'
                                        dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
                                        dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                            '<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
                                            '<span><b>' + this.ProductTypeName + '</b>'
                                        this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
                                        dvTranOpt = dvTranOpt + '</span>' +
                                            '<span>' +
                                            '<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                            '</span>' +
                                            '</p>'
                                        selfCss = 'ptranspSelNoAct'
                                    }
                                    else {
                                        dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
                                        dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                            '<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
                                            '<span> <b>' + this.ProductTypeName + '</b>'
                                        this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to $$' + infocityS[1] : '';
                                        dvTranOpt = dvTranOpt + '</span>' +
                                            '<span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                            '</span>' +
                                            '</p>'
                                        optCS++
                                    };
                                    if (this.ProductType === 'C') {
                                        var spDisplay = 'style="display:none"'
                                        this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
                                        dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
                                            '<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
                                            '<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
                                            '<span>Pick-up</span>' +
                                            '<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '" class="select-css">' +
                                            '<option value="A">Airport</option>' +
                                            '</select>' +
                                            '<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '" class="select-css">' +
                                            '<option value="F">First Day</option>' +
                                            '<option value="L">Last Day</option>' +
                                            '</select>' +
                                            '<br style="clear:both;">' +
                                            '</p>' +
                                            '<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
                                            '<span>Drop-off</span>' +
                                            '<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '" class="select-css">' +
                                            '<option value="A">Airport</option>' +
                                            '</select>' +
                                            '<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '" class="select-css">' +
                                            '<option value="L">Last Day</option>' +
                                            '<option value="F">First Day</option>' +
                                            '</select>' +
                                            '<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity select-css" data-city="' + ctyNo + '">';
                                        if (this.CarDropOff.DOCity.DOPlaceNo !== undefined) {
                                            dvTranOpt = dvTranOpt + '<option value="' + this.CarDropOff.DOCity.DOPlaceNo + '">' + decodeURIComponent(this.CarDropOff.DOCity.DOPlaceNo) + '. ' + decodeURIComponent(this.CarDropOff.DOCity.DOPlaceName) + '</option>'
                                        }
                                        else {
                                            var carOpt = this.CarDropOff.DOCity;
                                            $.each(carOpt, function () {
                                                dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
                                            });
                                        };
                                        dvTranOpt = dvTranOpt + '</select>' +
                                            '<br style="clear:both;">' +
                                            '</p>' +
                                            '</span>'
                                    };
                                });
                            }
                            else {
                                if (transpOpt.Ranking === 1) {
                                    dvCities = dvCities + '<input name="xFIELDCityS" type="hidden" id="xFIELDCityS" value="' + transpOpt.ProductFreeField1 + '"/>'
                                    dvCities = dvCities + '<input name="xTRANSCityS" type="hidden" id="xTRANSCityS" value="' + transpOpt.ProductType + '"/>'
                                    dvCities = dvCities + '<input type="hidden" id="xOVNCityS" name="xOVNCityS" value="' + transpOpt.Overnight + '"/>'
                                    dvTranChck = dvTranChck + '<input data-type="' + transpOpt.ProductType + '" data-field="' + transpOpt.ProductFreeField1 + '" data-ovrnts="' + transpOpt.Overnight + '" data-rank="' + transpOpt.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + transpOpt.ProductTypeName + '&nbsp;&nbsp;</span>'
                                    dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                        '<p id="pTranspSel' + ctyNo + '-' + transpOpt.Ranking + '" class="' + selfCss + '">' +
                                        '<span><b>' + transpOpt.ProductTypeName + '</b>'
                                    transpOpt.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : ''; 
                                    dvTranOpt = dvTranOpt + '</span>' +
                                        '<span>' +
                                        '<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                        '</span> <br style="clear:both">' +
                                        '</p>'
                                    selfCss = 'ptranspSelNoAct'
                                }
                                if (transpOpt.ProductType === 'C') {
                                    var spDisplay = 'style="display:none"'
                                    transpOpt.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
                                    dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
                                        '<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
                                        '<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
                                        '<span>Pick-up</span>' +
                                        '<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '" class="select-css">' +
                                        '<option value="A">Airport</option>' +
                                        '</select>' +
                                        '<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '" class="select-css">' +
                                        '<option value="F">First Day</option>' +
                                        '<option value="L">Last Day</option>' +
                                        '</select>' +
                                        '<br style="clear:both;">' +
                                        '</p>' +
                                        '<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
                                        '<span>Drop-off</span>' +
                                        '<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '" class="select-css">' +
                                        '<option value="A">Airport</option>' +
                                        '</select>' +
                                        '<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '" class="select-css">' +
                                        '<option value="L">Last Day</option>' +
                                        '<option value="F">First Day</option>' +
                                        '</select>' +
                                        '<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity select-css" data-city="' + ctyNo + '" >';
                                    if (transpOpt.CarDropOff.DOCity.DOPlaceNo !== undefined) {
                                        dvTranOpt = dvTranOpt + '<option value="' + transpOpt.CarDropOff.DOCity.DOPlaceNo + '">' + transpOpt.CarDropOff.DOCity.DOPlaceNo + '. ' + decodeURIComponent(transpOpt.CarDropOff.DOCity.DOPlaceName) + '</option>'
                                    }
                                    else {
                                        var carOpt = transpOpt.CarDropOff.DOCity;
                                        $.each(carOpt, function () {
                                            dvTranOpt = dvTranOpt + '<option value="' + transpOpt.DOPlaceNo + '">' + transpOpt.DOPlaceNo + '. ' + decodeURIComponent(transpOpt.DOPlaceName) + '</option>'
                                        });
                                    };
                                    dvTranOpt = dvTranOpt + '</select>' +
                                        '<br style="clear:both;">' +
                                        '</p>' +
                                        '</span>'
                                };
                                optCS = 1
                            };
                            dvTranOpt = dvTranOpt + '<p id="pTranspSel' + ctyNo + '-' + Number(optCS + 1) + '" class="ptranspSelNoAct"><span><b>On your own</b> to ' + nxtCity + '</span><span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button"></span> <br style="clear:both"></p>'
                            dvTranChck = dvTranChck + '<input data-type="W" data-field="OWN" data-ovrnts="0" data-rank="' + Number(optCS + 1) + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'
                            dvCities = dvCities + dvTranChck + '</p>' + dvTranOpt
                        }; // if option != undefined
                        dvCities = dvCities + '</div><br style="clear:both;"></div>'
                    };
                    if (this.No === 'E') {
                        var lst = Number(jscity.length - 1)
                        var infocityE = jscity[lst].split('@');
                        dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvtranspCityList">' +
                            '<!-- City Name / E /-->' +
                            '<div><span><font size="3">&raquo;</font> Must depart from <b>' + this.PlaceName + '</b> </span>' +
                            '<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
                            '<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + this.PlaceName + '"/>' +
                            '<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
                            '<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocityE[3].trim() + '"/>' +
                            '<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + decodeURIComponent(infocityE[4]).trim() + '"/>' +
                            '<input type="hidden" id="xSTCity' + this.No + '" name="xSTCity' + this.No + '" value="0"/>' +
                            '<input type="hidden" id="xOVNCity' + this.No + '" name="xOVNCity' + this.No + '" value="0"/>' +
                            '</div>' +
                            '<!-- Date / Edit-Remove -->' +
                            '<div>' +
                            '<span></span>' +
                            '</div>' +
                            '<!-- Staying for -->' +
                            '<div> <span>' +
                            '</span>' +
                            '</div><br style="clear:both;"></div>'
                    };
                }
                else {
                    var infocity = jscity[Number(this.No - 1)].split('@');
                    dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvtranspCityList">' +
                        '<!-- City Name / ' + this.No + ' /-->' +
                        '<div><span>' + this.No + '. <b>' + decodeURIComponent(this.PlaceName) + '</b></span>' +
                        '<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
                        '<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + decodeURIComponent(this.PlaceName) + '"/>' +
                        '<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
                        '<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocity[3].trim() + '"/>' +
                        '<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + decodeURIComponent(infocity[4]).trim() + '"/>' +
                        '</div>' +
                        '<!-- Date / Edit-Remove -->' +
                        '<div>' +
                        '<span>'
                    if (this.No === '1') {
                        dvCities = dvCities + '<b>' + $('#qArrDate').val() + '</b>'
                    } else {
                        dvCities = dvCities + '<span class="sptranspRemoveCity goToStartAgain">Edit/Remove</span>'
                    }
                    dvCities = dvCities + '</span>' +
                        '</div>' +
                        '<!-- Staying for -->' +
                        '<div> <span>' +
                        '<select name="xSTCity' + this.No + '" id="xSTCity' + this.No + '" class="select-css select-css-stayT">';
                    for (i = 1; i <= 14; i++) {
                        if (i == infocity[5]) { dvCities = dvCities + '<option value="' + i + '" selected>' + i + ' nights</option>'; }
                        else { dvCities = dvCities + '<option value="' + i + '">' + i + ' nights</option>'; }
                    };
                    dvCities = dvCities + '</select>' +
                        '</span>' +
                        '</div>' +
                        '<div>'
                    var selfCss = 'ptranspSelAct';
                    var optC = 1
                    if (this.Options !== null) {
                        var ctyNo = this.No
                        var dvTranOpt = '';
                        var dvTranChck = '<!-- Checkboxes for trasnsport options -->' +
                            '<p class="ptranspCheck" id="pCheckBox' + this.No + '">'
                        var transOpt = this.Options;
                        if (this.Options[0].Ranking !== undefined) {

                            $.each(transOpt, function () {
                                if (this.Ranking === 1) {

                                    dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="' + this.ProductFreeField1 + '"/>'
                                    dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="' + this.ProductType + '"/>'
                                    dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="' + this.Overnight + '"/>'
                                    dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
                                    dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                        '<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
                                        '<span><b>' + this.ProductTypeName + '</b>'
                                    this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
                                    dvTranOpt = dvTranOpt + '</span>' +
                                        '<span>' +
                                        '<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                        '</span> <br style="clear:both">' +
                                        '</p>'
                                    selfCss = 'ptranspSelNoAct'
                                }
                                else {
                                    dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
                                    dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                        '<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
                                        '<span> <b>' + this.ProductTypeName + '</b>'
                                    this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
                                    dvTranOpt = dvTranOpt + '</span>' +
                                        '<span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                        '</span> <br style="clear:both">' +
                                        '</p>'
                                    optC++;
                                };

                                if (this.ProductType === 'C') {
                                    var spDisplay = 'style="display:none"'
                                    this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
                                    dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
                                        '<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
                                        '<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
                                        '<span>Pick-up</span>' +
                                        '<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '" class="select-css">' +
                                        '<option value="A">Airport</option>' +
                                        '</select>' +
                                        '<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '" class="select-css">' +
                                        '<option value="F">First Day</option>' +
                                        '<option value="L">Last Day</option>' +
                                        '</select>' +
                                        '<br style="clear:both;">' +
                                        '</p>' +
                                        '<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
                                        '<span>Drop-off</span>' +
                                        '<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '" class="select-css">' +
                                        '<option value="A">Airport</option>' +
                                        '</select>' +
                                        '<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '" class="select-css">' +
                                        '<option value="L">Last Day</option>' +
                                        '<option value="F">First Day</option>' +
                                        '</select>' +
                                        '<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity select-css" data-city="' + ctyNo + '">';
                                    if (this.CarDropOff !== null) {
                                        var carOpt = this.CarDropOff.DOCity;
                                        $.each(carOpt, function () {
                                            if (this.Ranking === 1) { DropOffEndCity = this.DOPlaceNo; DropOffStartCity = ctyNo; }
                                            dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
                                        });
                                    }
                                    else {
                                        var carOpt = this.CarDropOff.DOCity;
                                        if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
                                        $.each(carOpt, function () {
                                            dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName.replace(/\+/g, ' ')) + '</option>';
                                        });
                                    };
                                    dvTranOpt = dvTranOpt + '</select>' +
                                        '<br style="clear:both;">' +
                                        '</p>' +
                                        '</span>'
                                };
                            });


                            dvTranOpt = dvTranOpt + '<p id="pTranspSel' + ctyNo + '-' + Number(optC + 1) + '" class="ptranspSelNoAct"><span><b>On your own</b> to ' + nxtCity + '</span><span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button"></span> <br style="clear:both"></p>'

                            dvTranChck = dvTranChck + '<input data-type="W" data-field="OWN" data-ovrnts="0" data-rank="' + Number(optC + 1) + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'

                            dvCities = dvCities + dvTranChck + '</p>' + dvTranOpt
                        }
                        else {
                            optC = 1;
                            var transpOpt = this.Options;
                            var dvTranOpt = '';
                            var dvTranChck = '<!-- Checkboxes for trasnsport options -->' +
                                '<p class="ptranspCheck" id="pCheckBox' + ctyNo + '">'
                            var selfCss = 'ptranspSelAct';
                            $.each(transpOpt, function () {
                                var actClass = '';
                                var prodFiels = '';
                                var tranCty = '';
                                var ovntCty = '';
                                if (this.Ranking === 1) {
                                    dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="' + this.ProductFreeField1 + '"/>'
                                    dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="' + this.ProductType + '"/>'
                                    dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="' + this.Overnight + '"/>'
                                    dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" checked type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
                                    dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                        '<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
                                        '<span><b>' + this.ProductTypeName + '</b>'
                                    this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
                                    dvTranOpt = dvTranOpt + '</span>' +
                                        '<span>' +
                                        '<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                        '</span> <br style="clear:both">' +
                                        '</p>'
                                    selfCss = 'ptranspSelNoAct';
                                }
                                else {

                                    dvTranChck = dvTranChck + '<input data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '" data-rank="' + this.Ranking + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>' + this.ProductTypeName + '&nbsp;&nbsp;</span>'
                                    dvTranOpt = dvTranOpt + '<!-- Trasport option selected label -->' +
                                        '<p id="pTranspSel' + ctyNo + '-' + this.Ranking + '" class="' + selfCss + '">' +
                                        '<span> <b>' + this.ProductTypeName + '</b>'
                                    this.ProductType != 'C' ? dvTranOpt = dvTranOpt + ' to ' + nxtCity : '';
                                    dvTranOpt = dvTranOpt + '</span>' +
                                        '<span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                        '</span> <br style="clear:both">' +
                                        '</p>'
                                    optC++;
                                };
                                if (this.ProductType === 'C') {
                                    var spDisplay = 'style="display:none"'
                                    this.Ranking === 1 ? spDisplay = 'style="display:block"' : '';
                                    dvTranOpt = dvTranOpt + '<!-- CAR options / parameters -->' +
                                        '<span class="dvCarOpt" id="carOptions' + ctyNo + '" ' + spDisplay + '>' +
                                        '<p class="dvCarUpOff" id="pickup' + ctyNo + '">' +
                                        '<span>Pick-up</span>' +
                                        '<select name="xpickupPlaceCity' + ctyNo + '" id="xpickupPlaceCity' + ctyNo + '" class="select-css">' +
                                        '<option value="A">Airport</option>' +
                                        '</select>' +
                                        '<select name="xpickupDayCity' + ctyNo + '" id="xpickupDayCity' + ctyNo + '" class="select-css">' +
                                        '<option value="F">First Day</option>' +
                                        '<option value="L">Last Day</option>' +
                                        '</select>' +
                                        '<br style="clear:both;">' +
                                        '</p>' +
                                        '<p class="dvCarUpOff" id="trdropOff' + ctyNo + '">' +
                                        '<span>Drop-off</span>' +
                                        '<select name="xdropoffPlaceCity' + ctyNo + '" id="xdropoffPlaceCity' + ctyNo + '" class="select-css">' +
                                        '<option value="A">Airport</option>' +
                                        '</select>' +
                                        '<select name="xdropoffDayCity' + ctyNo + '" id="xdropoffDayCity' + ctyNo + '" class="select-css">' +
                                        '<option value="L">Last Day</option>' +
                                        '<option value="F">First Day</option>' +
                                        '</select>' +
                                        '<select name="xdropoffCity' + ctyNo + '" id="xdropoffCity' + ctyNo + '" class="selectDropOffCity select-css" data-city="' + ctyNo + '">';
                                    if (this.CarDropOff.DOCity.DOPlaceNo !== undefined) {
                                        dvTranOpt = dvTranOpt + '<option value="' + this.CarDropOff.DOCity.DOPlaceNo + '">' + this.CarDropOff.DOCity.DOPlaceNo + '. ' + decodeURIComponent(this.CarDropOff.DOCity.DOPlaceName.replace(/\+/g, ' ')) + '</option>'
                                        if (this.Ranking === 1) { DropOffEndCity = this.CarDropOff.DOCity.DOPlaceNo; DropOffStartCity = ctyNo; }
                                    }
                                    else {
                                        var carOpt = this.CarDropOff.DOCity;
                                        if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
                                        $.each(carOpt, function () {
                                            dvTranOpt = dvTranOpt + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceNo + '. ' + decodeURIComponent(this.DOPlaceName) + '</option>'
                                        });
                                    };
                                    dvTranOpt = dvTranOpt + '</select>' +
                                        '<br style="clear:both;">' +
                                        '</p>' +
                                        '</span>'
                                };

                            });
                            dvTranOpt = dvTranOpt + '<p id="pTranspSel' + ctyNo + '-' + Number(optC + 1) + '" class="ptranspSelNoAct"><span><b>On your own</b> to ' + nxtCity + '</span><span><input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button"></span> <br style="clear:both"></p>'
                            dvTranChck = dvTranChck + '<input data-type="W" data-field="OWN" data-ovrnts="0" data-rank="' + Number(optC + 1) + '" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'
                            dvCities = dvCities + dvTranChck + '</p>' + dvTranOpt

                        }; //if (this.Options.Option.Ranking !== undefined)				

                    } //if(this.Options !== undefined
                    else {
                        if (this.No < totCtys && nxtCity != '') {

                            var ctyNo = this.No
                            var selfCss = 'ptranspSelAct'
                            var dvTranChck = '<!-- Checkboxes for trasnsport options -->'
                            dvTranChck = dvTranChck + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="OWN"/>'
                            dvTranChck = dvTranChck + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="W"/>'
                            dvTranChck = dvTranChck + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="0"/>' +
                                '<p class="ptranspCheck" id="pCheckBox' + ctyNo + '">' +
                                '<input data-type="OWN" data-field="W" data-ovrnts="0" data-rank="1" id="xradioTrans' + ctyNo + '" name="xradioTrans' + ctyNo + '" class="checkBox" value="' + ctyNo + '" type="radio"><span>On your own</span>'

                            var dvTranOpt = '<!-- Trasport option selected label -->' +
                                '<p id="pTranspSel' + ctyNo + '-1" class="' + selfCss + '">' +
                                '<span><b>On your own</b> to ' + nxtCity +
                                '</span>' +
                                '<span>' +
                                '<input class="buttontranspChange" value="change" id="' + ctyNo + '" type="button">' +
                                '</span> <br style="clear:both">' +
                                '</p>'

                            dvCities = dvCities + dvTranChck + dvTranOpt
                        }
                    }

                    dvCities = dvCities + '</div>'
                    dvCities = dvCities + '<br style="clear:both"/>'
                    dvCities = dvCities + '</div>'
                }; //(isNaN(Number(this.No)) === true)
            });
        } // data city
        $('#dvWaitGlobe').html('').hide();
        $('.dvtranspMainContainer').show();
        $('#dvTranspError').hide();
        $(dvCities).insertAfter('.dvtranspLabels');
        $('.buttontranspChange').click(function () { changeTranspOption(this) });
        $('.selectDropOffCity').change(function () { carSelected($(this).data('city')); });
        $('.checkBox').click(function () { modifyTransportation(this, this.value); });
        $('.goToStartAgain').click(function () { startAgain(this); });
        dvCities = '';
        checkIfCarIsFirst();
    }
    catch (err) {
        buildTransportationError(err.message);
    }
}
function buildTransportationError(err) {
    $('.goToStartAgain').click(function () { startAgain(this) });
    var cookieValues = JSON.parse(Cookies.get('backCookieTMED'));
    var cokC = 0;
    var cokL = Object.keys(cookieValues).length
    var cokR;
    var ctys = '';
    jQuery.each(cookieValues, function (i, e) {
        /qNACity/.test(i) === true ? ctys = ctys + "<li>" + e + "</li>" : '';
        cokC += 1;
        cokC === cokL ? (Cookies.set('backCookieTMED', '', { expires: -1 }), $('#sptrancities').html(ctys), $('#perrorCode').html(err), $('.dvWaitGlobe').hide(), $('.dvtranspMainContainer').hide(), $('#dvTranspError').show()) : ''
    });
};
function checkIfCarIsFirst() {
    $('.checkBox').each(function () {
        $(this).data('rank') === 1 ? $(this).data('type') === 'C' ? $(this).is(":checked") ? carSelected(this.id.match(isNumber)) : '' : '' : '';
    });
};
function cookieCheck() {
    selectRoomPax('1|2');
    backCookie = Cookies.get('backCookieTMED');
    backCookie !== undefined ? (haveCook = 1, buildFromCook(1), doitArr()) : (haveCook = 0, dateByDest(), doitArr());
}
function buildFromCook(build) {
    var cookieValues = JSON.parse(Cookies.get('backCookieTMED'));
    var cokC = 0;
    var cokL = Object.keys(cookieValues).length;
    var cokR;
    var ofset = $noMore.offset();
    if (build === 1) {
        $.each(cookieValues, function (i, e) {
            i === 'qWair' ? e === 'False' ? $('#spWout').trigger('click') : $('#spWair').trigger('click') : '';
            /qNACity/.test(i) === true ? (i.match(isNumber) > 1 ? $addCty.trigger('click') : '', $('#' + i + '').val(e)) : '';
            /qIDCity|qSTCity|qCOCity|qAPICity|qLeave|qArrDate/.test(i) === true ? $('#' + i + '').val(e) : '';
            /qgoingID/.test(i) === true ? ($('#' + i + '').val(e), cokR = e) : '';
            cokC += 1;
            cokC === cokL ? (Cookies.set('backCookieTMED', '', { expires: -1 }), dateByDest(cokR)) : '';
        });
    }
}
function selectRoomPax(ro) {
    var valP = ro.split('|');
    $('#xiRoom').val(valP[0]);
    $('#xRooms').val(valP[0]);
    /Other/.test(ro) === true ? (openRoom(valP[0], 1), $('#xiAdults').val(0)) : (openRoom(valP[0], 0), $('#xiAdults option[value="' + valP[1] + '"').attr('selected', 'selected'), otherCleanRoom());
};
function openRoom(rm, no) {
    no === 0 ? ($('.dvtranspAdultChild, #pPaxLabels').slideUp('fast')) : ($('.dvtranspAdultChild, #pPaxLabels').slideDown('fast'));
    $('p[id^="pRoom"]').each(function () {
        this.id.match(isNumber) <= rm ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRoom(this))
    });
};
function cleanRoom(obj) {
    $('#' + obj.id + ' select').each(function () {
        /_iAdults/.test(this.id) === true ? ($('#' + this.id + '').val(0)) : /iChildren/.test('#' + this.id + '') === true ? $(this).val(0) : /iChild/g.test(this.id) === true ? $('#' + this.id + '').val(-1) : '';
    });
};
function otherCleanRoom() {
    $('select[id*="iChild"]').each(function () {
        /iChildren/.test(this.id) === true ? $('#' + this.id + ' option[value="0"]').attr('selected', 'selected') : '';
        /iChild/g.test(this.id) === true ? $('#' + this.id + ' option[value="-1"]').attr('selected', 'selected') : '';
    });
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
function changeTranspOption(obj) {
    $('p[id^="pTranspSel' + obj.id + '"]').each(function () { this.className === "ptranspSelAct" ? $(this).attr('class', 'ptranspSelNoAct') : ''; });
    $('#pCheckBox' + obj.id + '').show();
}
function modifyTransportation(obj, q) {
    $('#xFIELDCity' + q + '').val($(obj).data('field'));
    $('#xTRANSCity' + q + '').val($(obj).data('type'));
    $('#xOVNCity' + q + '').val($(obj).data('ovrnts'));
    $('#pCheckBox' + q + '').hide();
    $('#pTranspSel' + q + '-' + $(obj).data('rank') + '').attr('class', 'ptranspSelAct');
    $(obj).data('type') === 'C' ? ($('#carOptions' + q + '').show(), carSelected(q)) : ($('#carOptions' + q + '').hide(), carNoSelected(q));
}
function carNoSelected(q) {
    var carTot = $('.dvtranspCityList').length;
    var carStr = q;
    carStr === 'S' ? (carStr = 1, carTot = Number(carTot) - 1) : carStr = Number(carStr) + 1;
    var carEnd = $('#xdropoffCity' + q + '').val();
    carEnd === 'E' ? ($('#cityToS').length === 1 ? (carEnd = $('.dvtranspCityList').length - 1, carTot = Number(carTot) - 1) : carEnd = carTot) : '';
    var isCar = 0;
    var i;
    for (i = carStr; i <= carTot; i++) {
        $('#xFIELDCity' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('field'));
        $('p[id^="pTranspSel' + i + '-1').attr('class', 'ptranspSelAct');
        $('#xFIELDCity' + i + '').val() === 'TBA' ? ($('#carOptions' + i + '').show(), i++) : '';
    };
};
function carSelected(q) {
    //console.log("carSelected");
    var carTot = $('.dvtranspCityList').length;
    var carStr = q;
    carStr === 'S' ? (carStr = 1, carTot = Number(carTot) - 1) : carStr = Number(carStr) + 1;
    var carEnd = $('#xdropoffCity' + q + '').val();
    carEnd === 'E' ? ($('#cityToS').length === 1 ? (carEnd = $('.dvtranspCityList').length - 1, carTot = Number(carTot) - 1) : carEnd = carTot) : '';
    var isCar = 0;
    var i;
    for (i = carStr; i <= carTot; i++) {
        i < carEnd ? (
            $('#xFIELDCity' + i + '').val(''),
            $('p[id^="pTranspSel' + i + '').attr('class', 'ptranspSelNoAct'),
            $('#carOptions' + i + '').is(':visible') === true ? $($('#carOptions' + i + '').hide()) : ''
        ) : '';
        i >= carEnd ? (
            $('#xFIELDCity' + i + '').val($('#xradioTrans' + i + '[data-rank="1"]').data('field')),
            $('p[id^="pTranspSel' + i + '-1').attr('class', 'ptranspSelAct'),
            $('#xFIELDCity' + i + '').val() === 'TBA' ? ($('#carOptions' + i + '').show(), i++) : ''
        ) : '';
    }
}
function startAgain(obj) {
    var objTxt = obj.innerHTML;

    switch (true) {
        case /Without/.test(objTxt):
            $('#spWout').find('#qWair').trigger('click');
            break;
        case /With Air/.test(objTxt):
            $('#spWair').find('#qWair').trigger('click');
            break;
    }
    $('#myModal').slideUp();
    $('.dvTransportation').hide().removeAttr('style');
    $('.dvMask').hide().removeAttr('height');
    $('div.dvtranspCityList').remove();
    $('div.dvtranspCityList').remove();
    $('#dvTranspError').hide();
    $('.dvtranspByoCalTools').hide()
    $('.dvSpin').show();
}
function submitPrice() {
    //console.log("submitPrice");
    var paxT = countPax(1);
    if (!childValidAge()) {
        alert('Child age is empty');
        $('.btnContinue').click(function (event) { submitPrice(); $(this).off(event); });
        return false;
    }
    else {
        if (paxT > 6) {
            alert('Max guest allowed (adults + children) are 6 !');
            $('.btnContinue').click(function (event) { submitPrice(); $(this).off(event); });
            return false;
        }
        else if (paxT === false) {
            $('.btnContinue').click(function (event) { submitPrice(); $(this).off(event); });
            return false;
        }
        else {
            submitCompList();
        };
    };
};
function childValidAge() {
    var reTrue = true
    if ($('#pRoom1').is(':visible') === true) {
        $('#pRoom1 span[id^="pChildAges"]').find('select').each(function () {
            if ($(this).is(':visible') === true) {
                if ($(this).val() === '-1') { $(this).addClass('errorClass'); reTrue = false; };
            };
        });
        if ($('#pRoom2').is(':visible') === true) {
            $(' #pRoom2 span[id^="pChildAges"]').find('select').each(function () {
                if ($(this).is(':visible') === true) {
                    if ($(this).val() === '-1') { $(this).addClass('errorClass'); reTrue = false; };
                };
            });
            if ($('#pRoom3').is(':visible') === true) {
                $('#pRoom3 span[id^="pChildAges"]').find('select').each(function () {
                    if ($(this).is(':visible') === true) {
                        if ($(this).val() === '-1') { $(this).addClass('errorClass'); reTrue = false; };
                    };
                })
            };
        };
        return reTrue;
    } else { return reTrue; };
};
var getNumericPart = function (id) {
    var $num = id.replace(/[^\d]+/, '');
    return $num;
}
function submitCompList() {
    var CantContinue = false;
    $("#frmTransp div[id^='cityTo']").each(function () {
        if (!isNaN(parseInt(($(this).attr("id")).replace('cityTo', '')))) {
            var valIdCity = $(this).find("div input[id^='xIDCity']").val();
            var TrueNaCity = findNextCity(valIdCity);
            var valNaCity = $(this).find("div input[id^='xNACity']").val();

            if (TrueNaCity == '') {
                /* ID not finding in nextCity */
                $(this).find("div input[id^='xNACity']").val(TrueNaCity);
                startAgain(this);

                var valNoCity = $(this).attr("id");
                varIdCity = "qNACity" + getNumericPart(valNoCity);
                $("#formBYO input[id='" + varIdCity + "']").val("Select city or airport");
                $("#formBYO input[id='" + varIdCity.replace("NA", "ID") + "']").val(-1);

                CantContinue = true;
                return false;
            }
            else
                if (TrueNaCity != valNaCity) {
                    /* ID is ok, but NaCity is not */
                    $(this).find("div input[id^='xNACity']").val(TrueNaCity);
                }
        }
    });

    if (CantContinue === true) {
        $('.btnContinue').click(function (event) { submitPrice(); $(this).off(event); });
        byoValidation();
        return;
    }


    var jsonCompList;
    var queryString = $('#frmTransp').serialize();
    //console.log(queryString);
    var jsonQSTR = QueryStringToJSON(queryString);
    var formData = {};
    $('#frmTransp').serializeArray().forEach(function (item) {
        formData[item.name] = item.value;
    });
    var options = {};
    options.url = SiteName + "/Api/Packages/webservComponentList";
    options.type = "POST";
    options.contentType = "application/json";
    options.data = JSON.stringify(formData);
    options.dataType = "json";
    options.success = function (res) {
        //console.log("Api/Packages/webservComponentList: ");
        //console.log(res);
        jsonCompList = res;
        submitToBP(jsonQSTR, jsonCompList);
    };
    options.error = function (xhr, desc, exceptionobj) {
        console.log(xhr);
    };
    $.ajax(options);
};
function submitToBP(strQ, jsR) {
   // console.log("submitToBP strQ = ");
    //console.log(strQ);
    //console.log("submitToBP jsR = ");
    //console.log(jsR);
    var dvWaitBP = '<div style="background:white; width:95%; margin:0 auto"><img src="https://pictures.tripmasters.com/siteassets/m/SearchingAH.gif" style="width:100%; height:100%"/></div>'
    $('.dvMMask').append(dvWaitBP).show();
    var jsRprts = jsR.split('@|@');
    var $subForm = $('#formToBooking');
    var lastCy = 'xIDcity' + jsRprts[11];
    var iChld;
    var iChldC = 0;
    var iRmChld2;
    var iRmChld2C = 0;
    var iRmChld3;
    var iRmChld3C = 0;
    var iEnd = 0;
    var iCity = "";
    //console.log("strQ.xiChildren = " + strQ.xiChildren);
    if (jsRprts[1] === '1') {
        $subForm.find('input').each(function () {
            /SystemID/.test(this.id) ? this.value = jsRprts[2] : '';
            /PackageComponentList/.test(this.id) ? this.value = jsRprts[0] : '';
            /ByStayNite/.test(this.id) ? this.value = jsRprts[3] : '';
            /GetNextDay/.test(this.id) ? this.value = jsRprts[4] : '';
            /AirVendorAPI/.test(this.id) ? this.value = jsRprts[5] : '';
            /AirP2PVendorAPI/.test(this.id) ? this.value = jsRprts[6] : '';
            /CarVendorAPI/.test(this.id) ? this.value = jsRprts[7] : '';
            /SSVendorAPI/.test(this.id) ? this.value = jsRprts[8] : '';
            /TransferVendorAPI/.test(this.id) ? this.value = jsRprts[9] : '';
            /TICVendorAPI/.test(this.id) ? this.value = jsRprts[10] : '';
            bookingurl = jsRprts[12];
            /addFlight/.test(this.id) ? this.value = strQ.xaddFlight : '';
            /Cabin/.test(this.id) ? (this.value = strQ.xCabin) : '';
            /iDepCity|iRetCity/.test(this.id) ? this.value = strQ.xidLeavingFrom : '';
            /StayCityS/.test(this.id) ? (strQ.xNOCityS ? this.value = strQ.xIDCityS : this.value = strQ.xIDCity1) : ('');
            /StayCityS_Name/.test(this.id) ? strQ.xNOCityS ? this.value = decodeURIComponent(strQ.xNACityS) : this.value = decodeURIComponent(strQ.xNACity1) : '';
            /StayCityE/.test(this.id) ? (strQ.xNoCityE ? this.value = strQ.xIDcityE : this.value = strQ['xIDCity' + jsRprts[11]]) : ('');
            /StayCityE_Name/.test(this.id) ? (strQ.xNoCityE ? this.value = decodeURIComponent(strQ.xNAcityE) : this.value = decodeURIComponent(strQ['xNACity' + jsRprts[11]])) : ('');
            /Rooms/.test(this.id) ? (this.value = strQ.xRooms, $('#xRooms').val('1')) : '';
            /iRoom/.test(this.id) ? (this.value = strQ.xiRoom, $('#xiRooms').val('1')) : '';
            /iRoomsAndPax/.test(this.id) ? (this.value = decodeURIComponent(strQ.xiRoomsAndPax), $('#xcabinRoomPax').val('1 Room, 2 Travelers, Economy'), $('#xiRoomsAndPax').val('1|2')) : '';
            /iAdults/.test(this.id) ? !/Room/.test(this.id) ? (this.value = strQ.xiAdults, $('xiAdults').val('2')) : '' : '';
            /iChildren/.test(this.id) ? !/Room/.test(this.id) ? (this.value = strQ.xiChildren, $('xiChildren').val('')) : '' : '';
            /iChild1/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild1 ? (this.value = strQ.xiChild1, $('xiChild1').val('')) : '' : '' : '';
            /iChild2/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild2 ? (this.value = strQ.xiChild2, $('xiChild2').val('')) : '' : '' : '';
            /iChild3/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild3 ? (this.value = strQ.xiChild3, $('xiChild3').val('')) : '' : '' : '';
            /iChild4/.test(this.id) ? !/Room/.test(this.id) ? strQ.xiChild4 ? (this.value = strQ.xiChild4, $('xiChild4').val('')) : '' : '' : '';
            /Room2_iAdults/.test(this.id) ? strQ.xRoom2_iAdults ? (this.value = strQ.xRoom2_iAdults, $('xRoom2_iAdults').val('')) : this.value = '' : '';
            /Room2_iChildren/.test(this.id) ? strQ.xRoom2_iChildren ? (this.value = strQ.xRoom2_iChildren, $('xRoom2_iChildren').val('')) : this.value = '' : '';
            /Room2_iChild1/.test(this.id) ? strQ.xRoom2_iChild1 ? (this.value = strQ.xRoom2_iChild1, $('xRoom2_iChild1').val('')) : this.value = '' : '';
            /Room2_iChild2/.test(this.id) ? strQ.xRoom2_iChild2 ? (this.value = strQ.xRoom2_iChild2, $('xRoom2_iChild2').val('')) : this.value = '' : '';
            /Room2_iChild3/.test(this.id) ? strQ.xRoom2_iChild3 ? (this.value = strQ.xRoom2_iChild3, $('xRoom2_iChild3').val('')) : this.value = '' : '';
            /Room2_iChild4/.test(this.id) ? strQ.xRoom2_iChild4 ? (this.value = strQ.xRoom2_iChild4, $('xRoom2_iChild4').val('')) : this.value = '' : '';
            /Room3_iAdults/.test(this.id) ? strQ.xRoom3_iAdults ? (this.value = strQ.xRoom3_iAdults, $('xRoom3_iAdults').val('')) : this.value = '' : '';
            /Room3_iChildren/.test(this.id) ? strQ.xRoom3_iChildren ? (this.value = strQ.xRoom3_iChildren, $('xRoom3_iChildren').val('')) : this.value = '' : '';
            /Room3_iChild1/.test(this.id) ? strQ.xRoom3_iChild1 ? (this.value = strQ.xRoom3_iChild1, $('xRoom3_iChild1').val('')) : this.value = '' : '';
            /Room3_iChild2/.test(this.id) ? strQ.xRoom3_iChild2 ? (this.value = strQ.xRoom3_iChild2, $('xRoom3_iChild2').val('')) : this.value = '' : '';
            /Room3_iChild3/.test(this.id) ? strQ.xRoom3_iChild3 ? (this.value = strQ.xRoom3_iChild3, $('xRoom3_iChild3').val('')) : this.value = '' : '';
            /Room3_iChild4/.test(this.id) ? strQ.xRoom3_iChild4 ? (this.value = strQ.xRoom3_iChild4, $('xRoom3_iChild4').val('')) : this.value = '' : '';
        });
        var ovt;
        for (i = 1; i <= 12; i++) {
            if (strQ['xIDCity' + i]) {
                var jsNa = decodeURIComponent(strQ['xNACity' + i]);
                jsNa = decodeURIComponent(jsNa);
                ovt = 0
                iCity = iCity + '<input type="hidden" id="StayCity' + i + '" name="StayCity' + i + '" value="' + strQ['xIDCity' + i] + '"/>';
                iCity = iCity + '<input type="hidden" name="StayCity' + i + '_Name" id="StayCity' + i + '_Name" value="' + jsNa + '" />';
                i === 1 ? iCity = iCity + '<input type="hidden" name="InDate' + i + '" id="InDate' + i + '" value="' + decodeURIComponent(strQ.xtxtBYArriving) + '" />' : '';
                iCity = iCity + '<input type="hidden" name="APICity' + i + '" id="APICity' + i + '" value="' + decodeURIComponent(strQ['xAPICity' + i]) + '"/>';
                iCity = iCity + '<input type="hidden" name="StayNite' + i + '" id="StayNite' + i + '" value="' + strQ['xSTCity' + i] + '"/>';
                strQ['xOVNCity' + i] ? ovt = strQ['xOVNCity' + i] : '';
                iCity = iCity + '<input type="hidden" name="OverNiteT' + i + '" id="OverNiteT' + i + '" value="' + ovt + '"/>';
                $('#formToBooking').append(iCity);
                iCity = "";
            }
            else {
                i = 12;
            };
            i === 12 ? toBPGo() : '';
        };
    }
    else {
        alert('error');
    };
};
function toBPGo() {
    bpDep = $('#xgoingID').val();
    var queryString = $('#formToBooking').serialize();
    document.formToBooking.action = bookingurl;
    document.formToBooking.submit();
};
function QueryStringToJSON(str) {
    var pairs = str.split('&');
    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        var name = pair[0]
        var value = pair[1]
        if (name.length)
            if (result[name] !== undefined) {
                if (!result[name].push) {
                    result[name] = [result[name]];
                };
                result[name].push(value || '');
            } else {
                result[name] = value || '';
            };
    });
    return (result);
};
function countPax(vs) {
    var vis = vs;
    var pOp = -1;
    var a = [];
    var ch = [];
    var totAdult = 0;
    var totChild = 0;
    var roompax = $('#xiRoomsAndPax').val();
    var adpax = roompax.split('|');
    $('#pRoom1').is(':visible') === true ? (pOp = 0, a[0] = Number($('#xiAdults').val()), totAdult = a[0], ch[0] = Number($('#xiChildren').val()), totChild = ch[0]) : (/Other/.test(roompax) === false ? a[0] = Number($('#xiAdults').val(), totAdult = a[0]) : '');
    $('#pRoom2').is(':visible') === true ? (pOp = 1, a[1] = Number($('#xRoom2_iAdults').val()), totAdult = a[0] + a[1], ch[1] = Number($('#xRoom2_iChildren').val()), totChild = ch[0] + ch[1]) : '';
    $('#pRoom3').is(':visible') === true ? (pOp = 2, a[2] = Number($('#xRoom3_iAdults').val()), totAdult = a[0] + a[1] + a[2], ch[2] = Number($('#xRoom3_iChildren').val()), totChild = ch[0] + ch[1] + ch[2]) : '';
    if (totAdult === 0 && vis === 1) {
        alert('No adults on rooms !');
        if (a[0] === 0) { $('#xiAdults').addClass('errorClass'); };
        if (a[1] === 0) { $('#xRoom2_iAdults').addClass('errorClass') };
        if (a[2] === 0) { $('#xRoom3_iAdults').addClass('errorClass'); };
        return false;
    }
    else if (totAdult > 0 && vis === 1) {
        for (i = 0; i <= pOp; i++) {
            if (i === 0) { $ithis = $('#xiAdults'); } else { $ithis = $('#xRoom' + Number(i + 1) + '_iAdults'); }
            if (a[i] === 0) { alert('No adults in room ' + Number(i + 1) + '!'); $ithis.addClass('errorClass'); return false; }
            else { if ((totAdult + totChild) > 6) { alert('Max guest allowed (adults + children) are 6 !'); return false; } }
        }
    }
    else {
        if ((totAdult + totChild) <= 6 && $('p[id^="pRoom"]').find('.errorClass').length > 0) {
            $('p[id^="pRoom"]').find('.errorClass').removeClass('errorClass');
            $('select[id*="iChildren"]').each(function () { this.value > 0 ? childAge(this) : ''; });
        }
        return totAdult + totChild;
    }
}
function findNextCity(id) {
    var NAcity = '';
    var nextCity = [];
    nextCity = jsonDataArr;
    nextCity = $.grep(nextCity, function (nxt) { return (nxt.ctyID == id); });
    jQuery.each(nextCity, function (nextCity) {
        NAcity = this.ctyNA;
    });
    return NAcity;
};
function errorAlert(obj, mess) {
    var poss = $('#' + obj + '').position();
    $('#' + obj + '').addClass('errorClass').val(mess);
    return false;
};

function childAge(tag) {
    var rnum;
    tag.id.match(isNumber) === null ? rnum = 1 : rnum = tag.id.match(isNumber);
    var oval = tag.value;
    $('#' + tag.id + '').removeClass('errorClass');
    var totpax = countPax(0);
    if (totpax > 6) {
        alert('Max guest allowed (adults + children) are 6 !');
        $('#' + tag.id + '').addClass('errorClass');
    }
    else {
        $('#pChildAges').show();
        $('#pChildAges' + rnum + '').show().find('select').each(function () { this.id.slice(-1).match(isNumber) <= Number(oval) ? ($(this).show(), $('label[for="' + this.id + '"]').show()) : ($(this).hide().val(-1), $('label[for="' + this.id + '"]').hide('fast', function () { countChilds() <= 0 ? $('#pChildAges').hide() : '' })) });
    };
};
function countChilds() {
    var ch1 = 0; var ch2 = 0; var ch3 = 0;
    $('#pRoom1').is(':visible') === true ? (ch1 = Number($('#xiChildren').val())) : '';
    $('#pRoom2').is(':visible') === true ? (ch2 = Number($('#xRoom2_iChildren').val())) : '';
    $('#pRoom3').is(':visible') === true ? (ch3 = Number($('#xRoom3_iChildren').val())) : '';
    var totChild = ch1 + ch2 + ch3;
    return totChild;
};
function changeAdults(obj) {
    $('#' + obj.id + '').removeClass('errorClass');
    var totpax = countPax(0);
    if (totpax > 6) {
        alert('Max guest allowed (adults + children) are 6 !');
        $('#' + obj.id + '').addClass('errorClass');
    }
};
