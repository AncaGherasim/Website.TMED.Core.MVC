using Amazon;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TMED.Infrastructure;
using MVC_TMED.Models;
using MVC_TMED.Models.ViewModels;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TMED.Controllers
{
    public class HotelController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public HotelController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("{country}/{city}/{title}/hotel-{id}", Name = "Hotel_Route")] //Costa_Rica/Arenal_Vocano/El_Silencio_del_Campo/hotel-123308
        [HttpHead("{country}/{city}/{title}/hotel-{id}", Name = "Hotel_Route")] //Costa_Rica/Arenal_Vocano/El_Silencio_del_Campo/hotel-123308
        [HttpPost("{country}/{city}/{title}/hotel-{id}", Name = "Hotel_Route")] //Costa_Rica/Arenal_Vocano/El_Silencio_del_Campo/hotel-123308
        public async Task<IActionResult> Index(string country, string city, string title, string id)
        {
            HttpContext.Response.Headers.Add("_utPg", "HOT");

            var viewModel = new HotelViewModel
            {
                CountrySlug = country,
                CitySlug = city,
                TitleSlug = title,
                CountryName = FormatRouteValue(country),
                CityName = FormatRouteValue(city),
                TitleName = FormatRouteValue(title)
            };

            ViewBag.hotID = id;
            ViewBag.cityNA = viewModel.CityName;

            var lookupResult = await _dapperWrap.GetRecords<HotelLambdaLookup>(SqlCalls.SQL_HotelLambdaLookup(), new { PDLID = id });
            var lookup = lookupResult.FirstOrDefault();
            if (lookup is null)
            {
                return NotFound();
            }

            var lambdaResponse = await GetHotelFromLambdaAsync(lookup.GIPHID);
            if (lambdaResponse?.StatusCode != 200 || lambdaResponse.Body == null)
            {
                return NotFound();
            }

            viewModel.Hotel = lambdaResponse.Body;
            if (string.IsNullOrWhiteSpace(viewModel.Hotel.City))
            {
                viewModel.Hotel.City = viewModel.CityName;
            }

            var pageTitle = $"{viewModel.Hotel.Name} in {viewModel.Hotel.City}, {viewModel.CountryName} | Tripmasters Hotels";
            var pageMetaDesc = $"Book the {viewModel.Hotel.Name} in {viewModel.Hotel.City}, {viewModel.CountryName} and get great deals.";
            var pageMetaKey = "Europe vacations, European tours, Europe tour packages, vacation packages, to Europe, hotel deals, online booking, pricing, information, hotel travel, hotel, resort, accommodations, Europe, France, Paris, England, London, Netherlands, Italy, Spain";

            ViewBag.PageTitle = pageTitle;
            ViewBag.pageMetaDesc = pageMetaDesc;
            ViewBag.pageMetaKey = pageMetaKey;
            ViewBag.viewUsedName = "Hotel";
            ViewBag.tmpagetype = "hotel";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "europe";
            ViewBag.tmcountry = country;
            ViewBag.tmdestination = city;

            ViewBag.Mobile = Utilities.CheckMobileDevice() ? 1 : 0;
            return View("Hotel", viewModel);
        }

        private static string FormatRouteValue(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            return textInfo.ToTitleCase(value.Replace("_", " "));
        }

        private async Task<HotelLambdaResponse> GetHotelFromLambdaAsync(int giphId)
        {
            var credentials = await _dapperWrap.GetRecords<AwsCredentials>(_appSettings.AWSConnection.AwsCredentialsQuery);
            var awsCredential = credentials.FirstOrDefault();
            if (awsCredential is null)
            {
                return null;
            }

            using AmazonLambdaClient client = new AmazonLambdaClient(awsCredential.AWSK_AccessKey, awsCredential.AWSK_SecretKey, RegionEndpoint.USEast1);
            var payloadObject = new Dictionary<string, object>
            {
                { "giphid", giphId }
            };

            var functionName = string.IsNullOrWhiteSpace(_appSettings.ApplicationSettings.HotelLambdaFunctionName)
                ? "HotelLambda"
                : _appSettings.ApplicationSettings.HotelLambdaFunctionName;

            var invokeRequest = new InvokeRequest
            {
                FunctionName = $"arn:aws:lambda:{_appSettings.AWSConnection.AwsRegionId}:function:{functionName}",
                InvocationType = InvocationType.RequestResponse,
                Payload = JsonConvert.SerializeObject(payloadObject)
            };

            try
            {
                var response = await client.InvokeAsync(invokeRequest);
                if (!string.IsNullOrEmpty(response.FunctionError))
                {
                    return null;
                }

                using var streamReader = new StreamReader(response.Payload);
                var content = await streamReader.ReadToEndAsync();
                if (string.IsNullOrWhiteSpace(content))
                {
                    return null;
                }

                return JsonConvert.DeserializeObject<HotelLambdaResponse>(content);
            }
            catch
            {
                return null;
            }
        }
    }
}
