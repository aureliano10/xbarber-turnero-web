
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: string;
}

export interface Appointment {
  id: string;
  userId: string;
  service: string;
  appointmentDate: Timestamp;
  createdAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  customerName: string; 
  email: string;
}

export type AppointmentStatus = 'pending' | 'approved' | 'rejected';

export type NewAppointmentData = Omit<Appointment, 'id' | 'createdAt' | 'status'>;

const appointmentsCollection = collection(db, 'appointments');
const usersCollection = collection(db, 'users');

export const getAppointmentsSubscription = (callback: (appointments: Appointment[]) => void) => {
  const unsubscribe = onSnapshot(appointmentsCollection, (snapshot) => {
    const appointments: Appointment[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Appointment, 'id'>),
    }));
    callback(appointments);
  });

  return unsubscribe;
};


export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const snapshot = await getDocs(appointmentsCollection);
    const appointments: Appointment[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Appointment, 'id'>),
    }));
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments: ", error);
    return [];
  }
};

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const q = query(appointmentsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Appointment, 'id'>),
    }));
  } catch (error) {
    console.error(`Error fetching appointments for user ${userId}: `, error);
    return [];
  }
};

export const addAppointment = async (appointmentData: NewAppointmentData): Promise<string | null> => {
  try {
    const userRef = doc(db, 'users', appointmentData.userId);
    const userSnap = await getDoc(userRef);
    const userName = userSnap.exists() ? userSnap.data().displayName : 'Nombre no encontrado';

    const finalAppointmentData = {
      ...appointmentData,
      customerName: userName || 'Usuario sin nombre',
      status: 'pending' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(appointmentsCollection, finalAppointmentData);
    return docRef.id;

  } catch (error) {
    console.error("❌ Firestore Write Error:", error);
    return null;
  }
};


export const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus): Promise<boolean> => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { status });
    return true;
  } catch (error) {
    console.error(`Error updating appointment ${appointmentId}: `, error);
    return false;
  }
};

// --- NUEVA FUNCIÓN: Para corregir nombres en turnos existentes ---
export const updateAppointmentCustomerName = async (appointmentId: string, userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const correctName = userSnap.data().displayName;
      if (correctName) {
        const appointmentRef = doc(db, 'appointments', appointmentId);
        await updateDoc(appointmentRef, { customerName: correctName });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error correcting customer name for appointment ${appointmentId}:`, error);
    return false;
  }
};


export const deleteAppointment = async (appointmentId: string): Promise<boolean> => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(appointmentRef);
    return true;
  } catch (error) {
    console.error(`Error deleting appointment ${appointmentId}: `, error);
    return false;
  }
};
