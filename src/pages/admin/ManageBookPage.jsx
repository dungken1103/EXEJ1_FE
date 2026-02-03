import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import productService from "../../services/productService";
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
      const res = await productService.getAll();
      let data = res.data;
      if (search.trim()) {
        data = data.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase()),
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

  const IconBtn = ({ children, onClick, danger, green }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition ${
        danger
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : green
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5a27]">Quản lý sách</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý danh sách sản phẩm trong hệ thống
          </p>
        </div>
        <button
          onClick={() => navigate("/admin-dashboard/books/new")}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white shadow"
          style={{ backgroundColor: "#2d5a27" }}
        >
          <PlusIcon className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên sản phẩm..."
          className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[#2d5a27] outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#ebe5dc] text-sm text-[#5D4E37]">
            <tr>
              <th className="px-5 py-3 text-left">Ảnh</th>
              <th className="px-5 py-3 text-left">Tên sản phẩm</th>
              <th className="px-5 py-3">Giá</th>
              <th className="px-5 py-3">Tồn</th>
              <th className="px-5 py-3">Đã bán</th>
              <th className="px-5 py-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border-t hover:bg-[#f8f5f0] transition"
              >
                <td className="px-5 py-3">
                  {book.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${book.image}`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs">
                      No img
                    </div>
                  )}
                </td>

                <td className="px-5 py-3 font-medium">{book.title}</td>

                <td className="px-5 py-3 text-center text-[#7a3e2e] font-semibold">
                  {Number(book.price).toLocaleString()} đ
                </td>

                <td className="px-5 py-3 text-center">{book.stock || 0}</td>
                <td className="px-5 py-3 text-center">{book.sold || 0}</td>

                <td className="px-5 py-3">
                  <div className="flex justify-center gap-3">
                    <IconBtn
                      onClick={() =>
                        navigate(`/admin-dashboard/books/edit/${book.id}`)
                      }
                    >
                      <PencilSquareIcon />
                    </IconBtn>
                    <IconBtn danger onClick={() => handleDisable(book.id)}>
                      <XCircleIcon />
                    </IconBtn>
                    <IconBtn onClick={() => navigate(`/product/${book.id}`)}>
                      <EyeIcon />
                    </IconBtn>
                    <IconBtn green onClick={() => openAddStockModal(book)}>
                      <PlusIcon />
                    </IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h3 className="font-bold mb-2">Thêm tồn kho</h3>
            <input
              type="number"
              value={addQuantity}
              onChange={(e) => setAddQuantity(Number(e.target.value))}
              className="border rounded p-2 w-full mb-4"
              placeholder="Nhập số lượng cần thêm"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleAddStock}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookPage;
