import admin, { ServiceAccount } from 'firebase-admin';
// import serviceAccount from '../elearning-crm-firebase-adminsdk.json';

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as ServiceAccount),
// });

export const messaging = admin.messaging();