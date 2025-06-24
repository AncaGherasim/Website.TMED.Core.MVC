using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;


public enum Dimensions
{
    Width,
    Height
}

/// <summary>
/// Summary description for ImageExtensions
/// </summary>
public static class ImageExtensions
{
    public static Image BestFit(this Image image, int height, int width)
    {
        return image.Height > image.Width
            ? image.ConstrainProportions(height, Dimensions.Height)
            : image.ConstrainProportions(width, Dimensions.Width);
    }

    public static Image ConstrainProportions(this Image imgPhoto, int size, Dimensions dimension)
    {
        var sourceWidth = imgPhoto.Width;
        var sourceHeight = imgPhoto.Height;
        var sourceX = 0;
        var sourceY = 0;
        var destX = 0;
        var destY = 0;
        float nPercent;
        switch (dimension)
        {
            case Dimensions.Width:
                nPercent = (float)size / (float)sourceWidth;
                break;
            default:
                nPercent = (float)size / (float)sourceHeight;
                break;
        }
        int destWidth = (int)(sourceWidth * nPercent);
        int destHeight = (int)(sourceHeight * nPercent);
        Bitmap bmPhoto = new Bitmap(destWidth, destHeight, PixelFormat.Format64bppArgb);
        bmPhoto.MakeTransparent();
        if (sourceWidth < 10)
        {
            bmPhoto.SetResolution(72, 72);
            Image.GetThumbnailImageAbort myCallback = new Image.GetThumbnailImageAbort(ThumbnailCallback);
            Image myThumbnail = bmPhoto.GetThumbnailImage(180, 180, myCallback, IntPtr.Zero);
            return bmPhoto;
        }
        else
        {
            bmPhoto.SetResolution(imgPhoto.HorizontalResolution, imgPhoto.VerticalResolution);

            Graphics grPhoto = Graphics.FromImage(bmPhoto);
            grPhoto.CompositingMode = CompositingMode.SourceCopy;
            //grPhoto.Clear(Color.White);
            //grPhoto.DrawImageUnscaled(imgPhoto, 0, 0);
            grPhoto.CompositingQuality = CompositingQuality.HighSpeed;
            grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;
            grPhoto.SmoothingMode = SmoothingMode.HighSpeed;
            grPhoto.PixelOffsetMode = PixelOffsetMode.Half;
            try
            {
                using (ImageAttributes wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    grPhoto.DrawImage(imgPhoto, new Rectangle(destX, destY, destWidth, destHeight), sourceX, sourceY, imgPhoto.Width, imgPhoto.Height, GraphicsUnit.Pixel, wrapMode);
                }

                //grPhoto.DrawImage(imgPhoto,
                //    new Rectangle(destX, destY, destWidth, destHeight),
                //    new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
                //    GraphicsUnit.Pixel
                //);
            }
            finally
            {
                grPhoto.Dispose();
            }
            return bmPhoto;
        }
    }

    public static bool ThumbnailCallback()
    {
        return false;
    }
}