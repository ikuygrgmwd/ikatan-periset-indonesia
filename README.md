# Ikatan Periset Indonesia - Web Portal & Internal Dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ikuygrgmwd/ikatan-periset-indonesia)

A modern fullstack web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** designed for the **Ikatan Periset Indonesia (IPI)**.

---

## 🚀 Live Demo

- **Hosted URL**: [https://ikatan-periset-indonesia.vercel.app](https://ikatan-periset-indonesia.vercel.app) *(Replace with your actual deployed Vercel URL)*
- **Demo Credentials**:
  - **Email**: `admin@periset.or.id`
  - **Password**: `admin123`

---

## 📖 Project Overview

This platform is divided into two primary sections:

### 1. Public Guest Portal
- **Header & Navigation**: Accessible branding with navigation links to news, organization profile, and a dedicated login button.
- **Hero Section**: Introduces the vision, mission, and profile of the Indonesian researcher community.
- **Featured News & Articles**: Latest publications, announcements, and research milestones displayed as cards with category badges.
- **Article Details (`/berita/[id]`)**: Full-page reader for research news with dynamic static generation (`generateStaticParams`).

### 2. Authenticated Internal Dashboard (`/dashboard`)
- **Dashboard Overview**: Key performance indicators, researcher counts, active work programs, and evaluation metrics.
- **Researcher & Employee Management (`/dashboard/karyawan`)**: Data table with modal forms to add, view, edit, and delete researcher records (NIP, research field, position, and contacts).
- **Work Programs (`/dashboard/program-kerja`)**: Progress tracking, status filters, and milestone management.
- **Monitoring & Evaluation (Monev) (`/dashboard/monev`)**: Quantitative performance index comparing targets against realization.
- **Account Settings (`/dashboard/settings`)**: Profile customization, password updates, and role/permission management.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Icons**: Lucide React
- **State & Auth**: React Context with LocalStorage session handling (ready for Supabase Auth)

---

## 💻 Local Setup Instructions

Follow these steps to run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/ikuygrgmwd/ikatan-periset-indonesia.git
cd ikatan-periset-indonesia
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production (optional)
```bash
npm run build
npm run start
```

---

## ☁️ Deploy to Vercel

You can deploy this project to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ikuygrgmwd/ikatan-periset-indonesia)
