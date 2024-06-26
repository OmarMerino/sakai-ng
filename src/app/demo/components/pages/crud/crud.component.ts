import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { tap } from 'rxjs/operators';
@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService],
})
export class CrudComponent implements OnInit {
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.productService.getProducts().then((data) => {
            this.products = data;
        });

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' },
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        console.log('borrando +1');
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
    }

    confirmDelete() {
        console.log('borrando 1');
        this.productService.deleteProduct(this.product.id).pipe(
            tap(() => {
                console.log('Producto eliminado correctamente');
                this.deleteProductDialog = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000,
                });
            })
        ).subscribe(
            () => {
                this.products = this.products.filter(
                    (val) => val.id !== this.product.id
                );
                this.product = {};
            },
            (error) => {
                console.error('Error al eliminar el producto:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ha ocurrido un error',
                    life: 3000,
                });
            }
        );
    }


    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                //hacer servicio para editar
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                // this.product.id = this.createId();// no es necesario porque es autoincremental..
                // this.product.code = this.createId();

                this.productService.saveProduct(this.product).subscribe(
                    (response: any) => {
                        console.log(
                            'Producto añadido correctamente:',
                            response.body.Producto
                        );

                        // Actualizar los datos del producto con la respuesta del servidor
                        this.product = response.body.Producto;

                        // Añadir el producto a la lista de productos
                        this.products.push(this.product);

                        // Mostrar un mensaje de éxito
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Producto creado',
                            life: 3000,
                        });
                    },
                    (error: any) => {
                        console.error('Error al agregar el producto:', error);

                        // Mostrar un mensaje de error
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Ha ocurrido un error al agregar el producto',
                            life: 3000,
                        });
                    }
                );
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
