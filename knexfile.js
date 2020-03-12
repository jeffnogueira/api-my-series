// Update with your config settings.

module.exports = {
    client: 'mysql',
    connection: {
      database: 'myseries',
      user:     'root',
      password: '',
      timezone: 'UTC-3',
    },
    pool: {
      min: 2,
      max: 10
    }  
  };
  