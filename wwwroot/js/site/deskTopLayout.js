var _utCookie = utmValue;
var hvCook = 0;

$(document).ready(function () {
    $(".closeAnn").click(function () {
        $(".secAnnounce").slideUp(function () { $(".dvImgContainer").css({ "margin": "0 auto", "padding": "20px 0", "max-width": "980px", "height": "auto" }); });
    });

    fetch(SiteName + '/Api/WebAnnouncement')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (data != "") {
                var secAnn = '<section class="secTopAnnounce">' +
                    '<p class="closeTopAnn">X</p>' +
                    '<img src="https://pictures.tripmasters.com/siteassets/d/attention_icon2.png" />' + data +
                    '</section>';
                if (IsMobileDevice() == true) {
                    if (_utInputString.includes('home')) {
                        $(".dvMhomeContainer").prepend(secAnn);
                        $(".secTopAnnounce").css({ "margin": "0px auto 0px auto", "padding": "15px", "max-width": "95%", "background": "#333", "color": "white" });
                        $(".closeTopAnn").click(function () {
                            $(".secTopAnnounce").slideUp();
                        })
                    }
                    else {
                        $(".dvMhomeContainer").prepend(secAnn);
                        $(".secTopAnnounce").css({ "margin": "0px auto 0px auto", "padding": "15px", "max-width": "95%", "background": "#333", "color": "white" }).slideDown("fast");
                        $(".closeTopAnn").click(function () { $(".secTopAnnounce").slideUp("fast"); })
                    }
                } else {
                    if (_utInputString.includes('@@DFLT@@')) {
                        $(".dvContainer").prepend(secAnn);
                        $(".secTopAnnounce").css({ "margin": "0px auto 10px auto", "padding": "25px", "width": "930px", "background": "#333", "color": "white" });
                        //$(".dvContainer").css({ "margin": "0 auto", "padding": "0 0 20px 0", "max-width": "980px", "height": "auto" });
                        $(".closeTopAnn").click(function () {
                            $(".secTopAnnounce").slideUp(function () { $(".dvContainer").css({ "margin": "0 auto", "height": "auto" }); });
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
                }
            };
        })
        .catch(error => {
            console.error('Error fetching Web Announcement:', error);
        });
});
// -- LazyLoad --
document.addEventListener("DOMContentLoaded", function () {
    var lazyloadImages;

    if ("IntersectionObserver" in window) {
        lazyloadImages = Array.prototype.slice.call(document.querySelectorAll(".delay")); 
        var imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.remove("delay");
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
        });
    } else {
        var lazyloadThrottleTimeout;
        lazyloadImages = Array.prototype.slice.call(document.querySelectorAll(".delay")); 

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


