import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Artists table
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Songs table
export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  artistId: integer("artist_id").references(() => artists.id),
  albumArt: varchar("album_art"),
  audioUrl: varchar("audio_url"),
  duration: integer("duration"), // in seconds
  genre: varchar("genre"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Podcasts table
export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  host: varchar("host").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  audioUrl: varchar("audio_url"),
  duration: integer("duration"), // in seconds
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Playlists table
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  category: varchar("category"),
  isTopChart: boolean("is_top_chart").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Playlist songs junction table
export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id),
  songId: integer("song_id").references(() => songs.id),
  position: integer("position"),
});

// Featured content table
export const featuredContent = pgTable("featured_content", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type").notNull(), // 'song', 'album', 'playlist'
  contentId: integer("content_id").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  position: integer("position"),
  isActive: boolean("is_active").default(true),
});

// User favorites table
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  contentType: varchar("content_type").notNull(), // 'song', 'podcast', 'playlist'
  contentId: integer("content_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const artistsRelations = relations(artists, ({ many }) => ({
  songs: many(songs),
}));

export const songsRelations = relations(songs, ({ one, many }) => ({
  artist: one(artists, {
    fields: [songs.artistId],
    references: [artists.id],
  }),
  playlistSongs: many(playlistSongs),
}));

export const playlistsRelations = relations(playlists, ({ many }) => ({
  playlistSongs: many(playlistSongs),
}));

export const playlistSongsRelations = relations(playlistSongs, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistSongs.playlistId],
    references: [playlists.id],
  }),
  song: one(songs, {
    fields: [playlistSongs.songId],
    references: [songs.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;
export type Song = typeof songs.$inferSelect;
export type InsertSong = typeof songs.$inferInsert;
export type Podcast = typeof podcasts.$inferSelect;
export type InsertPodcast = typeof podcasts.$inferInsert;
export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = typeof playlists.$inferInsert;
export type FeaturedContent = typeof featuredContent.$inferSelect;
export type InsertFeaturedContent = typeof featuredContent.$inferInsert;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

// Schemas
export const insertArtistSchema = createInsertSchema(artists);
export const insertSongSchema = createInsertSchema(songs);
export const insertPodcastSchema = createInsertSchema(podcasts);
export const insertPlaylistSchema = createInsertSchema(playlists);
export const insertFeaturedContentSchema = createInsertSchema(featuredContent);
export const insertUserFavoriteSchema = createInsertSchema(userFavorites);
