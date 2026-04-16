insert into public.products
  (id, sku, name, category, turnaround_days, starting_price, is_featured, print_types_available)
values
  ('10000000-0000-0000-0000-000000000001', 'TEE-GILDAN-64000', 'Gildan Softstyle Tee', 'T-Shirts', 10, 8.50, true, '{"screen_print","puff_print","foil"}'),
  ('10000000-0000-0000-0000-000000000002', 'TEE-BELLA-3001', 'Bella+Canvas Unisex Tee', 'T-Shirts', 10, 11.00, true, '{"screen_print","dye_sublimation","foil"}'),
  ('10000000-0000-0000-0000-000000000003', 'CREW-INDEPENDENT-SS3000', 'Independent Trading Crewneck', 'Sweatshirts', 12, 22.00, true, '{"screen_print","embroidery","puff_print"}'),
  ('10000000-0000-0000-0000-000000000004', 'HOOD-GILDAN-18500', 'Gildan Heavy Blend Hoodie', 'Sweatshirts', 12, 24.00, true, '{"screen_print","embroidery","puff_print"}'),
  ('10000000-0000-0000-0000-000000000005', 'HAT-RICHARDSON-112', 'Richardson 112 Trucker Hat', 'Headwear', 14, 18.00, false, '{"embroidery","puff_print"}'),
  ('10000000-0000-0000-0000-000000000006', 'HAT-YUPOONG-6606', 'Yupoong Snapback', 'Headwear', 14, 16.00, false, '{"embroidery","screen_print"}'),
  ('10000000-0000-0000-0000-000000000007', 'POLO-PORT-K500', 'Port Authority Performance Polo', 'Polos', 14, 28.00, false, '{"embroidery","screen_print"}'),
  ('10000000-0000-0000-0000-000000000008', 'JACKET-CHARLES-J317', 'Charles River Pullover Jacket', 'Outerwear', 18, 45.00, false, '{"embroidery","screen_print"}'),
  ('10000000-0000-0000-0000-000000000009', 'TANK-NEXT-3633', 'Next Level Racerback Tank', 'T-Shirts', 10, 9.00, false, '{"screen_print","dye_sublimation"}'),
  ('10000000-0000-0000-0000-000000000010', 'CREW-COMFORT-1566', 'Comfort Colors Crewneck', 'Sweatshirts', 12, 26.00, true, '{"screen_print","embroidery"}')
on conflict (sku) do update
set
  name = excluded.name,
  category = excluded.category,
  turnaround_days = excluded.turnaround_days,
  starting_price = excluded.starting_price,
  is_featured = excluded.is_featured,
  print_types_available = excluded.print_types_available;

insert into public.users
  (id, auth_user_id, name, email, user_type, organization, school, loyalty_points)
values
  ('20000000-0000-0000-0000-000000000001', null, 'Madison Clarke', 'madison.clarke@alphaphi.org', 'customer', 'Alpha Phi', 'University of Alabama', 320),
  ('20000000-0000-0000-0000-000000000002', null, 'Tyler Nguyen', 'tyler.nguyen@sigchi.org', 'customer', 'Sigma Chi', 'University of Georgia', 85),
  ('20000000-0000-0000-0000-000000000003', null, 'Brianna Walsh', 'brianna.walsh@kappakappa.org', 'customer', 'Kappa Kappa Gamma', 'Ohio State University', 510),
  ('20000000-0000-0000-0000-000000000004', null, 'Jordan Reed', 'jordan.reed@pikappalpha.org', 'customer', 'Pi Kappa Alpha', 'University of Tennessee', 0),
  ('20000000-0000-0000-0000-000000000005', null, 'Alexis Monroe', 'alexis.monroe@deltazeta.org', 'customer', 'Delta Zeta', 'Auburn University', 210),
  ('20000000-0000-0000-0000-000000000006', null, 'Chris Patel', 'chris.patel@tcl.com', 'account_manager', null, 'TCL HQ', 0),
  ('20000000-0000-0000-0000-000000000007', null, 'Samantha Lee', 'samantha.lee@tcl.com', 'account_manager', null, 'TCL HQ', 0),
  ('20000000-0000-0000-0000-000000000008', null, 'Jake Turner', 'jake.turner@uga.edu', 'campus_rep', 'TCL Campus Reps', 'University of Georgia', 150),
  ('20000000-0000-0000-0000-000000000009', null, 'Priya Sharma', 'priya.sharma@ua.edu', 'campus_rep', 'TCL Campus Reps', 'University of Alabama', 90),
  ('20000000-0000-0000-0000-000000000010', null, 'Noah Castillo', 'noah.castillo@osu.edu', 'campus_rep', 'TCL Campus Reps', 'Ohio State University', 60)
