module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/heirloom_data',
    migrations: {
      directory: __dirname + '/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/migrations'
    }
  }
};
