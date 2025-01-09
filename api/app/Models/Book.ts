import { DateTime } from 'luxon'
import { BaseModel,beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Author from './Author'
import { v4 as uuidv4 } from 'uuid'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public number_of_pages: number

  @column()
  public authorId: string

  @belongsTo(() => Author)
  public author: BelongsTo<typeof Author>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

   @beforeCreate()
    public static assignUuid(book: Book) {
      book.id = uuidv4()
    }

}
