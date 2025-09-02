'use client'

import { useState } from 'react'

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedAspect, setSelectedAspect] = useState('All')
  
  // Template data matching T050 spec: name, aspect, caption style, music pack
  const templates = [
    {
      id: 1,
      name: "YouTube Shorts",
      aspect: "9:16",
      captionStyle: "Bold Bottom",
      musicPack: "Upbeat",
      description: "Perfect for YouTube Shorts with engaging captions and upbeat music",
      thumbnail: "/templates/shorts.jpg",
      category: "Vertical",
      popular: true
    },
    {
      id: 2,
      name: "TikTok Viral",
      aspect: "9:16", 
      captionStyle: "Center Pop",
      musicPack: "Trending",
      description: "Optimized for TikTok with trending music and viral caption styles",
      thumbnail: "/templates/tiktok.jpg",
      category: "Vertical",
      popular: true
    },
    {
      id: 3,
      name: "Instagram Reels",
      aspect: "9:16",
      captionStyle: "Elegant Side",
      musicPack: "Chill",
      description: "Instagram-style reels with elegant captions and chill music",
      thumbnail: "/templates/reels.jpg",
      category: "Vertical",
      popular: false
    },
    {
      id: 4,
      name: "Square Social", 
      aspect: "1:1",
      captionStyle: "Minimal Center",
      musicPack: "Ambient",
      description: "Perfect square format for Instagram posts and Facebook",
      thumbnail: "/templates/square.jpg",
      category: "Square",
      popular: false
    },
    {
      id: 5,
      name: "Landscape Pro",
      aspect: "16:9",
      captionStyle: "Professional Bottom",
      musicPack: "Corporate",
      description: "Professional landscape format for YouTube and business content",
      thumbnail: "/templates/landscape.jpg", 
      category: "Horizontal",
      popular: false
    },
    {
      id: 6,
      name: "Story Master",
      aspect: "9:16",
      captionStyle: "Story Overlay",
      musicPack: "Dynamic",
      description: "Designed for Instagram and Facebook Stories",
      thumbnail: "/templates/story.jpg",
      category: "Vertical", 
      popular: false
    }
  ];

  const categories = ["All", "Vertical", "Square", "Horizontal"];
  const aspectRatios = ["All", "9:16", "1:1", "16:9"];

  // Filter templates based on selected criteria
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesAspect = selectedAspect === 'All' || template.aspect === selectedAspect
    return matchesCategory && matchesAspect
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Video Templates
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Choose from professionally designed templates optimized for every platform and use case
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">
            Category:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">
            Aspect:
          </span>
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setSelectedAspect(ratio)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAspect === ratio
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Templates */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Popular Templates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.filter(t => t.popular).map((template) => (
            <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-400 mb-2">{template.aspect}</div>
                  <div className="text-sm text-gray-500">Template Preview</div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{template.name}</h3>
                  <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">{template.aspect}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {template.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Caption Style:</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.captionStyle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Music Pack:</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.musicPack}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">All Templates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400 mb-2">{template.aspect}</div>
                  <div className="text-sm text-gray-500">Template Preview</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
                  <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">{template.aspect}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {template.description}
                </p>
                <div className="space-y-1 mb-4 text-sm">
                  <div className="text-gray-500">Caption: {template.captionStyle}</div>
                  <div className="text-gray-500">Music: {template.musicPack}</div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                  Select Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
