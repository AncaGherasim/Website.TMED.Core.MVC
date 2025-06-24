var rating = '1,2,3,4,5';
$(document).ready(function () {
    $('img[id^="img"]').each(function() {
        var url = $(this).attr('data');
        if (url != 'none') {
            $(this).css({ "width": "50px", "height": "50px" })
            $(this).attr('src', 'https://pictures.tripmasters.com' + url.toLowerCase());
            $(this).attr('data', '');
        }
    });
    
    var totalFeeds = $("#totalFeeds").val();
    $('input[type="radio"][name="orderValue"]').click(function () { rating = "1,2,3,4,5"; totalFeeds = $("#totalFeeds").val(); createPagination(1,totalFeeds); OpenPage(1, rating); });
    createPagination(1, totalFeeds);
    OpenPage(1, rating);
    $('.dvfilter').click(function () {
        rating = this.id;
        totalFeeds = $('#totFedsRat' + rating + '').val();
        createPagination(1, totalFeeds);
        OpenPage(1, rating);
    });
});
function OpenPage(currentPage, rating) {
    $('#dvResp').hide();
    $('#dvResp').html('');
    $('#dvWait').html('<img src="https://pictures.tripmasters.com/siteassets/d/ajax-loader.gif" width="50" height="50" /></br></br><div style="margin-let:10px;color:navy;">Loading ...</div>');
    $('#dvWait').show();

    var orderVal = $('input[name="orderValue"]:checked').val();
    var placeIds = $('#PackPlaces').val();
    var total = $('#totalFeeds').val();
    var packId = $('#PackId').val();
    var PackTitle = $('#PackTitle').val();
    var PackCountry = $('#PackCountry').val();
    if (total>0) {
        var data = { packId: packId, page: currentPage.toString(), PlacesIDs: placeIds, order: orderVal, rating: rating, PDL_Title: PackTitle, CountryName: PackCountry };

        var options = {};
        options.url = SiteName + "/CustomerFeedbacksByPage";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = JSON.stringify(data),
            options.dataType = "html";
        options.success = function (data) {
            console.log("before SetPages");
                $('#dvResp').html(data);
                $('#dvWait').html('');
                $('#dvWait').hide();
                $('#dvResp').show();

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
    }
}
/* TO TAKE ID FROM FORM TO FIND PACKAGES */
function findPacks(idForm) {
    if ($('#' + idForm + ' #allID').val() != '') {
        $('#' + idForm + ' #allID').val('')
    }
    if ($('#' + idForm + ' #allNA').val() != '') {
        $('#' + idForm + ' #allNA').val('')
    }    
    var idString = $('#' + idForm + '').serialize();
    k = idString.indexOf("__RequestVerificationToken");
    if (k > 0) {
        idString = idString.substring(0, k - 1);
    }
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
        //$('#' + idForm + ' #allID').val(idID);
        //$('#' + idForm + ' #allNA').val(idNA);
        //$('#' + idForm + '').attr('action', '/' + idNA + '/Find_Package');  //{names}/Find_Package/
        window.location.href = SiteName + '/' + idNA.toLocaleLowerCase() + '/find-packages';
        //$('#' + idForm + '').submit();       
    }
}
function createPagination(page, totalFeeds) {
    $('.dvPaginas').pagination('destroy');
    //var PGtotal = 0;
    //PGtotal = $("#totalFeeds").val();    
    
    $('.dvPaginas').pagination({
        pages: Math.ceil(totalFeeds / 10),
        itemsOnPage: 10,
        cssStyle: 'light-theme',
        onPageClick: function (page, event) {
            scroll(0, 0);
            OpenPage(page, rating);
            return false;
        }
    });
};