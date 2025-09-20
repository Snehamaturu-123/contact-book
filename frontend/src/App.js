import React, { useEffect, useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';

const API_BASE = '/api/contacts';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?page=${p}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setContacts(data.contacts);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      alert('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(1); }, []);

  const addContact = async (contact) => {
    // optimistic UI: push locally while saving
    try {
      const tempId = `temp-${Date.now()}`;
      setContacts(prev => [{ ...contact, _id: tempId }, ...prev]);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (!res.ok) {
        // revert and throw
        await fetchContacts(page);
        const err = await res.json().catch(()=>({message:'Unknown error'}));
        throw new Error(err.message || 'Failed to add contact');
      }
      // refresh current page after success (to get server _id & consistent pagination)
      fetchContacts(page);
    } catch (err) {
      console.error(err);
      alert('Error adding contact: ' + err.message);
    }
  };

  const deleteContact = async (id) => {
    // optimistic remove UI
    const original = contacts;
    setContacts(prev => prev.filter(c => c._id !== id));
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete contact');
      }
      // refresh (to maintain pagination)
      fetchContacts(page);
    } catch (err) {
      console.error(err);
      setContacts(original); // revert
      alert('Error deleting contact');
    }
  };

  return (
    <div className="app">
      <h1>Contact Book</h1>
      <ContactForm addContact={addContact} />
      <div className="meta">
        <span>Total: {total}</span>
      </div>
    
      <ContactList
  contacts={contacts}
  deleteContact={handleDelete}
  loading={loading}
  page={page}
  totalPages={totalPages}
  setPage={setPage}
/>
      <Pagination page={page} pages={pages} onChange={p => fetchContacts(p)} />
    </div>
  );
}
