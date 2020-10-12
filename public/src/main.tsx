import app from 'apprun';
import Home from './components/home';
import firebase_init from './firebase';

app.on('@saving', () => {
  document.getElementById('spinner').classList.remove('d-none');
});

// app.on('@done', () => {
//   document.getElementById('spinner').classList.add('d-none');
// });

app.render(document.body, <Home />);
document.addEventListener('DOMContentLoaded', firebase_init);
