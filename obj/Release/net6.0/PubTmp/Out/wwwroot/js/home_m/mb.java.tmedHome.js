var depCities = [];
var arrivalCities = [];
var today = new Date();
var isNumber = /[0-9]+/g;
var visitId;
var childAge = [];
var totalPax = 0;
var haveCook = 0;
for (c = 2; c <= 11; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childAge.push(chilObj);
}
$(document).ready(function () {
    console.log(Cookies.get('ut2'));
    if (Cookies.get('ut2') == undefined) {

    }
    else    {
        console.log(Cookies.get('ut2'));
        var utParts = $(Cookies.get('ut2').split('&'));
        var utVisitId = utParts[0].split('=');
        visitId = utVisitId[1];
    }
    $('.pdepcode, .pdepcity').click(function () { updatedepairport(this); });
    $('.parrcode, .parrcity').click(function () { updatearrcity(this); });
    $('.pMaddcity').click(function () { addnewcity(this); });
    $('.btnClose').click(function () { deletecity(Number(this.id.match(isNumber))); });
    $('#xcabinRoomPax').click(function () { showdialog(); });
    $('#dvpaxRoom').click(function () { openPaxRoomlist(); });
    $('#dvpxroomlst li').click(function () { roomTravelers(this); });
    $('.dvMDialogDone').click(function () { hidedialog(); });
    $('.btnMcont').click(function () { submitCompList(); });
    $('span[id^="adultPlus"]').click(function () { $('input[id^="xRoom' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultPlus(this) });
    $('span[id^="adultMinus"]').click(function () { $('input[id^="xRoom' + Number(this.id.match(isNumber)) + '_"').removeClass('errorClass'), adultMinus(this) });
    $('span[id^="childrenPlus"]').click(function () { childPlus(this) });
    $('span[id^="childrenMinus"]').click(function () { childMinus(this) });
    $('#xiAdults, input[id^="xRoom"], select[id^="xRoom"], select[id^=xiChild]').click(function () { $(this).removeClass('errorClass') });

    //Recently Viewed
    $('#dvMvisitContainer').on('show.bs.collapse', function () {
        getRecentlyView();
    });

    doAjaxOnReady();
    $('#dvTrasOptModal').on('shown.bs.modal', function () {
        callTransportation();
        var result = callTransportation();
        if (result === false) {
            $('#dvTrasOptModal').modal('hide');
        }
    });
    $('.aBtnTab').on('click', function () {
        if ($(this).hasClass('aBtnTab') === true) {
            $(this).removeClass('.aBtnTab').addClass('aBtnTabOpen');
        } else {
            $(this).removeClass('.aBtnTabOpen').addClass('aBtnTab');
        }

    });
    datePicker();

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
        if ($(this).val() === '0' || $(this).val() === '1') {
            errorAlert(this.id, "No valid age");
        };
    });
});
//Get Recently Viewed packages
function getRecentlyView() {
    var options = {};
    options.url = SiteName + "/Api/RecentlyViewed";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify({ Id: visitId });
    options.dataType = "json";
    options.success = function (data) {
        console.log(data)
        data != undefined ? buildRecentlyViewed(data) : '';
    };
    options.error = function (xhr, desc, exceptionobj) {
        console.log(xhr);
    };
    $.ajax(options);
}
Date.timeBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    var passTime;
    days > 0 ? (days === 1 ? passTime = days + ' day ago' : passTime = days + ' days ago') : hours > 0 ? (hours === 1 ? passTime = hours + ' hour ago' : passTime = hours + ' hours ago') : minutes > 0 ? (minutes === 1 ? passTime = minutes + ' minute ago' : passTime = minutes + ' minutes ago') : (passTime = '  just visited');
    return passTime;
};
function buildRecentlyViewed(obj) {
    var objC = 0;
    var siteURL;
    var newVisit = "<div class='row w-100 mx-auto border-bottom'>";
    $.each(obj, function () {
        objC++;
        if (objC < 6) {
            switch (this.UTS_Site) {
                case 'ED':
                    siteURL = location.protocol + "//www.europeandestinations.com";
                    break;
                case 'TMED':
                    siteURL = location.protocol + "//www.tripmasters.com/europe";
                    break;
                case 'TMASIA':
                    siteURL = location.protocol + "//www.tripmasters.com/asia";
                    break;
                case 'TMLD':
                    siteURL = location.protocol + "//www.tripmasters.com/latin";
                    break;
            }
            var jsdate = new Date(parseInt(this.UTS_Date.substring(6)));
            var today = new Date();
            var lastVst = Date.timeBetween(jsdate, today);
            newVisit = newVisit + "<div class='col-6 pt-2 pb-2 pl-2 pr-2'><a href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/ /g, '_').toLowerCase() + "/" + this.PDL_Title.replace(/ /g, '_').toLowerCase() + "/package-" + this.PDLID + "' class='font12'>" +
                "<img class='img-fluid' src='https://pictures.tripmasters.com" + this.IMG_Path_URL.toLowerCase() +
                "' title='" + this.PDL_Title + "'/></a><div class='row' style='height:130px;padding-left: 17px;padding-right: 10px'><a style='height:80px' href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/ /g, '_') + "/" + this.PDL_Title.replace(/ /g, '_') + "/package-" + this.PDLID +
                "'>" + this.PDL_Title + "</a><span class='d-block font12'>Viewed " + lastVst + "</span>";
                if (this.feedbacks > 0) {
                    newVisit = newVisit + "<div class='col pl-0 pr-0'><a href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/%20|\s/g, '_').toLowerCase() + "/" + this.PDL_Title.replace(/ /g, '_').toLowerCase() + "/feedback-" + this.PDLID + "' class='font12'>" + this.feedbacks + " Customer Reviews " +
                        "<img src='https://pictures.tripmasters.com/siteassets/d/IMG-Feed.jpg' border='0' align='absmiddle'/></a>" +
                        "</div>";
                }
                newVisit = newVisit + "</div>";
                newVisit = newVisit + "<div class='col pl-0 pr-0 font12 pt-2 text-center mx-auto'><a role='button' href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/ /g, '_') + "/" + this.PDL_Title.replace(/ /g, '_') + "/package-" + this.PDLID + "' class='btn btn-warning'>View It</a></div></div>";
            
        }
    });
    newVisit = newVisit + "</div>";
    $('.dvMvisit').append(newVisit);
}

