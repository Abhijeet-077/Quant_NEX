import initDb from './initDb';

// Run the database initialization
initDb()
  .then(() => {
    console.log('Database initialization script completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running database initialization script:', error);
    process.exit(1);
  });
