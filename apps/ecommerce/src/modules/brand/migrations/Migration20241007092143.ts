import { Migration } from '@mikro-orm/migrations';

export class Migration20241007092143 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_brand_name_unique" ON "brand" (name) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_brand_name_unique";');
  }

}
