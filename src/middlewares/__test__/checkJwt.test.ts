import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';

import { checkJwt } from '../checkJwt'

describe('Check JWT middleware', () => {
  let requestMock;
  let responseMock;
  beforeEach(() => {
    requestMock = { cookies: { access_token: '123' } } as Request;
    responseMock = ({
      status: jest.fn(() => ({ send: jest.fn()})),
      locals: {}
    } as unknown) as Response;
  });

  it('should return 401 if JWT verification fails', () => {
    jest.spyOn(JWT, 'verify').mockImplementationOnce(() => {
      throw Error('a');
    });

    checkJwt(requestMock, responseMock, ():number => 1);
    expect(responseMock.status).toBeCalledWith(401);
  });

  it('should call next if JWT verification succeeds', () => {
    jest.spyOn(JWT, 'verify').mockImplementationOnce(() => ({
      userId: 123,
      username: 'asd'
    }));

    const nextMock = jest.fn() as jest.Mock<ReturnType<NextFunction>>;

    checkJwt(requestMock, responseMock, nextMock);

    expect(nextMock).toBeCalled();
  });
});
