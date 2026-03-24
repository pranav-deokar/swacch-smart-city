// src/lib/demo-data.ts
import type { Bin, Truck, Violation, Complaint, CommunityPost, Alert, Officer, Analytics } from '@/types'

export const DEMO_BINS: Bin[] = [
  { id: 'B001', location: 'MG Road Junction', lat: 18.5204, lng: 73.8567, fill_level: 92, status: 'critical', waste_type: 'mixed', last_collected: '2h ago', zone: 'Zone A' },
  { id: 'B002', location: 'FC Road Chowk', lat: 18.5298, lng: 73.8401, fill_level: 78, status: 'warning', waste_type: 'dry', last_collected: '4h ago', zone: 'Zone A' },
  { id: 'B003', location: 'Deccan Gymkhana', lat: 18.5156, lng: 73.8455, fill_level: 45, status: 'normal', waste_type: 'wet', last_collected: '1h ago', zone: 'Zone B' },
  { id: 'B004', location: 'Shivajinagar Bus Stand', lat: 18.5308, lng: 73.8475, fill_level: 88, status: 'critical', waste_type: 'mixed', last_collected: '3h ago', zone: 'Zone A' },
  { id: 'B005', location: 'Pune Railway Station', lat: 18.5285, lng: 73.8740, fill_level: 31, status: 'normal', waste_type: 'dry', last_collected: '30m ago', zone: 'Zone C' },
  { id: 'B006', location: 'Camp Market', lat: 18.5089, lng: 73.8777, fill_level: 65, status: 'normal', waste_type: 'wet', last_collected: '2h ago', zone: 'Zone C' },
  { id: 'B007', location: 'Kothrud Depot', lat: 18.5074, lng: 73.8077, fill_level: 95, status: 'critical', waste_type: 'mixed', last_collected: '5h ago', zone: 'Zone B' },
  { id: 'B008', location: 'Baner Road Bridge', lat: 18.5590, lng: 73.7868, fill_level: 22, status: 'normal', waste_type: 'dry', last_collected: '45m ago', zone: 'Zone D' },
  { id: 'B009', location: 'Aundh IT Park', lat: 18.5590, lng: 73.8078, fill_level: 74, status: 'warning', waste_type: 'wet', last_collected: '3h ago', zone: 'Zone D' },
  { id: 'B010', location: 'Viman Nagar Square', lat: 18.5679, lng: 73.9143, fill_level: 58, status: 'normal', waste_type: 'mixed', last_collected: '1.5h ago', zone: 'Zone E' },
  { id: 'B011', location: 'Koregaon Park Gate', lat: 18.5362, lng: 73.8939, fill_level: 83, status: 'critical', waste_type: 'dry', last_collected: '4h ago', zone: 'Zone E' },
  { id: 'B012', location: 'Hadapsar Phata', lat: 18.5018, lng: 73.9296, fill_level: 41, status: 'normal', waste_type: 'wet', last_collected: '1h ago', zone: 'Zone F' },
]

export const DEMO_TRUCKS: Truck[] = [
  { id: 'T01', driver_name: 'Rajesh Kumar', lat: 18.5220, lng: 73.8580, status: 'active', route_name: 'R-Alpha', bins_collected: 4, total_bins: 7, fuel_level: 72 },
  { id: 'T02', driver_name: 'Sunil Patil', lat: 18.5160, lng: 73.8090, status: 'active', route_name: 'R-Beta', bins_collected: 2, total_bins: 5, fuel_level: 88 },
  { id: 'T03', driver_name: 'Priya Deshmukh', lat: 18.5300, lng: 73.8750, status: 'idle', route_name: 'R-Gamma', bins_collected: 6, total_bins: 6, fuel_level: 45 },
  { id: 'T04', driver_name: 'Amol Jadhav', lat: 18.5580, lng: 73.8060, status: 'maintenance', route_name: 'R-Delta', bins_collected: 0, total_bins: 4, fuel_level: 20 },
]

