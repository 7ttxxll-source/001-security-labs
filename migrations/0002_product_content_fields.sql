-- Reserved for safe forward-compatible content expansion.
-- Keeping a separate migration establishes the versioned migration workflow from V4.3 onward.
CREATE INDEX IF NOT EXISTS idx_products_type_status ON products(product_type, status);
