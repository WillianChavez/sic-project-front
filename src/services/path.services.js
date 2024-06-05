import {http_client} from "@/plugins/http_client";

const url = '/api/v1/rutas'
const getPaths = async (params = {}) => await http_client(url, params, 'get')
const storePath = async (body) => await http_client(url, body, 'post')
const getPath = async (idPath) => await http_client(`${url}/${idPath}`)
const updatePath = async (idPath, body) => await http_client(`${url}/${idPath}`, body, 'put')
const getAuthorizedPaths=async()=>await http_client(`${url}/get-rutas`)

export default {
    getPaths,
    storePath,
    getPath,
    updatePath,
    getAuthorizedPaths
}