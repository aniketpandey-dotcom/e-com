"use client";

import { useEffect, useState } from "react";

export default function StatusWidgetPage() {
  const [isOnline, setIsOnline] = useState(true);

  const [seconds, setSeconds] = useState(0);

  const [running, setRunning] = useState(true);

  const [showMessage, setShowMessage] = useState(false);

  // --------------------
  // Online / Offline Effect
  // --------------------
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setShowMessage(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // --------------------
  // Fade message
  // --------------------
  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showMessage]);

  // --------------------
  // Session Timer
  // --------------------
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");

  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold">Status Widget Panel</h1>

        {/* Online Status */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-semibold">Network Status</h2>

          <div
            className={`inline-block rounded-full px-4 py-2 font-semibold ${
              isOnline
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </div>

          {showMessage && (
            <p className="mt-4 text-green-600">Connection restored.</p>
          )}
        </div>

        {/* Session Timer */}
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-3 text-xl font-semibold">Session Timer</h2>

          <p className="mb-6 text-5xl font-bold">
            {minutes}:{secs}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setRunning(!running)}
              className="rounded-lg bg-blue-500 px-5 py-3 text-white hover:bg-blue-600"
            >
              {running ? "Pause" : "Resume"}
            </button>

            <button
              onClick={() => {
                setSeconds(0);
                setRunning(false);
              }}
              className="rounded-lg bg-red-500 px-5 py-3 text-white hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
