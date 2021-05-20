import basicAuth from 'basic-auth';

function unauthorized(res: any) {  
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.send(401);
};

export default function auth(req: any, res: any, next: any) {
  const {name, pass} = basicAuth(req) || {};

  if (!name || !pass) {
    return unauthorized(res);
  };

  if (name === 'john' && pass === 'secret') {
    return next();
  }
  return unauthorized(res);
};