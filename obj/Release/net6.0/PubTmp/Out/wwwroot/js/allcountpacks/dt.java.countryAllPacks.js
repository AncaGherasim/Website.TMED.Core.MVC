
$(document).ready(function() {
    // check for what is/isn't already checked and match it on the fake ones
    $("input:checkbox").each(function() {
        (this.checked) ? $("#false" + this.id).addClass('falsechecked_1') : $("#false" + this.id).removeClass('falsechecked_1');
    });
    // function to 'check' the fake ones and their matching checkboxes
    $(".falsecheck_1").click(function() {
        ($(this).hasClass('falsechecked_1')) ? $(this).removeClass('falsechecked_1') : $(this).addClass('falsechecked_1');
        $(this.hash).trigger("click");
        return false;
    });

    $('a[id^="falsedotPrice"]').click(function() {
        ShowPackets();
    });
    $('a[id^="falsedotLen"]').click(function() {
        ShowPackets();
    });
    $('a[id^="falsedotCity"]').click(function() {
        ShowPackets();
    });

    SetOptionForPresentFilter();
    ShowPackets();
});

function SetOptionForPresentFilter() {
    var priceParts
    var lengthParts
    var citiesParts
    var presentFilter = ''
    presentFilter = $('#StrFilter').val();
    if (presentFilter == '')
        return;

    var filterParts = presentFilter.split('I');
    for (i = 0; i <= filterParts.length - 1; i++) {
        if (filterParts[i] != '' && filterParts[i] != undefined) {
            //alert(filterParts[i]);
            if (i == 0) {
                priceParts = filterParts[i].split('P');
                for (j = 0; j <= priceParts.length - 2; j++) {
                    $('#dotPrice' + priceParts[j]).prop('checked', true);
                    $('#falsedotPrice' + priceParts[j]).addClass('falsechecked_1');                    
                }
            }
            if (i == 1) {
                lengthParts = filterParts[i].split('L');
                for (j = 0; j <= lengthParts.length - 2; j++) {
                    $('#dotLen' + lengthParts[j]).prop('checked', true);
                    $('#falsedotLen' + lengthParts[j]).addClass('falsechecked_1');
                }
            }
            if (i == 2) {
                citiesParts = filterParts[i].split('C');
                for (j = 0; j <= citiesParts.length - 2; j++) {
                    $('#dotCity' + citiesParts[j]).prop('checked', true);
                    $('#falsedotCity' + citiesParts[j]).addClass('falsechecked_1');
                }
            }
        }        
    }
}

function EnableUnckechOption() {
    var noPriceOptions = $('input[type="checkbox"][id^="dotPrice"]:checked').length;  
    if (noPriceOptions == 0) {
        $('#uncheckPrice').removeClass('UncheckOption');
        $('#uncheckPrice').addClass('UncheckOptionDisabled');
    }
    else {
        $('#uncheckPrice').addClass('UncheckOption');
        $('#uncheckPrice').removeClass('UncheckOptionDisabled');        
    }

    var noLengthOptions = $('input[type="checkbox"][id^="dotLen"]:checked').length;
    if (noLengthOptions == 0) {
        $('#uncheckLength').removeClass('UncheckOption');
        $('#uncheckLength').addClass('UncheckOptionDisabled');        
    }
    else {
        $('#uncheckLength').addClass('UncheckOption');
        $('#uncheckLength').removeClass('UncheckOptionDisabled');        
    }

    var noCitiesOptions = $('input[type="checkbox"][id^="dotCity"]:checked').length;  
    if (noCitiesOptions == 0) {
        $('#uncheckCities').removeClass('UncheckOption');
        $('#uncheckCities').addClass('UncheckOptionDisabled');        
    }
    else {
        $('#uncheckCities').addClass('UncheckOption');
        $('#uncheckCities').removeClass('UncheckOptionDisabled');        
    }
}

