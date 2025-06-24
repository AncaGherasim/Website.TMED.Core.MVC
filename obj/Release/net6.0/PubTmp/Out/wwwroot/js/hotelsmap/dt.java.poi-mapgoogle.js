// JavaScript Document
var poiMarker = [];
var objHotels = [];
var objPoi = [];
var objData;
var ctyLatLong;
var distLats;
var NAplc;
var IDplc;
var NAcou;
var IDcou;
var isNumber = /[0-9]+/g;
var jsFav = 0;
var distLats;
var pageHotels = [];
var cityPoi = [];
let typeModal = 'default';
$(document).ready(function () {
	var gethotelsparams = {
		IDplc: plcID,
		Pageno: 1,
		Ratings: "",
		HotelName: "",
		Favorites: "",
		Review: "",
		CityZone: "",
		Sort: parseInt(1)
	}

	$.ajax({
		type: "POST",
		url: SiteName + "/Api/Hotels/HotelsOnPlace",
		data: JSON.stringify(gethotelsparams),
		contentType: 'application/json; charset=UTF-8',
		dataType: 'json',
		success: function (data) {
			pageHotels = data;
			console.log(data);
			initpoi();
		},
		error: function (xhr, desc, exceptionobj) {
			alert(xhr.responseText);
		}
	});  
});
function initpoi() {
    $.ajax({
        type: "POST",
		url: SiteName + "/Api/Hotels/POIHotels/",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify({ Id: plcID }),
        success: function (data) {
            cityPoi = data;
            init();
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText);
        }
    });
    
};
function init() {
    var lcPOIcontent = "";
    jQuery.each(cityPoi, function () {
        lcPOIcontent = lcPOIcontent + '<div class="dvChecks">';
        lcPOIcontent = lcPOIcontent + '<input type="checkbox" class="css-checkbox poi" id="' + this.poiid + '" value="' + this.poI_Latitude + '|' + this.poI_Longitude + '" />';
        lcPOIcontent = lcPOIcontent + '<label for="' + this.poiid + '" name="checkbox65_lbl" class="css-label">';
        lcPOIcontent = lcPOIcontent + '<p>' + this.poI_Title + '</p></label>';
        lcPOIcontent = lcPOIcontent + '</div>';
    });


    $("#dvPoiList").html(lcPOIcontent);
	NAplc = $('#placeNA').val();
	IDplc = $('#placeID').val();
	NAcou = $('#countryNA').val();
    IDcou = $('#countryID').val();
	var geocoder =  new google.maps.Geocoder();
			objHotels = pageHotels;
            objPoi = cityPoi;
			var LaLo = 0;
			var cylat = [];
			var cylon = [];
	jQuery.each(pageHotels, function (pageHotels) {
		cylat.push(Number(this.giphLatitude))
		cylon.push(Number(this.giphLongitude))
		LaLo++;
			});
			var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
            var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
            delete distLats;
            distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon)) 
			delete ctyLatLong;
			ctyLatLong = Number(midLat) + '|' + Number(midLon);
			buildBigMap(0);

	$('#selZone').change(function(){
		javaFilter()						 
	});
	$('.rev:checkbox').click(function(){
		javaFilter()
	 });
	
	$('#favorite').click(function(){
		jsFav = 1;
		javaFilter()						 
	});
	$('.rat:checkbox').click(function(){
		javaFilter()
	});
	$('.poi:checkbox').click(function(){
		onePoi(this.id);
	});
	$('#resetButton').click(function() {
		$('#selZone').val(0);							  					  
		$('.rat:checkbox').prop("checked", true);
		$('.fav:checkbox').prop("checked", false);
		$('.rev:checkbox').prop("checked", true);
		$('.poi:checkbox').prop("checked", false);
		jsFav = 0;
		javaFilter()
	});
	$('.aOnly').click(function(){
		$('#selZone').val(0);
		this.id.indexOf('chkRevw') > -1 ? $('.rat:checkbox').prop("checked", true) :  $('.rat:checkbox').prop("checked", false);
		$('.fav:checkbox').prop("checked", false);
		$('.rev:checkbox').prop("checked", false);
		jsFav = 0;
		var chkd = this.id.split('|');
        $('#' + chkd[1] + '').prop("checked", true)
        setTimeout(function () { javaFilter() }, 300);
		return false;
	});
	$('.modal__close, #applyButton').click(function () {
		closeModal();
	});
	$('#modalFilter').click(function () { openModalFilter(); });
	$("#dvPoiList").niceScroll({
	touchbehavior:false,
	cursorcolor:"#638bd1",
	cursoropacitymax:0.7,
	cursorwidth:6,
	background:"#ccc",
	autohidemode:false});
};

