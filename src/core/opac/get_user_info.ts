import axios from "axios";
import * as cheerio from "cheerio";
import { StudentProfile } from "../../types/student";
import { opacConstants } from "../../config/opac.constants";
import opacCookies from "../../utils/opac_cookies";
import { AppError } from "../../errors/app_error";

export default async function getUserInfo(sessionId: string): Promise<StudentProfile> {

    try {
        const response = await axios.get(opacConstants.BASE_URL + opacConstants.PROFILE_PATH,
            {
                headers: {
                    referer: opacConstants.BASE_URL,
                    cookie: opacCookies(sessionId)
                }
            }
        );
        const $ = cheerio.load(response.data);
        const firstName = $("#user_fname_text").text().trim() || '';
        const lastName = $("#user_sname_text").text().trim() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const programs = $("#user_depts_text > span")?.map((_, el) => {
            const code = $(el).attr("code")?.trim() || "";
            const name = $(el).text().trim().replace(' - ' + code, ' ');
            return { code, name };
        }).get() || [];

        const location = $("user_LOC_text").text().trim() || '';
        const fine = parseFloat($("#user_fine_text").text().trim().replaceAll(",", "")) || 0.0;


        return {
            code: $("#user_code_text").text().trim(),
            firstName,
            fullName,
            programs: programs,
            fine,
            history: [],
            borrowedBooks: [],
            location: location
        }
    } catch (error) {

        if (axios.isAxiosError(error)) {
            throw new AppError("Service unavailable", 503, "network");
        }
        
        throw new AppError("Internal server error", 500, "server");
    }

}