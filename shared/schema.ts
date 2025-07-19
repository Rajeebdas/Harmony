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



// User storage table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  isArtist: boolean("is_artist").default(false),
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
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
  uploadedBy: integer("uploaded_by").references(() => users.id),
  albumArt: varchar("album_art"),
  audioUrl: varchar("audio_url").notNull(),
  audioFileName: varchar("audio_file_name"),
  fileSize: integer("file_size"), // in bytes
  duration: integer("duration"), // in seconds
  genre: varchar("genre"),
  playCount: integer("play_count").default(0),
  likesCount: integer("likes_count").default(0),
  isPublic: boolean("is_public").default(true),
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
  userId: integer("user_id").references(() => users.id),
  contentType: varchar("content_type").notNull(), // 'song', 'podcast', 'playlist'
  contentId: integer("content_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User playlists table
export const userPlaylists = pgTable("user_playlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  isPublic: boolean("is_public").default(true),
  songCount: integer("song_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User playlist songs junction table
export const userPlaylistSongs = pgTable("user_playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => userPlaylists.id),
  songId: integer("song_id").references(() => songs.id),
  position: integer("position"),
  addedAt: timestamp("added_at").defaultNow(),
});

// User follows table (for following artists/users)
export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id),
  followingId: integer("following_id").references(() => users.id),
  followType: varchar("follow_type").notNull(), // 'user', 'artist'
  createdAt: timestamp("created_at").defaultNow(),
});

// Song likes table
export const songLikes = pgTable("song_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  songId: integer("song_id").references(() => songs.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Song shares table
export const songShares = pgTable("song_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  songId: integer("song_id").references(() => songs.id),
  shareType: varchar("share_type").notNull(), // 'link', 'social', 'email'
  createdAt: timestamp("created_at").defaultNow(),
});

// User listening history table
export const listeningHistory = pgTable("listening_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  songId: integer("song_id").references(() => songs.id),
  playedAt: timestamp("played_at").defaultNow(),
  playDuration: integer("play_duration"), // how much of the song was played in seconds
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
  uploader: one(users, {
    fields: [songs.uploadedBy],
    references: [users.id],
  }),
  playlistSongs: many(playlistSongs),
  userPlaylistSongs: many(userPlaylistSongs),
  likes: many(songLikes),
  shares: many(songShares),
  listeningHistory: many(listeningHistory),
}));

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(userFavorites),
  uploadedSongs: many(songs),
  playlists: many(userPlaylists),
  followers: many(userFollows, { relationName: "following" }),
  following: many(userFollows, { relationName: "follower" }),
  songLikes: many(songLikes),
  songShares: many(songShares),
  listeningHistory: many(listeningHistory),
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

export const userPlaylistsRelations = relations(userPlaylists, ({ one, many }) => ({
  user: one(users, {
    fields: [userPlaylists.userId],
    references: [users.id],
  }),
  songs: many(userPlaylistSongs),
}));

export const userPlaylistSongsRelations = relations(userPlaylistSongs, ({ one }) => ({
  playlist: one(userPlaylists, {
    fields: [userPlaylistSongs.playlistId],
    references: [userPlaylists.id],
  }),
  song: one(songs, {
    fields: [userPlaylistSongs.songId],
    references: [songs.id],
  }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
}));

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export const songLikesRelations = relations(songLikes, ({ one }) => ({
  user: one(users, {
    fields: [songLikes.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [songLikes.songId],
    references: [songs.id],
  }),
}));

export const songSharesRelations = relations(songShares, ({ one }) => ({
  user: one(users, {
    fields: [songShares.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [songShares.songId],
    references: [songs.id],
  }),
}));

export const listeningHistoryRelations = relations(listeningHistory, ({ one }) => ({
  user: one(users, {
    fields: [listeningHistory.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [listeningHistory.songId],
    references: [songs.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
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
export type UserPlaylist = typeof userPlaylists.$inferSelect;
export type InsertUserPlaylist = typeof userPlaylists.$inferInsert;
export type UserPlaylistSong = typeof userPlaylistSongs.$inferSelect;
export type InsertUserPlaylistSong = typeof userPlaylistSongs.$inferInsert;
export type UserFollow = typeof userFollows.$inferSelect;
export type InsertUserFollow = typeof userFollows.$inferInsert;
export type SongLike = typeof songLikes.$inferSelect;
export type InsertSongLike = typeof songLikes.$inferInsert;
export type SongShare = typeof songShares.$inferSelect;
export type InsertSongShare = typeof songShares.$inferInsert;
export type ListeningHistory = typeof listeningHistory.$inferSelect;
export type InsertListeningHistory = typeof listeningHistory.$inferInsert;

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertArtistSchema = createInsertSchema(artists);
export const insertSongSchema = createInsertSchema(songs);
export const insertPodcastSchema = createInsertSchema(podcasts);
export const insertPlaylistSchema = createInsertSchema(playlists);
export const insertFeaturedContentSchema = createInsertSchema(featuredContent);
export const insertUserFavoriteSchema = createInsertSchema(userFavorites);
export const insertUserPlaylistSchema = createInsertSchema(userPlaylists);
export const insertUserPlaylistSongSchema = createInsertSchema(userPlaylistSongs);
export const insertUserFollowSchema = createInsertSchema(userFollows);
export const insertSongLikeSchema = createInsertSchema(songLikes);
export const insertSongShareSchema = createInsertSchema(songShares);
export const insertListeningHistorySchema = createInsertSchema(listeningHistory);
