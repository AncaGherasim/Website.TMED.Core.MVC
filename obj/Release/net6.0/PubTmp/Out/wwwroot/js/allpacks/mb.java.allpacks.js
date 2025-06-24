// Javascript File
var $loader = "<div class='loader'></div>";
var pkObj;
var initpkObj;
var page = 1;
var prevInt = 0;
var nxtPg = 1;
var plcNA = '';
var pdlPlaceIds = '';
var countries = [];
var ctyObj;
var isNumber = /[0-9]+/g;
$(document).ready(function () {
    $('.dvPkList').html($loader);
    plcNA = $('#placeNA').val();
    getPacks();
    $(document).on('click', '.pageNext, .pagePrev', function (e) {
        e.preventDefault();
        pagination(this, this);
    });
    $('.selPage').change(function () { pagination(this.val, this); });
    $(document).on('click', '.btnReset', function () { resetFilters(); });
    $(document).on('click', '.btnApply', function () { applyFilter(); });
    $('.list-group-item').click(function () {
        var getinput = $(this).children('input');
        $(this).children('input').prop('checked', 'checked');
        orderFilterBy(getinput[0]);
    });
});
function getPacks() {
    //console.log("getPacks");
    var plcID = $('#placeID').val();
    var dt = { Id: plcID };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/All_Packages/GetAllPackages/",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(dt),
        success: function (data) {
            console.log(data);
            pkObj = data;
            initpkObj = data;
            if (pkObj != '') {
                $.each(pkObj, function () {
                    if (this.pdL_Places != null) {
                        pdlPlaceIds = pdlPlaceIds + this.pdL_Places;
                    }
                });                
            }
            pdlPlaceIds = pdlPlaceIds.substr(0, pdlPlaceIds.length - 1);
            getCities(pdlPlaceIds);
            buildPkList();
            createPagination();
        },
        error: function (xhr, desc, exceptionobj) {
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
            console.log(JSON.parse(data));
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
function buildPkList(isFiltered, isPagination) {
    $('.dvPkList').html('');
    var msg = '';
    var nx = page * 10;
    var listH = "";
    var int = prevInt * nxtPg * 10;
    var pkList = pkObj.slice(int, nx);
    if (isFiltered == undefined && isPagination == undefined) {
        $('.spNoPks').text(pkObj.length);
    }
    else {
        if (isPagination == undefined) {
            $('.spNoPks').text(pkObj.length + " Filtered");
        }
    }
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
        //costa_rica/arenal_volcano_-_guanacaste_beaches/package-141436
        msg = msg + "</div><div class='col'><button type='button' class='btn btn-link font12 pl-0' data-target='#dvPkDesc" + this.pdlid +"' data-toggle='collapse' aria-expanded='false'>Show Itinerary Details</button></div>" +
            "<div class='col'><a href='" + SiteName + "/" + this.countryName.replace(" ", "_").toLowerCase() + "/" + this.pdL_Title.replace(" ", "_").toLowerCase() + "/package-" + this.pdlid + "' class='btn btn-warning btn-block font14'>View It</a></div></div>";
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
        msg = msg + "</ul>";
        if (this.noOfFeed > 0) {
            msg = msg + "<div class='col-12 border border-secondary border-bottom-0 border-left-0 border-right-0 text-center'><a class='btn btn-link font12' href='" + SiteName + "/" + this.countryName.replace(" ", "_").toLowerCase() + "/" + this.pdL_Title.replace(" ", "_").toLowerCase() + "/feedback-" + this.pdlid + "'>See out Customer feedbacks (" + this.noOfFeed + ")</a></div>";
        }
        msg = msg + "</div></div></div>";
    });
    $('.dvPkList').append(msg);
}
function buildCityList() {
    var msg = '';
    $.each(countries, function (i, cou) {
        msg = msg + "<div class='list-group-item list-group-item-action bg-white'><button type='button' class='btn btn-outline-light btn-block text-dark text-left pl-0 pr-0 border-0' data-target='#dvCityList" + cou.countryId +"' data-toggle='collapse'>" + cou.countryName + "</button>" +
            "<div class='collapse list-group-flush' id='dvCityList" + cou.countryId + "'>";
        $.each(ctyObj, function (j, cty) {
            if (cty.countryName == cou.countryName) {
                msg = msg + "<div class='list-group-item list-group-item-action bg-white'><input type='checkbox' name='radio-city' id='radiocity" + cty.placeId + "' value='" + cty.placeId + "' />" +
                    "<label for='radiocity" + cty.placeId + "'>" + cty.placeName + "</label></div>";
            }
        });
        msg = msg + "</div></div>";
    });
    $('#dvCity').append(msg);

    $("input[type='checkbox']").change(function () {
        var labeltxt = "";
        $('input[type=checkbox]').each(function () {
            if (this.checked) {
                if (labeltxt == "") {
                    labeltxt = labeltxt + $("label[for=" + $(this).attr("id") + "]").html();
                }
                else {
                    labeltxt = labeltxt + "," + $("label[for=" + $(this).attr("id") + "]").html();
                }
            }
        });
        $('.typeCity').text(labeltxt);
    });
}
function createPagination() {
    prevInt = 0;
    totPag = Math.ceil(pkObj.length / 10);
    $('.totPag').text('Total: ' + totPag);
    var opt = '';
    for (i = 1; i <= totPag; i++) {
        opt = opt + '<option value="' + i + '">' + i + '</option>';
    }
    $('.selPage').html(opt);
    $('.Page').removeClass('d-none').removeAttr('style');
    $('.pagePrev').parent().addClass('disabled');
    if (totPag == 1) {
        $('.pageNext').parent().addClass('disabled');
    }
    else {
        $('.pageNext').parent().removeClass('disabled');
    }
}
function pagination(n, othis) {
    //var pg = $('.selPage').val();
    $('.pagePrev').parent().removeClass('disabled');
    $('.pageNext').parent().removeClass('disabled');
    var pg;
    pg = othis.value;
    if (n === undefined) {
        prevInt = pg - 1;
        page = pg;
        if (pg == 1) {
            $('.pagePrev').parent().addClass('disabled');
        }
        if (pg == totPag) {
            $('.pageNext').parent().addClass('disabled');
        }
        $('.selPage option').each(function () {
            if ($(this).val() != pg) {
                $(this).removeAttr('selected');
            } else if ($(this).val() == pg) {
                //$(this).attr('selected', 'selected');
                $(this).prop("selected", "selected");
            }
        })
    } else {
        pg = parseInt($('.selPage').val());
        if (n.id === "pagePrev") {
            if (pg === 0) { return; }
            var sel = pg - 1;
            page = sel;
            prevInt = page - 1;
            if (sel == 1) {
                $('.pagePrev').parent().addClass('disabled');
            }
            $('.selPage option').each(function () {
                if ($(this).val() == pg) {
                    $(this).removeAttr('selected');
                } else if ($(this).val() == sel) {
                    //$(this).attr('selected', 'selected');
                    $(this).prop("selected", "selected");
                }
            })
        } else if (n.id === "pageNext") {
            $('.pagePrev').parent().removeClass('disabled');
            page = pg + 1;
            prevInt = page - 1;
            var selbk = page - 2;
            if (page == totPag) {
                $('.pageNext').parent().addClass('disabled');
            }
            $('.selPage option').each(function () {
                if ($(this).val() == pg) {
                    $(this).removeAttr('selected');
                } else if ($(this).val() == page) {
                    //$(this).attr('selected', 'selected');
                    $(this).prop("selected", "selected");
                }
            })
        }
    }
    buildPkList(1, 1);
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

function orderFilterBy(obj) {
    switch (true) {
        case /radiochoice/i.test(obj.id):
            //console.log(obj.id.match(isNumber));
            var labeltxt = $("label[for=" + obj.id + "]").html();
            $('.typeOrder').text(labeltxt);
            break;
        case /radioprice/i.test(obj.id):
            var labeltxt = $("label[for=" + obj.id + "]").html();
            $('.typePrice').text(labeltxt);
            break;
        case /radionight/i.test(obj.id):
            var labeltxt = $("label[for=" + obj.id + "]").html();
            $('.typeStay').text(labeltxt);
            break;
    }
}

Number.prototype.between = function (first, last) {
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
};

function applyFilter() {
    pkObj = initpkObj;
    sortno = $('input[name=radio-choice]:checked').val();
    priceno = $('input[name=radioprice]:checked').val();
    lengthno = $('input[name=radio-night]:checked').val();

    var arrChk = [];
    $("input[type='checkbox']").each(function () { this.checked ? arrChk.push(this.value) : ''; });
    var pks = [];
    if (arrChk.length > 0) {
        $.each(arrChk, function (i, v) {
            $.each(pkObj, function (i, pk) {
                if (this.pdL_Places != null) {
                    if (this.pdL_Places.indexOf(v.toString() + ",") >= 0) {
                        pks.push(pk);
                    }
                }
            });
        });
    }
    else {
        pks = initpkObj;
    }

    if (priceno != undefined) {
        prInterval = priceno.split("_");
        if (prInterval[1] != "MAX") {
            pks = pks.filter(element => (element.stP_Save == 9999 ? 0 : element.stP_Save) >= prInterval[0] && (element.stP_Save == 9999 ? 0 : element.stP_Save) <= prInterval[1])
        }
        else {
            pks = pks.filter(element => (element.stP_Save == 9999 ? 0 : element.stP_Save) >= prInterval[0])
        }
    }

    if (lengthno != undefined) {
        lnInterval = lengthno.split("_");
        if (lnInterval[1] != "MAX") {
            pks = pks.filter(element => element.stP_NumOfNights >= lnInterval[0] && element.stP_NumOfNights <= lnInterval[1])
        }
        else {
            pks = pks.filter(element => element.stP_NumOfNights >= lnInterval[0])
        }
    }

    switch (sortno) {
        case "1":
            pks = pks.sort(function (a, b) { return a.pdlid > b.pdlid ? 1 : a.pdlid < b.pdlid ? -1 : 0; });
            break;
        case "2":
            pks = pks.sort(function (a, b) { return a.stP_NumOfNights > b.stP_NumOfNights ? 1 : a.stP_NumOfNights < b.stP_NumOfNights ? -1 : 0; });
            break;
        case "3":
            pks = pks.sort(function (a, b) { return (a.stP_Save != 9999 ? a.stP_Save : 0) > (b.stP_Save != 9999 ? b.stP_Save : 0) ? 1 : (a.stP_Save != 9999 ? a.stP_Save : 0) < (b.stP_Save != 9999 ? b.stP_Save : 0) ? -1 : 0; });
            break;
        case "4":
            pks = pks.sort(function (a, b) { return (a.stP_Save != 9999 ? a.stP_Save : 0) < (b.stP_Save != 9999 ? b.stP_Save : 0) ? 1 : (a.stP_Save != 9999 ? a.stP_Save : 0) > (b.stP_Save != 9999 ? b.stP_Save : 0) ? -1 : 0; });
            break;
        case "5":
            pks = pks.sort(function (a, b) { return a.pdL_Title > b.pdL_Title ? 1 : a.pdL_Title < b.pdL_Title ? -1 : 0; });
            break;
    }

    pkObj = pks;
    buildPkList(1);
    createPagination();
    $('#dvFilter').modal('hide');

}

function resetFilters() {
    $("input:radio[name='radioprice']").each(function (i) {
        this.checked = false;
    });
    $('.typePrice').text("");

    $("input:radio[name='radio-night']").each(function (i) {
        this.checked = false;
    });
    $('.typeStay').text("");

    $('input[type=checkbox]').each(function () {
        this.checked = false;
    });
    $('.typeCity').text("");

    pkObj = initpkObj;
    buildPkList();
    createPagination();
    $('#dvFilter').modal('hide');
}