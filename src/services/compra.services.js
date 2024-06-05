
import {http_client} from "@/plugins/http_client";

const url = '/api/v1/compras'

const getCompras = async (params = {}) => await http_client(url, params, 'get')
const getCompra = async (idCompra) => await http_client(`${url}/${idCompra}`, {}, 'get')
const storeCompra = async (body) => await http_client(url, body, 'post')
const updateCompra = async (idCompra, body) => await http_client(`${url}/${idCompra}`, body, 'put')
const deleteCompra = async (idCompra) => await http_client(`${url}/${idCompra}`, {}, 'delete')

export default {
  getCompras,
  storeCompra,
  updateCompra,
  deleteCompra,
  getCompra
}