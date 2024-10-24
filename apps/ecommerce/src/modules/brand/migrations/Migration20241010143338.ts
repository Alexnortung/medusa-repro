import { Migration } from '@mikro-orm/migrations';

export class Migration20241010143338 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "brand" add column if not exists "icg_ids" text[] not null default \'{}\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "brand" drop column if exists "icg_ids";');
  }

}
