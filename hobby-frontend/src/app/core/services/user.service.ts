import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface UserDto {
  id: string | number;
  fullName?: string;
  name?: string;
  email: string;
  picture?: string;
  avatar?: string;
  role?: string;
  roles?: string[];
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  getUsersPaged(params: { page: number; size: number; search?: string }): Observable<PagedResponse<UserDto>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page))
      .set('size', String(params.size));
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<PagedResponse<UserDto>>(this.baseUrl, { params: httpParams });
  }
}


