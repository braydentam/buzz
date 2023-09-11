const DOMAIN = process.env.BACKEND_API;
//const DOMAIN = "http://localhost:4000";

//AUTHENTICATION
export const LOGIN = DOMAIN + "/user/login";
export const SIGNUP = DOMAIN + "/user/signup";

//BUZZES
export const GETEXPLORE = DOMAIN + "/buzz/getAll";
export const CREATEBUZZ = DOMAIN + "/buzz/create";
export const GETBYID = DOMAIN + "/buzz/getById";
export const GETBYUSERNAME = DOMAIN + "/buzz/getByUsername";
export const LIKE = DOMAIN + "/buzz/like";
export const GETFOLLOWINGBUZZES = DOMAIN + "/buzz/getFollowing";
export const GETCOMMENTS = DOMAIN + "/buzz/getComments";
export const DELETE = DOMAIN + "/buzz/delete";
export const HASPOSTED = DOMAIN + "/buzz/hasPosted";

//PROFILES
export const GETPROFILE = DOMAIN + "/profile/getProfile";
export const FOLLOW = DOMAIN + "/profile/follow";
export const GETFOLLOWERS = DOMAIN + "/profile/getFollowers";
export const GETFOLLOWING = DOMAIN + "/profile/getFollowing";
export const SEARCH = DOMAIN + "/profile/search";

