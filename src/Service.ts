import { Application as FApplication, Service as FService } from "@feathersjs/feathers";
import { Service as ServiceCore, TService } from "@bahoque/client-service-core";
import { from, Observable } from "rxjs";

export class Service<T = any> extends ServiceCore<T> {
	protected readonly _service: FService<T>;
	protected readonly _serviceName: string;

	protected static _client: FApplication | undefined;

	constructor(serviceName: string) {
		super();
		this._serviceName = serviceName.trim();
		this._service = Service._client!.service(this._serviceName);
		this._service.timeout = 5000;
	}

	/*
	 * Getter and Setter
	 */

	static get client(): FApplication | undefined {
		return this._client;
	}

	static set client(value: FApplication | undefined) {
		this._client = value;
	}

	get serviceName(): string {
		return this._serviceName;
	}

	get timeout(): number {
		return this._service.timeout;
	}

	set timeout(value: number) {
		this._service.timeout = value;
	}

	/*
	 * class methods
	 */

	raw<T>(method: keyof FService<any>, ...rest: any): Observable<T> {
		const request: Promise<T> = this._service[method](...rest);
		return from(request);
	}
}