function UncheckOptions(filterOption) {
    if (filterOption == 'price') {
        if ($('#uncheckPrice').hasClass('UncheckOptionDisabled'))
            return;            
        $('input[type="checkbox"][id^="dotPrice"]:checked').each(function() {
            $(this).prop('checked', false);
        });
        $('a[id^="falsedotPrice"]').each(function() {
            $(this).removeClass('falsechecked_1');
        });        
        ShowPackets();
    }

    if (filterOption == 'length') {
        if ($('#uncheckLength').hasClass('UncheckOptionDisabled'))
            return;                
        $('input[type="checkbox"][id^="dotLen"]:checked').each(function() {
            $(this).prop('checked', false);
        });
        $('a[id^="falsedotLen"]').each(function() {
            $(this).removeClass('falsechecked_1');
        });
        ShowPackets();
    }

    if (filterOption == 'city') {
        if ($('#uncheckCities').hasClass('UncheckOptionDisabled'))
            return;      
        $('input[type="checkbox"][id^="dotCity"]:checked').each(function() {
            $(this).prop('checked', false);
        });
        $('a[id^="falsedotCity"]').each(function() {
            $(this).removeClass('falsechecked_1');
        });
        ShowPackets();
    }      
}

function ShowOtherCities(divName, divScrollBack) {
    var disp = $('#' + divName).css('display');
    if (disp == 'none') {
        $('#' + divName).show();
        $('html, body').animate({ scrollTop: $('#' + divName).offset().top - 30 }, 300);
        $('#moreCitiesLink').hide();
        $('#CloseMoreCitiesLink').show();            
    }   
}

function CloseOtherCities(divName, divScrollBack) {
    $('html, body').animate({ scrollTop: $('#' + divScrollBack).offset().top - 30 }, 300);
    $('#' + divName).hide();
    $('#moreCitiesLink').show();
    $('#CloseMoreCitiesLink').hide();            
}

function BuildFilterExpression() {    
    var priceFilter=''
    $('input[type="checkbox"][id^="dotPrice"]:checked').each(function() {
        priceFilter = priceFilter + $(this).val() + 'P'
    });            

    var lengthFilter = ''
    $('input[type="checkbox"][id^="dotLen"]:checked').each(function() {
        lengthFilter = lengthFilter + $(this).val() + 'L'
    });    
        
    var citiesFilter=''
    $('input[type="checkbox"][id^="dotCity"]:checked').each(function() {
        citiesFilter = citiesFilter + $(this).val() + 'C'
    });    

    var filter = ''
    filter = priceFilter + 'I' + lengthFilter + 'I' + citiesFilter;

    return filter;
}

function ShowPackets() {
    EnableUnckechOption();
    $('#dvResp').hide();
    $('#dvResp').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    var filter = BuildFilterExpression();
    $('#StrFilter').val(filter);
    var plcid = $('#IDplace').val();
    var plcNa = $('#IDplaceName').val();   
    var OrderVal = $('#OrderVal').val()

    var options = {};
    var dat = {plcID: plcid,plcNA: plcNa,filter: filter,OrderVal: OrderVal}
    var dt = '{plcID:"' + plcid + '",plcNA:"' + plcNa + '",filter:"' + filter + '",OrderVal:"' + OrderVal + '"}';
    options.url = SiteName + "/FindCusPackInfo";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify(dat),
        options.dataType = "html";
    options.success = function (data) {
        $('#dvResp').html(data);
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvResp').show();
        OpenPage(1);
    };
    options.error = function (xhr, desc, exceptionobj) {
        $('#dvResp').html(xhr.responseText);
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvResp').show();
    };
    $.ajax(options);
    
}

