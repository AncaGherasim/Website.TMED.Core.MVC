var $loader = "<div class='loader'></div>";
var ssObj;
var page = 1;
var prevInt = 0;
var nxtPg = 1;
var initSSObj;
var isNumber = /[0-9]+/g;
var cmsData;
var prevCont = "";
$(document).ready(function () {
    //$('.sslist').html($loader);
    $(document).on('click', '.pageNext, .pagePrev', function (e) {
        e.preventDefault();
        pagination(this, this);
    });
    $('.selPage').change(function () {
        pagination(this.val, this);
    });
    $(document).on('show.bs.collapse', '#dvRoomFacil', function () {
        $('.btnRoomFacil').hide();
    });
    $(document).on('click', '.btnSortby', function () {
        $('.btnSortby').removeClass('btn-primary').addClass('btn-secondary');
        $(this).removeClass('btn-secondary').addClass('btn-primary');
        sortBy(this.textContent);
    });
    

    $("#modalCMS").on("show.bs.modal", function (event) {
        var btn = event.relatedTarget.id.match(isNumber);
        callCMS(btn);
    });


    $(document).on('click', '.aCMStxtLink, .modal-body a', function (e) {
        e.preventDefault();
        prevCont = $('.modal-body').html();
        var cmsId = $(this).attr('href').match(/\d+/);
        callCMS(cmsId[0]);
    });

    $('#backCms').click(function () {
        if (prevCont != '') {
            $('.modal-body').html('');
            $('.modal-body').html(prevCont);
            prevCont = '';
        } else {
            $('.modal-body').html('');
            $('#modalCMS').modal('hide');
        }
    });
    $('.backMap').click(function () {
        $('.modal-body').html('');
        $('#modalMap').modal('toggle');
    })

    $(document).on('click', '.aOnly', function () { filterOnly(this); });
    $(document).on('click', '#butGO', function () { filterOnly(this); });
    $(document).on('click', '.btnReset', function () { resetFilters(); });
    $(document).on('click', '.btnApply', function () { applyFilter(); });
    $(document).on('click', '.btnDetails', function () { openDetails(this.id); });
    $('#dvMap').click(function () { openpoimap(); $('#modalMap').toggle() });
    init();
});
function init() {
    var cityID = $('#plcId').val();
    var dt = { Id: cityID };
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Activities/GetSSToursByCity",
        data: JSON.stringify(dt),
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            //console.log(JSON.parse(data));
            ssObj = data;
            initSSObj = ssObj;
            prevInt = 0;
            buildSSList();
            createPagination();
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
}

function buildSSList() {
    $('.sslist').html('');
    var nx = page * 10;
    var listSS = "";
    var int = prevInt * nxtPg * 10;
    var ssList = ssObj.slice(int, nx);
    if (ssObj != '') {
        $.each(ssList, function () {
            listSS = listSS + "<div class='row mx-auto bg-white mb-2 dvSSdisplay'><div class='col-12'><p>" + this.pdL_Title + "</p></div>" +
                "<div class='col-4 pr-0'><img class='img-fluid' src='https://pictures.tripmasters.com" + this.imG_Path_URL.toLowerCase() + "' /></div>" +
                "<div class='col-8'><span class='d-block dvSdisplay'>Type: <b>" + this.name + "</b></span><span class='d-block dvSdisplay'>Duration: <b>" + this.durationUnit + "</b></span>";
            if (this.rating > 0 && this.reviews > 0) {
                listSS = listSS + "<span class='d-block dvSdisplay'>Score: <b>" + this.rating + "/5 </b>(" + this.reviews + " Reviews)</span></div>";
            } else {
                listSS = listSS + "<span class='d-block dvSdisplay'>Score: <b>Not rated yet</b> (" + this.reviews + " Reviews)</span></div>";
            }
                listSS = listSS + "<div class='col-12 pt-3 pb-3'><button class='btn btn-warning btn-block w-60 mx-auto btnDetails' type='button' id='" + this.pdlid + "' data-target='#details' data-toggle='modal'>Tour details</button></div>" +
                "</div>";
        });
        $('.sslist').append(listSS);
        $('.totalSS').text(" Total (" + ssObj.length + ")")
    } else {
        buildempty();
        $('.totalSS').text(" Total (" + ssObj.length + ")")
    }
}

