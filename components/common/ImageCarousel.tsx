'use client';
import { useState } from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export default function ImageCarousel({ images, initialIndex = 0, open, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/static')) return `http://localhost:8000${path}`;
    return `http://localhost:8000/static/${path}`;
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', width: '90vw', maxWidth: 1000, bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={getImageUrl(images[currentIndex])}
              alt={`Photo ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </AnimatePresence>
          
          {images.length > 1 && (
            <>
              <IconButton
                onClick={prevImage}
                sx={{ position: 'absolute', left: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={nextImage}
                sx={{ position: 'absolute', right: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>
        
        <Box sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.8)', color: '#fff' }}>
          <Typography variant="body2">{currentIndex + 1} / {images.length}</Typography>
        </Box>
      </Box>
    </Modal>
  );
}