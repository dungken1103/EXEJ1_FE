import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import toast from "../../utils/toast";
import {
  PencilSquareIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

const ManageBookPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [addQuantity, setAddQuantity] = useState(0);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await bookService.getAll();
      let data = res.data;
      if (search.trim()) {
        data = data.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    }
  };

  const handleDisable = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be disabled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, disable it!",
    });

    if (result.isConfirmed) {
      try {
        await bookService.disable(id);
        fetchBooks();
        toast.success("Disabled!", "The book has been disabled.");
      } catch (err) {
        toast.error("Error", "Failed to disable book.");
      }
    }
  };

  const openAddStockModal = (book) => {
    setSelectedBook(book);
    setAddQuantity(0);
    setIsModalOpen(true);
  };

  const handleAddStock = async () => {
    try {
      const newStock = selectedBook.stock + addQuantity;
      await bookService.updateStock(selectedBook.id, newStock);
      toast.success("Thành công", "Cập nhật tồn kho thành công!");
      fetchBooks();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Lỗi", "Không thể cập nhật tồn kho");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">📚 Book Management</h1>
        <button
          onClick={() => navigate("/admin-dashboard/books/new")}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          <PlusIcon className="w-5 h-5" /> Add Book
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by book title..."
          className="border px-4 py-2 w-full rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="px-4 py-2">
                    {book.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${book.image}`}
                        alt={book.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">
                    {Number(book.price).toLocaleString()} đ
                  </td>
                  <td className="px-4 py-2 text-center">{book.stock || 0}</td>
                  <td className="px-4 py-2 text-center">{book.sold || 0}</td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin-dashboard/books/edit/${book.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDisable(book.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/product/${book.id}`)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openAddStockModal(book)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h3 className="font-bold mb-2">Add Stock</h3>
            <input
              type="number"
              value={addQuantity}
              onChange={(e) => setAddQuantity(Number(e.target.value))}
              className="border rounded p-2 w-full mb-4"
              placeholder="Enter quantity to add"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStock}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookPage;