export const DEMO_VIOLATIONS: Violation[] = [
  { id: 'V001', type: 'Plastic Carry Bag', location: 'MG Road Junction', lat: 18.5204, lng: 73.8567, detected_at: '09:42 AM', confidence: 94, image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80', status: 'pending', assigned_officer: 'Smt. Kavita Rao' },
  { id: 'V002', type: 'Open Burning', location: 'Camp Area Nalah', lat: 18.5089, lng: 73.8777, detected_at: '08:15 AM', confidence: 87, image_url: 'https://images.unsplash.com/photo-1569163139500-f502d85900c3?w=600&q=80', status: 'reviewed', assigned_officer: 'Shri. Manoj Kulkarni' },
  { id: 'V003', type: 'Plastic Carry Bag', location: 'Kothrud Market', lat: 18.5074, lng: 73.8077, detected_at: '07:30 AM', confidence: 91, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', status: 'actioned', assigned_officer: 'Smt. Kavita Rao' },
  { id: 'V004', type: 'Littering', location: 'Shivajinagar Bus Stop', lat: 18.5308, lng: 73.8475, detected_at: '11:05 AM', confidence: 79, image_url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&q=80', status: 'pending', assigned_officer: 'Shri. Arun Sharma' },
  { id: 'V005', type: 'Illegal Dumping', location: 'Baner Nalah', lat: 18.5590, lng: 73.7868, detected_at: '06:50 AM', confidence: 96, image_url: 'https://images.unsplash.com/photo-1547496502-affa22e38b49?w=600&q=80', status: 'pending', assigned_officer: 'Shri. Manoj Kulkarni' },
]

export const DEMO_OFFICERS: Officer[] = [
  { id: 'O1', name: 'Smt. Kavita Rao', zone: 'Zone A + Zone B', email: 'kavita.rao@pmc.gov.in', active_complaints: 2, resolved_complaints: 18 },
  { id: 'O2', name: 'Shri. Manoj Kulkarni', zone: 'Zone C + Zone D', email: 'manoj.kulkarni@pmc.gov.in', active_complaints: 1, resolved_complaints: 22 },
  { id: 'O3', name: 'Shri. Arun Sharma', zone: 'Zone E + Zone F', email: 'arun.sharma@pmc.gov.in', active_complaints: 2, resolved_complaints: 15 },
]

export const DEMO_COMPLAINTS: Complaint[] = [
  { id: 'C001', citizen_name: 'Aarav Mehta', issue: 'Overflowing bin near Lakshmi Road temple, not collected for 3 days. Causing health hazard.', location: 'Lakshmi Road', status: 'open', priority: 'high', assigned_officer: 'Smt. Kavita Rao', created_at: '2024-05-01T10:00:00Z', votes: 12 },
  { id: 'C002', citizen_name: 'Sneha Joshi', issue: 'Garbage truck making rounds at 2 AM causing severe noise disturbance to residents.', location: 'Kothrud Sector 4', status: 'in-review', priority: 'medium', assigned_officer: 'Shri. Manoj Kulkarni', created_at: '2024-05-01T07:00:00Z', votes: 7 },
  { id: 'C003', citizen_name: 'Rohit Patil', issue: 'Plastic burning behind vegetable market, smoke affecting senior citizens and children.', location: 'Camp Market', status: 'resolved', priority: 'high', assigned_officer: 'Shri. Arun Sharma', created_at: '2024-04-30T08:00:00Z', votes: 24, image_url: 'https://images.unsplash.com/photo-1569163139500-f502d85900c3?w=600&q=80' },
  { id: 'C004', citizen_name: 'Priya Kulkarni', issue: 'Stray animals tipping bins, garbage spread across 50m radius on daily basis.', location: 'Aundh Phase 2', status: 'open', priority: 'medium', assigned_officer: 'Smt. Kavita Rao', created_at: '2024-05-01T09:00:00Z', votes: 9 },
  { id: 'C005', citizen_name: 'Vijay Deshpande', issue: 'New bin required near community park entrance — current nearest bin is 300m away.', location: 'Baner Park Road', status: 'in-review', priority: 'low', assigned_officer: 'Shri. Arun Sharma', created_at: '2024-04-30T11:00:00Z', votes: 31 },
  { id: 'C006', citizen_name: 'Meena Gaikwad', issue: 'Wet and dry waste mixed in blue bins. Collection staff not following segregation rules.', location: 'Hadapsar Camp', status: 'open', priority: 'medium', assigned_officer: 'Shri. Manoj Kulkarni', created_at: '2024-05-01T06:00:00Z', votes: 5 },
]

export const DEMO_POSTS: CommunityPost[] = [
  { id: 'P001', user_name: 'Aarav Mehta', avatar: 'AM', content: 'The new smart bins on FC Road are working great! The fill level display is super helpful — I can now see which bin to use. 👍 Great initiative PMC!', post_type: 'general', likes: 14, comments: 3, created_at: '2024-05-01T11:45:00Z' },
  { id: 'P002', user_name: 'Sneha Joshi', avatar: 'SJ', content: 'Spotted illegal dumping near the nalah behind Shivajinagar. Already reported to PMC. Attaching photo — please upvote so action is taken faster!', image_url: 'https://images.unsplash.com/photo-1547496502-affa22e38b49?w=600&q=80', post_type: 'alert', likes: 28, comments: 7, created_at: '2024-05-01T10:30:00Z' },
  { id: 'P003', user_name: 'Ravi Rane', avatar: 'RR', content: 'Organized a cleanliness drive today at Baner lake! 40 volunteers showed up, 12 bags of waste collected in just 2 hours. Nature thanks you all! 🌿', image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', post_type: 'initiative', likes: 67, comments: 15, created_at: '2024-05-01T08:00:00Z' },
  { id: 'P004', user_name: 'PMC Alert System', avatar: 'PA', content: '⚠️ OFFICIAL ADVISORY: Garbage collection schedule shifted to morning hours (6AM-10AM) for Kothrud and Karve Nagar zones from Monday onwards due to road work on Paud Road.', post_type: 'official', likes: 45, comments: 22, created_at: '2024-05-01T06:00:00Z' },
]

export const DEMO_ALERTS: Alert[] = [
  { id: 'A1', title: 'Kothrud Collection Delay', description: 'Due to vehicle maintenance, waste collection in Kothrud will be delayed by 2 hours today.', alert_type: 'warning', created_at: '2024-05-01T11:50:00Z', is_active: true },
  { id: 'A2', title: '12 New Smart Bins Installed', description: 'IoT-enabled bins installed on FC Road and Baner Road. Fill level updates are now live on the citizen map.', alert_type: 'info', created_at: '2024-05-01T10:00:00Z', is_active: true },
  { id: 'A3', title: 'Camp Complaint Resolved', description: 'The illegal dumping site reported by citizens at Camp Area has been cleared. Thank you for reporting!', alert_type: 'success', created_at: '2024-05-01T07:00:00Z', is_active: true },
  { id: 'A4', title: 'Fire Hazard Alert', description: 'Open burning near Shivajinagar market. PMC teams dispatched. Residents advised to avoid the area temporarily.', alert_type: 'danger', created_at: '2024-04-30T14:00:00Z', is_active: true },
]

export const DEMO_ANALYTICS: Analytics = {
  today_collected_kg: 2840,
  bins_critical: 4,
  trucks_active: 2,
  violations_today: 5,
  compliance_rate: 87,
  weekly_trend: [62, 71, 68, 75, 80, 77, 87],
  bins_by_status: { critical: 4, warning: 2, normal: 6 },
  waste_by_type: { wet: 38, dry: 41, mixed: 21 },
}
