from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE = 'ledger.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize the database with the required tables"""
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER DEFAULT 1,
            month INTEGER NOT NULL,
            year INTEGER NOT NULL,
            card_name TEXT NOT NULL,
            balance REAL NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, month, year, card_name)
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/ledger/<int:year>/<int:month>', methods=['GET'])
def get_ledger(year, month):
    """Get all credit card data for a specific month and year"""
    try:
        conn = get_db_connection()
        cursor = conn.execute(
            'SELECT card_name, balance, last_updated FROM ledger WHERE year = ? AND month = ? AND user_id = 1',
            (year, month)
        )
        rows = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        cards = []
        for row in rows:
            cards.append({
                'card_name': row['card_name'],
                'balance': row['balance'],
                'last_updated': row['last_updated']
            })
        
        return jsonify({
            'cards': cards,
            'month': month,
            'year': year
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ledger/<int:year>/<int:month>', methods=['POST'])
def save_ledger(year, month):
    """Save or update credit card data for a specific month and year"""
    try:
        data = request.get_json()
        cards = data.get('cards', [])
        
        conn = get_db_connection()
        
        # Delete existing entries for this month/year
        conn.execute(
            'DELETE FROM ledger WHERE year = ? AND month = ? AND user_id = 1',
            (year, month)
        )
        
        # Insert new entries
        current_time = datetime.now().isoformat()
        for card in cards:
            conn.execute(
                'INSERT INTO ledger (user_id, month, year, card_name, balance, last_updated) VALUES (?, ?, ?, ?, ?, ?)',
                (1, month, year, card['card_name'], card['balance'], current_time)
            )
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'Ledger saved for {year}-{month:02d}',
            'last_updated': current_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ledger/<int:year>/<int:month>/card', methods=['PUT'])
def update_card_name(year, month):
    """Update a credit card name for a specific month and year"""
    try:
        data = request.get_json()
        old_name = data.get('old_name')
        new_name = data.get('new_name')
        
        if not old_name or not new_name:
            return jsonify({'error': 'Both old_name and new_name are required'}), 400
        
        conn = get_db_connection()
        
        # Check if new name already exists for this month/year
        existing = conn.execute(
            'SELECT id FROM ledger WHERE year = ? AND month = ? AND user_id = 1 AND card_name = ?',
            (year, month, new_name)
        ).fetchone()
        
        if existing:
            conn.close()
            return jsonify({'error': 'A card with this name already exists'}), 400
        
        # Update the card name
        cursor = conn.execute(
            'UPDATE ledger SET card_name = ?, last_updated = ? WHERE year = ? AND month = ? AND user_id = 1 AND card_name = ?',
            (new_name, datetime.now().isoformat(), year, month, old_name)
        )
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Card not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'Card name updated from "{old_name}" to "{new_name}"',
            'last_updated': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    # Initialize database on startup
    init_database()
    print("Starting The Ledger backend server...")
    print("Database initialized successfully")
    app.run(debug=True, host='0.0.0.0', port=5000) 