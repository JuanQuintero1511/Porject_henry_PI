const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  console.log('Database connected');
  server.listen(3001, () => {
    console.log('%s listening at http://localhost:3001'); // eslint-disable-line no-console
  });
});
