import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyCeR8r56I9JEmd3KuSLdpTC59UetCFCj18',
  authDomain:        'em-canto-artesanato-2026.firebaseapp.com',
  projectId:         'em-canto-artesanato-2026',
  storageBucket:     'em-canto-artesanato-2026.firebasestorage.app',
  messagingSenderId: '963719159977',
  appId:             '1:963719159977:web:39b6028138ee2fab28c9b8',
}

export const app = initializeApp(firebaseConfig)
export const db  = getFirestore(app)
