import React, { useState, useEffect } from 'react';
import { routineData, workoutSchedule } from './data';
import { CheckCircle2, Dumbbell, Coffee, Download, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [activeDayNumber, setActiveDayNumber] = useState<number>(() => {
    const saved = localStorage.getItem('fitness-active-day');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('fitness-active-day', activeDayNumber.toString());
  }, [activeDayNumber]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fitness-dark-mode');
    if (saved) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('fitness-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };
  
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
    <div className={`min-h-screen bg-zinc-100 dark:bg-black flex justify-center text-zinc-900 font-sans selection:bg-zinc-200 ${darkMode ? 'dark' : ''}`}>
      <div className="w-full max-w-[400px] bg-zinc-50 dark:bg-zinc-950 min-h-screen relative shadow-2xl flex flex-col sm:border-x border-zinc-200 dark:border-zinc-800">
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20">
          <div className="w-full mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-zinc-900 dark:bg-zinc-100 rounded-[10px] flex items-center justify-center text-white dark:text-zinc-900 shadow-sm shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white uppercase">Iron Track</h1>
                <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none mt-0.5">Gym Routine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              {deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="p-1.5 text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 rounded-full transition-colors flex items-center justify-center shrink-0"
                  title="Install App"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Total Progress Bar */}
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800">
            <div 
              className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out"
              style={{ width: `${calculateTotalProgress()}%` }}
            />
          </div>
        </header>

        <main className="flex-1 w-full px-4 py-6 pb-[90px] overflow-y-auto overflow-x-hidden hide-scrollbar">
          {currentDayConfig.isRest ? (
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm mt-10">
              <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">Rest & Recover</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto text-sm leading-relaxed font-medium">
                Your muscles grow when you rest. Stay hydrated, eat well, and get ready to hit it hard again tomorrow!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {visibleGroups.map((group) => {
                const groupProgress = calculateGroupProgress(group.id);
                const isCompleted = groupProgress === 100;
                
                return (
                  <div key={group.id} className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">{group.name}</h2>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                          {group.exercises.length} exercises
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {groupProgress}%
                      </div>
                    </div>
                    
                    <div className="px-5 py-6 space-y-7">
                      {group.exercises.map((exercise, idx) => {
                        const exProg = getExerciseProgress(exercise.id);
                        const completedSets = exProg.filter(Boolean).length;
                        const isExCompleted = completedSets === exercise.maxSets;
                        
                        return (
                          <div key={exercise.id} className="relative">
                            {idx !== group.exercises.length - 1 && (
                              <div className="absolute left-3.5 top-12 bottom-[-28px] w-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                            )}
                            
                            <div className="flex items-start gap-4">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 text-[11px] font-bold z-10 transition-colors ${
                                isExCompleted 
                                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200/50' 
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                              }`}>
                                {isExCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className={`font-bold text-[15px] tracking-tight leading-tight ${isExCompleted ? 'text-zinc-400 dark:text-zinc-600 line-through decoration-zinc-300 dark:decoration-zinc-700' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                      {exercise.name}
                                    </h3>
                                    <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                                      {exercise.maxSets} sets <span className="mx-1 opacity-50">•</span> {exercise.repsText}
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
                                        className={`relative h-10 flex-1 min-w-[3rem] max-w-[4rem] flex items-center justify-center rounded-[12px] border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                                          isChecked
                                            ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900 shadow-md'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
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
                  </div>
                );
              })}
            </div>
          )}
        </main>
        
        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 z-30 pb-safe">
          <div className="flex justify-around items-center px-2 py-2">
            {workoutSchedule.map(day => {
              const isActive = activeDayNumber === day.dayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayNumber(day.dayNumber)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                    isActive ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md' : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xs font-bold mb-0.5">Day {day.dayNumber}</span>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider text-center line-clamp-1 ${
                    isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {day.name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
