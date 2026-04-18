import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useToast } from '../../context/ToastContext'
import Header from '../common/header'
import Sidebar from '../common/sidebar'

export default function UploadPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Anime',
    tags: '',
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showToast('File size must be less than 10MB', 'error')
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      showToast('Please select an image to upload', 'error')
      return
    }

    try {
      setLoading(true)
      setProgress(0)

      const data = new FormData()
      data.append('file', selectedFile)
      data.append('title', formData.title || selectedFile.name)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('tags', formData.tags)

      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
      }, 200)

      const response = await fetch(`${apiURL}/api/images/upload/my-uploads`, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      setProgress(100)
      showToast('Image uploaded successfully! 🎉', 'success', 3000)

      // Reset form
      setFormData({ title: '', description: '', category: 'Anime', tags: '' })
      setSelectedFile(null)
      setPreview(null)
      setProgress(0)

      // Redirect after delay
      setTimeout(() => {
        navigate('/gallery')
      }, 1000)
    } catch (error) {
      console.error('Upload error:', error)
      showToast(`Upload failed: ${error.message}`, 'error', 5000)
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Upload Image
          </h1>
          <p className="text-gray-400">Share your AI-generated artwork with the community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-xl p-8 transition-colors text-center cursor-pointer bg-slate-800/30"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedFile ? 'Change Image' : 'Drag and Drop or Click to Upload'}
              </h3>
              <p className="text-gray-400 text-sm">
                Image files up to 10MB (PNG, JPG, WebP, etc.)
              </p>
            </label>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="relative rounded-xl overflow-hidden border border-slate-700">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <p className="absolute bottom-4 left-4 text-white font-semibold">
                {selectedFile?.name}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-500 text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Give your artwork a title"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-500 text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your artwork..."
                rows="4"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-500 text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option>Anime</option>
                  <option>Space</option>
                  <option>Nature</option>
                  <option>Portrait</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-500 text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g. art, ai, creative"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            disabled={loading}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