// -- Calendar DatePicker
function datePicker(dest) {
    var strDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    var yearRange = '"' + today.getFullYear() + ":" + Number(today.getFullYear() + 1) + '"';
    $('#qArrDate').datepicker({
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
    }).click(function () { $(this).removeClass('border-warning'); });
}
// -- call transportation options
function callTransportation() {
    $('.btnMcont').attr("disabled", true);
    switch (true) {
        case $('#qLeaveID').val() === '-1':
            //alert('select a valid US City Airport');
            $('#qLeaveNA').addClass('border-warning');
            return false;
        case $('#qArrDate').val() === 'mm/dd/yyyy':
            //alert('select a valid Arrival Date');
            $('#qArrDate').addClass('border-warning');
            return false;
        case $('input[id^="qIDCity"]').length > 0:
            var iTot = $('input[id^="qIDCity"]').length
            for (i = 1; i <= iTot; i++) {
                if ($('#qIDCity' + i + '').val() === '-1' && $('#qNACity' + i + '').val() == 'City name') {
                    //alert('select a valid City');
                    $('#qNACity' + i + '').addClass('border-danger');
                    return false;
                } else if ($('#qIDCity' + i + '').val() === '-1') {
                    errorAlert('qNACity' + i, $('#qNACity' + i + '').val());
                    return false;
                }
            }
    }
    //$('#dvMheader, #dvMfooter, .dvMbHomeContainer').hide('slide', { direction: 'left' }, 'slow');
    //window.scrollTo(0, 0);
    //$('.dvMNext').delay('slow').show('slide', { direction: 'right' }, 'slow');

    var stringQuery = '';
    stringQuery = $('#frmMobBYO').serializeObject();
    Cookies.set('backCookMhome', stringQuery, { expires: 1 });
    console.log(Cookies.get('backCookMhome'));
    stringForm = $('#frmMobBYO').serialize();
    stringForm = stringForm.substr(0, stringForm.indexOf('&__RequestVerificationToken'));
    console.log(stringForm);   
    $.ajax({
        type: "POST",
        url: SiteName + "/api/Packages/webservTransportationOption",
        contentType: "application/json",
        data: JSON.stringify(stringForm),
        dataType: 'json',
        success: function (data) {
            cityData = data.Cities;
            console.log(cityData);
            buildTransportationFrom();
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = Error webservGetTransp');
        }
    });
}
function buildTransportationFrom() {
    console.log(Cookies.get('backCookMhome'));
    var cookSaved = JSON.parse(Cookies.get('backCookMhome'));
    $('.loader').hide();
    $('#dvTransportR').html('');
    var dvDepAir = '<div class="form-row col-12 dvMBYOfrom border-bottom border-primary mt-2 pl-0 pr-0">' +
        '<div class="form-group col-8">' +
        '<label class="mb-0">From</label>' +
        '<input type="text" id="xDepCode" class="pdepcode d-block form-control border-0 p-0 mt-2" readonly="readonly" value="' + cookSaved.qLeaveCO + '" />' +
        '<input type="hidden" id=xLeaveCO" name="xLeaveCO" value="' + cookSaved.qLeaveNA + '"/>' +
        '<input type="text" id="xDepCity" class="pdepcity b-block form-control border-0 p-0" readonly="readonly" value="' + cookSaved.qLeaveNA + '" />' +
        '<input type="hidden" id="xtxtLeavingFrom" name="xtxtLeavingFrom" value="' + cookSaved.qLeaveNA + '" />' +
        '<input type="hidden" id="xidLeavingFrom" name="xidLeavingFrom" value="' + cookSaved.qLeaveID + '" />' +
        '<input type="hidden" id="xxCabin" name="xxCabin" value="Y"/>' +
        '</div>' +
        '<div class="form-group col-4">' +
        '<label class="mb-4">Arrival Date</label>' +
        '<input type="text" id=xtxtBYArriving name="xtxtBYArriving" class="form-control border-0 p-0" readonly="readonly" value="' + cookSaved.qArrDate + '"  />' +
        '</div></div>';
    // *** CITY LIST WITH TRANSPORTATION
    var jsCity = [];
    var jsCtyInfo = '';
    var jsC = 0;
    var coC = 0;
    var objC = Object.keys(cookSaved).length - 1;
    $.each(cookSaved, function (i, e) {
        if (i.match(/\d+/g) != null) {
            if (jsC != i.match(/\d+/g)) {
                jsC = Number(i.match(/\d+/g));
                jsC > 1 ? (jsCity.push(jsCtyInfo), jsCtyInfo = '') : '';
                jsCtyInfo = jsCtyInfo + i.match(isNumber) + '@' + e;
            };
            /qNACity/.test(i) === false ? jsCtyInfo = jsCtyInfo + '@' + e : '';
        };
        coC++
        coC === objC ? (jsCity.push(jsCtyInfo), jsCtyInfo = '', $('#dvTransportR').html(''), $('#dvTransportR').append(dvDepAir), buildTransportationTo(jsCity), dvDepAir = '') : '';
    });
};
function buildTransportationTo(jscity) {
    //alert(jscity.toString());
    //alert(JSON.stringify(cityData)); //JSON.stringify(queryString)
    var dvCities = '';
    var dvCarOpt = '';
    var totCtys = cityData.length;
    if (totCtys === undefined) {
        var dataCity = JSON.parse(JSON.stringify(cityData));
        var infocity = jscity[0].split('@');
        dvCities = dvCities + '<div id="cityTo' + dataCity['No'] + '" class="dvMto form-row col-12 pl-0 pr-0 border-primary border-bottom">' +
            '<span class="form-group col-8">' +
            '<label>To</label>' +
            '<p id="xArrCode' + dataCity['No'] + '" class="parrcode" style="display:block">' + infocity[3].trim() + '</p>' +
            '<p id="xArrCity' + dataCity['No'] + '" class="parrcity" style="display:block; border-bottom:none">' + infocity[1] + '</p>' +
            '<input type="hidden" id="xNOCity' + dataCity['No'] + '" name="xNOCity' + dataCity['No'] + '" value="' + dataCity['No'] + '" />' +
            '<input name="xNACity' + dataCity['No'] + '" type="hidden" id="xNACity' + dataCity['No'] + '" value="' + infocity[1] + '"/>' +
            '<input type="hidden" name="xIDCity' + dataCity['No'] + '"  id="xIDCity' + dataCity['No'] + '" value="' + infocity[2] + '"  />' +
            '<input name="xCOCitx' + dataCity['No'] + '" type="hidden" id="xCOCitx' + dataCity['No'] + '" value="' + infocity[3].trim() + '"/>' +
            '<input name="xAPICity' + dataCity['No'] + '" type="hidden" id="xAPICity' + dataCity['No'] + '" value="' + infocity[4].replace(/\%\7C/g, '|').trim() + '"/>' +
            '</span>' +
            '<span class="form-group col-4">' +
            '<label class="mb-2">Number of nights</label>' +
            '<p id="xArrNoCode' + dataCity['No'] + '" class="parrnocode" style="display:block">&nbsp;</p>' +
            '<select class="form-control border-bottom border-left-0 border-right-0 border-top-0 pl-0" name="xSTCity' + dataCity['No'] + '" id="xSTCity' + dataCity['No'] + '">';
        var sel;
        var nts;
        for (n = 1; n <= 14; n++) {
            n === 1 ? nts = 'night' : nts = 'nights';
            n === Number(infocity[5]) ? sel = 'selected' : sel = '';
            dvCities = dvCities + '<option value="' + n + '" ' + sel + ' >' + n + ' ' + nts + '</option>';
        }
        dvCities = dvCities + '</select>' +
            '<button class="close position-relative nxtX" id="xspClose" type="button" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>';
    }
    else {
        var DropOffStartCity = "";
        var DropOffEndCity = 0;
        $.each(cityData, function (city) {		
            if (isNaN(Number(this.No)) === true) {
                //alert(this.No);
                if (this.No === 'S') {
                    var infocityS = jscity[0].split('@');
                    dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvMto form-row col-12 pl-0 pr-0 border-primary border-bottom">' +
                        '<span class="S">' +
                        '<font>&#9632;</font> Must arrive to <b>' + this.PlaceName + '</b>' +
                        '</span>' +
                        '<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
                        '<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + this.PlaceName + '"/>' +
                        '<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
                        '<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocityS[3].trim() + '"/>' +
                        '<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + infocityS[4].replace(/\%\7C/g, '|').trim() + '"/>' +
                        '<input type="hidden" id="xSTCity' + this.No + '" name="xSTCity' + this.No + '" value="0"/>';
                    if (this.Options !== undefined) {
                        var ctyNo = this.No;
                        var transpOpt = this.Options;
                        var selfCss = 'spTransActive';
                        var optCS = 1;
                        dvCities = dvCities + '<div class="dvMtravelto" id="dvMtravelTo' + ctyNo + '">';
                        if (transpOpt.Ranking === undefined) {
                            $.each(transpOpt, function () {
                                if (this.Ranking === 1) {
                                    dvCities = dvCities + '<input name="xFIELDCityS" type="hidden" id="xFIELDCityS" value="' + this.ProductFreeField1 + '"/>';
                                    dvCities = dvCities + '<input name="xTRANSCityS" type="hidden" id="xTRANSCityS" value="' + this.ProductType + '"/>';
                                    dvCities = dvCities + '<input type="hidden" id="xOVNCityS" name="xOVNCityS" value="' + this.Overnight + '"/>';
                                    dvCities = dvCities + '<div class="spTransActive" id="spTransRankS' + this.Ranking + '" data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '"><font class="spSlegend">Transfer to ' + infocityS[1] + '</font> <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span>';
                                    this.Overnight === 1 ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                    dvCities = dvCities + '</div>';
                                    selfCss = 'spTransNoActive';
                                }
                                else {
                                    dvCities = dvCities + '<div class="spTransNoActive" id="spTransRankS' + this.Ranking + '" data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '"><font class="spSlegend">Transfer to ' + infocityS[1] + '</font> <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span>';
                                    this.Overnight === 1 ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                    dvCities = dvCities + '</div>';
                                    optCS++;
                                };
                                if (this.ProductType === 'C') {
                                    var spDisplay = 'none';
                                    this.Ranking === 1 ? spDisplay = 'block' : '';
                                    dvCities = dvCities + '<br style="clear:both"/><div id="dvCarOpt' + ctyNo + '" class="dvCarOpt" style="display:' + spDisplay + '">';
                                    dvCities = dvCities + '<div><span class="pikdrp"><label>Pick-up</label><input id="xpickupPlaceCity' + ctyNo + '" name="xpickupPlaceCity' + ctyNo + '"  type="text" value="Airport"/></span><span class="when"><label>When</label><select id="xpickupDayCity' + ctyNo + '" name="xpickupDayCity' + ctyNo + '"><option  value="F">First Day</option><option value"L">Last Day</option></select></span><br style="clear:both"/></div>';
                                    dvCities = dvCities + '<div class="dvoff"><span class="pikdrp"><label>Drop-off</label><input id="xdropoffPlaceCity' + ctyNo + '" name="xdropoffPlaceCity' + ctyNo + '" type="text" value="Airport"/></span><span class="when"><label>When</label><select id="xdropoffDayCity' + ctyNo + '" name="xdropoffDayCity' + ctyNo + '"><option value="F">First Day</option><option value="L">Last Day</option></select></span><span class="where"><label>Where</label><select id="xdropoffCity' + ctyNo + '" name="xdropoffCity' + ctyNo + '">';
                                    if (this.CarDropOff.DOCity.DOPlaceNo !== undefined) {
                                        dvCities = dvCities + '<option value="' + this.CarDropOff.DOCity.DOPlaceNo + '">' + decodeURIComponent(this.CarDropOff.DOCity.DOPlaceName) + '</option>';
                                        if (this.Ranking === 1) { DropOffEndCity = this.CarDropOff.DOCity.DOPlaceNo; DropOffStartCity = ctyNo; }
                                    }
                                    else {
                                        var carOpt = this.CarDropOff.DOCity;
                                        if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
                                        $.each(carOpt, function () {
                                            dvCities = dvCities + '<option value="' + this.DOPlaceNo + '">' + decodeURIComponent(this.DOPlaceName) + '</option>'
                                        });
                                    }
                                    dvCities = dvCities + '</select></span><br style="clear:both"/></div>';
                                    dvCities = dvCities + '</div>';
                                };


                                dvCities = dvCities + '</span>';
                            });
                        }
                        else {
                            if (this.Ranking === 1) {
                                dvCities = dvCities + '<input name="xFIELDCityS" type="hidden" id="xFIELDCityS" value="' + transpOpt.ProductFreeField1 + '"/>';
                                dvCities = dvCities + '<input name="xTRANSCityS" type="hidden" id="xTRANSCityS" value="' + transpOpt.ProductType + '"/>';
                                dvCities = dvCities + '<input type="hidden" id="xOVNCityS" name="xOVNCityS" value="' + transpOpt.Overnight + '"/>';
                                dvCities = dvCities + '<div class="spTransActive" id="spTransRankS' + transpOpt.Ranking + '" data-type="' + transpOpt.ProductType + '" data-field="' + transpOpt.ProductFreeField1 + '" data-ovrnts="' + transpOpt.Overnight + '"><font class="spSlegend">Transfer to ' + infocityS[1] + '</font> <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span>';
                                transpOpt.Overnight === 1 ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                dvCities = dvCities + '</div>';
                                selfCss = 'spTransNoActive';
                            }
                            else {
                                dvCities = dvCities + '<div class="spTransNoActive" id="spTransRankS' + transpOpt.Ranking + '" data-type="' + transpOpt.ProductType + '" data-field="' + transpOpt.ProductFreeField1 + '" data-ovrnts="' + transpOpt.Overnight + '"><font class="spSlegend">Transfer to ' + infocityS[1] + '</font> <img src="https://pictures.tripmasters.com/siteassets/m/' + transpOpt.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span>';
                                transpOpt.Overnight === 1 ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                dvCities = dvCities + '</div>';
                                optCS++;
                            }
                            if (transpOpt.ProductType === 'C') {
                                var spDisplay = 'none';
                                transpOpt.Ranking === 1 ? spDisplay = 'block' : '';
                                dvCities = dvCities + '<br style="clear:both"/><div id="dvCarOpt' + ctyNo + '" class="dvCarOpt" style="display:' + spDisplay + '">';
                                dvCities = dvCities + '<div><span class="pikdrp"><label>Pick-up</label><input id="xpickupPlaceCity' + ctyNo + '" name="xpickupPlaceCity' + ctyNo + '"  type="text" value="Airport"/></span><span class="when"><label>When</label><select id="xpickupDayCity' + ctyNo + '" name="xpickupDayCity' + ctyNo + '"><option  value="F">First Day</option><option value"L">Last Day</option></select></span><br style="clear:both"/></div>';
                                dvCities = dvCities + '<div class="dvoff"><span class="pikdrp"><label>Drop-off</label><input id="xdropoffPlaceCity' + ctyNo + '" name="xdropoffPlaceCity' + ctyNo + '" type="text" value="Airport"/></span><span class="when"><label>When</label><select id="xdropoffDayCity' + ctyNo + '" name="xdropoffDayCity' + ctyNo + '"><option value="F">First Day</option><option value="L">Last Day</option></select></span><span class="where"><label>Where</label><select id="xdropoffCity' + ctyNo + '" name="xdropoffCity' + ctyNo + '">';

                                if (transpOpt.CarDropOff.DOCity.DOPlaceNo !== undefined) {
                                    if (transpOpt.Ranking === 1) { DropOffEndCity = transpOpt.CarDropOff.DOCity.DOPlaceNo; DropOffStartCity = ctyNo; }
                                    dvCities = dvCities + '<option value="' + transpOpt.CarDropOff.DOCity.DOPlaceNo + '">' + decodeURIComponent(transpOpt.CarDropOff.DOCity.DOPlaceName) + '</option>';
                                }
                                else {
                                    var carOpt = transpOpt.CarDropOff.DOCity;
                                    if (transpOpt.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
                                    $.each(carOpt, function () {
                                        dvCities = dvCities + '<option value="' + this.DOPlaceNo + '">' + decodeURIComponent(this.DOPlaceName) + '</option>';
                                    });
                                };
                                dvCities = dvCities + '</select></span><br style="clear:both"/></div>';
                                dvCities = dvCities + '</div>';
                            }
                            dvCities = dvCities + '</span>';
                        }

                        dvCities = dvCities + '<div class="' + selfCss + '" id="spTransRankS' + Number(optCS + 1) + '" data-type="W" data-field="W" data-ovrnts="0"><font class="spSlegend">Transfer to ' + infocityS[1] + '</font> <img src="https://pictures.tripmasters.com/siteassets/m/self_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span>';
                        dvCities = dvCities + '</div>';

                        dvCities = dvCities + '<br style="clear:both"/></div>';
                    }
                    dvCities = dvCities + '</div>s';
                }
                if (this.No === 'E') {
                    var lst = Number(jscity.length - 1);
                    var infocityE = jscity[lst].split('@');
                    dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvMto form-row col-12 pl-0 pr-0 border-primary border-bottom mt-2 pb-2">' +
                        '<span class="S">' +
                        '<font>&#9632;</font> Must depart from <b>' + this.PlaceName + '</b>' +
                        '</span>' +
                        '<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
                        '<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + this.PlaceName + '"/>' +
                        '<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + this.PlaceID + '"  />' +
                        '<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocityE[3].trim() + '"/>' +
                        '<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + infocityE[4].replace(/\%\7C/g, '|').trim() + '"/>' +
                        '<input type="hidden" id="xSTCity' + this.No + '" name="xSTCity' + this.No + '" value="0"/>';
                    '<input type="hidden" id="xOVNCity' + this.No + '" name="xOVNCity' + this.No + '" value="0"/>';
                    '</div>';
                }
            }
            else {
                var infocity = jscity[Number(this.No - 1)].split('@');
                dvCities = dvCities + '<div id="cityTo' + this.No + '" class="dvMto form-row col-12 pl-0 pr-0 border-primary border-bottom">' +
                    '<div class="form-group col-8">' +
                    '<label>To</label>' +
                    '<p id="xArrCode' + this.No + '" class="parrcode d-block mb-2">' + infocity[3].trim() + '</p>' +
                    '<p id="xArrCity' + this.No + '" class="parrcity d-block">' + infocity[1] + '</p>' +
                    '<input type="hidden" id="xNOCity' + this.No + '" name="xNOCity' + this.No + '" value="' + this.No + '" />' +
                    '<input name="xNACity' + this.No + '" type="hidden" id="xNACity' + this.No + '" value="' + infocity[1] + '"/>' +
                    '<input type="hidden" name="xIDCity' + this.No + '"  id="xIDCity' + this.No + '" value="' + infocity[2] + '"  />' +
                    '<input name="xCOCitx' + this.No + '" type="hidden" id="xCOCitx' + this.No + '" value="' + infocity[3].trim() + '"/>' +
                    '<input name="xAPICity' + this.No + '" type="hidden" id="xAPICity' + this.No + '" value="' + infocity[4].replace(/\%\7C/g, '|').trim() + '"/>' +
                    '</div>' +
                    '<div class="form-group col-4">' +
                    '<label class="mb-2">Number of nights</label>' +
                    //'<p id="xArrNoCode' + this.No + '" class="parrnocode" style="display:block">&nbsp;</p>' +
                    '<select class="form-control border-bottom border-left-0 border-right-0 border-top-0 pl-0" name="xSTCity' + this.No + '" id="xSTCity' + this.No + '">'
                var sel;
                var nts;
                for (n = 1; n <= 14; n++) {
                    n === 1 ? nts = 'night' : nts = 'nights';
                    n === Number(infocity[5]) ? sel = 'selected' : sel = '';
                    dvCities = dvCities + '<option value="' + n + '" ' + sel + ' >' + n + ' ' + nts + '</option>'
                };
                dvCities = dvCities + '</select>' +
                    '<button class="close position-relative nxtX" id="xspClose" type="button" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>';
                selfCss = 'spTransActive';
                var optC = 1;
                if (this.Options !== null) {
                    ctyNo = this.No;
                    var transOpt = this.Options;
                    dvCities = dvCities + '<div class="dvMtravelto" id="dvMtravelTo' + ctyNo + '" >';
                    if (this.Options[0].Ranking !== null) {
                        $.each(transOpt, function () {
                            if (this.Ranking === 1) {
                                dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="' + this.ProductFreeField1 + '"/>'
                                dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="' + this.ProductType + '"/>'
                                dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="' + this.Overnight + '"/>'
                                dvCities = dvCities + '<div class="spTransActive" id="spTransRank' + ctyNo + this.Ranking + '" data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '"><font class="spSlegend">Travel by</font>  <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/> <span class="spMtranspR">&#10095;</span>';
                                this.Overnight === 1 ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                dvCities = dvCities + '</div>';
                                selfCss = 'spTransNoActive';
                            }
                            else {
                                dvCities = dvCities + '<div class="spTransNoActive" id="spTransRank' + ctyNo + this.Ranking + '" data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '"><font class="spSlegend">Travel by</font>  <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/> <span class="spMtranspR">&#10095;</span>';
                                this.Overnight === 1 ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                dvCities = dvCities + '</div>';
                                optC++;
                            };
                            if (this.ProductType === 'C') {
                                spDisplay = 'none';
                                this.Ranking === 1 ? spDisplay = 'block' : '';
                                dvCities = dvCities + '<br style="clear:both"/><div id="dvCarOpt' + ctyNo + '" class="dvCarOpt" style="display:' + spDisplay + '">';
                                dvCities = dvCities + '<div><span class="pikdrp"><label>Pick-up</label><input id="xpickupPlaceCity' + ctyNo + '" name="xpickupPlaceCity' + ctyNo + '"  type="text" value="Airport"/></span><span class="when"><label>When</label><select id="xpickupDayCity' + ctyNo + '" name="xpickupDayCity' + ctyNo + '"><option value="F">First Day</option><option value"L">Last Day</option></select></span><br style="clear:both"/></div>';
                                dvCities = dvCities + '<div class="dvoff"><span class="pikdrp"><label>Drop-off</label><input id="xdropoffPlaceCity' + ctyNo + '" name="xdropoffPlaceCity' + ctyNo + '" type="text" value="Airport"/></span><span class="when"><label>When</label><select id="xdropoffDayCity' + ctyNo + '" name="xdropoffDayCity' + ctyNo + '"><option value="F">First Day</option><option value="L">Last Day</option></select></span><span class="where"><label>Where</label><select id="xdropoffCity' + ctyNo + '" name="xdropoffCity' + ctyNo + '" date-seq="' + ctyNo + '">';

                                if (this.CarDropOff !== null) {
                                    var carOpt = this.CarDropOff.DOCity;
                                    $.each(carOpt, function () {
                                        if (this.Ranking === 1) { DropOffEndCity = this.DOPlaceNo; DropOffStartCity = ctyNo; }
                                        dvCities = dvCities + '<option value="' + this.DOPlaceNo + '">' + decodeURIComponent(this.DOPlaceName) + '</option>';
                                    });
                                }
                                else {
                                    carOpt = this.CarDropOff.DOCity;
                                    if (this.Ranking === 1) { DropOffEndCity = carOpt[0].DOPlaceNo; DropOffStartCity = ctyNo; }
                                    $.each(carOpt, function () {
                                        dvCities = dvCities + '<option value="' + this.DOPlaceNo + '">' + decodeURIComponent(this.DOPlaceName) + '</option>';
                                    });
                                };
                                dvCities = dvCities + '</select></span><br style="clear:both"/></div>';
                                dvCities = dvCities + '</div>';
                            };
                        });
                    }
                    else {
                        optC = 1;
                        transpOpt = this.Options.Option;
                        $.each(transpOpt, function () {
                            if (this.ProductType === 'C') {
                                var spDisplay = 'none';
                                this.Ranking === 1 ? spDisplay = 'block' : '';
                                dvCities = dvCities + '<div id="dvCarOpt' + ctyNo + '" class="dvCarOpt col-12 pl-0 pr-0" style="display:' + spDisplay + '">';
                                dvCities = dvCities + '<div class="form-row"><div class="pikdrp form group col-3"><label>Pick-up</label><input class="form-control border-bottom border-left-0 border-right-0 border-top-0 pl-0 pr-0" id="xpickupPlaceCity' + ctyNo + '" name="xpickupPlaceCity' + ctyNo + '"  type="text" value="Airport"/></div><div class="when form-group col-4"><label>When</label><select class="form-control border-bottom border-left-0 border-right-0 border-top-0 pl-0" id="xpickupDayCity' + ctyNo + '" name="xpickupDayCity' + ctyNo + '"><option value="F">First Day</option><option value"L">Last Day</option></select></div></div>';
                                dvCities = dvCities + '<div class="dvoff form-row"><div class="pikdrp form-group col-3"><label>Drop-off</label><input class="form-control border-bottom border-left-0 border-right-0 border-top-0 pl-0 pr-0" id="xdropoffPlaceCity' + ctyNo + '" name="xdropoffPlaceCity' + ctyNo + '" type="text" value="Airport"/></div><div class="when form-group col-4"><label>When</label><select class="form-control border-bottom border-top-0 border-left-0 border-right-0 pl-0 pr-0" id="xdropoffDayCity' + ctyNo + '" name="xdropoffDayCity' + ctyNo + '"><option value="F">First Day</option><option value="L">Last Day</option></select></div><div class="where form-group col-5"><label>Where</label><select class="form-control border-bottom border-top-0 border-left-0 border-right-0 pl-0 pr-0" id="xdropoffCity' + ctyNo + '" name="xdropoffCity' + ctyNo + '" date-seq="' + ctyNo + '">';

                                if (this.CarDropOff.DOCity.DOPlaceNo !== undefined) {
                                    dvCities = dvCities + '<option value="' + this.CarDropOff.DOCity.DOPlaceNo + '">' + this.CarDropOff.DOCity.DOPlaceName + '</option>';
                                }
                                else {
                                    var carOpt = this.CarDropOff.DOCity;
                                    $.each(carOpt, function () {
                                        dvCities = dvCities + '<option value="' + this.DOPlaceNo + '">' + this.DOPlaceName + '</option>';
                                    });
                                };
                                dvCities = dvCities + '</select></div></div>';
                                dvCities = dvCities + '</div>';
                            };
                            var actClass = '';
                            var prodFiels = '';
                            var tranCty = '';
                            var ovntCty = '';
                            if (this.Ranking === 1) {
                                dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="' + this.ProductFreeField1 + '"/>';
                                dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="' + this.ProductType + '"/>';
                                dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="' + this.Overnight + '"/>';
                                dvCities = dvCities + '<div class="spTransActive" id="spTransRank' + ctyNo + this.Ranking + '" data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '"><font class="spSlegend">Travel by</font>  <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/> <span class="spMtranspR">&#10095;</span>';
                                this.Overnight === '1' ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                dvCities = dvCities + '</div>';
                                selfCss = 'spTransNoActive';
                            }
                            else {
                                dvCities = dvCities + '<div class="spTransNoActive" id="spTransRank' + ctyNo + this.Ranking + '" data-type="' + this.ProductType + '" data-field="' + this.ProductFreeField1 + '" data-ovrnts="' + this.Overnight + '"><font class="spSlegend">Travel by</font>  <img src="https://pictures.tripmasters.com/siteassets/m/' + this.ProductTypeName.replace(/\s/g, '_').toLowerCase() + '_icon.gif" align="absmiddle"/> <span class="spMtranspR">&#10095;</span>';
                                this.Overnight === '1' ? dvCities = dvCities + '&nbsp;&nbsp;  Overnight train' : '';
                                dvCities = dvCities + '</div>';
                                optC++;
                            }

                        });
                    } //if (this.Options.Option.Ranking !== undefined)

                    dvCities = dvCities + '<div class="' + selfCss + '" id="spTransRank' + ctyNo + Number(optC + 1) + '" data-type="OWN" data-field="W" data-ovrnts="0"><font class="spSlegend">Travel by</font> <img src="https://pictures.tripmasters.com/siteassets/m/self_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span></span>';

                    dvCities = dvCities + '</div>';
                    dvCities = dvCities + '<br style="clear:both"/>';
                    dvCities = dvCities + '</div>';
                } //if(this.Options !== undefined
                else {
                    if (this.No < totCtys) {
                        ctyNo = this.No;
                        selfCss = 'spTransActive';
                        dvCities = dvCities + '<div class="dvMtravelto" id="dvMtravelTo' + ctyNo + '" >'
                        dvCities = dvCities + '<input name="xFIELDCity' + ctyNo + '" type="hidden" id="xFIELDCity' + ctyNo + '" value="OWN"/>';
                        dvCities = dvCities + '<input name="xTRANSCity' + ctyNo + '" type="hidden" id="xTRANSCity' + ctyNo + '" value="W"/>';
                        dvCities = dvCities + '<input type="hidden" id="xOVNCity' + ctyNo + '" name="xOVNCity' + ctyNo + '" value="0"/>';
                        dvCities = dvCities + '<div class="' + selfCss + '" id="spTransRank' + ctyNo + '1" data-type="OWN" data-field="W" data-ovrnts="0"><font class="spSlegend">Travel by</font> <img src="https://pictures.tripmasters.com/siteassets/m/self_icon.gif" align="absmiddle"/><span class="spMtransp">&#10095;</span></div>';
                        dvCities = dvCities + '<br style="clear:both"/>';
                        dvCities = dvCities + '</div>';
                    }
                }
                dvCities = dvCities + '</div></br style="clear:both">';
            } //(isNaN(Number(this.No)) === true)
        });
    } // data city
    $(dvCities).insertAfter('.dvMBYOfrom');
    $('.nxtX').click(function () { startagain(); });
    $('div[id^="spTransRank"]').click(function () { modifyTranspOption(this); });
    $('select[id^="xdropoffCity"]').change(function () { modifyDropCarCty(this); });
    dvCities = '';
    $('#tranWait').remove();
    $('.dvMPaxRoom').show();
    $('.btnMcont').removeAttr("disabled");
}
function startAgain() {
    $('#dvTrasOptModal').modal('toggle');
    $('.dvMPaxRoom').hide();
    $('#dvTransportR').html('').html('<div class="loader"></div>');
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
}
/* Function to run after document is ready to get Departure City and ArrivalCity */
function doAjaxOnReady() {
    /*  ****  USA DEPARTURE AIRPORTS/CITIES  *** */
    $.ajax({
        type: "Get",
        url: SiteName + "/api/Packages/DepCity",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            var jsonData = res;
            depCities = $.map(jsonData, function (m) {
                return {
                    label: m.plC_Title + " - " + m.plC_Code,
                    value: m.plC_Title, // + " - " + m.plcCO ,
                    id: m.plcid,
                    code: m.plC_Code
                };
            });
            setautocomplete('qLeaveNA', 'dep');
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = Error');
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
            arrivalCities = $.map(jsonData, function (m) {
                return {
                    label: m.ctyNA + " (" + m.couNA + ")  - " + m.ctyCOD,
                    value: m.ctyNA + " (" + m.couNA + ")",// - " + m.CtyCOD ,
                    id: m.ctyID,
                    code: m.ctyCOD,
                    dept: m.deptNA,
                    hotapi: m.hotelAPI
                };
            });
            setautocomplete('qNACity1', 'arr');
            cookieCheck();
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = Error');
        }
    });
}
// -- Function to check cookie
function cookieCheck() {
    backCookie = Cookies.get('backCookMhome');
    backCookie != undefined ? (haveCook = 1, buildFromCook(1)) : /Design/.test(window.location) == true ? $('.pMtab').trigger('click') : '';
}
function buildFromCook(build) {
    $('#dvMbyoContainer').collapse('toggle');
    var cookieValues = JSON.parse(Cookies.get('backCookMhome'));
    $('#qWair').val(cookieValues.qWair);
    $("#qDepCity").html(cookieValues.qLeaveNA);
    $('#qLeaveNA').val(cookieValues.qLeaveNA);
    $(".pdepcode, .pdepcity, .pdepnocode").slideDown('fast');
    $('#qLeaveID').val(cookieValues.qLeaveID);
    $('#qLeaveCO').val(cookieValues.qLeaveCO);
    $("#qDepCode").html(cookieValues.qLeaveCO);
    $('#qsRetCity').val(cookieValues.qsRetCity);
    $('#goingID, #xgoingID, #goingDep').val(cookieValues.goingID);
    var cokC = 0;
    var cokL = Object.keys(cookieValues).length;
    jQuery.each(JSON.parse(Cookies.get('backCookMhome')), function (i, e) {
        /qNACity/.test(i) === true ? (i.match(isNumber) > 1 ? $('.pMaddcity').trigger('click') : '', $('#' + i + '').val(e), $('#qArrCity' + i.match(isNumber) + '').html(e).slideDown('fast')) : '';
        /qIDCity/.test(i) === true ? ($('#' + i + '').val(e)) : '';
        /qCOCity/.test(i) === true ? ($('#' + i + '').val(e), $('#qArrCode' + i.match(isNumber) + '').html(e).slideDown('fast'), $('#qArrNoCode' + i.match(isNumber) + '').slideDown('fast')) : '';
        /qAPICity/.test(i) === true ? ($('#' + i + '').val(e)) : '';
        /qLeave/.test(i) === true ? ($('#' + i + '').val(e)) : '';
        /qSTCity|qArrDate/.test(i) === true ? ($('#' + i + '').val(e).addClass('mt-4')) : '';
        
        $("#spClose" + i.match(isNumber) + "").show();
        cokC += 1;
        cokC === cokL ? (Cookies.set('backCookMhome', '', { expires: -1 }), $('.X').click(function () { deletecity(Number(this.id.match(isNumber))); })) : '';
    });
}
// -- Settiong autocomplete
function setautocomplete(obj, typ) {
    switch (typ) {
        case 'dep':
            $('#' + obj + '').autocomplete({
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
                    $("#qLeaveID").val(ui.item.id);
                    $("#qLeaveCO").val(ui.item.code);
                    $("#qsRetCity").val(ui.item.id);
                    $("#qDepCode").html(ui.item.code);
                    $("#qDepCity").html(ui.item.value);
                    $("#qLeaveNA").val(ui.item.value).addClass('inputSelectText');
                    $('#qArrDate').addClass('mt-4');
                    $(".pdepcode, .pdepcity, .pdepnocode").slideDown('fast');
                    return false;
                }
            }).click(function () {
                $('#qLeaveNA').val('').select().removeClass('border-warning');
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var $a = $("<span></span>").text(item.label);
                highlightText(this.term, $a);
                return $("<li></li>").append($a).appendTo(ul);
            };
            break;
        case 'arr':
            $('#' + obj + '').autocomplete({
                autoFocus: true,
                //source: arrivalCities,
                source: function (request, response) {
                    var matcher;
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
                    if (ui.content.length === 0 && $('#' + event.target.id + '').val().length >= 5) {
                        $('#' + obj.replace('NA', 'ID') + '').val('-1');
                        ui.content.push({ label: 'No result found', value: "" });
                        return false;
                    };
                },
                select: function (event, ui) {
                    var objNum = obj.match(isNumber);
                    if (Number(objNum) === 1) {
                        $("#goingID, #xgoingID, #goingDep").val(ui.item.dept);
                        $("#spClose1").show();
                    }
                    else {
                        //$("#spClose"+objNum+"").show().click(function(){deletecity(Number(objNum))})
                    }
                    $("#" + obj + "").val(ui.item.value).addClass('inputSelectText');
                    $("#" + obj.replace("NA", "ID") + "").val(ui.item.id);
                    $("#" + obj.replace("NA", "CO") + "").val(ui.item.code);
                    $("#" + obj.replace("NA", "API") + "").val(ui.item.hotapi);
                    $("#qArrCode" + objNum + "").html(ui.item.code).slideDown('fast');
                    $("#qArrCity" + objNum + "").html(ui.item.value).slideDown('fast');
                    $("#qArrNoCode" + objNum + "").slideDown('fast');
                    $('#qSTCity' + objNum + '').addClass('mt-4');
                    $("#spClose" + objNum + "").show()//.click(function(){deletecity(objNum)});
                    return false;
                },
                close: function (event, ui) {
                    var inpTxt = $('#' + event.target.id + '').val();
                    if ($('#' + event.target.id + '').val().length >= 3) {
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
                $('#' + obj + '').select().removeClass('border-warnings');
                if ($('#' + obj + '').val() == "City name") {
                    $('#' + obj + '').val("");
                }
                $('#' + obj.replace('NA', 'ID') + '').val('-1');
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var $a = $("<span></span>").text(item.label);
                highlightText(this.term, $a);
                return $("<li></li>").append($a).appendTo(ul);
            };
            break;
    }
}
function addnewcity(obj) {
    var frmto = obj.lang.split(',');
    var frm = frmto[0];
    var to = frmto[1];
    if (to > 12) { alert('For best results, no more than 12 cities is allowed. Thank.'); return false; }
    var nxt = Number(to) + Number(1);
    var newCity = '<div class="form-row dvMto" id="cityTo' + to + '">' +
        '<div class="form-group col-8 mb-0">' +
        '<label for="qAPICity' + to + '">To</label>' +
        '<p id="qArrCode' + to + '" class="parrcode mb-0"></p>' +
        '<input name="qNACity' + to + '" type="text" class="form-control border-left-0 border-right-0 border-top-0 pl-0" id="qNACity' + to + '" value="City name" />' +
        '<input type="hidden" name="qIDCity' + to + '" id="qIDCity' + to + '" value="-1" />' +
        '<input type="hidden" name="qCOCity' + to + '" id="qCOCity' + to + '" value="" />' +
        '<input type="hidden" name="qAPICity' + to + '" id="qAPICity' + to + '" value="" />' +
        '</div>' +
        '<div class="form-group col-4 mb-0">' +
        '<label>Number of nights</label>' +
        '<select id="qSTCity' + to + '" name="qSTCity' + to + '" class="form-control border-top-0 border-right-0 border-left-0 font-weight-bold pl-0">';
    
    var nts = 'night';
    var sel = '';
    for (i = 1; i < 15; i++) {
        i > 1 ? nts = "nights" : '';
        i === 3 ? sel = 'selected' : sel = '';
        newCity = newCity + '<option value=' + i + ' ' + sel + '>' + i + ' ' + nts + '</option>';
    }
    newCity = newCity + '</select>' +
        '<button class="close position-relative btnClose" id="spClose' + to + '" type="button" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>';
    var $divBfr = $('#cityTo' + frm);
    $(newCity).insertAfter($divBfr);
    setautocomplete('qNACity' + to + '', 'arr');
    $('.pMaddcity').attr('lang', to + ',' + nxt);
    $('.parrcode, .parrcity').click(function () { updatearrcity(this); });
    var opePos = $('#cityTo' + to).position();
    //$('html,body').animate({ scrollTop: opePos.top - 200 }, 400);
    $("#spClose" + to + "").show().click(function () { deletecity(Number(to)); });
    //window.scrollTo(0,opePos.top - 10);
}
// -- Delete city
function deletecity(obj) {
    if (obj === 1) {
        $('#qNACity1').val('City name').slideDown('fast');
        $('#qIDCity1').val(-1);
        $('#qCOCity1').val('');
        $('#qAPICity1').val('');
        $('#qArrCode1, #qArrCity1, #qArrNoCode1').slideUp('fast').html('');
        $('#spClose1').hide();
    }
    else {
        var ini = obj + 1;
        var fin = $('div[id^="cityTo"]').length;

        $('#cityTo' + obj + '').remove();
        var bfr = 0;
        var nxtl = 0;
        if (ini > fin) {
            bfr = fin - 1;
            nxtl = fin;
        }
        else {
            for (i = ini; i <= fin; i++) {
                if ($('#cityTo' + i + '').length > 0) {
                    bfr = i - 1;
                    $('#cityTo' + i + '').attr('id', 'cityTo' + bfr + '');
                    $('#qArrCode' + i + '').attr('id', 'qArrCode' + bfr + '');
                    $('#qArrCity' + i + '').attr('id', 'qArrCity' + bfr + '');
                    $('#qNACity' + i + '').attr('name', 'qNACity' + bfr + '');
                    $('#qNACity' + i + '').attr('id', 'qNACity' + bfr + '');
                    $('#qIDCity' + i + '').attr('name', 'qIDCity' + bfr + '');
                    $('#qIDCity' + i + '').attr('id', 'qIDCity' + bfr + '');
                    $('#qCOCity' + i + '').attr('name', 'qCOCity' + bfr + '');
                    $('#qCOCity' + i + '').attr('id', 'qCOCity' + bfr + '');
                    $('#qAPICity' + i + '').attr('name', 'qAPICity' + bfr + '');
                    $('#qAPICity' + i + '').attr('id', 'qAPICity' + bfr + '');
                    $('#qArrNoCode' + i + '').attr('id', 'qArrNoCode' + bfr + '');
                    $('#spClose' + i + '').attr('id', 'spClose' + bfr + '');
                    $('#qSTCity' + i + '').attr('name', 'qSTCity' + bfr + '');
                    $('#qSTCity' + i + '').attr('id', 'qSTCity' + bfr + '');
                    $('#spClose' + i + '').attr('id', 'spClose' + bfr + '');
                    $("#spClose" + bfr + "").show().click(function () { deletecity(Number(bfr)); });
                    setautocomplete('qNACity' + bfr + '', 'arr');
                    nxtl = i;
                }
            }
        }
        $('.pMaddcity').attr('lang', Number(bfr) + ',' + Number(nxtl));
        return false;
    }
}
function highlightText(text, $node) {
    var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
    while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
        newTextNode = currentNode.splitText(matchIndex);
        currentNode = newTextNode.splitText(searchText.length);
        newSpanNode = document.createElement("span");
        newSpanNode.className = "highlight boldText";
        currentNode.parentNode.insertBefore(newSpanNode, currentNode);
        newSpanNode.appendChild(newTextNode);
    }
}
// -- Update departure or city to
function updatedepairport(obj) {
    $('.pdepcode, .pdepcity').slideUp('fast').html('');
    $('.pdepnocode').slideUp('fast');
    $('#qLeaveNA').css({ 'font-size': '12px', 'height': '20px' }).slideDown('fast').trigger('click');
    $('#qLeaveID').val('-1');
    $('#qsRetCity').val('-1');
}
function updatearrcity(obj) {
    var num = obj.id.match(isNumber);
    $('#qArrCode' + num + ', #qArrCity' + num + '').slideUp('fast').html('');
    $('#qArrNoCode' + num + '').slideUp('fast');
    $('#qNACity' + num + '').slideDown('fast').trigger('click');
    $('#qIDCity' + num + '').val('-1');
    $('#qCOCity' + num + '').val('');
    $('#qAPICity' + num + '').val('');
}
// -- Modify transportation - spTransActive 
function modifyTranspOption(obj) {
    var nwobj = obj.id.substring(0, obj.id.length - 1);
    var objSeq = nwobj[nwobj.length - 1];
    var nwlast = Number(obj.id.substring(obj.id.length - 1, obj.id.length)) + 1;
    var nwobjC = $('div[id^="' + nwobj + '"]').length;
    nwlast > nwobjC ? nwlast = 1 : '';
    nwobj = nwobj + nwlast;
    var carSel;
    var trnobj;
    nwobjC > 1 ? ($('#' + obj.id + '').hide('slide', { direction: 'up' }, 'fast').removeClass('spTransActive').addClass('spTransNoActive'),
        $('#' + nwobj + '').show('slide', { direction: 'up' }, 'fast').removeClass('spTransNoActive').addClass('spTransActive'),
        $('#xFIELDCity' + objSeq + '').val($('#' + nwobj + '').data('field')),
        $('#xTRANSCity' + objSeq + '').val($('#' + nwobj + '').data('type')),
        $('#xOVNCity' + objSeq + '').val($('#' + nwobj + '').data('ovrnts')),
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
    var objSeq;
    seq === 'S' ? objSeq = 0 : objSeq = seq;
    var drpoff = val;
    $('.dvMtravelto').each(function () {
        var thisL = this.id[this.id.length - 1];
        thisL > objSeq ? ($('#' + this.id + '').show(), $('#xFIELDCity' + thisL + '').val($('#' + this.id + '').show().find('span:visible').data('field'))) : '';
    });
}
// -- Modify Car drop off city
function modifyDropCarCty(obj) {
    var objSeq = obj.id[obj.id.length - 1];
    var drpoff = $('#' + obj.id + '').find("option:selected").val();
    $('.dvMtravelto').each(function () {
        var thisL = this.id[this.id.length - 1];
        objSeq === thisL ? ''
            : drpoff != 'E' ?
                (
                    thisL < drpoff ? ($('#' + this.id + '').hide(), $('#xFIELDCity' + thisL + '').val('')) : '',
                    thisL >= drpoff ? ($('#' + this.id + '').show(), $('#xFIELDCity' + thisL + '').val($('#' + this.id + '').show().find('span:visible').data('field'))) : ''
                )
                : ($('#' + this.id + '').hide(), $('#xFIELDCity' + thisL + '').val(''));
    });
}
// -- Modify Car drop off city when city is last
function modifyDropCarCtyLast(seq, droff) {
    var objSeq = seq;
    var drpoff = droff;
    $('.dvMtravelto').each(function () {
        var thisL = this.id[this.id.length - 1];
        thisL > objSeq ?
            thisL < drpoff ? ($('#' + this.id + '').hide(), $('#xFIELDCity' + thisL + '').val('')) : '' : '';
    });
}
// **** ROOM - TRAVELERS *** //
function changeCabin(obj) {
    $('.pMdialogCabin').each(function () {
        this.id === obj.id ? ($('#' + obj.id + '').find('span:first').html('&#10003;'), $('#Cabin, #xCabin').val(obj.id)) : $('#' + this.id + '').find('span:first').html('&nbsp;');
    });
}
function checkTotalPax() {
    var qAdults = Number($('#xiAdults').val()) + Number($('#xRoom2_iAdults').val()) + Number($('#xRoom3_iAdults').val());
    var qChilds = Number($('#xiChildren').val()) + Number($('#xRoom2_iChildren').val()) + Number($('#xRoom3_iChildren').val());
    totalPax = qAdults + qChilds;
    if (totalPax <= 6) {
        return true;
    } else {
        alert('Max guest allowed (adults + children) are 6 !');
        return false;
    }
}
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
}
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
}
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
}
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
}
function childAgeChange(obj) {
    $(obj).attr('id').match(isNumber) === null ?
        $('#dvroom1 p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#xiChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#xiChild' + this.id.match(isNumber) + '').val('')) })
        :
        $('#dvroom' + $(obj).attr('id').match(isNumber) + ' p[id^="pAge"]').each(function (e, v) { v.id.match(isNumber) <= obj.val() ? ($(this).show(), $('#xRoom' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('Child ' + this.id.match(isNumber) + ' Age')) : ($(this).hide(), $('#xRoom' + $(obj).attr('id').match(isNumber) + '_iChild' + this.id.match(isNumber) + '').val('')) });
}
function roomTravelers(obj) {
    $('#xiRoomsAndPax').val(obj.id);
    $('#roomPaxTxt').html(obj.innerHTML);
    openPaxRoomlist();
    /Other/.test(obj.id) ? openRooms(obj.id.match(isNumber), 0) : openRooms(obj.id.substring(0, 1), obj.id.substring(2, 3));
}
function openRooms(rms, pax) {
    pax === 0 ? ($('#dvpxperroom').slideDown('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) <= rms ? $(this).slideDown('slow') : ($(this).slideUp('slow'), cleanRooms(this)) })) : ($('#dvpxperroom').slideUp('slow'), $('div[id^="dvroom"]').each(function () { this.id.match(isNumber) > 1 ? cleanRooms(this) : firstRoom(rms, pax) }));
}
function openPaxRoomlist() {
    $('#dvpxroomlst').is(':visible') === false ? ($('#dvpxroomlst').slideDown('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoom", "dvMdialogRoomROT")) : ($('#dvpxroomlst').slideUp('slow'), $('#dvpaxRoom').switchClass("dvMdialogRoomROT", "dvMdialogRoom"));
}
function firstRoom(rm, px) {
    $('#xiAdults').val(px);
    $('#xiChildren').val('');
    $('#xiChild1').val('');
    $('#xiChild2').val('');
    $('#dvroom1 p[id^="pAge"]').each(function () { $(this).hide() });
}
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
        }
    });
    $('#' + obj.id + ' p[id^="pAge"]').each(function () { $(this).hide() });
}
function showdialog() {
    $('.dvMMask').show();
    $('.dvMPageContainer').show('fade');
    window.scrollTo(0, 0);
    var cabval = $('#xwCabin').val();
    cabval === 'No' ? $('#dvSelectCabin').hide() : $('#dvSelectCabin').show();
    haveCook === 1 ?
        (
            $('#dvpxroomlst li[id="' + $("#iRoomsAndPax").val() + '"]').trigger('click'),
            $('#dvpxroomlst').hide(), $('div p[id^="pAge"] select').each(function () { this.value > 0 ? $(this).parent('p').show() : '' }),
            $('.pMdialogCabin[id="' + $("#Cabin").val() + '"]').trigger('click')
        ) : '';

    $('.pMdialogCabin').click(function () { changeCabin(this); });

}
function hidedialog() {
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
};
function hidedialogCont() {
    var qcabin = "";
    switch ($('#xCabin').val()) {
        case "Y":
            qcabin = ", Economy";
            break;
        case "W":
            qcabin = ", Premium Economy";
            break;
        case "C":
            qcabin = ", Business";
            break;
        case "F":
            qcabin = ", First Class";
            break;

    };
    //alert(qcabin);
    $('#xwCabin').val() === 'No' ? qcabin = "" : '';
    var qpxrm = $('#xiRoomsAndPax').val()
    var qRooms = qpxrm.substring(0, 1);
    $('#xiRoom').val(qRooms);
    $('#xRooms').val(qRooms);
    qRooms > 1 ? qRooms = qRooms + ' Rooms' : qRooms = qRooms + ' Room';
    //alert(qRooms);
    var rompax = qpxrm.split('|');
    var pax;
    var totpax = 0;
    /-/.test(rompax[1]) ? pax = rompax[1].split('-') : pax = rompax[1];
    for (p in pax) { totpax += Number(pax[p]); };
    isNaN(totpax) ? checkTotalPax() === true ? totpax = Number(totalPax) : '' : '';
    haveCook = 0;
    var qPxRoomString = qRooms + ', ' + totpax + ' Travelers' + qcabin;
    //alert(qPxRoomString);
    $('#xcabinRoomPax').val(qPxRoomString);
    $('.dvMPageContainer').hide();
    $('.dvMMask').hide();
    var qposBack = $('.dvMPaxRoom').position();
    window.scrollTo(0, qposBack.top - 10)
}
function submitCompList() {
    var jsonCompList;
    var queryString = $('#frmTransp').serializeObject();
    var jsonQSTR = $('#frmTransp').serialize();
    delete queryString['__RequestVerificationToken'];
    jsonQSTR = jsonQSTR.substr(0, jsonQSTR.indexOf('&__RequestVerificationToken'));
    console.log(queryString);
    console.log(jsonQSTR);
    $.ajax({
        type: "POST",
        url: SiteName +"/Api/Packages/webservComponentList",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(jsonQSTR),
        success: function (res) {
            jsonCompList = res;
            submitToBP(queryString, jsonCompList);
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = Error webservGetComponentList');
        }
    });
}
function submitToBP(strQ, jsR) {
    //var dvWaitBP = '<div style="background:white; width:95%; margin:0 auto"><img src="' + SiteName + '/images/mob/SearchingAH.gif" style="width:100%; height:100%"/></div>';
    //$('.dvMMask').append(dvWaitBP).show();
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
            /GIVendorAPI/.test(this.id) ? this.value = jsRprts[13] : '';
            /addFlight/.test(this.id) ? this.value = strQ.xaddFlight : '';
            ///Cabin/.test(this.id) ? (this.value = strQ.xxCabin, $('#xCabin').val('Y')) : '';
            /Cabin/.test(this.id) ? this.value = strQ.xCabin : '';
            /iDepCity|iRetCity/.test(this.id) ? this.value = strQ.xidLeavingFrom : '';
            /StayCityS/.test(this.id) ? (strQ.xNOCityS ? this.value = strQ.xIDCityS : this.value = strQ.xIDCity1) : ('');
            /StayCityS_Name/.test(this.id) ? (strQ.xNOCityS ? this.value = decodeURIComponent(strQ.xNACityS.replace(/\+/g, ' ').trim()) : this.value = strQ.xNACity1.slice(0, strQ.xNACity1.indexOf('(')).replace(/\+/g, ' ').trim()) : ('');
            /StayCityE/.test(this.id) ? (strQ.xNoCityE ? this.value = strQ.xIDcityE : this.value = strQ['xIDCity' + jsRprts[11]]) : ('');
            /StayCityE_Name/.test(this.id) ? (strQ.xNoCityE ? this.value = decodeURIComponent(strQ.xNAcityE.replace(/\+/g, ' ').trim()) : this.value = strQ['xNACity' + jsRprts[11]].replace(/\+/g, ' ').trim()) : ('');
            /Rooms/.test(this.id) ? (this.value = strQ.xRooms, $('#xRooms').val('1')) : '';
            /iRoom/.test(this.id) ? (this.value = strQ.xiRoom, $('#xiRooms').val('1')) : '';
            /iRoomsAndPax/.test(this.id) ? (this.value = decodeURI(strQ.xiRoomsAndPax), $('#xcabinRoomPax').val('1 Room, 2 Travelers, Economy'), $('#xiRoomsAndPax').val('1|2')) : '';
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
                ovt = 0
                iCity = iCity + '<input type="hidden" id="StayCity' + i + '" name="StayCity' + i + '" value="' + strQ['xIDCity' + i] + '"/>';
                iCity = iCity + '<input type="hidden" name="StayCity' + i + '_Name" id="StayCity' + i + '_Name" value="' + decodeURIComponent(strQ['xNACity' + i].slice(0, strQ['xNACity' + i].indexOf('(')).replace(/\+/g, ' ').trim()) + '" />';
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
            }
            i === 12 ? toBPGo() : '';
        }
    }
    else {
        alert('error');
    }
}
function toBPGo() {
    //var queryString = $('#formToBooking').formSerialize();
    document.formToBooking.action = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
    document.formToBooking.submit();
}