function OpenPage(currentPage) {
    $('#dvPackets').hide();
    $('#dvPackets').html('');
    $('#dvWaitPacks').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWaitPacks').show();
    $('#footer').css("visibility", "hidden");   
     
    var totalPacks = $('#TotalPacks').val();
    var OrderVal = $('#OrderVal').val()
    if (OrderVal == "")
        OrderVal == "0"
    $('#idOrderBy').val(OrderVal);    
      
    var noPages = Math.ceil(totalPacks / 20);
    var pagesStr=''
    if (currentPage == 1)
        pagesStr = '<span class="pgStyleDisabled">&lt;&lt;&nbsp;Previous</span>'
    else
        pagesStr = '<span class="pgStyle"><a onclick="OpenPage(' + (currentPage-1) + ')">&lt;&lt;&nbsp;Previous</a></span>'
        
    pagesStr = pagesStr + '<span style="color:black;font-weight:Bold;">&nbsp;|&nbsp;Page:&nbsp;</span>'
        
    if (noPages <= 7) {
        for (i = 1; i <= noPages; i++) {
            if (i != currentPage)
                pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
            else
                pagesStr = pagesStr + '<span class="pgStyleSelected">' + i + '</span>';
        }
    }
    else {
        if (currentPage < 5) {            
            for (i = 1; i <= 5; i++) {
                if (i != currentPage)
                    pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                else
                    pagesStr = pagesStr + '<span class="pgStyleSelected">' + i + '</span>';
            }

            pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
            pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + noPages + ')">' + noPages + '</a></span>';
        }
        else {            
            pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(1)">1</a></span>';
            pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';

            if (currentPage + 2 < noPages) {
                for (i = currentPage - 1; i <= currentPage + 1; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                    else
                        pagesStr = pagesStr + '<span class="pgStyleSelected">' + i + '</span>';
                }

                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + noPages + ')">' + noPages + '</a></span>';
            }
            else {
                for (i = noPages - 4; i <= noPages; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                    else
                        pagesStr = pagesStr + '<span class="pgStyleSelected">' + i + '</span>';
                }
            }            
        }              
    }

    pagesStr = pagesStr + '&nbsp;|&nbsp;'
    if(currentPage==noPages)
        pagesStr = pagesStr + '<span class="pgStyleDisabled">Next&nbsp;&gt;&gt;</span>'
    else
        pagesStr = pagesStr + '<span class="pgStyle"><a onclick="OpenPage(' + (currentPage + 1) + ')">Next&nbsp;&gt;&gt;</a></span>'

    var allIds = $('#AllPackIds').val()
    var allIdsPages = allIds.split('|');
    var placeId = $('#IDplace').val();

    if (allIdsPages[currentPage - 1] != '') {

        var options = {};
        var dt = { placeID: placeId, packsIds: allIdsPages[currentPage - 1], OrderVal: OrderVal}
        options.url = SiteName + "/Api/PacksFindItinPage";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify(dt),
            options.dataType = "text";
        options.success = function (data) {
            //console.log("succes: ");
            //console.log(data);
            msg = data.substr(1, data.length - 2);
            if (msg != '') {
                window.scrollTo(0, 0);
                BuildPackets(msg);
                $('span[id^="idPages"]').html('');
                $('span[id^="idPages"]').html(pagesStr);
            }
            
            $('#header').css("visibility", "visible");
            $('#footer').css("visibility", "visible");
        };
        options.error = function (xhr, desc, exceptionobj) {
            $('#dvPackets').html(xhr.responseText);
        };
        $.ajax(options);


        //$.ajax({
        //    type: "POST",
        //    url: "/europe/WS_PackPage.asmx/sqlGetPacksFromPage",
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    data: '{placeID:"' + placeId + '", SiteUserId:"243", InternalComments:":.ED", packsIds:"' + allIdsPages[currentPage - 1] + '", OrderVal:"' + OrderVal + '"}',
        //    success: function(data) {
        //        msg = eval("(" + data.d + ")");
        //        if (msg != '') {
        //            window.scrollTo(0,0); 
        //            BuildPackets(msg);
        //            $('span[id^="idPages"]').html('');
        //            $('span[id^="idPages"]').html(pagesStr);
        //        }

        //        $('#header').css("visibility", "visible");
        //        $('#footer').css("visibility", "visible");
        //    },
        //    error: function(xhr, desc, exceptionobj) {
        //        $('#dvPackets').html(xhr.responseText);
        //    }
        //});
    }
    else {
        $('select[id^="idOrderBy"]').prop('disabled', 'disabled');
        $('#header').css("visibility", "visible");
        $('#dvWaitPacks').hide();
        $('#dvWaitPacks').html('');
        $('#dvPackets').html('<div style="margin:20px 20px 0px 20px;font-size:12px;color:navy;">0 itineraries found. Please try other combination.</div>')
        $('#dvPackets').show();
    }       
}

