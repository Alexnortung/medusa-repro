import { Module } from "@medusajs/framework/utils";
import service from './service';

export const SYNC_SERVICE = 'syncServiceModuleService';

export default Module(SYNC_SERVICE, {
    service,
})
