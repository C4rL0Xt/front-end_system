export const environment = {
  production: false,
  authorize_uri: 'https://service-auth-server.azurewebsites.net/oauth2/authorize?',
  client_id: 'client',
  redirect_uri: 'http://localhost:4200/authorized',
  scope: 'openid',
  response_type: 'code',
  response_mode: 'form_post',
  code_challenge_method: 'S256',
  //code_challenge: 'HoHpE-5ooPGF-FMtKjra9QYc1Ar-0SqKcBFfx6-xsqM',
  //code_verifier: 'vgrpHZBHIIxabLFsNarHqHbqWRk2yT10jbQ9kRJFI5x',
  token_url: 'https://service-auth-server.azurewebsites.net/oauth2/token',
  grant_type: 'authorization_code',
  resource_url: 'http://localhost:8080/resource/',
  logout_url: 'https://service-auth-server.azurewebsites.net/logout',
  secret_pkce: 'secret',
  gateway_url: 'https://service-gateway-bbraun.azurewebsites.net',
  api_almacen: 'https://service-gateway-bbraun.azurewebsites.net/api/almacen',
  api_empleado: 'https://service-gateway-bbraun.azurewebsites.net/api/rrhh',
  api_documentos: 'https://service-gateway-bbraun.azurewebsites.net/api/doc-compra',
  api_coti: 'https://service-gateway-bbraun.azurewebsites.net/api/cotizacion',
  api_cliente: 'https://service-gateway-bbraun.azurewebsites.net/api/cliente',
  api_pedido: 'https://service-gateway-bbraun.azurewebsites.net/api/pedido',
  api_factura: 'https://service-gateway-bbraun.azurewebsites.net/api/facturaventa',
  api_proveedor: 'https://service-gateway-bbraun.azurewebsites.net/api/proveedor',

};
