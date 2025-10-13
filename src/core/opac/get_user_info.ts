import axios from "axios";
import * as cheerio from "cheerio";
import { StudentBookTransaction, StudentProfile } from "../../types/student";
import { opacConstants } from "../../config/opac.constants";
import opacCookies from "../../utils/opac_cookies";
import { AppError } from "../../errors/app_error";


async function _getUserInfo(sessionId: string): Promise<any> {
    try {
        const response = await axios.get(opacConstants.BASE_URL + opacConstants.PROFILE_PATH,
            {
                headers: {
                    referer: opacConstants.BASE_URL,
                    cookie: opacCookies(sessionId)
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new AppError('Service unavailable', 503, 'network');
        }
        throw new AppError('Internal server error', 500, 'server');
    }
}


export async function getUserInfo(sessionId: string): Promise<StudentProfile> {
        const data = await _getUserInfo(sessionId);
        const $ = cheerio.load(data);
        const firstName = $('#user_fname_text').text().trim() || '';
        const lastName = $('#user_sname_text').text().trim() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const programs = $('#user_depts_text > span')?.map((_, el) => {
            const code = $(el).attr('code')?.trim() || '';
            const name = $(el).text().trim();
            return { code, name };
        }).get() || [];

        const location = $('#user_LOC_text').text().trim() || '';
        const fine = parseFloat($('#user_CURBAL_text').text().trim().replaceAll(',', '')) || 0.0;
        return {
            code: $('#user_barcode_text').text().trim(),
            firstName,
            fullName,
            programs: programs,
            fine,
            location: location
        }

}


export async function getUserLoans(sessionId: string): Promise<StudentBookTransaction[]> {
    const data = await _getUserInfo(sessionId);
    const $ = cheerio.load(data);
        const borrowedBooks = $('#user_tab_loan table > tbody > tr')?.map((_, el) => {
            if (_ === 0) return null;
            const cells = $(el).find('td');
            return {
                identifier: $(cells[0]).text().trim(),
                title: $(cells[1]).text().trim(),
                location: $(cells[2]).text().trim(),
                date: $(cells[3]).text().trim(),
                fine: parseFloat($(cells[4]).text().trim().replaceAll(',', '')) || 0.0,
            };
        }).get() || [];

    return borrowedBooks;
}

export async function getUserHistory(sessionId: string): Promise<StudentBookTransaction[]> {
    const data = await _getUserInfo(sessionId);
    const $ = cheerio.load(data);

    const history = $('#user_tab_hist  table > tbody > tr')?.map((_, el) => {
            if (_ === 0) return null; 
            const cells = $(el).find('td');
            return {
                identifier: $(cells[0]).text().trim(),
                title: $(cells[1]).text().trim(),
                location: $(cells[2]).text().trim(),
                transactionType: $(cells[3]).text().trim(),
                date: $(cells[4]).text().trim(),
            };
        }).get() || [];

    return history;
}