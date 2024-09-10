using log4net;
using System;
using System.Net;

namespace SPOTS_API_Attachment
{
    /*
     *  This classs is for creating web client, to call SPOTSAdminModule to produce OSI pdf
     */
    public class WebClientX : WebClient
    {
        public CookieContainer cookies = new CookieContainer();
        private static readonly log4net.ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        protected override WebRequest GetWebRequest(Uri location)
        {
            try
            {
                WebRequest req = base.GetWebRequest(location);
                if (req is HttpWebRequest)
                    (req as HttpWebRequest).CookieContainer = cookies;
                return req;
            }
            catch (Exception ex)
            {
                log.Error(ex.Message);
                return null;
            }
        }
        protected override WebResponse GetWebResponse(WebRequest request)
        {
            try
            {
                WebResponse res = base.GetWebResponse(request);
                if (res is HttpWebResponse)
                    cookies.Add((res as HttpWebResponse).Cookies);
                return res;
            }
            catch (Exception ex)
            {
                log.Error(ex.Message);
                return null;
            }
        }
    }
}
