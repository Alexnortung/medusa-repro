import { SYNC_SERVICE } from '../';
import SyncServiceModule from '../service';

declare module '@medusajs/framework/types' {
    interface ModuleImplementations {
        [SYNC_SERVICE]: SyncServiceModule,
    }
}