function BuildPackets(msg) {    
    var strMsg
    var strMsgLn
    var strDiv = '';
    var tmpStrURL = ''
    var placeName = $('#IDplaceName').val();
    var nights = '';
    var ntsText = '';
    msg = msg.replace('<div>', '');
    msg = msg.replace('</div>', '');    
    strMsg = msg.split('@')    
    for (i in strMsg) {
        if (i < strMsg.length - 1) {                                            
            strMsgLn = strMsg[i].split('|');

            strDiv = strDiv + '<div style="width:96%; border-bottom: dashed 1px #bdbcbc; margin:0 10px;clear:both;">' //Packet Container

            strDiv = strDiv + '<div style="float:left; margin-left:5px; width:120px;"><img id="img' + strMsgLn[0] + '" style="width:100px; height:100px;margin-top:15px" src="" alt=""/></div>' //Image

            strDiv = strDiv + '<div style="float:left;width:540px;">' //Div description
            //Title
            strDiv = strDiv + '<div class="Text_Arial16_BlueBold" style="margin-right:5px; padding-top:11px;clear:both;"><a href="' + SiteName + "/" + strMsgLn[14].replace(/\s/g, '_').toLowerCase() + '/' + strMsgLn[1].replace(/\s/g, '_').toLowerCase() + '/package-' + strMsgLn[0] + '">' + strMsgLn[1] + '</a>';
            //Guided/Partially Guided
            if (strMsgLn[13].indexOf("Partially") >= 0)
                strDiv = strDiv + '&nbsp;<span><img id="imgPartiallyGuid' + +strMsgLn[0] + '" src="https://pictures.tripmasters.com/siteassets/d/GuidedPartially.jpg" alt="" style="vertical-align:middle;margin-top:-5px;" onMouseOver="showPopUp(this.id)" onMouseOut="hidePopUp(this.id)"/></span>'
            else if (strMsgLn[13].indexOf("Guided") >= 0)
                strDiv = strDiv + '&nbsp;<span><img id="imgGuided' + +strMsgLn[0] + '" src="https://pictures.tripmasters.com/siteassets/d/Guided.jpg" alt="" style="vertical-align:middle;margin-top:-5px;" onMouseOver="showPopUp(this.id)" onMouseOut="hidePopUp(this.id)"/></span>'

            strDiv = strDiv + '</div>' //END Title
            //Nights & price                       
            strDiv = strDiv + '<div style="margin-top:5px;">'
            if (strMsgLn[3] != '') {
                if (strMsgLn[6].indexOf('Inflexible package') == -1){
                    nights = strMsgLn[3] + ' to ' + (parseInt(strMsgLn[3]) + Math.round(parseInt(strMsgLn[3]) / 2)) + '+ nights';
                    ntsText = 'by selecting dates, No. of nights in each city and your departure city.';
                    strDiv = strDiv + '<span id="ntsBubble' + strMsgLn[0] + '" name="' + nights.replace(/\s/g, "_") + '|' + ntsText.replace(/\s/g, "_") + '" title="' + nights.replace(/\s/g, "_") + '|' + ntsText.replace(/\s/g, "_") + '" class="Text_12Arial_BlackBold" style="border-bottom:dashed 1px black;cursor:pointer;">' + nights + '</span>'
                }
                else {
                    nights = strMsgLn[3] + ' nights';
                    ntsText = 'by selecting date, and your departure city.';
                    strDiv = strDiv + '<span id="ntsNoBubble' + strMsgLn[0] + '" name="' + nights.replace(/\s/g, "_") + '|' + ntsText.replace(/\s/g, "_") + '" title="' + nights.replace(/\s/g, "_") + '|' + ntsText.replace(/\s/g, "_") + '" class="Text_12Arial_BlackBold">' + nights + '</span>'
                }                
            } 
            if (strMsgLn[4] != 9999 && strMsgLn[4] != '')
                strDiv = strDiv + '&nbsp;from&nbsp;<span class="Text_Arial15_Orange"><b>' + formatCurrency(strMsgLn[4], 0) + '</b></span>';
            strDiv = strDiv + '</div>'

            //Customer feedback
            if (strMsgLn[7] != '0') {
                var url = SiteName + "/" + strMsgLn[14].replace(/\s/g, '_').toLowerCase() + "/" + strMsgLn[1].replace(/\s/g, '_').toLowerCase() + "/feedback-" + strMsgLn[0] + "'"
                strDiv = strDiv + '<div style="margin-top:5px;"><a style="color:#4056c6;" href="javascript:openLinkInNewWindow(' + "'" + url + ');">Customer feedback (' + strMsgLn[7] + ') <img src="https://pictures.tripmasters.com/siteassets/d/FeedbackBox.gif" width="21" height="16" border="0"/></a></div>'
            }
            //Description
            
            var matchChar = new RegExp(/<[^<>]+>/g);
            var descr = strMsgLn[2];
            descr = descr.replace(matchChar, "")           
            if (descr.length > 350) {
                descr = descr.substring(0, 350);                
                descr = descr + ' ... ';
            }            
            strDiv = strDiv + '<div style="margin-top:15px;">' + descr + '</div>'
            
            //PacketInfo Div
            var divInfoName = "'" + "divInfo" + strMsgLn[0] + "'";
            strDiv = strDiv + '<div style="margin-top:8px;cursor:pointer;padding-bottom:20px;width:130px;"><img id="imgInfo' + strMsgLn[0] + '" src="https://pictures.tripmasters.com/siteassets/d/PackageIncludes.jpg" onclick="dvOpenMain(' + divInfoName + ');"/></div>'

            //Start div info
            strDiv = strDiv + '<div id="divInfo' + strMsgLn[0] + '" style="display:none; border:solid 1px #1f67c8; width:450px; background-color:#FFF;position:absolute;">'
            strDiv = strDiv + '<div align="right" style="padding:3px 10px; font-size:12px;color:#4056c6;"><span style="cursor:pointer" onclick="dvCloseMain(' + divInfoName + ')">close [ - ]</span></div>'
            strDiv = strDiv + '<div class="Text_Arial16_BlueBold" style="margin:0px 20px 0px 20px;">' + strMsgLn[1] + '</div>'
            strDiv = strDiv + '<div style="margin:5px 0px 0px 20px;">'
            if (strMsgLn[3] != '') {
                strDiv = strDiv + '<span id="DivInfntsBubble' + strMsgLn[0] + '" name="' + nights.replace(/\s/g, "_") + '|' + ntsText.replace(/\s/g, "_") + '" class="Text_12Arial_BlackBold">' + nights + '</span>'
            }
            if (strMsgLn[4] != 9999 && strMsgLn[4] != '')
                strDiv = strDiv + '&nbsp;from&nbsp;<span class="Text_Arial15_Orange"><b>' + formatCurrency(strMsgLn[4], 0) + '</b></span>&nbsp;w/air,  hotel &amp; air taxes*';
            strDiv = strDiv + '</div>'

            if (strMsgLn[4] != 9999 && strMsgLn[4] != '')
                strDiv = strDiv + '<div class="Text_12_Gray" style="margin:8px 20px 0px 20px;"> This sample price includes ALL air taxes & fuel surcharges: ' + strMsgLn[10] + ' for arrival on ' + strMsgLn[8] + ', departure from ' + strMsgLn[9] + '. Choose your own departure city and dates.</div>'
            strDiv = strDiv + '<div class="Text_12Arial_BlackBold" style="margin:25px 0px 0px 20px;">This ' + strMsgLn[3] + ' night sample itinerary includes:</div>'
            strDiv = strDiv + '<div style="margin:3px 30px 0px 20px;">' + strMsgLn[5] + '</div>'
            //Image customize
            strDiv = strDiv + '<div style="margin:20px auto; width:140px;"><a href="' + SiteName + "/" + strMsgLn[14].replace(/\s/g, '_').toLowerCase() + "/" + strMsgLn[1].replace(/\s/g, '_').toLowerCase() + '/package-' + strMsgLn[0] + '"><img width="131" height="34" border="0" src="https://pictures.tripmasters.com/siteassets/d/MoreDetails.jpg"></a></div>';
            strDiv = strDiv + '</div>' //END Div Info

            strDiv = strDiv + '</div>' // END Div description
            strDiv = strDiv + '</div>' // END Packet Container
            
            if (i == 4) {
                strDiv = strDiv + '<div style="width:96%; margin:0 10px; border-top: dashed 1px #bdbcbc; padding:5px 0px 15px 0px; text-align:center;clear:both;"><a href="/' + 'build_your_own_vacation"><img src="https://pictures.tripmasters.com/siteassets/d/BuildOnYourOwn_Large.jpg" style="margin-top:10px;border-style:none;"/></a></div>'
            }            
        }
    }
    
    if (strMsg.length - 1 <= 4) {
        strDiv = strDiv + '<div style="width:96%; border-bottom: dashed 1px #bdbcbc; margin:0 10px; border-top: dashed 1px #bdbcbc; padding:5px 0px 15px 0px; text-align:center;clear:both;"><a href="/' + 'build_your_own_vacation"><img src="https://pictures.tripmasters.com/siteassets/d/BuildOnYourOwn_Large.jpg" style="margin-top:10px;border-style:none;"/></a></div>'                
    }
      
    $('#dvWaitPacks').hide();      
    $('#dvWaitPacks').html('');
    $('#dvPackets').html(strDiv);
    $('#dvPackets').show();   
    
    $('span[id^="ntsBubble"]').each(function(index, item) {
        var currentId = $(this).prop('id');
        var title = $(this).prop('title');
        priceBubble(currentId, title.replace(/\_/g, " "));
    }); 
    
    SetPictures(msg);
}

