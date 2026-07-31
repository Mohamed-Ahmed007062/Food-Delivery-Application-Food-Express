import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-muted/40 py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} FoodExpress Platform. Built with MERN Stack & TypeScript.</p>
      </div>
    </footer>
  );
};
