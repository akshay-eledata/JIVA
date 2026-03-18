import React, { createContext, useContext, useState } from 'react';

interface ScheduleContextType {
    isScheduled: boolean;
    confirmSchedule: () => void;
    resetSchedule: () => void;
    isRescheduled: boolean;
    confirmReschedule: () => void;
    resetReschedule: () => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isScheduled, setIsScheduled] = useState(false);
    const [isRescheduled, setIsRescheduled] = useState(false);

    const confirmSchedule = () => setIsScheduled(true);
    const resetSchedule = () => setIsScheduled(false);

    const confirmReschedule = () => setIsRescheduled(true);
    const resetReschedule = () => setIsRescheduled(false);

    return (
        <ScheduleContext.Provider value={{ isScheduled, confirmSchedule, resetSchedule, isRescheduled, confirmReschedule, resetReschedule }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useSchedule must be used within a ScheduleProvider');
    }
    return context;
};
