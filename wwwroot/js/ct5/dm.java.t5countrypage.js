let placeID = "";

document.addEventListener('DOMContentLoaded', () => {
    placeID = $('#placeID').val();

    toggleSection('guide', 'See all');
    toggleSection('highlight', 'Show More');

    document.querySelectorAll('button[id*="faq-"]').forEach(button => {
        button.addEventListener('click', () => onClickFAQInfo(button));
    });
    $('#seeAllCities').click(function () { getPlacesOnCountry(placeID) });
    $('.modal__close').click(closeAllCities);
    swapButtons('suggested');
});
function toggleSection(name, showMoreText = 'Show More') {
    const button = document.getElementById(`${name}ToggleButton`);
    if (!button) return;

    button.addEventListener('click', () => {
        const list = document.getElementById(`${name}List`);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        list.classList.toggle('expanded', !isExpanded);
        button.setAttribute('aria-expanded', (!isExpanded).toString());

        const buttonSpan = button.querySelector('span');
        if (buttonSpan) {
            buttonSpan.textContent = isExpanded ? showMoreText : 'Show less';
        } else {
            button.textContent = isExpanded ? showMoreText : 'Show less';
        }
    });
}
function swapButtons(name) {
    const button = document.getElementById(`${name}Button`);
    if (!button) return;

    button.addEventListener('click', () => {
        const list = document.getElementById(`${name}List`);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        list.classList.toggle('expanded', !isExpanded);
        button.setAttribute('aria-expanded', (!isExpanded).toString());

        button.style.display = "none";

        const link = document.getElementById(`${name}Link`);
        link.style.display = "block";
    });
}
function onClickFAQInfo(el) {
    const idNumber = el.id.split('-')[1];
    const item = document.getElementById(`faqItem-${idNumber}`);
    if (!item) return;

    const isExpanded = el.getAttribute('aria-expanded') === 'true';
    item.classList.toggle('expanded', !isExpanded);
    el.setAttribute('aria-expanded', (!isExpanded).toString());

    const submenu = document.getElementById(`faqInfo-${idNumber}`);

    if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
    } else {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    }
}
function openWinCMS(jhref) {
    centerWindow(jhref);
    return false;
}
function getPlacesOnCountry(id) {
    $('#cities_modal').removeClass('is-hidden');
    $('body').addClass('modal-open');
    var options = {};
    options.url = SiteName + "/Api/CountryPlaces";
    options.type = "POST";
    options.contentType = "application/json";
    options.data = JSON.stringify(id);
    options.dataType = "json";
    options.success = function (data) {
        let popcities = "";
        let popregions = "";
        let cities = [];
        let regions = [];
        data.forEach(function (city) {
            if (city.CityType == 1 || city.CityType == 25) {
                cities.push(city);
            }
            else {
                regions.push(city);
            }
        });
        cities.forEach(function (cty) {
            popcities += `<li><a href="/latin/${cty.CityName.replaceAll(' ', '_').toLowerCase()}/vacations">${cty.CityName}</a></li>`
        });
        regions.forEach(function (reg) {
            popregions += `<li><a href="/latin/${reg.CityName.replaceAll(' ', '_').toLowerCase()}/vacations">${reg.CityName}</a></li>`
        });
        $('.cities__modal-list').html(popcities);
        $('.regions__modal-list').html(popregions);
    };
    options.error = function (xhr, desc, exceptionobj) {
        alert(xhr.responseText);
    };
    $.ajax(options);
}
function closeAllCities() {
    $('#cities_modal').addClass('is-hidden');
    $('body').removeClass('modal-open');
};