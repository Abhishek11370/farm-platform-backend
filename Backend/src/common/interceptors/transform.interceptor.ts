import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already in formatting shape, reuse it
        if (
          data &&
          typeof data === "object" &&
          ("data" in data || "success" in data)
        ) {
          return {
            success: data.success ?? true,
            message: data.message ?? "Success",
            data: data.data !== undefined ? data.data : data,
            meta: data.pagination ?? data.meta ?? undefined,
          };
        }

        return {
          success: true,
          message: "Success",
          data: data,
        };
      }),
    );
  }
}
