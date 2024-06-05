import { http_client } from "@/plugins/http_client";

const url = '/api/v1/catalogo'

const getTipoCuentas = async (params = {}) => await http_client(`${url}/tipo-cuentas`, params, 'get');
const getTipoContribuyentes = async (params = {}) => await http_client(`${url}/tipo-contribuyentes`, params, 'get');
const getTipoEmisionDocumentos = async (params = {}) => await http_client(`${url}/tipo-emision-documentos`, params, 'get');
const getPersona = async (nit) => await http_client(`${url}/persona/${nit}`, {}, 'get');

export default {
  getTipoContribuyentes,
  getTipoCuentas,
  getTipoEmisionDocumentos,
  getPersona,
}