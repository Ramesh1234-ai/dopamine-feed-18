// Local Storage Manager for User Preferences
const STORAGE_KEY = 'gallery_user_preferences'

export const defaultPreferences = {
  theme: 'dark',
  itemsPerPage: 12,
  gridColumns: 4,
  filterCategory: 'all',
  sortBy: 'newest',
  savedArtworks: [],
  favoriteArtists: [],
  notificationsEnabled: true,
  emailNotifications: true,
  privateProfile: false,
  displayName: '',
  bio: '',
}

export const preferencesManager = {
  // Get all preferences
  getPreferences: (userId) => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
      return data ? JSON.parse(data) : defaultPreferences
    } catch (error) {
      console.error('Error reading preferences:', error)
      return defaultPreferences
    }
  },

  // Save preferences
  setPreferences: (userId, preferences) => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}_${userId}`,
        JSON.stringify(preferences)
      )
      return true
    } catch (error) {
      console.error('Error saving preferences:', error)
      return false
    }
  },

  // Update specific preference
  updatePreference: (userId, key, value) => {
    try {
      const prefs = preferencesManager.getPreferences(userId)
      prefs[key] = value
      preferencesManager.setPreferences(userId, prefs)
      return true
    } catch (error) {
      console.error('Error updating preference:', error)
      return false
    }
  },

  // Add saved artwork
  addSavedArtwork: (userId, artwork) => {
    try {
      const prefs = preferencesManager.getPreferences(userId)
      if (!prefs.savedArtworks.some(item => item._id === artwork._id)) {
        prefs.savedArtworks.push(artwork)
        preferencesManager.setPreferences(userId, prefs)
      }
      return true
    } catch (error) {
      console.error('Error adding saved artwork:', error)
      return false
    }
  },

  // Remove saved artwork
  removeSavedArtwork: (userId, artworkId) => {
    try {
      const prefs = preferencesManager.getPreferences(userId)
      prefs.savedArtworks = prefs.savedArtworks.filter(
        item => item._id !== artworkId
      )
      preferencesManager.setPreferences(userId, prefs)
      return true
    } catch (error) {
      console.error('Error removing saved artwork:', error)
      return false
    }
  },

  // Get saved artwork by ID
  getSavedArtwork: (userId, artworkId) => {
    const prefs = preferencesManager.getPreferences(userId)
    return prefs.savedArtworks.find(item => item._id === artworkId)
  },

  // Check if artwork is saved
  isArtworkSaved: (userId, artworkId) => {
    return preferencesManager.getSavedArtwork(userId, artworkId) !== undefined
  },

  // Reset to default preferences
  resetPreferences: (userId) => {
    try {
      preferencesManager.setPreferences(userId, defaultPreferences)
      return true
    } catch (error) {
      console.error('Error resetting preferences:', error)
      return false
    }
  },
}
