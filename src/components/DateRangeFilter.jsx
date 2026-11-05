import PropTypes from 'prop-types';
import { getLastDaysRange } from '../utils/dates';

const PRESETS = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
];

const dateInputClasses =
  'rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';

function DateRangeFilter({ desde, hasta, onChange }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="range-desde" className="mb-1 block text-xs font-medium text-gray-600">
          Desde
        </label>
        <input
          id="range-desde"
          type="date"
          value={desde}
          max={hasta}
          onChange={(e) => e.target.value && onChange({ desde: e.target.value, hasta })}
          className={dateInputClasses}
        />
      </div>
      <div>
        <label htmlFor="range-hasta" className="mb-1 block text-xs font-medium text-gray-600">
          Hasta
        </label>
        <input
          id="range-hasta"
          type="date"
          value={hasta}
          min={desde}
          onChange={(e) => e.target.value && onChange({ desde, hasta: e.target.value })}
          className={dateInputClasses}
        />
      </div>
      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.days}
            type="button"
            onClick={() => onChange(getLastDaysRange(preset.days))}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

DateRangeFilter.propTypes = {
  desde: PropTypes.string.isRequired,
  hasta: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateRangeFilter;
