import {http_client} from "@/plugins/http_client";

const getUsers = async (params = {}) => await http_client('/api/v1/users', params)
const createUser = async (body) => await http_client('/api/v1/users', body, 'post')
const showUser = async (idUser) => await http_client(`/api/v1/users/${idUser}`)
const updateUser = async (idUser, body) => await http_client(`/api/v1/users/${idUser}`, body, 'put')
const deleteUser = async (idUser) => await http_client(`/api/v1/users/${idUser}`, {}, 'delete')
const deleteUserProfile = async (idUser, idProfile) => await http_client(`/api/v1/users/${idUser}/perfiles/${idProfile}`, {}, 'delete')
const createUserProfile = async (idUser, idProfile) => await http_client(`/api/v1/users/${idUser}/perfiles`, {
    id_perfil: idProfile
}, 'post')
const deleteUserRole = async (idUser, idRole) => await http_client(`/api/v1/users/${idUser}/roles/${idRole}`, {}, 'delete')
const createUserRole = async (idUser, idRole) => await http_client(`/api/v1/users/${idUser}/roles`, {
    id_rol: idRole
}, 'post')
export default {
    getUsers,
    createUser,
    showUser,
    updateUser,
    deleteUser,
    deleteUserProfile,
    createUserProfile,
    deleteUserRole,
    createUserRole
}