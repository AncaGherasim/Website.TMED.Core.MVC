var ctyID;
var infoPOIWindows = [];
let isFirstLoad = true;
let total = 0;
let typeFilter = "";
let filterResults = [];
let typeModal = 'default';
const listOfActivities = {
    mob: {
        element: '#dvRespMob',
        numOfItems: 12,
        page: 1
    },
    desk: {
        element: '#dvResp',
        numOfItems: 24,
        page: 1
    },
}
const { mob, desk } = listOfActivities;

$(document).ready(function () {

    typeFilter = $('#typeFilter').val();
    $('li[id^="falsedotType"]').click(function () {
        chooseType(this.id);
    });
    $('#ResetFilter, #clearFilters').click(function () { resetFilter(); });
    $('#falseshowFav').click(function () { chooseFavorite(); });
    $('label[id*="sortBy"]').click(function (e) {
        $('label[id*="sortBy"]').removeClass('active');
        $("#" + this.id).addClass('active');
    });
    $('input[name="orderValue"]').click(function () {
        GetCitySSData();
    });
    ctyID = $('#cityId').val();
    $('#dvPoiLink, #modalMap').click(function () {
        $('#bigMap').removeClass('is-hidden');
        buildMapPoi();
    });
    $('#bigMapClose').click(function () { $('#bigMap').addClass('is-hidden'); });

    $('input:text[id^="tourName"]').click(function() {
        var isiPad = navigator.userAgent.match(/iPad/i) != null
        if (isiPad === true) {
            this.value = '';
        }
        this.focus();
        this.select();
    });
    $('#tourName').keypress(function(event) {
        if (event.keyCode == 13) {
            submitInputName();
        }
    });
    $('#submitInputName').click(function () {
        submitInputName();
    });
    $('#showMoreActivities').click(function () {
        showMoreActivities();
    });
    $('#showMoreActivitiesMob').click(function () {
        showMoreActivitiesMob();
    });
    $("#modalFilter").click(function () {
        openModalFilter();
    })
    $('.modal__close, #applyButton').click(function () {
        closeModal();
    });
    GetCitySSData();
    getMapPoiData(ctyID);

/*    $("img.lazy").Lazy();*/
});
function deleteFilterItem(id) {
    filterResults = filterResults.filter(function (item) {
        return item.id !== id;
    })
}
function chooseType(idEl) {
    const li = $('#' + idEl);
    li.toggleClass('selected');
    li.addClass('disabled');
    
    const id = idEl.replace('false', '');
    const input = $('input[type="checkbox"][id="' + id + '"]');
    if (input.is(':checked')) {
        input.prop("checked", false);
        deleteFilterItem(idEl);
    } else {
        input.prop("checked", true);
        const idType = input.val();
        getAmountActivities(idType);
        filterResults.push({ name: $('#' + idEl + ' > span:nth-child(1)').text(), id: idEl });
    }
    typeFilter = "";
    let count = 0;
    $('input[type="checkbox"][id^="dotType"]:checked').each(function () {
        typeFilter += $(this).val() + 'T';
        count++;
    });
    if (count === 0) {
        typeFilter = $('#typeFilter').val();
    } 
    GetCitySSData();
    setTimeout(() => li.removeClass('disabled'), 1000);
}
function chooseFavorite() {
    if ($('#falseshowFav').hasClass('falsechecked_1')) {
        $('#falseshowFav').removeClass('falsechecked_1');
        $('#showFav').prop("checked", false);
        deleteFilterItem('falseshowFav');
    } else {
        $('#falseshowFav').addClass('falsechecked_1');
        $('#showFav').prop("checked", true);
        filterResults.push({ name: 'Show only <b style="color: #090;">Favorites✓</b>', id: 'falseshowFav' })
    } 

    GetCitySSData(); 
}
function getAmountActivities(id) {
    var ids_ = $('#SSIds').val();
    var options = {};
    options.url = SiteName + "/Api/CitySSData";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = '{"SSFilter":"' + id + 'T|0||1", "Ids":"' + ids_ + '"}',
    options.dataType = "text";
    options.success = function (data) {
        var msgParts = data.substr(1, data.length - 2).split('@');
        const amountActivities = msgParts[1];
        $('#falsedotType' + id + ' > span:nth-child(2)').text('(' + amountActivities + ')');
    };
    options.error = function (xhr, desc, exceptionobj) {
        console.error(xhr.responseText);
    };
    $.ajax(options);
}
function resetFilter() {
    /*list of filter results*/
    $('.filter-result').addClass('is-hidden');
    filterResults = [];
    /*reset sort by*/
    $('label[id*="sortBy"]').removeClass('active');
    $("#sortBy1").addClass('active');
    $('input[type="radio"][id="orderAll"]').prop("checked", true);
    /*reset tour name contains*/
    $('#tourName').val('');
    /*reset favorite*/
    $('input[type="checkbox"][id="showFav"]').prop("checked", false);
    $('#falseshowFav').removeClass('falsechecked_1');
    /*reset type*/
    $('li[id^="falsedotType"]').removeClass();
    $('input[type="checkbox"][id^="dotType"]').prop("checked", false);
    typeFilter = $('#typeFilter').val();
    
    GetCitySSData();
}
function submitInputName() {
    var name = $('#tourName').val();
    if (name == '') {
        messg = '<ol><li>Please insert an activity name!</li></ol><span></span>';
        popError('tourName', messg);
        return;
    }
    filterResults.push({ name: 'Tours name contains: <b>' + name + '</b>', id: 'tourName' });
    $('.filter-result').removeClass('is-hidden');
    GetCitySSData();
}
function setCheckboxOnly(Id) {
	if (Id == "TypeFavorite"){
		 $('#falseshowFav').trigger( "click" );
	}
	else{
		$('a[id^="falsedot"]').removeClass().addClass("falsecheck_1");
    	$('input[id^="dot"]').prop("checked", false);
		$('#falsedot' + Id).addClass('falsechecked_1');
		$('#dot' + Id).prop("checked", true);
		GetCitySSData();
	};
};
function buildFilterResults() {
    const marckup = filterResults.map(function ({ name, id }) {
        return `<li>
                    <span>${name}</span>
                    <button type="button" onclick="closeFilterResultItem('${id}')">✖</button>
                </li>`
    })
    $('#filterResultsList').html(marckup);
}
function closeFilterResultItem(id) {
    switch (id) {
        case 'tourName':
            deleteFilterItem(id);
            $('#' + id).val('');
            GetCitySSData();
            break;
        case 'falseshowFav':
            deleteFilterItem(id);
            $('#' + id).removeClass('falsechecked_1');
            $('#showFav').prop("checked", false);
            GetCitySSData();
            break;
        default:
            chooseType(id);
    }
}
function BuildFilterExpression() {
    var filter = ''
    var favFilter = ''
    if ($('#showFav').is(":checked")) {
        favFilter = '1';
    } else {
        favFilter = '0';
    };

    var ssName = $('#tourName').val();

    var orderVal = $('input[name="orderValue"]:checked').val();
    if (typeFilter == '') typeFilter = '999999T'
    filter = typeFilter + '|' + favFilter + '|' + ssName + '|' + orderVal;
    return filter;
};
function GetCitySSData() {
    desk.page = 1;
    mob.page = 1;
    $('#showMoreActivitiesMob').hide();
    $('#showMoreActivities').hide();
    $(desk.element).html('');
    $(mob.element).html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    if (filterResults.length) {
        buildFilterResults();
        $('.filter-result').removeClass('is-hidden');
    } else {
        $('.filter-result').addClass('is-hidden');
    }
    var filter = BuildFilterExpression();
    var ids_ = $('#SSIds').val();    
    if (ids_.trim() != '') {        
        var options = {};
        options.url = SiteName + "/Api/CitySSData";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = '{"SSFilter":"' + filter + '", "Ids":"' + ids_ + '"}',
        options.dataType = "text";
        options.success = function (data) {
            msg = data.substr(1, data.length - 2);
            var msgParts = msg.split('@');
            $('#SSIdsPages').val(msgParts[0]);
            if (isFirstLoad) {
                $('.spanTotalSS').html(msgParts[1]);
                isFirstLoad = false;
            }
            $('#totalFilterResults').html(msgParts[1] + ' total');
            total = msgParts[1];
            OpenPage(desk.element, 0, desk.numOfItems);
            OpenPage(mob.element, 0, mob.numOfItems);
       };
        options.error = function (xhr, desc, exceptionobj) {
            $(desk.element).html(xhr.responseText);
            $(mob.element).html(xhr.responseText);
            $('#dvWait').html('');
            $('#dvWait').hide();
        };
        $.ajax(options);
    }
    else {
        $(desk.element).html('<div class="activities__no-result">0 activities found. Please try other combination.</div>');
        $(mob.element).html('<div class="activities__no-result">0 activities found. Please try other combination.</div>')
        $('#dvWait').html('');
        $('#dvWait').hide();
    }
};
function OpenPage(element, startIndex, endIndex) {
    $('#showMoreActivities').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="18" height="15" />');
    $('#showMoreActivitiesMob').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="18" height="15" />');
    var filter = BuildFilterExpression();
    var orderVal = filter.split('|')  
    var allIds = $('#SSIdsPages').val()
    var allIdsPages = allIds.split('|').join(',').replaceAll(',', ' ').trim().split(' ');
    const allId = allIdsPages.slice(startIndex, endIndex).join(',');

    if (total > 0) {
        var options = {};
        options.url = SiteName + "/Api/CityActivities";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = '{"SSFilter":"' + allId + '", "Ids":"' + orderVal[3] + '"}',
        options.dataType = "json";
        options.success = function (data) {
            let marckup = "";

            jQuery.each(data, function () {
                marckup += `<li>
                                <img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" data-src="https://pictures.tripmasters.com${this.imG_Path_URL.toLowerCase()}" onerror="this.src='https://pictures.tripmasters.com/siteassets/d/no-image.jpg'" alt='${this.name}'/>
                                <div class="activities__wrapper">
                                    <h3>${this.name}</h3>
                                    <div>
                                        <div class="activities__info">
                                            <span class="activities__favorites">${this.pdL_SequenceNo > 49 && this.pdL_SequenceNo < 60 ? "Favorites &#10003;" : "&nbsp;"}</span>
                                            <p>Score: ${this.rating > 0 && this.reviews > 0 ? "<b>" + this.rating + "/5</b> (" + this.reviews + "reviews)" : "<b>Not rated yet</b>(" + this.reviews + "reviews)"}</p>
                                            <p>Type: ${this.scD_CodeTitle}</p>
                                            <p>Duration: ${this.duration} ${this.durationUnit}</p>
                                        </div>
                                        <div class="activities__button"><button class="activities__details" onclick="openTourDetails(${this.id})">tour details <span>›</span></button></div>
                                    </div>
                                </div>
                                <div class="activities__modal-info is-hidden Info${this.id}">
                                    <div>
                                        <button class="activities__top-button" onclick="closeTourDetails(${this.id})"><span>✖</span><span>close</span></button>
                                        <p>${this.name}<span class="activities__favorites">${this.pdL_SequenceNo > 49 && this.pdL_SequenceNo < 60 ? "Favorites &#10003;" : ""}</span></p>
                                        <div class="activities__flex">
                                            <img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" data-src="https://pictures.tripmasters.com${this.imG_Path_URL.toLowerCase()}"  onerror="this.src='https://pictures.tripmasters.com/siteassets/d/no-image.jpg'" alt='${this.name}'/>
                                            <ul>
                                                <li><div>Score:</div><div>${this.rating > 0 && this.reviews > 0 ? "<b>" + this.rating + "</b><span> out of 5</span>" : "<b>Not rated yet</b>"}</div></li>
                                                <li><div>Reviews:</div><div>${this.reviews}</div></li>
                                                <li><div>Type:</div><div>${this.scD_CodeTitle}</div></li>
                                                <li><div>Duration:</div><div>${this.duration} ${this.durationUnit}</div></li>
                                            </ul>
                                        </div>
                                        ${this.pdL_Description}
                                        <button class="activities__bottom-button" onclick="closeTourDetails(${this.id})"><span>✖</span>close</button>
                                    </div>
                                </div>
                            </li>`
            });

            $(element).append(marckup);

            $('#dvWait').html('');
            $('#dvWait').hide();

            $('#showMoreActivities').html('show more');
            $('#showMoreActivitiesMob').html('show more');
            $('#showMoreActivitiesMob').show();
            $('#showMoreActivities').show();
            if (total < mob.page * mob.numOfItems) {
                $('#showMoreActivitiesMob').hide();
            }
            if (total < desk.page * desk.numOfItems) {
                $('#showMoreActivities').hide();
            }
        };
        options.error = function (xhr, desc, exceptionobj) {
            $(element).html(xhr.responseText);
            $('#dvWait').html('');
            $('#dvWait').hide();
        };
        $.ajax(options);



    } else {
        $(element).html('<div class="activities__no-result">0 activities found. Please try other combination.</div>')
        $('#dvWait').html('');
        $('#dvWait').hide();      
    };   
};
function openTourDetails(id) {
    $('body').addClass('modal-open');
    $('.Info' + id).removeClass('is-hidden');

    let elements = document.querySelectorAll('.Info' + id);
    elements.forEach(box => {
        box.addEventListener('click', (e) => handleButtonClick(e, id));
    });
}
function closeTourDetails(id) {
    $('body').removeClass('modal-open');
    $('.Info' + id).addClass('is-hidden');

    let elements = document.querySelectorAll('.Info' + id);
    elements.forEach(i => {
        i.removeEventListener('click', (e) => handleButtonClick(e, id));
    });
}
function handleButtonClick(e, id) {
    if (e.target === e.currentTarget) {
        closeTourDetails(id);
    }
}
function showMoreActivities() {
    desk.page++;
    const startIndex = desk.numOfItems * (desk.page - 1);
    const endIndex = desk.numOfItems * desk.page;
    OpenPage(desk.element, startIndex, endIndex);
}
function showMoreActivitiesMob() {
    mob.page++;
    const startIndex = mob.numOfItems * (mob.page - 1);
    const endIndex = mob.numOfItems * mob.page;
    OpenPage(mob.element, startIndex, endIndex);
}
function openModalMap() {
    openModal();
    typeModal = 'map';
    $('.modal__container').html('');
    $('.filter__map-wrapper').appendTo('.modal__container');
}
function openModalFilter() {
    openModal();
    typeModal = 'sort';
    $('.modal__container').html('');
    $('.desk-nav__sort-wrapper').appendTo('.modal__container');
    $('.filter__wrapper').appendTo('.modal__container');
}
function openModal() {
    $('.modal__container').html('<div style="padding:15px 15px;text-align:center;"><img src="https://pictures.tripmasters.com/siteassets/d/wait.gif"></div>');
    $('#modal').removeClass('is-hidden');
    $('body').addClass('modal-open');
}
function closeModal() {
    $('#modal').addClass('is-hidden');
    $('body').removeClass('modal-open');

    switch (typeModal) {
        case 'map':
            $('.filter__map-wrapper').appendTo('.filter__map');
            break;
        case 'sort':
            $('.desk-nav__sort-wrapper').appendTo('.desk-nav__sort');
            $('.filter__wrapper').appendTo('.filter');
            break;
        case 'default':
            $('.modal__container').html('');
            break;
    }
}
/* *** POI MAP *** */
var objPOI;
var map;
var ctylocLat = 0;
var ctylocLong = 0;

