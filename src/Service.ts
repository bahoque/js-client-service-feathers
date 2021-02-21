import { Application as FApplication, Service as FService } from "@feathersjs/feathers";
import { from, Observable } from "rxjs";
import { Service as CService } from "@bahoque/client-service-core";

export class Service<T1 = any> extends CService<T1> {
	protected readonly _service: FService<T1>;
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

	raw<T>(method: keyof FService<T>, ...rest: any): Observable<T> {
		const request: Promise<T> = this._service[method](...rest);
		return from(request);
	}
}
