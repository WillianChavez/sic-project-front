import {http_client} from "../plugins/http_client";

const getRoles = async (queryParams = {}) => await http_client('/api/v1/roles', queryParams, 'get')
const createRole = async (body) => await http_client('/api/v1/roles', body, 'post')
const updateRole = async (idRole, body) => await http_client(`/api/v1/roles/${idRole}`, body, 'put')
const deleteRole = async (idRole) => await http_client(`/api/v1/roles/${idRole}`, {}, 'delete')

export default {
    getRoles,
    createRole,
    updateRole,
    deleteRole
}