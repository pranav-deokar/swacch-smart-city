-- ============================================================
-- SWACHH-AI — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── BINS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bins (
  id           TEXT PRIMARY KEY,
  location     TEXT NOT NULL,
  lat          DECIMAL(10, 7) NOT NULL,
  lng          DECIMAL(10, 7) NOT NULL,
  fill_level   INTEGER NOT NULL DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  status       TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('critical', 'warning', 'normal')),
  waste_type   TEXT NOT NULL DEFAULT 'mixed' CHECK (waste_type IN ('wet', 'dry', 'mixed')),
  last_collected TEXT NOT NULL DEFAULT 'Never',
  zone         TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update status based on fill_level
CREATE OR REPLACE FUNCTION update_bin_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fill_level >= 80 THEN
    NEW.status := 'critical';
  ELSIF NEW.fill_level >= 60 THEN
    NEW.status := 'warning';
  ELSE
    NEW.status := 'normal';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bin_status_trigger ON bins;
CREATE TRIGGER bin_status_trigger
  BEFORE INSERT OR UPDATE ON bins
  FOR EACH ROW EXECUTE FUNCTION update_bin_status();

-- ── TRUCKS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trucks (
  id               TEXT PRIMARY KEY,
  driver_name      TEXT NOT NULL,
  driver_id        UUID REFERENCES auth.users(id),
  lat              DECIMAL(10, 7) NOT NULL,
  lng              DECIMAL(10, 7) NOT NULL,
  status           TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'maintenance')),
  route_name       TEXT NOT NULL,
  bins_collected   INTEGER NOT NULL DEFAULT 0,
  total_bins       INTEGER NOT NULL DEFAULT 0,
  fuel_level       INTEGER NOT NULL DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION increment_bins_collected(truck_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE trucks SET bins_collected = bins_collected + 1, updated_at = NOW() WHERE id = truck_id;
END;
$$ LANGUAGE plpgsql;

-- ── OFFICERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS officers (
  id                   TEXT PRIMARY KEY,
  name                 TEXT NOT NULL,
  zone                 TEXT NOT NULL,
  email                TEXT UNIQUE NOT NULL,
  active_complaints    INTEGER NOT NULL DEFAULT 0,
  resolved_complaints  INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── VIOLATIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS violations (
  id               TEXT PRIMARY KEY DEFAULT 'V' || extract(epoch from now())::TEXT,
  type             TEXT NOT NULL,
  location         TEXT NOT NULL,
  lat              DECIMAL(10, 7),
  lng              DECIMAL(10, 7),
  detected_at      TEXT NOT NULL,
  confidence       INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  image_url        TEXT,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned')),
  assigned_officer TEXT,
  officer_id       TEXT REFERENCES officers(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── COMPLAINTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  id               TEXT PRIMARY KEY DEFAULT 'C' || extract(epoch from now())::TEXT,
  citizen_name     TEXT NOT NULL,
  citizen_id       UUID REFERENCES auth.users(id),
  issue            TEXT NOT NULL,
  location         TEXT NOT NULL,
  lat              DECIMAL(10, 7),
  lng              DECIMAL(10, 7),
  status           TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-review', 'resolved')),
  priority         TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  assigned_officer TEXT,
  officer_id       TEXT REFERENCES officers(id),
  votes            INTEGER NOT NULL DEFAULT 0,
  image_url        TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION increment_complaint_votes(complaint_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE complaints SET votes = votes + 1 WHERE id = complaint_id;
END;
$$ LANGUAGE plpgsql;

-- ── COMMUNITY POSTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id         TEXT PRIMARY KEY DEFAULT 'P' || extract(epoch from now())::TEXT,
  user_name  TEXT NOT NULL,
  user_id    UUID REFERENCES auth.users(id),
  avatar     TEXT NOT NULL DEFAULT 'CU',
  content    TEXT NOT NULL,
  image_url  TEXT,
  likes      INTEGER NOT NULL DEFAULT 0,
  comments   INTEGER NOT NULL DEFAULT 0,
  post_type  TEXT NOT NULL DEFAULT 'general' CHECK (post_type IN ('alert', 'initiative', 'official', 'general')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION increment_post_likes(post_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts SET likes = likes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- ── ALERTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id          TEXT PRIMARY KEY DEFAULT 'A' || extract(epoch from now())::TEXT,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  alert_type  TEXT NOT NULL DEFAULT 'info' CHECK (alert_type IN ('warning', 'info', 'success', 'danger')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can read)
CREATE POLICY "Public read bins" ON bins FOR SELECT USING (true);
CREATE POLICY "Public read trucks" ON trucks FOR SELECT USING (true);
CREATE POLICY "Public read officers" ON officers FOR SELECT USING (true);
CREATE POLICY "Public read violations" ON violations FOR SELECT USING (true);
CREATE POLICY "Public read complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public read alerts" ON alerts FOR SELECT USING (true);

-- Insert policies (anyone can insert complaints and posts)
CREATE POLICY "Anyone can create complaint" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create post" ON community_posts FOR INSERT WITH CHECK (true);

-- Update policies (service role handles updates via API routes)
CREATE POLICY "Service role update bins" ON bins FOR UPDATE USING (true);
CREATE POLICY "Service role update trucks" ON trucks FOR UPDATE USING (true);
CREATE POLICY "Service role update violations" ON violations FOR UPDATE USING (true);
CREATE POLICY "Service role update complaints" ON complaints FOR UPDATE USING (true);

-- ── SEED DATA ───────────────────────────────────────────────
INSERT INTO officers (id, name, zone, email, active_complaints, resolved_complaints) VALUES
  ('O1', 'Smt. Kavita Rao',    'Zone A + Zone B', 'kavita.rao@pmc.gov.in',    2, 18),
  ('O2', 'Shri. Manoj Kulkarni','Zone C + Zone D', 'manoj.kulkarni@pmc.gov.in', 1, 22),
  ('O3', 'Shri. Arun Sharma',  'Zone E + Zone F', 'arun.sharma@pmc.gov.in',   2, 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bins (id, location, lat, lng, fill_level, waste_type, last_collected, zone) VALUES
  ('B001', 'MG Road Junction',       18.5204, 73.8567, 92, 'mixed', '2h ago',   'Zone A'),
  ('B002', 'FC Road Chowk',          18.5298, 73.8401, 78, 'dry',   '4h ago',   'Zone A'),
  ('B003', 'Deccan Gymkhana',        18.5156, 73.8455, 45, 'wet',   '1h ago',   'Zone B'),
  ('B004', 'Shivajinagar Bus Stand', 18.5308, 73.8475, 88, 'mixed', '3h ago',   'Zone A'),
  ('B005', 'Pune Railway Station',   18.5285, 73.8740, 31, 'dry',   '30m ago',  'Zone C'),
  ('B006', 'Camp Market',            18.5089, 73.8777, 65, 'wet',   '2h ago',   'Zone C'),
  ('B007', 'Kothrud Depot',          18.5074, 73.8077, 95, 'mixed', '5h ago',   'Zone B'),
  ('B008', 'Baner Road Bridge',      18.5590, 73.7868, 22, 'dry',   '45m ago',  'Zone D'),
  ('B009', 'Aundh IT Park',          18.5590, 73.8078, 74, 'wet',   '3h ago',   'Zone D'),
  ('B010', 'Viman Nagar Square',     18.5679, 73.9143, 58, 'mixed', '1.5h ago', 'Zone E'),
  ('B011', 'Koregaon Park Gate',     18.5362, 73.8939, 83, 'dry',   '4h ago',   'Zone E'),
  ('B012', 'Hadapsar Phata',         18.5018, 73.9296, 41, 'wet',   '1h ago',   'Zone F')
ON CONFLICT (id) DO NOTHING;

INSERT INTO trucks (id, driver_name, lat, lng, status, route_name, bins_collected, total_bins, fuel_level) VALUES
  ('T01', 'Rajesh Kumar',   18.5220, 73.8580, 'active',      'R-Alpha', 4, 7, 72),
  ('T02', 'Sunil Patil',    18.5160, 73.8090, 'active',      'R-Beta',  2, 5, 88),
  ('T03', 'Priya Deshmukh', 18.5300, 73.8750, 'idle',        'R-Gamma', 6, 6, 45),
  ('T04', 'Amol Jadhav',    18.5580, 73.8060, 'maintenance', 'R-Delta', 0, 4, 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO violations (id, type, location, lat, lng, detected_at, confidence, image_url, status, assigned_officer, officer_id) VALUES
  ('V001', 'Plastic Carry Bag', 'MG Road Junction',       18.5204, 73.8567, '09:42 AM', 94, 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80', 'pending',  'Smt. Kavita Rao',       'O1'),
  ('V002', 'Open Burning',      'Camp Area Nalah',         18.5089, 73.8777, '08:15 AM', 87, 'https://images.unsplash.com/photo-1569163139500-f502d85900c3?w=600&q=80', 'reviewed', 'Shri. Manoj Kulkarni',  'O2'),
  ('V003', 'Plastic Carry Bag', 'Kothrud Market',          18.5074, 73.8077, '07:30 AM', 91, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'actioned', 'Smt. Kavita Rao',       'O1'),
  ('V004', 'Littering',         'Shivajinagar Bus Stop',   18.5308, 73.8475, '11:05 AM', 79, 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&q=80', 'pending',  'Shri. Arun Sharma',     'O3'),
  ('V005', 'Illegal Dumping',   'Baner Nalah',             18.5590, 73.7868, '06:50 AM', 96, 'https://images.unsplash.com/photo-1547496502-affa22e38b49?w=600&q=80', 'pending',  'Shri. Manoj Kulkarni',  'O2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO complaints (id, citizen_name, issue, location, status, priority, assigned_officer, officer_id, votes) VALUES
  ('C001', 'Aarav Mehta',      'Overflowing bin near Lakshmi Road temple, not collected for 3 days. Causing health hazard.', 'Lakshmi Road',    'open',      'high',   'Smt. Kavita Rao',      'O1', 12),
  ('C002', 'Sneha Joshi',      'Garbage truck making rounds at 2 AM causing severe noise disturbance to residents.',           'Kothrud Sector 4','in-review', 'medium', 'Shri. Manoj Kulkarni', 'O2', 7),
  ('C003', 'Rohit Patil',      'Plastic burning behind vegetable market, smoke affecting senior citizens and children.',        'Camp Market',     'resolved',  'high',   'Shri. Arun Sharma',    'O3', 24),
  ('C004', 'Priya Kulkarni',   'Stray animals tipping bins, garbage spread across 50m radius on daily basis.',                 'Aundh Phase 2',   'open',      'medium', 'Smt. Kavita Rao',      'O1', 9),
  ('C005', 'Vijay Deshpande',  'New bin required near community park entrance - current nearest bin is 300m away.',            'Baner Park Road', 'in-review', 'low',    'Shri. Arun Sharma',    'O3', 31),
  ('C006', 'Meena Gaikwad',    'Wet and dry waste mixed in blue bins. Collection staff not following segregation rules.',      'Hadapsar Camp',   'open',      'medium', 'Shri. Manoj Kulkarni', 'O2', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO community_posts (id, user_name, avatar, content, post_type, likes, comments) VALUES
  ('P001', 'Aarav Mehta',    'AM', 'The new smart bins on FC Road are working great! The fill level display is super helpful. 👍 Great initiative PMC!', 'general',    14, 3),
  ('P002', 'Sneha Joshi',    'SJ', 'Spotted illegal dumping near the nalah behind Shivajinagar. Already reported to PMC. Please upvote so action is taken faster!', 'alert', 28, 7),
  ('P003', 'Ravi Rane',      'RR', 'Organized a cleanliness drive today at Baner lake! 40 volunteers, 12 bags of waste collected in just 2 hours. 🌿', 'initiative', 67, 15),
  ('P004', 'PMC Alert System','PA', '⚠️ ADVISORY: Garbage collection schedule shifted to morning hours (6AM-10AM) for Kothrud and Karve Nagar zones from Monday onwards.', 'official', 45, 22)
ON CONFLICT (id) DO NOTHING;

INSERT INTO alerts (id, title, description, alert_type, is_active) VALUES
  ('A1', 'Kothrud Collection Delay',  'Due to vehicle maintenance, waste collection in Kothrud will be delayed by 2 hours today.', 'warning', true),
  ('A2', '12 New Smart Bins Installed', 'IoT-enabled bins installed on FC Road and Baner Road. Fill level updates are now live on the citizen map.', 'info', true),
  ('A3', 'Camp Complaint Resolved',   'The illegal dumping site reported by citizens at Camp Area has been cleared. Thank you for reporting!', 'success', true),
  ('A4', 'Fire Hazard Alert',         'Open burning near Shivajinagar market. PMC teams dispatched. Residents advised to avoid the area temporarily.', 'danger', true)
ON CONFLICT (id) DO NOTHING;

-- ── REALTIME ────────────────────────────────────────────────
-- Enable realtime for live updates (run in Supabase dashboard → Replication)
-- ALTER PUBLICATION supabase_realtime ADD TABLE bins;
-- ALTER PUBLICATION supabase_realtime ADD TABLE trucks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE violations;
-- ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
-- ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
-- ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
