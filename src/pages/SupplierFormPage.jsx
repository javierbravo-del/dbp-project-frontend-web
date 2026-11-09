import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supplierService } from '../services/supplierService'
import { getErrorMessage } from '../utils/errors'
import PageHeader from '../components/PageHeader'
import SupplierForm from '../components/SupplierForm'

const EMPTY_VALUES = { ruc: '', razonSocial: '', telefono: '', correo: '' }

const BREADCRUMBS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Proveedores', to: '/suppliers' },
  { label: 'Nuevo proveedor' },
]

const toPayload = (values) => ({
  ruc: values.ruc.trim(),
  razonSocial: values.razonSocial.trim(),
  telefono: values.telefono.trim() || null,
  correo: values.correo.trim() || null,
})

export default function SupplierFormPage() {
  const navigate = useNavigate()

    const handleSubmit = async (values) => {
    try {
      const payload = toPayload(values)
      const existing = await supplierService.getAll({ page: 1, size: 100 })
      if (existing.content.some((supplier) => supplier.ruc === payload.ruc)) {
        toast.error('Ya tienes registrado un proveedor con ese RUC')
        return
      }
      await supplierService.create(payload)
      toast.success('Proveedor creado correctamente')
      navigate('/suppliers')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Nuevo proveedor" breadcrumbs={BREADCRUMBS} />
      <SupplierForm
        defaultValues={EMPTY_VALUES}
        onSubmit={handleSubmit}
        submitLabel="Crear proveedor"
      />
    </section>
  )
}