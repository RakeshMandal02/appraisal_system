export const ironOptions = {
    cookieName: "appraisal_session",
    password: process.env.SESSION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production"
    },
};