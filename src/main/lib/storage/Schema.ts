import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const songsTable = sqliteTable("songs", {
  audioPath: text().notNull(),
  OsuFile: text().notNull().unique().primaryKey(),
  path: text().notNull(),
  ctime: int(),
  dateAdded: text().notNull(),
  title:text().notNull(),
  artist: text().notNull(),
  creator: text().notNull(),
  BPM: text({mode: 'json'}),
  duration: real(),
  diffs: text({mode:'json'}),
  artistUnicode: text().notNull(),
  titleUnicode: text().notNull(),
  beatmapSetId: int().notNull(),
  mode: int().notNull(),
  tags: text({mode:'json'}),
  bg: text().notNull(),
} )
export const audioTable = sqliteTable("audio", {
  songID: text().notNull().unique(),
  path: text().notNull().unique().primaryKey(),
  ctime: int().notNull()
})

export const testTable = sqliteTable("test", {
  test: text().notNull().unique().primaryKey(),
  number: int().notNull()
  }
)