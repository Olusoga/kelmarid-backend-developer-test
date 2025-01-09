import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Books extends BaseSchema {
  protected tableName = 'books'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary() 
      table.string('name').notNullable()
      table.integer('number_of_pages').notNullable()
      table
        .uuid('author_id') 
        .notNullable()
        .references('id')
        .inTable('authors')
        .onDelete('CASCADE') 
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
