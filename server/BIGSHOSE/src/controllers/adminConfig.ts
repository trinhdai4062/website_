// adminConfig.ts
import * as admin from 'firebase-admin';
import path from 'path';


const SERVICE_ACCOUNT_FILE = path.join(__dirname, '../../uploads/bigshose-f812.json'); // Adjust the path

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT_FILE),
  databaseURL: "https://bigshose-f8122-default-rtdb.asia-southeast1.firebasedatabase.app"
  // databaseURL không cần thiết nếu chỉ dùng Firestore
});

export default admin;
