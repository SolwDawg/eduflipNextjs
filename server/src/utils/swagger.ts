import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduFlip API Documentation",
      version: "1.0.0",
      description: "API documentation for the EduFlip learning platform",
      contact: {
        name: "EduFlip Support",
        email: "support@eduflip.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
