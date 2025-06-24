$(document).ready(function () {
    $("#dvGoTop").click(function () {
        $('html,body').animate({ scrollTop: 20 }, 100);
        $("#dvGoTop").hide();
    });

    $("span.letter").click(function () {
        $("#dvGoTop").hide();
        $("span.letter").removeClass("letterSelected");
        var l = $(this).attr("id").split("_")[1];
        $("#L1_" + l).addClass("letterSelected");
        $("#L2_" + l).addClass("letterSelected");
        $(".countryListRow").removeClass("countryListRowSelected");
        $(".countryListRow[id^='" + l + "']").addClass("countryListRowSelected");
        var pos = $(".countryListRow[id^='" + l + "']:first").offset();
        $('html,body').animate({ scrollTop: pos.top - 25 }, 200, function () {
            if ($(window).scrollTop() > 100) {
                var w = $(".countryListRow[id^='" + l + "']:first").width();
                var h = $(".countryListRow[id^='" + l + "']:first").height();
                var posLast = $(".countryListRow[id^='" + l + "']:last").offset();
                var topPos = pos.top == posLast.top ? (pos.top + (h - $('#dvGoTop').height()) / 2) : ((pos.top + posLast.top + h) - $('#dvGoTop').height()) / 2;
                $('#dvGoTop').css({ "top": topPos + "px", "left": (pos.left + w + 10) + "px" }).show();
            }
        });
    });

    $(".col3 span").click(function () {
        var id = $(this).attr("id");
        $('#dvcitiesTitle').text("ALL CITIES IN " + $(this).attr("data-name").replace(/_/g, " "));
        $('#dvCitiesContent').html('');
        $('#dvCities').css("left", ($(window).width() - $('#dvCities').width()) / 2).css("top", ($(this).offset().top + 26) + "px").show();
        $('#dvBack').css("width", "100%").css("height", ($(document).height() + 200) + "px").show();

        setWait();

        var options = {};
        options.url = SiteName + "/Api/CountryPlaces";
        options.type = "POST";
        options.contentType = "application/json";
        options.data = JSON.stringify(id);
       options.dataType = "json";
        options.success = function (data) {
            var cities = data;
                var citiesHtml = '';
                var cols = cities.length < 4 ? cities.length : 4;
                var w = Math.floor(($("#dvCitiesContent").width() - 10) / cols);
                var rows = Math.ceil(cities.length / cols);
                for (i = 1; i <= cols; i++) {
                    citiesHtml = citiesHtml + '<div class="cityListColumn" style="width:' + w + 'px;">'
                    var maxPerCol = (i * rows - 1) >= cities.length - 1 ? cities.length - 1 : (i * rows) - 1;
                    for (j = (i - 1) * rows; j <= maxPerCol; j++) {
                        citiesHtml = citiesHtml + '<div class="cityListCell"><a href="/' + cities[j].CityName.replace(/\s/g, "_").toLowerCase() + '/vacations">' + cities[j].CityName + '</a><img id="img' + cities[j].CityID + '" src="https://pictures.tripmasters.com/siteassets/d/info.gif"></div>'
                    }
                    citiesHtml = citiesHtml + '</div>'
                }
                citiesHtml = citiesHtml + '<div style="clear:both;"></div>'
                for (i = 0; i <= cities.length - 1; i++) {
                    citiesHtml = citiesHtml + '<div class="cityInfo" id="dvInfo' + cities[i].CityID + '"><div class="closeLink" style="padding:0 0 10px 0">close [x]</div>' + cities[i].CityInfo + '</div>'
                }
                $('#dvCitiesContent').html(citiesHtml);

                $(".cityListCell img").click(function () {
                    var id = $(this).attr("id").replace("img", "");
                    $('div.cityInfo').hide();
                    var pos = $(this).position();
                    $('#dvInfo' + id).css({ "top": (pos.top + 15) + "px", "left": (pos.left - 100) + "px", "z-index": "9110" }).show();
                });

                $("div[id^='dvInfo'] .closeLink").click(function () {
                    var id = $(this).parent().hide();
                });

                $('#dvWait').fadeTo(200, 0, function () { $('#dvWait').hide().css("opacity", 1); });
                $('#dvCitiesContent').show();

                var dvCitiesLowerPos = $('#dvCities').offset().top + $('#dvCities').height() + 10;
                var winHeight = $(window).scrollTop() + $(window).height();
                if (dvCitiesLowerPos > winHeight) {
                    window.scrollTo(0, $(window).scrollTop() + (dvCitiesLowerPos - winHeight));
                }
        };
        options.error = function (xhr, desc, exceptionobj) {
            alert(xhr.responseText);
            $('#dvCitiesContent').html(xhr.responseText).show();
        };
        $.ajax(options);


        //$.ajax({
        //    url: "/WS_Library.asmx/sqlCountryCities",
        //    type: "POST",
        //    contentType: "application/json; charset=utf-8",
        //    data: '{countryId:"' + id + '"}',
        //    dataType: "json",
        //    success: function (data) {
        //        var cities = JSON.parse(data.d);
        //        var citiesHtml = '';
        //        var cols = cities.length < 4 ? cities.length : 4;
        //        var w = Math.floor(($("#dvCitiesContent").width() - 10) / cols);
        //        var rows = Math.ceil(cities.length / cols);
        //        for (i = 1; i <= cols; i++) {
        //            citiesHtml = citiesHtml + '<div class="cityListColumn" style="width:' + w + 'px;">'
        //            var maxPerCol = (i * rows - 1) >= cities.length - 1 ? cities.length - 1 : (i * rows) - 1;
        //            for (j = (i - 1) * rows; j <= maxPerCol; j++) {
        //                citiesHtml = citiesHtml + '<div class="cityListCell"><a href="https://www.tripmasters.com/' + cities[j].CityDept + '/' + cities[j].Name.replace(/\s/g, "_") + '_Vacations.aspx">' + cities[j].Name + '</a><img id="img' + cities[j].Id + '" src="/images/info.gif"></div>'
        //            }
        //            citiesHtml = citiesHtml + '</div>'
        //        }
        //        citiesHtml = citiesHtml + '<div style="clear:both;"></div>'
        //        for (i = 0; i <= cities.length - 1; i++) {
        //            citiesHtml = citiesHtml + '<div class="cityInfo" id="dvInfo' + cities[i].Id + '"><div class="closeLink" style="padding:0 0 10px 0">close [x]</div>' + cities[i].CityInfo + '</div>'
        //        }
        //        $('#dvCitiesContent').html(citiesHtml);

        //        $(".cityListCell img").click(function () {
        //            var id = $(this).attr("id").replace("img", "");
        //            $('div.cityInfo').hide();
        //            var pos = $(this).position();
        //            $('#dvInfo' + id).css({ "top": (pos.top + 15) + "px", "left": (pos.left - 100) + "px", "z-index": "9110" }).show();
        //        });

        //        $("div[id^='dvInfo'] .closeLink").click(function () {
        //            var id = $(this).parent().hide();
        //        });

        //        $('#dvWait').fadeTo(200, 0, function () { $('#dvWait').hide().css("opacity", 1); });
        //        $('#dvCitiesContent').show();

        //        var dvCitiesLowerPos = $('#dvCities').offset().top + $('#dvCities').height() + 10;
        //        var winHeight = $(window).scrollTop() + $(window).height();
        //        if (dvCitiesLowerPos > winHeight) {
        //            window.scrollTo(0, $(window).scrollTop() + (dvCitiesLowerPos - winHeight));
        //        }
        //    },
        //    error: function (xhr, desc, exceptionobj) {
        //        $('#dvCitiesContent').html(xhr.responseText).show();
        //    }
        //});
    });

    $("#dvClose").click(function () {
        $('#dvCities').hide();
        $('.cityInfo').hide();
        $('#dvBack').hide();
    })
});

function setWait() {
    var h = $('#dvCities').outerHeight();
    var w = $('#dvCities').outerWidth();
    $('#dvWait').css({ "top": $('#dvCities').position().top, "left": $('#dvCities').position().left });
    $('#dvWait #loaderImg').css({ "top": ((h - 70) / 2) + "px" });
    $('#dvWait').height(h).width(w).show();
}