on conflict (email) do update
set
  name = excluded.name,
  user_type = excluded.user_type,
  organization = excluded.organization,
  school = excluded.school,
  loyalty_points = excluded.loyalty_points;

insert into public.orders
  (id, customer_id, event_name, due_date, status, order_type, products_selected, print_type, front_design_description, back_design_description, front_design_file, back_design_file, design_direction)
values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Alpha Phi Bid Day 2025', '2025-02-28', 'proof_ready', 'event', '{"PRD002","PRD009"}', 'screen_print', 'Alpha Phi letters with bid day sun motif - coral and white', 'Back text: Bid Day 2025 University of Alabama', 'https://cdn.tcl.io/designs/ord001_front.ai', 'https://cdn.tcl.io/designs/ord001_back.ai', 'copy_exactly'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Sigma Chi Derby Days', '2025-03-10', 'proof_pending', 'event', '{"PRD001"}', 'screen_print', 'Sigma Chi crest with Derby Days text in navy and gold', 'None', null, null, 'use_as_inspiration'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'KKG Big Little Reveal', '2025-02-20', 'approved', 'event', '{"PRD003","PRD004"}', 'embroidery', 'KKG logo embroidered on left chest in blue and gold', 'None', 'https://cdn.tcl.io/designs/ord003_front.ai', null, 'copy_exactly'),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'Pike Formal 2025', '2025-04-05', 'new', 'formal', '{"PRD008"}', 'embroidery', 'Pi Kappa Alpha shield on left chest', 'None', null, null, 'designers_choice'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'Delta Zeta Spring Semi', '2025-03-22', 'in_production', 'formal', '{"PRD002","PRD009"}', 'dye_sublimation', 'Full front sublimation - DZ roses watercolor graphic', 'Back: Spring Semi 2025 Auburn', 'https://cdn.tcl.io/designs/ord005_front.ai', 'https://cdn.tcl.io/designs/ord005_back.ai', 'use_as_inspiration'),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', 'Alpha Phi Philanthropy 5K', '2025-04-12', 'new', 'event', '{"PRD001"}', 'screen_print', '5K race graphic with Alpha Phi heart logo in red', 'Back: participant list printed in two columns', 'https://cdn.tcl.io/designs/ord006_front.ai', null, 'copy_exactly'),
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000003', 'KKG Recruitment 2025', '2025-03-01', 'shipped', 'recruitment', '{"PRD002"}', 'screen_print', 'KKG owl mascot with Find Your People tagline', 'Back: KKG Ohio State chapter URL and QR code', 'https://cdn.tcl.io/designs/ord007_front.ai', 'https://cdn.tcl.io/designs/ord007_back.ai', 'copy_exactly'),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000005', 'DZ Sisterhood Retreat', '2025-03-15', 'complete', 'event', '{"PRD004","PRD006"}', 'screen_print', 'DZ letters stacked with pine tree retreat graphic', 'None', 'https://cdn.tcl.io/designs/ord008_front.ai', null, 'use_as_inspiration'),
  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', 'Sig Chi Homecoming', '2025-10-18', 'new', 'event', '{"PRD001","PRD003"}', 'puff_print', 'Sigma Chi letters puff raised with homecoming year', 'Back: Derby Days Champion banner', 'https://cdn.tcl.io/designs/ord009_front.ai', null, 'copy_exactly'),
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000004', 'Pike Rush Fall 2025', '2025-08-20', 'new', 'recruitment', '{"PRD001","PRD005"}', 'screen_print', 'Minimalist PIKE wordmark in black on white tee', 'None', null, null, 'designers_choice')
on conflict (id) do update
set
  customer_id = excluded.customer_id,
  event_name = excluded.event_name,
  due_date = excluded.due_date,
  status = excluded.status;

insert into public.proofs
  (id, order_id, proof_number, product, color, print_type, est_ship_date, price_tiers, mockup_image_url, status, uploaded_at)
