import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }
    private api= "http://127.0.0.1:3000/productos/"
    
    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProducts() {
        return this.http.get<any>(this.api)
            .toPromise()
            .then(res => {
                console.log('Respuesta de la API:', res); // Aquí se imprime la respuesta
                return res.data as Product[];
            })
            .then(data => data);
    }

    saveProduct(product: Product): Observable<any> {
      return this.http.post<any>(this.api, product)
    }
    
    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
