import { BRAND_MODULE } from '../';
import BrandModule from '../service';

declare module '@medusajs/framework/types' {
    interface ModuleImplementations {
        [BRAND_MODULE]: BrandModule,
    }
}
