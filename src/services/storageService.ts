import {
  Pet,
  HealthRecord,
  Medication,
  DoseLog,
  CalendarEvent,
  DocumentItem,
  Reminder,
  FamilyMember,
  ActivityLog,
  UserProfile,
  PetWeightEntry,
} from '../types';
import {
  INITIAL_PETS,
  INITIAL_USER,
  INITIAL_HEALTH_RECORDS,
  INITIAL_MEDICATIONS,
  INITIAL_DOSE_LOGS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_DOCUMENTS,
  INITIAL_REMINDERS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_WEIGHT_HISTORY,
} from '../data/initialData';

const KEYS = {
  PETS: 'mipatas_pets_v1',
  SELECTED_PET_ID: 'mipatas_selected_pet_id_v1',
  USER: 'mipatas_user_v1',
  HEALTH_RECORDS: 'mipatas_health_records_v1',
  MEDICATIONS: 'mipatas_medications_v1',
  DOSE_LOGS: 'mipatas_dose_logs_v1',
  CALENDAR_EVENTS: 'mipatas_calendar_events_v1',
  DOCUMENTS: 'mipatas_documents_v1',
  REMINDERS: 'mipatas_reminders_v1',
  FAMILY_MEMBERS: 'mipatas_family_members_v1',
  ACTIVITY_LOGS: 'mipatas_activity_logs_v1',
  WEIGHT_HISTORY: 'mipatas_weight_history_v1',
  ONBOARDING_COMPLETED: 'mipatas_onboarding_completed_v1',
  IS_DEMO_MODE: 'mipatas_is_demo_mode_v1',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Onboarding flag
  isOnboardingCompleted(): boolean {
    return getItem<boolean>(KEYS.ONBOARDING_COMPLETED, false);
  },
  setOnboardingCompleted(completed: boolean): void {
    setItem(KEYS.ONBOARDING_COMPLETED, completed);
  },

  // User Profile
  getUser(): UserProfile {
    return getItem<UserProfile>(KEYS.USER, INITIAL_USER);
  },
  updateUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    setItem(KEYS.USER, updated);
    return updated;
  },

  // Pets
  getPets(): Pet[] {
    // Return empty array by default for new real users (never auto-seed demo data)
    return getItem<Pet[]>(KEYS.PETS, []);
  },
  savePets(pets: Pet[]): void {
    setItem(KEYS.PETS, pets);
  },
  getSelectedPetId(): string {
    const pets = this.getPets();
    const stored = getItem<string>(KEYS.SELECTED_PET_ID, '');
    if (stored && pets.some((p) => p.id === stored)) {
      return stored;
    }
    return pets[0]?.id || '';
  },
  setSelectedPetId(petId: string): void {
    setItem(KEYS.SELECTED_PET_ID, petId);
  },
  addPet(pet: Omit<Pet, 'id'>): Pet {
    const pets = this.getPets();
    const newPet: Pet = {
      ...pet,
      id: `pet-${Date.now()}`,
    };
    const updated = [...pets, newPet];
    this.savePets(updated);
    this.setSelectedPetId(newPet.id);
    this.setOnboardingCompleted(true);

    // Add initial weight entry
    if (newPet.weightKg) {
      this.addWeightEntry(newPet.id, {
        date: new Date().toISOString().split('T')[0],
        weightKg: newPet.weightKg,
        notes: 'Peso inicial de registro',
      });
    }

    // Add activity log
    this.addActivityLog(newPet.id, {
      userName: this.getUser().name || 'Propietario',
      userRole: 'propietario',
      actionType: 'nota',
      description: `Se registró a ${newPet.name} en MiPatas.`,
    });

    return newPet;
  },
  updatePet(petId: string, updates: Partial<Pet>): Pet | null {
    const pets = this.getPets();
    const idx = pets.findIndex((p) => p.id === petId);
    if (idx === -1) return null;
    pets[idx] = { ...pets[idx], ...updates };
    this.savePets(pets);
    return pets[idx];
  },
  deletePet(petId: string): void {
    const pets = this.getPets().filter((p) => p.id !== petId);
    this.savePets(pets);
    if (this.getSelectedPetId() === petId) {
      this.setSelectedPetId(pets[0]?.id || '');
    }
    // Also clean up associated records for this pet
    const health = this.getHealthRecords().filter((r) => r.petId !== petId);
    setItem(KEYS.HEALTH_RECORDS, health);

    const meds = this.getMedications().filter((m) => m.petId !== petId);
    setItem(KEYS.MEDICATIONS, meds);

    const evts = this.getCalendarEvents().filter((e) => e.petId !== petId);
    setItem(KEYS.CALENDAR_EVENTS, evts);

    const docs = this.getDocuments().filter((d) => d.petId !== petId);
    setItem(KEYS.DOCUMENTS, docs);

    const rems = this.getReminders().filter((r) => r.petId !== petId);
    setItem(KEYS.REMINDERS, rems);

    const doses = this.getDoseLogs().filter((d) => d.petId !== petId);
    setItem(KEYS.DOSE_LOGS, doses);

    const acts = this.getActivityLogs().filter((a) => a.petId !== petId);
    setItem(KEYS.ACTIVITY_LOGS, acts);

    const weights = getItem<Record<string, PetWeightEntry[]>>(KEYS.WEIGHT_HISTORY, {});
    delete weights[petId];
    setItem(KEYS.WEIGHT_HISTORY, weights);
  },

  // Weight History
  getWeightHistory(petId: string): PetWeightEntry[] {
    const all = getItem<Record<string, PetWeightEntry[]>>(KEYS.WEIGHT_HISTORY, {});
    return all[petId] || [];
  },
  addWeightEntry(petId: string, entry: Omit<PetWeightEntry, 'id'>): PetWeightEntry {
    const all = getItem<Record<string, PetWeightEntry[]>>(KEYS.WEIGHT_HISTORY, {});
    const petEntries = all[petId] || [];
    const newEntry: PetWeightEntry = {
      ...entry,
      id: `w-${Date.now()}`,
    };
    const updated = [...petEntries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    all[petId] = updated;
    setItem(KEYS.WEIGHT_HISTORY, all);

    // Update pet current weight
    this.updatePet(petId, { weightKg: entry.weightKg });

    // Add activity log
    this.addActivityLog(petId, {
      userName: this.getUser().name || 'Propietario',
      userRole: 'propietario',
      actionType: 'peso',
      description: `Se registró nuevo peso: ${entry.weightKg} kg (${entry.notes || 'control'}).`,
    });

    return newEntry;
  },

  // Health Records
  getHealthRecords(petId?: string): HealthRecord[] {
    const all = getItem<HealthRecord[]>(KEYS.HEALTH_RECORDS, []);
    if (!petId) return all;
    return all.filter((r) => r.petId === petId);
  },
  addHealthRecord(record: Omit<HealthRecord, 'id'>): HealthRecord {
    const all = this.getHealthRecords();
    const newRecord: HealthRecord = {
      ...record,
      id: `rec-${Date.now()}`,
    };
    const updated = [newRecord, ...all];
    setItem(KEYS.HEALTH_RECORDS, updated);

    // Activity log
    this.addActivityLog(record.petId, {
      userName: this.getUser().name || 'Propietario',
      userRole: 'propietario',
      actionType: 'nota',
      description: `Añadió registro de salud: ${record.title} (${record.category}).`,
    });

    return newRecord;
  },
  deleteHealthRecord(id: string): void {
    const all = this.getHealthRecords().filter((r) => r.id !== id);
    setItem(KEYS.HEALTH_RECORDS, all);
  },

  // Medications
  getMedications(petId?: string): Medication[] {
    const all = getItem<Medication[]>(KEYS.MEDICATIONS, []);
    if (!petId) return all;
    return all.filter((m) => m.petId === petId);
  },
  addMedication(med: Omit<Medication, 'id'>): Medication {
    const all = this.getMedications();
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}`,
      dosesGivenCount: 0,
    };
    const updated = [newMed, ...all];
    setItem(KEYS.MEDICATIONS, updated);

    // Activity log
    this.addActivityLog(med.petId, {
      userName: this.getUser().name || 'Propietario',
      userRole: 'propietario',
      actionType: 'medicamento',
      description: `Inició tratamiento: ${med.name} (${med.dosage}, ${med.frequency}).`,
    });

    return newMed;
  },
  updateMedication(id: string, updates: Partial<Medication>): Medication | null {
    const all = this.getMedications();
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    setItem(KEYS.MEDICATIONS, all);
    return all[idx];
  },
  deleteMedication(id: string): void {
    const all = this.getMedications().filter((m) => m.id !== id);
    setItem(KEYS.MEDICATIONS, all);
  },
  recordDose(
    petId: string,
    medicationId: string,
    administeredBy: string,
    notes?: string
  ): DoseLog {
    return this.recordDoseGiven(petId, medicationId, administeredBy, notes);
  },

  recordDoseGiven(
    petId: string,
    medicationId: string,
    administeredBy: string,
    notes?: string
  ): DoseLog {
    const medications = this.getMedications();
    const med = medications.find((m) => m.id === medicationId);
    const medName = med ? med.name : 'Medicamento';
    const dosage = med ? med.dosage : '';

    const newLog: DoseLog = {
      id: `dose-${Date.now()}`,
      petId,
      medicationId,
      medicationName: medName,
      dosage,
      timestamp: new Date().toISOString(),
      administeredBy,
      notes,
    };

    const doseLogs = getItem<DoseLog[]>(KEYS.DOSE_LOGS, []);
    setItem(KEYS.DOSE_LOGS, [newLog, ...doseLogs]);

    if (med) {
      this.updateMedication(medicationId, {
        dosesGivenCount: (med.dosesGivenCount || 0) + 1,
      });
    }

    // Shared family activity feed
    this.addActivityLog(petId, {
      userName: administeredBy,
      userRole: 'propietario',
      actionType: 'medicamento',
      description: `Le administró ${medName} (${dosage}). ${notes ? `"${notes}"` : ''}`,
    });

    return newLog;
  },
  getDoseLogs(petId?: string): DoseLog[] {
    const all = getItem<DoseLog[]>(KEYS.DOSE_LOGS, []);
    if (!petId) return all;
    return all.filter((l) => l.petId === petId);
  },

  // Calendar Events
  getCalendarEvents(petId?: string): CalendarEvent[] {
    const all = getItem<CalendarEvent[]>(KEYS.CALENDAR_EVENTS, []);
    if (!petId) return all;
    return all.filter((e) => e.petId === petId);
  },
  addCalendarEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const all = this.getCalendarEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    const updated = [...all, newEvent];
    setItem(KEYS.CALENDAR_EVENTS, updated);

    this.addActivityLog(event.petId, {
      userName: this.getUser().name || 'Propietario',
      userRole: 'propietario',
      actionType: 'cita',
      description: `Programó evento en agenda: ${event.title} para el ${event.date}.`,
    });

    return newEvent;
  },
  deleteCalendarEvent(id: string): void {
    const all = this.getCalendarEvents().filter((e) => e.id !== id);
    setItem(KEYS.CALENDAR_EVENTS, all);
  },
  toggleCalendarEventCompleted(id: string): void {
    const all = this.getCalendarEvents();
    const item = all.find((e) => e.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
      setItem(KEYS.CALENDAR_EVENTS, all);
    }
  },
  toggleCalendarEvent(id: string): void {
    this.toggleCalendarEventCompleted(id);
  },

  // Documents
  getDocuments(petId?: string): DocumentItem[] {
    const all = getItem<DocumentItem[]>(KEYS.DOCUMENTS, []);
    if (!petId) return all;
    return all.filter((d) => d.petId === petId);
  },
  addDocument(doc: Omit<DocumentItem, 'id'>): DocumentItem {
    const all = this.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    const updated = [newDoc, ...all];
    setItem(KEYS.DOCUMENTS, updated);

    this.addActivityLog(doc.petId, {
      userName: this.getUser().name || 'Propietario',
      userRole: 'propietario',
      actionType: 'documento',
      description: `Subió documento clínico: ${doc.title} (${doc.category}).`,
    });

    return newDoc;
  },
  updateDocument(id: string, updates: Partial<DocumentItem>): DocumentItem | null {
    const all = this.getDocuments();
    const idx = all.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    setItem(KEYS.DOCUMENTS, all);
    return all[idx];
  },
  deleteDocument(id: string): void {
    const all = this.getDocuments().filter((d) => d.id !== id);
    setItem(KEYS.DOCUMENTS, all);
  },

  // Reminders
  getReminders(petId?: string): Reminder[] {
    const all = getItem<Reminder[]>(KEYS.REMINDERS, []);
    if (!petId) return all;
    return all.filter((r) => r.petId === petId);
  },
  addReminder(rem: Omit<Reminder, 'id'>): Reminder {
    const all = this.getReminders();
    const newRem: Reminder = {
      ...rem,
      id: `rem-${Date.now()}`,
    };
    const updated = [newRem, ...all];
    setItem(KEYS.REMINDERS, updated);
    return newRem;
  },
  toggleReminder(id: string): void {
    const all = this.getReminders();
    const item = all.find((r) => r.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
      setItem(KEYS.REMINDERS, all);
    }
  },
  deleteReminder(id: string): void {
    const all = this.getReminders().filter((r) => r.id !== id);
    setItem(KEYS.REMINDERS, all);
  },

  // Family Members
  getFamilyMembers(): FamilyMember[] {
    return getItem<FamilyMember[]>(KEYS.FAMILY_MEMBERS, []);
  },
  addFamilyMember(member: Omit<FamilyMember, 'id'>): FamilyMember {
    const all = this.getFamilyMembers();
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}`,
    };
    const updated = [...all, newMember];
    setItem(KEYS.FAMILY_MEMBERS, updated);
    return newMember;
  },
  removeFamilyMember(id: string): void {
    const all = this.getFamilyMembers().filter((f) => f.id !== id);
    setItem(KEYS.FAMILY_MEMBERS, all);
  },
  deleteFamilyMember(id: string): void {
    this.removeFamilyMember(id);
  },

  // Activity Logs
  getActivityLogs(petId?: string): ActivityLog[] {
    const all = getItem<ActivityLog[]>(KEYS.ACTIVITY_LOGS, []);
    if (!petId) return all;
    return all.filter((a) => a.petId === petId);
  },
  addActivityLog(
    petId: string,
    entry: {
      userName: string;
      userRole: 'propietario' | 'familiar' | 'cuidador' | 'veterinario';
      actionType: 'medicamento' | 'paseo' | 'comida' | 'peso' | 'cita' | 'documento' | 'nota';
      description: string;
    }
  ): ActivityLog {
    const all = getItem<ActivityLog[]>(KEYS.ACTIVITY_LOGS, []);
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      petId,
      userName: entry.userName,
      userRole: entry.userRole,
      actionType: entry.actionType,
      description: entry.description,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...all].slice(0, 100);
    setItem(KEYS.ACTIVITY_LOGS, updated);
    return newLog;
  },

  // Initialization check (does not inject demo data automatically)
  init(): void {
    // Sanitize any legacy stray keys from past testing
    try {
      if (localStorage.getItem('isDemoMode') === 'true' && !localStorage.getItem(KEYS.PETS)) {
        localStorage.removeItem('isDemoMode');
      }
    } catch {}
  },

  // Demo Mode check
  isDemoMode(): boolean {
    try {
      const legacy = localStorage.getItem('isDemoMode');
      if (legacy === 'true' && getItem<Pet[]>(KEYS.PETS, []).length > 0) {
        return true;
      }
    } catch {}
    return getItem<boolean>(KEYS.IS_DEMO_MODE, false);
  },
  setDemoMode(isDemo: boolean): void {
    setItem(KEYS.IS_DEMO_MODE, isDemo);
    try {
      localStorage.setItem('isDemoMode', String(isDemo));
    } catch {}
  },

  // Load interactive demo data on explicit user request
  loadDemoData(): void {
    setItem(KEYS.PETS, INITIAL_PETS);
    setItem(KEYS.SELECTED_PET_ID, INITIAL_PETS[0].id);
    setItem(KEYS.USER, INITIAL_USER);
    setItem(KEYS.HEALTH_RECORDS, INITIAL_HEALTH_RECORDS);
    setItem(KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
    setItem(KEYS.DOSE_LOGS, INITIAL_DOSE_LOGS);
    setItem(KEYS.CALENDAR_EVENTS, INITIAL_CALENDAR_EVENTS);
    setItem(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    setItem(KEYS.REMINDERS, INITIAL_REMINDERS);
    setItem(KEYS.FAMILY_MEMBERS, INITIAL_FAMILY_MEMBERS);
    setItem(KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    setItem(KEYS.WEIGHT_HISTORY, INITIAL_WEIGHT_HISTORY);
    setItem(KEYS.ONBOARDING_COMPLETED, true);
    setItem(KEYS.IS_DEMO_MODE, true);
    try {
      localStorage.setItem('isDemoMode', 'true');
    } catch {}
  },

  // Exit demo mode and clear all sample data
  exitDemoMode(): void {
    this.clearAllData();
    setItem(KEYS.IS_DEMO_MODE, false);
    setItem(KEYS.ONBOARDING_COMPLETED, false);
    try {
      localStorage.removeItem('isDemoMode');
    } catch {}
  },

  // Clear all local data to start 100% fresh
  clearAllData(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    try {
      localStorage.removeItem('isDemoMode');
    } catch {}
  },

  resetAllData(): void {
    this.loadDemoData();
  },
};

export const storageService = StorageService;
