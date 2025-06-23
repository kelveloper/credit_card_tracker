import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import AddCardModal from './components/AddCardModal';
import DebtModal from './components/DebtModal';

const NotebookContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #f9f7f4 0%,
    #f4f2ed 100%
  );
  background-image: 
    repeating-linear-gradient(
      transparent 0px,
      transparent 31px,
      #e8e3d8 31px,
      #e8e3d8 32px
    );
  padding: 40px 20px;
  font-family: 'Kalam', cursive;
`;

const NotebookPage = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fefcf8;
  border: 2px solid #d4c5a9;
  border-radius: 8px;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  padding: 60px 80px 80px 120px;
  min-height: 700px;
  
  &::before {
    content: '';
    position: absolute;
    left: 80px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #ff6b6b;
    opacity: 0.6;
  }
`;

const DateHeader = styled.h1`
  position: absolute;
  top: 20px;
  right: 80px;
  font-family: 'Special Elite', monospace;
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
  transform: rotate(-1deg);
`;

const CardList = styled.div`
  margin-top: 20px;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 10px 0;
  border-bottom: 1px dotted #d4c5a9;
  transform: rotate(${props => props.rotation || 0}deg);
`;

const CardName = styled.span`
  font-size: 18px;
  color: #2c3e50;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const CardNameInput = styled.input`
  font-size: 18px;
  color: #2c3e50;
  font-weight: 400;
  flex: 1;
  border: 2px solid #3498db;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: 'Kalam', cursive;
  background: #fff;
  
  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
`;

const CardBalance = styled.span`
  font-size: 20px;
  color: ${props => props.amount > 0 ? '#e74c3c' : '#27ae60'};
  font-weight: 700;
  margin-right: 20px;
  min-width: 120px;
  text-align: right;
`;

const ActionButton = styled.button`
  background: #fff;
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0 4px;
  font-family: 'Kalam', cursive;
  font-size: 14px;
  color: #3498db;
  cursor: pointer;
  transform: rotate(${props => props.rotation || 0}deg);
  transition: all 0.2s ease;
  
  &:hover {
    background: #3498db;
    color: white;
    transform: rotate(${props => props.rotation || 0}deg) scale(1.05);
  }
`;

const AddCardButton = styled.button`
  background: #fff;
  border: 2px dashed #95a5a6;
  border-radius: 8px;
  padding: 15px 20px;
  font-family: 'Kalam', cursive;
  font-size: 16px;
  color: #95a5a6;
  cursor: pointer;
  width: 100%;
  margin: 20px 0;
  transform: rotate(-0.5deg);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
    transform: rotate(-0.5deg) scale(1.02);
  }
`;

const TotalSection = styled.div`
  border-top: 3px double #2c3e50;
  padding-top: 15px;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const TotalAmount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  font-family: 'Special Elite', monospace;
  transform: rotate(0.5deg);
`;

const LastUpdated = styled.div`
  text-align: right;
  font-size: 12px;
  color: #7f8c8d;
  font-family: 'Special Elite', monospace;
  transform: rotate(1deg);
  margin-top: 10px;
