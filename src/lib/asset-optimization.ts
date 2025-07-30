// Asset optimization utilities

export interface AssetOptimizationConfig {
  images: {
    quality: number;
    formats: string[];
    sizes: number[];
    placeholder: 'blur' | 'empty';
  };
  fonts: {
    preload: string[];
    display: 'swap' | 'fallback' | 'optional';
  };
  css: {
    purge: boolean;
    minify: boolean;
  };
  js: {
    minify: boolean;
    treeshake: boolean;
    splitChunks: boolean;
  };
}

export const DEFAULT_OPTIMIZATION_CONFIG: AssetOptimizationConfig = {
  images: {
    quality: 75,
    formats: ['webp', 'avif'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    placeholder: 'blur',
  },
  fonts: {
    preload: ['Inter-Regular.woff2', 'Inter-Medium.woff2', 'Inter-SemiBold.woff2'],
    display: 'swap',
  },
  css: {
    purge: true,
    minify: true,
  },
  js: {
    minify: true,
    treeshake: true,
    splitChunks: true,
  },
};

// Image optimization utilities
export class ImageOptimizer {
  static generateSrcSet(src: string, sizes: number[]): string {
    return sizes
      .map(size => `${src}?w=${size}&q=75 ${size}w`)
      .join(', ');
  }

  static generateBlurDataURL(width: number, height: number, color = '#f3f4f6'): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#f9fafb;stop-opacity:0.8" />
          </linearGradient>
        </defs>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  static getOptimalImageProps(
    src: string,
    width: number,
    height: number,
    priority = false
  ) {
    return {
      src,
      width,
      height,
      priority,
      quality: priority ? 85 : 75,
      placeholder: 'blur' as const,
      blurDataURL: this.generateBlurDataURL(width, height),
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    };
  }
}

// Font optimization utilities
export class FontOptimizer {
  static generateFontFaceCSS(
    family: string,
    src: string,
    weight = '400',
    style = 'normal',
    display = 'swap'
  ): string {
    return `
      @font-face {
        font-family: '${family}';
        src: url('${src}') format('woff2');
        font-weight: ${weight};
        font-style: ${style};
        font-display: ${display};
      }
    `;
  }

  static preloadFont(href: string, crossorigin = 'anonymous'): void {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = href;
      link.crossOrigin = crossorigin;
      document.head.appendChild(link);
    }
  }

  static getFontLoadingCSS(): string {
    return `
      /* Font loading optimization */
      .font-loading {
        font-family: system-ui, -apple-system, sans-serif;
      }
      
      .font-loaded {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      
      /* Prevent layout shift during font loading */
      .font-loading * {
        font-synthesis: none;
        font-kerning: auto;
        font-variant-ligatures: none;
      }
    `;
  }
}

// CSS optimization utilities
export class CSSOptimizer {
  static generateCriticalCSS(): string {
    return `
      /* Critical CSS for above-the-fold content */
      body {
        margin: 0;
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background-color: #ffffff;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .header {
        height: 64px;
        border-bottom: 1px solid #e5e7eb;
        background-color: #ffffff;
      }
      
      .loading-skeleton {
        background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Dark mode critical styles */
      @media (prefers-color-scheme: dark) {
        body {
          color: #f9fafb;
          background-color: #111827;
        }
        
        .header {
          border-bottom-color: #374151;
          background-color: #1f2937;
        }
      }
    `;
  }

  static inlineCSS(css: string): string {
    return `<style>${css.replace(/\s+/g, ' ').trim()}</style>`;
  }
}

// JavaScript optimization utilities
export class JSOptimizer {
  static generateModulePreloadTags(modules: string[]): string {
    return modules
      .map(module => `<link rel="modulepreload" href="${module}">`)
      .join('\n');
  }

  static generatePreconnectTags(domains: string[]): string {
    return domains
      .map(domain => `<link rel="preconnect" href="${domain}" crossorigin>`)
      .join('\n');
  }

  static getTreeShakingConfig() {
    return {
      // Lodash tree shaking
      lodash: {
        transform: 'lodash-webpack-plugin',
        config: {
          collections: false,
          paths: false,
        },
      },
      
      // Moment.js replacement with date-fns
      moment: {
        replacement: 'date-fns',
        reason: 'Smaller bundle size and better tree shaking',
      },
      
      // Chart.js tree shaking
      chartjs: {
        imports: [
          'Chart',
          'CategoryScale',
          'LinearScale',
          'PointElement',
          'LineElement',
          'Title',
          'Tooltip',
          'Legend',
        ],
      },
    };
  }
}

// Performance monitoring for assets
export class AssetPerformanceMonitor {
  static trackAssetLoading(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        // Track image loading performance
        if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
          const loadTime = resource.responseEnd - resource.requestStart;
          const size = resource.transferSize || 0;
          
          if (loadTime > 1000) {
            console.warn(`Slow image loading: ${resource.name} (${Math.round(loadTime)}ms)`);
          }
          
          if (size > 500000) { // > 500KB
            console.warn(`Large image: ${resource.name} (${Math.round(size / 1024)}KB)`);
          }
        }
        
        // Track font loading performance
        if (resource.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
          const loadTime = resource.responseEnd - resource.requestStart;
          
          if (loadTime > 2000) {
            console.warn(`Slow font loading: ${resource.name} (${Math.round(loadTime)}ms)`);
          }
        }
        
        // Track CSS loading performance
        if (resource.name.match(/\.css$/i)) {
          const loadTime = resource.responseEnd - resource.requestStart;
          const size = resource.transferSize || 0;
          
          if (loadTime > 1000) {
            console.warn(`Slow CSS loading: ${resource.name} (${Math.round(loadTime)}ms)`);
          }
          
          if (size > 100000) { // > 100KB
            console.warn(`Large CSS file: ${resource.name} (${Math.round(size / 1024)}KB)`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    // Clean up after 30 seconds
    setTimeout(() => observer.disconnect(), 30000);
  }

  static measureCLS(): void {
    if (typeof window === 'undefined') return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      if (clsValue > 0.1) {
        console.warn(`High Cumulative Layout Shift: ${clsValue.toFixed(3)}`);
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
}

// Initialize asset performance monitoring
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  AssetPerformanceMonitor.trackAssetLoading();
  AssetPerformanceMonitor.measureCLS();
}