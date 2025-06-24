//global variables
var _utDataIn = _utDataIn || []; //input for unitraq code
var _utFunctions = _utFunctions || []; //javascript functions to execute after unitraq code (on client side)

//here need to have already declared in website variables:
// _utRawUrl, _utRef, _utInputString, _utPlcIDs
// check fo variables if not declared to not have errors declared and set it to ""
if (typeof _utRawUrl == 'undefined') var _utRawUrl = "";
if (typeof _utRef == 'undefined') var _utRef = "";
if (typeof _utInputString == 'undefined') var _utInputString="";
if (typeof _utPlcIDs == 'undefined') var _utPlcIDs = "";
if (typeof _utEmail == 'undefined') var _utEmail = "";

var _utArray = _utInputString.split("@@");

//get _utSiteName from _utArray[0]
var _utSiteName = (function () {
	if (typeof _utArray[0] == 'undefined')
	{
		return "";
	}
	else
	{
		return _utArray[0];
	}
})();

//get _utDeptID from _utArray[1]
var _utDeptID = (function() {
	if (typeof _utArray[1] == 'undefined')
	{
		return 0;
	}
	else
	{
		return Number(_utArray[1]);
	}
})();

//get _utUtmCampaign from _utArray[2]
var _utUtmCampaign= (function() {
	if (typeof _utArray[2] == 'undefined')
	{
		return "direct";
	}
	else
	{
		return _utArray[2];
	}
})();

//get PgType for Website page - used in websites to obtain utPgType window parameter or url
var _utPgType = (function () {
    if (typeof _utArray[3] == 'undefined') {
		return "";
    }
    else {
		//check if ="" then not through global asax then build it from url file name
		if (_utArray[3] === '')
		{
			if (typeof (_utArray[4].split('/')[1]) !== 'undefined')
			{
				var sPageName=_utArray[4].split('/')[1];
				sPageName=sPageName.toLowerCase().replace(".aspx","")
				switch (sPageName) {
					case "default":
						return "DFLT";
					case "about_us":
						return "ABOUT";
					case "contact_us":
						return "CONTACT";
					case "terms":
						return "TERMS";
					case "security-privacy":
						return "SECPRV";
					case "booking_confirmation":
						return "BKGCONF";
					case "bookingconfirmation":
						return "BKGCONF";
					case "insurance":
						return "INSURANCE";
					case "payments":
						return "PAY";
					case "airlineancillaryfees":
						return "AIRANCFEES";
					case "call_me_back":
						return "CALLBACK";
					case "AgentCall":
						return "AgentCall";
					default:
						return sPageName.toUpperCase();
				}
			}
			else
			{
				return "";
			}
		}
		else
		{
			return _utArray[3];
		}
    }
})();



