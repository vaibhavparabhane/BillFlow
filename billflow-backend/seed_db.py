"""
seed_db.py

Populates the database with test data for Swagger / manual API testing.
Run from the project root:

    python seed_db.py

Safe to re-run — skips users that already exist.
Prints a ready-to-use credential table at the end.
"""

import asyncio
import sys

from sqlalchemy import select

# ---------------------------------------------------------------------------
# Seed data — all test accounts defined here, nowhere else
# ---------------------------------------------------------------------------

SEED_USERS = [
    {
        "name": "Admin User",
        "email": "admin@billops.dev",
        "phone": "9876543210",
        "password": "Admin@1234",
        "business_name": "BillOps HQ",
        "gstin": "22AAAAA0000A1Z5",
        "address": "123 Main Street, Mumbai, MH 400001",
        "is_active": True,
        "is_email_verified": True,
    },
    {
        "name": "Test User",
        "email": "test@billops.dev",
        "phone": "9123456780",
        "password": "Test@1234",
        "business_name": "Test Traders",
        "gstin": None,
        "address": None,
        "is_active": True,
        "is_email_verified": False,
    },
    {
        "name": "Inactive User",
        "email": "inactive@billops.dev",
        "phone": "9000000001",
        "password": "Inactive@1234",
        "business_name": "Closed Shop",
        "gstin": None,
        "address": None,
        "is_active": False,
        "is_email_verified": False,
    },
]


async def seed() -> None:
    # Import here so .env is loaded before any app module resolves settings
    from app.core.security import hash_password
    from app.db.base import Base, engine, AsyncSessionLocal
    from app.models.user import User  # noqa: F401 — registers table

    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        created, skipped = 0, 0

        for seed_data in SEED_USERS:
            result = await db.execute(select(User).where(User.email == seed_data["email"]))
            if result.scalar_one_or_none():
                skipped += 1
                continue

            user = User(
                name=seed_data["name"],
                email=seed_data["email"],
                phone=seed_data["phone"],
                password_hash=hash_password(seed_data["password"]),
                business_name=seed_data["business_name"],
                gstin=seed_data["gstin"],
                address=seed_data["address"],
                is_active=seed_data["is_active"],
                is_email_verified=seed_data["is_email_verified"],
            )
            db.add(user)
            created += 1

        await db.commit()

    # ---------------------------------------------------------------------------
    # Print credential table
    # ---------------------------------------------------------------------------
    print("\n" + "=" * 64)
    print(f"  Seed complete -- {created} created, {skipped} skipped")
    print("=" * 64)
    print(f"  {'Scenario':<20} {'Email':<28} {'Password'}")
    print("-" * 64)
    for u in SEED_USERS:
        status = "active" if u["is_active"] else "inactive"
        verified = "verified" if u["is_email_verified"] else "unverified"
        scenario = f"{status}/{verified}"
        print(f"  {scenario:<20} {u['email']:<28} {u['password']}")
    print("=" * 64)
    print("\n  Swagger UI  -> http://localhost:8000/api/docs")
    print("  Use POST /api/auth/login -> copy token -> Authorize (top right)\n")


if __name__ == "__main__":
    try:
        asyncio.run(seed())
    except Exception as exc:
        print(f"\n[ERROR] Seed failed: {exc}", file=sys.stderr)
        sys.exit(1)
