/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic color palette - unique to AetherForge Sentinel
        'aether-black': '#0A0A0A',
        'aether-cyan': '#00FFFF',
        'aether-magenta': '#FF00FF',
        'aether-gold': '#FFD700',
        'aether-void': '#000000',
        'aether-neon': '#00FF41',
        'aether-purple': '#8A2BE2',
        'aether-blue': '#0066FF',
        'aether-orange': '#FF6B35',
        'aether-green': '#39FF14',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        // Unique AetherForge animations
        "aether-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px #00FFFF, 0 0 40px #00FFFF, 0 0 60px #00FFFF",
            filter: "brightness(1)"
          },
          "50%": { 
            boxShadow: "0 0 40px #00FFFF, 0 0 80px #00FFFF, 0 0 120px #00FFFF",
            filter: "brightness(1.5)"
          }
        },
        "portal-warp": {
          "0%": { 
            transform: "scale(1) rotate(0deg)",
            filter: "hue-rotate(0deg)"
          },
          "50%": { 
            transform: "scale(1.1) rotate(180deg)",
            filter: "hue-rotate(180deg)"
          },
          "100%": { 
            transform: "scale(1) rotate(360deg)",
            filter: "hue-rotate(360deg)"
          }
        },
        "nebula-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" }
        },
        "particle-burst": {
          "0%": { 
            transform: "scale(0) rotate(0deg)",
            opacity: "1"
          },
          "100%": { 
            transform: "scale(1) rotate(360deg)",
            opacity: "0"
          }
        },
        "hologram-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "quantum-shift": {
          "0%": { transform: "translateX(0) scale(1)" },
          "25%": { transform: "translateX(100px) scale(0.8)" },
          "50%": { transform: "translateX(0) scale(1.2)" },
          "75%": { transform: "translateX(-100px) scale(0.8)" },
          "100%": { transform: "translateX(0) scale(1)" }
        },
        "rift-open": {
          "0%": { 
            clipPath: "inset(0 0 0 0)",
            transform: "scale(1)"
          },
          "50%": { 
            clipPath: "inset(20% 20% 20% 20%)",
            transform: "scale(1.2)"
          },
          "100%": { 
            clipPath: "inset(0 0 0 0)",
            transform: "scale(1)"
          }
        }
      },
      animation: {
        "aether-glow": "aether-glow 3s ease-in-out infinite",
        "portal-warp": "portal-warp 4s linear infinite",
        "nebula-float": "nebula-float 6s ease-in-out infinite",
        "particle-burst": "particle-burst 1s ease-out forwards",
        "hologram-flicker": "hologram-flicker 2s ease-in-out infinite",
        "quantum-shift": "quantum-shift 3s ease-in-out infinite",
        "rift-open": "rift-open 2s ease-in-out forwards"
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at center, #0A0A0A 0%, #000000 100%)',
        'nebula-pattern': 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
        'portal-glow': 'radial-gradient(circle at center, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
