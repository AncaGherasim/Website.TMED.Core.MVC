var _utCookie = utmValue;
var hvCook = 0;

$(document).ready(function () {

    var backCook = ["TMLDpkbyoBack", "frmBack", "bpBack", "LDcalCount", "TM_BackCookie"];
    var cok;
    var cokC = 1;
    for (var i = 0; i < backCook.length; i++) {
        getCookie(backCook[i]) != null ? hvCook = 1 : '';
        backCook.length - 1 === cokC++ ? checkCook() : '';
    };

    $(".closeAnn").click(function () {
        $(".secAnnounce").slideUp(function () { $(".dvImgContainer").css({ "margin": "0 auto", "padding": "20px 0", "max-width": "980px", "height": "auto" }); });
    });

    if (webAnnounce != "") {
        var secAnn = '<section class="secTopAnnounce">' +
            '<p class="closeTopAnn">X</p>' +
            '<img src="https://pictures.tripmasters.com/siteassets/d/attention_icon2.png" />' + webAnnounce +
            '</section>'
        if (_utInputString.includes('@@DFLT@@')) {
            $(".dvImgContainer").prepend(secAnn);
            $(".secTopAnnounce").css({ "margin": "0px auto 10px auto", "padding": "25px", "width": "930px", "background": "#333", "color": "white" });
            $(".dvImgContainer").css({ "margin": "0 auto", "padding": "0 0 20px 0", "max-width": "980px", "height": "auto" });
            $(".closeTopAnn").click(function () {
                $(".secTopAnnounce").slideUp(function () { $(".dvImgContainer").css({ "margin": "0 auto", "padding": "20px 0", "max-width": "980px", "height": "auto" }); });
            })
        }
        else if (_utInputString.includes('@@COU@@')) {
            $(".dvContainer").prepend(secAnn);
            $(".secTopAnnounce").css({ "margin": "0px auto 10px auto", "padding": "25px", "width": "930px", "background": "#333", "color": "white" });
            $(".divImgContainer").css({ "padding": "0 0 30px 0", "max-width": "980px", "height": "auto" });
            $(".closeTopAnn").click(function () {
                $(".secTopAnnounce").slideUp(function () { $(".divImgContainer").css({ "margin": "0 auto", "padding": "70px 0 0", "height": "auto" }); });
            })
        }
        else if (/@@CTY@@|@@PKG@@/.test(_utInputString) === true) {
            $(".dvContainer").prepend(secAnn);
            $(".secTopAnnounce").css({ "margin": "0 auto", "padding": "30px", "width": "918px", "background": "#333", "color": "white" }).slideDown("fast");
            $(".closeTopAnn").click(function () { $(".secTopAnnounce").slideUp("fast"); })
        }
    };
});

function checkCook() {
    hvCook === 0 ? userHomeTown != '' ? userHomeTown != 'none' ? checkCalendar() : '' : '' : '';
};

//// -- Google Analytics Code for DomainName = Tripmasters.com  --
//var _gaq = _gaq || [];
//_gaq.push(['_setAccount', 'UA-71558-11']);
//_gaq.push(['_setDomainName', 'tripmasters.com']);
//_gaq.push(['_trackPageview']);
//(function () {
//    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//})();

//// -- Google Code for Latin.TripMasters.com --
//// -- Remarketing tags may not be associated with personally identifiable
//// -- information or placed on pages related to sensitive categories. For
//// -- instructions on adding this tag and more information on the above
//// --requirements, read the setup guide: google.com / ads / remarketingsetup --
///* <![CDATA[ */
//var google_conversion_id = 1071961385;
//var google_conversion_label = '4jQGCPSRqwgQqaqT_wM';
//var google_custom_params = window.google_tag_params;
//var google_remarketing_only = true;
///* ]]> */
//(function () {
//    var remk = document.createElement('script'); remk.type = 'text/javascript'; remk.async = true;
//    remk.src = '//www.googleadservices.com/pagead/conversion.js';
//    var rems = document.getElementsByTagName('script')[0]; rems.parentNode.insertBefore(remk, rems);
//})();
//var $nosHtml = $('<noscript><div style="display: inline;">' +
//    '<img height = "1" width = "1" style = "border-style: none;" alt = "" src = "//googleads.g.doubleclick.net/pagead/viewthroughconversion/1071961385/? ' +
//    'value = 0 & amp; label = 4jQGCPSRqwgQqaqT_wM & amp; guid = ON & amp; script = 0" /></div></noscript>');
//$nosHtml.appendTo('body');
////$('body').append(nosHtml);

//// -- Google chart --
//var imgsrc = window.location
//var gourl = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'chart.apis.google.com/chart?cht=qr&chs=200x200&chl=' + imgsrc + '&chld=H|0" border="0"';
//var $img = $('<div style="margin:0 auto; width:200px"><img src="' + gourl + '"/></div>');
//$img.appendTo($('body'));

//// --- Replace on anchors http by https
//'https:' === document.location.protocol ? (
//    $("a[href^='http:']").each(function () {
//        /blog./.test(this.href) ? '' :
//            this.href = this.href.replace('http://', 'https://');
//    })
//) : '';

//// -- Bing Tracking  --
//(function (w, d, t, r, u) {
//    var f, n, i; w[u] = w[u] || [], f = function () {
//        var o = { ti: "5664894" }; o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
//    }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () {
//        var s = this.readyState; s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
//    }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
//})(window, document, "script", "//bat.bing.com/bat.js", "uetq");
//var $bingNscpt = $('<noscript><img src="//bat.bing.com/action/0?ti=5664894&Ver=2" height="0" width="0" style="display: none; visibility: hidden;" /></noscript>');
//$bingNscpt.appendTo('body');

//// -- Yahoo Tracking  --
//(function (w, d, t, r, u) {
//    w[u] = w[u]
//        || []; w[u].push({ 'projectId': '10000', 'properties': { 'pixelId': '11494' } }); var s = d.createElement(t); s.src = r; s.async = true; s.onload = s.onreadystatechange = function () {
//            var y, rs = this.readyState, c = w[u];
//            if (rs && rs != "complete" && rs != "loaded") { return } try {
//                y = YAHOO.ywa.I13N.fireBeacon; w[u] = []; w[u].push = function (p) { y([p]) }; y(c)
//            } catch (e) { }
//        }; var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr)
//})(window, document, "script", "https://s.yimg.com/wi/ytc.js", "dotq");

//// -- AddShoppers Tag --
//var AddShoppersWidgetOptions = { 'loadCss': false };
//var js = document.createElement('script'); js.type = 'text/javascript'; js.async = true; js.id = 'AddShoppers';
//js.src = ('https:' == document.location.protocol ? 'https://shop.pe/widget/' : 'http://cdn.shop.pe/widget/') + 'widget_async.js#5d77a5d6d559307f92938135';
//document.getElementsByTagName("head")[0].appendChild(js);

// -- LazyLoad --
document.addEventListener("DOMContentLoaded", function () {
    var lazyloadImages;

    if ("IntersectionObserver" in window) {
        lazyloadImages = Array.prototype.slice.call(document.querySelectorAll(".delay")); //document.querySelectorAll(".delay");
        var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove("delay");
                    //image.removeAttribute('class');
                    //image.removeAttribute('data-src');
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
        });
    } else {
        var lazyloadThrottleTimeout;
        lazyloadImages = Array.prototype.slice.call(document.querySelectorAll(".delay")); //document.querySelectorAll(".delay");

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function () {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function (img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('delay');
                        //img.removeAttribute('class');
                        //img.removeAttribute('data-src');
                    }
                });
                if (lazyloadImages.length == 0) {
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }
});


