/**
 * Shared form field component with validation styling and Hebrew error messages.
 * Works with react-hook-form's register.
 */
import { forwardRef } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { FieldError } from 'react-hook-form';

// ─── Validation patterns ───
export const patterns = {
  /** Israeli mobile: 05X-XXXXXXX or 05XXXXXXXX */
  israeliPhone: /^05\d[-]?\d{7}$/,
  /** Basic email */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
};

// ─── Hebrew error messages ───
export const messages = {
  required: (field: string) => `${field} הוא שדה חובה`,
  minLength: (field: string, min: number) => `${field} חייב להכיל לפחות ${min} תווים`,
  maxLength: (field: string, max: number) => `${field} לא יכול לעלות על ${max} תווים`,
  positiveNumber: (field: string) => `${field} חייב להיות מספר חיובי`,
  maxNumber: (field: string, max: number) => `${field} לא יכול לעלות על ${max.toLocaleString()}`,
  israeliPhone: 'מספר טלפון לא תקין (פורמט: 05X-XXXXXXX)',
  email: 'כתובת אימייל לא תקינה',
};

// ─── Rule builders ───
export const rules = {
  required: (field: string) => ({ required: messages.required(field) }),
  requiredMin: (field: string, min: number) => ({
    required: messages.required(field),
    minLength: { value: min, message: messages.minLength(field, min) },
  }),
  positiveInt: (field: string) => ({
    required: messages.required(field),
    validate: (v: string) => {
      const n = parseInt(v, 10);
      if (isNaN(n) || n <= 0) return messages.positiveNumber(field);
      return true;
    },
  }),
  optionalPositiveInt: (field: string) => ({
    validate: (v: string) => {
      if (!v || v === '') return true;
      const n = parseInt(v, 10);
      if (isNaN(n) || n <= 0) return messages.positiveNumber(field);
      return true;
    },
  }),
  positivePrice: (field: string, max = 10_000_000) => ({
    required: messages.required(field),
    validate: (v: string) => {
      const n = parseFloat(v);
      if (isNaN(n) || n <= 0) return messages.positiveNumber(field);
      if (n > max) return messages.maxNumber(field, max);
      return true;
    },
  }),
  israeliPhone: (required = false) => ({
    ...(required ? { required: messages.required('טלפון') } : {}),
    validate: (v: string) => {
      if (!v || v.trim() === '') return required ? messages.required('טלפון') : true;
      return patterns.israeliPhone.test(v.trim()) || messages.israeliPhone;
    },
  }),
  email: (required = false) => ({
    ...(required ? { required: messages.required('אימייל') } : {}),
    validate: (v: string) => {
      if (!v || v.trim() === '') return required ? messages.required('אימייל') : true;
      return patterns.email.test(v.trim()) || messages.email;
    },
  }),
};

// ─── Base input class ───
const baseInput =
  'w-full border rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 transition-all';

function inputClasses(error?: FieldError, isDirty?: boolean) {
  if (error) {
    return `${baseInput} border-red-400 focus:ring-red-200 focus:border-red-400 bg-red-50/30`;
  }
  if (isDirty) {
    return `${baseInput} border-green-400 focus:ring-green-200 focus:border-green-400`;
  }
  return `${baseInput} border-[#e7e1da] focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]`;
}

// ─── FormField component ───
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  isDirty?: boolean;
  /** Use if you want to render a <select> or <textarea> instead — pass children */
  children?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, isDirty, children, className, ...rest }, ref) {
    return (
      <div className={className}>
        <label className="text-[13px] text-[#8d785e] mb-1 flex items-center gap-1" style={{ fontWeight: 600 }}>
          {label}
          {rest.required !== undefined && rest.required !== false && (
            <span className="text-red-400 text-[11px]">*</span>
          )}
        </label>
        {children ? (
          children
        ) : (
          <div className="relative">
            <input
              ref={ref}
              {...rest}
              className={inputClasses(error, isDirty)}
            />
            {/* Status icon */}
            {error && (
              <AlertCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
            )}
            {!error && isDirty && (
              <CheckCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
        )}
        {/* Error message */}
        {error && (
          <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1" style={{ fontWeight: 500 }}>
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

// ─── FormSelect (for selects) ───
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  isDirty?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  function FormSelect({ label, error, isDirty, children, className, ...rest }, ref) {
    const selectClass = error
      ? `${baseInput} border-red-400 focus:ring-red-200 focus:border-red-400 bg-red-50/30 bg-white`
      : isDirty
      ? `${baseInput} border-green-400 focus:ring-green-200 focus:border-green-400 bg-white`
      : `${baseInput} border-[#e7e1da] focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-white`;

    return (
      <div className={className}>
        <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>
          {label}
        </label>
        <select ref={ref} {...rest} className={selectClass}>
          {children}
        </select>
        {error && (
          <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1" style={{ fontWeight: 500 }}>
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

// ─── FormTextarea ───
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  isDirty?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea({ label, error, isDirty, className, ...rest }, ref) {
    const textareaClass = error
      ? `${baseInput} border-red-400 focus:ring-red-200 focus:border-red-400 bg-red-50/30 resize-none`
      : isDirty
      ? `${baseInput} border-green-400 focus:ring-green-200 focus:border-green-400 resize-none`
      : `${baseInput} border-[#e7e1da] focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] resize-none`;

    return (
      <div className={className}>
        <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>
          {label}
        </label>
        <textarea ref={ref} {...rest} className={textareaClass} />
        {error && (
          <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1" style={{ fontWeight: 500 }}>
            <AlertCircle size={12} />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);
