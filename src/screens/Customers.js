import React, { useEffect, useState } from "react";
// import api from "../api/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("customerId");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    // Mock data for frontend-only use
    const mockCustomers = [
      {
        customerId: 1,
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        phone: "555-1234",
        address: "123 Main St, Cityville"
      },
      {
        customerId: 2,
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
        phone: "555-5678",
        address: "456 Oak Ave, Townsville"
      },
      {
        customerId: 3,
        firstName: "Carol",
        lastName: "Williams",
        email: "carol@example.com",
        phone: "555-9012",
        address: "789 Pine Rd, Villageburg"
      }
    ];
    setCustomers(mockCustomers);
  }, []);

  const filtered = customers.filter(c =>
    (c.firstName + " " + c.lastName).toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) setSortAsc(!sortAsc);
    else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <h2>Customers</h2>
      <div style={{marginBottom: 16}}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone"
          style={{padding: 8, width: 260}}
        />
      </div>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th onClick={() => handleSort("customerId")} style={{cursor: 'pointer'}}>ID {sortBy === "customerId" ? (sortAsc ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort("firstName")} style={{cursor: 'pointer'}}>Name {sortBy === "firstName" ? (sortAsc ? '▲' : '▼') : ''}</th>
            <th onClick={() => handleSort("email")} style={{cursor: 'pointer'}}>Email {sortBy === "email" ? (sortAsc ? '▲' : '▼') : ''}</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(c => (
            <tr key={c.customerId}>
              <td>{c.customerId}</td>
              <td>{c.firstName} {c.lastName}</td>
              <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
              <td><a href={`tel:${c.phone}`}>{c.phone}</a></td>
              <td>{c.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
