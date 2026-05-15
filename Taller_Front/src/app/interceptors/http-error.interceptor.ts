import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('weatherapi.com')) {
        toastr.error('Error al conectar con WeatherAPI. Intente más tarde.');
      } else {
        toastr.error(`Error ${error.status}: ${error.message}`);
      }
      return throwError(() => error);
    })
  );
};