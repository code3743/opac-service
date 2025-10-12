export default function opacCookies(sessionId: string): string {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = String(date.getMonth()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `cgi-olib_UsesCookies=Notified%3A%20${month}%2F${day}%2F${year}; cgi-olib_SessionID=${sessionId}; cgi-olib_Language=undefined; cgi-olib_lastSearchType=kws2; SessionID=${sessionId}`;
}