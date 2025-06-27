const ghpages = require('gh-pages');

ghpages.publish('build', {
  message: 'Deploy React app to GitHub Pages',
  dotfiles: true,
  add: true,
  remove: false, // evita git rm (e quindi evita E2BIG)
  history: false // sovrascrive tutto, non aggiunge commit separati per file
}, function (err) {
  if (err) {
    console.error('Deploy failed:', err);
  } else {
    console.log('✅ Deploy successful!');
  }
});