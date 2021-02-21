import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { TListen } from "./types/TListen";
import { TEvent } from "./types/TEvent";
import { TMethod } from "./types/TMethod";
import { Service } from "./Service";

const allMethods = [TMethod.CREATED, TMethod.UPDATED, TMethod.UPDATED];

export class ServiceSocket<Model = any> extends Service<Model> {
	private static readonly _e = new Subject<TEvent<any>>();

	constructor(serviceName: string, listen: TListen) {
		super(serviceName);
		this.setListing(listen);
	}

	/*
	 * static methods
	 */
	static getEvent<Model = any>(serviceName: string, type: TMethod): Observable<TEvent<Model>> {
		return ServiceSocket._e.pipe(filter((it) => it.serviceName === serviceName && it.type === type));
	}

	static getEventByService<Model = any>(serviceName: string): Observable<TEvent<Model>> {
		return ServiceSocket._e.pipe(filter((it) => it.serviceName === serviceName));
	}

	static getEventByType<Model = any>(type: TMethod): Observable<TEvent<Model>> {
		return ServiceSocket._e.pipe(filter((it) => it.type === type));
	}

	/*
	 * class methods
	 */

	private setListing(listen: TListen) {
		const serviceName = this._serviceName;
		const listeningHandler = (type: TMethod) => (data: Model, context: any) =>
			ServiceSocket._e.next({ type, serviceName, data, context });

		if (listen.created) this._service.on("created", listeningHandler(TMethod.CREATED));
		if (listen.updated) this._service.on("updated", listeningHandler(TMethod.UPDATED));
		if (listen.patched) this._service.on("patched", listeningHandler(TMethod.UPDATED));
		if (listen.removed) this._service.on("removed", listeningHandler(TMethod.DELETED));
	}

	getEvent(type: TMethod[] = allMethods): Observable<Partial<TEvent<Model>>> {
		return ServiceSocket._e.pipe(
			filter((it) => type.includes(it.type) && it.serviceName === this.serviceName),
			map((it) => ({ type: it.type, data: it.data }))
		);
	}
}
