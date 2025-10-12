import axios from "axios";
import md5 from "md5";
import * as cheerio from "cheerio";
import { opacConstants } from "../../config/opac.constants";
import opacCookies from "../../utils/opac_cookies";
import { AppError } from "../../errors/app_error";

export default async function authUser(user: string, sessionId: string  ): Promise<boolean> {
  try {
    const authentication = sessionId + ":" + user.toUpperCase();
    const authentication2 = authentication;
    const authHash = md5(authentication).toUpperCase();
    const auth2Hash = md5(authentication2).toUpperCase();
    const finalAuth =
      md5(user.toUpperCase()).toUpperCase().slice(-8) + authHash;
    const response = await axios.post(
      opacConstants.BASE_URL + opacConstants.LOGIN_PATH,
      new URLSearchParams({
        action: "authenticate",
        authentication: finalAuth + "-" + auth2Hash,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          referer: opacConstants.BASE_URL,
          cookie: opacCookies(sessionId),
        },
        maxRedirects: 0,
        validateStatus: (status) => !!status && status >= 200 && status < 400,
      }
    );

    const $ = cheerio.load(response.data);
    const loginError = $(".loginForm").text().trim() || "";
    if (loginError) {
      return false;
    }

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError("Service unavailable", 503, "network");
    }
    throw new AppError("Internal server error", 500, "server");
  }
}
