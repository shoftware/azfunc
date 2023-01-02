import { send } from 'azfunc';

/**
 * Entrypoint.
 * @param {import('@azure/functions').Context} context 
 * @param {import('@azure/functions').HttpRequest} request 
 */
export default async function (context, request) {

  // Send the result to the client.
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  return send(context, { status: 200, body: { data: 'OK' }, headers: headers });
}