function javaFilter(){
	map = null;
	objHotels = pageHotels;
	objPoi = cityPoi;
	// *** City Zone  Filter  *** //
	var jsZone = $('#selZone').val();
	jsZone > 0 ? objHotels = $.grep(objHotels, function (zon) { return (zon.gipH_TNZoneID == jsZone); }) : '';
	// *** Rating Filter  *** //
	var jsRat = '';
	var jsRatC = 0
	$('.rat:checkbox').each(function () {
		this.checked ? (jsRatC == 0 ? jsRat = this.value : jsRat = jsRat + '|' + this.value) : '';
		this.checked ? jsRatC++ : '';
	});
	var srat = 0;
	if (jsRatC > 0) {
        jsRat = jsRat.replace(/\_/g, ' ');
		objHotels = $.grep(objHotels, function (rat) { return new RegExp(jsRat).test(rat.gipH_TNTournetRating.replace(/\+/g, "plus")) });  
	};

	// *** Favorite Filter  *** //
	$('.fav:checkbox').each(function () {
		this.checked ? jsFav = 1 : '';
	});
	if (jsFav == 1) {		
		objHotels = $.grep(objHotels, function (fav) { return (fav.gipH_TNSequence.between(49, 60)) });

	};
	// *** Review Filter  *** //
	var jsRev = '';
	var jsRevC = 0
	$('.rev:checkbox').each(function () {
		this.checked ? (jsRevC == 0 ? jsRev = this.value : jsRev = jsRev + '|' + this.value) : '';
		this.checked ? jsRevC++ : '';
	});
	var srev = 0;
	if (jsRevC > 0) {
		var revStr = new RegExp(jsRev);
		objHotels = grepRev(objHotels, jsRev) //$.grep(objHotels, function(rev){return(rev.ITYHR_ScoreDescription.replace(' Good','').match(revStr)) });
	};
	// *** Point Of Interest  *** //
	objHotels.length == 0 ? noHotel() : buildBigMap(1);
};
function noHotel(){alert("No Hotels, redifine the filter"); $('#resetButton').trigger('click'); return false};
function buildBigMap(tm) {
	map = null;
	if (tm == 0){
		var useLatLong = ctyLatLong.split('|');
		var regLat = useLatLong[0];
		var regLong = useLatLong[1];
		var rlatlng = new google.maps.LatLng(regLat, regLong);
		var poiZoom = 13;
		if (distLats != ''){
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
			};
		};
	}
	else{
		var LL = 0;
		var allLat = [];
		var allLong = [];
		var allLatLong = [];
       	var lat1, lat2, long1, long2;
		var dynZoon = 2;
		var ctylocLat = 0;
		var ctylocLong = 0;
		var cylat = [];
		var cylon = [];
		jQuery.each(objHotels, function (objHotels) {
			//allLatLong.push(this.giphLongitude + '|' + this.giphLatitude);
			//allLong.push(this.giphLongitude);
			//ctylocLat = Number(ctylocLat) + Number(this.giphLatitude);
			cylat.push(Number(this.giphLatitude)) 
			//ctylocLong = Number(ctylocLong) + Number(this.giphLongitude);
            cylon.push(Number(this.giphLongitude))
			LL++;
		});
		var midLat = ((Math.max.apply(Math, cylat) - Math.min.apply(Math, cylat)) / 2) + Math.min.apply(Math, cylat);
		var midLon = ((Math.max.apply(Math, cylon) - Math.min.apply(Math, cylon)) / 2) + Math.min.apply(Math, cylon);
		delete distLats;
        distLats = getDistanceFromLatLonInKm(Math.max.apply(Math, cylat), Math.max.apply(Math, cylon), Math.min.apply(Math, cylat), Math.min.apply(Math, cylon)) 
		delete ctyLatLong;
		ctyLatLong = Number(midLat) + '|' + Number(midLon); 
		useLatLong = ctyLatLong.split('|');
		regLat = useLatLong[0];
		regLong = useLatLong[1];
		rlatlng = new google.maps.LatLng(regLat, regLong);
		var maxLong = Math.max.apply(Math, allLong);
		var minLong = Math.min.apply(Math, allLong);
		jQuery.each(allLatLong, function (a, b) {
			bPrt = b.split('|');
			if (bPrt[0] = minLong) { lat1 = bPrt[1]; long1 = bPrt[0]; };
			if (bPrt[0] = maxLong) { lat2 = bPrt[1]; long2 = bPrt[0]; };
			delete bPrt;
		});		 
		var poiZoom = 13;
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
		};
		 
	};
	var myOptions = {
        zoom: poiZoom,
        center: rlatlng,
        mapTypeControl: true,
        panControl: true,
        zoomControl: true,
		scaleControl:true,
 		streetViewControl:true,
 		overviewMapControl:true,
 		rotateControl:false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("dvPageMap"), myOptions);
	// -- Create the DIV to Display Number of Hotels
	var controlDiv = document.createElement('div');
	var closeControl = new StyleMapControl(controlDiv,''+objHotels.length+' Hotels');
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	// -- Create the DIV to show POI
	var controlDiv = document.createElement('div');
	var closeControl = new StyleMapControl(controlDiv,'Show Activities');
	controlDiv.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	google.maps.event.addDomListener(controlDiv, 'mouseover', function() {
 		 $(this).addClass('dvHover');
    });
	google.maps.event.addDomListener(controlDiv, 'mouseout', function() {
 		 $(this).removeClass('dvHover');
    });
	google.maps.event.addDomListener(controlDiv, 'click', function() {
   		$('.poi:checkbox').prop("checked", true); buildPois();
    });
	buildHotel();
};
function StyleMapControl(controlDiv, txt) {
  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '1px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '10px';
  controlUI.style.marginRight = '5px';
  controlUI.style.textAlign = 'center';
  controlUI.title = ''+ txt +'';
  controlUI.style.width = '93px';
  controlDiv.appendChild(controlUI);
  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.color = '#333';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.lineHeight = '22px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = txt ;
  controlUI.appendChild(controlText);
};
//ratJS === null ? ratJS = this.value.replace('_',' ') : '' ;
function buildHotel() {
    var Phcont = 0;
    jQuery.each(objHotels, function (objHotels) {
        Phcont++;
        //if (Phcont < 7){
        var hlocLat = this.giphLatitude;
        var hlocLong = this.giphLongitude;
        var starNum = this.gipH_TNTournetRating.match(isNumber);
        starNum === null ? starNum = this.gipH_TNTournetRating : '';
        var imgSrc = '';
        var imgName = '';
        switch (true) {
            case /Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
				imgName = 'Stars_' + this.gipH_TNTournetRating.replace(/\s/g, "_");
				if (imgName.includes("+")) {
					imgName = imgName.replace("+", "_Plus");
				}
                break;
            case !/Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
				imgName = this.gipH_TNTournetRating.replace(/\s/g, "_").toLowerCase();
				if (imgName.includes("+")) {
					imgName = imgName.replace("+", "_Plus");
				}
                break;
		};
		var textStars = /Stars/g.test(this.gipH_TNTournetRating) ? this.gipH_TNTournetRating : '';
		imgSrc = '<img src="https://pictures.tripmasters.com/siteassets/d/' + imgName + '.gif" align="absmiddle" /><span style="display:table-cell">' + textStars +'</span>'


        var hiconImg = '';
        var hpoiAnchor = new google.maps.Point(25, 42);
        var icoFavo = '';
        var bubbMess = '<div class="mapBubb">';
        bubbMess = bubbMess + imgSrc;

		var ltlmessage = '<div class="dvaddHot">';
		ltlmessage = ltlmessage + '<div><b>' + this.pdL_Title + '</b></div>' + '<p style="display: table">' + imgSrc + '</p>';
		ltlmessage = ltlmessage + '<div class="jsO">';
		var solNA = ""
		var clsNA = ""
		var scrST = this.ghS_FinalScore;
		var expScore = expediaNoRange(this.ghS_FinalScore);
		switch (expScore) {
			case 'EX':
				solNA = "Excellent";
				clsNA = "EX";
				break;
			case 'VG':
				solNA = "Very Good";
				clsNA = "VG";
				break;
			case 'GD':
				solNA = "Good";
				clsNA = "GD";
				break;
			case 'FA':
				solNA = "Fair";
				clsNA = "FA";
				break;
			case 'PO':
				solNA = "Poor";
				clsNA = "PO";
				break;
		};
		ltlmessage = ltlmessage + '<div style="height: 12px;"><span class="sphotelScore"><div>' +
			'<span style="font-weight:700">' + scrST + '/5 </span>' + solNA + '</div>';
		ltlmessage = ltlmessage + '<br style="clear:both" />';

		bubbMess = bubbMess + '<div>'
		if (this.pdL_SequenceNo > 49 && this.pdL_SequenceNo < 60) {
			bubbMess = bubbMess + '<span class="spFav">&nbsp;</span>';
		}
		bubbMess = bubbMess + '<span class="jsS' + expScore + '">' + this.ghS_FinalScore + '</span><br style="clear:both" /></div>';

		ltlmessage = ltlmessage + '</div>'

        if (this.pdL_SequenceNo > 49 && this.pdL_SequenceNo < 60) {
            ltlmessage = ltlmessage + '<p class="fF"></p>';
        };
        ltlmessage = ltlmessage + '<p id="' + this.pdlid + '" class="mrDet" onclick="bubbleHotelInfo(this.id)")">more details</p>';
        ltlmessage = ltlmessage + '</div>';
        bubbMess = bubbMess + '</div>';
        var icoImg;
		/Stars|Lodge|Cruise/g.test(imgName) === false ? icoImg = 'https://pictures.tripmasters.com/siteassets/hotelstars/hotel_0star_BG.png' : icoImg =  'https://pictures.tripmasters.com/siteassets/hotelstars/hotel_' + starNum + 'stars.png'; 
        var hmarker = new google.maps.Marker({
            position: new google.maps.LatLng(hlocLat, hlocLong),
            map: map,
            icon: icoImg,
            draggable: false,
            raiseOnDrag: true,
            zIndex: 8998
        });
        //var infoBubb = new google.maps.InfoWindow({content:bubbMess});
        //infoBubb.open(map,hmarker);
        var infoHWind = new google.maps.InfoWindow({ content: ltlmessage });
        var infoH = new google.maps.InfoWindow({ content: ltlmessage });
        //infoHWind.open(map,hmarker);
        // google.maps.event.addListener(marker, 'click', function() { infowindow.open(map, marker); });
        google.maps.event.addListener(hmarker, 'mouseover', function () { infoHWind.open(map, hmarker) });
        google.maps.event.addListener(hmarker, 'mouseout', function () { infoHWind.close(map, hmarker) });
        google.maps.event.addListener(hmarker, 'click', function () { infoH.open(map, hmarker); map.setCenter(hmarker.getPosition()) });
        //} //end if
    });
};
function buildPois() {
	mapMark = [];
	poiMarker = [];
	jQuery.each(objPoi, function(objPoi) {
		poiMarker.push(this.poiid);
        locLat = this.poI_Latitude;
        locLong = this.poI_Longitude;
		iconImg = 'https://pictures.tripmasters.com/siteassets/d/MapMarker_Ball__Orange_40.gif'
        var marker = new google.maps.Marker({ position: new google.maps.LatLng(locLat, locLong), map: map, title: this.poI_Title, icon:iconImg});
		marker.id = this.poiid;
		mapMark.push(marker);
		var message = '<div style="padding:5px" class="Text_11" align="left">'
		this.poI_PictureURL != 'none' ? 
			message = message + '<img src="' + this.poI_PictureURL+'" align="left" style="width:50%; height:50%; margin:0px 5px 5px 0px;"  />'
		:
			message = message + '<img src="https://pictures.tripmasters.com/siteassets/d/NoPicture.jpg" align="left" style="margin:0px 5px 5px 0px;"  />'
		;
        message = message + '<span><b class="Text_12_BlueBold">' + this.poI_Title+'</b></span>'
        if (this.poI_Description == 'none') { message = message + '</div>' } else { message = message + '<br/><br/><font style="font-size:11px">' + this.poI_Description+'</font></div>'};
		var infoWind = new google.maps.InfoWindow({content:message, size:new google.maps.Size(90,90)});
		google.maps.event.addListener(marker, 'click', function(){map.setCenter(marker.getPosition()); $('#dvHstInfContainer').css({'top':'-100px','display':'none','position':'relative'}); openMapBubble(message); });
	});
};
var mapMark = [];
function DeleteMarker(id) {
	//Find and remove the marker from the Array
	for (var i = 0; i < poiMarker.length; i++) {
		if (poiMarker[i] == id) {
			//Remove the marker from Map                   
			mapMark[i].setMap(null);
			//Remove the marker from array.
			poiMarker.splice(i, 1);
			mapMark.splice(i, 1);
			map.setZoom(13);
		return;
		}
	}
};
function onePoi(id) {
	if (poiMarker.indexOf(id) > -1){
		DeleteMarker(id);
		return false;
    } else {
		poiMarker.push(id);
        var oneP = [];

        oneP = $.grep(objPoi, function (poi) { return (poi.poiid == id) });
		jQuery.each(oneP, function(oneP) {
            locLat = this.poI_Latitude;
            locLong = this.poI_Longitude;
			iconImg =  'https://pictures.tripmasters.com/siteassets/d/MapMarker_Ball__Orange_40.gif'

			var marker = new google.maps.Marker({position:new google.maps.LatLng(locLat, locLong), map: map, icon:iconImg});
			marker.id = id;
			mapMark.push(marker);
            var message = '<div style="padding:5px" class="Text_11" align="left"><img src="' + this.poI_PictureURL + '" align="left" style="width:50%; height:50%; margin:0px 5px 5px 0px;"  /><span><b class="Text_12_BlueBold">' + this.poI_Title+'</b></span>'
            if (this.poI_Description == 'none') { message = message + '</div>' } else { message = message + '<br/><br/><font style="font-size:11px">' + this.poI_Description+'</font></div>'};		
			//var infoWind = new google.maps.InfoWindow({content:message, size:new google.maps.Size(90,90)});
			var poiP = new google.maps.LatLng(locLat, locLong);
			map.setCenter(poiP);
			map.setZoom(15);
	
			$('#dvHstInfContainer').css({'top':'-100px','display':'none','position':'relative'}); 
			google.maps.event.addListener(marker, 'click', function(){map.setCenter(marker.getPosition()); $('#dvHstInfContainer').css({'top':'-100px','display':'none','position':'relative'}); });
			
			
		});
	
	};
};
function bubbleHotelInfo(id) {
	openModal();
	typeModal = 'default';;
    var oneHotel = pageHotels
    oneHotel = $.grep(oneHotel, function (h) { return (h.pdlid == id); })
    var message = '';
    jQuery.each(oneHotel, function (oneHotel) {
        var starNum = this.gipH_TNTournetRating.match(isNumber);
        starNum === null ? starNum = this.gipH_TNTournetRating : '';
        var imgSrc = ''
        var imgName = '';
        switch (true) {
            case /Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                imgName = 'Stars_' + this.gipH_TNTournetRating.replace(/\s/g, "_");
                break;
            case !/Stars|Lodge|Cruise/g.test(this.gipH_TNTournetRating):
                imgName = this.gipH_TNTournetRating.replace(/\s/g, "_").toLowerCase();
                break;
		};
		var textStars = /Stars/g.test(this.gipH_TNTournetRating) ? this.gipH_TNTournetRating : '';
		imgSrc = '<div class="hotel-info__stars"><img style="vertical-align:middle" src="https://pictures.tripmasters.com/siteassets/d/' + imgName + '.gif" align="absmiddle" /><span>' + textStars + '</span></div>'

		message = message + '<div class="info-hotel__wrapper">'
        if (this.imG_Url != 'none') {
			message = message + '<div class="info-hotel__image"><img src="https://pictures.tripmasters.com' + this.imG_Url.toLowerCase() + '"/></div>';
        };
		message = message + '<div>'
		message = message + '<div class="info-hotel__description"><h2>' + this.pdL_Title + '</h2>';
		if (this.gipH_TNSequence > 49 && this.gipH_TNSequence < 60) {
			message = message + '<img class="info-hotel__favorite" src="https://pictures.tripmasters.com/siteassets/d/favorite.gif"/>';
        };
		message = message + imgSrc + '<p>' + this.hotelAddress + '</p>';
		var scrST = this.ghS_FinalScore;
		var expScore = expediaNoRange(this.ghS_FinalScore);
		switch (expScore) {
			case 'EX':
				solNA = "Excellent";
				clsNA = "EX";
				break;
			case 'VG':
				solNA = "Very Good";
				clsNA = "VG";
				break;
			case 'GD':
				solNA = "Good";
				clsNA = "GD";
				break;
			case 'FA':
				solNA = "Fair";
				clsNA = "FA";
				break;
			case 'PO':
				solNA = "Poor";
				clsNA = "PO";
				break;
		};
		var NoOfReviews = this.ghS_ExpediaReviewCount > 0 ? ' (' + this.ghS_ExpediaReviewCount + ' reviews)' : '';
		message = message + '<div>' +
			'<span><b>' + scrST + '/5 </b></span>' + solNA +
			NoOfReviews +
			'</div>';

		message = message + '</div>';
		if (this.hotelDescription != 'none') {
			message = message + '<div class="hotel-info__text">' + this.hotelDescription + '</div>';
		};
		message = message + '</div>';
		message = message + '</div>';
	});
	$('.modal__container').html(message);
};
Number.prototype.between = function(first,last){
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
};
function expediaNoRange(no) {
	if (no.between(4.5, 5.0)) {
		return 'EX'
	}
	else if (no.between(4.0, 4.49)) {
		return 'VG'
	}
	else if (no.between(3.5, 3.99)) {
		return 'GD'
	}
	else if (no.between(3, 3.49)) {
		return 'FA'
	}
	else if (no.between(0, 2.99)) {
		return 'PO'
	}
}
function openModalMap() {
	openModal();
	typeModal = 'map';
	$('.modal__container').html('');
	$('.hotels__map > div').appendTo('.modal__container');
}
function openModalFilter() {
	openModal();
	typeModal = 'sort';
	$('.modal__container').html('');
	$('.hotels__filter > div').appendTo('.modal__container');
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
			$('.modal__container > div').appendTo('.hotels__map');
			break;
		case 'sort':
			$('.modal__container > div').appendTo('.hotels__filter');
			break;
		case 'default':
			$('.modal__container').html('');
			break;
	}
}
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
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};
function grepRev(filter,jrev){
	var listFilter = [];
	var list4_5 = [], list4 = [], list3_5 = [], list3 = [], list0 = [];
	listFilter = filter;
	var lngrev = jrev.split('|');
	var lngth = lngrev.length;
	if (lngth == 1) {
		jrev = jrev.replace('_', '.')
		jrev == 4.5 ? listFilter = $.grep(listFilter, function (rev) { return (rev.ghS_FinalScore >= 4.5)}) : '';
        jrev == 4 ? listFilter = $.grep(listFilter, function (rev) { return (rev.ghS_FinalScore.between(4.0, 4.49))}) : '';
		jrev == 3.5 ? listFilter = $.grep(listFilter, function (rev) { return (rev.ghS_FinalScore.between(3.5, 3.99))}) : '';
		jrev == 3 ? listFilter = $.grep(listFilter, function (rev) { return (rev.ghS_FinalScore.between(3, 3.49))}) : '';
		jrev == 0 ? listFilter = $.grep(listFilter, function (rev) { return (rev.ghS_FinalScore.between(0, 2.99))}) : '';
			return listFilter;
	}else{
		for (i=0;i<=lngth-1;i++){
			switch (lngrev[i].replace('_', '.')){
				case '4.5':
					list4_5 = listFilter;
					list4_5 = $.grep(list4_5, function (rev) { return (rev.ghS_FinalScore >= 4.5) });
					break;
				case '4':
					list4 = listFilter;
					list4 = $.grep(list4, function (rev) { return (rev.ghS_FinalScore.between(4.0, 4.49)) });
					break;
				case '3.5':
					list3_5 = listFilter;
					list3_5 = $.grep(list3_5, function (rev) { return (rev.ghS_FinalScore.between(3.5, 3.99)) });
					break;
				case '3':
					list3 = listFilter;
					list3 = $.grep(list3, function (rev) { return (rev.ghS_FinalScore.between(3, 3.49)) });
				break;
				case '0':
					list0 = listFilter;
					list0 = $.grep(list0, function (rev) { return (rev.ghS_FinalScore.between(0, 2.99)) });
			};
		};
		return [].concat.apply([], [list4_5, list4, list3_5, list3, list0]);
	};
};