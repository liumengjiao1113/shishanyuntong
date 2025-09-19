const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

(async () => {
  const files = await imagemin(['images/*.{jpg,png}'], {
    destination: 'images/compressed',
    plugins: [
      imageminWebp({quality: 80})
    ]
  });

  console.log('Images optimized:', files);
})();