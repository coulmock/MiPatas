import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
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
  AuthUser,
  PlanTier,
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
import { ConfirmModal } from './components/ConfirmModal';
import { DemoBanner } from './components/DemoBanner';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { ProUpsellModal } from './components/ProUpsellModal';
import { LandingPage } from './components/LandingPage';
import { ProFeatureKey, planPermissions } from './utils/planPermissions';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export default function App() {
  // Auth & Subscription state
  const [authUser, setAuthUser] = useState<AuthUser | null>(authService.getCurrentUser());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(storageService.isDemoMode());

  // Global App Data State
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

  // Modals & UI dialogs
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showLawModal, setShowLawModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [upsellFeature, setUpsellFeature] = useState<ProFeatureKey | null>(null);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'register',
  });

  // Generic Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Initialize storage
  useEffect(() => {
    storageService.init();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    const allPets = storageService.getPets();
    setPets(allPets);
    setIsDemoMode(storageService.isDemoMode());

    let activeId = storageService.getSelectedPetId();
    if ((!activeId || !allPets.some((p) => p.id === activeId)) && allPets.length > 0) {
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
    } else {
      setHealthRecords([]);
      setMedications([]);
      setCalendarEvents([]);
      setReminders([]);
      setDocuments([]);
      setDoseLogs([]);
      setActivities([]);
      setWeightHistory([]);
    }

    setFamilyMembers(storageService.getFamilyMembers());
  };

  // Determine current active plan
  const planTier: PlanTier = authUser?.plan || (isDemoMode ? 'pro' : 'free');

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

  // Check tab permissions on tab selection
  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'ia' && !planPermissions.canAccess('ia', planTier)) {
      setUpsellFeature('ia');
      return;
    }
    if (tab === 'documentos' && !planPermissions.canAccess('documentos', planTier)) {
      setUpsellFeature('documentos');
      return;
    }
    if (tab === 'familia' && !planPermissions.canAccess('familia', planTier)) {
      setUpsellFeature('familia');
      return;
    }

    setActiveTab(tab);
  };

  // Check pet limit before opening Add Pet Modal
  const handleTriggerOpenAddPet = () => {
    if (!planPermissions.canAddPet(pets.length, planTier)) {
      setUpsellFeature('unlimited_pets');
      return;
    }
    setShowAddPetModal(true);
  };

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    const created = storageService.addPet(newPetData);
    refreshAllData();
    handleSelectPet(created.id);
    setShowAddPetModal(false);
  };

  const handleLoadDemoData = () => {
    storageService.loadDemoData();
    setIsDemoMode(true);
    refreshAllData();
    setShowAddPetModal(false);
  };

  const handleExitDemoMode = () => {
    setConfirmModal({
      isOpen: true,
      title: '¿Salir del modo demo?',
      description:
        'Se borrarán los datos de ejemplo (Luna y Bruno) y volverás al inicio limpio para registrar tu propia mascota.',
      confirmLabel: 'Salir del modo demo',
      variant: 'warning',
      onConfirm: () => {
        storageService.exitDemoMode();
        setIsDemoMode(false);
        refreshAllData();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleUpdatePet = (petId: string, updates: Partial<Pet>) => {
    storageService.updatePet(petId, updates);
    refreshAllData();
  };

  const handleDeletePet = (petId: string) => {
    const targetPet = pets.find((p) => p.id === petId);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar mascota?',
      description:
        'Esta acción es irreversible y eliminará definitivamente toda su información, historial de vacunas, tratamientos y documentos asociados.',
      itemName: targetPet?.name,
      confirmLabel: 'Eliminar mascota',
      variant: 'danger',
      onConfirm: () => {
        storageService.deletePet(petId);
        refreshAllData();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Plan Management
  const handleSelectPlan = (newPlan: PlanTier) => {
    authService.updatePlan(newPlan);
    const updated = authService.getCurrentUser();
    setAuthUser(updated);
  };

  const handleUpgradeToProFromUpsell = () => {
    authService.updatePlan('pro');
    const updated = authService.getCurrentUser();
    setAuthUser(updated);
    const target = upsellFeature;
    setUpsellFeature(null);
    if (target === 'ia') setActiveTab('ia');
    else if (target === 'documentos') setActiveTab('documentos');
    else if (target === 'familia') setActiveTab('familia');
    else if (target === 'unlimited_pets') setShowAddPetModal(true);
  };

  // Sign out
  const handleSignOut = async () => {
    await authService.signOut();
    setAuthUser(null);
    if (isDemoMode) {
      storageService.exitDemoMode();
      setIsDemoMode(false);
    }
    refreshAllData();
  };

  // Medical records handlers
  const handleAddHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    if (!selectedPetId) return;
    storageService.addHealthRecord({ ...record, petId: selectedPetId });
    setHealthRecords(storageService.getHealthRecords(selectedPetId));
    setActivities(storageService.getActivityLogs(selectedPetId));
  };

  const handleDeleteHealthRecord = (id: string) => {
    if (!selectedPetId) return;
    const targetRecord = healthRecords.find((r) => r.id === id);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar registro de salud?',
      description: 'El registro se borrará de la cartilla sanitaria de la mascota.',
      itemName: targetRecord?.title,
      confirmLabel: 'Eliminar registro',
      variant: 'danger',
      onConfirm: () => {
        storageService.deleteHealthRecord(id);
        setHealthRecords(storageService.getHealthRecords(selectedPetId));
        setActivities(storageService.getActivityLogs(selectedPetId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Weight handlers
  const handleAddWeight = (entry: Omit<PetWeightEntry, 'id'>) => {
    if (!selectedPetId) return;
    storageService.addWeightEntry(selectedPetId, entry);
    setWeightHistory(storageService.getWeightHistory(selectedPetId));
    setActivities(storageService.getActivityLogs(selectedPetId));
  };

  // Medication handlers
  const handleAddMedication = (med: Omit<Medication, 'id'>) => {
    if (!selectedPetId) return;
    storageService.addMedication({ ...med, petId: selectedPetId });
    setMedications(storageService.getMedications(selectedPetId));
    setActivities(storageService.getActivityLogs(selectedPetId));
  };

  const handleUpdateMedication = (id: string, updates: Partial<Medication>) => {
    if (!selectedPetId) return;
    storageService.updateMedication(id, updates);
    setMedications(storageService.getMedications(selectedPetId));
  };

  const handleDeleteMedication = (id: string) => {
    if (!selectedPetId) return;
    const targetMed = medications.find((m) => m.id === id);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar tratamiento?',
      description: 'Se eliminará la pauta farmacológica y su historial de administración.',
      itemName: targetMed?.name,
      confirmLabel: 'Eliminar tratamiento',
      variant: 'danger',
      onConfirm: () => {
        storageService.deleteMedication(id);
        setMedications(storageService.getMedications(selectedPetId));
        setDoseLogs(storageService.getDoseLogs(selectedPetId));
        setActivities(storageService.getActivityLogs(selectedPetId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRecordDose = (
    petId: string,
    medicationId: string,
    administeredBy: string,
    notes?: string
  ) => {
    const targetPetId = petId || selectedPetId;
    if (!targetPetId) return;
    storageService.recordDose(
      targetPetId,
      medicationId,
      administeredBy,
      notes
    );
    setDoseLogs(storageService.getDoseLogs(targetPetId));
    setActivities(storageService.getActivityLogs(targetPetId));
    setMedications(storageService.getMedications(targetPetId));
  };

  // Calendar Event handlers
  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    if (!selectedPetId) return;
    storageService.addCalendarEvent({ ...event, petId: selectedPetId });
    setCalendarEvents(storageService.getCalendarEvents(selectedPetId));
    setActivities(storageService.getActivityLogs(selectedPetId));
  };

  const handleDeleteEvent = (id: string) => {
    if (!selectedPetId) return;
    const targetEvent = calendarEvents.find((e) => e.id === id);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar cita de la agenda?',
      description: 'La cita se eliminará del calendario de citas veterinarias.',
      itemName: targetEvent?.title,
      confirmLabel: 'Eliminar cita',
      variant: 'danger',
      onConfirm: () => {
        storageService.deleteCalendarEvent(id);
        setCalendarEvents(storageService.getCalendarEvents(selectedPetId));
        setActivities(storageService.getActivityLogs(selectedPetId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleEvent = (id: string) => {
    if (!selectedPetId) return;
    storageService.toggleCalendarEvent(id);
    setCalendarEvents(storageService.getCalendarEvents(selectedPetId));
  };

  // Reminder handlers
  const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
    if (!selectedPetId) return;
    storageService.addReminder({ ...reminder, petId: selectedPetId });
    setReminders(storageService.getReminders(selectedPetId));
  };

  const handleToggleReminder = (id: string) => {
    if (!selectedPetId) return;
    storageService.toggleReminder(id);
    setReminders(storageService.getReminders(selectedPetId));
  };

  const handleDeleteReminder = (id: string) => {
    if (!selectedPetId) return;
    const targetReminder = reminders.find((r) => r.id === id);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar recordatorio?',
      description: 'Dejarás de recibir avisos para esta pauta.',
      itemName: targetReminder?.title,
      confirmLabel: 'Eliminar recordatorio',
      variant: 'danger',
      onConfirm: () => {
        storageService.deleteReminder(id);
        setReminders(storageService.getReminders(selectedPetId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Document handlers
  const handleAddDocument = (doc: Omit<PetDocument, 'id'>) => {
    if (!selectedPetId) return;
    storageService.addDocument({ ...doc, petId: selectedPetId });
    setDocuments(storageService.getDocuments(selectedPetId));
    setActivities(storageService.getActivityLogs(selectedPetId));
  };

  const handleDeleteDocument = (id: string) => {
    if (!selectedPetId) return;
    const targetDoc = documents.find((d) => d.id === id);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar documento clínico?',
      description: 'El archivo se borrará permanentemente de la bóveda de documentos.',
      itemName: targetDoc?.title,
      confirmLabel: 'Eliminar documento',
      variant: 'danger',
      onConfirm: () => {
        storageService.deleteDocument(id);
        setDocuments(storageService.getDocuments(selectedPetId));
        setActivities(storageService.getActivityLogs(selectedPetId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Family Member handlers
  const handleAddFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    storageService.addFamilyMember(member);
    setFamilyMembers(storageService.getFamilyMembers());
  };

  const handleDeleteFamilyMember = (id: string) => {
    const targetMember = familyMembers.find((m) => m.id === id);
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar cuidador del equipo?',
      description: 'El usuario ya no tendrá acceso al registro compartido de tomas ni al panel colaborativo.',
      itemName: targetMember?.name,
      confirmLabel: 'Eliminar cuidador',
      variant: 'danger',
      onConfirm: () => {
        storageService.removeFamilyMember(id);
        setFamilyMembers(storageService.getFamilyMembers());
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Active pet reference
  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  // If there are no pets AND no authenticated user AND not in demo mode -> Show Public Landing Page
  const shouldShowLanding = !authUser && !isDemoMode && pets.length === 0;

  if (shouldShowLanding) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
          onOpenRegister={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
          onLaunchDemo={handleLoadDemoData}
          onOpenLawModal={() => setShowLawModal(true)}
        />

        <AuthModal
          isOpen={authModalConfig.isOpen}
          initialMode={authModalConfig.mode}
          onClose={() => setAuthModalConfig({ isOpen: false, mode: 'register' })}
          onSuccess={(user, isNewRegistration) => {
            setAuthUser(user);
            setAuthModalConfig({ isOpen: false, mode: 'register' });
            if (isNewRegistration || pets.length === 0) {
              setShowAddPetModal(true);
            }
          }}
        />

        {showLawModal && (
          <SpanishLawModal
            pet={activePet}
            onClose={() => setShowLawModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Demo Mode Notice Banner */}
      {isDemoMode && (
        <DemoBanner
          onExitDemo={handleExitDemoMode}
          onCreateAccount={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
        />
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={handleSelectTab}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={handleSelectPet}
        onOpenAddPet={handleTriggerOpenAddPet}
        onOpenLawModal={() => setShowLawModal(true)}
        planTier={planTier}
        authUser={authUser}
        isDemoMode={isDemoMode}
        onOpenPricing={() => setShowPricingModal(true)}
        onSignOut={handleSignOut}
        onOpenAuthModal={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:pb-12">
        {activeTab === 'inicio' && activePet && (
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
            onNavigate={handleSelectTab}
            onRecordDose={handleRecordDose}
            onToggleReminder={handleToggleReminder}
            onOpenAddEventModal={() => handleSelectTab('agenda')}
            onOpenAddHealthModal={() => handleSelectTab('salud')}
            onOpenWeightModal={() => handleSelectTab('salud')}
            onOpenLawModal={() => setShowLawModal(true)}
          />
        )}

        {activeTab === 'perfil' && activePet && (
          <PetProfileView
            pet={activePet}
            allPets={pets}
            onSelectPet={handleSelectPet}
            onOpenAddPet={handleTriggerOpenAddPet}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            weightHistory={weightHistory}
            onOpenWeightModal={() => handleSelectTab('salud')}
            onOpenLawModal={() => setShowLawModal(true)}
          />
        )}

        {activeTab === 'salud' && activePet && (
          <HealthCardView
            pet={activePet}
            healthRecords={healthRecords}
            weightHistory={weightHistory}
            onAddRecord={handleAddHealthRecord}
            onDeleteRecord={handleDeleteHealthRecord}
            onAddWeight={handleAddWeight}
            onOpenLawModal={() => setShowLawModal(true)}
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
            onDeleteMedication={handleDeleteMedication}
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
        onLoadDemoData={pets.length === 0 ? handleLoadDemoData : undefined}
      />

      {/* Spanish Law Modal */}
      {showLawModal && (
        <SpanishLawModal
          pet={activePet}
          onClose={() => setShowLawModal(false)}
        />
      )}

      {/* Pricing and Subscription Modal */}
      <PricingModal
        isOpen={showPricingModal}
        currentPlan={planTier}
        onClose={() => setShowPricingModal(false)}
        onSelectPlan={handleSelectPlan}
      />

      {/* Pro Feature Upsell Modal */}
      {upsellFeature && (
        <ProUpsellModal
          isOpen={!!upsellFeature}
          featureKey={upsellFeature}
          onClose={() => setUpsellFeature(null)}
          onUpgradeToPro={handleUpgradeToProFromUpsell}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ isOpen: false, mode: 'register' })}
        onSuccess={(user, isNewRegistration) => {
          setAuthUser(user);
          setAuthModalConfig({ isOpen: false, mode: 'register' });
          if (isNewRegistration || pets.length === 0) {
            setShowAddPetModal(true);
          }
        }}
      />

      {/* Global Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        itemName={confirmModal.itemName}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
