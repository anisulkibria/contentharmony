module.exports = {
    // purge: [],
    purge: {
      enabled: true,
      content: ['*.hbs', 'partials/*.hbs'],
    }, 
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        colors: {
        test_color: {
            light: '#999999',
            DEFAULT: '#666666',
            dark: '#333333',
            },
        },
      },
      container: {
        center: true,
        padding: '2rem',
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
  