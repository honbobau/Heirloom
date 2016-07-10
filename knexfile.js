module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/heirloom_data',
    migrations: {
      directory: __dirname + '/migrations'
    }
  }
};
