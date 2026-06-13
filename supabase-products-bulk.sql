-- Fix Schema and Populated Data
-- 1. Ensure necessary columns exist (handling schema mismatches)
ALTER TABLE products ADD COLUMN IF NOT EXISTS "originalPrice" NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badges TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- 2. Bulk Insert Products (Using UUIDs for ID column)
INSERT INTO products (id, name, price, "originalPrice", image, images, category, subcategory, rating, reviews, description, in_stock, stock, badges, featured) VALUES

-- ONE PIECE
(gen_random_uuid(), 'Luffy Gear 5 Nika Figure', 12999, 15999, 'https://images.unsplash.com/photo-1621478374422-35206fa740ad?w=800&q=80', ARRAY['https://images.unsplash.com/photo-1621478374422-35206fa740ad?w=800&q=80'], 'Figurines', 'Scale Figures', 5.0, 1542, 'The ultimate Gear 5 Luffy figure, capturing the peak of his power.', true, 25, ARRAY['grail', 'bestseller'], true),
(gen_random_uuid(), 'Roronoa Zoro Enma Katana', 4500, 6000, 'https://images.unsplash.com/photo-1596522354397-6c2419082ac3?w=800&q=80', ARRAY['https://images.unsplash.com/photo-1596522354397-6c2419082ac3?w=800&q=80'], 'Accessories', 'Props', 4.8, 890, 'Full-scale steel replica of Enma.', true, 50, ARRAY['premium'], false),
(gen_random_uuid(), 'Thousand Sunny Model Kit', 3200, 3999, 'https://plus.unsplash.com/premium_photo-1664112065842-832873d32830?w=800&q=80', ARRAY['https://plus.unsplash.com/premium_photo-1664112065842-832873d32830?w=800&q=80'], 'Figurines', 'Model Kits', 4.7, 420, 'Detailed model ship kit.', true, 100, ARRAY[]::TEXT[], false),
(gen_random_uuid(), 'Trafalgar Law Hoodie', 1800, 2499, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', ARRAY['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'], 'Apparel', 'Hoodies', 4.6, 650, 'Cotton hoodie with Jolly Roger.', true, 200, ARRAY['selling-fast'], false),

-- NARUTO
(gen_random_uuid(), 'Itachi Uchiha Crow Figure', 8999, 11000, 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&q=80', ARRAY[]::TEXT[], 'Figurines', 'Scale Figures', 4.9, 2100, 'Masterpiece figure of Itachi.', true, 15, ARRAY['legendary'], true),
(gen_random_uuid(), 'Akatsuki Cloud Cloak', 2999, 3999, 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80', ARRAY[]::TEXT[], 'Apparel', 'Cosplay', 4.7, 3400, 'Premium quality Akatsuki cloak.', true, 100, ARRAY['bestseller'], false),
(gen_random_uuid(), 'Leaf Village Headband', 499, 799, 'https://images.unsplash.com/photo-1613535449480-94d3ae6479f1?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Cosplay', 4.6, 5000, 'Metal plated headband.', true, 1000, ARRAY[]::TEXT[], false),
(gen_random_uuid(), 'Naruto Frog Wallet', 399, 599, 'https://images.unsplash.com/photo-1627123424574-18bd75847587?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Wallets', 4.9, 1200, 'Cute Gama-chan coin purse.', true, 500, ARRAY[]::TEXT[], false),

-- DEMON SLAYER
(gen_random_uuid(), 'Rengoku Kyojuro Nichirin', 5500, 7000, 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Props', 4.9, 2300, 'Premium metal replica sword.', true, 40, ARRAY['premium'], true),
(gen_random_uuid(), 'Tanjiro Earrings', 299, 499, 'https://images.unsplash.com/photo-1635764703487-75e679b3cb6f?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Jewelry', 4.7, 3000, 'Hanafuda earrings.', true, 1000, ARRAY['selling-fast'], false),
(gen_random_uuid(), 'Zenitsu Agatsuma Figure', 4500, 5500, 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80', ARRAY[]::TEXT[], 'Figurines', 'Scale Figures', 4.8, 500, 'Thunder Breathing First Form.', true, 60, ARRAY[]::TEXT[], false),

-- JUJUTSU KAISEN
(gen_random_uuid(), 'Gojo Satoru Blindfold', 399, 699, 'https://images.unsplash.com/photo-1506161974108-9df599c513e6?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Cosplay', 4.7, 1500, 'Premium fabric eye mask.', true, 500, ARRAY[]::TEXT[], false),
(gen_random_uuid(), 'Sukuna Finger Prop', 899, 1200, 'https://images.unsplash.com/photo-1627844642677-9b2c89d535ae?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Props', 4.9, 300, 'Realistic replica finger.', true, 100, ARRAY[]::TEXT[], false),
(gen_random_uuid(), 'Jujutsu High Uniform', 3500, 4200, 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=800&q=80', ARRAY[]::TEXT[], 'Apparel', 'Cosplay', 4.8, 400, 'Customizable uniform.', true, 60, ARRAY[]::TEXT[], false),

-- DRAGON BALL
(gen_random_uuid(), '7 Dragon Balls Set', 3999, 4999, 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Collectibles', 4.9, 1000, 'Crystal replica balls.', true, 150, ARRAY['classic'], true),
(gen_random_uuid(), 'Goku Gi Costume', 2999, 3999, 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80', ARRAY[]::TEXT[], 'Apparel', 'Cosplay', 4.7, 800, 'Classic orange uniform.', true, 200, ARRAY[]::TEXT[], false),
(gen_random_uuid(), 'Majin Buu Plush', 1200, 1500, 'https://images.unsplash.com/photo-1586941955351-295058cb2eb5?w=800&q=80', ARRAY[]::TEXT[], 'Toys', 'Plushies', 4.8, 600, 'Soft Majin Buu.', true, 100, ARRAY[]::TEXT[], false),

-- MISC
(gen_random_uuid(), 'Pochita Chainsaw Man Plush', 1500, 2000, 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&q=80', ARRAY[]::TEXT[], 'Toys', 'Plushies', 5.0, 5000, 'The best boy.', true, 0, ARRAY['sold-out'], false),
(gen_random_uuid(), 'Attack on Titan Cloak', 1999, 2500, 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80', ARRAY[]::TEXT[], 'Apparel', 'Cosplay', 4.9, 2500, 'Scout Regiment cloak.', true, 300, ARRAY['bestseller'], true),
(gen_random_uuid(), 'Death Note Notebook', 799, 1200, 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Stationery', 4.7, 1800, 'Replica notebook.', true, 600, ARRAY[]::TEXT[], false),
(gen_random_uuid(), 'Totoro Night Light', 1500, 1800, 'https://images.unsplash.com/photo-1513506003013-dfa988ea6f8e?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Decor', 4.9, 800, 'Cute lamp.', true, 120, ARRAY['kawaii'], false),
(gen_random_uuid(), 'Solo Leveling Dagger', 2200, 2800, 'https://images.unsplash.com/photo-1601342630313-275cf0a151b8?w=800&q=80', ARRAY[]::TEXT[], 'Accessories', 'Props', 4.8, 300, 'Sung Jin-Woo dagger.', true, 50, ARRAY['new'], false);
