import { TMethod } from "./TMethod";

export interface TEvent<Model> {
	type: TMethod;
	serviceName: string;
	data: Model;
	context: any;
}
