
# Advanced Data Visualization Studio

A stunning full-stack data visualization application built with React, TypeScript, Supabase, and modern web technologies. This application allows users to create, manage, and visualize data through interactive charts with beautiful 3D animations, real-time plotting capabilities, and secure user authentication.

## 🚀 Features

### Frontend Features
- **User Authentication**: Secure sign-up/sign-in with email and password
- **Interactive Data Input**: Easy-to-use forms for X and Y axis data entry
- **Multiple Chart Types**: Line, Bar, Scatter, Area, and 3D visualizations
- **Real-time Data Plotting**: Dynamic chart updates as data is added
- **3D Chart Visualizations**: Interactive 3D charts with rotation and zoom controls
- **Beautiful UI**: Modern glass-morphism design with gradient backgrounds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Management**: CRUD operations for datasets and data points
- **Export/Import**: JSON data export and import functionality
- **Interactive Controls**: Mouse-driven chart interactions and animations
- **Personal Data**: Each user only sees and manages their own datasets

### Backend Features (Supabase)
- **User Authentication**: Secure authentication with Supabase Auth
- **Real-time Database**: PostgreSQL database with real-time subscriptions
- **Row Level Security**: Users can only access their own data
- **CRUD API Operations**: Full Create, Read, Update, Delete operations
- **Data Persistence**: Reliable cloud database storage
- **Multiple Dataset Support**: Manage multiple chart datasets simultaneously
- **Data Validation**: Input validation and error handling
- **RESTful API Design**: Following REST principles for data operations
- **Automatic Timestamps**: Created and updated timestamps for all records

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Powerful charting library for 2D visualizations
- **Canvas API** - Custom 3D chart implementations
- **Shadcn/ui** - Beautiful UI component library
- **Lucide React** - Modern icon library
- **React Query** - Server state management and caching

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Database-level security policies
- **Real-time subscriptions** - Live data updates
- **Supabase Auth** - Authentication and user management
- **RESTful APIs** - Auto-generated REST endpoints
- **Database triggers** - Automatic timestamp updates

### Additional Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **React Router** - Client-side routing

## 📊 Chart Types Supported

1. **Line Charts** - Perfect for time series and trend analysis
2. **Bar Charts** - Great for categorical data comparison
3. **Scatter Plots** - Ideal for correlation analysis
4. **Area Charts** - Excellent for showing cumulative data
5. **3D Charts** - Interactive three-dimensional data visualization

## 🎨 Design Features

- **Glass Morphism UI** - Modern translucent design elements
- **Gradient Backgrounds** - Beautiful color transitions
- **3D Animations** - Smooth transitions and hover effects
- **Dark Theme** - Easy on the eyes with purple/blue accent colors
- **Responsive Layout** - Adaptive design for all screen sizes
- **Interactive Elements** - Hover states and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- A Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd data-visualization-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - The database schema is automatically set up via migrations
   - Authentication is pre-configured for email/password

4. **Configure Supabase connection**
   - The Supabase client is pre-configured in `src/integrations/supabase/client.ts`
   - No additional configuration needed

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 🔐 Authentication

The application includes a complete authentication system:
- **Sign Up**: New users can create accounts with email/password
- **Sign In**: Existing users can log in securely
- **Session Management**: Automatic session handling and persistence
- **Protected Routes**: Data access requires authentication
- **User Isolation**: Each user only sees their own data

## 📚 Database Schema

### Tables

#### datasets
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (Text, Required)
- `chart_type` (Text, Required) - One of: 'line', 'bar', 'scatter', 'area', '3d'
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### data_points
- `id` (UUID, Primary Key)
- `dataset_id` (UUID, Foreign Key to datasets)
- `x_value` (Float, Required)
- `y_value` (Float, Required)
- `label` (Text, Optional)
- `color` (Text, Optional)
- `created_at` (Timestamp)

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own datasets and data points
- Automatic foreign key constraints ensure data integrity

## 🎯 Usage Guide

### Getting Started

1. **Create an Account**
   - Click "Sign In" in the top right
   - Switch to "Sign Up" tab
   - Enter your email and password
   - Confirm your email (if required)

2. **Create Your First Dataset**
   - Enter a dataset name in the sidebar
   - Select your preferred chart type
   - Click "Create Dataset"

3. **Add Data Points**
   - Enter X and Y values
   - Optionally add a label
   - Click "Add Point"

4. **Visualize Your Data**
   - Switch between chart types using tabs
   - Explore the 3D visualization
   - Use the data table for detailed editing

### Advanced Features

- **3D Chart Interaction**: Click and drag to rotate, use zoom controls
- **Data Export**: Download your datasets as JSON files
- **Data Import**: Upload JSON files to import existing data
- **Real-time Updates**: Charts update instantly as you add data
- **Personal Workspace**: All data is private to your account

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── auth/
│   │   └── AuthButton.tsx        # Authentication UI
│   ├── charts/
│   │   ├── ChartContainer.tsx    # 2D chart rendering
│   │   └── ThreeDChart.tsx       # 3D chart implementation
│   ├── data/
│   │   └── DataTable.tsx         # Data management interface
│   └── ui/                       # Reusable UI components
├── hooks/
│   ├── useAuth.tsx               # Authentication state management
│   └── useSupabaseData.tsx       # Data fetching and mutations
├── integrations/
│   └── supabase/
│       ├── client.ts             # Supabase client configuration
│       └── types.ts              # Database type definitions
├── pages/
│   └── Index.tsx                 # Main application page
└── lib/                          # Utility functions
```

### Key Components

- **AuthButton**: Handles user authentication UI and logic
- **ChartContainer**: Renders all 2D chart types using Recharts
- **ThreeDChart**: Custom 3D visualization using Canvas API
- **DataTable**: Full CRUD interface for data management
- **useAuth**: Custom hook for authentication state
- **useSupabaseData**: Custom hook for database operations

## 🌟 Backend API

### Authentication Endpoints (Supabase Auth)
- `POST /auth/v1/signup` - Create new user account
- `POST /auth/v1/token?grant_type=password` - Sign in user
- `POST /auth/v1/logout` - Sign out user
- `GET /auth/v1/user` - Get current user info

### Database Operations (Auto-generated REST API)
- `GET /rest/v1/datasets` - Retrieve user's datasets
- `POST /rest/v1/datasets` - Create a new dataset
- `PATCH /rest/v1/datasets?id=eq.{id}` - Update a dataset
- `DELETE /rest/v1/datasets?id=eq.{id}` - Delete a dataset
- `GET /rest/v1/data_points` - Retrieve data points
- `POST /rest/v1/data_points` - Add a new data point
- `PATCH /rest/v1/data_points?id=eq.{id}` - Update a data point
- `DELETE /rest/v1/data_points?id=eq.{id}` - Delete a data point

### API Headers Required
```
Authorization: Bearer {supabase_anon_key}
apikey: {supabase_anon_key}
Content-Type: application/json
```

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **HTTPS**: All communication encrypted
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Proper cross-origin resource sharing
- **Rate Limiting**: Built-in Supabase rate limiting

