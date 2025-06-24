// JavaScript Document
var weiPacks = new Array;
var eachWei;
var weiLn;
var dvHtml;
var nts;
var dstRel;
var dstCmb;
var relDST;
var eachDST;
var dvCount;
var dvShwHid;
var picTyp;
var dvBg;
var SiteName;
$(document).ready(function() {
	weiPacks = $('#inpWeiPacks').val().split('~');
	//packSC & "|" & packID & "|" & packNA & "|" & packPR & "|" & packDU & "|" & packDS & "|" & packIN &"|"& related
    dvHtml = ""
    //console.log("weiPacks.length: ")
    //console.log(weiPacks.length)
	for(i=0;i<weiPacks.length;i++){
		eachWei = weiPacks[i].split('|');
	relDST = eachWei[9].split('@');
		dstRel = ''
		dstCmb = '<div>'
		eachDST =''
		dvCount = 0
		if(i%2 == 0){dvBg = '#EAF2FF'}
		if(i%2 == 1){dvBg ='white'}
		if (i<=2){
			dvShwHid = 'show';
			picTyp = 'https://pictures.tripmasters.com/siteassets/d/minus.jpg';
		}
		else{
			dvShwHid='none';
			picTyp = 'https://pictures.tripmasters.com/siteassets/d/Plus.jpg';
		}
        $.each(relDST, function () {
            //console.log(" eachDST: ")
            //console.log(eachDST)

			eachDST = this.split('^')
			if (eachDST[3] != 5){
				if (eachDST[3] == 6){
					 dstRel = dstRel  + '<span style="margin-right:10px; padding:8px 0px;"><a href="/'+ eachDST[1].replace(/\s/g,'_') +'/vacations"><u>' + eachDST[1] +'('+eachDST[2]+')</u></span></a>'
					}
					else{
					 dstRel = dstRel  + '<span style="margin-right:10px; padding:8px 0px;"><a href="/' +  eachDST[1].replace(/\s/g,'_') +'/vacations"><u>' + eachDST[1] +'('+eachDST[2]+')</u></span></a>'
					}
			}
			if (eachDST[3] == 25 || eachDST[3] == 1){
				dstCmb = dstCmb +'<div style="float:left; width:auto; margin-right:10px; margin-top:5px;">'
				dstCmb = dstCmb + '<a href="#dotP' + eachWei[1] + eachDST[0] + '" class="falsecheck" id="falsedotP' + eachWei[1] + eachDST[0] + '">' + eachDST[1] + '</a>'
				dstCmb = dstCmb + '<input type="checkbox" name="dotP' + eachWei[1] + eachDST[0] + '" id="dotP' + eachWei[1] + eachDST[0] + '" style="display:none" value="' + eachDST[0] + '|' + eachDST[1] + '"/>' 
				dstCmb = dstCmb +'</div>'
				dvCount ++
			}
		});
		
		dstCmb = dstCmb +'<div style="clear:both"></div></div>'
		
		if (i == 3) { dvHtml = dvHtml +'<div class="Text_Arial16_BlueBold" style="padding:15px 5px 10px 5px; margin-top:10px;">More Itineraries:</div><div align="center" style="margin-bottom:10px;"><img class="imgLineBlue" src="https://pictures.tripmasters.com/siteassets/d/LineBlueCruise.jpg" width="400" height="1" /></div>'}
					
		 dvHtml = dvHtml  + '<div style="margin-top:15px; padding:5px 5px 2px 5px;  background-color:'+dvBg+';">'
		
		
         dvHtml = dvHtml  + '<div style="padding:5px 0px 2px 0px; float:left; margin-right:5px;" align="center"><img src="'+picTyp+'" name="pic'+eachWei[1]+'" width="9" height="9" align="absmiddle" id="pic'+eachWei[1]+'" style="cursor:pointer" onclick="openDvInfo('+eachWei[1]+')"/></div>'
		
		dvHtml = dvHtml  + '<div style="width:60%; padding:2px 0px 2px 0px; float:left; word-wrap:break-word;"><span style="cursor:pointer" class="Text_Arial12_BlueBold" onclick="openDvInfo('+eachWei[1]+')">'+ eachWei[2] +'</span></div>'
		if (eachWei[3] != 9999){
			if(eachWei[4].indexOf('nights')>-1){nts = eachWei[4]}
			else{nts = eachWei[4] +' nights'}
			dvHtml = dvHtml  + '<div class="Text_10_GrayBold" style="padding:2px 0px 2px 0px; float:right; width:35%;" align="right"><span style="cursor:pointer" onclick="openDvInfo('+eachWei[1]+')">'+ nts +' from <b class="Text_Arial10_Orange">'+formatCurrency(Number(eachWei[3])) +'*</b></span></div>'
		}
		else{
			dvHtml = dvHtml  + '<div class="Text_10_GrayBold" style="padding:2px 0px 2px 0px; float:right; width:35%;" align="right"><span style="cursor:pointer" onclick="openDvInfo('+eachWei[1]+')">More details</span></div>'
		}
		dvHtml = dvHtml  + '<div style="clear:both"></div>'
		dvHtml = dvHtml  + '</div>'
		
		dvHtml = dvHtml + '<div id="dvInf'+eachWei[1]+'" style="display:'+dvShwHid+'; margin-top:10px;">'
		
		dvHtml = dvHtml  + '<div  style="padding:2px 5px 5px 5px;">'
		dvHtml = dvHtml  + '<div class="Text_Arial11" style="padding:2px 0px 2px 0px;"><img src="https://pictures.tripmasters.com'+ eachWei[7] +'" width="70" height="70" border="2" align="left" style="border:solid 2px #CCC; margin:0px 10px 10px 0px;"/> ' + eachWei[5] +'</div>'
		dvHtml = dvHtml  + '<div style="clear:both"></div>'
		dvHtml = dvHtml  + '</div>'
		
		dvHtml = dvHtml  + '<div style="padding:2px 5px 5px 5px;">'
        dvHtml = dvHtml  + '<div style="float:left; width:15%;" class="Text_Arial11"><b>Included:</b></div>'
        dvHtml = dvHtml  + '<div style="float:left; width:80%; word-wrap:break-word;" class="Text_Arial11">&nbsp;&middot;&nbsp;'+ eachWei[6].replace(/[\r\n]/g,"<br>&nbsp;&middot;&nbsp;") +'</div>'
        dvHtml = dvHtml  + '<div style="clear:both"></div>'
        dvHtml = dvHtml  + '</div>'
		dvHtml = dvHtml  + '<div>&nbsp;</div>'
		dvHtml = dvHtml + '<div style="padding:5px 35px;" align="right"><a href="/' + eachWei[8] + '/' + eachWei[2].replace(/\s/g, '_') + '/package-' + eachWei[1] + '"><img src="https://pictures.tripmasters.com/siteassets/d/BUT_CustomizeIt.gif" border="0" /></a></div>'
		
		dvHtml = dvHtml + '<div aling="center" style="margin:10px 0px 5px 0px;"><img class="imgseparator" src="https://pictures.tripmasters.com/siteassets/d/separator_choice.gif"></div>'
				
		
		dvHtml = dvHtml  + '<div class="relPacks" style="padding:2px 5px 5px 10px;">'
		dvHtml = dvHtml  + '<div class="Text_Arial11_LightBold" style="padding:5px 0px;">Related Destinations</div>'
		dvHtml = dvHtml  + '<div style="padding:5px 0px; word-wrap:break-word;">'
		dvHtml = dvHtml  + dstRel
		dvHtml = dvHtml  + '</div>'
		dvHtml = dvHtml  + '</div>'
		
		dvHtml = dvHtml + '<div aling="center" style="margin:5px 0px"><img class="imgseparator" src="https://pictures.tripmasters.com/siteassets/d/separator_choice.gif"></div>'
		
		dvHtml = dvHtml  + '<div class="relPacks" style="padding:2px 5px 5px 10px;">'
		dvHtml = dvHtml  + '<div class="Text_Arial11" style="padding:5px 0px; color:black;"><b>For more choices, combine cities found in this itinerary:</b></div>'
		dvHtml = dvHtml  + '<form name="frmFind'+eachWei[1]+'" id="frmFind'+eachWei[1]+'" method="post" style="margin:0px">'
		dvHtml = dvHtml + dstCmb
		dvHtml = dvHtml + '<input type="hidden" name="allID" id="allID" value=""/>'
		dvHtml = dvHtml + '<input type="hidden" name="allNA" id="allNA" value=""/>'
		dvHtml = dvHtml  + '</form>'
		dvHtml = dvHtml  + '</div>'
		var frmNA = "'frmFind"+eachWei[1]+"'"
		dvHtml = dvHtml + '<div style="padding:10px 5px;" align="center"><a href="javascript:findPacks('+frmNA+')"><b>>>Find similar packages</b></a></div>'
		dvHtml = dvHtml + '<div style="border-bottom:solid 1px #CCC;">&nbsp;</div>'
		
		dvHtml = dvHtml + '</div>'
	}
	
	$('#dvPacksW').html(dvHtml);
	$('#dvPacksW').show();
	$('#dvPacksWait').hide();

	// check for what is/isn't already checked and match it on the fake ones
	$("input:checkbox").each(function() {
	    (this.checked) ? $("#false" + this.id).addClass('falsechecked') : $("#false" + this.id).removeClass('falsechecked');
	});
	// function to 'check' the fake ones and their matching checkboxes
	$(".falsecheck").click(function() {
	    ($(this).hasClass('falsechecked')) ? $(this).removeClass('falsechecked') : $(this).addClass('falsechecked');
	    $(this.hash).trigger("click");
	    return false;
	});
//--> end doc ready
});

