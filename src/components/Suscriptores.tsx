import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProfessionalDataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copyStatus, setCopyStatus] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase
          .from('users')
          .select('name, email, whatssapp');

        query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });

        const { data: tableData, error } = await query;

        if (error) throw error;
        setData(tableData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortConfig]);

  const copyAllEmails = () => {
    const validEmails = data
      .map(user => user.email)
      .filter(email => email && email.includes('@'));
    
    if (validEmails.length === 0) {
      setCopyStatus('No hay emails válidos');
      setTimeout(() => setCopyStatus(''), 2000);
      return;
    }

    const emailsString = validEmails.join('; ');
    navigator.clipboard.writeText(emailsString)
      .then(() => {
        setCopyStatus(`${validEmails.length} emails copiados!`);
        setTimeout(() => setCopyStatus(''), 2000);
      })
      .catch(() => {
        setCopyStatus('Error al copiar');
        setTimeout(() => setCopyStatus(''), 2000);
      });
  };

  const openWhatsApp = (phoneNumber) => {
    // Limpia el número de teléfono (elimina espacios, guiones, etc.)
    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Verifica si el número tiene el prefijo internacional
    const formattedNumber = cleanedNumber.startsWith('+') ? cleanedNumber : `+${cleanedNumber}`;
    
    // Abre WhatsApp con el número
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Usuarios</h2>
        <button
          onClick={copyAllEmails}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          title="Copiar todos los emails válidos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Copiar Emails
          {copyStatus && (
            <span className="ml-2 text-sm font-medium text-green-600 animate-pulse">
              {copyStatus}
            </span>
          )}
        </button>
      </div>

      {/* Tabla */}
      <div className="relative">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
                <tr>
                  <th 
                    className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition duration-150"
                    onClick={() => requestSort('name')}
                  >
                    Nombre
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition duration-150"
                    onClick={() => requestSort('email')}
                  >
                    Email
                    {sortConfig.key === 'email' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition duration-150"
                    onClick={() => requestSort('whatssapp')}
                  >
                    WhatsApp
                    {sortConfig.key === 'whatssapp' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.email || <span className="text-gray-400">No proporcionado</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.whatssapp || <span className="text-gray-400">No proporcionado</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.whatssapp ? (
                        <button
                          onClick={() => openWhatsApp(item.whatssapp)}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                          title="Enviar mensaje por WhatsApp"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </button>
                      ) : (
                        <span className="text-gray-400">No disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, data.length)}
                </span>{' '}
                de <span className="font-medium">{data.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Siguiente</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}