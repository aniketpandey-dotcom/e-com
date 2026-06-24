"use client";

import { useState } from "react";

const TIP_OPTIONS = [10, 15, 20, 25];

export default function TipCalculatorPage() {
  const [bill, setBill] = useState("");
  const [selectedTip, setSelectedTip] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState(1);

  const billAmount = Number(bill) || 0;

  const tipPercentage = customTip !== "" ? Number(customTip) : selectedTip;

  const tipAmount = (billAmount * tipPercentage) / 100;

  const totalAmount = billAmount + tipAmount;

  // Round up to nearest cent
  const perPerson =
    people > 0 ? Math.ceil((totalAmount / people) * 100) / 100 : 0;

  function handleTipSelect(tip: number) {
    setSelectedTip(tip);
    setCustomTip("");
  }

  function resetCalculator() {
    setBill("");
    setSelectedTip(15);
    setCustomTip("");
    setPeople(1);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-slate-800">
          Tip Calculator
        </h1>

        <div className="grid gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">
          {/* Left Section */}
          <div>
            {/* Bill */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Bill Amount
              </label>

              <input
                type="number"
                min="0"
                placeholder="Enter bill amount"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Tip Buttons */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Select Tip %
              </label>

              <div className="grid grid-cols-2 gap-3">
                {TIP_OPTIONS.map((tip) => (
                  <button
                    key={tip}
                    onClick={() => handleTipSelect(tip)}
                    className={`rounded-lg p-3 font-semibold transition-all duration-200 hover:scale-105 ${
                      selectedTip === tip && customTip === ""
                        ? "bg-green-600 text-white"
                        : "bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    {tip}%
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tip */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Custom Tip %
              </label>

              <input
                type="number"
                min="0"
                placeholder="Enter custom tip"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* People */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Number of People
              </label>

              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={resetCalculator}
              className="w-full rounded-lg bg-red-500 p-3 font-semibold text-white transition hover:bg-red-600"
            >
              Reset
            </button>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-center rounded-2xl bg-slate-900 p-8 text-white">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Tip Amount</h3>
                <p className="text-sm text-gray-300">Total tip</p>
              </div>

              <span className="text-3xl font-bold text-green-400">
                ${tipAmount.toFixed(2)}
              </span>
            </div>

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Total Amount</h3>
                <p className="text-sm text-gray-300">Bill + Tip</p>
              </div>

              <span className="text-3xl font-bold text-green-400">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Per Person</h3>
                <p className="text-sm text-gray-300">Split equally</p>
              </div>

              <span className="text-4xl font-bold text-cyan-400">
                ${perPerson.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
