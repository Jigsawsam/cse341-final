const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Personal Media Library API',
    description: 'An API to manage a personal collection of books, movies, or games'
  },
  host: 'localhost:3000',
  schemes: [ 'http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger doc generated');
});
