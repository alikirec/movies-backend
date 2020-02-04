import { Request, Response } from 'express';

import checkOwnEntity from '../checkOwnEntity';

describe('Check own entity middleware', () => {
  let requestMock;
  let responseMock;
  beforeEach(() => {
    requestMock = ({ params: { } } as unknown) as Request;
    responseMock = ({
      locals: {
        jwtPayload: {}
      },
      status: jest.fn(() => ({ send: jest.fn()})),
    } as unknown) as Response;
  });

  it('should respond with status 401 if userId and jwt user id not equal', async () => {
    requestMock.params.userId = 123;
    responseMock.locals.jwtPayload.userId = 234;

    const nextMock = jest.fn();

    await checkOwnEntity(requestMock, responseMock, nextMock);
    expect(responseMock.status).toBeCalledWith(401);
  });

  it('should run next if userIds match', async () => {
    requestMock.params.userId = 123;
    responseMock.locals.jwtPayload.userId = 123;

    const nextMock = jest.fn();

    await checkOwnEntity(requestMock, responseMock, nextMock);
    expect(nextMock).toBeCalled();
  });
});
