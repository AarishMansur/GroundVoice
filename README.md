# Ground Voice

**Empowering NGOs to report frontline health issues with global impact.**

Ground Voice is a premium, AI-powered health reporting platform designed for frontline NGOs. It bridges the gap between raw health observations and globally legible data by providing a guided workflow aligned with UN Sustainable Development Goal 3 (SDG 3: Good Health and Well-being).

---

## Key Features

- **AI-Powered SITREPs**: Automatically convert informal health observations into formal UN Situation Reports (SITREP) using Llama-3.1-8B.
- **AI Severity Scoring**: Each submission is assigned a severity score (1–10) by AI analysis, surfacing the most critical health crises first.
- **Global Health Map**: An interactive Leaflet-powered heatmap that visualizes report severity by region with color-coded markers (Sky → Amber → Rose), tooltips, and a floating legend.
- **Guided NGO Reporting**: A streamlined, five-step workflow that turns complex frontline evidence into structured health statements.
- **SDG 3 Alignment**: Every report is automatically mapped to global health categories (Mental Health, Healthcare Access, etc.).
- **Public Health Feed**: A searchable, filterable public feed with a List/Health Map toggle that surfaces urgent health concerns by region and issue type.
- **Premium UI/UX**: A sleek, responsive interface built with glassmorphism effects, smooth animations, and a modern color palette.

---

## Tech Stack

### Frontend
- **React (TypeScript)**: For a fast, type-safe interactive user experience.
- **Tailwind CSS**: Modern, utility-first styling for a premium look.
- **Leaflet + React-Leaflet**: Interactive global health map with CARTO dark tiles.
- **Vite**: Ultra-fast build tool and development server.

### Backend
- **Node.js & Express**: Robust and scalable API architecture.
- **Prisma ORM**: Type-safe database access and streamlined migrations.
- **PostgreSQL (Neon)**: Cloud-native relational database for reliable storage.
- **Hugging Face AI**: Integration with Llama-3.1-8B for SITREP generation.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Hugging Face API Token (for AI features)
- A PostgreSQL database (Neon recommended)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/groundvoice.git
    cd groundvoice
    ```

2.  **Setup the Server**:
    - Navigate to the server directory:
      ```bash
      cd server
      npm install
      ```
    - Create a `.env` file in the `server` directory:
      ```env
      PORT=4000
      CLIENT_URL=http://localhost:3001
      DATABASE_URL="your-postgresql-url"
      HF_TOKEN="your-huggingface-token"
      ```
    - Initialize the database:
      ```bash
      npx prisma generate
      npx prisma migrate dev
      ```
    - Start the server:
      ```bash
      npm run dev
      ```

3.  **Setup the Client**:
    - Navigate to the client directory:
      ```bash
      cd ../client
      npm install
      ```
    - Create a `.env` file in the `client` directory:
      ```env
      VITE_BACKEND_API="http://localhost:4000/api"
      ```
    - Start the client:
      ```bash
      npm run dev
      ```

4.  **Access the App**:
    Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Project Structure

```text
groundvoice/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── feed/
│   │   │   │   ├── PublicFeed.tsx   # List/Map toggle, filters, severity badges
│   │   │   │   └── HealthMap.tsx    # Leaflet heatmap with region markers
│   │   │   ├── landing/            # Home page & feature blocks
│   │   │   ├── report-builder/     # Five-step submission wizard
│   │   │   └── report-detail/      # Single report view with AI SITREP
│   │   ├── lib/         # API logic & Constants
│   │   ├── types/       # TypeScript Interfaces
│   │   └── App.tsx      # Main Entry & Hash Routing
├── server/              # Express Backend
│   ├── src/
│   │   ├── controllers/ # API Route Handlers
│   │   ├── lib/         # AI Integration (Severity + SITREP) & Prisma
│   │   ├── routes/      # Express Route Definitions
│   │   └── index.ts     # Server Entry
└── prisma/              # Database Schema (with severity field)
```

---

## Vision
Ground Voice aims to democratize health reporting by giving every local NGO the tools to speak the language of global health organizations. By turning lived experience into structured, AI-enhanced data, we accelerate the response to urgent health crises worldwide.

---

## License
This project is licensed under the MIT License.
