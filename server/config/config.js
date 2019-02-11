
/**
 * 
 * Puerto
 */

process.env.PORT = process.env.PORT || 3000;


/**
 * ENTORNO
 */

 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
 
 
/**
 * VENCIMIENTO DEL TOKEN (60 * 60 * 24 * 30 )
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


/**
 * SEED de autenticación
 */

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


 /**
  * BASE DE DATOS
  * 
  */

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
    urlDB = process.env.MONGO_URI; 
}

process.env.URLDB = urlDB;


/**
 * GOOGLE CLIENT ID
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '797212217737-kubl0km9p5fe9t2m5s6nfq8o3u4hbk72.apps.googleusercontent.com';

