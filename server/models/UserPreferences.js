import mongoose  from "mongoose";
/**
 * UserPreferences Schema
 * Stores user-specific preferences and saved artworks
 */
const userPreferencesSchema = new mongoose.Schema(
  {
    // Clerk User ID
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // User Profile Info
    email: {
      type: String,
      required: true,
    },

    firstName: String,
    lastName: String,
    imageUrl: String,

    // Saved Artworks - Reference to artwork IDs
    savedArtworks: [
      {
        artworkId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Data', // Reference to the artwork/profile
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Liked Artworks - Reference to artwork IDs
    likedArtworks: [
      {
        artworkId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Data',
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Display Preferences
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },

    itemsPerPage: {
      type: Number,
      default: 12,
    },

    gridColumns: {
      type: Number,
      default: 4,
    },

    // Filter Preferences
    defaultCategory: {
      type: String,
      default: 'all',
    },

    defaultSort: {
      type: String,
      enum: ['newest', 'oldest', 'popular'],
      default: 'newest',
    },

    // Notification Preferences
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    emailNotifications: {
      type: Boolean,
      default: false,
    },

    // Bio and display name
    displayName: {
      type: String,
      maxlength: 100,
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    // Privacy settings
    privateProfile: {
      type: Boolean,
      default: false,
    },

    // Search history (optional)
    searchHistory: [
      {
        query: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Favorite Artists
    favoriteArtists: [String],

    // Favorite Tags
    favoriteTags: [String],
  },
  {
    timestamps: true,
  }
);
// Index for common queries
userPreferencesSchema.index({ userId: 1, 'savedArtworks.artworkId': 1 });
userPreferencesSchema.index({ userId: 1, 'likedArtworks.artworkId': 1 });
export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