var _utPgTypeSuppID = (function () {
    //based on _utPgType check get from query string placeId for: area page; city page, country page; or for package page - packageid
    var startFrom, stopTo;
    switch (_utPgType) {
		case "SLFDRV":
		case "MLTYCOU":
		case "CRUS":
        case "ARE":
        case "COU":
		case "COUS":
        case "DSTI":
        case "HOTonPLC":
        case "CTY":
			if (typeof _utArray[5] !== 'undefined')
				return Number(_utArray[5]);
			break;
        case "PKG":
			if (typeof _utArray[6] !== 'undefined')
				return Number(_utArray[6]);
			break;
        case "INTRS": //interestID
			if (typeof _utArray[4] !== 'undefined'){
				if (typeof _utArray[4].split("/")[3] !== 'undefined')
					return Number(_utArray[4].split("/")[3].replace("i", ""));
			}
			break;
        case "TKBY":
			if (typeof _utArray[4] !== 'undefined'){
				startFrom = _utArray[4].indexOf('tkby');
				if (startFrom >=0){
					startFrom=startFrom+4;
				}
				else{
					return 0;
				}
				stopTo = _utArray[4].indexOf('_', startFrom);
				return Number(_utArray[4].substring(startFrom, stopTo));
			}
			break;
        case "CFB":
			if (typeof _utArray[4] !== 'undefined'){
				if (typeof _utArray[4].split('/')[1] !== 'undefined'){
					var tmpStr=_utArray[4].split('/')[1];
					startFrom = tmpStr.toLowerCase().indexOf('cfb');
					if (startFrom >=0){
						startFrom=startFrom+3;
					}
					else
					{
						return 0;
					}
					stopTo = tmpStr.indexOf('_', startFrom);
					return Number(tmpStr.substring(startFrom, stopTo));
				}
				else {
					return 0;
				}
			}
			break;
        case "TTBTLY":
			if (typeof _utArray[4] !== 'undefined'){
				if (typeof _utArray[4].split('/')[1] !== 'undefined') {
					var tmpStr=_utArray[4].split('/')[1];
					startFrom = tmpStr.toLowerCase().indexOf('ttbtly');
					if (startFrom >= 0){
						startFrom=startFrom+6;
					}
					else
					{
						return 0;
					}
					stopTo = tmpStr.indexOf('_', startFrom);
					return Number(tmpStr.substring(startFrom, stopTo));
				}
				else {
					return 0;
				}
			}
			break;
		case "HOT":
			if (typeof _utArray[4] !== 'undefined'){
				if (_utArray[4].split('/')[2] !== 'undefined'){
					var tmpStr=_utArray[4].split('/')[2];
					startFrom = tmpStr.toLowerCase().indexOf('hotel_description_pp');
					if (startFrom >=0){
						startFrom=startFrom+20;
					}
					else {
						return 0;
					}
					stopTo = tmpStr.indexOf('_', startFrom);
					return Number(tmpStr.substring(startFrom, stopTo));
				}
			}
			break;
		case "COMBCou":
			if (typeof _utArray[4] !== 'undefined'){
				if (typeof _utArray[4].split('/')[1] !== 'undefined'){
					_utPlcIDs=_utArray[4].split('/')[1].replace("_",",");
					if (typeof _utArray[4].split('/')[1].split('_')[0] !== 'undefined'){
						return Number(_utArray[4].split('/')[1].split('_')[0]);
					}
				}
			}
			break;
		case "MinPkg":
			if (typeof _utArray[4] !== 'undefined'){
				if (typeof _utArray[4].split('/')[1] !== 'undefined'){
					if (typeof _utArray[4].split('/')[1].split('_')[1] !== 'undefined') {
						return Number(_utArray[4].split('/')[1].split('_')[1].replace('mpk',''));
					}
				}
			}
			break;
        default:
            return 0;
    }
    return 0;
})();

var _utPlcID = (function () {
    // based on _utPgType check get plcId from querystring for area page, country page, city page, or analyze url string if not having plcId param
    switch (_utPgType) {
		case "CFB":
		case "TTBTLY":
		case "SLFDRV":
		case "CRUS":
		case "HOTonPLC":
		case "MLTYCOU":
        case "ARE":
        case "COU":
		case "COUS":
        case "DSTI":
        case "CTY":
        case "ChrmFPKG":
			if (_utArray[5] !== 'undefined')
            return Number(_utArray[5]);
        case "INTRS": //Interest page; placeId from querystring URL
			if (_utArray[4] !== 'undefined'){
				if (typeof _utArray[4].split('/')[2] !== 'undefined')
				return Number(_utArray[4].split('/')[2].toLowerCase().replace("c", ""));
			}
			break;
		
        default:
            return 0;
    }
    return 0;
})();

var _utProdItemID = (function () {
    //for package page get packageId from query string
    switch (_utPgType) {
        case "PKG":
        case "mobilePKG":
            if (_utArray[6] !== 'undefined')
				return Number(_utArray[6]);
        default:
            return 0;
    }
})();


//inline function that it is executed in the same time as declaration
(function(){
    _utDataIn.push(['_utCallType', 'Web']);
    _utDataIn.push(['_utSiteName',_utSiteName]);
    _utDataIn.push(['_utPgType',_utPgType]);
    _utDataIn.push(['_utPgTypeSuppID',_utPgTypeSuppID]);
    _utDataIn.push(['_utPlcID',_utPlcID]);
    _utDataIn.push(['_utRef',_utRef]);
    _utDataIn.push(['_utUtmCampaign',_utUtmCampaign]);
    _utDataIn.push(['_utUrl', _utRawUrl]);
    _utDataIn.push(['_utProdItemID',_utProdItemID]);
    _utDataIn.push(['_utDeptID', _utDeptID]);
	_utDataIn.push(['_utPlcIDs', _utPlcIDs]);
	_utDataIn.push(['_utEmail', _utEmail]);
})();