function openDvInfo(pkID){
	var shPic = 'pic'+pkID;
	var shDiv = 'dvInf'+pkID;
	var toSH = $('#'+shPic+'').attr('src');
	if (toSH.indexOf('Plus') != -1){
		$('#' + shPic + '').attr('src','https://pictures.tripmasters.com/siteassets/d/minus.jpg');
		$('#'+shDiv+'').show();
	}
	else{
		$('#' + shPic + '').attr('src','https://pictures.tripmasters.com/siteassets/d/Plus.jpg');
		$('#'+shDiv+'').hide();
	}
}
function moreCtyDes(imgSrc,plcid){
	var picSrc = imgSrc;
	if(imgSrc == ''){
		picSrc = $('#img'+plcid+'').attr('src');
	}
	if (picSrc.indexOf('plus') > 0){
		$('#plus'+plcid+'').hide();
		$('#minus'+plcid+'').show();
		$('#img' + plcid + '').attr('src','https://pictures.tripmasters.com/siteassets/d/minus.gif');
		$('#spMore'+plcid+'').html(' close info');
	}
	else{
		$('#plus'+plcid+'').show();
		$('#minus'+plcid+'').hide();
		$('#img' + plcid + '').attr('src','https://pictures.tripmasters.com/siteassets/d/plus.gif');
		$('#spMore'+plcid+'').html(' more info ...');
	}
}
/* TO TAKE ID FROM FORM TO FIND PACKAGES */
function findPacks(formID) {
    //alert(formID)
    var idForm = formID;
    var idString = $('#' + idForm + '').serialize();   
    var idStrParts = '';
    var idxOf = '';
    var idValP = '';
    var idVal = '';
    var idValN = '';
    var idToFind = '';
    var idID = '';
    var idNA = '';
    var chkCHK = 0;	
    idString = idString.replace(/\+/g,' ');
	idString = idString.replace(/\%7C/g,'|');
    idStrParts = idString.split('&');
	for (i = 0; i < idStrParts.length; i++) {
        idValP = idStrParts[i].split('=');
        if (idValP[0].indexOf("RequestVerificationToken") > 0)
        {
            continue;
        }
		if (idValP[1] != ''){
			chkCHK = chkCHK + 1
			idValN = idValP[1].split('|');
			if (chkCHK > 1){
				idID = idID +','+  idValN[0];
				idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
			}
			else{
				idID = idValN[0];
				idNA = idValN[1].replace(/\s/g,'-');
			}
			
		}
		
	}
	if (idID == ''){
		alert('Please check at least one box. Thanks!');
		return;
	}
	else{
	    $("#" + idForm + " input[id=allID]").val(idID);
	    $("#" + idForm + " input[id=allNA]").val(idNA);	
		$('#' + idForm + '').attr('action', SiteName + '/' + idNA.toLowerCase() + '/find-packages');
        $('#' + idForm + '').submit();
		//$('#' + idForm + '').reset();
	}
}
function formatCurrency(num) {
num = num.toString().replace(/\$|\,/g,'');
if(isNaN(num))
num = "0";
sign = (num == (num = Math.abs(num)));
num = Math.floor(num*100+0.50000000001);
cents = num%100;
num = Math.floor(num/100).toString();
if(cents<10)
cents = "0" + cents;
for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
num = num.substring(0,num.length-(4*i+3))+','+
num.substring(num.length-(4*i+3));
return (((sign)?'':'-') + '$' + num + '.' + cents);
}
function dvOpenMain(objID) {
    $('#dv' + objID + '').show();
}
function dvCloseMain(dvM) {
    $('#' + dvM + '').hide();
}