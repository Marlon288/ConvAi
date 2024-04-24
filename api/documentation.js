// documentation.js file
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const path = require('path');

//Getting Started Code of the module
const options = {
  info: {
    version: '1.0.0',
    title: 'RailVision',
    license: {
      name: 'MIT',
    },
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
   // Base directory which we use to locate your JSDOC files
   baseDir: path.join(__dirname),
   // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
   filesPattern: './routes/**/*.js',
   // URL where SwaggerUI will be rendered
   swaggerUIPath: '/api-docs',
   // Expose OpenAPI UI
   exposeSwaggerUI: true,
   // Expose Open API JSON Docs documentation in `apiDocsPath` path.
   exposeApiDocs: false,
   // Open API JSON Docs endpoint.
   apiDocsPath: '/v3/api-docs',
   // Set non-required fields as nullable by default
   notRequiredAsNullable: false,
   // You can customize your UI options.
   // you can extend swagger-ui-express config. You can checkout an example of this
   // in the `example/configuration/swaggerOptions.js`
   swaggerUiOptions: {},
   // multiple option in case you want more that one instance
   multiple: true,
};

const app = express();
const PORT = 443;

expressJSDocSwagger(app)(options);

/**
 * GET /api/v1
 * @summary This is the summary of the endpoint
 * @return {object} 200 - success response
 */
app.get('/api/v1', (req, res) => res.json({
  success: true,
}));

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));