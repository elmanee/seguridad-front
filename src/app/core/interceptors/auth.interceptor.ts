import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 1. EXCEPCIÓN CRÍTICA: Si la petición es para refrescar el token,
  // la dejamos pasar sin modificar para evitar el bucle infinito del 401.
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = authService.getAccessToken();
  let authReq = req;

  // 2. Inyectamos el Access Token actual en los headers
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Procesamos la petición y manejamos errores
  return next(authReq).pipe(
    catchError((error) => {
      // Si recibimos un 401, el access_token expiró (los 40s que pusiste)
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.warn('⚠️ [Interceptor] Access Token expirado. Bloqueando petición original...');

        // 4. Intentamos el Refresh en silencio
        return authService.refreshToken().pipe(
          switchMap((res: any) => {
            console.log('🚀 [Interceptor] ¡Refresh exitoso! Reintentando petición con nuevo token.');
            // El backend nos devuelve { access_token, refresh_token }
            // IMPORTANTE: Asegúrate de que tu authService.refreshToken()
            // guarde estos nuevos tokens en el localStorage antes de retornar.

            // 5. Clonamos la petición original con el NUEVO Access Token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access_token}`
              }
            });

            // 6. Volvemos a lanzar la petición original
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            console.error('❌ [Interceptor] El Refresh también falló. Sesión terminada.');
            // 7. Si el Refresh Token también falló (expiró o es inválido),
            // cerramos sesión y mandamos al usuario al Login.
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      // Si es cualquier otro error (500, 404, etc.), lo dejamos pasar
      return throwError(() => error);
    })
  );
};
