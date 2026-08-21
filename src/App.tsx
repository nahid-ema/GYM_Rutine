import React, { useState, useEffect } from 'react';
import { routineData, workoutSchedule } from './data';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Dumbbell, Calendar, RotateCcw, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
  const [activeDayNumber, setActiveDayNumber] = useState<number>(() => {
    const saved = localStorage.getItem('fitness-active-day');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('fitness-active-day', activeDayNumber.toString());
  }, [activeDayNumber]);
  
  // Format today's date as YYYY-MM-DD
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState<string>(getTodayStr());

  const currentDayConfig = workoutSchedule.find(d => d.dayNumber === activeDayNumber)!;
  const visibleGroups = routineData.filter(g => currentDayConfig.muscleGroupIds.includes(g.id));

  // State: date -> exerciseId -> array of boolean for sets
  const [progress, setProgress] = useState<Record<string, Record<string, boolean[]>>>(() => {
    const saved = localStorage.getItem('fitness-progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('fitness-progress', JSON.stringify(progress));
  }, [progress]);

  const toggleSet = (exerciseId: string, setIndex: number) => {
    setProgress(prev => {
      const dateProgress = prev[currentDate] || {};
      const exerciseProgress = dateProgress[exerciseId] || [];
      
      const newExerciseProgress = [...exerciseProgress];
      newExerciseProgress[setIndex] = !newExerciseProgress[setIndex];
      
      return {
        ...prev,
        [currentDate]: {
          ...dateProgress,
          [exerciseId]: newExerciseProgress
        }
      };
    });
  };

  const resetToday = () => {
    if (window.confirm('Are you sure you want to reset all progress for today?')) {
      setProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[currentDate];
        return newProgress;
      });
    }
  };

  const getExerciseProgress = (exerciseId: string) => {
    return (progress[currentDate] && progress[currentDate][exerciseId]) || [];
  };

  const calculateGroupProgress = (groupId: string) => {
    const group = routineData.find(g => g.id === groupId);
    if (!group) return 0;
    
    let totalSets = 0;
    let completedSets = 0;
    
    group.exercises.forEach(ex => {
      totalSets += ex.maxSets;
      const exProg = getExerciseProgress(ex.id);
      completedSets += exProg.filter(Boolean).length;
    });
    
    return totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
  };

  const calculateTotalProgress = () => {
    if (currentDayConfig.isRest) return 100;
    
    let totalSets = 0;
    let completedSets = 0;
    
    visibleGroups.forEach(group => {
      group.exercises.forEach(ex => {
        totalSets += ex.maxSets;
        const exProg = getExerciseProgress(ex.id);
        completedSets += exProg.filter(Boolean).length;
      });
    });
    
    return totalSets === 0 ? 0 : Math.round((completedSets / totalSets) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Iron Track</h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gym Routine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>{new Date(currentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
            <button 
              onClick={resetToday}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset today's progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Total Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${calculateTotalProgress()}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Day Selector */}
        <div className="flex gap-3 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {workoutSchedule.map(day => (
            <button
              key={day.dayNumber}
              onClick={() => {
                setActiveDayNumber(day.dayNumber);
                setActiveGroup(null);
              }}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-left transition-all ${
                activeDayNumber === day.dayNumber
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2 ring-offset-slate-50'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              <span className="block text-sm font-bold mb-0.5">Day {day.dayNumber}</span>
              <span className={`block text-xs font-medium ${
                activeDayNumber === day.dayNumber ? 'text-indigo-100' : 'text-slate-400'
              }`}>
                {day.name}
              </span>
            </button>
          ))}
        </div>

        {currentDayConfig.isRest ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <Coffee className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Rest & Recover</h2>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your muscles grow when you rest. Stay hydrated, eat well, and get ready to hit it hard again tomorrow!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleGroups.map((group) => {
            const isActive = activeGroup === group.id;
            const groupProgress = calculateGroupProgress(group.id);
            const isCompleted = groupProgress === 100;
            
            return (
              <div 
                key={group.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 ${
                  isActive ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50/50' : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setActiveGroup(isActive ? null : group.id)}
                  className="w-full px-6 py-5 flex items-center justify-between outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                        : isActive 
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{groupProgress}%</span>}
                    </div>
                    <div className="text-left">
                      <h2 className={`text-lg font-bold tracking-tight ${isCompleted ? 'text-slate-900' : 'text-slate-900'}`}>
                        {group.name}
                      </h2>
                      <p className="text-sm text-slate-500 font-medium">
                        {group.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  <div className={`text-slate-400 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 space-y-6 border-t border-slate-100">
                        {group.exercises.map((exercise, idx) => {
                          const exProg = getExerciseProgress(exercise.id);
                          const completedSets = exProg.filter(Boolean).length;
                          const isExCompleted = completedSets === exercise.maxSets;
                          
                          return (
                            <div key={exercise.id} className="relative">
                              {idx !== group.exercises.length - 1 && (
                                <div className="absolute left-4 top-14 bottom-[-24px] w-px bg-slate-100" />
                              )}
                              
                              <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold z-10 transition-colors ${
                                  isExCompleted 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {idx + 1}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h3 className={`font-semibold text-base ${isExCompleted ? 'text-slate-900 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                        {exercise.name}
                                      </h3>
                                      <p className="text-sm text-slate-500 mt-0.5">
                                        {exercise.maxSets} sets <span className="mx-1.5 opacity-50">•</span> {exercise.repsText}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: exercise.maxSets }).map((_, setIdx) => {
                                      const isChecked = !!exProg[setIdx];
                                      return (
                                        <button
                                          key={setIdx}
                                          onClick={() => toggleSet(exercise.id, setIdx)}
                                          className={`relative h-10 flex-1 min-w-[3rem] max-w-[4rem] flex items-center justify-center rounded-lg border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                                            isChecked
                                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                              : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-400'
                                          }`}
                                          aria-label={`Toggle set ${setIdx + 1} for ${exercise.name}`}
                                        >
                                          {isChecked ? (
                                            <motion.div
                                              initial={{ scale: 0.5, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                            >
                                              <CheckCircle2 className="w-5 h-5" />
                                            </motion.div>
                                          ) : (
                                            <span className="text-sm font-semibold">{setIdx + 1}</span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          </div>
        )}
      </main>
    </div>
  );
}
