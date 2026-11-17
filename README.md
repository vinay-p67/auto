# Precision Auto Repair — Master Vehicle Care & Real-Time Bay Booking

A production-grade automotive service booking platform and comprehensive management dashboard engineered with **React**, **TypeScript**, **Three.js / React Three Fiber**, **Supabase**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 🏎️ 1. Interactive 3D Workshop Experience
- **Photorealistic 3D Sports Car**: Embedded Three.js / WebGL scene powered by React Three Fiber featuring an authentic sports car (`/models/car.glb`) with candy metallic clearcoat paint, machined 5-spoke alloy wheels, and visible cross-drilled rotors.
- **Service-Guided Camera Stations**: As the user scrolls or hovers over service cards, the camera automatically eases toward corresponding vehicle components (e.g., brake calipers illuminate for Brake Inspection; engine bay illuminates for Diagnostics).
- **Workshop Environment**: Fully realized auto repair bay with hydraulic two-post lifts, rolling multi-tier steel tool chest, and digital OBD-II diagnostic cart.
- **Performance Optimized**: Capped device pixel ratio `[1, 1.75]`, contact shadow grounding, and graceful fallback for low-power devices.

### 📅 2. Real-Time Bay Availability & Overlap Engine
- **Accurate Scheduling**: Generates live booking slots using `business_hours`, `services.duration_minutes`, `business_settings.slot_interval_minutes`, and `business_settings.booking_notice_hours`.
- **Automatic Overlap Detection**: Prevents double-booking:
  $$\text{new\_start} < \text{existing\_end} \quad \land \quad \text{new\_end} > \text{existing\_start}$$
- **Blackout Dates**: Automatically skips dates configured in `blocked_dates` with clear public maintenance notices.
- **RLS-Safe Submission**: Uses standard Supabase `.insert()` without requiring public read permissions on private appointments.

### 🛡️ 3. Secure Admin Management Portal
- **Protected by Supabase Auth**: Sign in using email & password. Authorization is checked against `admin_users.user_id` using `maybeSingle()`.
- **6 Full-Featured Dashboard Modules**:
  1. **Overview**: Key metrics (total bookings, pending bay slots, active services, projected revenue) and immediate bay queue.
  2. **Appointments**: Filterable table by status (`pending`, `confirmed`, `completed`, `cancelled`), live search, and inline status updates.
  3. **Services**: Full CRUD catalog editor (add service, edit service modal, activate/deactivate toggle, price & duration adjustments).
  4. **Business Hours**: 7-day schedule editor with open/closed toggles and opening/closing time inputs.
  5. **Blocked Dates**: Schedule holiday closures and facility lift maintenance blackouts.
  6. **Business Settings**: Manage `business_name`, `business_email`, `business_phone`, `business_address`, `slot_interval_minutes`, and `booking_notice_hours`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D & Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Backend & Database**: Supabase (PostgreSQL, Auth, Row-Level Security)
- **Styling**: Tailwind CSS, Lucide React Icons
- **Animation & Effects**: Framer Motion, Canvas Confetti

---

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/your-username/precision-auto-repair.git
cd precision-auto-repair
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://hqepjbzaajbsvpvpeowg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_b2GnSqo7vjXCZQcVjOlp6g_DSFsHa29
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 🗄️ Database Schema Reference

- `services`: `id`, `name`, `description`, `duration_minutes`, `price`, `is_active`, `created_at`
- `appointments`: `id`, `full_name`, `email`, `phone`, `service_id`, `appointment_date`, `start_time`, `end_time`, `status`, `notes`, `created_at`
- `business_hours`: `id`, `weekday`, `is_open`, `start_time`, `end_time`
- `blocked_dates`: `id`, `blocked_date`, `reason`, `created_at`
- `business_settings`: `id`, `business_name`, `business_email`, `business_phone`, `business_address`, `slot_interval_minutes`, `booking_notice_hours`, `created_at`
- `admin_users`: `id`, `user_id`, `created_at`

---

## 📦 Pushing to GitHub

To push this repository to your GitHub account:

```bash
# 1. Create a new repository on GitHub (e.g. "precision-auto-repair")
# 2. Add files and make initial commit
git add .
git commit -m "feat: complete modern 3D auto repair booking platform and admin suite"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote repository and push
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## 📄 License
MIT License. Built for master automotive service centers.
