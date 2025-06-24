$(document).ready(function () {
    $('#qm').autocomplete({
        minLength: 3,
        select: function (event, ui) {
            $('#qm').val(ui.item.value);
            searchGO(ui.item.label);
            return false;
        },
        source: function (request, response) {
            $.ajax({
                url: SiteName + "/Api/amzCloud_Suggestions",
                type: "POST",
                data: JSON.stringify({ Id: request.term }),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    //console.log(data);
                    response($.map(data, function (m) {
                        return {
                            label: m,
                            value: m.substring(0, m.indexOf("##"))
                        };
                    }));
                },
                error: function (xhr, desc, exceptionobj) {
                    console.log(xhr.responseText + ' = error');
                }
            });
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var suggParts = item.label.split('##');
        var $a = '';
        if (suggParts[1].indexOf("inCo") != -1) {
            $a = $("<a></a>").html('<span>' + suggParts[0] + '</span><span style="color:orange;font-weight:bold;"> in Countries</span>');
            return $("<li></li>").append($a).appendTo(ul);
        }
        if (suggParts[1].indexOf("inCt") != -1) {
            $a = $("<a></a>").html('<span>' + suggParts[0] + '</span><span style="color:orange;font-weight:bold;"> in Cities</span>');
            return $("<li></li>").append($a).appendTo(ul);
        }
        if (suggParts[1].indexOf("Sp") != -1) {
            $a = $("<hr/>").css({ "border": "0", "height": "1px", "background-color": "lightgray" });
            return $('<li style="pointer-events:none;border:0;outline:none;padding:5px;margin:0px;width:95%!important;"></li>').append($a).appendTo(ul);
        }
       // console.log(" suggParts[3] = ");
        //console.log(location.protocol + "//" + suggParts[3]);
        if (suggParts[3].indexOf("/luxury/") != -1) {
            var $sp = $("<span></span>").html("★").attr({ id: "lux", style: "color:#b89723; font-size:0.95rem; padding-left:5px;" });
            var $a = $('<a></a>').html(suggParts[0]).attr("href", "https://" + suggParts[3].toLowerCase() + "?iSrc1=Header").append($sp);
            highlightText(this.term, $a);
            return $("<li></li>").append($a).appendTo(ul);
        } else {
            var $a = $('<a></a>').text(suggParts[0]).attr("href", "https://" + suggParts[3].toLowerCase() + "?iSrc1=Header");
            highlightText(this.term, $a);
            return $("<li></li>").append($a).appendTo(ul);
        }
        };

    $('.dvMtopPage').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 200);
    });
    $('.divVoucher').click(function () {
        var goTo = $(this).attr("lang");
        window.open(goTo);
    });
});


function highlightText(text, $node) {
    var searchText = $.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
    while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
        newTextNode = currentNode.splitText(matchIndex);
        currentNode = newTextNode.splitText(searchText.length);
        newSpanNode = document.createElement("span");
        newSpanNode.className = "highlight boldText";
        currentNode.parentNode.insertBefore(newSpanNode, currentNode);
        newSpanNode.appendChild(newTextNode);
    }
}
function searchGO(label) {
    //console.log("searchGO");
    //console.log(label);
    if (label.indexOf("##P##") != -1) {
    } else {
        var q = $('#qm').val().replace(/-/g, '').replace(/_/g, '');
        if (q == '' || q == undefined) {
            return false;
        }
        var qurl = '/search?q=' + q.replace(/ /g, '_');
        location.href = qurl;
    }
}