// src/components/common/FileUpload.tsx
'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => Promise<void>;
  onDelete?: (fileId: string) => void;
  uploadedFiles?: UploadedFile[];
  label?: string;
  multiple?: boolean;
}

export default function FileUpload({
  accept = 'image/*,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  onUpload,
  onDelete,
  uploadedFiles = [],
  label = 'Déposer les fichiers ici',
  multiple = true
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (files: File[]): string | null => {
    if (uploadedFiles.length + files.length > maxFiles) {
      return `Maximum ${maxFiles} fichiers autorisés`;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        return `Le fichier ${file.name} dépasse la taille maximum de ${formatFileSize(maxSize)}`;
      }

      const acceptedTypes = accept.split(',');
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isAccepted = acceptedTypes.some(type => {
        if (type.includes('*')) return true;
        if (type.startsWith('.')) return type.toLowerCase() === fileExtension;
        return file.type.match(type);
      });

      if (!isAccepted) {
        return `Le type de fichier ${file.name} n'est pas accepté`;
      }
    }

    return null;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validationError = validateFiles(fileArray);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    await onUpload(fileArray);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    await handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderStyle: 'dashed',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body1" gutterBottom>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {`${accept.split(',').join(', ')} - Max ${formatFileSize(maxSize)} par fichier`}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <List sx={{ mt: 2 }}>
          {uploadedFiles.map((file) => (
            <ListItem key={file.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
              <ListItemIcon>
                {file.status === 'completed' ? (
                  <CheckCircleIcon color="success" />
                ) : file.status === 'error' ? (
                  <ErrorIcon color="error" />
                ) : (
                  <FileIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  file.status === 'uploading' ? (
                    <LinearProgress 
                      variant="determinate" 
                      value={file.progress} 
                      sx={{ mt: 1 }} 
                    />
                  ) : file.status === 'error' ? (
                    <Typography variant="caption" color="error">
                      {file.error}
                    </Typography>
                  ) : (
                    formatFileSize(file.size)
                  )
                }
              />
              {onDelete && (
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    size="small"
                    onClick={() => onDelete(file.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}