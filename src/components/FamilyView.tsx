import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Activity,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Pet, FamilyMember, ActivityLog } from '../types';

interface FamilyViewProps {
  pet: Pet;
  familyMembers: FamilyMember[];
  activities: ActivityLog[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  onDeleteMember: (id: string) => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  pet,
  familyMembers,
  activities,
  onAddMember,
  onDeleteMember,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'propietario' | 'familiar' | 'paseador' | 'veterinario'>('familiar');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMember({
      name: name.trim(),
      email: email.trim() || undefined,
      role:
        role === 'propietario'
          ? 'Propietario'
          : role === 'familiar'
          ? 'Familiar'
          : role === 'paseador'
          ? 'Paseador / Cuidador'
          : 'Veterinario',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 100)}?w=150&auto=format&fit=crop&q=80`,
    });

    setShowInviteModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cuidado Compartido & Familia
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Gestiona el equipo de cuidadores, familiares y paseadores de {pet.name}.
            </p>
          </div>
        </div>

        <button
          id="invite-member-btn"
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Invitar Cuidador</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Members Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Miembros con Acceso ({familyMembers.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-100 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block mt-0.5">
                      {member.role}
                    </span>
                    {member.email && (
                      <p className="text-xs text-slate-400 mt-1 truncate">{member.email}</p>
                    )}
                  </div>
                </div>

                {member.role !== 'Propietario Principal' && (
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                    title="Eliminar acceso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Sync Information Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs">
            <h4 className="font-semibold flex items-center gap-1.5 text-slate-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Sincronización en Tiempo Real
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Cuando cualquier miembro registra una toma de medicamento o un paseo, se actualiza inmediatamente en el panel de todos para evitar dosis duplicadas o confusiones.
            </p>
          </div>
        </div>

        {/* Right Column: Complete Activity Audit Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Muro de Actividad Reciente
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.map((act) => (
              <div key={act.id} className="py-3 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">
                    {act.userName}{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({act.userRole})
                    </span>
                  </div>
                  <p className="text-slate-600">{act.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: INVITE MEMBER */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Invitar a un Cuidador o Familiar
            </h3>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="carlos@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rol / Permisos</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  <option value="familiar">Familiar / Co-propietario (Acceso total)</option>
                  <option value="paseador">Paseador / Canguro (Ver agenda y registrar tomas)</option>
                  <option value="veterinario">Veterinario (Ver historial y registrar pautas)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
