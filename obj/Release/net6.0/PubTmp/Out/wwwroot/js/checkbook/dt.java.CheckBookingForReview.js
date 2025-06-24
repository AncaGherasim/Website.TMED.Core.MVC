var regexEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

$(document).ready(function() {
    $('#CheckBooking').on('click touchend', function() {
        var bookingId = $('#bookingId').val();
        var email = $('#email').val();
        $('.errMsg').css('color', '#9da0a5');
        $('#nobookMsg').hide();
        if (bookingId == '' || isNaN(bookingId)) {
            $('#bookingMsg').css('color', 'red');
            $('#bookingId').focus();
            return;
        }
        if (!regexEmail.test(email)) {
            $('#emailMsg').css('color', 'red');
            $('#email').focus();
            return;
        }

        var options = {};
        options.url = SiteName + "/Api/CheckBooking";
        options.type = "POST";
        options.contentType = "application/json; charset=utf-8";
        options.data = '{bookingId:"' + bookingId + '", email:"' + email + '"}',
        options.dataType = "json";
        options.success = function (data) {
            console.log(data);
            window.location.href = "/CustomerReview?b=" + bookingId + "&e=" + email + "&r=0";
        };
        options.error = function (xhr, desc, exceptionobj) {
                alert(xhr.responseText + ' = error');
        };
        $.ajax(options);

        //$.ajax({
        //    url: "/CheckBooking",
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    data: '{bookingId:"' + bookingId + '",email:"' + email + '"}',
        //    type: "POST",
        //    success: function (data) {
        //        console.log(data);
        //        if (data.d != true) {
        //            $('#nobookMsg').show();
        //        } else {
        //            window.location.href = "/Customer_Review?b=" + bookingId + "&e=" + email + "&r=0";
        //        }
        //    },
        //    error: function(xhr, desc, exceptionobj) {
        //        alert(xhr.responseText + ' = error');
        //    }
        //});


    });
});