import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fefcf8;
  border: 3px solid #d4c5a9;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  font-family: 'Kalam', cursive;
  transform: rotate(-0.5deg);
`;

const ModalTitle = styled.h2`
  font-family: 'Special Elite', monospace;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  transform: rotate(0.5deg);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #3498db;
  border-radius: 6px;
  font-family: 'Kalam', cursive;
  font-size: 16px;
  margin-bottom: 20px;
  background: #fff;
  color: #2c3e50;
  transform: rotate(0.3deg);
  
  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
  
  &::placeholder {
    color: #95a5a6;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: 2px solid ${props => props.primary ? '#27ae60' : '#e74c3c'};
  background: #fff;
  color: ${props => props.primary ? '#27ae60' : '#e74c3c'};
  border-radius: 6px;
  font-family: 'Kalam', cursive;
  font-size: 14px;
  cursor: pointer;
  transform: rotate(${props => props.rotation || 0}deg);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? '#27ae60' : '#e74c3c'};
    color: white;
    transform: rotate(${props => props.rotation || 0}deg) scale(1.05);
  }
`;

function AddCardModal({ onClose, onAdd }) {
  const [cardName, setCardName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardName.trim()) {
      onAdd(cardName.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Add New Credit Card</ModalTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter card name (e.g., Chase Sapphire)"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <ButtonContainer>
            <Button 
              type="button" 
              onClick={onClose}
              rotation={-0.5}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              primary
              rotation={0.5}
              disabled={!cardName.trim()}
            >
              Add Card
            </Button>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddCardModal; 