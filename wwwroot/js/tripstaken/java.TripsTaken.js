$(document).ready(function() {
    $('img[id^="img"]').each(function() {
        var url = $(this).attr('data');
        if (url != 'none') {
            $(this).css({ "width": "50px", "height": "50px" })
            $(this).attr('src', 'https://pictures.tripmasters.com' + url);
            $(this).attr('data', '');
        }
    });

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

    var cityId;
    var cityTxt;
    var divType = '';
    $('div[id*="city"]').hover(function() {        
        var divId = $(this).attr('id');
        cityTxt = $.trim($('#' + divId).text());
        if (divId.indexOf('ccity') >= 0) {
            cityId = divId.replace('ccity', '');
            if (cityTxt.length >= 28) {
                $('#falsedotCCity' + cityId).text(cityTxt.substr(0, 26) + "..");
            }
            var cityId_ = "'" + cityId + "'";
            divType = "'CCity'";            
        } else {
            cityId = divId.replace('city', '');
            if (cityTxt.length >= 28) {
                $('#falsedotCity' + cityId).text(cityTxt.substr(0, 26) + "..");
            }
            var cityId_ = "'" + cityId + "'";
            divType = "'City'";
        }
        $(this).css({ "background-color": "#E9EEF8", "border-radius": "3px" });
        $(this).append('<span style="position:relative;float:right; top:-21px;right:13px;color:#6C8BC6;text-decoration:underline;cursor:pointer;" onclick="setCheckboxOnly(' + cityId_ + ',' + divType + ')">only</span>');
    },
    function() {
        $(this).css("background-color", "");
        $(this).find("span:last").remove();
        var divId = $(this).attr('id');
        if (divId.indexOf('ccity') >= 0) {
            $('#falsedotCCity' + cityId).text(cityTxt);
        } else {
            $('#falsedotCity' + cityId).text(cityTxt);
        }
    });

    $('a[id^="falsedotCity"]').click(function() { GetPacksWithFeeds(); });
    $('a[id^="falsedotCCity"]').click(function() { GetPacksWithFeeds(); });
    $('.resetFilters').click(function() {
        $('a[id^="falsedotCity"]').removeClass().addClass('falsecheck_1').addClass('falsechecked_1');
        $('a[id^="falsedotCCity"]').removeClass().addClass('falsecheck_1').addClass('falsechecked_1');
        $('input[type="checkbox"][id^="dotCity"]').prop("checked", true);
        $('input[type="checkbox"][id^="dotCCity"]').prop("checked", true);
        $('#dvRankCities').show();
        $('#dvCountryCities').hide();
        scrollTo(0, $('#topPosition').offset().top - 1);    
        GetPacksWithFeeds();
    });

    $('input[type="radio"][name="orderValue"]').click(function () { GetPacksWithFeeds(); });

    //---- When CityId is coming --- 07/24/2015---//
    var showOnlyCity = $('#Place').val();
    var ifExist = $('#falsedotCCity' + showOnlyCity).length;
    if (showOnlyCity != "-1") {
        if (ifExist > 0) {
            $('#dvRankCities').hide();
            $('#dvCountryCities').show();
            scrollTo(0, $('#topPosition').offset().top - 1);
            setCheckboxOnly(showOnlyCity, 'CCity');
            scrollTo(0, $('#falsedotCCity' + showOnlyCity).offset().top - 10);
        }
    }
    else {
        GetPacksWithFeeds();
    }
});
function ShowOrHideDiv() {    
    if ($('#dvCountryCities').css('display') == 'none') {
        $('#dvRankCities').hide();
        $('#dvCountryCities').show();               
    } else {    
        $('#dvCountryCities').hide();
        $('#dvRankCities').show();        
    }
    scrollTo(0, $('#topPosition').offset().top - 1);
    GetPacksWithFeeds();
}
function setCheckboxOnly(Id, divType) {    
    $('a[id^="falsedot'+divType+'"]').removeClass().addClass("falsecheck_1");
    $('input[id^="dot'+divType+'"]').prop("checked", false);

    $('#falsedot' + divType + Id).addClass('falsechecked_1');
    $('#dot' + divType + Id).prop("checked", true);
    GetPacksWithFeeds();
}
function BuildFilterExpression() {
    var filter = ''
    if ($('#dvCountryCities').css('display') == 'none') {
        $('input[type="checkbox"][id^="dotCity"]:checked').each(function() {        
            filter = filter + $(this).val() + 'C'         
        });
    } else {
        $('input[type="checkbox"][id^="dotCCity"]:checked').each(function() {        
            filter = filter + $(this).val() + 'C'        
        });
    }
    if (filter == '') filter = 'none'
    var orderVal = $('input[name="orderValue"]:checked').val();
    return filter + '|' + orderVal;
}
function GetPacksWithFeeds() {
    $('#dvResp').hide();
    $('#dvResp').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    var filter = BuildFilterExpression();
    var cId = $('#CountryId').val();

    var options = {};
    options.url = SiteName + "/Api/CityTripsTakenFeeds";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify({SSFilter: filter , Ids: cId }),
    options.dataType = "text";
    options.success = function (data) {
        //console.log("succes: ");
        //console.log(data);
        msg = data.substr(1, data.length - 2);
        var msgParts = msg.split('@');
        $('#FeedsIdsPages').val(msgParts[0]);
        $('#spTotalFeeds').html('(' + msgParts[1] + ' total)');
        $('#TotalFeeds').val(msgParts[1]);
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
    //console.log("OpenPage ");
    //console.log(currentPage);
    $('#dvResp').hide();
    $('#dvResp').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    var filter = BuildFilterExpression();
    var orderVal = filter.split('|')
    var allIds = $('#FeedsIdsPages').val()
    var allIdsPages = allIds.split('|');
    if (allIdsPages[currentPage - 1] != '') {

        var options = {};
        options.url = SiteName + "/TripsTakenCustomerFeedbacks";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify({SSFilter: allIdsPages[currentPage - 1] , Ids: orderVal[1] }),
            options.dataType = "html";
        options.success = function (data) {
            //console.log("before SetPages");
            SetPages(currentPage);
            $('#dvResp').html(data);
            $('#dvWait').html('');
            $('#dvWait').hide();
            $('#dvResp').show();

            // check for what is/isn't already checked and match it on the fake ones
            $('input[type="checkbox"][name^="xdot"]').each(function () {
                (this.checked) ? $("#false" + this.id).addClass('falsechecked_1') : $("#false" + this.id).removeClass('falsechecked_1');
            });
            // function to 'check' the fake ones and their matching checkboxes
            $('a[id^="falsexdot"].falsecheck_1').click(function () {
                ($(this).hasClass('falsechecked_1')) ? $(this).removeClass('falsechecked_1') : $(this).addClass('falsechecked_1');
                $(this.hash).trigger("click");
                return false;
            });
        };
        options.error = function (xhr, desc, exceptionobj) {
            console.log("error");
      $('#dvResp').html(xhr.responseText);
            $('#dvWait').html('');
            $('#dvWait').hide();
            $('#dvResp').show();
        };
        $.ajax(options);

    } else {
        $('#dvResp').html('<div style="margin:20px 20px 0px 20px;font-size:14px;color:#19255f;">0 activities found. Please try other combination.</div>')
        $('#dvWait').html('');
        $('#dvWait').hide();
        $('#dvResp').show();
        SetPages(0);
        $('#header').css("visibility", "visible");
    }
}
function SetPages(currentPage) {
    //console.log("SetPages = ");
    //console.log(currentPage);
    var totalFeeds = $('#TotalFeeds').val();
    var noPages = Math.ceil(totalFeeds / 10);
    var pagesStr = ''
    pagesStr = pagesStr + 'Page(s): '

    if (currentPage > 0) {
        if (noPages <= 7) {
            for (i = 1; i <= noPages; i++) {
                if (i != currentPage)
                    pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                else
                    pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
            }
        }
        else {
            if (currentPage < 5) {
                for (i = 1; i <= 5; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                    else
                        pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                }

                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + noPages + ')">' + noPages + '</a></span>';
            }
            else {
                pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(1)">1</a></span>';
                pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';

                if (currentPage + 3 < noPages) {
                    for (i = currentPage - 1; i <= currentPage + 2; i++) {
                        if (i != currentPage)
                            pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                        else
                            pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                    }

                    pagesStr = pagesStr + '<span style="margin:0px 2px;color:Navy;">...</span>';
                    pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + noPages + ')">' + noPages + '</a></span>';
                }
                else {
                    for (i = noPages - 4; i <= noPages; i++) {
                        if (i != currentPage)
                            pagesStr = pagesStr + '<span class="spNumUnselect"><a onclick="OpenPage(' + i + ')">' + i + '</a></span>';
                        else
                            pagesStr = pagesStr + '<span class="spNumSelect">' + i + '</span>';
                    }
                }
            }
        }
        $('div[id^="idPages"]').addClass('dvPaginNoContent').html(pagesStr);
        $('div[id="idPages2"] a').click(function() { scrollTo(0, 0); })
    } else {
        pagesStr = pagesStr + '<span class="spNumSelect">0</span>';
        $('div[id^="idPages"]').addClass('dvPaginNoContent').html(pagesStr);
        $('div[id="idPages2"] a').click(function() { scrollTo(0, 0); })
    }
}
function findPacks(idForm) {
    if ($('#' + idForm + ' #allID').val() != '') {
        $('#' + idForm + ' #allID').val('')
    }
    if ($('#' + idForm + ' #allNA').val() != '') {
        $('#' + idForm + ' #allNA').val('')
    }
    var idString = $('#' + idForm + '').serialize();
    idString = idString.substring(0, idString.indexOf("&__"))
    var idStrParts
    var idxOf
    var idValP
    var idVal
    var idValN
    var idToFind = ''
    var idID
    var idNA
    var chkCHK = 0
    idString = idString.replace(/\+/g, ' ');
    idString = idString.replace(/\%7C/g, '|');
    idStrParts = idString.split('&');
    for (i = 0; i < idStrParts.length; i++) {
        idValP = idStrParts[i].split('=');
        if (idValP[1] != '') {
            chkCHK = chkCHK + 1
            idValN = idValP[1].split('|');
            if (chkCHK > 1) {
                idID = idID + ',' + idValN[0];
                idNA = idNA + '_-_' + idValN[1].replace(/\s/g, '-');
            }
            else {
                idID = idValN[0];
                idNA = idValN[1].replace(/\s/g, '-');
            }
        }
    }

    if (idID == undefined) {
        alert('Please check at least one box. Thanks!');
        return;
    }
    else {
        $('#' + idForm + ' #allID').val(idID);
        $('#' + idForm + ' #allNA').val(idNA);
        window.location = SiteName + "/" + idNA.toLowerCase() + "/find-packages";
    }
}