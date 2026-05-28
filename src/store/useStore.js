import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. استيراد ميزة الحفظ الدائم

export const useStore = create(
  persist(
    (set) => ({
      settings: {
        subject: '',
        className: '',
        semester: 'الثاني',
        year: '2025 / 2026',
        teacher: '',
        principal: '',
      },
      studentsData: [],
      setSettings: (newSettings) => set((state) => ({ 
        settings: { ...state.settings, ...newSettings } 
      })),
      setStudentsData: (data) => set({ studentsData: data }),
    }),
    { 
      name: 'noormark-storage' // 2. الاسم الذي سيظهر في متصفحك (في LocalStorage)
    }
  )
);