'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface ProjectProgress {
  type: 'progress' | 'error'
  projectId: string
  status?: 'DRAFT' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress?: number
  exportUrl?: string
  thumbnailUrl?: string
  title?: string
  error?: string
  timestamp: number
}

export interface UseProjectProgressOptions {
  projectId: string
  enabled?: boolean
  onProgress?: (data: ProjectProgress) => void
  onComplete?: (data: ProjectProgress) => void
  onError?: (data: ProjectProgress) => void
}

export interface UseProjectProgressReturn {
  progress: number
  status: string | null
  isProcessing: boolean
  isCompleted: boolean
  isFailed: boolean
  exportUrl: string | null
  thumbnailUrl: string | null
  error: string | null
  lastUpdate: number | null
  disconnect: () => void
  reconnect: () => void
}

export function useProjectProgress({
  projectId,
  enabled = true,
  onProgress,
  onComplete,
  onError,
}: UseProjectProgressOptions): UseProjectProgressReturn {
  const [progress, setProgress] = useState<number>(0)
  const [status, setStatus] = useState<string | null>(null)
  const [exportUrl, setExportUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)
  
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!enabled || !projectId || eventSourceRef.current) {
      return
    }

    try {
      const eventSource = new EventSource(`/api/projects/${projectId}/progress`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log(`SSE connected for project ${projectId}`)
        reconnectAttemptsRef.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          const data: ProjectProgress = JSON.parse(event.data)
          
          // Update local state
          setProgress(data.progress || 0)
          setStatus(data.status || null)
          setExportUrl(data.exportUrl || null)
          setThumbnailUrl(data.thumbnailUrl || null)
          setLastUpdate(data.timestamp)

          if (data.type === 'error') {
            setError(data.error || 'Unknown error')
            onError?.(data)
          } else {
            setError(null)
            onProgress?.(data)

            // Handle completion
            if (data.status === 'COMPLETED') {
              onComplete?.(data)
              disconnect() // Close connection on completion
            } else if (data.status === 'FAILED') {
              setError('Processing failed')
              onError?.(data)
              disconnect() // Close connection on failure
            }
          }
        } catch (parseError) {
          console.error('Failed to parse SSE data:', parseError)
          setError('Failed to parse progress data')
        }
      }

      eventSource.onerror = (event) => {
        console.error('SSE error:', event)
        eventSource.close()
        eventSourceRef.current = null

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, delay)
        } else {
          setError('Connection lost - please refresh the page')
        }
      }
    } catch (error) {
      console.error('Failed to create EventSource:', error)
      setError('Failed to connect to progress updates')
    }
  }, [enabled, projectId, onProgress, onComplete, onError, disconnect])

  const reconnect = useCallback(() => {
    disconnect()
    reconnectAttemptsRef.current = 0
    setError(null)
    connect()
  }, [disconnect, connect])

  // Connect on mount and when dependencies change
  useEffect(() => {
    if (enabled && projectId) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, projectId, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  // Derived state
  const isProcessing = status === 'PROCESSING'
  const isCompleted = status === 'COMPLETED'
  const isFailed = status === 'FAILED'

  return {
    progress,
    status,
    isProcessing,
    isCompleted,
    isFailed,
    exportUrl,
    thumbnailUrl,
    error,
    lastUpdate,
    disconnect,
    reconnect,
  }
}

// Progress bar component helper
export function getProgressVariant(status: string | null) {
  switch (status) {
    case 'PROCESSING':
      return 'default'
    case 'COMPLETED':
      return 'success'
    case 'FAILED':
      return 'destructive'
    default:
      return 'default'
  }
}

// Progress message helper
export function getProgressMessage(status: string | null, progress: number) {
  switch (status) {
    case 'DRAFT':
      return 'Ready to process'
    case 'PROCESSING':
      if (progress < 20) return 'Initializing...'
      if (progress < 40) return 'Generating script...'
      if (progress < 60) return 'Creating voiceover...'
      if (progress < 80) return 'Selecting assets...'
      if (progress < 95) return 'Composing video...'
      return 'Finalizing...'
    case 'COMPLETED':
      return 'Processing complete!'
    case 'FAILED':
      return 'Processing failed'
    default:
      return 'Unknown status'
  }
}