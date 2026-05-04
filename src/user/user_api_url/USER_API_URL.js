export const USER_API_URL = {

    //Auth 
    LOGIN: '/user/auth/login',
    REGISTER: '/user/auth/register',
    VERIFY_PHONE: '/user/auth/verify-phone',
    RESEND_OTP: '/user/auth/resend-otp',
    FORGOT_PASSWORD: '/user/auth/forgot-password',
    RESET_OTP: '/user/auth/verify-reset-otp',
    NEW_PASSWORD: '/user/auth/set-new-password',
    CHANGE_PASSWORD: '/user/auth/change-password',
    ME: '/user/auth/me',

    // Fcm-Token
    FCM_TOKEN: '/user/save-fcm-token',

    // Home Content
    USER_CONTENT: '/user/content',

    // Quiz 
    QUIZ_ATTEMPT: '/user/content/quiz/submit',

    // Like
    LIKE: '/user/content/like',
    UNLIKE: '/user/content/unlike',

    // Bookmark
    BOOKMARK: '/user/content/bookmark',
    FETCH_BOOKMARK: '/user/content/bookmarks',
    REMOVE_BOOKMARK: '/user/content/remove-bookmark',

    // Comment
    FETCH_COMMENT: '/user/content/comments/',
    USER_COMMENT: '/user/content/comment',
    DELETE_COMMENT: '/user/content/comment',

    // Archieve
    USER_ARCHIEVE: '/user/content/archive/date/'
}
