const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Twilio OTP API",
      version: "1.0.0",
      description: "API for sending and verifying OTP using Twilio Verify service. This API provides endpoints to send OTP codes via SMS and verify them."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server"
      },
      {
        url: "https://verification-services-2pe9n9sqy-vasus-projects-b361a7b7.vercel.app",
        description: "Production server"
      }
    ],
    components: {
      schemas: {
        SendOTPRequest: {
          type: "object",
          required: ["phone"],
          properties: {
            phone: {
              type: "string",
              description: "Phone number in E.164 format",
              example: "+919876543210"
            }
          }
        },
        VerifyOTPRequest: {
          type: "object",
          required: ["phone", "code"],
          properties: {
            phone: {
              type: "string",
              description: "Phone number in E.164 format",
              example: "+919876543210"
            },
            code: {
              type: "string",
              description: "6-digit OTP code",
              example: "123456"
            }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            status: {
              type: "string",
              example: "pending"
            }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Phone number required"
            }
          }
        }
      }
    }
  },
  apis: ["./api/*.js"], // scan endpoint files for JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };