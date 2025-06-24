// Javascript File
var $loader = "<div class='loader'></div>";
var page = 1;
var tot;
var objPks;
var initpkObj;
var prevInt = 0;
var nxtPg = 1;
var pdlPlaceIds = '';
var countries = [];
var ctyObj;
$(document).ready(function () {
    $('.dvPkList').html($loader);
    plcNA = $('#placeNA').val();
    init();
    $(document).on('click', '.pageNext, .pagePrev', function (e) {
        e.preventDefault();
        pagination(this);
    });
    $('.selPage').change(function () { pagination(this.val); });
    $(document).on('click', '.btnReset', function () { resetFilters(); });
    $(document).on('click', '.btnApply', function () { applyFilter(); });
    $('#orderby .list-group-item').click(function () {
        var getinput = $(this).children('input');
        $(this).children('input').attr('checked', 'checked');
        orderBy(getinput[0]);
    });
    $(document).on('click', "input[type='radio']", function () {
        orderBy(this);
    });
});
function init() {
    var plcID = $('#placeID').val();
    var dt = { Id: plcID };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/FindItinPacks",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(dt),
        success: function (data) {
            objPks = data;
            initpkObj = objPks;
            if (objPks != '') {
                $.each(objPks, function () {
                    if (this.pdL_Places != null) {
                        pdlPlaceIds = pdlPlaceIds + this.pdL_Places;
                    }
                });
            }
            pdlPlaceIds = pdlPlaceIds.substr(1, pdlPlaceIds.length - 2);
            getCities(pdlPlaceIds);
            buildPacks();
            createPagination();
        },
        error: function (xhr, desc, exceptionObj) {
            console.log(xhr.responseText);
        }
    });
}
function getCities(plcIds) {
    var dt = { Id: plcIds };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/All_Packages/GetAllPlaces",
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: JSON.stringify(dt),
        success: function (data) {
            //console.log(JSON.parse(data));
            ctyObj = JSON.parse(data);
            $.each(JSON.parse(data), function (i, v) {
                var item = $.grep(countries, function (item) {
                    return item.countryName === v.countryName;
                });
                if (item.length === 0) {
                    countries.push(v);
                }
            });
            buildCityList();
        },
        error: function (xhr, desc, exceptionObj) {
            console.log(xhr.responseText);
        }
    });
}
function buildPacks() {
    $('.dvPkList').html('');
    var msg = '';
    var nx = page * 10;
    var listH = "";
    var int = prevInt * nxtPg * 10;
    var pkList = objPks.slice(int, nx);
    $('.spNoPks').text(objPks.length);
    $.each(pkList, function () {
        msg = msg + "<div class='row pt-2 pb-2 border border-secondary border-top-0 border-right-0 border-left-0'><div class='col-4 pr-0'><img class='img-fluid' src='https://pictures.tripmasters.com" + this.imG_Path_URL.replace(" ", "_") + "' />" +
            "</div><div class='col-8 pl-0'><div class='col font14 blueText pr-0'>" + this.pdL_Title + "</div><div class='col'>";
        if (this.stP_NumOfNights != '') {
            if (this.spD_InternalComments.indexOf('Inflexible package') == -1) {
                msg = msg + "<span class='font12 greyText'>" + this.stP_NumOfNights + " to " + (this.stP_NumOfNights + Math.round(this.stP_NumOfNights / 2)) + " nights</span>";
            } else {
                msg = msg + "<span class='font12 greyText'>" + this.stP_NumOfNights + " nights</span>";
            }
        }
        if (this.stP_Save != 9999 && this.stP_Save != '') {
            msg = msg + "<span class='font12 greyText'> from <b class='orgClr'>" + formatCurrency(this.stP_Save, 0) + "*</b></span>";
        }
        msg = msg + "</div><div class='col'><button type='button' class='btn btn-link font12 pl-0' data-target='#dvPkDesc" + this.pdlid + "' data-toggle='collapse' aria-expanded='false'>Show Itinerary Details</button></div>" +
            "<div class='col'><a href='" + SiteName + "/" + this.stR_PlaceTitle.replace(/\s/g, '_').toLowerCase() + "/" + this.pdL_Title.replace(/\s/g, '_').toLowerCase() + "/package-" + this.pdlid + "' class='btn btn-warning btn-block font14'>View It</a></div></div>";
        if (this.spD_Description != '') {
            var reg = new RegExp(/<[^<>]+>/g);
            this.spD_Description = this.spD_Description.replace(reg, "");
        }
        msg = msg + "<div class='collapse font12' id='dvPkDesc" + this.pdlid + "'><div class='col-12 pt-4'>" + this.spD_Description + "</div>" +
            "<div class='col-12'>This sample price includes ALL air taxes & fuel surcharges: " + this.stP_MiniTitle + " for arrival on" + this.stP_StartTravelDate +
            ", departure from " + this.plC_Title + ". Choose your own departure city and dates.</div>" +
            "<div class='col-12'><span>This " + this.stP_NumOfNights + " night sample itinerary includes:</span><ul class='p-0 pl-3'>";
        var incl = this.pdL_Content.split(/\n/g);
        for (i = 0; i <= incl.length - 1; i++) {
            msg = msg + "<li>" + incl[i] + "</li>";
        }
        msg = msg + "</ul><div class='col-12 border border-secondary border-bottom-0 border-left-0 border-right-0 text-center'><a class='btn btn-link font12' href='" + SiteName + "/" + this.stR_PlaceTitle.replace(/\s/g, '_').toLowerCase() + "/" + this.pdL_Title.replace(/\s/g, '_').toLowerCase() + "/feedback-" + this.pdlid + "'>See out Customer feedbacks (" + this.noOfFeed + ")</a></div>";
        msg = msg + "</div></div></div>";
    });
    $('.dvPkList').append(msg);
}
function buildCityList() {
    var msg = '';
    var placeIds = $('#placeID').val().split(',');
    $.each(countries, function (i, cou) {
        msg = msg + "<div class='list-group-item list-group-item-action bg-white pl-0 pr-0'><button type='button' class='btn btn-outline-light btn-block text-dark text-left pl-0 pr-0 border-0 btnctylst collapsed' data-target='#dvCityList" + cou.countryId + "' data-toggle='collapse'>" + cou.countryName + "</button>" +
            "<div class='collapse list-group-flush' id='dvCityList" + cou.countryId + "'>";
        $.each(ctyObj, function (j, cty) {
            if (cty.countryName == cou.countryName) {
                msg = msg + "<div class='list-group-item list-group-item-action bg-white'>";
                $.each(placeIds, function (x, plc) {
                    if (plc == cty.placeId) {
                        msg = msg + "<input type='checkbox' name='radio-city' class='mr-1' id='radiocity" + cty.placeId + "' value='" + cty.placeId + "' checked />"
                    }
                });
                msg = msg + "<input type='checkbox' name='radio-city' class='mr-1' id='radiocity" + cty.placeId + "' value='" + cty.placeId + "' />" +
                    "<label for='radiocity" + cty.placeId + "'>" + cty.placeName + "</label></div>";
            }
        });
        msg = msg + "</div></div>";
    });
    $('.dvCities').append(msg);
}
function createPagination() {
    var totPag = Math.ceil(objPks.length / 10);
    $('.totPag').text('Total: ' + totPag);
    var opt = '';
    for (i = 1; i <= totPag; i++) {
        opt = opt + '<option value="' + i + '">' + i + '</option>';
    }
    $('.selPage').html(opt);
    $('.Page').removeClass('d-none').removeAttr('style');
}

