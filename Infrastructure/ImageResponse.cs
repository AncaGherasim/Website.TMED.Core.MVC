using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.IO;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;

/// <summary>
/// Summary description for ImageResponse
/// </summary>
public class ImageResponse : ActionResult
{
    private IDistributedCache _distributedCache;
    private readonly Image _image;
    public ImageResponse(Image image, IDistributedCache distributedCache)
    {
        _image = image;
        _distributedCache = distributedCache;
    }
    public override void ExecuteResult(ActionContext context)  ///async
    {
        HttpResponse response = context.HttpContext.Response;
        response.ContentType = "image/jpeg";
        var c = context.ModelState;
        var m_width = _image.Width;
        var m_height = _image.Height;
        var m_filename = c["m_filename"].AttemptedValue;
        var key = $"/{m_width}/{m_height}/{m_filename}";
        long encq = 95L;
        if (_image.Height < 200)
        {
            encq = 80L;
        }
        try
            {
            using (EncoderParameters encoderParameters = new EncoderParameters(1))
            using (EncoderParameter encoderParameter = new EncoderParameter(Encoder.Quality, encq))
            {
                ImageCodecInfo codecInfo = ImageCodecInfo.GetImageDecoders().First(codec => codec.FormatID == ImageFormat.Jpeg.Guid);
                encoderParameters.Param[0] = encoderParameter;
                _image.Save(response.Body, codecInfo, encoderParameters);   //.OutputStream

                ////save in Redis
                //MemoryStream memoryStream = new MemoryStream();
                //_image.Save(memoryStream, codecInfo, encoderParameters);   //.OutputStream
                //var cacheEntryOptions = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromSeconds(300));
                //await _distributedCache.SetAsync(key, memoryStream.ToArray(), cacheEntryOptions);
            }
            //_image.Save(response.OutputStream, ImageFormat.Jpeg);
        }
        finally
        {
            _image.Dispose();
        }
    }
}