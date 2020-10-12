import app from 'apprun';

declare var firebase;
export default async () => {
  try {
    let app = firebase.app();
    let features = [
      'auth',
      'firestore',
      'messaging',
      'storage',
      'analytics',
      'remoteConfig',
      'performance',
    ].filter(feature => typeof app[feature] === 'function');
    console.log(`Firebase SDK loaded with ${features.join(', ')}`);

    // firebase.auth().onAuthStateChanged(user_init);
    // firebase.auth().signInWithCustomToken(window['firebase_token']);

    const db = firebase.firestore();
    if (location.hostname === 'localhost') {
      db.settings({
        host: 'localhost:8080',
        ssl: false
      });
    }
    user_init('test', db);

  } catch (e) {
    console.error(e);
    app.run('#error', e);
  }
}

async function user_init(uid, db) {
  //await db.enablePersistence();
  //app.run('@user_signin', uid);
  db.collection(`users`).doc(uid).set({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  db.collection(`events`).where('uid', '==', uid).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(function (change) {
      if (change.type === 'added') {
        if (change.doc.metadata.hasPendingWrites) app.run('@saving')
        // } else if (change.type === 'removed') {
        //   app.run('@done')
      }
    });
  });
  app.on('//:', (event, data = {}) => {
    db.collection(`events`).add({ uid, event, data })
  })

  db.collection('todos')
    .where('uid', '==', uid)
    .orderBy('timestamp')
    .onSnapshot(snapshot => app.run('@show-todos', snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  );

}
