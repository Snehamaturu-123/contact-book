import React from 'react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>Prev</button>
      <span>Page {page} of {pages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page >= pages}>Next</button>
    </div>
  );
}
