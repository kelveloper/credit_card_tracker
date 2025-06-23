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
  transform: rotate(0.5deg);
`;

const ModalTitle = styled.h2`
  font-family: 'Special Elite', monospace;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 20px;
  text-align: center;
  transform: rotate(-0.5deg);
`;

const CardInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transform: rotate(-0.2deg);
`;

const CardName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const CurrentBalance = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
  font-family: 'Special Elite', monospace;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.type === 'add' ? '#e74c3c' : '#27ae60'};
  border-radius: 6px;
  font-family: 'Kalam', cursive;
  font-size: 16px;
  margin-bottom: 20px;
  background: #fff;
  color: #2c3e50;
  transform: rotate(-0.3deg);
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: ${props => props.type === 'add' ? '#c0392b' : '#229954'};
    box-shadow: 0 0 5px ${props => props.type === 'add' ? 'rgba(231, 76, 60, 0.3)' : 'rgba(39, 174, 96, 0.3)'};
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
  border: 2px solid ${props => {
    if (props.primary && props.actionType === 'add') return '#e74c3c';
    if (props.primary && props.actionType === 'pay') return '#27ae60';
    return '#95a5a6';
  }};
  background: #fff;
  color: ${props => {
    if (props.primary && props.actionType === 'add') return '#e74c3c';
    if (props.primary && props.actionType === 'pay') return '#27ae60';
    return '#95a5a6';
  }};
  border-radius: 6px;
  font-family: 'Kalam', cursive;
  font-size: 14px;
  cursor: pointer;
  transform: rotate(${props => props.rotation || 0}deg);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => {
      if (props.primary && props.actionType === 'add') return '#e74c3c';
      if (props.primary && props.actionType === 'pay') return '#27ae60';
      return '#95a5a6';
    }};
    color: white;
    transform: rotate(${props => props.rotation || 0}deg) scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: #fff;
      color: #95a5a6;
      transform: rotate(${props => props.rotation || 0}deg);
    }
  }
`;

function DebtModal({ card, type, onClose, onSubmit }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isValidAmount = amount && parseFloat(amount) > 0;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>
          {type === 'add' ? 'Add Debt' : 'Make Payment'}
        </ModalTitle>
        
        <CardInfo>
          <CardName>{card?.card_name}</CardName>
          <CurrentBalance>
            Current Balance: {formatCurrency(card?.balance || 0)}
          </CurrentBalance>
        </CardInfo>
        
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder={type === 'add' ? 'Amount to add' : 'Payment amount'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            actionType={type}
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
              actionType={type}
              rotation={0.5}
              disabled={!isValidAmount}
            >
              {type === 'add' ? 'Add Debt' : 'Make Payment'}
            </Button>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default DebtModal; 