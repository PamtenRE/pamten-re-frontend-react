'use client';
import React, { createContext, useContext, useState } from 'react';

type ModalContextType = {
  isOpen: boolean;
  openModal: (mode?: 'login' | 'signup') => void;
  closeModal: () => void;
  initialMode: 'login' | 'signup';
};

export const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  initialMode: 'login',
});

export const LoginModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'login' | 'signup'>('login');

  const openModal = (mode: 'login' | 'signup' = 'login') => {
    setInitialMode(mode);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, initialMode }}>
      {children}
    </ModalContext.Provider>
  );
};

// Optional helper hook
export const useLoginModal = () => useContext(ModalContext);
