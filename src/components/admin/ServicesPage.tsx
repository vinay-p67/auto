import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Service } from '../../types/database';
import { supabase } from '../../lib/supabase';

export const ServicesPage: React.FC = () => {
  const { services, refreshData } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState(75);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(45);
    setPrice(75);
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description || '');
    setDurationMinutes(service.duration_minutes);
    setPrice(Number(service.price));
    setIsActive(service.is_active);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) {
        alert(`Failed to update service status: ${error.message}`);
      } else {
        refreshData();
      }
    } catch (err: any) {
      alert(`Error toggling service status: ${err?.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Service name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            name: name.trim(),
            description: description.trim(),
            duration_minutes: Number(durationMinutes),
            price: Number(price),
            is_active: isActive,
          })
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        // Add new service
        const { error } = await supabase.from('services').insert({
          name: name.trim(),
          description: description.trim(),
          duration_minutes: Number(durationMinutes),
          price: Number(price),
          is_active: isActive,
        });

        if (error) throw error;
      }

      setIsModalOpen(false);
      refreshData();
    } catch (err: any) {
      console.error('Service save error:', err);
      setFormError(err?.message || 'Failed to save service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            Auto Repair Services Catalog
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your repair packages, rates, labor durations, and online booking availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono font-bold text-slate-400">
                <th className="py-3.5 px-4">Service Name & Description</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Bay Rate</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    !service.is_active ? 'opacity-60 bg-slate-950/40' : ''
                  }`}
                >
                  {/* Name & Desc */}
                  <td className="py-4 px-4 max-w-md">
                    <div className="font-bold text-white text-sm">
                      {service.name}
                    </div>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {service.description || 'No description provided.'}
                    </p>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-4 font-mono text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{service.duration_minutes} mins</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-mono font-bold text-white text-sm">
                    ${Number(service.price).toFixed(2)}
                  </td>

                  {/* Active / Inactive Badge */}
                  <td className="py-4 px-4">
                    {service.is_active ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        <span className="uppercase">Active (Bookable)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <EyeOff className="w-3 h-3" />
                        <span className="uppercase">Inactive (Hidden)</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        service.is_active
                          ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30'
                      }`}
                      title={service.is_active ? 'Deactivate Service' : 'Activate Service'}
                    >
                      {service.is_active ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  {editingService ? 'Edit Auto Repair Service' : 'Add New Service Package'}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Changes save immediately and sync to the live booking flow.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Service Name <span className="text-brand-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transmission Fluid Flush & Filter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of labor, parts included, and inspection checkpoints..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Active Toggle Checkbox */}
              <div className="pt-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActiveService"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="isActiveService" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Active (Display and allow booking on public website)
                </label>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 uppercase font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
                >
                  <span>{editingService ? 'Save Service Updates' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
