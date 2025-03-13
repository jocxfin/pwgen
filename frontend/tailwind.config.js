
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: '#1e293b',  
        altBg: '#0f172a',    
        primary: {
          DEFAULT: '#334155', 
          dark: '#1e293b',   
          light: '#475569'    
        },
        headerColor: '#f8fafc',
        accent: {
          DEFAULT: '#8b5cf6', 
          secondary: '#a855f7', 
          tertiary: '#d946ef'  
        },
        textColor: '#f1f5f9',
        success: '#10b981',  
        warning: '#f59e0b',  
        danger: '#ef4444'    
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
