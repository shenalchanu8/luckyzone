/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#115E4D",
        citrus: "#F6B316",
        ember: "#F36A2D",
        slatepanel: "#111827"
      }
    }
  },
  plugins: []
};
