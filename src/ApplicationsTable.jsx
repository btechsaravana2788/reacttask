import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './ApplicationsTable.css'; // Optional CSS for styling

const ApplicationsTable = () => {
  // State Management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Data from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/RashitKhamidullin/Educhain-Assignment/refs/heads/main/applications'
        );
        setApplications(response.data); // Ensure API returns an array
        setLoading(false);
      } catch (err) {
        setError('Error fetching applications.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Search Filter Logic
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = searchQuery.toLowerCase();
      return (
        app?.applicantName?.toLowerCase().includes(query) ||
        app?.status_En?.toLowerCase().includes(query) ||
        app?.studentID?.toLowerCase().includes(query)
      );
    });
  }, [applications, searchQuery]);

  // Sorting Logic
  const sortedApplications = useMemo(() => {
  const sorted = [...filteredApplications];
  if (sortConfig.key) {
    sorted.sort((a, b) => {
      const valueA = a?.[sortConfig.key] || ''; // Default to empty string if undefined
      const valueB = b?.[sortConfig.key] || '';
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return sorted;
}, [filteredApplications, sortConfig]);


  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedApplications.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);

  // Handle Sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // UI Rendering
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="table-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="applications-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('applicationNO')}>Application No</th>
            <th onClick={() => requestSort('applicantName')}>Applicant Name</th>
            <th onClick={() => requestSort('applicationDate')}>Application Date</th>
            <th>Student ID</th>
            <th>Paid Amount</th>
            <th>Status (English)</th>
            <th>Status (Arabic)</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
      currentItems.map((app, index) => (
        <tr key={index}>
          <td>{app.applicationNO}</td>
          <td>{app.applicantName}</td>
          <td>{app.applicationDate}</td>
          <td>{app.studentID}</td>
          <td>{app.paidAmount}</td>
          <td>{app.status_En}</td>
          <td>{app.status_Ar}</td>
          <td>{app.lastDate}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" style={{ textAlign: 'center', padding: '10px' }}>
          No records found
        </td>
      </tr>
    )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsTable;
