import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Sparkles, BookOpen, Target, X, ArrowRight, UserCheck } from 'lucide-react';
import { getTranslation } from '../../utils/i18n';

interface StudentGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASS_OPTIONS = [
  { id: 'Class 1-5', label: 'Class 1 to 5 Foundation', tag: 'Junior Champs', icon: '🌱' },
  { id: 'Class 6-8', label: 'Class 6 to 8 Middle School', tag: 'Core Strong', icon: '📚' },
  { id: 'Class 9-10', label: 'Class 9 & 10 (Board)', tag: 'Target 95%+', icon: '🎯' },
  { id: 'Class 11-12', label: 'Class 11 & 12 Science', tag: 'PCM / PCB Boards', icon: '🔬' },
  { id: 'NEET / JEE', label: 'NEET / JEE Foundation', tag: 'Medical & Engg', icon: '🩺' },
  { id: 'Computer DCA', label: 'Computer DCA / ADCA', tag: 'Govt Certified', icon: '💻' },
  { id: 'Spoken English', label: 'Spoken English Masterclass', tag: 'Fluency & Skills', icon: '🗣️' }
];

const CLASS_SUBJECT_DEFAULTS: Record<string, string[]> = {
  'Class 1-5': ['Mathematics', 'English', 'Hindi'],
  'Class 6-8': ['Mathematics', 'Science', 'Social Studies', 'English'],
  'Class 9-10': ['Mathematics', 'Science', 'Social Studies', 'English'],
  'Class 11-12': ['Science', 'Chemistry', 'Mathematics'],
  'NEET / JEE': ['Science', 'Chemistry', 'Biology', 'Mathematics'],
  'Computer DCA': ['Computer'],
  'Spoken English': ['English']
};

const SUBJECT_OPTIONS = [
  { id: 'Mathematics', label: 'Mathematics', icon: '📐' },
  { id: 'Science', label: 'Science / Physics', icon: '🔬' },
  { id: 'Chemistry', label: 'Chemistry', icon: '⚗️' },
  { id: 'Biology', label: 'Biology', icon: '🧬' },
  { id: 'Computer', label: 'Computer & Tally Prime', icon: '💻' },
  { id: 'English', label: 'English & Grammar', icon: '🗣️' },
  { id: 'Hindi', label: 'Hindi Literature', icon: '📖' },
  { id: 'Social Studies', label: 'Social Studies (SST)', icon: '🌍' }
];

const AVATAR_OPTIONS = [
  '🎓', '🧑‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '🔬', '🚀', '⭐'
];

export const StudentGoalModal: React.FC<StudentGoalModalProps> = ({ isOpen, onClose }) => {
  const { currentStudent, updateStudentGoal, language, showToast } = useApp();
  const t = getTranslation(language);

  const [selectedClass, setSelectedClass] = useState<string>(
    currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 9-10'
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    currentStudent?.selectedSubjects && currentStudent.selectedSubjects.length > 0
      ? currentStudent.selectedSubjects
      : ['Mathematics', 'Science', 'English']
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentStudent?.avatar || '🎓'
  );

  if (!isOpen) return null;

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    if (CLASS_SUBJECT_DEFAULTS[classId]) {
      setSelectedSubjects(CLASS_SUBJECT_DEFAULTS[classId]);
    }
  };

  const toggleSubject = (subjId: string) => {
    if (selectedSubjects.includes(subjId)) {
      if (selectedSubjects.length === 1) {
        showToast('Please select at least 1 subject.', 'warning');
        return;
      }
      setSelectedSubjects(prev => prev.filter(s => s !== subjId));
    } else {
      setSelectedSubjects(prev => [...prev, subjId]);
    }
  };

  const handleSave = () => {
    updateStudentGoal(selectedClass, selectedSubjects, selectedAvatar);
    showToast('🎯 Goal & Subjects updated! Feed personalized.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#0A2540] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedAvatar}</span>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                {t.selectClass}
              </h3>
              <p className="text-[11px] text-blue-100 font-medium">
                Personalize your batches, notes & timetable
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Save and Continue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-900 dark:text-white">
          
          {/* 1. Pick Class */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Step 1: Choose Your Class / Target</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CLASS_OPTIONS.map(c => {
                const isSelected = selectedClass === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleClassSelect(c.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0066FF] bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-[#0066FF]/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg">{c.icon}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-black block leading-tight text-slate-900 dark:text-white">
                        {c.label}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                        {c.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pick Subjects */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Step 2: Priority Subjects ({selectedSubjects.length})</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Select multiple</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECT_OPTIONS.map(s => {
                const isSelected = selectedSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSubject(s.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pick Avatar */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Step 3: Choose Student Avatar</span>
            </label>
            <div className="flex items-center justify-between gap-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              {AVATAR_OPTIONS.map(av => {
                const isSelected = selectedAvatar === av;
                return (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 ring-2 ring-amber-500 scale-110 shadow-sm'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{av}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSave}
            style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
            className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>{t.saveAndContinue}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
