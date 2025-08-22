import sqlite3

DB_PATH = "instance/app.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# -------- Contacts --------
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


# -------- Check-ins --------
def insert_checkin(uid, date, answers_json):
    conn = get_connection()
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO check_ins (uid, date, answers) VALUES (?, ?, ?)",
              (uid, date, answers_json))
    conn.commit()
    conn.close()

def get_checkins(uid):
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM check_ins WHERE uid = ? ORDER BY date DESC", (uid,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]


# -------- Init tables --------
def init_db():
    conn = get_connection()
    c = conn.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL
    )""")

    c.execute("""CREATE TABLE IF NOT EXISTS check_ins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid TEXT NOT NULL,
        date TEXT NOT NULL,
        answers TEXT,
        UNIQUE(uid, date)
    )""")

    conn.commit()
    conn.close()