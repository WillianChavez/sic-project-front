
import {http_client} from "@/plugins/http_client";

const url = '/api/v1/servicios'

const getServicios = async (params = {}) => await http_client(url, params, 'get')
const getServicio = async (idServicio) => await http_client(`${url}/${idServicio}`, {}, 'get')
const storeServicio = async (body) => await http_client(url, body, 'post')
const updateServicio = async (idServicio, body) => await http_client(`${url}/${idServicio}`, body, 'put')
const deleteServicio = async (idServicio) => await http_client(`${url}/${idServicio}`, {}, 'delete')

export default {
  getServicios,
  storeServicio,
  updateServicio,
  deleteServicio,
  getServicio
}