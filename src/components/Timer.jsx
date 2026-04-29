"use client";
import { useState, useEffect } from "react";

const TimerUnit = ({ value, label }) => {
    return (
        <div className="flip-unit flex flex-col items-center">
            <div key={value} className="flip-card animate-flip tabular-nums">
                {value.toString().padStart(2, '0')}
            </div>
            <span className="label text-[10px] mt-2 uppercase tracking-widest text-neutral-500">
                {label}
            </span>
        </div>
    );
};

export default function Timer({ eDate }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            if (!eDate) return;

            const normalized = eDate.trim().replace("T", " ");
            const [datePart, timePart = "00:00:00"] = normalized.split(" ");
            const [year, month, day] = datePart.split("-").map(Number);
            const [hours = 0, minutes = 0, seconds = 0] = timePart.split(":").map(Number);

            const target = new Date(year, month - 1, day, hours, minutes, seconds);
            const distance = target.getTime() - Date.now();

            console.log("eDate:", eDate, "| target:", target.toString(), "| distance:", distance);

            if (isNaN(target.getTime()) || distance <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / 1000 / 60) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
        };

        updateTimer();
        requestAnimationFrame(() => setIsReady(true));
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [eDate]);

    if (!isReady) return <div className="h-28" />;

    return (
        <div className="timer-container flex gap-4 p-6 bg-black rounded-2xl border border-white/5 items-center justify-center">
            <TimerUnit value={timeLeft.days} label="Days" />
            <TimerUnit value={timeLeft.hours} label="Hours" />
            <TimerUnit value={timeLeft.minutes} label="Minutes" />
            <TimerUnit value={timeLeft.seconds} label="Seconds" />
        </div>
    );
}