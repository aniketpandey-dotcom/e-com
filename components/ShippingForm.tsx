"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/stores/checkout-store";

type Errors = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export default function ShippingForm() {
  const { shipping, updateShipping, nextStep } = useCheckoutStore();

  const [form, setForm] = useState(shipping);

  const [errors, setErrors] = useState<Errors>({});

  function validate() {
    const newErrors: Errors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!form.zipCode.trim()) {
      newErrors.zipCode = "ZIP Code is required";
    } else if (!/^\d{5,6}$/.test(form.zipCode)) {
      newErrors.zipCode = "Enter a valid ZIP Code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    updateShipping(form);
    nextStep();
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm({
      ...form,
      [field]: value,
    });

    setErrors({
      ...errors,
      [field]: "",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      <div>
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
        )}
      </div>

      <div>
        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => handleChange("state", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-500">{errors.state}</p>
        )}
      </div>

      <div>
        <input
          placeholder="ZIP Code"
          value={form.zipCode}
          onChange={(e) => handleChange("zipCode", e.target.value)}
          className="w-full rounded border p-3"
        />
        {errors.zipCode && (
          <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
        )}
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        Continue
      </button>
    </form>
  );
}
