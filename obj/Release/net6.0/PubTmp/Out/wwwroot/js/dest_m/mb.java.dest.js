
$(document).ready(function () {
    $('.searchBox').keydown(function (e) {
        var regex = new RegExp("^[a-zA-Z]*$");
        var keys = [8, 37, 39, 46];
        var key = e.which ? e.which : e.keyCode;
        var str = $.inArray(key, keys == false) ? String.fromCharCode(key) : '';
        if (!regex.test(str) && inArray(key, keys) == false) {
            e.preventDefault();
            return false;
        }

        //$('.componentsContainer').children().hide();
        //$('.componentsContainer').hide();
        //$('.countryListRow span').html("&#9660"); 
    }).keyup(function (e) {
        var i = $(this).attr('id').replace('i', '');
        (i == 1) ? ($('#i2').val($('#i1').val())) : ($('#i1').val($('#i2').val()));

        var startLetters = $('#i1').val();
        if (startLetters.trim() == '') {
            $('.dvCountryRow').show();
        }
        else {
            $('.dvCountryRow').each(function () {
                var name = $(this).attr('data-name').toLowerCase();
                (name.startsWith(startLetters.toLowerCase()) == false) ? $(this).hide() : $(this).show();
            });
        }
    });
    $(".btnMod").click(function (e) {
        var id = e.target.id;
        getCityList(id);
    });
});

function getCityList(id) {
    $.ajax({
        type: 'Get',
        url: '/destinations/GetCityList/' + id,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            var content = '<div class="col-12 pl-0 pr-0 pb-4">Cities in ' + data[0].couNA + '</div><div class="col-12 pl-0 pr-0">';
            $.each(data, function (i, v) {
                content = content + '<a role="button" class="btn btn-outline-light btn-block border border-light border-right-0 border-left-0 border-top-0 text-left font-weight-bold pt-2 pb-2 m-0 dvCity">' + v.ctyNA +'</a>'
            });
            content = content + '</div>';
            $('.modal-body').html('');
            $('.modal-body').append(content);
        },
        error: function (xhr, desc, exceptionobj) {
            $('.modal-body').html(xhr.responseText);
        }
    })
}