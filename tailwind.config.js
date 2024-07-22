/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    
    extend: {

      colors: {
        darkblue : "#111928",
        darkblue2 : "#263b57",
        darkblue3 : "#364a5e",


      },
      flex: {
        '2': '2 2 0%' // Equivalent to `flex: 2 2 0%;`
      }

    },
  },
  plugins: [
    
  ],
}

