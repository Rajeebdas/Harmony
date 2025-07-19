import {
  users,
  artists,
  songs,
  podcasts,
  playlists,
  featuredContent,
  userFavorites,
  playlistSongs,
  type User,
  type UpsertUser,
  type Artist,
  type InsertArtist,
  type Song,
  type InsertSong,
  type Podcast,
  type InsertPodcast,
  type Playlist,
  type InsertPlaylist,
  type FeaturedContent,
  type InsertFeaturedContent,
  type UserFavorite,
  type InsertUserFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Artist operations
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  
  // Song operations
  getSongs(): Promise<(Song & { artist: Artist | null })[]>;
  getTrendingSongs(): Promise<(Song & { artist: Artist | null })[]>;
  getSong(id: number): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  
  // Podcast operations
  getPodcasts(): Promise<Podcast[]>;
  getPodcast(id: number): Promise<Podcast | undefined>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
  
  // Playlist operations
  getPlaylists(): Promise<Playlist[]>;
  getTopCharts(): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // Featured content operations
  getFeaturedContent(): Promise<FeaturedContent[]>;
  createFeaturedContent(content: InsertFeaturedContent): Promise<FeaturedContent>;
  
  // User favorites operations
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addToFavorites(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFromFavorites(userId: string, contentType: string, contentId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Artist operations
  async getArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(asc(artists.name));
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist;
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const [newArtist] = await db.insert(artists).values(artist).returning();
    return newArtist;
  }

  // Song operations
  async getSongs(): Promise<(Song & { artist: Artist | null })[]> {
    return await db
      .select({
        id: songs.id,
        title: songs.title,
        artistId: songs.artistId,
        albumArt: songs.albumArt,
        audioUrl: songs.audioUrl,
        duration: songs.duration,
        genre: songs.genre,
        createdAt: songs.createdAt,
        artist: artists,
      })
      .from(songs)
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .orderBy(desc(songs.createdAt));
  }

  async getTrendingSongs(): Promise<(Song & { artist: Artist | null })[]> {
    return await db
      .select({
        id: songs.id,
        title: songs.title,
        artistId: songs.artistId,
        albumArt: songs.albumArt,
        audioUrl: songs.audioUrl,
        duration: songs.duration,
        genre: songs.genre,
        createdAt: songs.createdAt,
        artist: artists,
      })
      .from(songs)
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .orderBy(desc(songs.createdAt))
      .limit(9);
  }

  async getSong(id: number): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async createSong(song: InsertSong): Promise<Song> {
    const [newSong] = await db.insert(songs).values(song).returning();
    return newSong;
  }

  // Podcast operations
  async getPodcasts(): Promise<Podcast[]> {
    return await db.select().from(podcasts).orderBy(desc(podcasts.createdAt));
  }

  async getPodcast(id: number): Promise<Podcast | undefined> {
    const [podcast] = await db.select().from(podcasts).where(eq(podcasts.id, id));
    return podcast;
  }

  async createPodcast(podcast: InsertPodcast): Promise<Podcast> {
    const [newPodcast] = await db.insert(podcasts).values(podcast).returning();
    return newPodcast;
  }

  // Playlist operations
  async getPlaylists(): Promise<Playlist[]> {
    return await db.select().from(playlists).orderBy(desc(playlists.createdAt));
  }

  async getTopCharts(): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.isTopChart, true))
      .orderBy(asc(playlists.title));
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db.insert(playlists).values(playlist).returning();
    return newPlaylist;
  }

  // Featured content operations
  async getFeaturedContent(): Promise<FeaturedContent[]> {
    return await db
      .select()
      .from(featuredContent)
      .where(eq(featuredContent.isActive, true))
      .orderBy(asc(featuredContent.position));
  }

  async createFeaturedContent(content: InsertFeaturedContent): Promise<FeaturedContent> {
    const [newContent] = await db.insert(featuredContent).values(content).returning();
    return newContent;
  }

  // User favorites operations
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
  }

  async addToFavorites(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const [newFavorite] = await db.insert(userFavorites).values(favorite).returning();
    return newFavorite;
  }

  async removeFromFavorites(userId: string, contentType: string, contentId: number): Promise<void> {
    await db
      .delete(userFavorites)
      .where(
        eq(userFavorites.userId, userId) &&
        eq(userFavorites.contentType, contentType) &&
        eq(userFavorites.contentId, contentId)
      );
  }
}

export const storage = new DatabaseStorage();
