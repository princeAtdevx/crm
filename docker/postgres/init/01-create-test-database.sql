-- Runs once, when the data volume is first initialised (see compose.yml).
-- `pnpm db:reset` is the only way to re-run it.
--
-- The repo-root .env.test points every suite at this database so that a test
-- run cannot truncate the one you have been clicking around in all morning.
-- POSTGRES_DB creates `crm`; this adds its throwaway twin.
--
-- No IF NOT EXISTS for CREATE DATABASE in Postgres, and none is needed: this
-- only ever runs against an empty cluster.
CREATE DATABASE crm_test;
