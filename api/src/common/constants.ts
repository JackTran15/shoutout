export const COOKIES_REFRESH_TOKEN_KEY = 'a_rt';

export const HEADERS_REFRESH_TOKEN_KEY = 'a-rt';

export const COOKIES_EXPIRE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const isProduction = () => process.env.NODE_ENV === 'production';
