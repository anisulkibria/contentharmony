module.exports = {
    // purge: [],
    // purge: {
    //   enabled: true,
    //   content: ['*.hbs', 'partials/*.hbs'],
    // }, 
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
          'white': '#ffffff',
        },
      },
      container: {
        // center: true,
        // padding: '2rem',
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('tailwindcss'),
      require('autoprefixer')
     ],
  }
  