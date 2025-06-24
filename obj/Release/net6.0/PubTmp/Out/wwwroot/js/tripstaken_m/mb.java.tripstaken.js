var page;
var nxtPg;
var objIDs = [];
$(document).ready(function () {
    getIds();
    $(document).on('click', '.btnMore', function () {
        init();
    });
});
function getIds() {
    var countryId = $("#countryId").val();
    $.ajax({
        type: "POST",
        url: SiteName +"/Api/GetIdsTripsTakenFeeds",
        data: JSON.stringify({ Id: countryId }),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            var msgParts = data.split('@');
            objIDs = msgParts[0].split('|');
            init();
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
}
function init() {
    page = $('#pg').val();
    nxtPg = parseInt(page) + 1;
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/GetTripsTakenFeeds",
        data: JSON.stringify({ Id: objIDs[page - 1] }),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            buildTrips(data);
            $('#pg').val(nxtPg);
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
}
function buildTrips(obj) {   
    var trip = '';
    var country = '';
    var placeTitle = '';
    $.each(obj, function () {
        var places = this.pdL_PlacesTitle.split(",");
        for (var j = 0; j <= places.length - 2; j++) {
            country = places[0];
        }
        trip = trip + "<div class='row'><div class='col-12 font18 blueText pt-3'><a class='font18 blueText font-weight-bold' href='" + SiteName + "/" + country.toLowerCase() + "/" + this.pdL_Title.replace(" ", "_").toLowerCase() + "/package-" + this.pdlid + "'>" + this.pdL_Title + "</a></div>" +
            "<div class='col-12 font12 text-primary'><a href='" + SiteName + "/" + country.toLowerCase() + "/" + this.pdL_Title.replace(" ", "_").toLowerCase() + "/feedback-" + this.pdlid + "' >" + this.noOfFeed + " Travelers reviewed this package</a></div>" +
            "<div class='col-12 font12 pt-2'><span class='d-block'>" + FormatCustomerComment(this.pcC_Comment) + "</span>" +
            "<span clsss='d-block'>" + this.pcC_CustomerName + "</span></div>" +
            "<div class='col-12 text-right'><button type='button' class='btn btn-link text-right pr-0 font12 btnIncl collapsed' data-target='#dvIncl" + this.pdlid + "' data-toggle='collapse''>Itinerary details</button></div>";
        if (this.pcC_Itinerary != '') {
            var incl = this.pcC_Itinerary.split(/\n/g);
            trip = trip + "<div class='collapse' id='dvIncl" + this.pdlid + "'><div class='col-12 font12'><ul class='p-0 pl-3'>";
            for (var i = 0; i <= incl.length - 1; i++) {
                trip = trip + "<li>" + incl[i] + "</li>";
            }
            trip = trip + "</ul></div><div class='col-12'><span class='d-block font-weight-bold font12'>Places visited pn this trip:</span>";
            var plc = this.pdL_PlacesTitle.split(",");
            for (var j = 0; j <= plc.length - 2; j++) {
                placeTitle = plc[0];
                trip = trip + "<a class='btn btn-link font12 gretText' href='/" + plc[j].toLowerCase() + "/vacations'>" + plc[j] + "</a>";
            }
            trip = trip + "</div></div>";
        }
        trip = trip + "<div class='col-12 trip text-center pt-2 pb-3'><span class='d-block pb-3 font14'>Price for this package starting at <b class='orgClr'>$" + this.stP_Save + "*</b></span>" +
            "<a class='btn btn-warning font16' href='" + SiteName + "/" + country.toLowerCase() + "/" + this.pdL_Title.replace(" ", "_").toLowerCase() + "/package-" + this.pdlid + "'>Customize it</a></div>" +
            "</div>";
    });
    if (page == 1) {
        $('.dvTrips').html('');
        $('.dvTrips').append(trip);
    } else {
        $('.dvTrips').last().append(trip);
    }
    
}

function FormatCustomerComment(comment) {
    var commentBold = "";
    var commentNorm = "";
    comment = comment.trim();
    if (comment.length == 0)
        return "";
    if (comment.indexOf("---") != -1)
        return comment.replace(/\n/g, "<br />");
    var regex = new RegExp("[!?.]");
    if (regex.test(comment)) {
        var res = comment.match(regex);
        if (res != null) {
            commentBold = comment.substring(0, res.index + 1);
            commentNorm = comment.substring(res.index + 1);
        }
        else {
            commentBold = comment;
            commentNorm = "";
        }
    }
    return "<b>" + commentBold.replace(/\n/g, "<br />") + "</b>" + commentNorm.replace(/\n/g, "<br />");
}