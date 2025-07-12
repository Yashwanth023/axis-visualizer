
# Advanced Data Visualization Studio

A stunning full-stack data visualization application built with React, TypeScript, and modern web technologies. This application allows users to create, manage, and visualize data through interactive charts with beautiful 3D animations and real-time plotting capabilities.

## 🚀 Features

### Frontend Features
- **Interactive Data Input**: Easy-to-use forms for X and Y axis data entry
- **Multiple Chart Types**: Line, Bar, Scatter, Area, and 3D visualizations
- **Real-time Data Plotting**: Dynamic chart updates as data is added
- **3D Chart Visualizations**: Interactive 3D charts with rotation and zoom controls
- **Beautiful UI**: Modern glass-morphism design with gradient backgrounds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Management**: CRUD operations for datasets and data points
- **Export/Import**: JSON data export and import functionality
- **Interactive Controls**: Mouse-driven chart interactions and animations

### Backend Features
- **CRUD API Structure**: Full Create, Read, Update, Delete operations
- **Data Persistence**: MongoDB database for reliable data storage
- **Multiple Dataset Support**: Manage multiple chart datasets simultaneously
- **Data Validation**: Input validation and error handling
- **RESTful API Design**: Following REST principles for data operations

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Powerful charting library for 2D visualizations
- **Canvas API** - Custom 3D chart implementations
- **Shadcn/ui** - Beautiful UI component library
- **Lucide React** - Modern icon library

### Backend & Database
- **MongoDB** - NoSQL database for flexible data storage
- **RESTful APIs** - Standard REST endpoints for data operations
- **Data Models** - Structured schemas for datasets and data points
- **CRUD Operations** - Complete database interaction layer

### Additional Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **React Router** - Client-side routing
- **React Query** - Server state management and caching

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
- MongoDB (local installation)

### Installation

1. **Clone the repository**
   ```bash
   git clone 
   cd data-visualization-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB (Local Installation)**
   ```bash
   # Install MongoDB Community Edition
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community

   # Ubuntu/Debian
   sudo apt-get install -y mongodb

   # Windows - Download from MongoDB official website
   ```

4. **Start MongoDB service**
   ```bash
   # macOS/Linux
   brew services start mongodb-community
   # or
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

5. **Configure database connection**
   ```bash
   # Create .env file in root directory
   MONGODB_URI=mongodb://localhost:27017/datavisualization
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:8080`

## 📚 API Endpoints

### Datasets
- `GET /api/datasets` - Retrieve all datasets
- `POST /api/datasets` - Create a new dataset
- `PUT /api/datasets/:id` - Update a specific dataset
- `DELETE /api/datasets/:id` - Delete a dataset

### Data Points
- `GET /api/datasets/:id/data` - Get all data points for a dataset
- `POST /api/datasets/:id/data` - Add a new data point
- `PUT /api/datasets/:id/data/:pointId` - Update a data point
- `DELETE /api/datasets/:id/data/:pointId` - Delete a data point

### Sample API Usage with Postman

#### Create a New Dataset
```json
POST /api/datasets
Content-Type: application/json

{
  "name": "Sales Data Q1",
  "chartType": "line",
  "data": [
    {"x": 1, "y": 100, "label": "January"},
    {"x": 2, "y": 150, "label": "February"},
    {"x": 3, "y": 200, "label": "March"}
  ]
}
```

#### Add Data Point
```json
POST /api/datasets/1/data
Content-Type: application/json

{
  "x": 4,
  "y": 175,
  "label": "April",
  "color": "#8B5CF6"
}
```

## 🎯 Usage Guide

### Creating Your First Chart

1. **Start the Application**
   - Run `npm run dev` and open `http://localhost:8080`

2. **Create a Dataset**
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

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── charts/
│   │   ├── ChartContainer.tsx    # 2D chart rendering
│   │   └── ThreeDChart.tsx       # 3D chart implementation
│   ├── data/
│   │   └── DataTable.tsx         # Data management interface
│   └── ui/                       # Reusable UI components
├── pages/
│   └── Index.tsx                 # Main application page
├── hooks/                        # Custom React hooks
└── lib/                         # Utility functions
```

### Key Components

- **ChartContainer**: Handles all 2D chart types using Recharts
- **ThreeDChart**: Custom 3D visualization using Canvas API
- **DataTable**: Full CRUD interface for data management
- **Index**: Main dashboard orchestrating all components

## 🌟 Features Demonstration

### Sample Data Sets
The application comes with pre-loaded sample datasets:

1. **Sales Performance** - Line chart showing monthly sales trends
2. **User Growth** - Bar chart displaying yearly user acquisition
3. **Revenue Analysis** - 3D visualization of quarterly revenue data

### Chart Interactions
- **Hover Effects**: Beautiful animations on data point hover
- **Real-time Updates**: Charts automatically update when data changes
- **Responsive Design**: Charts adapt to different screen sizes
- **Color Customization**: Each data point can have custom colors

## 🙏 Acknowledgments

- **Recharts** - For the amazing charting library
- **Shadcn/ui** - For the beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **MongoDB** - For the robust database solution

---