`;

function App() {
  const [cards, setCards] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [debtModalType, setDebtModalType] = useState('add'); // 'add' or 'pay'
  const [editingCardName, setEditingCardName] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const loadLedgerData = async () => {
    try {
      const response = await axios.get(`/api/ledger/${currentYear}/${currentMonth}`);
      setCards(response.data.cards || []);
      if (response.data.cards && response.data.cards.length > 0) {
        setLastUpdated(response.data.cards[0].last_updated);
      }
    } catch (error) {
      console.error('Error loading ledger data:', error);
      setCards([]);
    }
  };

  const saveLedgerData = async (updatedCards) => {
    try {
      const response = await axios.post(`/api/ledger/${currentYear}/${currentMonth}`, {
        cards: updatedCards
      });
      setLastUpdated(response.data.last_updated);
      return true;
    } catch (error) {
      console.error('Error saving ledger data:', error);
      return false;
    }
  };

  useEffect(() => {
    loadLedgerData();
  }, [currentMonth, currentYear]);

  const handleAddCard = async (cardName) => {
    const newCard = {
      card_name: cardName,
      balance: 0
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    await saveLedgerData(updatedCards);
    setShowAddCardModal(false);
  };

  const handleDebtAction = async (amount) => {
    const updatedCards = cards.map(card => {
      if (card.card_name === selectedCard.card_name) {
        const newBalance = debtModalType === 'add' 
          ? card.balance + amount 
          : Math.max(0, card.balance - amount);
        return { ...card, balance: newBalance };
      }
      return card;
    });
    
    setCards(updatedCards);
    await saveLedgerData(updatedCards);
    setShowDebtModal(false);
    setSelectedCard(null);
  };

  const openDebtModal = (card, type) => {
    setSelectedCard(card);
    setDebtModalType(type);
    setShowDebtModal(true);
  };

  const handleEditCardName = (card) => {
    setEditingCardName(card.card_name);
    setEditingValue(card.card_name);
  };

  const handleSaveCardName = async (oldName) => {
    if (editingValue.trim() && editingValue.trim() !== oldName) {
      try {
        const response = await axios.put(`/api/ledger/${currentYear}/${currentMonth}/card`, {
          old_name: oldName,
          new_name: editingValue.trim()
        });
        
        if (response.data.success) {
          // Update the local state
          const updatedCards = cards.map(card => 
            card.card_name === oldName 
              ? { ...card, card_name: editingValue.trim() }
              : card
          );
          setCards(updatedCards);
          setLastUpdated(response.data.last_updated);
        }
      } catch (error) {
        console.error('Error updating card name:', error);
        alert(error.response?.data?.error || 'Failed to update card name');
      }
    }
    setEditingCardName(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingCardName(null);
    setEditingValue('');
  };

  const totalDebt = cards.reduce((sum, card) => sum + card.balance, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Random rotation for handwritten effect
  const getRotation = (index) => (Math.sin(index) * 0.8);

  return (
    <NotebookContainer>
      <NotebookPage>
        <DateHeader>
          {monthNames[currentMonth - 1]} {currentYear}
        </DateHeader>
        
        <CardList>
          {cards.map((card, index) => (
            <CardRow key={`${card.card_name}-${index}`} rotation={getRotation(index)}>
              {editingCardName === card.card_name ? (
                <CardNameInput
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => handleSaveCardName(card.card_name)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveCardName(card.card_name);
                    } else if (e.key === 'Escape') {
                      handleCancelEdit();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <CardName onClick={() => handleEditCardName(card)}>
                  {card.card_name}
                </CardName>
              )}
              <CardBalance amount={card.balance}>
                {formatCurrency(card.balance)}
              </CardBalance>
              <div>
                <ActionButton 
                  onClick={() => openDebtModal(card, 'add')}
                  rotation={getRotation(index + 10)}
                >
                  Add Debt
                </ActionButton>
                <ActionButton 
                  onClick={() => openDebtModal(card, 'pay')}
                  rotation={getRotation(index + 20)}
                >
                  Pay Off
                </ActionButton>
              </div>
            </CardRow>
          ))}
          
          <AddCardButton onClick={() => setShowAddCardModal(true)}>
            + Add New Card
          </AddCardButton>
        </CardList>

        <TotalSection>
          <TotalAmount>
            Total Owed: {formatCurrency(totalDebt)}
          </TotalAmount>
        </TotalSection>

        {lastUpdated && (
          <LastUpdated>
            Last updated: {formatTimestamp(lastUpdated)}
          </LastUpdated>
        )}
      </NotebookPage>

      {showAddCardModal && (
        <AddCardModal
          onClose={() => setShowAddCardModal(false)}
          onAdd={handleAddCard}
        />
      )}

      {showDebtModal && (
        <DebtModal
          card={selectedCard}
          type={debtModalType}
          onClose={() => setShowDebtModal(false)}
          onSubmit={handleDebtAction}
        />
      )}
    </NotebookContainer>
  );
}

export default App; 