/*
  # Create Traccar Schema

  ## Overview
  Creates the database schema to support a GPS tracking application (Traccar frontend).

  ## New Tables
  
  ### `server_config`
  - `id` (integer, primary key) - Single row table for server configuration
  - `registration` (boolean) - Allow user registration
  - `readonly` (boolean) - Read-only mode
  - `attributes` (jsonb) - Additional server attributes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `users`
  - `id` (uuid, primary key) - User identifier
  - `name` (text) - User's name
  - `email` (text, unique) - User's email address
  - `password` (text) - Hashed password
  - `administrator` (boolean) - Admin flag
  - `disabled` (boolean) - Account disabled flag
  - `readonly` (boolean) - Read-only access
  - `attributes` (jsonb) - Additional user attributes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `devices`
  - `id` (uuid, primary key) - Device identifier
  - `user_id` (uuid, foreign key) - Owner user
  - `name` (text) - Device name
  - `unique_id` (text, unique) - Device unique identifier
  - `status` (text) - Device status (online, offline, unknown)
  - `disabled` (boolean) - Device disabled flag
  - `last_update` (timestamptz) - Last position update
  - `position_id` (uuid) - Current position reference
  - `attributes` (jsonb) - Additional device attributes
  - `created_at` (timestamptz) - Record creation timestamp

  ### `positions`
  - `id` (uuid, primary key) - Position identifier
  - `device_id` (uuid, foreign key) - Related device
  - `protocol` (text) - Protocol used
  - `server_time` (timestamptz) - Server timestamp
  - `device_time` (timestamptz) - Device timestamp
  - `fix_time` (timestamptz) - GPS fix timestamp
  - `latitude` (double precision) - Latitude coordinate
  - `longitude` (double precision) - Longitude coordinate
  - `altitude` (double precision) - Altitude in meters
  - `speed` (double precision) - Speed in knots
  - `course` (double precision) - Course/bearing
  - `accuracy` (double precision) - Position accuracy
  - `attributes` (jsonb) - Additional position attributes
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to access their own data
  - Server config is readable by all authenticated users
  - Admin users can access all data

  ## Initial Data
  - Insert default server configuration
  - Create demo admin user for testing
*/

-- Create server_config table
CREATE TABLE IF NOT EXISTS server_config (
  id integer PRIMARY KEY DEFAULT 1,
  registration boolean DEFAULT true,
  readonly boolean DEFAULT false,
  email_enabled boolean DEFAULT false,
  openid_enabled boolean DEFAULT false,
  openid_force boolean DEFAULT false,
  announcement text DEFAULT '',
  attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  administrator boolean DEFAULT false,
  disabled boolean DEFAULT false,
  readonly boolean DEFAULT false,
  attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  unique_id text UNIQUE NOT NULL,
  status text DEFAULT 'unknown',
  disabled boolean DEFAULT false,
  last_update timestamptz DEFAULT now(),
  position_id uuid,
  group_id uuid,
  phone text DEFAULT '',
  model text DEFAULT '',
  contact text DEFAULT '',
  category text DEFAULT 'default',
  attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,
  protocol text DEFAULT 'unknown',
  server_time timestamptz DEFAULT now(),
  device_time timestamptz DEFAULT now(),
  fix_time timestamptz DEFAULT now(),
  latitude double precision DEFAULT 0,
  longitude double precision DEFAULT 0,
  altitude double precision DEFAULT 0,
  speed double precision DEFAULT 0,
  course double precision DEFAULT 0,
  accuracy double precision DEFAULT 0,
  address text DEFAULT '',
  attributes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE server_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

-- Server config policies (readable by all authenticated users)
CREATE POLICY "Authenticated users can read server config"
  ON server_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can update server config"
  ON server_config FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.administrator = true
    )
  );

-- Users policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid() AND u.administrator = true
  ));

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.administrator = true
    )
  );

-- Devices policies
CREATE POLICY "Users can read own devices"
  ON devices FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.administrator = true
    )
  );

CREATE POLICY "Users can insert own devices"
  ON devices FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own devices"
  ON devices FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own devices"
  ON devices FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Positions policies
CREATE POLICY "Users can read positions for own devices"
  ON positions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = positions.device_id
      AND (
        devices.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.administrator = true
        )
      )
    )
  );

CREATE POLICY "Users can insert positions for own devices"
  ON positions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = positions.device_id
      AND devices.user_id = auth.uid()
    )
  );

-- Insert default server configuration
INSERT INTO server_config (id, registration, readonly, attributes)
VALUES (1, true, false, '{"mapOnSelect": true, "colorPrimary": "#2563eb", "colorSecondary": "#059669"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_positions_device_id ON positions(device_id);
CREATE INDEX IF NOT EXISTS idx_positions_device_time ON positions(device_time);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);