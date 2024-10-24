import { model } from "@medusajs/framework/utils"

export const Brand = model.define("brand", {
    id: model.id({
        prefix: "brand_",
    }).primaryKey(),
    name: model.text().unique(),
    icg_ids: model.array().default([]),
});
