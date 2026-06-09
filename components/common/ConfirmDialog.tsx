// 'use client';
// import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

// interface Props {
//   open: boolean;
//   title: string;
//   message: string;
//   onConfirm: () => void;
//   onClose: () => void;
// }

// export default function ConfirmDialog({ open, title, message, onConfirm, onClose }: Props) {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent>
//         <DialogContentText>{message}</DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Annuler</Button>
//         <Button onClick={onConfirm} color="error" variant="contained">Supprimer</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// src/components/common/ConfirmDialog.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'error' | 'warning' | 'info';
  extraContent?: React.ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  severity = 'warning',
  extraContent
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        {extraContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button 
          onClick={onConfirm} 
          color={severity} 
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}