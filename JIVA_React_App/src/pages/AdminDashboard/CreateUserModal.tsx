import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import { apiUrl } from '../../config';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/admin/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, role })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create user');
      
      // Reset form and close
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      onUserCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#1A212B' }}>Create New Patient</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
        
        <TextField
          autoFocus
          margin="dense"
          label="Full Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Temporary Password"
          type="text"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="role-select-label">Account Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Account Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="user">Patient (User)</MenuItem>
            <MenuItem value="admin">Admin (Staff)</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ backgroundColor: '#256111', '&:hover': { backgroundColor: '#1A4D0A' } }}>
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;
