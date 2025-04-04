
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingSubmenu from './fab/FloatingSubmenu';
import MainActionButton from './fab/MainActionButton';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-1/2 transform translate-x-1/2 z-50">
      <FloatingSubmenu isOpen={isOpen} onNavigate={handleNavigate} />
      <MainActionButton isOpen={isOpen} onClick={toggleMenu} />
    </div>
  );
};

export default FloatingActionButton;
