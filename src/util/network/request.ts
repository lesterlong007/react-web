import HttpRequest from './http';

const httpInstance = new HttpRequest();

export const { request, get, post, put } = httpInstance;
