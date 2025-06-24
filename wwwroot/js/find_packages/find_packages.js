$(document).ready(function () {
    document.querySelectorAll('input[id^="dotPrice"]').forEach(input => {
        input.addEventListener('change', () => {
            EnableUnckechOption();
            OpenPage(1);
        });
    });
    document.querySelectorAll('input[id^="dotLen"]').forEach(input => {
        input.addEventListener('change', () => {
            EnableUnckechOption();
            OpenPage(1);
        });
    });
    document.querySelectorAll('input[id^="dotCity"]').forEach(input => {
        input.addEventListener('change', () => {
            const inputValue = input.name;
            const placeId = input.value;
            const isInputChecked = input.checked;
            cutTitle(placeId, inputValue, isInputChecked);
            EnableUnckechOption();
            OpenPage(1);
        });
    });
    $('.package__mob-button').on('click', openFilterModal);
    $('#applyButton, .filter__modal-close').on('click', closeFilterModal);
    $('#resetFilter').on('click', function () {
        UncheckOptions('all');
    });
    $('button[id^="moreCities"]').on('click', showOtherCities);
    DisplayHeader(1);
});
function DisplayHeader(currentPage) {

    const totalPacks = $('#TotalPacks').val();
    $('#idTotalCount').text(totalPacks + " Itineraries");
    const noPages = Math.ceil(totalPacks / 20);
    if (noPages <= 1) {
        $('div[id^="idPages"]').html('');
        return;
    }
    let pagesStr = ''
    if (currentPage == 1)
        pagesStr = '<span class="packages__pag-prev disable"><span class="packages__pag-arrow">&#10094;</span> <span class="packages__pag-desk">Previous</span></span>'
    else
        pagesStr = '<button class="packages__pag-prev" type="button" onclick="OpenPage(' + (currentPage - 1) + ')"><span class="packages__pag-arrow">&#10094;</span> <span class="packages__pag-desk">Previous</span></button>'

    if (noPages <= 6) {
        for (i = 1; i <= noPages; i++) {
            if (i != currentPage)
                pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(' + i + ')">' + i + '</button>';
            else
                pagesStr = pagesStr + '<span class="packages__pag-page active">' + i + '</span>';
        }
    }
    else {
        if (currentPage < 4) {
            for (i = 1; i <= 4; i++) {
                if (i != currentPage)
                    pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(' + i + ')">' + i + '</button>';
                else
                    pagesStr = pagesStr + '<span class="packages__pag-page active">' + i + '</span>';
            }

            pagesStr = pagesStr + '<span class="packages__pag-page disable">...</span>';
            pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(' + noPages + ')">' + noPages + '</button>';
        }
        else {
            pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(1)">1</button>';
            pagesStr = pagesStr + '<span class="packages__pag-page disable">...</span>';

            if (currentPage + 2 < noPages) {
                for (i = currentPage - 1; i <= currentPage + 1; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(' + i + ')">' + i + '</button>';
                    else
                        pagesStr = pagesStr + '<span class="packages__pag-page active">' + i + '</span>';
                }

                pagesStr = pagesStr + '<span class="packages__pag-page disable">...</span>';
                pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(' + noPages + ')">' + noPages + '</button>';
            }
            else {
                for (i = noPages - 3; i <= noPages; i++) {
                    if (i != currentPage)
                        pagesStr = pagesStr + '<button class="packages__pag-page" type="button" onclick="OpenPage(' + i + ')">' + i + '</button>';
                    else
                        pagesStr = pagesStr + '<span class="packages__pag-page active">' + i + '</span>';
                }
            }
        }
    }
    if (currentPage == noPages)
        pagesStr = pagesStr + '<span class="packages__pag-next disable"><span class="packages__pag-desk">Next</span> <span class="packages__pag-arrow">&#10095;</span></span>'
    else
        pagesStr = pagesStr + '<button class="packages__pag-next" type="button" onclick="OpenPage(' + (currentPage + 1) + ')"><span class="packages__pag-desk">Next</span> <span class="packages__pag-arrow">&#10095;</span></button>'

    window.scrollTo(0, 0);
    $('div[id^="idPages"]').html(pagesStr);
    $('.packages__footer').show();
}
function OpenPage(pageNo) {
    $('#dvPackets').hide();
    $('#dvWaitPacks').show();

    const filter = BuildFilterExpression();
    const plcID = $('#IDplace').val();
    const OrderVal = $('#OrderVal').val();

    const params = new URLSearchParams({ plcID, filter, OrderVal, pageNo });
    getPackages(params, pageNo);
}
async function getPackages(params, pageNo) {
    const url = `${SiteName}/Api/FindAllPackages?${params}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        });

        if (response.status === 204) {
            //No packages found
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        // No data
        if (!data) return;

        const { totalPackages, packages } = data;

        $('#TotalPacks').val(totalPackages);
        $('select[id^="idOrderBy"]').prop('disabled', totalPackages === 0);

        DisplayHeader(pageNo);
        $('#dvWaitPacks').hide();

        if (totalPackages > 0) {
            BuildPackets(packages);
        } else {
            $('.packages__footer').hide();
            const noFoundHTML = `<li class="packages__no-found"><p>No itineraries found. Please try a different combination.</p></li>
                                 <li class="packages__banner">
                                     <a href="/build_your_own_vacation"><img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" data-src="https://pictures.tripmasters.com/siteassets/d/BuildOnYourOwn_Large.jpg" alt="banner build your own vacation" aria-label="Build your own vacation" /></a>
                                 </li>`;
            $('#dvPackets').html(noFoundHTML).show();
        }

    } catch (error) {
        console.error('API FindAllPackages: Request failed', error.message);
    }
};
function cutTitle(id, value, isChecked) {
    if (id == '' || typeof (id) === "undefined") {
        return;
    };
    let title = $('#mainTitleCountries').text();
    let name = value.replace(" and ", " & ");

    title = isChecked ? title + " - " + name : title.replace("- " + name, "");

    $('#mainTitleCountries').text(title.trim());
}

function EnableUnckechOption() {
    const noPriceOptions = $('input[type="checkbox"][id^="dotPrice"]:checked').length;
    $('#uncheckPrice').toggleClass('disable', noPriceOptions === 0);

    const noLengthOptions = $('input[type="checkbox"][id^="dotLen"]:checked').length;
    $('#uncheckLength').toggleClass('disable', noLengthOptions === 0);

    const noCitiesOptions = $('input[type="checkbox"][id^="dotCity"]:checked').length;
    $('#uncheckCities').toggleClass('disable', noCitiesOptions === 0);
}

function UncheckOptions(filterOption) {
    if (filterOption == 'price' || filterOption == 'all' && !$('#uncheckPrice').hasClass('disable')) {
        $('input[type="checkbox"][id^="dotPrice"]:checked').each(function () {
            $(this).prop('checked', false);
        });
    }

    if (filterOption == 'length' || filterOption == 'all' && !$('#uncheckLength').hasClass('disable')) {
        $('input[type="checkbox"][id^="dotLen"]:checked').each(function () {
            $(this).prop('checked', false);
        });
    }

    if (filterOption == 'city' || filterOption == 'all' && !$('#uncheckCities').hasClass('disable')) {
        $('input[type="checkbox"][id^="dotCity"]:checked').each(function () {
            $(this).prop('checked', false);
        });
        $('#mainTitleCountries').text('');
    };
    EnableUnckechOption();
    OpenPage(1);
}

function BuildFilterExpression() {
    let priceFilter = '';
    $('input[type="checkbox"][id^="dotPrice"]:checked').each(function () {
        priceFilter = priceFilter + $(this).val() + 'P';
    });

    let lengthFilter = '';
    $('input[type="checkbox"][id^="dotLen"]:checked').each(function () {
        lengthFilter = lengthFilter + $(this).val() + 'L';
    });

    let citiesFilter = '';
    $('input[type="checkbox"][id^="dotCity"]:checked').each(function () {
        citiesFilter = $(this).val() + 'C' + citiesFilter;
    });

    const filter = priceFilter + 'I' + lengthFilter + 'I' + citiesFilter;
    return filter;
}

function BuildPackets(packages) {
    let packageHTML = "";
    let packageUrl = "";
    packages.forEach((pack, index) => {
        packageUrl = `${SiteName}/${pack.countryname.replace(/\s/g, '_').toLowerCase()}/${pack.pdl_title.replace(/\s/g, '_').toLowerCase()}/package-${pack.pdlid}`;
        let internalCommentsHTML = "";
        if (pack.spd_internalcomments.indexOf("Partially") >= 0) {
            internalCommentsHTML += `<span>
                                     <img id="imgGuidedPartially${pack.pdlid}"
                                          src="https://pictures.tripmasters.com/siteassets/d/GuidedPartially.jpg"
                                          alt="" />
                                 </span>`
        } else if (pack.spd_internalcomments.indexOf("Guided") >= 0) {
            internalCommentsHTML += `<span>
                                     <img id="imgGuided${pack.pdlid}"
                                          src="https://pictures.tripmasters.com/siteassets/d/Guided.jpg"
                                          alt="" />
                                 </span>`
        }
        let priceHTML = "";
        let includesHTML = "";
        let includesHTML2 = "";
        if (pack.duration != "") {
            let nights = "";
            let ntsText = "";

            if (pack.spd_internalcomments.indexOf('Inflexible package') == -1) {
                nights = pack.duration + ' to ' + (parseInt(pack.duration) + Math.round(parseInt(pack.duration) / 2)) + '+ nights';
                ntsText = 'by selecting dates, No. of nights in each city and your departure city.';
            } else {
                nights = pack.duration + ' nights';
                ntsText = 'by selecting date, and your departure city.';
            }
            priceHTML = `<span class="packages__night">${nights}</span>
                         <div class="packages__tooltip">
                             <p>This packages is recommended for ${nights}.</p>
                             <p><span>Customize it</span> ${ntsText}</p>
                         </div>`;

            if (pack.stp_save != 9999 && pack.stp_save != '') {
                priceHTML = `<span class="packages__night">${nights} from </span>
                             <div class="packages__tooltip">
                                  <p>This packages is recommended for ${nights}.</p>
                                  <p><span>Customize it</span> ${ntsText}</p>
                             </div>
                             <span>${formatCurrency(pack.stp_save, 0)}*</span>`;
                includesHTML += `<span>${nights}</span><span> from <span>${formatCurrency(pack.stp_save, 0)}</span> w/air, hotel & air taxes*</span>`;
                includesHTML2 = `<p class="packages__includes-info">This sample price includes ALL air taxes & fuel surcharges: priced within the past 7 days for arrival on ${pack.stp_starttraveldate}. Choose your own departure city and dates.</p>`;
            }
        }
        let feedbackHTML = "";
        if (pack.nooffeed != '0') {
            const feedbackUrl = `${SiteName}/${pack.countryname.replace(/\s/g, '_').toLowerCase()}/${pack.pdl_title.replace(/\s/g, '_').toLowerCase()}/feedback-${pack.pdlid}`;
            feedbackHTML = `<a class="packages__feedback" href="${feedbackUrl}" target="_blank" rel="noopener noreferrer"> Customer feedback (${pack.nooffeed})</a>`;
        }

        const matchChar = new RegExp(/<[^<>]+>/g);
        let descr = pack.spd_description;
        descr = descr.replace(matchChar, "")
        if (descr.length > 340) {
            descr = descr.substring(0, 340);
            descr = descr + ' ... ';
        }
        let includesListHtml = "";
        let includesItems = pack.pdl_content.split("\n").map(item => item.trim()).filter(item => item);
        includesItems.forEach(item => {
            includesListHtml += `<li>${item}</li>`;
        });
        packageHTML += `<li class="packages__item">
                           <a class="packages__img" href="${packageUrl}">
                                <img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" data-src="https://pictures.tripmasters.com${pack.img_path_url}" alt="View of ${pack.pdl_title}" />
                            </a>
                            <div class="packages__info">
                                <div class="packages__wrapper">
                                    <a class="packages__link" href="${packageUrl}">
                                        <h3>${pack.pdl_title}
                                            ${internalCommentsHTML}
                                        </h3>
                                    </a>
                                    <div class="packages__price">
                                        ${priceHTML}
                                    </div>
                                </div>
                                ${feedbackHTML}
                                <p class="packages__description">${descr}</p>
                                <button class="packages__button-includes" type="button" onclick="dvOpenMain('divInfo${pack.pdlid}');">Package Includes</button>
                                <div class="packages__includes is-hidden" id="divInfo${pack.pdlid}">
                                    <button class="packages__includes-close" type="button" onclick="dvCloseMain('divInfo${pack.pdlid}')">✖</button>
                                    <h3 class="packages__includes-title">${pack.pdl_title}</h3>
                                    <div class="packages__includes-price">
                                        ${includesHTML}
                                    </div>
                                    ${includesHTML2}
                                    <p class="packages__includes-list-title">This ${pack.duration} night sample itinerary includes:</p>
                                    <ul class="packages__includes-list">${includesListHtml}</ul>
                                    <a class="packages__includes-more" href="${packageUrl}">More Details</a>
                                </div>
                            </div>
                        </li>`;

        if (index == 4) {
            packageHTML += `<li class="packages__banner">
                            <a href="/build_your_own_vacation">
                                <img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" data-src="https://pictures.tripmasters.com/siteassets/d/BuildOnYourOwn_Large.jpg" alt="banner build your own vacation" aria-label="Build your own vacation" />
                            </a>
                        </li>`;
        }

    });

    if (packages.length - 1 < 4) {
        packageHTML += `<li class="packages__banner">
                            <a href="/build_your_own_vacation">
                                <img class="lazyload" src="https://pictures.tripmasters.com/siteassets/d/spacer.gif" data-src="https://pictures.tripmasters.com/siteassets/d/BuildOnYourOwn_Large.jpg" alt="banner build your own vacation" aria-label="Build your own vacation" />
                            </a>
                        </li>`;
    }

    $('#dvPackets').html(packageHTML);
    $('#dvPackets').show();
}

function getOrderValue() {
    const valOrderBy = $('#idOrderBy option:selected').val();
    $('#OrderVal').val(valOrderBy);
    OpenPage(1);
}

function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num);
}
function dvOpenMain(id) {
    $('#' + id).removeClass('is-hidden');
}
function dvCloseMain(id) {
    $('#' + id).addClass('is-hidden');
}
function openFilterModal() {
    $('#filterModal').removeClass('is-hidden');
    $('body').addClass('modal-open');
}
function closeFilterModal() {
    $('#filterModal').addClass('is-hidden');
    $('body').removeClass('modal-open');
}
function showOtherCities() {
    const isNumber = /[0-9]+/g;
    const id = this.id.match(isNumber);
    $(`#listCities${id} .filter__item-hidden`).each(function () {
        $(this).removeClass('filter__item-hidden');
    });
    $(this).hide();
}
