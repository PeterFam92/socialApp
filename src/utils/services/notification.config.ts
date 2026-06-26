import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import * as admin from "firebase-admin"


const serviceAccount = JSON.parse(
  readFileSync(resolve("./src/config/social-app-ec831-firebase-adminsdk-fbsvc-d16d853678.json"), "utf-8")
)


const firebaseApp = admin.getApps().length > 0 ? admin.getApp() :
admin.initializeApp({
  credential: admin.cert(serviceAccount),
})

export default firebaseApp