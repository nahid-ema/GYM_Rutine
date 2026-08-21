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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 uppercase">Iron Track</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gym Routine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full text-xs font-bold text-zinc-700">
              <Calendar className="w-3.5 h-3.5 opacity-60" />
              <span>{new Date(currentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
            <button 
              onClick={resetToday}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
              title="Reset today's progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Total Progress Bar */}
        <div className="w-full h-1 bg-zinc-100">
          <div 
            className="h-full bg-zinc-900 transition-all duration-500 ease-out"
            style={{ width: `${calculateTotalProgress()}%` }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {workoutSchedule.map(day => (
            <button
              key={day.dayNumber}
              onClick={() => {
                setActiveDayNumber(day.dayNumber);
                setActiveGroup(null);
              }}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl text-left transition-all ${
                activeDayNumber === day.dayNumber
                  ? 'bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900 ring-offset-2 ring-offset-zinc-50'
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <span className="block text-sm font-bold mb-0.5">Day {day.dayNumber}</span>
              <span className={`block text-[11px] font-semibold uppercase tracking-wider ${
                activeDayNumber === day.dayNumber ? 'text-zinc-300' : 'text-zinc-400'
              }`}>
                {day.name}
              </span>
            </button>
          ))}
        </div>

        {currentDayConfig.isRest ? (
          <div className="bg-white rounded-[24px] border border-zinc-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Rest & Recover</h2>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm leading-relaxed font-medium">
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
                className={`bg-white rounded-[24px] border transition-all duration-300 ${
                  isActive ? 'border-zinc-300 shadow-md ring-4 ring-zinc-50/50' : 'border-zinc-200 shadow-sm hover:border-zinc-300'
                }`}
              >
                <button
                  onClick={() => setActiveGroup(isActive ? null : group.id)}
                  className="w-full px-6 py-5 flex items-center justify-between outline-none"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center border-2 transition-colors duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                        : isActive 
                          ? 'bg-zinc-900 border-zinc-900 text-white'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold text-sm">{groupProgress}%</span>}
                    </div>
                    <div className="text-left">
                      <h2 className={`text-xl font-black tracking-tight ${isCompleted ? 'text-zinc-900' : 'text-zinc-900'}`}>
                        {group.name}
                      </h2>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                        {group.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  <div className={`text-zinc-400 transition-transform duration-300 ${isActive ? 'rotate-180 text-zinc-900' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-3 space-y-8 border-t border-zinc-100">
                        {group.exercises.map((exercise, idx) => {
                          const exProg = getExerciseProgress(exercise.id);
                          const completedSets = exProg.filter(Boolean).length;
                          const isExCompleted = completedSets === exercise.maxSets;
                          
                          return (
                            <div key={exercise.id} className="relative">
                              {idx !== group.exercises.length - 1 && (
                                <div className="absolute left-4 top-14 bottom-[-32px] w-0.5 bg-zinc-100 rounded-full" />
                              )}
                              
                              <div className="flex items-start gap-5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 text-xs font-bold z-10 transition-colors ${
                                  isExCompleted 
                                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' 
                                    : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                                }`}>
                                  {isExCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h3 className={`font-bold text-base tracking-tight ${isExCompleted ? 'text-zinc-400 line-through decoration-zinc-300' : 'text-zinc-900'}`}>
                                        {exercise.name}
                                      </h3>
                                      <p className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">
                                        {exercise.maxSets} sets <span className="mx-1.5 opacity-50">•</span> {exercise.repsText}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2.5">
                                    {Array.from({ length: exercise.maxSets }).map((_, setIdx) => {
                                      const isChecked = !!exProg[setIdx];
                                      return (
                                        <button
                                          key={setIdx}
                                          onClick={() => toggleSet(exercise.id, setIdx)}
                                          className={`relative h-11 flex-1 min-w-[3.5rem] max-w-[4.5rem] flex items-center justify-center rounded-[14px] border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                                            isChecked
                                              ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                                              : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
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
                                            <span className="text-sm font-bold">{setIdx + 1}</span>
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
