export const environment = {
  production: true,
  authorize_uri: 'http://service-auth-server.azurewebsites.net/oauth2/authorize?',
  client_id: 'client',
  redirect_uri: 'http://service-auth-server.azurewebsites.net/authorized',
  scope: 'openid',
  response_type: 'code',
  response_mode: 'form_post',
  code_challenge_method: 'S256',
  //code_challenge: 'HoHpE-5ooPGF-FMtKjra9QYc1Ar-0SqKcBFfx6-xsqM',
  //code_verifier: 'vgrpHZBHIIxabLFsNarHqHbqWRk2yT10jbQ9kRJFI5x',
  token_url: 'http://service-auth-server.azurewebsites.net/oauth2/token',
  grant_type: 'authorization_code',
  resource_url: 'http://localhost:8080/resource/',
  logout_url: 'http://service-auth-server.azurewebsites.net/logout',
  secret_pkce: 'secret',
  gateway_url: 'http://localhost:9000',
  api_almacen: 'http://localhost:9000/api/almacen',
  api_empleado: 'http://localhost:9000/api/rrhh',
  api_documentos: 'http://localhost:9000/api/doc-compra',
  api_coti: 'http://localhost:9000/api/cotizacion',
  api_cliente: 'http://localhost:9000/api/cliente',

  api_pedido: 'http://localhost:9000/api/pedido',
  api_factura: 'http://localhost:9000/api/facturaventa',

  api_proveedor: 'http://localhost:9000/api/proveedor',

};
