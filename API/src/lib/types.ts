import { IError, IResult } from '@/lib/interfaces';
import { Response } from 'express';

export type cbType = (err: IError, res?: IResult) => void | Response;

export type controllerFunctionType = (any, cbType) => Promise<void | Response>;