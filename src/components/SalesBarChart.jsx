import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../utils/format';

function SalesBarChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="grupo" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={70} tickFormatter={(v) => `S/ ${v}`} />
          <Tooltip formatter={(value) => [formatCurrency(value), 'Total vendido']} />
          <Bar dataKey="total" fill="#1f5ae0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

SalesBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      grupo: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default SalesBarChart;
