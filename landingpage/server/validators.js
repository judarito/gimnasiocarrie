import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Debe ser un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Debe ser un correo válido'),
  message: z.string().min(10, 'El mensaje es muy corto'),
})

export const postSchema = z.object({
  type: z.enum(['news', 'event']),
  title: z.string().min(3, 'El título es obligatorio'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  location: z.string().optional(),
  eventDate: z.string().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export function validate(schema, data) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const issues = result.error?.errors || result.error?.issues || []
    const message = issues.map(e => e.message).join(', ') || 'Error de validación'
    const error = new Error(message)
    error.status = 400
    throw error
  }
  return result.data
}
