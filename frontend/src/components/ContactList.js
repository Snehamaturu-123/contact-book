import React from 'react';

export default function ContactList({ contacts, deleteContact, loading, page, totalPages, setPage }) {
  if (loading) return <div>Loading...</div>;
  if (!contacts || contacts.length === 0) return <div>No contacts found</div>;

  return (
    <div className="contact-list">
      {contacts.map(c => (
        <div className="contact-item" key={c._id}>
          <div className="info">
            <div className="name">{c.name}</div>
            <div className="email">{c.email}</div>
          </div>
          <div className="right">
            <div className="phone">{c.phone}</div>
            <button
              className="delete"
              onClick={() => {
                if (window.confirm('Delete this contact?')) deleteContact(c._id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
