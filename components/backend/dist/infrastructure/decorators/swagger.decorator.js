"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swagger = Swagger;
const swagger_1 = require("@nestjs/swagger");
function Swagger(description) {
    return (target, propertyKey, descriptor) => {
        const operationId = propertyKey;
        const summary = propertyKey;
        (0, swagger_1.ApiOperation)({
            summary,
            description,
            operationId,
        })(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=swagger.decorator.js.map