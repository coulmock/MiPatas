import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import {
  Pet,
  HealthRecord,
  Medication,
  CalendarEvent,
  Reminder,
  PetDocument,
  DoseLog,
  ActivityLog,
  FamilyMember,
  PetWeightEntry,
} from './types';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PetProfileView } from './components/PetProfileView';
import { HealthCardView } from './components/HealthCardView';
import { MedicationsView } from './components/MedicationsView';
import { AgendaView } from './components/AgendaView';
import { RemindersView } from './components/RemindersView';
import { DocumentsView } from './components/DocumentsView';
import { AiAssistantView } from './components/AiAssistantView';
import { FamilyView } from './components/FamilyView';
import { OnboardingModal } from './components/OnboardingModal';
import { SpanishLawModal } from './components/SpanishLawModal';

export default function App() {
  // Global State
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [documents, setDocuments] = useState<PetDocument[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [weightHistory, setWeightHistory] = useState<PetWeightEntry[]>([]);

  // Modal triggers
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showLawModal, setShowLawModal] = useState(false);
  const [showDirectAddEventModal, setShowDirectAddEventModal] = useState(false);
  const [showDirectAddHealthModal, setShowDirectAddHealthModal] = useState(false);
  const [showDirectWeightModal, setShowDirectWeightModal] = useState(false);

  // Initialize storage
  useEffect(() => {
    storageService.init();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    const allPets = storageService.getPets();
    setPets(allPets);

    let activeId = storageService.getSelectedPetId();
    if (!activeId && allPets.length > 0) {
      activeId = allPets[0].id;
      storageService.setSelectedPetId(activeId);
    }
    setSelectedPetId(activeId);

    if (activeId) {
      setHealthRecords(storageService.getHealthRecords(activeId));
      setMedications(storageService.getMedications(activeId));
      setCalendarEvents(storageService.getCalendarEvents(activeId));
      setReminders(storageService.getReminders(activeId));
      setDocuments(storageService.getDocuments(activeId));
      setDoseLogs(storageService.getDoseLogs(activeId));
      setActivities(storageService.getActivityLogs(activeId));
      setWeightHistory(storageService.getWeightHistory(activeId));
    }

    setFamilyMembers(storageService.getFamilyMembers());
  };

  const handleSelectPet = (petId: string) => {
    storageService.setSelectedPetId(petId);
    setSelectedPetId(petId);
    setHealthRecords(storageService.getHealthRecords(petId));
    setMedications(storageService.getMedications(petId));
    setCalendarEvents(storageService.getCalendarEvents(petId));
    setReminders(storageService.getReminders(petId));
    setDocuments(storageService.getDocuments(petId));
    setDoseLogs(storageService.getDoseLogs(petId));
    setActivities(storageService.getActivityLogs(petId));
    setWeightHistory(storageService.getWeightHistory(petId));
  };

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    const created = storageService.addPet(newPetData);
    refreshAllData();
    handleSelectPet(created.id);
    setShowAddPetModal(false);
  };

  const handleUpdatePet = (petId: string, updates: Partial<Pet>) => {
    storageService.updatePet(petId, updates);
    refreshAllData();
  };

  const handleDeletePet = (petId: string) => {
    storageService.deletePet(petId);
    refreshAllData();
  };

  // Health Card handlers
  const handleAddHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    storageService.addHealthRecord(record);
    refreshAllData();
  };

  const handleDeleteHealthRecord = (id: string) => {
    storageService.deleteHealthRecord(id);
    refreshAllData();
  };

  const handleAddWeight = (entry: Omit<PetWeightEntry, 'id'>) => {
    if (!activePet) return;
    storageService.addWeightEntry(activePet.id, entry);
    refreshAllData();
  };

  // Medication handlers
  const handleAddMedication = (med: Omit<Medication, 'id'>) => {
    storageService.addMedication(med);
    refreshAllData();
  };

  const handleUpdateMedication = (id: string, updates: Partial<Medication>) => {
    storageService.updateMedication(id, updates);
    refreshAllData();
  };

  const handleRecordDose = (petId: string, medId: string, by: string, note?: string) => {
    storageService.recordDose(petId, medId, by, note);
    refreshAllData();
  };

  // Calendar / Agenda handlers
  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    storageService.addCalendarEvent(event);
    refreshAllData();
  };

  const handleDeleteEvent = (id: string) => {
    storageService.deleteCalendarEvent(id);
    refreshAllData();
  };

  const handleToggleEvent = (id: string) => {
    storageService.toggleCalendarEvent(id);
    refreshAllData();
  };

  // Reminder handlers
  const handleAddReminder = (rem: Omit<Reminder, 'id'>) => {
    storageService.addReminder(rem);
    refreshAllData();
  };

  const handleToggleReminder = (id: string) => {
    storageService.toggleReminder(id);
    refreshAllData();
  };

  const handleDeleteReminder = (id: string) => {
    storageService.deleteReminder(id);
    refreshAllData();
  };

  // Document handlers
  const handleAddDocument = (doc: Omit<PetDocument, 'id'>) => {
    storageService.addDocument(doc);
    refreshAllData();
  };

  const handleDeleteDocument = (id: string) => {
    storageService.deleteDocument(id);
    refreshAllData();
  };

  // Family handlers
  const handleAddFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    storageService.addFamilyMember(member);
    refreshAllData();
  };

  const handleDeleteFamilyMember = (id: string) => {
    storageService.deleteFamilyMember(id);
    refreshAllData();
  };

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  if (!activePet) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <OnboardingModal
          isOpen={true}
          onClose={() => {}}
          onComplete={handleAddPet}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={handleSelectPet}
        onOpenAddPet={() => setShowAddPetModal(true)}
        onOpenLawModal={() => setShowLawModal(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'inicio' && (
          <Dashboard
            pet={activePet}
            allPets={pets}
            healthRecords={healthRecords}
            medications={medications}
            calendarEvents={calendarEvents}
            reminders={reminders}
            doseLogs={doseLogs}
            recentActivities={activities}
            familyMembers={familyMembers}
            onNavigate={setActiveTab}
            onRecordDose={handleRecordDose}
            onToggleReminder={handleToggleReminder}
            onOpenAddEventModal={() => {
              setActiveTab('agenda');
            }}
            onOpenAddHealthModal={() => {
              setActiveTab('salud');
            }}
            onOpenWeightModal={() => {
              setActiveTab('salud');
            }}
            onOpenLawModal={() => setShowLawModal(true)}
          />
        )}

        {activeTab === 'perfil' && (
          <PetProfileView
            pet={activePet}
            allPets={pets}
            onSelectPet={handleSelectPet}
            onOpenAddPet={() => setShowAddPetModal(true)}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            weightHistory={weightHistory}
            onOpenWeightModal={() => setActiveTab('salud')}
            onOpenLawModal={() => setShowLawModal(true)}
          />
        )}

        {activeTab === 'salud' && (
          <HealthCardView
            pet={activePet}
            healthRecords={healthRecords}
            onAddRecord={handleAddHealthRecord}
            onDeleteRecord={handleDeleteHealthRecord}
            weightHistory={weightHistory}
            onAddWeight={handleAddWeight}
          />
        )}

        {activeTab === 'medicamentos' && (
          <MedicationsView
            pet={activePet}
            medications={medications}
            doseLogs={doseLogs}
            familyMembers={familyMembers}
            onAddMedication={handleAddMedication}
            onUpdateMedication={handleUpdateMedication}
            onRecordDose={handleRecordDose}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView
            pet={activePet}
            events={calendarEvents}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleEvent={handleToggleEvent}
          />
        )}

        {activeTab === 'recordatorios' && (
          <RemindersView
            pet={activePet}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {activeTab === 'documentos' && (
          <DocumentsView
            pet={activePet}
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onAddHealthRecordFromAI={handleAddHealthRecord}
            onAddReminderFromAI={handleAddReminder}
          />
        )}

        {activeTab === 'ia' && (
          <AiAssistantView
            pet={activePet}
            healthRecords={healthRecords}
            medications={medications}
          />
        )}

        {activeTab === 'familia' && (
          <FamilyView
            pet={activePet}
            familyMembers={familyMembers}
            activities={activities}
            onAddMember={handleAddFamilyMember}
            onDeleteMember={handleDeleteFamilyMember}
          />
        )}
      </main>

      {/* Onboarding / Add Pet Modal */}
      <OnboardingModal
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        onComplete={handleAddPet}
      />

      {/* Spanish Law Modal */}
      {showLawModal && (
        <SpanishLawModal
          pet={activePet}
          onClose={() => setShowLawModal(false)}
        />
      )}
    </div>
  );
}
