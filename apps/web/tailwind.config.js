/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#115E4D",
        citrus: "#F6B316",
        ember: "#F36A2D",
        cream: "#FBF6EF",
        ink: "#111111"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(243, 106, 45, 0.18)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(246, 179, 22, 0.28), transparent 34%), linear-gradient(135deg, #0f1e1a 0%, #111111 50%, #171717 100%)"
      }
    }
  },
  plugins: []
};