function getMapPoiData(plcid) {
    var dt = {Id: plcid};
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/Hotels/POIHotels/",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(dt),
        success: function (data) {
            objPOI = data;
            ctyLatLong = getDistance(data);
            buildThumbMap();
        },
        error: function (xhr, desc, exceptionobj) {
            $('#dvGoogleMap').html(xhr.responseText);
        }
    });
};
function getDistance(objPOI) {
    ctylocLat = 0;
    ctylocLong = 0;
    var cylat = [];
    var cylon = [];
    var LL = 0;
    jQuery.each(objPOI, function (data) {
        cylat.push(Number(this.poI_Latitude))
        cylon.push(Number(this.poI_Longitude))
        LL++;
    });
    var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
    var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
    delete distLats;
    distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon))
    delete ctyLatLong;
    ctyLatLong = Number(midLat) + '|' + Number(midLon);
    return ctyLatLong;
}
function buildThumbMap() {
    var useLatLong = ctyLatLong.split('|');
    var regLat = useLatLong[0];
    var regLong = useLatLong[1];
    var mapFrame = '<iframe style="border:0;position:relative;margin-left:-40px;margin-top:-40px;"' + 'src = "https://www.google.com/maps/embed/v1/view?key=AIzaSyAd8S1lOSNhEy2FUzkGT34S1KCvadNLkz8&' + 'center=' + regLat + ',' + regLong + '&zoom=10" width="300" height="300" frameborder="0"></iframe>';
    $('#dvMapCanvas').html(mapFrame);
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
}
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
function buildMapPoi() {
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
    var myOptions = {
        zoom: poiZoom,     
        center: rlatlng,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        panControl: true,
        zoomControl: true,        
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvGoogleMap"), myOptions);
    var Pcont = 0;
    jQuery.each(objPOI, function (data) {
        Pcont++;
        var locLat = this.poI_Latitude;
        var locLong = this.poI_Longitude;
        var iconImg = 'MapMarker_Ball__Orange_40.gif';
        var poiAnchor = new google.maps.Point(4, 25)
        var marker = new google.maps.Marker({
            icon: 'https://pictures.tripmasters.com/siteassets/d/' + iconImg,
            position: new google.maps.LatLng(locLat, locLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            labelAnchor: poiAnchor,
            labelInBackground: false,
            labelStyle: { opacity: 1 },
            title: this.POI_Title,
            zIndex: 8998
        });
        var message = '<div class="dvBublleStyle">';
        if (this.POI_PictureURL != 'none') {
            message = message + '<img src="' + this.poI_PictureURL + '" align="left"/>';
        }
        message = message + '<div>' + this.poI_Title + '</div>';
        if (this.POI_Description != 'none') {
            message = message + this.poI_Description;
        }
        message = message + '</div>';
        var infoWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(marker, 'click', function () { closePoiInfoW(map, marker, infoWind); }); //infoWind.open(map,marker);});
        infoPOIWindows.push(infoWind);
        var sname = this.poI_Title;
        var infoSTitle = new google.maps.InfoWindow({ content: sname, size: new google.maps.Size(20, 20) });
        google.maps.event.addListener(marker, 'mouseover', function () { infoSTitle.open(map, marker); });
        google.maps.event.addListener(marker, 'mouseout', function () { infoSTitle.close(map, marker); });
    });
};
function closePoiInfoW(mp, mrk, winfo) {
    for (var i = 0; i < infoPOIWindows.length; i++) {
        infoPOIWindows[i].close();
    };
    winfo.open(mp, mrk);
};
var objHotPOI;
function getHotClosePoiData(plcid, elat, elong, mark) {
    var infoToClose;
    for (var i = 0; i < infoPOIWindows.length; i++) {
        if (infoPOIWindows[i].getMap()) {
            infoPOIWindows[i].setContent('<div style="height:auto; padding:10px 10px;" ><img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif"><br/>... loading hotels</div>');
            infoToClose = infoPOIWindows[i];
        };

    };
    for (var i = 0; i < markerHotels.length; i++) {
        markerHotels[i].setMap(null); ;
    };
    var myLatLng = new google.maps.LatLng(elat, elong);
    var zoom = 15;
    map.setZoom(zoom);
    map.panTo(myLatLng);
    $.ajax({
        type: "POST",
        url: "/europe/WS_Library.asmx/getHotelClosePOI",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{plcID:"' + plcid + '", hLat:"' + elat + '", hLong:"' + elong + '"}',
        success: function(data) {
            objHOT = eval("(" + data.d + ")");
            if (objHOT.length > 0) {
                infoToClose.close();
                buildHotelPoi(data);
            }
            else {
                infoToClose.setContent('<div style="height:auto; padding:10px 10px;" >No closer hotels found</div>');
            }
        },
        error: function(xhr, desc, exceptionobj) {
            alert(xhr.responseText);            
        }
    });
};
function buildHotelPoi(data) {
    var Phcont = 0;
    jQuery.each(objHOT, function(data) {
        Phcont++;
        var hlocLat = this.PTY_Latitude;
        var hlocLong = this.PTY_Longitude;
        var starNum = this.SCD_CodeTitle.match(isNumber);
        var hiconImg = 'hotel_' + starNum + 'stars_GR.png';
        var hpoiAnchor = new google.maps.Point(-13, 39)
        var hmarker = new google.maps.Marker({
            position: new google.maps.LatLng(hlocLat, hlocLong),
            map: map,
            draggable: false,
            raiseOnDrag: true,
            icon: 'https://pictures.tripmasters.com/siteassets/d' + hiconImg,
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
        }
        message = message + '<div class="dvaddHot"><span>' + this.PDL_Title + '</span><br/><img src="https://pictures.tripmasters.com/siteassets/d/Stars_' + starNum + '_Stars.gif"/><p>' + this.PTY_Address + '</p></div>';
        if (this.POI_Description != 'none') {
            message = message + '<div class="dvdescHot">' + this.PTY_Description + '</div>';
        }
        message = message + '</div>';
        var infoHWind = new google.maps.InfoWindow({ content: message, size: new google.maps.Size(40, 40) });
        google.maps.event.addListener(hmarker, 'click', function() { infoHWind.open(map, hmarker); });
        markerHotels.push(hmarker);
    });
};
/* *** END POI MAP *** */

function windowCMS(id, w, h) {   
    var LeftPosition
    var TopPosition
    var settings
    var navAg = navigator.userAgent
    var dom = document.domain;
    var newURL = '/cms/' + id + '?cms&wh=0&wf=0'
    LeftPosition = (screen.width) ? (screen.width - w) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - h) / 2 : 0;
    if (navAg.indexOf('Firefox') >= 0) {
        settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable,toolbar=yes'
    }
    else if (navAg.indexOf('Chrome') >= 0) {
        settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ''
    }
    else {
        settings = 'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable,location=yes'
    }
    window.open(newURL, "CMS_Window", settings);
}

function popError(obj, messg) {
    var objPos = $('#' + obj + '').offset();
    $('#divError').html(messg);
    $('#divError').show();    
    $('#divError').offset({ left: objPos.left-10 , top: objPos.top - 50 });    
    setTimeout("$('#divError').hide()", 2000);
};
function closeClick(obj) {
    $('#divError').hide();
    if (IsMobileDevice()) { $('#' + obj + '').val(''); }
    $('#' + obj + '').select();
};