function createPagination() {
    prevInt = 0;
    totPag = Math.ceil(ssObj.length / 10);
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
    //init();
    buildSSList();
}
function sortBy(obj) {
    sortList = ssObj;

    switch (true) {
        case /Name/i.test(obj):
            sortList = sortList.sort(function (a, b) { return b.pdL_Title < a.pdL_Title ? 1 : b.pdL_Title > a.pdL_Title ? -1 : 0 });
            break;
        case /Duration/i.test(obj):
            sortList = sortList.sort(function (a, b) { return b.durationUnit < a.durationUnit ? 1 : b.durationUnit > a.durationUnit ? -1 : 0 })
            break;
        case /Type/i.test(obj):
            sortList = sortList.sort(function (a, b) { return b.name < a.name ? 1 : b.name > a.name ? -1 : 0 })
            break;
    }
    ssObj = sortList;
    buildSSList();
    delete sortList;
    $('#filterSort').modal('hide');
}

function applyFilter() {
    var revArr = [];
    var filterList = [];
    var idsSS = [];
    $('.rev:checkbox').each(function () {
        this.checked ? revArr.push(this.value) : ''
    })
    $.each(revArr, function (i, v) {
        var item = $.grep(ssObj, function (a) {
            return a.id == v;
        })
        if (filterList != '') {
            filterList = filterList.concat(item);
        } else {
            filterList = item;
        }
        
    })
    console.log(filterList)
    ssObj = filterList;
    buildSSList();
    delete filterList;
    $('#filterSort').modal('hide');
}

function filterOnly(obj) {
    var cls = obj.id;
    var only = cls.split("|");
    var filterList = [];
    filterList = ssObj;
    switch (only[0]) {
        case "fav":
            filterList = $.grep(ssObj, function (fav) { return fav.pdL_SequenceNo == 99 });
            $('fav:checkbox, .rev:checkbox').prop('checked', false);
            $('#' + only[1] + "").prop('checked', true);
            break;
        case 'rev':
            filterList = $.grep(ssObj, function (rev) { return rev.id == only[1] });
            $('fav:checkbox, .rev:checkbox').prop('checked', false);
            $('#chkrev' + only[1] + "").prop('checked', true);
            break;
        case 'butGO':
            var text = $('#ssContain').val();
            !/Type/.test(text) ? (
                filterList = $.grep(ssObj, function (txt) { return compareAccent(txt.pdL_Title).match(new RegExp(compareAccent(text), 'i')) })) : ''
            break;

    };
    ssObj = filterList;
    buildSSList();
    createPagination();
    $('#filterSort').modal('hide');
}
function resetFilters() {
    $('.sslist').val('');
    $('.rev:checkbox').prop("checked", true);
    $('.fav:checkbox').prop("checked", false);
    ssObj = initSSObj;
    buildSSList();
    createPagination();
    $('#filterSort').modal('hide');
}
function buildempty() {
    var dvSSeach = '<div class="dvSSdisplay" style="text-align:center; font-weight:600">' +
        '<p>No activities match filter criteria,</p>' +
        '<p>please select another combination</p><p> and try again.</p>' +
        '<p>Thank you!</p></div>'
    $('.sslist').html(dvSSeach);
    $('.Page').hide();
}

function openDetails(id) {
    console.log(id);
    var ssDtl = $.grep(ssObj, function (dtl) { return dtl.pdlid == id });
    var msg = "<div class='row'><div class='col-12 blueText font-16 font-weight-bold'>" + ssDtl[0].pdL_Title + " </div>" +
        "<div class='col-12 pt-3 text-center'><img class='img-fluid' src='https://pictures.tripmasters.com" + ssDtl[0].imG_Path_URL + "' title='" + ssDtl[0].pdL_Title + "' /></div>" +
        "<div class='col-12 pt-3'><span class='d-block'>Type: <b class='blueText'>" + ssDtl[0].name + "</b></span>" +
        "<span class='d-block'>Duration: <b class='blueText'>" + ssDtl[0].durationUnit + "</b><span></div>" +
        "<div class='col-12'>" + ssDtl[0].pdL_Description + "</div>" +
        "</div>"
    $('.ssDetails').html(msg);
}

