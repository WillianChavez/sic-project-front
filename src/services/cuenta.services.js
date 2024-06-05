import {http_client} from "@/plugins/http_client";

const url = '/api/v1/cuentas'

const getCuentas = async (params = {}) => await http_client(url, params, 'get')
const getCuenta = async (idCuenta) => await http_client(`${url}/${idCuenta}`, {}, 'get')
const storeCuenta = async (body) => await http_client(url, body, 'post')
const updateCuenta = async (idCuenta, body) => await http_client(`${url}/${idCuenta}`, body, 'put')
const deleteCuenta = async (idCuenta) => await http_client(`${url}/${idCuenta}`, {}, 'delete')

export default {
  getCuentas,
  storeCuenta,
  updateCuenta,
  deleteCuenta,
  getCuenta
}