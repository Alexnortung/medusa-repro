import { z } from "zod";

export const variantSchema = z.object({
    productId: z.number().optional(),
    size: z.string(),
    color: z.string(),
});

export const brandSchema = z.object({
    id: z.number(),
    title: z.string(),
});

export const clientSchema = z.object({
    id: z.number(),
    clientName: z.string().nullable(),
    cif: z.string().nullable(),
    vatNumber: z.string().nullable(),
    phone1: z.string().nullable(),
    phone2: z.string().nullable(),
    mobile: z.string().nullable(),
    email: z.string().nullable(),
});

export type SyncBrand = z.infer<typeof brandSchema>;

export const stockSchema = z.object({
    productId: z.number(),
    size: z.string(),
    color: z.string(),
    warehouseId: z.string(),
    stock: z.number(),
    incoming: z.number(),
    product: z.object({
        internalReference: z.string().nullable(),
    }).nullable(),
})

export const productSchema = z.object({
    id: z.number(),
    description: z.string().nullable(),
    internalReference: z.string().nullable(),
    departmentId: z.number().nullable(),
    sectionId: z.number().nullable(),
    familyId: z.number().nullable(),
    variants: z.array(variantSchema),
    brandId: z.number().nullable(),
});

export const nestedCategorySchema = z.object({
    id: z.number(),
    title: z.string().nullable(),
    visibleWeb: z.boolean(),
    sections: z.array(z.object({
        id: z.number(),
        title: z.string().nullable(),
        visibleWeb: z.boolean(),
        families: z.array(z.object({
            id: z.number(),
            title: z.string().nullable(),
            visibleWeb: z.boolean(),
        })),
    })),
});

export const warehouseSchema = z.object({
    id: z.string(),
    title: z.string(),
});

export const priceSchema = z.object({
    productId: z.number(),
    size: z.string(),
    color: z.string(),
    salePrice: z.number().nullable(),
    product: productSchema.pick({
        internalReference: true,
    }),
});

export const orderSchema = z.object({
    seriesNumber: z.string(),
    orderNumber: z.number(),
    orderName: z.string(),
    clientId: z.number(),
    orderDate: z.string().datetime().nullable(),
    totalPrice: z.number(),
    commercialDiscount: z.number(),
    totalTaxes: z.number(),
    totalPriceWithoutTaxes: z.number(),
    sellerId: z.number(),
    priceRateCode: z.number(),
    updatedAt: z.string().datetime(),
    createdAt: z.string().datetime(),
    orderLines: z.array(z.object({
        // seriesNumber: z.string(),
        // orderNumber: z.number(),
        lineNumber: z.number(),
        productId: z.number(),
        product: productSchema.pick({
            internalReference: true,
        }).nullish(),
        size: z.string(),
        color: z.string(),
        quantity: z.number(),
        price: z.number(),
        cost: z.number(),
        taxType: z.number(),
        warehouseId: z.string(),
        priceRateCode: z.number(),
        sellerId: z.number(),
    })),
});