function callCMS(cmsId) {
    console.log(cmsId);
    $.ajax({
        ype: 'Get',
        url: SiteName + '/Api/Packages/SqlThisCMS/' + cmsId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var msg = JSON.stringify(data);
            if (data[0].cmS_Content != '') {
                data[0].cmS_Content = data[0].cmS_Content.replace(/http:/g, 'https:');
                if (RegExp(/\b(dvCMS\w*)\b/).test(data[0].cmS_Content) == true) {
                    $('.modal-body').html(data[0].cmS_Content);
                } else {
                    //window.location = '/cms/' + cmsID + 'Web_Content.aspx?CMS&wh=0&wf=0';
                    return false;
                }
            }
        },
        error: function (xhr, desc, exceptionobj) {
            $('.modal-body').html(xhr.responseText);
        }
    });
}

/* *** POI MAP *** */
var objPOI;
var ctylocLat = 0;
var ctylocLong = 0;
var allLat = [];
var allLong = [];
var allLatLong = [];
var lat1, lat2, long1, long2;
var dynZoom;
var bPrt;
var infoPOIWindows = [];
function openpoimap(plcid) {
    var plcid = $('#plcId').val();
    ctylocLat = 0;
    ctylocLong = 0;
    var dt = { Id: plcid };
    console.log(JSON.stringify(dt));
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Activities/GetPoiByPlaceId/",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(dt),
        success: function (data) {
            objPOI = data
            var LL = 0;
            delete allLatLong;
            jQuery.each(objPOI, function (data) {
                allLatLong.push(this.poI_Longitude + '|' + this.poI_Latitude);
                allLong.push(this.poI_Longitude);
                ctylocLat = Number(ctylocLat) + Number(this.poI_Latitude);
                ctylocLong = Number(ctylocLong) + Number(this.poI_Longitude);
                LL++;
            });
            delete ctyLatLong;
            delete dynZoon;
            ctyLatLong = Number(ctylocLat / LL) + '|' + Number(ctylocLong / LL);
            var maxLong = Math.max.apply(Math, allLong);
            var minLong = Math.min.apply(Math, allLong);
            jQuery.each(allLatLong, function (a, b) {
                bPrt = b.split('|');
                if (bPrt[0] = minLong) { lat1 = bPrt[1]; long1 = bPrt[0]; };
                if (bPrt[0] = maxLong) { lat2 = bPrt[1]; long2 = bPrt[0]; };
                delete bPrt;
            });
            delete dynZoom;
            dynZoom = getDistanceFromLatLonInKm(lat1, long1, lat2, long2)
            preBuildMap(data);
        },
        error: function (xhr, desc, exceptionobj) {
            $('#dvGoogleMap').html(xhr.responseText);
        }
    });
};
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
};
function deg2rad(deg) {
    return deg * (Math.PI / 180)
};
function preBuildMap(data) {
    $('.mapcanvas').show();
    $('.mapcanvas').css({ 'height': '85vh', 'margin': '5px' });
    var latlong = ctyLatLong.split('|');
    var lat = latlong[0];
    lon = latlong[1];
    var poiZoom = 10;
    switch (true) {
        case (dynZoom < 50):
            poiZoom = 11;
            break;
        case (dynZoom > 50 && dynZoom < 150):
            poiZoom = 10;
            break;
        case (dynZoom > 150):
            poiZoom = 9
            break;
    }
    var mapOptions = {
        zoom: poiZoom,
        center: new google.maps.LatLng(lat, lon),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true
    };
    var map = new google.maps.Map(document.getElementById("mapcanvas"), mapOptions);
    var Pcont = 0;
    jQuery.each(objPOI, function (data) {
        Pcont++;
        var locLat = this.poI_Latitude;
        var locLong = this.poI_Longitude;
        var iconImg = 'orange_ball.gif';
        var poiAnchor = new google.maps.Point(-10, 12)
        var marker = new MarkerWithLabel({
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelContent: '<div class="bubbletitle">' + this.poI_Title + '</div>',
            labelAnchor: poiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 1 },
            title: this.poI_Title,
            zIndex: 8998
        });
        var message = '<div class="dvBublleStyle">';
        if (this.poI_PictureURL != 'none') {
            message = message + '<img src="' + this.poI_PictureURL + '" align="left"/>';
        }
        message = message + '<div style="font-weight:600; color:navy">' + this.poI_Title + '</div>';
        if (this.poI_Description != 'none') {
            message = message + this.poI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); });
        infoPOIWindows.push(infoWind);
    });
};
function closePoiInfoW(mp, mrk, winfo) {
    for (var i = 0; i < infoPOIWindows.length; i++) {
        infoPOIWindows[i].close();
    };
    winfo.open(mp, mrk);
};
compareAccent = (function () {
    var getaccents = /[¹²³áàâãäåaaaÀÁÂÃÄÅAAAÆccç©CCÇÐÐèéê?ëeeeeeÈÊË?EEEEE€gGiìíîïìiiiÌÍÎÏ?ÌIIIlLnnñNNÑòóôõöoooøÒÓÔÕÖOOOØŒr®Ršs?ßŠS?ùúûüuuuuÙÚÛÜUUUUýÿÝŸžzzŽZZ]/g;
    var tonoaccent = {
        "¹": "1", "²": "2", "³": "3", "á": "a", "à": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "a": "a", "a": "a", "a": "a", "À": "a", "Á": "a", "Â": "a", "Ã": "a", "Ä": "a", "Å": "a", "A": "a", "A": "a",
        "A": "a", "Æ": "a", "c": "c", "c": "c", "ç": "c", "©": "c", "C": "c", "C": "c", "Ç": "c", "Ð": "d", "Ð": "d", "è": "e", "é": "e", "ê": "e", "?": "e", "ë": "e", "e": "e", "e": "e", "e": "e", "e": "e",
        "e": "e", "È": "e", "Ê": "e", "Ë": "e", "?": "e", "E": "e", "E": "e", "E": "e", "E": "e", "E": "e", "€": "e", "g": "g", "G": "g", "i": "i", "ì": "i", "í": "i", "î": "i", "ï": "i", "ì": "i", "i": "i",
        "i": "i", "i": "i", "Ì": "i", "Í": "i", "Î": "i", "Ï": "i", "?": "i", "Ì": "i", "I": "i", "I": "i", "I": "i", "l": "l", "L": "l", "n": "n", "n": "n", "ñ": "n", "N": "n", "N": "n", "Ñ": "n", "ò": "o",
        "ó": "o", "ô": "o", "õ": "o", "ö": "o", "o": "o", "o": "o", "o": "o", "ø": "o", "Ò": "o", "Ó": "o", "Ô": "o", "Õ": "o", "Ö": "o", "O": "o", "O": "o", "O": "o", "Ø": "o", "Œ": "o", "r": "r", "®": "r",
        "R": "r", "š": "s", "s": "s", "?": "s", "ß": "s", "Š": "s", "S": "s", "?": "s", "ù": "u", "ú": "u", "û": "u", "ü": "u", "u": "u", "u": "u", "u": "u", "u": "u", "Ù": "u", "Ú": "u", "Û": "u", "Ü": "u",
        "U": "u", "U": "u", "U": "u", "U": "u", "ý": "y", "ÿ": "y", "Ý": "y", "Ÿ": "y", "ž": "z", "z": "z", "z": "z", "Ž": "z", "Z": "z", "Z": "z"
    };
    return function (s) {
        return (s.replace(getaccents, function (match) { return tonoaccent[match]; }));
    }
})();