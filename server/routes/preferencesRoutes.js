import express from 'express';
import { UserPreferences } from '../models/UserPreferences.js';
const router =express.Router();
/**
 * Middleware to verify user from Clerk (you may already have this)
 * In production, verify the JWT token from Clerk
 */
const extractUserId = (req, res, next) => {
  // Get userId from headers, query params, or request body
  const userId = req.headers['x-user-id'] || req.query.userId || req.body.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  req.userId = userId;
  next();
};

// Apply middleware to al routes
router.use(extractUserId);
/**
 * GET /api/preferences - Get user preferences
 */
router.get('/', async (req, res) => {
  try {
    let preferences = await UserPreferences.findOne({
      userId: req.userId,
    }).populate('savedArtworks.artworkId', 'name img artist category tags');

    if (!preferences) {
      // Create default preferences if not exists
      preferences = new UserPreferences({
        userId: req.userId,
        email: req.headers['x-user-email'] || 'user@example.com',
        firstName: req.headers['x-user-name'] || 'User',
      });
      await preferences.save();
    }

    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

/**
 * PUT /api/preferences - Update user preferences
 */
router.put('/', async (req, res) => {
  try {
    const updates = req.body;

    let preferences = await UserPreferences.findOneAndUpdate(
      { userId: req.userId },
      updates,
      { new: true, upsert: true }
    );

    res.json(preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

/**
 * GET /api/preferences/saved-artworks - Get all saved artworks for user
 */
router.get('/saved-artworks', async (req, res) => {
  try {
    console.log('📥 Fetching saved artworks for user:', req.userId)
    
    const preferences = await UserPreferences.findOne({
      userId: req.userId,
    }).populate('savedArtworks.artworkId')

    if (!preferences) {
      console.log('⚠️ No preferences found, returning empty array')
      return res.json([])
    }

    console.log('📊 Found preferences, saved artworks count:', preferences.savedArtworks.length)

    // Extract artwork details
    const savedArtworks = preferences.savedArtworks
      .filter(item => item.artworkId) // Filter out null references
      .map(item => ({
        ...item.artworkId.toObject(),
        savedAt: item.savedAt,
      }))

    console.log('✅ Returning', savedArtworks.length, 'saved artworks')
    res.json(savedArtworks)
  } catch (error) {
    console.error('❌ Error fetching saved artworks:', error)
    res.status(500).json({ error: 'Failed to fetch saved artworks' })
  }
});

/**
 * POST /api/preferences/saved-artworks/:artworkId - Save an artwork
 */
router.post('/saved-artworks/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params
    console.log('💾 Saving artwork:', artworkId, 'for user:', req.userId)

    // Verify artwork exists
    const artwork = await Data.findById(artworkId)
    if (!artwork) {
      console.log('❌ Artwork not found:', artworkId)
      return res.status(404).json({ error: 'Artwork not found' })
    }
    console.log('✅ Artwork found:', artwork._id, artwork.name)

    let preferences = await UserPreferences.findOne({ userId: req.userId })

    if (!preferences) {
      console.log('📝 Creating new preferences for user:', req.userId)
      preferences = new UserPreferences({
        userId: req.userId,
        email: req.headers['x-user-email'] || 'user@example.com',
      })
    }

    // Check if already saved
    const alreadySaved = preferences.savedArtworks.some(
      item => item.artworkId?.toString() === artworkId
    )

    if (alreadySaved) {
      console.log('⚠️ Artwork already saved')
      return res.status(400).json({ error: 'Artwork already saved' })
    }

    preferences.savedArtworks.push({
      artworkId,
      savedAt: new Date(),
    })

    console.log('💾 Saving preferences, total saved:', preferences.savedArtworks.length)
    await preferences.save()
    await preferences.populate('savedArtworks.artworkId')

    console.log('✅ Artwork saved successfully')
    res.json({ message: 'Artwork saved', preferences })
  } catch (error) {
    console.error('❌ Error saving artwork:', error)
    res.status(500).json({ error: 'Failed to save artwork' })
  }
});

/**
 * DELETE /api/preferences/saved-artworks/:artworkId - Remove saved artwork
 */
router.delete('/saved-artworks/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params;

    let preferences = await UserPreferences.findOne({ userId: req.userId });

    if (!preferences) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    preferences.savedArtworks = preferences.savedArtworks.filter(
      item => item.artworkId.toString() !== artworkId
    );

    await preferences.save();

    res.json({ message: 'Artwork removed from saved', preferences });
  } catch (error) {
    console.error('Error removing saved artwork:', error);
    res.status(500).json({ error: 'Failed to remove artwork' });
  }
});

/**
 * GET /api/preferences/liked-artworks - Get all liked artworks for user
 */
router.get('/liked-artworks', async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({
      userId: req.userId,
    }).populate('likedArtworks.artworkId');

    if (!preferences) {
      return res.json([]);
    }

    const likedArtworks = preferences.likedArtworks.map(item => ({
      ...item.artworkId.toObject(),
      likedAt: item.likedAt,
    }));

    res.json(likedArtworks);
  } catch (error) {
    console.error('Error fetching liked artworks:', error);
    res.status(500).json({ error: 'Failed to fetch liked artworks' });
  }
});

/**
 * POST /api/preferences/liked-artworks/:artworkId - Like an artwork
 */
router.post('/liked-artworks/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params;

    // Verify artwork exists
    const artwork = await Data.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    let preferences = await UserPreferences.findOne({ userId: req.userId });

    if (!preferences) {
      preferences = new UserPreferences({
        userId: req.userId,
        email: req.headers['x-user-email'] || 'user@example.com',
      });
    }

    // Check if already liked
    const alreadyLiked = preferences.likedArtworks.some(
      item => item.artworkId.toString() === artworkId
    );

    if (alreadyLiked) {
      return res.status(400).json({ error: 'Artwork already liked' });
    }

    preferences.likedArtworks.push({
      artworkId,
      likedAt: new Date(),
    });

    await preferences.save();

    res.json({ message: 'Artwork liked', preferences });
  } catch (error) {
    console.error('Error liking artwork:', error);
    res.status(500).json({ error: 'Failed to like artwork' });
  }
});

