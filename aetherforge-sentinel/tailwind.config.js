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
        'aether-black': '#0A0A0A',
        'aether-cyan': '#00FFFF',
        'aether-magenta': '#FF00FF',
        'aether-gold': '#FFD700',
        'aether-blue': '#0066FF',
        'aether-purple': '#9933FF',
        'aether-green': '#00FF66',
        'aether-red': '#FF0066',
        'aether-orange': '#FF6600',
        'aether-pink': '#FF66FF',
        'aether-teal': '#00FFFF',
        'aether-indigo': '#6600FF',
        'aether-yellow': '#FFFF00',
        'aether-lime': '#66FF00',
        'aether-emerald': '#00FF99',
        'aether-rose': '#FF0066',
        'aether-slate': '#1E293B',
        'aether-gray': '#374151',
        'aether-zinc': '#52525B',
        'aether-neutral': '#525252',
        'aether-stone': '#78716C',
        'aether-red-dark': '#7F1D1D',
        'aether-orange-dark': '#9A3412',
        'aether-amber-dark': '#92400E',
        'aether-yellow-dark': '#854D0E',
        'aether-lime-dark': '#3F6212',
        'aether-green-dark': '#14532D',
        'aether-emerald-dark': '#064E3B',
        'aether-teal-dark': '#134E4A',
        'aether-cyan-dark': '#164E63',
        'aether-sky-dark': '#0C4A6E',
        'aether-blue-dark': '#1E3A8A',
        'aether-indigo-dark': '#312E81',
        'aether-violet-dark': '#4C1D95',
        'aether-purple-dark': '#581C87',
        'aether-fuchsia-dark': '#701A75',
        'aether-pink-dark': '#831843',
        'aether-rose-dark': '#9F1239',
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
        "aether-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)" }
        },
        "portal-warp": {
          "0%": { transform: "scale(1) rotateY(0deg)" },
          "50%": { transform: "scale(1.1) rotateY(180deg)" },
          "100%": { transform: "scale(1) rotateY(360deg)" }
        },
        "nebula-float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" }
        },
        "particle-burst": {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "0" }
        },
        "hologram-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" }
        },
        "quantum-shift": {
          "0%": { transform: "translateX(0) scale(1)" },
          "50%": { transform: "translateX(100px) scale(1.2)" },
          "100%": { transform: "translateX(0) scale(1)" }
        },
        "rift-open": {
          "0%": { clipPath: "inset(0 0 0 0)" },
          "50%": { clipPath: "inset(0 45% 0 45%)" },
          "100%": { clipPath: "inset(0 0 0 0)" }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "aether-glow": "aether-glow 3s ease-in-out infinite",
        "portal-warp": "portal-warp 4s linear infinite",
        "nebula-float": "nebula-float 6s ease-in-out infinite",
        "particle-burst": "particle-burst 0.6s ease-out",
        "hologram-flicker": "hologram-flicker 2s ease-in-out infinite",
        "quantum-shift": "quantum-shift 3s ease-in-out infinite",
        "rift-open": "rift-open 1.5s ease-in-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at center, #0A0A0A 0%, #000000 100%)',
        'nebula-pattern': 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
        'portal-glow': 'radial-gradient(circle at center, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
        'hologram-sweep': 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
