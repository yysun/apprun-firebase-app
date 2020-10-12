import app from 'apprun';
import Home from './components/home';
import firebase_init from './firebase';

document.addEventListener('DOMContentLoaded', firebase_init);
app.render(document.body, <Home />);
