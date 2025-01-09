import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Book from './Book'
import { v4 as uuidv4 } from 'uuid'

export default class Author extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Book)
  public books: HasMany<typeof Book>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(author: Author) {
    author.id = uuidv4()
  }

}
