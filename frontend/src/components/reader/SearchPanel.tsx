'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Search,
  Close,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Clear,
} from '@/components/ui/phosphor-icons';

interface SearchResult {
  id: string;
  sentenceId: string;
  text: string;
  context: string;
  index: number;
}

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onResultSelect: (sentenceId: string) => void;
}

export default function SearchPanel({
  open,
  onClose,
  searchTerm,
  onSearchChange,
  onResultSelect,
}: SearchPanelProps) {
  const theme = useTheme();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // Search through the content
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    setIsLoading(true);

    // Simulate search delay
    const searchTimeout = setTimeout(() => {
      const sentences = document.querySelectorAll('.sentence');
      const foundResults: SearchResult[] = [];

      sentences.forEach((sentence, index) => {
        const text = sentence.textContent || '';
        const sentenceId = sentence.getAttribute('data-sentence-id') || '';
        
        if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
          // Get surrounding context
          const words = text.split(' ');
          const searchIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());
          const wordIndex = text.substring(0, searchIndex).split(' ').length - 1;
          
          const contextStart = Math.max(0, wordIndex - 5);
          const contextEnd = Math.min(words.length, wordIndex + 10);
          const context = words.slice(contextStart, contextEnd).join(' ');

          foundResults.push({
            id: `result-${index}`,
            sentenceId,
            text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
            context,
            index: foundResults.length,
          });
        }
      });

      setResults(foundResults);
      setCurrentResultIndex(foundResults.length > 0 ? 0 : -1);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const handleNextResult = () => {
    if (results.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % results.length;
    setCurrentResultIndex(nextIndex);
    onResultSelect(results[nextIndex].sentenceId);
  };

  const handlePreviousResult = () => {
    if (results.length === 0) return;
    const prevIndex = currentResultIndex <= 0 ? results.length - 1 : currentResultIndex - 1;
    setCurrentResultIndex(prevIndex);
    onResultSelect(results[prevIndex].sentenceId);
  };

  const handleResultClick = (result: SearchResult) => {
    setCurrentResultIndex(result.index);
    onResultSelect(result.sentenceId);
  };

  const handleClear = () => {
    onSearchChange('');
    setResults([]);
    setCurrentResultIndex(-1);
  };

  return (
    <Collapse in={open} sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1200 }}>
      <Paper
        elevation={8}
        sx={{
          mx: { xs: 1, sm: 2, md: 4 },
          mt: 1,
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search Input */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search within chapter..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchTerm && (
                  <IconButton onClick={handleClear} size="small">
                    <Clear />
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Search Results Counter and Navigation */}
          {searchTerm && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={
                    results.length > 0
                      ? `${currentResultIndex + 1} of ${results.length} results`
                      : isLoading
                      ? 'Searching...'
                      : 'No results'
                  }
                  size="small"
                  color={results.length > 0 ? 'primary' : 'default'}
                />
              </Box>

              {results.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={handlePreviousResult}>
                    <KeyboardArrowUp />
                  </IconButton>
                  <IconButton size="small" onClick={handleNextResult}>
                    <KeyboardArrowDown />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Search Results List */}
        {results.length > 0 && (
          <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
            <List dense>
              {results.map((result) => (
                <React.Fragment key={result.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleResultClick(result)}
                      selected={result.index === currentResultIndex}
                      sx={{
                        py: 1.5,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(40, 142, 255, 0.1)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {result.text}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Result {result.index + 1}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {result.index < results.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Collapse>
  );
}