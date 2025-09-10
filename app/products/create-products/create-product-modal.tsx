import React, { useEffect, useState } from 'react';
import { getCategories } from '../../common/utill/fetch';
import { CircularProgress, Alert, AlertColor, Box } from '@mui/material';

interface Category {
  id: number;
  name: string;
}

const CreateProductModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error instanceof Error ? error.message : "Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  return (
    <div>
      {loading && <CircularProgress />}
      {error && (
        <Box sx={{ color: 'error.main', mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          {error}
        </Box>
      )}
      {categories.length > 0 && (
        <div>
          {/* Render your component content here */}
        </div>
      )}
    </div>
  );
};

export default CreateProductModal; 