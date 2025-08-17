# 📊 Analytics Dashboard

A modern, responsive analytics dashboard built with Next.js 15, featuring advanced data visualization, interactive filtering, and comprehensive export capabilities.

## 🚀 Live Demo

**Production URL**: demo-analytics-dashboard.netlify.app/

## ✨ Features

### 📈 **Data Visualization**
- **Interactive Charts**: Bar charts, pie charts, and line charts with real-time data
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Theme Support**: Complete light/dark mode with smooth transitions
- **Magic UI Effects**: Professional animations and visual enhancements

### 🔍 **Advanced Filtering System**
- **Three Filtering Modes**:
  - **Basic Search**: Real-time text search across all fields (75 records)
  - **Advanced Filters**: Multi-criteria filtering with column-specific options (200 records)
  - **Performance Mode**: Optimized for large datasets with virtualization (750+ records)
- **Filter Types**:
  - Performance categorization (Excellent, Good, Fair, Poor)
  - Range sliders for cost, revenue, impressions
  - Date range picker with presets
  - Multi-select dropdowns for categories, status, device targeting
  - Quick filters for profitability and active campaigns

### 📊 **Data Management**
- **Smart Data Table**: Sortable columns with advanced pagination
- **Virtual Scrolling**: Handles large datasets (750+ records) efficiently
- **Search & Filter**: Real-time search with debounced queries
- **Export Capabilities**: CSV and PDF export with professional formatting
- **Mobile Optimized**: Hidden scrollbars with touch-friendly horizontal scrolling

### 📤 **Export Functionality**
- **CSV Export**: Complete filtered datasets with calculated metrics
- **PDF Export**: Professional reports with executive summaries
- **Custom Filenames**: Automatic timestamp inclusion
- **Export States**: Loading indicators and success notifications

### 🎨 **User Experience**
- **Modern UI**: Clean, professional interface with Magic UI enhancements
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized bundle size with dynamic imports
- **Responsive**: Mobile-first design with desktop enhancements

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### **Styling & UI**
- **Tailwind CSS 4** - Utility-first CSS framework
- **Tailwind Animate CSS** - Enhanced animations
- **Magic UI Components** - Professional UI enhancements
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions

### **Data Visualization**
- **Recharts 3.1.0** - Modern chart library
- **Chart.js 4.5.0** - Flexible charting
- **Tremor React** - Analytics-focused components

### **Data Management**
- **TanStack React Table 8** - Powerful table functionality
- **React Window** - Virtual scrolling for performance
- **React CSV** - CSV export functionality
- **jsPDF** - PDF generation

### **Development Tools**
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **Webpack Bundle Analyzer** - Bundle optimization

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ 
- npm, yarn, or pnpm

### **1. Clone Repository**
```bash
git clone <repository-url>
cd analytics-dashboard
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### **4. Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build & Deployment

### **Production Build**
```bash
npm run build
npm run start
```

### **Bundle Analysis**
```bash
npm run build:analyze
```

### **Import Optimization**
```bash
npm run optimize:imports
npm run optimize:build
```

### **Netlify Deployment**
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy automatically on push to main branch

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── DataTable.tsx          # Main data table
│   │   ├── UnifiedFilteringDemo.tsx # Unified filtering system
│   │   ├── ChartContainer.tsx     # Chart wrapper
│   │   ├── MetricCard.tsx         # KPI metric cards
│   │   ├── FilterPanel.tsx        # Advanced filter controls
│   │   ├── ExportButtons.tsx      # Export functionality
│   │   └── VirtualTable.tsx       # Virtual scrolling table
│   ├── ui/                # Reusable UI components
│   │   ├── magic-card.tsx         # Magic UI card component
│   │   ├── border-beam.tsx        # Animated border effects
│   │   ├── number-ticker.tsx      # Animated numbers
│   │   └── [other-ui-components]
│   └── layout/            # Layout components
│       ├── header.tsx
│       └── footer.tsx
├── hooks/                 # Custom React hooks
│   ├── useExport.ts       # Export functionality
│   ├── useDebounce.ts     # Debounced search
│   └── useRealTimeData.ts # Real-time data simulation
└── lib/                   # Utilities & configurations
    ├── data.ts            # Mock data generation
    ├── utils.ts           # Utility functions
    └── chart-config.ts    # Chart configurations
```

## 🔧 Configuration

### **Environment Variables**
Create `.env.local` for local development:
```env
# Add any environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Build Configuration**
- **next.config.ts**: Next.js configuration with bundle analysis
- **tailwind.config.ts**: Tailwind CSS customization
- **components.json**: Shadcn/ui component configuration

## 🎯 Key Features Breakdown

### **1. Unified Data Filtering System**
- **Location**: `src/components/dashboard/UnifiedFilteringDemo.tsx`
- **Modes**: Basic (75 records), Advanced (200 records), Performance (750+ records)
- **Features**: Real-time search, advanced filters, export, virtual scrolling

### **2. Interactive Data Table**
- **Location**: `src/components/dashboard/DataTable.tsx`
- **Features**: Sorting, pagination, filtering, export, mobile scrolling
- **Performance**: Virtual scrolling for large datasets

### **3. Export System**
- **CSV Export**: `src/hooks/useExport.ts`
- **PDF Export**: `src/components/dashboard/PDFExportService.ts`
- **Features**: Professional formatting, metadata inclusion, progress indicators

### **4. Chart Visualizations**
- **Components**: BarChart.tsx, PieChart.tsx, LineChart.tsx
- **Features**: Responsive design, theme support, interactive tooltips
- **Library**: Recharts with custom styling

### **5. Magic UI Integration**
- **Components**: MagicCard, BorderBeam, NumberTicker, AuroraText
- **Features**: Professional animations, hover effects, gradient text
- **Performance**: Optimized animations with reduced motion support

## 📊 Performance Optimizations

### **Bundle Optimization**
- Dynamic imports for heavy components
- Code splitting by feature
- Tree shaking for unused code
- Webpack bundle analysis

### **Runtime Performance**
- Virtual scrolling for large datasets
- Debounced search inputs
- Memoized filter computations
- Optimized re-renders

### **User Experience**
- Skeleton loading states
- Progressive enhancement
- Touch-friendly mobile interactions
- Smooth theme transitions

## 🧪 Testing

### **Verification Scripts**
- `verify-accessibility.js` - Accessibility compliance
- `verify-csv-export.js` - CSV export functionality
- `verify-filtering.js` - Filter system validation
- `verify-pdf-export.js` - PDF export testing

### **Component Tests**
Located in `__tests__` directories throughout the codebase.

## 🚀 Production Readiness

### **✅ Production Features**
- Clean, professional UI without debug elements
- Optimized bundle size and performance
- Complete responsive design
- Accessibility compliance (WCAG)
- Error boundaries and error handling
- SEO optimization with Next.js
- Theme persistence across sessions

### **✅ Deployment Ready**
- Environment variable support
- Build optimization scripts
- Static asset optimization
- Progressive Web App features
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or support, please contact:
- **Project Lead**: [Your Name]
- **Email**: [Your Email]
- **Repository**: [Repository URL]

---

**Built with ❤️ using Next.js, React, and modern web technologies.**
