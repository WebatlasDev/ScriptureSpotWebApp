'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Menu, 
  MenuItem, 
  Chip, 
  Popper, 
  Paper, 
  Checkbox,
  Divider
} from '@mui/material';
import { 
  Sort as SortIcon, 
  FilterList as FilterIcon, 
  Clear as ClearIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@/components/ui/phosphor-icons';

interface FilterBarProps {
  availableFilters: {
    category: string;
    values: string[];
  }[];
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSortChange: (sortBy: string) => void;
}

export default function FilterBar({ availableFilters, onFilterChange, onSortChange }: FilterBarProps) {
  // Sort menu state
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  
  // Filter menu state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  // Filter selections state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  // Track if filter menu is open
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  
  // Sort menu handlers
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };
  
  const handleSortSelect = (sortBy: string) => {
    onSortChange(sortBy);
    handleSortClose();
  };
  
  // Filter menu handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setHoveredCategory(null);
    setSubMenuAnchorEl(null);
  };
  
  // Handle category hover
  const handleCategoryHover = (event: React.MouseEvent<HTMLElement>, category: string) => {
    setHoveredCategory(category);
    setSubMenuAnchorEl(event.currentTarget);
  };
  
  // Handle mouse leave from submenu
  const handleSubMenuMouseLeave = () => {
    // Small delay to prevent flickering when moving between items
    setTimeout(() => {
      if (!document.querySelector(':hover')?.closest('.filter-submenu')) {
        setHoveredCategory(null);
        setSubMenuAnchorEl(null);
      }
    }, 100);
  };
  
  // Handle checkbox change in submenu - updates in real-time
  const handleCheckboxChange = (category: string, value: string) => {
    const newFilters = { ...activeFilters };
    
    if (!newFilters[category]) {
      newFilters[category] = [];
    }
    
    // Toggle selection
    if (newFilters[category].includes(value)) {
      newFilters[category] = newFilters[category].filter(v => v !== value);
      
      // Remove empty categories
      if (newFilters[category].length === 0) {
        delete newFilters[category];
      }
    } else {
      newFilters[category] = [...newFilters[category], value];
    }
    
    // Update state and trigger parent callback
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Remove a filter chip
  const handleFilterRemove = (category: string, value: string) => {
    const newActiveFilters = { ...activeFilters };
    
    newActiveFilters[category] = newActiveFilters[category].filter(
      (filter) => filter !== value
    );
    
    if (newActiveFilters[category].length === 0) {
      delete newActiveFilters[category];
    }
    
    setActiveFilters(newActiveFilters);
    onFilterChange(newActiveFilters);
  };
  
  // Clear all filters
  const handleClearAll = () => {
    setActiveFilters({});
    onFilterChange({});
  };
  
  // Determine if any filters are active
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  
  // Get total count of all active filters
  const totalFilterCount = Object.values(activeFilters).reduce(
    (sum, values) => sum + values.length, 
    0
  );
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
      }}
    >
      {/* Sort button */}
      <Button
        startIcon={<SortIcon />}
        onClick={handleSortClick}
        sx={{
          background: 'rgba(255, 255, 255, 0.10)',
          color: 'white',
          borderRadius: 2,
          paddingLeft: 2,
          paddingRight: 2,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        Sort
      </Button>
      
      {/* Sort menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        PaperProps={{
          sx: {
            background: '#1A1A1A',
            color: 'white',
          }
        }}
      >
        <MenuItem onClick={() => handleSortSelect('name-asc')}>Name (A-Z)</MenuItem>
        <MenuItem onClick={() => handleSortSelect('name-desc')}>Name (Z-A)</MenuItem>
        <MenuItem onClick={() => handleSortSelect('birth-year-asc')}>Birth Year (Oldest first)</MenuItem>
        <MenuItem onClick={() => handleSortSelect('birth-year-desc')}>Birth Year (Newest first)</MenuItem>
      </Menu>
      
      {/* Filter button - with count of active filters */}
      <Button
        startIcon={<FilterIcon />}
        onClick={handleFilterClick}
        sx={{
          background: 'rgba(255, 255, 255, 0.10)',
          color: 'white',
          borderRadius: 2,
          paddingLeft: 2,
          paddingRight: 2,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        Filter {totalFilterCount > 0 && `(${totalFilterCount})`}
      </Button>
      
      {/* Primary filter menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={isFilterMenuOpen}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            background: '#1A1A1A',
            color: 'white',
          }
        }}
      >
        {availableFilters.map((filter) => {
          const filterCount = activeFilters[filter.category]?.length || 0;
          return (
            <MenuItem 
              key={filter.category}
              onMouseEnter={(e) => handleCategoryHover(e, filter.category)}
              sx={{
                backgroundColor: hoveredCategory === filter.category ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Typography>{filter.category}</Typography>
              
              {/* Count indicator with transparent white background - always reserved space */}
              <Box sx={{ 
                ml: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                {/* Always render the counter with consistent width, but toggle visibility */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    background: filterCount > 0 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 500,
                    marginLeft: 1,
                    // Hide counter text but maintain space when no filters
                    opacity: filterCount > 0 ? 1 : 0,
                    // Keep the space reserved for layout stability
                    visibility: 'visible',
                  }}
                >
                  {filterCount > 0 ? filterCount : '0'}
                </Box>
                <ArrowRightIcon fontSize="small" />
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
      
      {/* Submenu for filter values */}
      <Popper
        open={Boolean(hoveredCategory && subMenuAnchorEl)}
        anchorEl={subMenuAnchorEl}
        placement="right-start"
        className="filter-submenu"
        sx={{ zIndex: 1301 }} // Higher than the main menu
      >
        <Paper 
          sx={{ 
            background: '#1A1A1A', 
            color: 'white',
            minWidth: 200,
            maxHeight: 300,
            overflowY: 'auto'
          }}
          onMouseLeave={handleSubMenuMouseLeave}
        >
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', p: 1 }}>
              {hoveredCategory}
            </Typography>
            
            <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)' }} />
            
            {hoveredCategory && availableFilters
              .find(f => f.category === hoveredCategory)
              ?.values.map((value) => (
                <MenuItem 
                  key={value}
                  dense
                  onClick={() => handleCheckboxChange(hoveredCategory, value)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Checkbox 
                    checked={activeFilters[hoveredCategory]?.includes(value) || false}
                    size="small"
                    sx={{ 
                      p: 0.5, 
                      mr: 1,
                      color: 'rgba(255, 255, 255, 0.5)',
                      '&.Mui-checked': {
                        color: 'white',
                      }
                    }}
                  />
                  <Typography variant="body2">{value}</Typography>
                </MenuItem>
              ))}
          </Box>
        </Paper>
      </Popper>
      
      {/* Active filter chips - showing just the value */}
      {Object.entries(activeFilters).map(([category, values]) =>
        values.map((value) => (
          <Chip
            key={`${category}-${value}`}
            label={value}
            onDelete={() => handleFilterRemove(category, value)}
            deleteIcon={<ClearIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiChip-deleteIcon': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        ))
      )}
      
      {/* Clear all button (only shown when filters are active) */}
      {hasActiveFilters && (
        <Button
          onClick={handleClearAll}
          sx={{
            marginLeft: 'auto',
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
            },
          }}
        >
          Clear All
        </Button>
      )}
    </Box>
  );
}