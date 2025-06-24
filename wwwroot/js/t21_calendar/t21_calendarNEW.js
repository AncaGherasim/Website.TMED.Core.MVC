// JavaScript Document
let packagesID;
var fixDatesdiv;
var citiesAll = [];
var backCook;
var fxDatesNET;
$(window).bind("pageshow", function (event) {
	if (event.originalEvent.persisted) {
		//page is loaded from cache
		$('#imgPriceIt1').show();
		$('#imgLoading1').hide();
	};
});
$(document).ready(function () {
	packagesID = $('#pakID').val();

	$('#imgPriceIt1').show();
	$('#imgLoading1').hide();

	fixDatesdiv = $('#fxNetDates').val();

	$('.paxRoomChAg').click(function () {
		$(this).select();
	});
	$('select[id*="iAdult"]').change(function () {
		$('#' + this.id.replace('A', 'B') + '').val(this.value);
	});

	newDest();
	readCookVal();

	if (fxDates == '0') { dateByDest(); }

	// -- fix dates
	fxDatesNET = $('#fxNetDates').val();
	fixDatesdiv = fxDatesNET;
	// -- fix dates
	blockdates = $('#blockDates').val().split('|');

	$('#buttReorder').click(function () {
		window.location = document.URL.replace("package", "packagebyo");
	});

});
function updateFlight(input) {
	const value = input.value;
	if (value === 'False') {
		$('#AirParam').slideUp()
		$('#dateLabel').text('Check-in Date on your first city');
		$('#dateWrapper').removeClass('active');
		$('#addFlight').val('False');
	} else if (value === 'True') {
		$('#AirParam').slideDown();
		$('#dateLabel').text('Arrival date on your first city');
		$('#dateWrapper').addClass('active');
		$('#addFlight').val('True');
	}
}
function readCookVal() {
	backNull = getItemF("localStorageTMEDT21");
	if (backNull != null) {
		backCook = JSON.parse(getItemF("localStorageTMEDT21"));
		if (backCook.Pkgid != packagesID) {
			removeItemF("localStorageTMEDT21");
		}
    	else {
			var flyAdd = backCook.addFlight;
			if (flyAdd === 'True') {
				$("#updateFlightToTrue").prop("checked", true);
				$('#AirParam').slideDown();
				$('#dateLabel').text('Arrival date on your first city');
				$('#dateWrapper').addClass('active');
				$('#addFlight').val('True');
    		}
			var cabinValue = backCook.Cabin;
    		$('#Cabin option[value="' + cabinValue + '"]').attr('selected', 'selected');
			var qtyCities = Number(backCook.hwMnyCtyfrm) + 1;
			var dateIn = backCook.InDate1;
    		$('#InDate1').val(dateIn);
			var ctyDepNA = backCook.sDepCity;
    		$('#sDepCity').attr("value", ctyDepNA);
			var ctyDepID = backCook.iDepCity;
    		$('#iDepCity').val(ctyDepID);
			var jsRoom = backCook.Rooms;
    		$('#Rooms').val(jsRoom); $('#iRoom').val(jsRoom); rom = jsRoom
			var roomAndpax = backCook.iRoomsAndPax;
    		$('#iRoomsAndPax option[value="' + roomAndpax + '"]').attr('selected', 'selected');
    		if (roomAndpax.indexOf('Other') > -1) { showDivRoom(jsRoom); };
			var adultE = backCook.iAdults;
    		$('#iAdults').val(adultE);
    		$('#AiAdults option[value="' + adultE + '"]').attr('selected', 'selected');
			var childsE = backCook.iChildren;
    		$("#iChildren option[value='" + childsE + "']").attr('selected', 'selected');
    		if (childsE > 0) {
    			for (c = 1; c <= childsE; c++) {
    				$('#dvR1child' + c + '').show();
					var chidAge = backCook["iChild" + c];
    				$('#iChild' + c + '').val(chidAge);
    			};
    		};
    		if (jsRoom > 1) {
    			var jsAdult;
    			var jsChild;
    			var jsChilAge;
    			for (r = 2; r <= jsRoom; r++) {
					jsAdult = backCook["Room" + r + "_iAdults"];
    				$('#Room' + r + '_iAdults').val(jsAdult);
    				$('#ARoom' + r + '_iAdults option[value="' + jsAdult + '"]').attr('selected', 'selected');
					jsChild = backCook["Room" + r + "_iChildren"];
    				$("#Room" + r + "_iChildren option[value='" + jsChild + "']").attr('selected', 'selected');
    				if (jsChild > 0) {
    					for (c = 1; c <= jsChild; c++) {
    						$('#dvR' + r + 'child' + c + '').show();
							jsChilAge = backCook["Room" + r + "iChild" + c];
    						$("#Room" + r + "_iChild" + c + "").val(jsChilAge);
    					};
    				};
    			};
    		};
    		for (i = 1; i <= qtyCities; i++) {
				NtsStay = backCook["StayNite" + i];
    			$("#StayNite" + i + " option[value='" + NtsStay + "']").attr('selected', 'selected');
    		};
			removeItemF("localStorageTMEDT21");
    	};
	}
	else { getHomeTownAirport(); }
};
function newDest() {
	/*  ****  NEW list ofo destinations *** */
	$.ajax({
		type: "Get",
		url: SiteName + "/Api/Packages/depCity",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (res) {
			citiesAll = res
			doit();
		}
	});
	$("#sDepCity").click(function () {
		$("#sDepCity").select();
	});
}
function doit() {
	$("#sDepCity").autocomplete({
		autoFocus: true,
		minLength: 3,
		select: function (event, ui) {
			$('#sDepCity').select().removeClass('calendar-error');
			$("#sDepCity").val(ui.item.label);
			$('#iDepCity').val(ui.item.id);
			return false;
		},
		open: function () {
			$('.ui-autocomplete').css('width', '300px');
		},
		response: function (event, ui) {
			if (ui.content.length === 0) {
				alert('No valid airport found')
				return false;
			};
		},
		source: $.map(citiesAll, function (m) { return { value: m.plC_Title + " - " + m.plC_Code, label: m.plC_Title + " - " + m.plC_Code, id: m.plcid } }),
	}).click(function () {
		$('#sDepCity').select().removeClass('calendar-error');
		$('#iDepCity').val('-1');
	}).data("ui-autocomplete")._renderItem = function (ul, item) {
		var $a = $("<span></span>").text(item.label);
		highlightText(this.term, $a);
		return $("<li></li>").attr("data-value", item.value).append($a).appendTo(ul);
	};
};
function stayChange(sid, svalue) {
	$('#' + sid + '').val(svalue);
};
function selCabin(objt, valu) {
	$('#BCabin').val($('#Cabin').val());
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
				dtsDV = '<div style="padding:3px 1px;">';
			}
			else {
				dtsDV = dtsDV + '</div><div style="padding:3px 1px;">';
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
	$('#InDate1').val(ddate);
};
function chkValid(name, messg) {
	var objPos = $('#' + name + '').offset();
	$('#divError').html(messg);
	$('#divError').show();
	if (messg.indexOf('All infants') != -1) {
		$('#divError').offset({ left: objPos.left - 160, top: objPos.top - 50 });
	}
	else {
		$('#divError').offset({ left: objPos.left - 25, top: objPos.top - 50 });
	};
	$('#' + name + '').val('');
	$('#' + name + '').focus();
	$('#' + name + '').select();
	setTimeout("$('#divError').hide()", 2000);
};
/* ***** MULTIROOM ***** */
var ropx;
var rom = '1';
var pax = '2';
var pax2;
var pax3;
var paxMr;
var hwMCh;
function xSelChildren(ch, ro, ty, tID) {
	if (tID.indexOf('B') > -1) { $('#' + tID.replace('B', '') + '').val(ch); } else { $('#B' + tID + '').val(ch); };
	if (rom > 1) { hwMCh = Number($('#AiChildren').val()) + Number($('#ARoom2_iChildren').val()) + Number($('#ARoom3_iChildren').val()); };
	if (ty == 0) {
		$('#spChAg').hide(); $('#BspChAg').hide();
	} else {
		if (ty == 1) {
			if (ch == 0) {
				if (hwMCh == 0) {
					$('#spChAg').hide(); $('#BspChAg').hide();
				};
			} else {
				$('#spChAg').show(); $('#BspChAg').show();
			};
		};
	};
	switch (ro) {
		case 1:
			for (s = 1; s <= 4; s++) {
				if (s < ch || s == ch) {
					$('#dvR1child' + s + '').show(); $('#BdvR1child' + s + '').show();
				} else {
					$('#dvR1child' + s + '').hide(); $('#BdvR1child' + s + '').hide();
					$('#dvR1child' + s + '').val(''); $('#BdvR1child' + s + '').val('');
				};
				$('#iChild' + s + '').val(''); $('#BiChild' + s + '').val('');
			};
			break;
		case 2:
		case 3:
			for (s = 1; s <= 4; s++) {
				if (s < ch || s == ch) {
					$('#dvR' + ro + 'child' + s + '').show(); $('#BdvR' + ro + 'child' + s + '').show();
				} else {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
				};
				$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
			};
			break;
	};
};
function showDivRoom(ro) {
	if (ro == 0) { $('#dvPaxLabel').hide(); $('#BdvPaxLabel').hide() };
	for (i = 1; i <= 3; i++) {
		if (i <= ro) {
			$('#dvPaxLabel').show(); $('#BdvPaxLabel').show();
			$('#dvRoom' + i + '').show(); $('#BdvRoom' + i + '').show();
		}
		else {
			$('#dvRoom' + i + '').hide(); $('#BdvRoom' + i + '').hide();
		};
	};
};
function cleanValues(ro) {
	$('#spChAg').hide(); $('#BspChAg').hide();
	var roArr = [];
	switch (ro) {
		case 0:
			roArr = [1, 2, 3];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
					$('#AiAdults option').removeAttr('selected');
					$('#iChildren option').removeAttr('selected');
				};
			});
			break;
		case 1:
			roArr = [2, 3];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
				};
			});
			break;
		case 2:
			roArr = [1, 3];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
				};
			})
			break;
		case 3:
			roArr = [1, 2];
			roArr.forEach(function (ro) {
				for (s = 1; s <= 4; s++) {
					$('#dvR' + ro + 'child' + s + '').hide(); $('#BdvR' + ro + 'child' + s + '').hide();
					$('#Room' + ro + '_iChild' + s + '').val(''); $('#BRoom' + ro + '_iChild' + s + '').val('');
				};
			})
			break;
	};
	$("select[id='iChild1']").val('');
	$("select[id='iChild2']").val('');
	$("select[id='iChild3']").val('');
	$("select[id='iChild4']").val('');
};
function changePaxByRoom(valM, objID) {
	if (valM == -1) {
		var tObj = "'" + objID + "'";
		messg = '<ol><li>Please select a valid option!</li></ol><span></span>';
		popError(objID, messg);
		$('#' + objID + '').select();
		return false;
	} else {
		if (objID.indexOf('B') > -1) { $('#iRoomsAndPax option[value="' + valM + '"]').attr('selected', 'selected'); } else { $('#BiRoomsAndPax option[value="' + valM + '"]').attr('selected', 'selected'); };
		pax = '';
		pax2 = '';
		pax3 = '';
		ropx = valM.split('|');
		rom = ropx[0];
		pax = ropx[1];
		if (pax.indexOf('-') > 0) {
			paxMr = pax.split('-');
			pax = paxMr[0];
			pax2 = paxMr[1];
			if (paxMr[2] != undefined) {
				pax3 = paxMr[2];
			};
		};
		switch (rom) {
			case '1':
				$("#iChildren option[value=0]").attr('selected', 'selected');
				$("#BiChildren option[value=0]").attr('selected', 'selected');
				if (pax != 'Other') {
					showDivRoom(0);
					cleanValues(0);
					$("#AiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$('#ARoom2_iAdults option').removeAttr('selected');
					$('#ARoom3_iAdults option').removeAttr('selected');
					$("#ARoom2_iAdults option[value='0']").attr('selected', 'selected');
					$("#ARoom3_iAdults option[value='0']").attr('selected', 'selected');
					$("#BiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value='0']").attr('selected', 'selected');
					$("#BRoom3_iAdults option[value='0']").attr('selected', 'selected');
				}
				else {
					showDivRoom(1);
					cleanValues(0);
					$("#AiAdults option[value=2]").attr('selected', 'selected');
					$("#BiAdults option[value=2]").attr('selected', 'selected');
					$('#ARoom2_iAdults option').removeAttr('selected');
					$('#ARoom3_iAdults option').removeAttr('selected');
					$("#ARoom2_iAdults option[value='0']").attr('selected', 'selected');
					$("#ARoom3_iAdults option[value='0']").attr('selected', 'selected');
				};
				break;
			case '2':
				$("#iChildren option[value=0]").attr('selected', 'selected');
				$("#Room2_iChildren option[value=0]").attr('selected', 'selected');
				$("#BiChildren option[value=0]").attr('selected', 'selected');
				$("#BRoom2_iChildren option[value=0]").attr('selected', 'selected');
				if (pax != 'Other') {
					showDivRoom(0);
					cleanValues(0);
					$("#AiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$('#ARoom3_iAdults option').removeAttr('selected');
					$("#ARoom3_iAdults option[value='0']").attr('selected', 'selected');
					$("#BiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#BRoom3_iAdults option[value='0']").attr('selected', 'selected');
				}
				else {
					showDivRoom(2);
					cleanValues(0);
					$("#AiAdults option[value=2]").attr('selected', 'selected')
					$("#ARoom2_iAdults option[value=2]").attr('selected', 'selected')
					$("#BiAdults option[value=2]").attr('selected', 'selected')
					$("#BRoom2_iAdults option[value=2]").attr('selected', 'selected')
					$('#ARoom3_iAdults option').removeAttr('selected');
					$("#ARoom3_iAdults option[value='0']").attr('selected', 'selected');
				};
				break;

			case '3':
				$("#iChildren option[value=0]").attr('selected', 'selected');
				$("#Room2_iChildren option[value=0]").attr('selected', 'selected');
				$("#Room3_iChildren option[value=0]").attr('selected', 'selected');
				$("#BiChildren option[value=0]").attr('selected', 'selected');
				$("#BRoom2_iChildren option[value=0]").attr('selected', 'selected');
				$("#BRoom3_iChildren option[value=0]").attr('selected', 'selected');
				if (pax != 'Other') {
					showDivRoom(0);
					cleanValues(0);
					$("#AiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#ARoom3_iAdults option[value='" + pax3 + "']").attr('selected', 'selected');
					$("#BiAdults option[value='" + pax + "']").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value='" + pax2 + "']").attr('selected', 'selected');
					$("#BRoom3_iAdults option[value='" + pax3 + "']").attr('selected', 'selected');
				}
				else {
					showDivRoom(3);
					cleanValues(0);
					$("#AiAdults option[value=2]").attr('selected', 'selected');
					$("#ARoom2_iAdults option[value=2]").attr('selected', 'selected')
					$("#ARoom3_iAdults option[value=2]").attr('selected', 'selected')
					$("#BiAdults option[value=2]").attr('selected', 'selected');
					$("#BRoom2_iAdults option[value=2]").attr('selected', 'selected')
					$("#BRoom3_iAdults option[value=2]").attr('selected', 'selected')
				};
				break;
		};
	};
};
function submitForm() {
	var messg;
	var addFly;
	addFly = $('input[id^="addFlight"]').val();
	switch (addFly) {
		case 'True':
			if ($('#iDepCity').val() == -1 || $('#iDepCity').val() == "" || $('#sDepCity').val() === "") {
				messg = '<ol><li>Please select your departure city</li></ol><span></span>';
				chkValid('sDepCity', messg);
				$('#sDepCity').select().addClass('calendar-error');
				return false;
			}
			$('#iRetCity').val($('#iDepCity').val());
			break;
		case 'False':
			//$('#iRetCity').val(-1)
			//$('#iDepCity').val(-1)
			break;
	}
	var idate = $.trim($('#InDate1').val());
	switch (idate) {
		case 'mm/dd/yyyy':
		case 'Select Date':
		case '':
			messg = '<ol><li>Please select your departure date</li></ol><span></span>';
			chkValid('InDate1', messg);
			return false;
			break;
		default:
			break;
	}
	$('#iRoom').val(rom);
	$('#Rooms').val(rom);
	var paxAdult;
	var paxChild;
	var paxTotal;
	switch (rom) {
		case '1':
			paxAdult = $('#AiAdults').val();
			paxChild = $('#iChildren').val();
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val('');
			$('#Room3_iAdults').val('');
			break;
		case '2':
			paxAdult = Number($('#AiAdults').val()) + Number($('#ARoom2_iAdults').val());
			paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val());
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val($('#ARoom2_iAdults').val());
			$('#Room3_iAdults').val('');
			break;
		case '3':
			paxAdult = Number($('#iAdults').val()) + Number($('#Room2_iAdults').val()) + Number($('#Room3_iAdults').val());
			paxChild = Number($('#iChildren').val()) + Number($('#Room2_iChildren').val()) + Number($('#Room3_iChildren').val());
			$('#iAdults').val($('#AiAdults').val());
			$('#Room2_iAdults').val($('#ARoom2_iAdults').val());
			$('#Room3_iAdults').val($('#ARoom3_iAdults').val());
			break;
	};
	paxTotal = Number(paxAdult) + Number(paxChild);
	if (paxTotal > 6) {
		messg = '<ol><li>Max guest allowed (adults + children) are 6 !</li></ol><span></span>';
		chkValid('dvRoom1', messg);
		return false;
	};
	if (paxChild > 0) {
		var hwCh = $('#iChildren').val();
		var hwCh2 = $('#Room2_iChildren').val();
		var hwCh3 = $('#Room3_iChildren').val();
		if (hwCh > 0 && rom >= 1) {
			for (i = 1; i <= hwCh; i++) {
				var childAge = $('#iChild' + i + '').val();
				var ageCH;
				if (isNaN(childAge) || childAge == '' || (!isNaN(childAge) && (childAge < 2 || childAge > 11))) {
					if (isNaN(childAge) || childAge == '') {
						messg = '<ol><li>Please enter a valid age !</li></ol><span></span>';
						ageCH = '';
					}
					else if (childAge < 2) {
						messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
						ageCH = 2;
					}
					else {
						messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
						ageCH = 11;
					};
					chkValid('iChild' + i, messg);
					if (isNaN(childAge) || childAge == '')
						$('#iChild' + i + '').val('');
					else
						$('#iChild' + i + '').val(ageCH);

					$('#BiChild' + i + '').val($('#iChild' + i + '').val());
					return false;
				};
			};
		};

		if (hwCh2 > 0 && rom >= 2) {
			for (i = 1; i <= hwCh2; i++) {
				var childAge2 = $('#Room2_iChild' + i + '').val();
				var ageCH;
				if (isNaN(childAge2) || childAge2 == '' || (!isNaN(childAge2) && (childAge2 < 2 || childAge2 > 11))) {
					if (isNaN(childAge2) || childAge2 == '') {
						messg = '<ol><li>Please enter a valid age !</li></ol><span></span>';
						ageCH = '';
					}
					else if (childAge2 < 2) {
						messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
						ageCH = 2;
					}
					else {
						messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
						ageCH = 11;
					};
					chkValid('Room2_iChild' + i, messg);

					if (isNaN(childAge2) || childAge2 == '')
						$('#Room2_iChild' + i + '').val('');
					else
						$('#Room2_iChild' + i + '').val(ageCH);

					$('#BRoom2_iChild' + i + '').val($('#Room2_iChild' + i + '').val());
					return false;
				};
			};
		};

		if (hwCh3 > 0 && rom >= 3) {
			for (i = 1; i <= hwCh3; i++) {
				var childAge3 = $('#Room3_iChild' + i + '').val();
				if (isNaN(childAge3) || childAge3 == '' || (!isNaN(childAge3) && (childAge3 < 2 || childAge3 > 11))) {
					if (isNaN(childAge3) || childAge3 == '') {
						messg = '<ol><li>Please enter a valid age !</li></ol><span></span>';
						ageCH = '';
					}
					else if (childAge3 < 2) {
						messg = '<ol><li>All infants (2 and under) are considered as children age 2</li></ol><span></span>';
						ageCH = 2;
					}
					else {
						messg = '<ol><li>Child age is 11 or less</li></ol><span></span>';
						ageCH = 11;
					};

					if (pos == 1) {
						chkValid('Room3_iChild' + i, messg);

						if (isNaN(childAge3) || childAge3 == '')
							$('#Room3_iChild' + i + '').val('');
						else
							$('#Room3_iChild' + i + '').val(ageCH);

						$('#BRoom3_iChild' + i + '').val($('#Room3_iChild' + i + '').val());
					} else {
						chkValid('BRoom3_iChild' + i, messg);

						if (isNaN(childAge3) || childAge3 == '')
							$('#BRoom3_iChild' + i + '').val('');
						else
							$('#BRoom3_iChild' + i + '').val(ageCH);

						$('#Room3_iChild' + i + '').val($('#BRoom3_iChild' + i + '').val());

					};
					return false;
				};
			};
		};
	};
	//end adult / children validation    
	var qtyCity = Number($('#hwMnyCty').val()) + 1;
	var ctyCat = '';
	for (i = 0; i <= qtyCity; i++) {
		var catval = $('#ecityCat' + i + '').val(); if (catval == undefined) { catval = '' };
		if (i == 0) { ctyCat = ctyCat + catval }
		else if (i == qtyCity) { ctyCat = ctyCat + catval + ',' }
		else { ctyCat = ctyCat + ',' + catval };
	}
	$('#MiniPackCat').val(ctyCat);
	//$('#imgPriceIt' + pos).hide();
	//$('#imgLoading' + pos).show();
	var pckType = $('#PackType').val();
	var pckID = $('#Pkgid').val();
	switch (pckType) {
		case 'TP3':
			_bpURL = "https://reservation.tripmasters.com/Tourpackage4/Itinerary/Create";
			bookProcess = _bpURL + "?" + pckID
			break;
		case 'MC':
			bookProcess = "http://reservations.tripmasters.com/TVLAPI/Multicity3/MC_ComponentList.ASP?" + pckID
			break;
	};
	$('#frmToBook').attr('action', bookProcess);
	$('#frmToBook').submit();
	$('#utm_campaign').val() == "" ? $('#utm_campaign').val('' + utmValue + '') : '';
	var stringQuery = ''
	stringQuery = JSON.stringify($('#frmToBook').serializeObject());
	stringQuery = JSON.parse(stringQuery);
	delete stringQuery["__RequestVerificationToken"];
	stringQuery = JSON.stringify(stringQuery);
	setItemF("localStorageTMEDT21", stringQuery, 1);
};
function popError(obj, messg) {
	var objPos = $('#' + obj + '').offset();
	$('#divError').html(messg);
	$('#divError').show();
	if (messg.indexOf('All infants') != -1) {
		$('#divError').offset({ left: objPos.left - 100, top: objPos.top - 60 });
	}
	else {
		$('#divError').offset({ left: objPos.left - 85, top: objPos.top - 50 });
	};
	setTimeout("$('#divError').hide()", 2000);
};
// **** DATEPICKER **** //
// include block dates
// var blkdates = ["2016-12-15", "2016-12-16"]
var between = [];
function dateByDest() {
	var rangeBlk = blockDates.replace('B-', '');
	rangeBlk = rangeBlk.trim().split('-');
	var rangeBlkS = rangeBlk[0].split('*');
	var rangeBlkE = rangeBlk[1].split('*');
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
	var myDate = new Date();
	strDate = new Date(myDate.getTime() + 7 * 24 * 60 * 60 * 1000);

	var today90Days = new Date(myDate.getTime() + 90 * 24 * 60 * 60 * 1000);
	var strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
	if (between.indexOf(strDateString) != -1) {
		while (between.indexOf(strDateString) != -1) {
			strDate.setDate(strDate.getDate() + 1);
			strDateString = jQuery.datepicker.formatDate('yy-mm-dd', strDate);
		}
		if (today90Days <= strDate)
			$('.InDate1').val(jQuery.datepicker.formatDate('mm/dd/yy', strDate));
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

	});
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

function changeCabin(obj) {
	$('#Cabin option').each(function () {
		this.value === obj.id ? this.selected = 'selected' : '';
	})
}
function changeDateDesk(id, value) {
	$('input[id="InDate1"]').val(value);
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