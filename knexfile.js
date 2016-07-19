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
    connection: 'postgres://rrgahrwnfbhnuk:huTiRJxIFRjW7kwpHCY043Pow_@ec2-107-20-136-222.compute-1.amazonaws.com:5432/dqle8lk8vg5d4',
    migrations: {
      directory: __dirname + '/migrations'
    }
  }
};
