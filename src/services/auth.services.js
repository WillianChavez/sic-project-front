import {http_client} from "@/plugins/http_client";

const login = async (body) => await http_client('/api/v1/login', body, 'post');
const changeEmail = async (body) => await http_client(`/api/v1/users/update/email`, body, 'put');
const changePassword = async (body) => await http_client(`/api/v1/users/update/password`, body, 'put');
const verifyAccount = async (token) => await http_client(`/api/v1/verification/account/${token}`);
const twoFactor = async (body) => await http_client('/api/v1/2fa/code', body, 'post');
const verifyCode = async (body) => await http_client('/api/v1/2fa/verify', body, 'post');
const get2FAMethods = async () => await http_client('/api/v1/users/2fa/method');
const store2FAMethods = async (body) => await http_client('/api/v1/users/2fa/method', body, 'post');
const authMethodVerification = async (body) => await http_client('/api/v1/users/2fa/method/verify', body, 'post');
const changePrimaryMethod = async (idMethod) => await http_client(`/api/v1/users/2fa/method/${idMethod}`, {}, 'put');
const logout = async () => await http_client('/api/v1/logout', {}, 'post')
const resetPassword = async (body) => await http_client('/api/v1/password/reset', body, 'post')
const newPassword=async (body, token)=>await http_client('/api/v1/password/change', body, 'put', {
    Authorization: `Bearer ${token}`,
})

export default {
    login,
    changeEmail,
    changePassword,
    verifyAccount,
    verifyCode,
    twoFactor,
    get2FAMethods,
    store2FAMethods,
    authMethodVerification,
    changePrimaryMethod,
    logout,
    resetPassword,
    newPassword
}