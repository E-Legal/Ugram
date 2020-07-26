export interface IError {
	code: number;
	message: string;
}

export interface IResult {
	code: number;
	data: string|object;
}

export interface INauth {
	name?: string;
	id?: string;
	username?: string;
	last_name?: string;
	email?: string;
	phone_number?: string;
	password?: string;
	q?: string;
	key?: string;
	text?: string;
	comment_id?: string;
	tags?: string[];
}

export interface IAuth extends INauth {
	user: string;
}