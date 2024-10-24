import { Module } from "@medusajs/framework/utils";
import service from './service';

export const BRAND_MODULE = 'brandModuleService';

export default Module(BRAND_MODULE, {
    service,
})
