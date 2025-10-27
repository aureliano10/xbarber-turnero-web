
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
} from 'firebase/firestore';
import { db } from './firebase';

// --- Estructura de un usuario (para referencia) ---
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: string;
}

// --- Estructura de un turno, ahora con datos de usuario anidados ---
export interface Appointment {
  id: string;
  userId: string;
  service: string;
  appointmentDate: Timestamp;
  createdAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  // Datos denormalizados del usuario para acceso rápido
  customerName: string; 
  email: string;
}

export type AppointmentStatus = 'pending' | 'approved' | 'rejected';

// --- Tipo para crear un nuevo turno ---
export type NewAppointmentData = Omit<Appointment, 'id' | 'createdAt' | 'status'>;

const appointmentsCollection = collection(db, 'appointments');
const usersCollection = collection(db, 'users');

// --- Obtener TODOS los turnos (para el Admin) ---
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

// --- Obtener los turnos de UN usuario específico ---
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

// --- Añadir un nuevo turno ---
export const addAppointment = async (appointmentData: NewAppointmentData): Promise<string | null> => {
  try {
    const docRef = await addDoc(appointmentsCollection, {
      ...appointmentData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("❌ Firestore Write Error:", error);
    return null;
  }
};

// --- Actualizar el estado de un turno ---
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

// --- Eliminar un turno ---
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
