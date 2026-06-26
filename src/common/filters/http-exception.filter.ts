import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Error';
    let errorDetails = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = (exceptionResponse as any).message || 'Error';
      errorDetails = (exceptionResponse as any).error || exceptionResponse;
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        details: errorDetails,
      }
    });
  }
}
