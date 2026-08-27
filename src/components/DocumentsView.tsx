import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  Trash2,
  Eye,
  ShieldCheck,
  Receipt,
  FileCheck,
  Stethoscope,
  Search,
  CheckCircle2,
  Loader2,
  Calendar,
} from 'lucide-react';
import {
  Pet,
  PetDocument,
  DocumentCategory,
  HealthRecord,
  Reminder,
} from '../types';
import { geminiService } from '../services/geminiService';

interface DocumentsViewProps {
  pet: Pet;
  documents: PetDocument[];
  onAddDocument: (doc: Omit<PetDocument, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
  onAddHealthRecordFromAI?: (record: Omit<HealthRecord, 'id'>) => void;
  onAddReminderFromAI?: (reminder: Omit<Reminder, 'id'>) => void;
}

const DOC_CATEGORIES: Record<
  DocumentCategory,
  { label: string; icon: React.FC<{ className?: string }> }
> = {
  cartilla_vacunacion: { label: 'Cartilla Vacunación', icon: FileCheck },
  informe_veterinario: { label: 'Informes Veterinarios', icon: Stethoscope },
  receta: { label: 'Recetas Oficiales', icon: FileCheck },
  factura: { label: 'Facturas y Gastos', icon: Receipt },
  factura_veterinaria: { label: 'Facturas Veterinarias', icon: Receipt },
  seguro: { label: 'Póliza y Seguros', icon: ShieldCheck },
  identificacion_microchip: { label: 'Certificado Microchip', icon: ShieldCheck },
  pasaporte_dni: { label: 'Pasaporte & DNI', icon: FileText },
  pasaporte_europeo: { label: 'Pasaporte Europeo', icon: FileText },
  analisis: { label: 'Analíticas', icon: FileText },
  analisis_lab: { label: 'Analíticas y Radiografías', icon: FileText },
  otro: { label: 'Otros Documentos', icon: FileText },
};

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  pet,
  documents,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<DocumentCategory | 'todas'>('todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<PetDocument | null>(null);

  // AI Document Analysis Modal
  const [analyzingDoc, setAnalyzingDoc] = useState<PetDocument | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // New Doc Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('informe_veterinario');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newClinic, setNewClinic] = useState(pet.vetClinicName || 'Hospital Veterinario');
  const [newNotes, setNewNotes] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newTotalAmount, setNewTotalAmount] = useState<number | undefined>();

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.notes && doc.notes.toLowerCase().includes(search.toLowerCase())) ||
      (doc.clinic && doc.clinic.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = filterCat === 'todas' || doc.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddDocument({
      petId: pet.id,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      clinic: newClinic.trim() || undefined,
      notes: newNotes.trim() || undefined,
      fileUrl: newDocUrl.trim() || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      fileType: 'pdf',
      totalAmountEur: newTotalAmount,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewNotes('');
  };

  const handleAnalyzeWithAI = async (doc: PetDocument) => {
    setAnalyzingDoc(doc);
    setIsAiAnalyzing(true);
    setAnalysisResult(null);

    const promptText = `Por favor analiza este documento veterinario titulado "${doc.title}" de la mascota ${pet.name} (${pet.breed}, ${pet.weightKg}kg). Clínica: ${doc.clinic || 'No especificada'}. Notas: ${doc.notes || 'Ninguna'}. 
Extrae en un formato claro y estructurado en español:
1. Resumen Clínico / Diagnóstico principal
2. Medicamentos recetados o pautas recomendadas (con dosis)
3. Próximos pasos y fechas de revisión sugeridas
4. Consejos de cuidado en el hogar según la normativa y buenas prácticas veterinarias en España.`;

    const result = await geminiService.analyzeDocument(promptText);
    setAnalysisResult(result);
    setIsAiAnalyzing(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Bóveda de Documentos & Informes
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Informes veterinarios, pólizas de seguro, facturas y recetas de {pet.name}.
            </p>
          </div>
        </div>

        <button
          id="add-doc-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>+ Subir Documento</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, clínica, diagnóstico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
            />
          </div>

          <span className="text-xs font-medium text-slate-400">
            {filteredDocs.length} documentos guardados
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilterCat('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              filterCat === 'todas'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todos ({documents.length})
          </button>
          {(Object.keys(DOC_CATEGORIES) as DocumentCategory[]).map((catKey) => {
            const cfg = DOC_CATEGORIES[catKey];
            const Icon = cfg.icon;
            const count = documents.filter((d) => d.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setFilterCat(catKey)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  filterCat === catKey
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cfg.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      filterCat === catKey ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const cfg = DOC_CATEGORIES[doc.category] || DOC_CATEGORIES.otro;
          const Icon = cfg.icon;

          return (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleAnalyzeWithAI(doc)}
                      className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] flex items-center gap-1 border border-indigo-200 transition-colors"
                      title="Analizar con MiPatas AI"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Analizar IA</span>
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1 rounded-md text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {cfg.label}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                  {doc.title}
                </h3>

                <div className="space-y-1 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.date}</span>
                  </div>
                  {doc.clinic && (
                    <div className="truncate text-slate-600 font-medium">
                      🏥 {doc.clinic}
                    </div>
                  )}
                  {doc.totalAmountEur && (
                    <div className="text-indigo-700 font-semibold">
                      Importe: {doc.totalAmountEur} €
                    </div>
                  )}
                </div>

                {doc.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-3 line-clamp-2">
                    {doc.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDocForPreview(doc)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Archivo</span>
                </button>

                <button
                  onClick={() => handleAnalyzeWithAI(doc)}
                  className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-1 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Resumen IA</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No se encontraron documentos</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sube informes veterinarios, recetas o pólizas para tener todo centralizado y analizado con IA.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: AI ANALYSIS VIEWER */}
      {analyzingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Análisis Inteligente MiPatas AI
                </h3>
                <p className="text-xs text-slate-500">
                  {analyzingDoc.title} ({analyzingDoc.date})
                </p>
              </div>
            </div>

            {isAiAnalyzing ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-600">
                  Analizando el documento veterinario con el modelo clínico de MiPatas...
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line text-slate-800 font-normal">
                  {analysisResult}
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900">
                  <h4 className="font-semibold flex items-center gap-1.5 mb-1 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    Integración Automática
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Las pautas extraídas se pueden consultar en cualquier momento o añadirlas a tu carnet de salud y agenda con 1 solo clic.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAnalyzingDoc(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Cerrar Análisis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW DOCUMENT */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {selectedDocForPreview.title}
              </h3>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                Cerrar
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <img
                src={selectedDocForPreview.fileUrl}
                alt={selectedDocForPreview.title}
                className="max-h-96 rounded-lg object-contain shadow-xs"
              />
            </div>

            <div className="mt-4 text-xs text-slate-600 space-y-1">
              <p><strong>Fecha:</strong> {selectedDocForPreview.date}</p>
              {selectedDocForPreview.clinic && <p><strong>Clínica:</strong> {selectedDocForPreview.clinic}</p>}
              {selectedDocForPreview.notes && <p><strong>Notas:</strong> {selectedDocForPreview.notes}</p>}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD NEW DOCUMENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Subir Documento o Informe Veterinario
            </h3>

            <form onSubmit={handleCreateDoc} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título del Documento *</label>
                <input
                  type="text"
                  placeholder="Ej. Informe Ecografía Abdominal, Receta Antibiótico, Póliza..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    {(Object.keys(DOC_CATEGORIES) as DocumentCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {DOC_CATEGORIES[cat].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Clínica / Entidad</label>
                  <input
                    type="text"
                    placeholder="Ej. Hospital San Antón"
                    value={newClinic}
                    onChange={(e) => setNewClinic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Importe en € (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 65.00"
                    value={newTotalAmount || ''}
                    onChange={(e) => setNewTotalAmount(parseFloat(e.target.value) || undefined)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">URL o Archivo Simulado</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newDocUrl}
                  onChange={(e) => setNewDocUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notas u observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Diagnóstico, indicaciones de medicación, recomendaciones..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                >
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
