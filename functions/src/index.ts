import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const KEEP_EVENT = false;

admin.initializeApp();

exports.updateTodo = functions.firestore.document('events/{Id}')
  .onWrite((change, context) => {
    const dat = change.after.data() as any;
    if (!dat) return;

    const { uid, event, data } = dat;
    console.log('===>', uid, event, data);

    const db = admin.firestore();
    const del = () =>  !KEEP_EVENT && db.doc(`events/${context.params.Id}`).delete();

    const todos = db.collection('/todos');
    switch (event) {
      case '@create-todo':
        data.uid = uid;
        data.timestamp = admin.firestore.FieldValue.serverTimestamp();
        return todos.add(data).then(()=>del());
      case '@update-todo':
        data.uid = uid;
        return todos.doc(data.id).update(data).then(()=>del());
      case '@delete-todo':
        return todos.doc(data.id).delete().then(()=>del());
      case '@delete-all-todo':
        return todos.get().then(function (querySnapshot) {
          const batch = db.batch();
          querySnapshot.forEach(function (doc) {
            batch.delete(doc.ref);
          });
          return batch.commit().then(()=>del());;
        });
      default: return;
    }

});