function pagination(n) {
    //var pg = $('.selPage').val();
    var pg = parseInt($('.selPage').val());
    if (n === undefined) {
        prevInt = pg - 1;
        page = pg;
        $('.selPage option').each(function () {
            if ($(this).val() != pg) {
                $(this).removeAttr('selected');
            } else if ($(this).val() == pg) {
                $(this).attr('selected', 'selected');
            }
        })
    } else {
        if (n.id === "pagePrev") {
            if (pg === 0) { return; }
            page = pg;
            prevInt = page - 1;
            var sel = page - 1;
            $('.selPage option').each(function () {
                if ($(this).val() == pg) {
                    $(this).removeAttr('selected');
                } else if ($(this).val() == sel) {
                    $(this).attr('selected', 'selected');
                }
            })
        } else if (n.id === "pageNext") {
            page = pg + 1;
            prevInt = page - 1;
            var selbk = page - 2;
            $('.selPage option').each(function () {
                if ($(this).val() == pg) {
                    $(this).removeAttr('selected');
                } else if ($(this).val() == page) {
                    $(this).attr('selected', 'selected');
                }
            })
        }
    }
    buildPacks();
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
    return (((sign) ? '' : '-') + '$' + num); // + '.' + cents);
}

function orderBy(obj) {
    sortList = objPks;
    switch (true) {
        case /radiochoice/i.test(obj.id):
            var no = obj.value;
            switch (no) {
                case "1":
                    sortList = objPks;
                    var labeltxt = $("label[for=" + obj.id + "]").html();
                    $('.typeOrder').text(labeltxt);
                    break;
                case "2":
                    sortList = sortList.sort(function (a, b) { return a.stP_NumOfNights > b.stP_NumOfNights ? 1 : a.stP_NumOfNights < b.stP_NumOfNights ? -1 : 0; });
                    var labeltxt = $("label[for=" + obj.id + "]").html();
                    $('.typeOrder').text(labeltxt);
                    break;
                case "3":
                    sortList = sortList.sort(function (a, b) { return a.stP_Save > b.stP_Save ? 1 : a.stP_Save < b.stP_Save ? -1 : 0; });
                    var labeltxt = $("label[for=" + obj.id + "]").html();
                    $('.typeOrder').text(labeltxt);
                    break;
                case "4":
                    sortList = sortList.sort(function (a, b) { return a.stP_Save < b.stP_Save ? 1 : a.stP_Save > b.stP_Save ? -1 : 0; });
                    var labeltxt = $("label[for=" + obj.id + "]").html();
                    $('.typeOrder').text(labeltxt);
                    break;
                case "5":
                    sortList = sortList.sort(function (a, b) { return a.plC_Title < b.plC_Title ? 1 : a.plC_Title > b.plC_Title ? -1 : 0; });
                    var labeltxt = $("label[for=" + obj.id + "]").html();
                    $('.typeOrder').text(labeltxt);
                    break;
            }
            break;
        case /radioprice/i.test(obj.id):
            switch (obj.value) {
                case "0_999":
                    sortList = $.grep(objPks, function (price) { return (price.stP_Save.between(0, 999)); });
                    break;
                case "1000_1999":
                    sortList = $.grep(objPks, function (price) { return (price.stP_Save.between(1000, 1999)); });
                    break;
                case "2000_2999":
                    sortList = $.grep(objPks, function (price) { return (price.stP_Save.between(2000, 2999)); });
                    break;
                case "3000_3999":
                    sortList = $.grep(objPks, function (price) { return (price.stP_Save.between(3000, 3999)); });
                    break;
                case "4000_MAX":
                    sortList = $.grep(objPks, function (price) { return (price.stP_Save.between(4000, 9999)); });
            }
            break;
        case /radionight/i.test(obj.id):
            switch (obj.value) {
                case "0_7":
                    sortList = $.grep(objPks, function (nht) { return (nht.stP_NumOfNights.between(0, 7)); });
                    break;
                case "8_10":
                    sortList = $.grep(objPks, function (nht) { return (nht.stP_NumOfNights.between(8, 10)); });
                    break;
                case "11_14":
                    sortList = $.grep(objPks, function (nht) { return (nht.stP_NumOfNights.between(11, 14)); });
                    break;
                case "15_MAX":
                    sortList = $.grep(objPks, function (nht) { return (nht.stP_NumOfNights.between(15, 99)); });
                    break;
            }
    }
    objPks = sortList;
    buildPacks();
    createPagination();
    $('#dvFilter').modal('hide');
}
Number.prototype.between = function (first, last) {
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
};

function applyFilter() {
    var arrChk = [];
    $("input[type='checkbox']").each(function () { this.checked ? arrChk.push(this.value) : ''; });
    var pks = [];
    $.each(arrChk, function (i, v) {
        $.each(objPks, function (i, pk) {
            if (this.pdL_Places != null) {
                if (this.pdL_Places.indexOf(v.toString()) >= 0) {
                    pks.push(pk);
                }
            }
        });
    });
    objPks = pks;
    buildPacks();
    createPagination();
}

function resetFilters() {
    objPks = initpkObj;
    buildPacks();
    createPagination();
    $('#dvFilter').modal('hide');
}