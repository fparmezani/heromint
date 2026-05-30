ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_package_type_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_package_type_check
  CHECK (package_type IN ('individual', 'premium', 'completo', 'futebol-familia'));
