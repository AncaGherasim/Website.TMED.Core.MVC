var popupStatus = 0;
$(document).ready(function () {
    $("#subscriptionpopup").hide();
    $("#pnlResult").hide();
    $("#SubscribeSubmit").click(function () { addSubscribe(); });
    $("#FindSubscription").click(function () { getSubscribe(); });
    $("#SubmitReasons").click(function () { unSubscribeReason(); });
    $("#UpdateSbscriptionButton").click(function () { updateSubscribe() });
    $("#SubscribeAll").click(function () {
        if ($("#SubscribeAll").is(":checked")) {
            $("#SubscribeED").attr("checked", true);
            $("#SubscribeTM").attr("checked", true);
        }
        else {
            $("#SubscribeED").attr("checked", false);
            $("#SubscribeTM").attr("checked", false);
        }
    });
    $("#UnsubscribeAll").click(function () {
        var unsubscribeAll = $("#UnsubscribeAll").is(":checked");
        if ($("#UnsubscribeAll").is(":checked")) {
            $("#UnsubscribeED").attr("checked", true);
            $("#UnsubscribeTM").attr("checked", true);
        }
        else {
            $("#UnsubscribeED").attr("checked", false);
            $("#UnsubscribeTM").attr("checked", false);
        };
    });
    $("#SubscribeMainSite").click(function (e) {
        e.preventDefault();
        $('#subscriptionpopup').hide();
        return false;
    });
});
function addSubscribe(ml) {

    $("#pnlSubscribe").hide();

    var addemail = $.trim(ml);
    //console.log(' 1st = ' + addemail);
    addemail === '' ? addemail = $('#TMSubscribeEmail').val() : '';
    //console.log(' 2nd = ' + addemail);
    var subsTM = 1;
    var subsED = 0;
    $.ajax({
        type: "POST",
        url: SiteName + "/Api/MarketingSubscriber",
        data: JSON.stringify({ email: addemail, ED: subsED, TM: subsTM, proc: 1, options: '' }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            data.success === false ? $("#pnlResult").html($("#pnlResult").html().replace("We have updated your subscription preferences.", "Something went wrong, please try again later.")) : "";
            $("#pnlResult").show();
        },
        error: function (xhr, desc, exceptionobj) {
            $("#pnlResult").html($("#pnlResult").html().replace("We have updated your subscription preferences.", "Something went wrong, please try again later."))
            $("#pnlResult").show();
        }
    });
};
function getSubscribe(email) {

    var getemail = $.trim(email);
    getemail === '' ? getemail = $.trim($("#SubscribedEmail").val()) : '';
    getemail = decodeURIComponent(getemail);
    /%40/.test(getemail) ? getemail = getemail.replace(/%40/, '@') : '';
    if (!isValidEmailAddress(getemail)) {
        $("#SubscribedEmail").val("Valid email please");
        $("#SubscribedEmail").focus().select();
        return false;
    }

    $.ajax({
        type: "POST",
        url: SiteName + "/Api/MarketingSubscriber",
        data: JSON.stringify({ email: getemail, ED: '', TM: '', proc: 3, options: '' }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            //var hvEmail = res;
            //console.log(/[0-1]+/g.test(hvEmail));
            //console.log(hvEmail.match(/[0-1]+/g));
            data.success === true ?
                (
                    /ED/.test(data.codes) ? ($('#SubscribeED').prop('checked', true), $('#TxtSubsED').text('Subscribed')) : ($('#UnsubscribeED').prop('checked', true), $('#TxtUnSubsED').text('Unsubscribed')),
                    /TM/.test(data.codes) ? ($('#SubscribeTM').prop('checked', true), $('#TxtSubsTM').text('Subscribed')) : ($('#UnsubscribeTM').prop('checked', true), $('#TxtUnSubsTM').text('Unsubscribed'))
                )
                :
                (
                    $('#UnsubscribeED').prop('checked', true),
                    $('#TxtUnSubsED').text('Unsubscribed'),
                    $('#UnsubscribeTM').prop('checked', true),
                    $('#TxtUnSubsTM').text('Unsubscribed')
                )
        },
        error: function (xhr, desc, exceptionobj) {
            console.log(xhr.responseText);
        }
    });
};
function updateSubscribe() {
    var updateEmail = getUrlVars()["email"];
    updateEmail = decodeURIComponent(updateEmail);
    /%40/.test(updateEmail) ? updateEmail = updateEmail.replace(/%40/, '@') : '';
    var subTM = 0;
    var subED = 0;
    var unsubTM = 0;
    var unsubED = 0;
    var r1 = 0;
    var r2 = 0;
    var r3 = 0;
    var r4 = 0;
    var other = '...';
    var ideas = $("#Ideas").val();
    $("#SubscribeTM").is(":checked") ? subTM = 1 : '';
    $("#SubscribeED").is(":checked") ? subED = 1 : '';
    $("#UnsubscribeTM").is(":checked") ? unsubTM = 1 : '';
    $("#UnsubscribeED").is(":checked") ? unsubED = 1 : '';
    $("#R1").is(":checked") ? r1 = 1 : '';
    $("#R2").is(":checked") ? r2 = 1 : '';
    $("#R3").is(":checked") ? r3 = 1 : '';
    $("#R4").is(":checked") ? (r4 = 1, other = $("#txtOtherReason").val()) : '';
    ideas === '' ? ideas = '...' : ideas = $('#Ideas').val();

    var option = unsubED + '@' + unsubTM + '@' + r1 + '@' + r2 + '@' + r3 + '@' + r4 + '@' + other + '@' + ideas;

    $.ajax({
        type: "POST",
        url: SiteName + "/Api/MarketingSubscriber",
        data: JSON.stringify({ email: updateEmail, ED: subED, TM: subTM, proc: 2, options: option }),
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            var jsonData = res;
            $("#pnlSubscribe").hide();
            $("#pnlReason").hide();
            $("#pnlResult").show();
        },
        error: function (xhr, desc, exceptionobj) {
            alert(xhr.responseText);
        }
    });
};

function centerPopup() {
    //request data for centering  
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var popupHeight = $("#subscriptionpopup").height();
    var popupWidth = $("#subscriptionpopup").width();
    //centering  
    $("#subscriptionpopup").css({
        "position": "absolute",
        "top": windowHeight / 2 - popupHeight / 2 + $(window).scrollTop(),
    });
    return false;
};
function loadPopup() {
    if (popupStatus == 0) {
        $("#subscriptionpopup").fadeIn("slow");
        popupStatus = 1;
    };
};
function disablePopup() {
    $(".subscriptionpopup").is(':visible') == true ? ($("#subscriptionpopup").fadeOut("slow"), popupStatus = 0) : ''; 
    return false;
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};
function SubscribeEmailPopUp(textbox) {
    var userEmail = $("#" + textbox + '').val()
    if (!isValidEmailAddress(userEmail)) {
        var isiPad = navigator.userAgent.match(/iPad/i) != null;
        if (isiPad == true) {
            $("#" + textbox + '').val("");
            $("#" + textbox+ '').focus().select();
            alert("Valid email please")
        }
        else {
            $("#" + textbox + '').val("Valid email please");
            $("#" + textbox + '').focus().select();
        };
        return false;
    };
    $("#" + textbox).val($("#" + textbox).val());
    centerPopup();
    if (popupStatus == 0) {
        $("#subscriptionpopup").fadeIn("slow");
        addSubscribe();
        popupStatus = 1;
    };
};
function unSubscribeReason () {
    $("#pnlSubscribe").hide();
    $("#pnlReason").show();
    $("#pnlResult").hide();
};
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    };
    return vars;
};