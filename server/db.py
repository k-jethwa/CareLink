import sqlite3
import json
from datetime import datetime

DB_PATH = "instance/app.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def insert_contact(uid, name, email):
    conn = get_connection()
    c = conn.cursor()
    c.execute("INSERT INTO contacts (uid, name, email) VALUES (?, ?, ?)", (uid, name, email))
    conn.commit()
    conn.close()

def get_contacts(uid):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM contacts WHERE uid = ?", (uid,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def insert_checkin(uid, date, mood, color, answers_json, hours_of_sleep=None):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT OR REPLACE INTO check_ins (uid, date, mood, color, answers, hours_of_sleep, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (uid, date, mood, color, answers_json, hours_of_sleep, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_checkins(uid):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM check_ins 
        WHERE uid = ? 
        ORDER BY date DESC
    """, (uid,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_user_checkins(uid):
    """Get user checkins in a format optimized for the frontend calendar"""
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT date, mood, color, hours_of_sleep, answers, created_at
        FROM check_ins 
        WHERE uid = ? 
        ORDER BY date DESC
    """, (uid,))
    
    rows = c.fetchall()
    conn.close()
    
    # Use the row factory to convert to dict automatically
    checkins = []
    for row in rows:
        checkin = dict(row)
        
        # Ensure all expected fields are present with defaults
        checkin.setdefault('date', '')
        checkin.setdefault('mood', 'neutral')
        checkin.setdefault('color', '#FFD3B6')
        checkin.setdefault('hours_of_sleep', None)
        checkin.setdefault('answers', '{}')
        
        # Parse answers JSON if it's a string
        if isinstance(checkin['answers'], str):
            try:
                checkin['answers'] = json.loads(checkin['answers'])
            except json.JSONDecodeError:
                checkin['answers'] = {}
        
        checkins.append(checkin)
    
    return checkins

def get_recent_sad_checkins(uid, days=7):
    """Get recent sad check-ins for emergency email trigger"""
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM check_ins 
        WHERE uid = ? AND mood = 'sad' 
        AND date >= date('now', '-{} days')
        ORDER BY date DESC
    """.format(days), (uid,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_checkin_count_by_mood(uid, mood, days=7):
    """Get count of check-ins with specific mood in recent days"""
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        SELECT COUNT(*) as count FROM check_ins 
        WHERE uid = ? AND mood = ? 
        AND date >= date('now', '-{} days')
    """.format(days), (uid, mood))
    result = c.fetchone()
    conn.close()
    return result['count'] if result else 0


# -------- Init tables --------
def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Create contacts table
    c.execute("""CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )""")

    # Create check_ins table with mood and color
    c.execute("""CREATE TABLE IF NOT EXISTS check_ins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL,
        date TEXT NOT NULL,
        mood TEXT NOT NULL,
        color TEXT NOT NULL,
        answers TEXT,
        hours_of_sleep TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(uid, date)
    )""")

    # Check if existing check_ins table needs to be updated
    c.execute("PRAGMA table_info(check_ins)")
    columns = [column[1] for column in c.fetchall()]
    
    # Add missing columns if they don't exist
    if 'mood' not in columns:
        print("Adding 'mood' column to check_ins table...")
        c.execute("ALTER TABLE check_ins ADD COLUMN mood TEXT DEFAULT 'neutral'")
    
    if 'color' not in columns:
        print("Adding 'color' column to check_ins table...")
        c.execute("ALTER TABLE check_ins ADD COLUMN color TEXT DEFAULT '#FFD3B6'")
    
    if 'hours_of_sleep' not in columns:
        print("Adding 'hours_of_sleep' column to check_ins table...")
        c.execute("ALTER TABLE check_ins ADD COLUMN hours_of_sleep TEXT")
    
    if 'created_at' not in columns:
        print("Adding 'created_at' column to check_ins table...")
        c.execute("ALTER TABLE check_ins ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP")

    conn.commit()
    conn.close()
    print("Database initialized successfully!")


# -------- Utility functions --------
def reset_db():
    """Reset database for testing - removes all data"""
    conn = get_connection()
    c = conn.cursor()
    
    c.execute("DROP TABLE IF EXISTS contacts")
    c.execute("DROP TABLE IF EXISTS check_ins")
    
    conn.commit()
    conn.close()
    
    init_db()
    print("Database reset successfully!")

def migrate_existing_data():
    """Migrate existing data to new schema if needed"""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        # Check if there are existing check-ins without mood/color
        c.execute("SELECT COUNT(*) FROM check_ins WHERE mood IS NULL OR color IS NULL")
        count = c.fetchone()[0]
        
        if count > 0:
            print(f"Migrating {count} existing check-ins to new schema...")
            
            # Update existing records with default values and hex colors
            c.execute("""
                UPDATE check_ins 
                SET mood = COALESCE(mood, 'neutral'),
                    color = CASE 
                        WHEN COALESCE(mood, 'neutral') = 'happy' THEN '#A8E6CF'
                        WHEN COALESCE(mood, 'neutral') = 'sad' THEN '#FF8B94'
                        WHEN COALESCE(mood, 'neutral') = 'neutral' THEN '#FFD3B6'
                        ELSE '#FFD3B6'
                    END,
                    created_at = COALESCE(created_at, CURRENT_TIMESTAMP)
                WHERE mood IS NULL OR color IS NULL
            """)
            
            conn.commit()
            print("Data migration completed successfully!")
        else:
            print("No data migration needed.")
            
    except Exception as e:
        print(f"Migration error: {e}")
        conn.rollback()
    finally:
        conn.close()