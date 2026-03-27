'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function ResumeUpload({ onFileSelect, disabled = false }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        onFileSelect(selectedFile)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        onFileSelect(selectedFile)
      }
    }
  }

  const handleRemove = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-all',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          {file ? (
            <>
              <CheckCircle className="w-12 h-12 text-primary" />
              <div>
                <p className="font-semibold text-foreground">File uploaded successfully</p>
                <p className="text-sm text-muted-foreground">{file.name}</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground" />
              <div>
                <p className="font-semibold text-foreground">
                  Drag and drop your resume
                </p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">PDF only (Max 10MB)</p>
            </>
          )}
        </div>

        {!disabled && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-lg opacity-0 cursor-pointer"
          />
        )}
      </div>

      {file && (
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-2">
            <File className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate">{file.name}</span>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-muted rounded transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  )
}
