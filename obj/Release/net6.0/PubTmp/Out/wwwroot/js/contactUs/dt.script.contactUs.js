//Javascript Document
// Contact Us Page
var selDest;
var chkBox;
var bkNum;
var flNA;
var email;
var phone;
var msg;
$(document).ready(function () {
    loadPage();
});
function loadPage() {
    $('#frmBKN').val("");
    $('#frmFullName').val("");
    $('#frmEmail').val("");
    $('#frmPhone').val("");
    $('#frmMsg').val("");

    $('#chkshowBKnum').click(function () {
        if ($('#chkshowBKnum').attr('checked')) {
            $(".dvBknum").slideDown();
        } else {
            $(".dvBknum").slideUp();
            hideInfo("frmBKN");
        }
    });
    $('.userSelDest').click(function () {
        if (this.value === 'Select your destination') {
            messg = '<div>Please select your destination.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 530, top: this.offsetTop + 180 });
        }
        else {
            hideInfo(this.id);
        }
    });
    $('.userFlName').click(function () {
        if (this.value === '') {
            messg = '<div>Please enter your full name.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 575, top: this.offsetTop + 185 });
        } else {
            messg = '<div>Wrong format! Please enter your full name</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 500, top: this.offsetTop + 185});
        }
    });
    $('.userEmail').click(function () {
        if (this.value === '') {
            messg = '<div>Please enter your email address.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 570, top: this.offsetTop + 185});
        } else {
            messg = '<div>Wrong format! Please enter your email address.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 470, top: this.offsetTop + 185});
        }
    });
    $('.userPhNo').click(function () {
        if (this.value === '') {
            messg = '<div>Please enter your phone number.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 570, top: this.offsetTop + 185});
        } else {
            messg = '<div>Wrong Format! Please enter your phone number.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 470, top: this.offsetTop +185});
        }
    });
    $('.userMsg').click(function () {
        if (this.value === '') {
            messg = '<div>Please enter your message to us.</div><span></span>';
            $('#divError').html(messg);
            $('#divError').show();
            $('#divError').offset({ left: this.offsetLeft + 540 , top: this.offsetTop + 185});
        }
    });

}
function hideInfo(obj) {
    $('#' + obj + '').removeClass("warning");
    $('#' + obj + '').css("border", "");
    $('#divError').html('');
    $('#divError').hide();
}

function validate(sender, args) {
    selDest = $('#frmDest');
    chkBox = $('#chkshowBKnum');
    bkNum = $('#frmBKN');
    flNA = $('#frmFullName');
    email = $('#frmEmail');
    phone = $('#frmPhone');
    msg = $('#frmMsg');
    frmBKN.Text = "";
    //chkBox.Checked() = False;
    //bkNum.Style.Add("display", "none");
    var valid = ''
    var regBKN = new RegExp(/[0-9-()+]{6,20}/);
    var regFN = new RegExp('[A-Za-z]');
    var regEmail = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    var regPhone = new RegExp(/[0-9-()+]{8,20}/);
    var regMsg = new RegExp(/^.*?[a-zA-Z]{4,}.*?$/m);
    var regex = [regBKN, regFN, regEmail, regPhone, regMsg];
    var idd = [];

    $.each([bkNum[0], flNA[0], email[0], phone[0], msg[0]], function (i, item) {
        if (chkBox[0].checked === true) {
            $(".dvBknum").show();
            if (this.value === '') {
                this.style.border = "2px solid #c71706";
                this.className = "warning";
                valid = "false";
                //idd[i] = this.id;
                //idd[i] = idd[i].replace("frm", "");
                //$("#user" + idd[i]).val(false);
            } else {
                isValid = true;
                //idd[i] = this.id;
                //idd[i] = idd[i].replace("frm", "");
                if (isValid !== regex[i].test(this.value)) {
                    this.style.border = "2px solid #c71706";
                    this.className = "warning";
                    valid = "false";
                    //$("#user" + idd[i]).val(regex[i].test(this.value));
                } else {
                    //$("#user" + idd[i]).val(isValid);
                }
            }
        } else {
            if (this.id === 'frmBKN') {
                // idd[i] = this.id;
                // idd[i] = idd[i].replace("frm", "");
                // idd[i] = idd[i].replace("user", "");
                //// $("#user" + idd[i]).val(true);
                return true;
            } else {
                if (this.value === '') {
                    this.style.border = "2px solid #c71706";
                    this.className = "warning";
                    valid = "false";
                    //idd[i] = this.id;
                    //idd[i] = idd[i].replace("frm", "");
                    ////$("#user" + idd[i]).val(false);
                } else {
                    isValid = true;
                    //idd[i] = this.id;
                    //idd[i] = idd[i].replace("frm", ""); 
                    if (isValid !== regex[i].test(this.value)) {
                        this.style.border = "2px solid #c71706";
                        this.className = "warning";
                        valid = "false";
                        //$("#user"+idd[i]).val(regex[i].test(this.value));
                    } else {
                        //$("#user"+idd[i]).val(isValid);
                    };
                };
            };
        };
    });

    $.each(idd, function (i, item) {
        if ($('#user' + idd[i]).val() === 'false') {
            valid = "false";
        }
    });
    if (selDest[0].value === "Select your destination") {
        selDest[0].style.border = "2px solid #c71706";
        selDest[0].className = "warning";
        valid = 'false';
    } else {
        if (valid === "false") {
            valid = 'false';
        }
    };
    if (valid === "false") {
        console.log(valid);
        return false;
    } else {
        var emailinfo = $.toJSON($('#contactForm').serialize());
        console.log("emailinfo = ");
        console.log(emailinfo);

        $.ajax({
            type: "POST",
            url: SiteName + "/Api/Emailtous",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(emailinfo),
            success: function (data) {
                //console.log("Succes: " + data);
                msg = data;
                msg === "True" ? formReset("contactForm") : alert(msg);
            },
            error: function (xhr, desc, exceptionobj) {
                console.log(xhr.responseText + ' = Error webservGetComponentList');
            }
        });

        //$.ajax({
        //    type: "POST",
        //    url: "/WS_Library.asmx/Emailtous",
        //    contentType: "application/json; charset=utf-8",
        //    dataType: "json",
        //    data: '{emailSet:' + JSON.stringify(emailinfo) + '}',
        //    success: function (res) {
        //        console.log(res.d);
        //        eval("(" + res.d + ")") === "True" ? formReset("contactForm") : alert(res.d);
        //    },
        //    error: function (xhr, desc, exceptionobj) {
        //        console.log(xhr.responseText + ' = Error webservGetComponentList');
        //    }
        //});
    };
};
function formReset(frmID) {
    alert("Email sent.");
    console.log($('#bkgNumber').is(':visible'));
    $('#' + frmID + ' input[type=text], select, textarea').each(function () { $(this).val($(this).attr("placeholder")); });
    $('#bkgNumber').is(':visible') === true ? ($('#chkshowBKnum').trigger('click'), $(".dvBknum").slideUp(), hideInfo("frmBKN")) : '';
    loadPage();
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
