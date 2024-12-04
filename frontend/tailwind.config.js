/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: 'true',
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			textColor: {
				gradient: 'linear-gradient(to right, #ffffff, #a855f7, #3b82f6)'
			},
			backgroundImage: {
				'instagram-gradient': 'linear-gradient(35deg, #f9ce34, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
				'instagram-gradient-light': 'linear-gradient(35deg, #fcd950, #fa851e, #d23976, #a033cc, #4F5BF1)',
				
			},
			transitionProperty: {
				top: 'top'
			},
			transitionDuration: {
				'300': '300ms',
				'500': '500ms',
				'700': '700ms',
				'1000': '1000ms'
			},
			transitionTimingFunction: {
				'ease-in-out': 'ease-in-out'
			},
			spacing: {
				'18': '4.5rem'
			},
			boxShadow: {
				transparent: '0 1px 2px 0 rgba(0, 0, 0, 0)',
				'top-custom': '`0 -15px 10px -2px rgba(0, 0, 0, 0.5)`'
			},
			colors: {
				bodyColor: '#212121',
				sidebarColor: '#171717',
				inputColor: '#2F2F2F',
				textColor: '#ECECEC',
				buttonColor: '#484848',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				shimmer: {
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gradient-x': {
					'0%, 100%': { 'background-position': 'left center' },
					'50%': { 'background-position': 'right center' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-x': 'gradient-x 15s ease infinite',
			}
		}
	},
	plugins: [
		// eslint-disable-next-line no-undef
		require("tailwindcss-animate"),
		function ({ addBase }) {
			addBase({
				// For Chrome, Safari, Edge, Opera
				'input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button': {
					'-webkit-appearance': 'none',
					'margin': '0',
				},
				// For Firefox
				'input[type="number"]': {
					'-moz-appearance': 'textfield',
				},
			});
		},

		function ({ addUtilities }) {
			addUtilities({
				'.text-gradient': {
					background: 'linear-gradient(to right, #ffffff, #7e1ddb, #3b82f6)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
			}, ['responsive', 'hover'])
		}
	],
}