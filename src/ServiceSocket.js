"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceSocket = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const TMethod_1 = require("./types/TMethod");
const Service_1 = require("./Service");
const allMethods = [TMethod_1.TMethod.CREATED, TMethod_1.TMethod.UPDATED, TMethod_1.TMethod.UPDATED];
class ServiceSocket extends Service_1.Service {
    constructor(serviceName, listen) {
        super(serviceName);
        this.setListing(listen);
    }
    static getEvent(serviceName, type) {
        return ServiceSocket._e.pipe(operators_1.filter((it) => it.serviceName === serviceName && it.type === type));
    }
    static getEventByService(serviceName) {
        return ServiceSocket._e.pipe(operators_1.filter((it) => it.serviceName === serviceName));
    }
    static getEventByType(type) {
        return ServiceSocket._e.pipe(operators_1.filter((it) => it.type === type));
    }
    setListing(listen) {
        const serviceName = this._serviceName;
        const listeningHandler = (type) => (data, context) => ServiceSocket._e.next({ type, serviceName, data, context });
        if (listen.created)
            this._service.on("created", listeningHandler(TMethod_1.TMethod.CREATED));
        if (listen.updated)
            this._service.on("updated", listeningHandler(TMethod_1.TMethod.UPDATED));
        if (listen.patched)
            this._service.on("patched", listeningHandler(TMethod_1.TMethod.UPDATED));
        if (listen.removed)
            this._service.on("removed", listeningHandler(TMethod_1.TMethod.DELETED));
    }
    getEvent(type = allMethods) {
        return ServiceSocket._e.pipe(operators_1.filter((it) => type.includes(it.type) && it.serviceName === this.serviceName), operators_1.map((it) => ({ type: it.type, data: it.data })));
    }
}
exports.ServiceSocket = ServiceSocket;
ServiceSocket._e = new rxjs_1.Subject();
//# sourceMappingURL=ServiceSocket.js.map