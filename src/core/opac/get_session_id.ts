import * as cheerio from "cheerio";
import axios from "axios";
import { opacConstants } from "../../config/opac.constants";
import { AppError } from "../../errors/app_error";


export default async function getSessionId() {
  try {
    const response = await axios.get(opacConstants.BASE_URL);

    const $ = cheerio.load(response.data);
    const scriptContent = $("script");
    let sessionId = '';
    scriptContent.each((i, elem) => {
      const scriptText = $(elem).html();
      if (scriptText) {
        const match = RegExp(/SessionID\s*=\s*(\d+)/).exec(scriptText);
        if (match) {
          sessionId = match[1];
        }
      }
    });

    if (!sessionId) {
      throw new AppError("Failed to retrieve session ID", 500, "server");
    }

    return sessionId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError("Service unavailable", 503, "network");
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Internal server error", 500, "server"); 
  }
}
