
import React from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center justify-end mb-2">
      <div className="bg-[#333333] rounded-lg flex overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-investment-gold text-black' : 'text-gray-400'}`}
          onClick={() => onViewChange('grid')}
        >
          <Grid size={18} className="mr-1" />
          Grid
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 ${viewMode === 'list' ? 'bg-investment-gold text-black' : 'text-gray-400'}`}
          onClick={() => onViewChange('list')}
        >
          <List size={18} className="mr-1" />
          List
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;