function SetPictures(msg) {
    msg = msg.replace('<div>', '');
    msg = msg.replace('</div>', '');
    strMsg = msg.split('@')
    for (i in strMsg) {
        if (i < strMsg.length - 1) {
            strMsgLn = strMsg[i].split('|');              
            $('#img' + strMsgLn[0]).prop('src', 'https://pictures.tripmasters.com' + strMsgLn[12].toLowerCase());
        }
    }
}

function getOrderValue() {
    var valOrderBy = $('#idOrderBy option:selected').val();    
    $('#OrderVal').val(valOrderBy);
    ShowPackets();
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

function priceBubble(obj, ntsPrts) {    
    $('#' + obj + '').tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass("arrow")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        },
        content: function () {
            var pakNTSs = ntsPrts.split('|');
            return '<div class="Text_Arial12" style="margin:10px">This packages is recommended for ' + pakNTSs[0] + '.<br /><br /><b>Customize it </b> ' + pakNTSs[1] + '</div>';
        }
    });
}

function dvOpenMain(objID) {
    var img = $('#img' + objID.replace("divInfo", ""));
    var imgInf = $('#imgInfo' + objID.replace("divInfo", ""));
         
    $('#' + objID + '').css("top", img.offset().top-4);
    $('#' + objID + '').css("left", imgInf.left); 
        
    $('#' + objID + '').show(300);
    $('html, body').animate({ scrollTop: $('#' + objID).offset().top - 200}, 300);
}

