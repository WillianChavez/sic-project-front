import {http_client} from "../plugins/http_client";

const url = '/api/v1/perfiles';

const getProfiles = async (filtros) => await http_client(url, filtros)
const createProfile = async (body) => await http_client(url, body, 'post')
const showPorfile = async (idProfile) => await http_client(`${url}/${idProfile}`)
const updateProfile = async (idProfile, body) => await http_client(`${url}/${idProfile}`, body, 'put')
export default {
    getProfiles,
    createProfile,
    showPorfile,
    updateProfile,
}