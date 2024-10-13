const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Car Rental",
        description: "Car Rental API",
    },
    host: "localhost:3000/api/v1",
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT", // Removed the comma
            },
        },
    },
};

const outputFile = "../../swagger-autogen.json"; // Fixed typo in the filename
const routes = ["../../index.js"];

swaggerAutogen(outputFile, routes, doc);
