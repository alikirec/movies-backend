import { Request, Response } from 'express';
import * as JWT from 'jsonwebtoken';

import { checkJwt } from '../checkJwt'

describe('Check JWT middleware', () => {
  let requestMock;
  let responseMock;
  beforeEach(() => {
    requestMock = { headers: { authorization: 'Bearer' } } as Request;
    responseMock = ({
      status: jest.fn(() => ({ send: jest.fn()})),
      locals: {},
      setHeader: jest.fn(),
    } as unknown) as Response;
  });

  it('should return 401 if JWT verification fails', () => {
    jest.spyOn(JWT, 'verify').mockImplementationOnce(() => {
      throw Error('a');
    });

    checkJwt(requestMock, responseMock, ():number => 1);
    expect(responseMock.status).toBeCalledWith(401);
  });

  it('should set response header if JWT verification succeeds', () => {
    const JWT_SECRET = process.env.JWT_SECRET;
    jest.spyOn(JWT, 'verify').mockImplementationOnce(() => ({
      userId: 123,
      username: 'asd'
    }));
    const signMock = jest.spyOn(JWT, 'sign').mockImplementationOnce(() => 'token');

    checkJwt(requestMock, responseMock, ():number => 1);
    expect(responseMock.setHeader).toBeCalledWith('token', 'token');
    expect(signMock).toBeCalledWith({ userId: 123, username: 'asd' }, JWT_SECRET, { expiresIn: '1h' });
  });
});
