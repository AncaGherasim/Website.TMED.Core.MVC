using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using System.Xml.Xsl;
using System.Xml.XPath;
using System.Collections;
using System.Text;
using System.Xml;
using System.Security;
using System.Drawing;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Threading.Tasks;

[Route("Image")]
public class ImageResize : Controller
{
    private IDistributedCache _distributedCache;

    public ImageResize(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    [HttpGet("ResizeImage")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any, NoStore = false)]
    public ActionResult ResizeImage([FromQuery] string m_filename, [FromQuery] Int32 m_width, [FromQuery] Int32 m_height)   ////http://localhost:65312/Image/ResizeImage?m_filename=https://pictures.tripmasters.com/images/packages/ireland/galway-galwayroad-200.jpg&m_width=180&m_height=180
    //public async Task<IActionResult> ResizeImage([FromQuery] string m_filename, [FromQuery] Int32 m_width, [FromQuery] Int32 m_height)   ////http://localhost:65312/Image/ResizeImage?m_filename=https://pictures.tripmasters.com/images/packages/ireland/galway-galwayroad-200.jpg&m_width=180&m_height=180
    {
        //return await ResizeImageDistributedCache(m_filename, m_width, m_height);
        //var key = $"/{m_width}/{m_height}/{m_filename}";
        //var cachedResizedImage = await _distributedCache.GetAsync(key);
        //if (cachedResizedImage == null)
        //{
        WebClient wc = new WebClient();
            byte[] bytes = wc.DownloadData(m_filename);
            MemoryStream ms = new MemoryStream(bytes);

        Response.Headers["Cache-Control"] = $"public,max-age={86400}";

        using (Image image = System.Drawing.Image.FromStream(ms))
            {
                return new ImageResponse(image.BestFit(m_width, m_height), _distributedCache);
            }
        //}
        //else
        //{
        //    byte[] encodedResizedImage = _distributedCache.Get(key);
        //    return File(encodedResizedImage, "image/jpg");
        //}
    }

    //public ActionResult ResizeImageDistributedCache(string m_filename, Int32 m_width, Int32 m_height)   ////http://localhost:65312/Image/ResizeImage?m_filename=https://pictures.tripmasters.com/images/packages/ireland/galway-galwayroad-500.jpg&m_width=180&m_height=180
    //{
    //    var key = $"/{m_width}/{m_height}/{m_filename}";
    //    var cachedResizedImage = _distributedCache.GetAsync(key);
    //    if (cachedResizedImage == null)
    //    {
    //        WebClient wc = new WebClient();
    //        byte[] bytes = wc.DownloadData(m_filename);
    //        MemoryStream ms = new MemoryStream(bytes);

    //        using (Image image = System.Drawing.Image.FromStream(ms))
    //        {
    //            return new ImageResponse(image.BestFit(m_width, m_height), _distributedCache);
    //        }
    //    }
    //    else
    //    {
    //        byte[] encodedResizedImage = _distributedCache.Get(key);
    //        return File(encodedResizedImage, "image/jpg");
    //    }

    //}

}