import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Author from './Author'
import { v4 as uuidv4 } from 'uuid'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public username: string

  @column()
  public password: string

  @hasOne(() => Author)
  public author: HasOne<typeof Author>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuidv4()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
    if (user.$dirty) {
      user.updatedAt = DateTime.local()
    }
  }
}
