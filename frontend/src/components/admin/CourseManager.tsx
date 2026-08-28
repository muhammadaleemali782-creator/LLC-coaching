import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, CourseCategory } from '../../types';
import { Plus, Edit3, Trash2, GraduationCap, CheckCircle2, Save, X, Star } from 'lucide-react';

export const CourseManager: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, showToast } = useApp();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    category: 'secondary',
    targetClass: 'Class 9–10',
    duration: 'Full Academic Year',
    fee: 9500,
    discountFee: 6999,
    rating: 5.0,
    instructor: 'Aman Arora',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    badge: 'Toppers Choice',
    features: ['10-Year PYQs Solved', 'Weekly Board Mocks', '1:1 Doubt Solving', 'Printed Theory Modules'],
    description: 'Comprehensive coaching with focus on step-by-step formula derivations and high-yield questions.'
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.targetClass) {
      showToast('Course title and target class are required.', 'warning');
      return;
    }
    await addCourse(newCourse as Course);
    setIsAdding(false);
    setNewCourse({
      title: '',
      category: 'secondary',
      targetClass: 'Class 9–10',
      duration: 'Full Academic Year',
      fee: 9500,
      discountFee: 6999,
      rating: 5.0,
      instructor: 'Aman Arora',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      badge: 'Toppers Choice',
      features: ['10-Year PYQs Solved', 'Weekly Board Mocks', '1:1 Doubt Solving'],
      description: 'Comprehensive coaching with focus on step-by-step formula derivations.'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#0066FF]" />
            <span>Academic Courses & Batches Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Add, edit pricing, update syllabus features, and manage course cards live in MongoDB.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Create New Course'}</span>
        </button>
      </div>

      {/* Add Course Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Publish New Academic Course</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Course Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Board Exam Ace: Class 9 & 10 Target 95%+"
                value={newCourse.title}
                onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={newCourse.category}
                onChange={e => setNewCourse({ ...newCourse, category: e.target.value as CourseCategory })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              >
                <option value="primary">Class 1–5 (Primary)</option>
                <option value="middle">Class 6–8 (Middle)</option>
                <option value="secondary">Class 9–10 (Secondary)</option>
                <option value="senior">Class 11–12 (Senior)</option>
                <option value="computer">Computer DCA / Tally</option>
                <option value="spoken">Spoken English</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Class *</label>
              <input
                type="text"
                placeholder="e.g. Class 10"
                value={newCourse.targetClass}
                onChange={e => setNewCourse({ ...newCourse, targetClass: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Original Fee (₹)</label>
              <input
                type="number"
                value={newCourse.fee}
                onChange={e => setNewCourse({ ...newCourse, fee: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Discounted Fee (₹)</label>
              <input
                type="number"
                value={newCourse.discountFee}
                onChange={e => setNewCourse({ ...newCourse, discountFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Poster Image URL</label>
              <input
                type="text"
                value={newCourse.image}
                onChange={e => setNewCourse({ ...newCourse, image: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. Popular Foundation / Toppers Choice"
                value={newCourse.badge}
                onChange={e => setNewCourse({ ...newCourse, badge: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
              <textarea
                rows={2}
                value={newCourse.description}
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider"
            >
              Publish to Website
            </button>
          </div>
        </form>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(c => (
          <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              {c.badge && (
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  {c.badge}
                </span>
              )}
              <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#0066FF] text-white text-xs font-black">
                ₹{c.discountFee}
              </span>
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                <span className="bg-black/60 px-2 py-0.5 rounded-md font-mono">{c.targetClass}</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-current" /> {c.rating || 5.0}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-black text-white line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 line-through block">₹{c.fee}</span>
                  <span className="text-xs font-black text-emerald-400">₹{c.discountFee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCourse({ ...c })}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 cursor-pointer"
                    title="Edit Course"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black uppercase">Edit Course Details</h3>
              </div>
              <button onClick={() => setEditingCourse(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Original Fee (₹)</label>
                <input
                  type="number"
                  value={editingCourse.fee}
                  onChange={e => setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Discounted Fee (₹)</label>
                <input
                  type="number"
                  value={editingCourse.discountFee}
                  onChange={e => setEditingCourse({ ...editingCourse, discountFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Poster Image URL</label>
                <input
                  type="text"
                  value={editingCourse.image}
                  onChange={e => setEditingCourse({ ...editingCourse, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateCourse(editingCourse);
                  setEditingCourse(null);
                  showToast('Course updated and saved live!', 'success');
                }}
                className="px-6 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Live</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
