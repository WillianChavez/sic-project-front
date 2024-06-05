import {http_client} from "../plugins/http_client";

const getTypeRoles = async (queryParams = {}) => await http_client('/api/v1/tipo/roles', queryParams, 'get')

export default {
    getTypeRoles
}