function dvCloseMain(dvM) {
    $('#' + dvM + '').hide(100);
}

function countryDest(thisCou){
	var $dvPos = $('#linkHeader');
	var $dvCont = $('#navDest');
	var dvPos = document.getElementById('dvTtl');
	var dvIns = '<div style="float:left; margin:0px; width:150px; pading-left:5px;" align="left">'
    $.ajax({
        type: "GET",
        url: SiteName + "/Api/Vacations/EDDestinos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var plcD = data;
            var dtC = 0
            var nwurl
            jQuery.each(plcD, function (data) {
                if (dtC % 8 == 0 && dtC > 0) { dvIns = dvIns + '</div><div style="float:left; margin:0px; width:150px;" align="left">' }
                nwurl = SiteName + "/" + this.plcNA.replace(/\s/g, '_').toLowerCase() + "/vacations'"
                dvIns = dvIns + '<div id="eachDST" onclick="window.location=' +"'" + nwurl + '">' + this.plcNA + '</div>'
                ++dtC
            });
            dvIns = dvIns + '</div><div style="clear:both"></div>'
            $('#destVal').html(dvIns);
            var popP = $dvPos.offset();
            var popT = popP.top + 35;
            var popL = popP.left - 570;
            $dvCont.prop('style', 'position:absolute; z-index:9999; width:auto; margin-left:-340px; left:50%;  top:' + popT + 'px;');
            $dvCont.slideDown("slow");
            //$dvCont.show(600);
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText + ' = error');
        }
    });
}


function openLinkInNewWindow(url) {
    var windowWidth = screen.width - 300;
    var windowHeight = screen.height - 300;
    
    var LeftPosition
    var TopPosition
    var navAg = navigator.userAgent
    
    LeftPosition = (screen.width) ? (screen.width - windowWidth) / 2 : 0;
    TopPosition = (screen.height) ? (screen.height - windowHeight) / 2 : 0;
        
    if (navAg.indexOf('Firefox') >= 0) {
        settings = 'height=' + windowHeight + ',width=' + windowWidth + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable,toolbar=yes'
    }
    else if (navAg.indexOf('Chrome') >= 0) {
    settings = 'height=' + windowHeight + ',width=' + windowWidth + ',top=' + TopPosition + ',left=' + LeftPosition + ''
    }
    else {
        settings = 'height=' + windowHeight + ',width=' + windowWidth + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=yes,resizable,location=yes'
    }
    window.open(url, "newWindow", settings);
           
}