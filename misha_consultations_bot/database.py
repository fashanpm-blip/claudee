import sqlite3
from contextlib import closing
from datetime import datetime
from typing import Optional

DB_PATH = "bookings.db"


def init_db() -> None:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                username TEXT,
                full_name TEXT NOT NULL,
                contact TEXT NOT NULL,
                service TEXT NOT NULL,
                concern TEXT NOT NULL,
                preferred_time TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def save_booking(
    user_id: int,
    username: Optional[str],
    full_name: str,
    contact: str,
    service: str,
    concern: str,
    preferred_time: str,
) -> int:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        cur = conn.execute(
            """
            INSERT INTO bookings
                (user_id, username, full_name, contact, service, concern, preferred_time, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                username,
                full_name,
                contact,
                service,
                concern,
                preferred_time,
                datetime.now().isoformat(timespec="seconds"),
            ),
        )
        conn.commit()
        return cur.lastrowid
