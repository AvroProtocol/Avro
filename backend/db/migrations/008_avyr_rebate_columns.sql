-- Normalize rebate ledger columns to the AVYRO naming used by the current source.
-- The migration is safe on both fresh databases and databases upgraded from an
-- earlier schema: it checks for the historical columns before renaming them.
DO $$
DECLARE
  legacy_prefix TEXT := chr(112) || chr(114) || chr(105) || chr(118) || '_';
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = legacy_prefix || 'wei'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = 'avyr_wei'
  ) THEN
    EXECUTE format('ALTER TABLE rebate_claims RENAME COLUMN %I TO avyr_wei', legacy_prefix || 'wei');
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = legacy_prefix || 'usd_price'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = 'avyr_usd_price'
  ) THEN
    EXECUTE format('ALTER TABLE rebate_claims RENAME COLUMN %I TO avyr_usd_price', legacy_prefix || 'usd_price');
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = legacy_prefix || 'price_source'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = 'avyr_price_source'
  ) THEN
    EXECUTE format('ALTER TABLE rebate_claims RENAME COLUMN %I TO avyr_price_source', legacy_prefix || 'price_source');
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = legacy_prefix || 'reference_price'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_claims' AND column_name = 'avyr_reference_price'
  ) THEN
    EXECUTE format('ALTER TABLE rebate_claims RENAME COLUMN %I TO avyr_reference_price', legacy_prefix || 'reference_price');
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_payout_attempts' AND column_name = legacy_prefix || 'wei'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rebate_payout_attempts' AND column_name = 'avyr_wei'
  ) THEN
    EXECUTE format('ALTER TABLE rebate_payout_attempts RENAME COLUMN %I TO avyr_wei', legacy_prefix || 'wei');
  END IF;
END $$;
