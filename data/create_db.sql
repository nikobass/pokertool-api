BEGIN;

-- TABLES SUPPRESSION
DROP TABLE IF EXISTS 
"user",
"structure",
"tournament",
"chip",
"distribution",
"cashprice";

CREATE TABLE IF NOT EXISTS "user" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "user_name" VARCHAR(128) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "structure" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "stage" INTEGER NOT NULL,
    "small_blind" INTEGER NOT NULL,
    "big_blind" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "tournament" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "name" VARCHAR(128) NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "location" TEXT NOT NULL,
    "nb_players" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "starting_stack" INTEGER NOT NULL,
    "buy_in" INTEGER NOT NULL,
    "cash_price" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'prévu',
    "comments" TEXT,
    "user_id" INTEGER NOT NULL REFERENCES "user" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "chip" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "color"  TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL REFERENCES "user" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "distribution" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "quantity" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL REFERENCES "tournament" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "cashprice" (
    --"id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id" serial PRIMARY KEY,
    "position" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "tournament_id" INTEGER NOT NULL REFERENCES "tournament" ("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;