"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const rxjs_1 = require("rxjs");
const core_1 = require("../core");
class Service extends core_1.Service {
    constructor(serviceName) {
        super();
        this._serviceName = serviceName.trim();
        this._service = Service._client.service(this._serviceName);
        this._service.timeout = 5000;
    }
    static get client() {
        return this._client;
    }
    static set client(value) {
        this._client = value;
    }
    get serviceName() {
        return this._serviceName;
    }
    get timeout() {
        return this._service.timeout;
    }
    set timeout(value) {
        this._service.timeout = value;
    }
    raw(method, ...rest) {
        const request = this._service[method](...rest);
        return rxjs_1.from(request);
    }
}
exports.Service = Service;
//# sourceMappingURL=Service.js.map