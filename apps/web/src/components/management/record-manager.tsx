"use client"

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react"
import { AlertCircle, RefreshCw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-client"

type FieldType = "text" | "email" | "password" | "number" | "date" | "textarea" | "select" | "checkbox"

export interface FieldConfig {
  name: string
  label: string
  type?: FieldType
  required?: boolean
  options?: { label: string; value: string }[]
  optionEndpoint?: string
  optionLabelKey?: string
  optionValueKey?: string
}

export interface ColumnConfig<TRecord> {
  label: string
  render: (record: TRecord) => ReactNode
}

interface RecordManagerProps<TRecord extends { id: string }> {
  title: string
  description: string
  endpoint: string
  fields: FieldConfig[]
  columns: ColumnConfig<TRecord>[]
  emptyText: string
  transformPayload?: (payload: Record<string, string | boolean>) => Record<string, unknown>
}

export function RecordManager<TRecord extends { id: string }>({
  title,
  description,
  endpoint,
  fields,
  columns,
  emptyText,
  transformPayload,
}: RecordManagerProps<TRecord>) {
  const [records, setRecords] = useState<TRecord[]>([])
  const [options, setOptions] = useState<Record<string, { label: string; value: string }[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const initialForm = useMemo(
    () =>
      fields.reduce<Record<string, string | boolean>>((acc, field) => {
        acc[field.name] = field.type === "checkbox" ? false : ""
        return acc
      }, {}),
    [fields],
  )
  const [form, setForm] = useState(initialForm)

  async function loadRecords() {
    setLoading(true)
    setError("")
    try {
      setRecords(await fetchApi<TRecord[]>(endpoint))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [endpoint])

  useEffect(() => {
    fields
      .filter((field) => field.optionEndpoint)
      .forEach(async (field) => {
        try {
          const values = await fetchApi<Record<string, unknown>[]>(field.optionEndpoint!)
          setOptions((current) => ({
            ...current,
            [field.name]: values.map((value) => ({
              label: String(value[field.optionLabelKey ?? "name"] ?? value.id),
              value: String(value[field.optionValueKey ?? "id"] ?? value.id),
            })),
          }))
        } catch {
          setOptions((current) => ({ ...current, [field.name]: [] }))
        }
      })
  }, [fields])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")

    const payload = transformPayload ? transformPayload(form) : defaultTransform(form, fields)

    try {
      await fetchApi<TRecord>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      setForm(initialForm)
      setMessage("Saved")
      await loadRecords()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="border-b border-stone-200 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadRecords} disabled={loading}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </section>

      <form onSubmit={onSubmit} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "md:col-span-2 xl:col-span-3" : ""}>
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{field.label}</span>
              {renderField(field, form, setForm, options[field.name])}
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            <Save className="size-4" aria-hidden="true" />
            {saving ? "Saving..." : "Save"}
          </Button>
          {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
          {error ? (
            <p className="flex items-center gap-2 text-sm font-medium text-rose-700">
              <AlertCircle className="size-4" aria-hidden="true" />
              {error}
            </p>
          ) : null}
        </div>
      </form>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                {columns.map((column) => (
                  <th key={column.label} className="px-4 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-stone-500" colSpan={columns.length}>
                    Loading...
                  </td>
                </tr>
              ) : records.length ? (
                records.map((record) => (
                  <tr key={record.id} className="align-top">
                    {columns.map((column) => (
                      <td key={column.label} className="px-4 py-3 text-stone-700">
                        {column.render(record)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-8 text-stone-500" colSpan={columns.length}>
                    {emptyText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function renderField(
  field: FieldConfig,
  form: Record<string, string | boolean>,
  setForm: (form: Record<string, string | boolean>) => void,
  endpointOptions: { label: string; value: string }[] = [],
) {
  const baseClass =
    "mt-1 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
  const value = form[field.name]

  if (field.type === "textarea") {
    return (
      <textarea
        className={`${baseClass} min-h-24 py-2`}
        required={field.required}
        value={String(value)}
        onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
      />
    )
  }

  if (field.type === "select") {
    const choices = field.options ?? endpointOptions
    return (
      <select
        className={baseClass}
        required={field.required}
        value={String(value)}
        onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
      >
        <option value="">Select...</option>
        {choices.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === "checkbox") {
    return (
      <input
        className="mt-3 size-5 rounded border-stone-300"
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })}
      />
    )
  }

  return (
    <input
      className={baseClass}
      type={field.type ?? "text"}
      required={field.required}
      value={String(value)}
      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
    />
  )
}

function defaultTransform(payload: Record<string, string | boolean>, fields: FieldConfig[]) {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => {
        const field = fields.find((candidate) => candidate.name === key)
        return [key, field?.type === "number" ? Number(value) : value]
      }),
  )
}
