import mysql from 'mysql2'


const localhost = {
  host: 'localhost',
  user: 'root',
  userPass: '',
  db: 'healthspacedb'
}
const railwayhost = {
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  userPass: 'PUlPRgGyPObOcrkVeSFvTWFfRpVxgwDt',
  db: 'railway'
}

const sethost = railwayhost

// Conexão com o banco
export const connection = mysql.createConnection({
  host: sethost.host,
  user: sethost.user,
  password: sethost.userPass,
  database: sethost.db,
  port: 33425
});

connection.connect((err) => {
  if (err) {
    console.error('  >  Erro ao conectar ao banco de dados  <  ');
    console.log('-------')
    console.log(err.message)
  } else {
    console.log('  >  Conexão com o banco de dados bem-sucedida!  <  ');
  }
});


