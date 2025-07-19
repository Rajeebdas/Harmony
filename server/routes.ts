import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertArtistSchema, 
  insertSongSchema, 
  insertPodcastSchema, 
  insertPlaylistSchema,
  insertFeaturedContentSchema,
  insertUserFavoriteSchema,
  insertUserPlaylistSchema,
  insertUserPlaylistSongSchema,
  insertUserFollowSchema,
  insertSongLikeSchema,
  insertSongShareSchema,
  insertListeningHistorySchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(mp3|wav|m4a|aac)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Users routes
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Artists routes
  app.get('/api/artists', async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.get('/api/artists/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      console.error("Error fetching artist:", error);
      res.status(500).json({ message: "Failed to fetch artist" });
    }
  });

  app.post('/api/artists', async (req, res) => {
    try {
      const validatedData = insertArtistSchema.parse(req.body);
      const artist = await storage.createArtist(validatedData);
      res.status(201).json(artist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating artist:", error);
      res.status(500).json({ message: "Failed to create artist" });
    }
  });

  // Songs routes
  app.get('/api/songs', async (req, res) => {
    try {
      const songs = await storage.getSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  app.get('/api/songs/trending', async (req, res) => {
    try {
      const songs = await storage.getTrendingSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error fetching trending songs:", error);
      res.status(500).json({ message: "Failed to fetch trending songs" });
    }
  });

  app.get('/api/songs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const song = await storage.getSong(id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  app.post('/api/songs', async (req, res) => {
    try {
      const validatedData = insertSongSchema.parse(req.body);
      const song = await storage.createSong(validatedData);
      res.status(201).json(song);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating song:", error);
      res.status(500).json({ message: "Failed to create song" });
    }
  });

  // Podcasts routes
  app.get('/api/podcasts', async (req, res) => {
    try {
      const podcasts = await storage.getPodcasts();
      res.json(podcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      res.status(500).json({ message: "Failed to fetch podcasts" });
    }
  });

  app.get('/api/podcasts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const podcast = await storage.getPodcast(id);
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      res.json(podcast);
    } catch (error) {
      console.error("Error fetching podcast:", error);
      res.status(500).json({ message: "Failed to fetch podcast" });
    }
  });

  app.post('/api/podcasts', async (req, res) => {
    try {
      const validatedData = insertPodcastSchema.parse(req.body);
      const podcast = await storage.createPodcast(validatedData);
      res.status(201).json(podcast);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating podcast:", error);
      res.status(500).json({ message: "Failed to create podcast" });
    }
  });

  // Playlists routes
  app.get('/api/playlists', async (req, res) => {
    try {
      const playlists = await storage.getPlaylists();
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get('/api/playlists/top-charts', async (req, res) => {
    try {
      const topCharts = await storage.getTopCharts();
      res.json(topCharts);
    } catch (error) {
      console.error("Error fetching top charts:", error);
      res.status(500).json({ message: "Failed to fetch top charts" });
    }
  });

  app.get('/api/playlists/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.getPlaylist(id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.post('/api/playlists', async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(validatedData);
      res.status(201).json(playlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating playlist:", error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  // Featured content routes
  app.get('/api/featured', async (req, res) => {
    try {
      const featured = await storage.getFeaturedContent();
      res.json(featured);
    } catch (error) {
      console.error("Error fetching featured content:", error);
      res.status(500).json({ message: "Failed to fetch featured content" });
    }
  });

  app.post('/api/featured', async (req, res) => {
    try {
      const validatedData = insertFeaturedContentSchema.parse(req.body);
      const featured = await storage.createFeaturedContent(validatedData);
      res.status(201).json(featured);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating featured content:", error);
      res.status(500).json({ message: "Failed to create featured content" });
    }
  });

  // File upload for audio files
  app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      const { title, artistId, uploadedBy, genre } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      // Generate file URL
      const audioUrl = `/uploads/${req.file.filename}`;
      
      // Create song record
      const songData = {
        title,
        artistId: artistId ? parseInt(artistId) : null,
        uploadedBy: uploadedBy ? parseInt(uploadedBy) : null,
        audioUrl,
        audioFileName: req.file.originalname,
        fileSize: req.file.size,
        genre: genre || null,
      };

      const song = await storage.createSong(songData);
      res.status(201).json(song);
    } catch (error) {
      console.error("Error uploading audio:", error);
      res.status(500).json({ message: "Failed to upload audio file" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Allow CORS for audio files
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Accept-Ranges', 'bytes');
    next();
  });

  // User favorites routes (without authentication for now)
  app.get('/api/favorites/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', async (req, res) => {
    try {
      const validatedData = insertUserFavoriteSchema.parse(req.body);
      const favorite = await storage.addToFavorites(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/favorites/:userId/:contentType/:contentId', async (req, res) => {
    try {
      const { userId, contentType, contentId } = req.params;
      await storage.removeFromFavorites(parseInt(userId), contentType, parseInt(contentId));
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
