"use client";

import React from "react";

export default function SalaryControls({
  payType,
  setPayType,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  payExact,
  setPayExact,
  rateUnit,
  setRateUnit,
  disabled,
}: {
  payType: "range" | "exact";
  setPayType: (v: "range" | "exact") => void;
  salaryMin?: number;
  setSalaryMin: (v?: number) => void;
  salaryMax?: number;
  setSalaryMax: (v?: number) => void;
  payExact?: number;
  setPayExact: (v?: number) => void;
  rateUnit: "per year" | "per hour" | "per day" | "per month";
  setRateUnit: (v: "per year" | "per hour" | "per day" | "per month") => void;
  disabled?: boolean;
}) {
  const inputCls =
    "w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
        {/* Pay Type */}
        <div className="w-full md:w-1/4">
          <label className="block text-sm mb-1 text-gray-300">
            Show pay by
          </label>
          <select
            className={`${inputCls} text-sm`}
            value={payType}
            onChange={(e) => setPayType(e.target.value as any)}
            disabled={disabled}
          >
            <option value="range">Range</option>
            <option value="exact">Exact amount</option>
          </select>
        </div>

        {/* Salary Inputs */}
        {payType === "range" ? (
          <>
            <div className="w-full md:w-1/4">
              <label className="block text-sm mb-1 text-transparent select-none">
                Min
              </label>
              <input
                type="number"
                min={0}
                placeholder="Minimum"
                className={`${inputCls} text-sm`}
                value={salaryMin ?? ""}
                onChange={(e) =>
                  setSalaryMin(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                disabled={disabled}
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm mb-1 text-transparent select-none">
                Max
              </label>
              <input
                type="number"
                min={0}
                placeholder="Maximum"
                className={`${inputCls} text-sm`}
                value={salaryMax ?? ""}
                onChange={(e) =>
                  setSalaryMax(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                disabled={disabled}
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm mb-1 text-transparent select-none">
                Unit
              </label>
              <select
                className={`${inputCls} text-sm`}
                value={rateUnit}
                onChange={(e) => setRateUnit(e.target.value as any)}
                disabled={disabled}
              >
                <option>per year</option>
                <option>per month</option>
                <option>per day</option>
                <option>per hour</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="w-full md:w-1/4">
              <label className="block text-sm mb-1 text-transparent select-none">
                Amount
              </label>
              <input
                type="number"
                min={0}
                placeholder="Amount"
                className={`${inputCls} text-sm`}
                value={payExact ?? ""}
                onChange={(e) =>
                  setPayExact(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                disabled={disabled}
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm mb-1 text-transparent select-none">
                Unit
              </label>
              <select
                className={`${inputCls} text-sm`}
                value={rateUnit}
                onChange={(e) => setRateUnit(e.target.value as any)}
                disabled={disabled}
              >
                <option>per year</option>
                <option>per month</option>
                <option>per day</option>
                <option>per hour</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
