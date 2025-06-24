var depCities = [];
var arrivalCities = [];
var today = new Date();
var isNumber = /[0-9]+/g;
var visitId;
var childAge = [];
var totalPax = 0;
var haveCook = 0;
for (c = 2; c <= 11; c++) {
    var chilObj;
    chilObj = { label: c, value: c };
    childAge.push(chilObj);
}
$(document).ready(function () {
    if (Cookies.get('ut2') == undefined) {

    }
    else    {
        var utParts = $(Cookies.get('ut2').split('&'));
        var utVisitId = utParts[0].split('=');
        visitId = utVisitId[1];
    }
    $('.dvMoreSuggBtn').click(function () {
        $('#dvSuggItinHide').is(':visible') === true ? $(this).html('See More Vacation Packages') : $(this).html('Close More Vacation Packages');
    });
    $('.dvMoreHighBtn').click(function () {
        $('#dvHighlightsHide').is(':visible') === true ? $(this).html('More Highlights & Attractions') : $(this).html('Close More Highlights & Attractions');
    });

    //Recently Viewed
    $('#dvMvisitContainer').on('show.bs.collapse', function () {
        getRecentlyView();
    });

    $('.aBtnTab').on('click', function () {
        if ($(this).hasClass('aBtnTabOpen') === true) {
            $(this).removeClass('aBtnTabOpen');
        } else {
            $(this).addClass('aBtnTabOpen');
        }
    });
});
//Get Recently Viewed packages
function getRecentlyView() {
    var options = {};
    options.url = SiteName + "/Api/RecentlyViewed";
    options.type = "POST";
    options.contentType = "application/json; charset=utf-8";
    options.data = JSON.stringify({ Id: visitId });
    options.dataType = "json";
    options.success = function (data) {
        //console.log(data)
        data != undefined ? buildRecentlyViewed(data) : '';
    };
    options.error = function (xhr, desc, exceptionobj) {
        console.log(xhr);
    };
    $.ajax(options);
}
Date.timeBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    var passTime;
    days > 0 ? (days === 1 ? passTime = days + ' day ago' : passTime = days + ' days ago') : hours > 0 ? (hours === 1 ? passTime = hours + ' hour ago' : passTime = hours + ' hours ago') : minutes > 0 ? (minutes === 1 ? passTime = minutes + ' minute ago' : passTime = minutes + ' minutes ago') : (passTime = '  just visited');
    return passTime;
};
function buildRecentlyViewed(obj) {
    var objC = 0;
    var siteURL;
    var newVisit = "<div class='row w-100 mx-auto border-bottom'>";
    $.each(obj, function () {
        objC++;
        if (objC < 6) {
            switch (this.UTS_Site) {
                case 'ED':
                    siteURL = location.protocol + "//www.europeandestinations.com";
                    break;
                case 'TMED':
                    siteURL = location.protocol + "//www.tripmasters.com/europe";
                    break;
                case 'TMASIA':
                    siteURL = location.protocol + "//www.tripmasters.com/asia";
                    break;
                case 'TMLD':
                    siteURL = location.protocol + "//www.tripmasters.com/latin";
                    break;
            }
            var jsdate = new Date(parseInt(this.UTS_Date.substring(6)));
            var today = new Date();
            var lastVst = Date.timeBetween(jsdate, today);
            newVisit = newVisit + "<div class='col-6 pt-2 pb-2 pl-2 pr-2'><a href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/ /g, '_').toLowerCase() + "/" + this.PDL_Title.replace(/ /g, '_').toLowerCase() + "/package-" + this.PDLID + "' class='font12'>" +
                "<img class='img-fluid' src='https://pictures.tripmasters.com" + this.IMG_Path_URL.toLowerCase() +
                "' title='" + this.PDL_Title + "'/></a><div class='row' style='height:130px;padding-left: 17px;padding-right: 10px'><a style='height:80px' href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/ /g, '_') + "/" + this.PDL_Title.replace(/ /g, '_') + "/package-" + this.PDLID +
                "'>" + this.PDL_Title + "</a><span class='d-block font12'>Viewed " + lastVst + "</span>";
                if (this.feedbacks > 0) {
                    newVisit = newVisit + "<div class='col pl-0 pr-0'><a href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/%20|\s/g, '_').toLowerCase() + "/" + this.PDL_Title.replace(/ /g, '_').toLowerCase() + "/feedback-" + this.PDLID + "' class='font12'>" + this.feedbacks + " Customer Reviews " +
                        "<img src='https://pictures.tripmasters.com/siteassets/d/IMG-Feed.jpg' border='0' align='absmiddle'/></a>" +
                        "</div>";
                }
                newVisit = newVisit + "</div>";
                newVisit = newVisit + "<div class='col pl-0 pr-0 font12 pt-2 text-center mx-auto'><a role='button' href='" + siteURL + "/" + this.STR_PlaceTitle.replace(/ /g, '_') + "/" + this.PDL_Title.replace(/ /g, '_') + "/package-" + this.PDLID + "' class='btn btn-warning'>View It</a></div></div>";
            
        }
    });
    newVisit = newVisit + "</div>";
    $('.dvMvisit').append(newVisit);
}
