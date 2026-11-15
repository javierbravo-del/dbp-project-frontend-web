import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import HeroIllustration from './HeroIllustration'

export default function AuthPanel({ title, description }) {
  return (
    <section className="hidden flex-col justify-between bg-brand-600 p-10 text-white lg:flex">
      <Link to="/" aria-label="Volver a la portada">
        <Logo size={36} textClassName="text-white" />
      </Link>
      <div>
        <HeroIllustration width={400} className="mb-6 text-brand-200" />
        <h2 className="max-w-sm text-3xl font-bold leading-snug">{title}</h2>
        <p className="mt-4 max-w-sm text-sm text-white/75">{description}</p>
      </div>
      <p className="text-xs text-white/60">
        Gamarrito ERP · Hecho por estudiantes de UTEC para Gamarra
      </p>
    </section>
  )
}

AuthPanel.propTypes = { title: PropTypes.string.isRequired, description: PropTypes.string.isRequired }