/**
 * DELETE /api/preferences/liked-artworks/:artworkId - Unlike an artwork
 */
router.delete('/liked-artworks/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params;

    let preferences = await UserPreferences.findOne({ userId: req.userId });

    if (!preferences) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    preferences.likedArtworks = preferences.likedArtworks.filter(
      item => item.artworkId.toString() !== artworkId
    );

    await preferences.save();

    res.json({ message: 'Artwork unliked', preferences });
  } catch (error) {
    console.error('Error unliking artwork:', error);
    res.status(500).json({ error: 'Failed to unlike artwork' });
  }
});

/**
 * POST /api/preferences/favorite-artists - Add favorite artist
 */
router.post('/favorite-artists', async (req, res) => {
  try {
    const { artist } = req.body;

    if (!artist) {
      return res.status(400).json({ error: 'Artist name required' });
    }

    let preferences = await UserPreferences.findOne({ userId: req.userId });

    if (!preferences) {
      preferences = new UserPreferences({
        userId: req.userId,
        email: req.headers['x-user-email'] || 'user@example.com',
      });
    }

    if (!preferences.favoriteArtists.includes(artist)) {
      preferences.favoriteArtists.push(artist);
      await preferences.save();
    }

    res.json({ message: 'Artist added to favorites', preferences });
  } catch (error) {
    console.error('Error adding favorite artist:', error);
    res.status(500).json({ error: 'Failed to add favorite artist' });
  }
});

/**
 * DELETE /api/preferences/favorite-artists/:artist - Remove favorite artist
 */
router.delete('/favorite-artists/:artist', async (req, res) => {
  try {
    const { artist } = req.params;

    let preferences = await UserPreferences.findOne({ userId: req.userId });

    if (preferences) {
      preferences.favoriteArtists = preferences.favoriteArtists.filter(
        a => a !== artist
      );
      await preferences.save();
    }

    res.json({ message: 'Artist removed from favorites', preferences });
  } catch (error) {
    console.error('Error removing favorite artist:', error);
    res.status(500).json({ error: 'Failed to remove favorite artist' });
  }
});
export default router;
