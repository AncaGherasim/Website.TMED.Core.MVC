var page;
$(document).ready(function () {
    getFeeds();
    $(document).on('click', '.btnMore', function () {
        getFeeds();
    });
});

function getFeeds() {
    var pkId = $("#packId").val();
    page = $('.btnMore').val();
    var dvCt = '';
    $.ajax({
        type: "GET",
        url: SiteName +"/Api/GetPackCustFeeds",
        data: "packId=" + pkId + "&page=" + page,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType: "json",
        success: function (data) {
            $.each(data, function (rv) {
                dvCt = dvCt + "<div class='row border border-secondary border-left-0 border-right-0 border-top-0'><div class='col-12 pt-2'>";
                if (this.overallScore > 0) {
                    dvCt = dvCt + "<img class='img-fluid' src='https://pictures.tripmasters.com/siteassets/d/Stars_" + this.overallScore + "_Stars.gif' />" +
                        "<span class='font14'>(" + this.overallScore + " out of 5)</span></div>" +
                        "<div class='col-12 font14 greyText'>Date: " + formatDate(this.dep_date) + "</div>";
                }
                dvCt = dvCt + "<div class='col-12 font12 pt-2'>" + FormatCustomerComment(this.pcC_Comment) + "</div>" +
                    "<div class='col-12 text-right'><button role='button' class='btn btn-link font12 btnIncl collapsed' data-target='#itinDetails" + this.pccid + "' data-toggle='collapse' aria-expanded='false'>Itinerary details</button></div>" +
                    "<div class='collapse dtBack' id='itinDetails" + this.pccid + "'><div class='col-12 pt-2 font12'><ul class='p-0' style='list-style-type:none'>";
                    var incl = this.pcC_Itinerary.split(/\n/g);
                    for (i = 0; i <= incl.length - 1; i++) {
                        dvCt = dvCt + "<li>" + incl[i] + "</li>";
                    }
                dvCt = dvCt + "</ul></div><div class='col-12'><span class='d-block'>See reviews for:</span>";
                var plc = $('#places').val();
                var arr = plc.substr(0, plc.length - 1).split('|');
                for (var i = 0; i <= arr.length - 1; i++) {
                    dvCt = dvCt + "<a class='btn btn-link font12 pl-0' href='" + SiteName +"/" + arr[i].toLowerCase() + "/vacations' >" + arr[i] + "</a>"; 
                }
                dvCt = dvCt + "</div></div></div>";

            });
            if (page == 1) {
                $('.dvFeeds').html('');
                $('.dvFeeds').append(dvCt);
            } else {
                $('.dvFeeds').last().append(dvCt);
            }
            $('.btnMore').val(parseInt(page) + 1);
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
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
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}