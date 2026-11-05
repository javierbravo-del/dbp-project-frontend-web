import PropTypes from 'prop-types';
import Spinner from './Spinner';

function DashboardCard({ title, action, isLoading, error, onRetry, isEmpty, emptyText, children }) {
  let content = children;

  if (error) {
    content = (
      <div role="alert" className="py-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  } else if (isLoading && isEmpty) {
    content = (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  } else if (isEmpty) {
    content = <p className="py-10 text-center text-sm text-gray-500">{emptyText}</p>;
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {content}
    </section>
  );
}

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.node,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  isEmpty: PropTypes.bool,
  emptyText: PropTypes.string,
  children: PropTypes.node,
};

export default DashboardCard;
