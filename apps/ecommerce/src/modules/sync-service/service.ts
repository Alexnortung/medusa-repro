import { z } from "zod";
import { syncServiceConfigSchema } from "./config";
import { brandSchema, clientSchema, nestedCategorySchema, orderSchema, priceSchema, productSchema, stockSchema, warehouseSchema } from "./schemas";

type DatabaseName = 'icg' | 'icg-zec';

export default class SyncServiceModule {
    private readonly token: string;
    private readonly baseUrl: string;

    constructor(container: {}, options?: unknown) {
        const parsedOptions = syncServiceConfigSchema.parse(options);
        const { token, baseUrl } = parsedOptions;
        this.token = token ?? '';
        this.baseUrl = baseUrl;
    }

    public async getProducts(page: number = 1) {
        // TODO: use trpc instead, once pnpm works
        const response = await fetch(`${this.baseUrl}/products?pagination[page]=${page}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to fetch products');
        }
        const json = await response.json();
        const parsed = z.array(productSchema).parse(json);
        return parsed;
    }

    public async getStocks(db: DatabaseName, page: number = 1) {
        // TODO: use trpc instead, once pnpm works
        const response = await fetch(`${this.baseUrl}/stocks?pagination[page]=${page}&db=${db}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stocks');
        }
        const json = await response.json();
        const parsed = z.array(stockSchema).parse(json);
        return parsed;
    }

    public async getCategories() {
        // TODO: use trpc instead, once pnpm works
        const response = await fetch(`${this.baseUrl}/categories`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const json = await response.json();
        const parsed = z.array(nestedCategorySchema).parse(json);
        return parsed;
    }

    public async getWarehouses() {
        // TODO: use trpc instead, once pnpm works
        const response = await fetch(`${this.baseUrl}/warehouses`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch warehouses');
        }

        const json = await response.json();
        const parsed = z.array(warehouseSchema).parse(json);
        return parsed;
    }

    public async getPrices(page: number = 1) {
        // TODO: use trpc instead, once pnpm works
        const response = await fetch(`${this.baseUrl}/prices?pagination[page]=${page}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }

        const json = await response.json();
        const parsed = z.array(priceSchema).parse(json);
        return parsed;
    }

    public async getBrands() {
        // TODO: use trpc instead, once pnpm works
        const response = await fetch(`${this.baseUrl}/brands`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch brands');
        }

        const json = await response.json();
        const parsed = z.array(brandSchema).parse(json);
        return parsed;
    }

    public async getCustomers(db: DatabaseName, page: number = 1) {
        const response = await fetch(`${this.baseUrl}/clients?pagination[page]=${page}&db=${db}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }

        const json = await response.json();
        const parsed = z.array(clientSchema).parse(json);
        return parsed;
    }

    public async getOrders(db: DatabaseName, page: number = 1) {
        const response = await fetch(`${this.baseUrl}/orders?pagination[page]=${page}&db=${db}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const json = await response.json();
        const parsed = z.array(orderSchema).parse(json);
        return parsed;
    }
}
