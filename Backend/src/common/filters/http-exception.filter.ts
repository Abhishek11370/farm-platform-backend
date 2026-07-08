import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errorDetails = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        message = (exceptionResponse as any).message || "Error";
        errorDetails = (exceptionResponse as any).error || exceptionResponse;
      }
    } else {
      // Log unhandled non-HttpExceptions (like DB errors)
      this.logger.error(
        `Unhandled Exception: ${exception.message || exception}`,
        exception.stack,
      );
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
      },
    });
  }
}