values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 1, 'PRD002', 'Heather Peach', 'screen_print', '2025-02-24', '[{"range":"24-47","price":13.50},{"range":"48-71","price":12.00},{"range":"72+","price":10.75}]'::jsonb, 'https://cdn.tcl.io/mockups/prf001.png', 'approved', '2025-02-10T14:32:00Z'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 1, 'PRD009', 'Coral', 'screen_print', '2025-02-24', '[{"range":"24-47","price":11.50},{"range":"48-71","price":10.25},{"range":"72+","price":9.00}]'::jsonb, 'https://cdn.tcl.io/mockups/prf002.png', 'approved', '2025-02-10T14:35:00Z'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 1, 'PRD001', 'Navy', 'screen_print', '2025-03-06', '[{"range":"24-47","price":10.50},{"range":"48-71","price":9.25},{"range":"72+","price":8.00}]'::jsonb, 'https://cdn.tcl.io/mockups/prf003.png', 'pending', '2025-02-12T09:15:00Z'),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', 1, 'PRD003', 'Royal Blue', 'embroidery', '2025-02-17', '[{"range":"12-23","price":28.00},{"range":"24-47","price":25.50},{"range":"48+","price":23.00}]'::jsonb, 'https://cdn.tcl.io/mockups/prf004.png', 'approved', '2025-02-05T11:00:00Z'),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', 1, 'PRD004', 'Royal Blue', 'embroidery', '2025-02-17', '[{"range":"12-23","price":30.00},{"range":"24-47","price":27.00},{"range":"48+","price":24.50}]'::jsonb, 'https://cdn.tcl.io/mockups/prf005.png', 'approved', '2025-02-05T11:05:00Z'),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000005', 1, 'PRD002', 'White', 'dye_sublimation', '2025-03-18', '[{"range":"24-47","price":18.00},{"range":"48-71","price":16.50},{"range":"72+","price":14.75}]'::jsonb, 'https://cdn.tcl.io/mockups/prf006.png', 'revision_requested', '2025-02-08T16:45:00Z'),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000005', 2, 'PRD002', 'White', 'dye_sublimation', '2025-03-18', '[{"range":"24-47","price":18.00},{"range":"48-71","price":16.50},{"range":"72+","price":14.75}]'::jsonb, 'https://cdn.tcl.io/mockups/prf007.png', 'approved', '2025-02-13T10:20:00Z'),
  ('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000005', 1, 'PRD009', 'White', 'dye_sublimation', '2025-03-18', '[{"range":"24-47","price":12.00},{"range":"48-71","price":11.00},{"range":"72+","price":9.75}]'::jsonb, 'https://cdn.tcl.io/mockups/prf008.png', 'approved', '2025-02-08T16:50:00Z'),
  ('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000007', 1, 'PRD002', 'Dark Heather', 'screen_print', '2025-02-25', '[{"range":"24-47","price":13.50},{"range":"48-71","price":12.00},{"range":"72+","price":10.75}]'::jsonb, 'https://cdn.tcl.io/mockups/prf009.png', 'approved', '2025-01-28T08:30:00Z'),
  ('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000008', 1, 'PRD004', 'Forest Green', 'screen_print', '2025-03-12', '[{"range":"24-47","price":11.00},{"range":"48-71","price":9.75},{"range":"72+","price":8.50}]'::jsonb, 'https://cdn.tcl.io/mockups/prf010.png', 'approved', '2025-02-20T13:10:00Z')
on conflict (id) do update
set
  status = excluded.status,
  price_tiers = excluded.price_tiers,
  mockup_image_url = excluded.mockup_image_url;

insert into public.revision_requests
  (id, proof_id, customer_id, notes, created_at)
values
  (
    '50000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000005',
    'The rose colors look too muted - can you make them more vibrant and saturated? Also the DZ letters on the front feel too small relative to the graphic. Please increase letter size by about 20%.',
    '2025-02-09T10:30:00Z'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    'The gold color on the crest looks more yellow than the PMS 124 we specified. Please match to our brand guidelines. Also the text kerning on Derby Days feels too tight.',
    '2025-02-13T08:55:00Z'
  )
on conflict (id) do update
set
  notes = excluded.notes,
  created_at = excluded.created_at;
