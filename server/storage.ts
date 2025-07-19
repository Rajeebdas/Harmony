import {
  users,
  artists,
  songs,
  podcasts,
  playlists,
  featuredContent,
  userFavorites,
  playlistSongs,
  userPlaylists,
  userPlaylistSongs,
  userFollows,
  songLikes,
  songShares,
  listeningHistory,
  type User,
  type InsertUser,
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
  type UserPlaylist,
  type InsertUserPlaylist,
  type UserPlaylistSong,
  type InsertUserPlaylistSong,
  type UserFollow,
  type InsertUserFollow,
  type SongLike,
  type InsertSongLike,
  type SongShare,
  type InsertSongShare,
  type ListeningHistory,
  type InsertListeningHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Artist operations
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  
  // Song operations
  getSongs(): Promise<(Song & { artist: Artist | null; uploader: User | null })[]>;
  getTrendingSongs(): Promise<(Song & { artist: Artist | null; uploader: User | null })[]>;
  getSong(id: number): Promise<(Song & { artist: Artist | null; uploader: User | null }) | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  updateSong(id: number, song: Partial<InsertSong>): Promise<Song>;
  deleteSong(id: number): Promise<void>;
  
  // Podcast operations
  getPodcasts(): Promise<Podcast[]>;
  getPodcast(id: number): Promise<Podcast | undefined>;
  createPodcast(podcast: InsertPodcast): Promise<Podcast>;
  
  // Playlist operations
  getPlaylists(): Promise<Playlist[]>;
  getTopCharts(): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // User playlist operations
  getUserPlaylists(userId: number): Promise<UserPlaylist[]>;
  getUserPlaylist(id: number): Promise<(UserPlaylist & { songs: (Song & { artist: Artist | null })[] }) | undefined>;
  createUserPlaylist(playlist: InsertUserPlaylist): Promise<UserPlaylist>;
  updateUserPlaylist(id: number, playlist: Partial<InsertUserPlaylist>): Promise<UserPlaylist>;
  deleteUserPlaylist(id: number): Promise<void>;
  addSongToPlaylist(playlistSong: InsertUserPlaylistSong): Promise<UserPlaylistSong>;
  removeSongFromPlaylist(playlistId: number, songId: number): Promise<void>;
  
  // Featured content operations
  getFeaturedContent(): Promise<FeaturedContent[]>;
  createFeaturedContent(content: InsertFeaturedContent): Promise<FeaturedContent>;
  
  // User favorites operations
  getUserFavorites(userId: number): Promise<UserFavorite[]>;
  addToFavorites(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFromFavorites(userId: number, contentType: string, contentId: number): Promise<void>;
  
  // Social features
  followUser(follow: InsertUserFollow): Promise<UserFollow>;
  unfollowUser(followerId: number, followingId: number): Promise<void>;
  getUserFollowers(userId: number): Promise<(UserFollow & { follower: User })[]>;
  getUserFollowing(userId: number): Promise<(UserFollow & { following: User })[]>;
  
  // Song interactions
  likeSong(like: InsertSongLike): Promise<SongLike>;
  unlikeSong(userId: number, songId: number): Promise<void>;
  getSongLikes(songId: number): Promise<number>;
  shareSong(share: InsertSongShare): Promise<SongShare>;
  
  // Listening history
  addToHistory(history: InsertListeningHistory): Promise<ListeningHistory>;
  getUserHistory(userId: number): Promise<(ListeningHistory & { song: Song & { artist: Artist | null } })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.username));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
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
  async getSongs(): Promise<(Song & { artist: Artist | null; uploader: User | null })[]> {
    return await db
      .select({
        id: songs.id,
        title: songs.title,
        artistId: songs.artistId,
        uploadedBy: songs.uploadedBy,
        albumArt: songs.albumArt,
        audioUrl: songs.audioUrl,
        audioFileName: songs.audioFileName,
        fileSize: songs.fileSize,
        duration: songs.duration,
        genre: songs.genre,
        playCount: songs.playCount,
        likesCount: songs.likesCount,
        isPublic: songs.isPublic,
        createdAt: songs.createdAt,
        artist: artists,
        uploader: users,
      })
      .from(songs)
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .leftJoin(users, eq(songs.uploadedBy, users.id))
      .where(eq(songs.isPublic, true))
      .orderBy(desc(songs.createdAt));
  }

  async getTrendingSongs(): Promise<(Song & { artist: Artist | null; uploader: User | null })[]> {
    return await db
      .select({
        id: songs.id,
        title: songs.title,
        artistId: songs.artistId,
        uploadedBy: songs.uploadedBy,
        albumArt: songs.albumArt,
        audioUrl: songs.audioUrl,
        audioFileName: songs.audioFileName,
        fileSize: songs.fileSize,
        duration: songs.duration,
        genre: songs.genre,
        playCount: songs.playCount,
        likesCount: songs.likesCount,
        isPublic: songs.isPublic,
        createdAt: songs.createdAt,
        artist: artists,
        uploader: users,
      })
      .from(songs)
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .leftJoin(users, eq(songs.uploadedBy, users.id))
      .where(eq(songs.isPublic, true))
      .orderBy(desc(songs.playCount), desc(songs.likesCount))
      .limit(9);
  }

  async getSong(id: number): Promise<(Song & { artist: Artist | null; uploader: User | null }) | undefined> {
    const [result] = await db
      .select({
        id: songs.id,
        title: songs.title,
        artistId: songs.artistId,
        uploadedBy: songs.uploadedBy,
        albumArt: songs.albumArt,
        audioUrl: songs.audioUrl,
        audioFileName: songs.audioFileName,
        fileSize: songs.fileSize,
        duration: songs.duration,
        genre: songs.genre,
        playCount: songs.playCount,
        likesCount: songs.likesCount,
        isPublic: songs.isPublic,
        createdAt: songs.createdAt,
        artist: artists,
        uploader: users,
      })
      .from(songs)
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .leftJoin(users, eq(songs.uploadedBy, users.id))
      .where(eq(songs.id, id));
    return result;
  }

  async createSong(song: InsertSong): Promise<Song> {
    const [newSong] = await db.insert(songs).values(song).returning();
    return newSong;
  }

  async updateSong(id: number, songData: Partial<InsertSong>): Promise<Song> {
    const [song] = await db
      .update(songs)
      .set(songData)
      .where(eq(songs.id, id))
      .returning();
    return song;
  }

  async deleteSong(id: number): Promise<void> {
    await db.delete(songs).where(eq(songs.id, id));
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

  // User playlist operations
  async getUserPlaylists(userId: number): Promise<UserPlaylist[]> {
    return await db
      .select()
      .from(userPlaylists)
      .where(eq(userPlaylists.userId, userId))
      .orderBy(desc(userPlaylists.updatedAt));
  }

  async getUserPlaylist(id: number): Promise<(UserPlaylist & { songs: (Song & { artist: Artist | null })[] }) | undefined> {
    const [playlist] = await db.select().from(userPlaylists).where(eq(userPlaylists.id, id));
    if (!playlist) return undefined;

    const playlistSongs = await db
      .select({
        id: songs.id,
        title: songs.title,
        artistId: songs.artistId,
        uploadedBy: songs.uploadedBy,
        albumArt: songs.albumArt,
        audioUrl: songs.audioUrl,
        audioFileName: songs.audioFileName,
        fileSize: songs.fileSize,
        duration: songs.duration,
        genre: songs.genre,
        playCount: songs.playCount,
        likesCount: songs.likesCount,
        isPublic: songs.isPublic,
        createdAt: songs.createdAt,
        artist: artists,
      })
      .from(userPlaylistSongs)
      .leftJoin(songs, eq(userPlaylistSongs.songId, songs.id))
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .where(eq(userPlaylistSongs.playlistId, id))
      .orderBy(asc(userPlaylistSongs.position));

    return { ...playlist, songs: playlistSongs };
  }

  async createUserPlaylist(playlist: InsertUserPlaylist): Promise<UserPlaylist> {
    const [newPlaylist] = await db.insert(userPlaylists).values(playlist).returning();
    return newPlaylist;
  }

  async updateUserPlaylist(id: number, playlistData: Partial<InsertUserPlaylist>): Promise<UserPlaylist> {
    const [playlist] = await db
      .update(userPlaylists)
      .set({ ...playlistData, updatedAt: new Date() })
      .where(eq(userPlaylists.id, id))
      .returning();
    return playlist;
  }

  async deleteUserPlaylist(id: number): Promise<void> {
    await db.delete(userPlaylistSongs).where(eq(userPlaylistSongs.playlistId, id));
    await db.delete(userPlaylists).where(eq(userPlaylists.id, id));
  }

  async addSongToPlaylist(playlistSong: InsertUserPlaylistSong): Promise<UserPlaylistSong> {
    const [newPlaylistSong] = await db.insert(userPlaylistSongs).values(playlistSong).returning();
    
    // Update song count - get count first
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(userPlaylistSongs)
      .where(eq(userPlaylistSongs.playlistId, playlistSong.playlistId!));
    
    await db
      .update(userPlaylists)
      .set({ 
        songCount: countResult[0]?.count || 0,
        updatedAt: new Date()
      })
      .where(eq(userPlaylists.id, playlistSong.playlistId!));
    
    return newPlaylistSong;
  }

  async removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
    await db
      .delete(userPlaylistSongs)
      .where(and(eq(userPlaylistSongs.playlistId, playlistId), eq(userPlaylistSongs.songId, songId)));
    
    // Update song count - get count first
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(userPlaylistSongs)
      .where(eq(userPlaylistSongs.playlistId, playlistId));
    
    await db
      .update(userPlaylists)
      .set({ 
        songCount: countResult[0]?.count || 0,
        updatedAt: new Date()
      })
      .where(eq(userPlaylists.id, playlistId));
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
  async getUserFavorites(userId: number): Promise<UserFavorite[]> {
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

  async removeFromFavorites(userId: number, contentType: string, contentId: number): Promise<void> {
    await db
      .delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.contentType, contentType),
        eq(userFavorites.contentId, contentId)
      ));
  }

  // Social features
  async followUser(follow: InsertUserFollow): Promise<UserFollow> {
    const [newFollow] = await db.insert(userFollows).values(follow).returning();
    
    // Update follower and following counts
    await db
      .update(users)
      .set({ followingCount: sql`${users.followingCount} + 1` })
      .where(eq(users.id, follow.followerId!));
    
    await db
      .update(users)
      .set({ followerCount: sql`${users.followerCount} + 1` })
      .where(eq(users.id, follow.followingId!));
    
    return newFollow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db
      .delete(userFollows)
      .where(and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, followingId)));
    
    // Update follower and following counts
    await db
      .update(users)
      .set({ followingCount: sql`${users.followingCount} - 1` })
      .where(eq(users.id, followerId));
    
    await db
      .update(users)
      .set({ followerCount: sql`${users.followerCount} - 1` })
      .where(eq(users.id, followingId));
  }

  async getUserFollowers(userId: number): Promise<(UserFollow & { follower: User })[]> {
    return await db
      .select({
        id: userFollows.id,
        followerId: userFollows.followerId,
        followingId: userFollows.followingId,
        followType: userFollows.followType,
        createdAt: userFollows.createdAt,
        follower: users,
      })
      .from(userFollows)
      .leftJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(userFollows.followingId, userId))
      .orderBy(desc(userFollows.createdAt));
  }

  async getUserFollowing(userId: number): Promise<(UserFollow & { following: User })[]> {
    return await db
      .select({
        id: userFollows.id,
        followerId: userFollows.followerId,
        followingId: userFollows.followingId,
        followType: userFollows.followType,
        createdAt: userFollows.createdAt,
        following: users,
      })
      .from(userFollows)
      .leftJoin(users, eq(userFollows.followingId, users.id))
      .where(eq(userFollows.followerId, userId))
      .orderBy(desc(userFollows.createdAt));
  }

  // Song interactions
  async likeSong(like: InsertSongLike): Promise<SongLike> {
    const [newLike] = await db.insert(songLikes).values(like).returning();
    
    // Update song likes count
    await db
      .update(songs)
      .set({ likesCount: sql`${songs.likesCount} + 1` })
      .where(eq(songs.id, like.songId!));
    
    return newLike;
  }

  async unlikeSong(userId: number, songId: number): Promise<void> {
    await db
      .delete(songLikes)
      .where(and(eq(songLikes.userId, userId), eq(songLikes.songId, songId)));
    
    // Update song likes count
    await db
      .update(songs)
      .set({ likesCount: sql`${songs.likesCount} - 1` })
      .where(eq(songs.id, songId));
  }

  async getSongLikes(songId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql`count(*)` })
      .from(songLikes)
      .where(eq(songLikes.songId, songId));
    return Number(result.count) || 0;
  }

  async shareSong(share: InsertSongShare): Promise<SongShare> {
    const [newShare] = await db.insert(songShares).values(share).returning();
    return newShare;
  }

  // Listening history
  async addToHistory(history: InsertListeningHistory): Promise<ListeningHistory> {
    const [newHistory] = await db.insert(listeningHistory).values(history).returning();
    
    // Update song play count
    await db
      .update(songs)
      .set({ playCount: sql`${songs.playCount} + 1` })
      .where(eq(songs.id, history.songId!));
    
    return newHistory;
  }

  async getUserHistory(userId: number): Promise<(ListeningHistory & { song: Song & { artist: Artist | null } })[]> {
    return await db
      .select({
        id: listeningHistory.id,
        userId: listeningHistory.userId,
        songId: listeningHistory.songId,
        playedAt: listeningHistory.playedAt,
        playDuration: listeningHistory.playDuration,
        song: {
          id: songs.id,
          title: songs.title,
          artistId: songs.artistId,
          uploadedBy: songs.uploadedBy,
          albumArt: songs.albumArt,
          audioUrl: songs.audioUrl,
          audioFileName: songs.audioFileName,
          fileSize: songs.fileSize,
          duration: songs.duration,
          genre: songs.genre,
          playCount: songs.playCount,
          likesCount: songs.likesCount,
          isPublic: songs.isPublic,
          createdAt: songs.createdAt,
          artist: artists,
        },
      })
      .from(listeningHistory)
      .leftJoin(songs, eq(listeningHistory.songId, songs.id))
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .where(eq(listeningHistory.userId, userId))
      .orderBy(desc(listeningHistory.playedAt))
      .limit(50);
  }
}

export const storage = new DatabaseStorage();
