import Swal from "sweetalert2";

const DEFAULT_TIMER = 3500;
const POSITION = "top-end";

/**
 * Hiển thị toast ở góc phải màn hình (top-end).
 * @param {string} icon - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Tiêu đề thông báo
 * @param {string} [text] - Nội dung phụ (tùy chọn)
 * @param {number} [timer] - Thời gian tự tắt (ms), mặc định 3500
 */
const show = (icon, title, text = "", timer = DEFAULT_TIMER) => {
  Swal.fire({
    toast: true,
    position: POSITION,
    timer,
    showConfirmButton: false,
    icon,
    title,
    text: text || undefined,
    timerProgressBar: true,
  });
};

const toast = {
  success: (title, text, timer) => show("success", title, text, timer),
  error: (title, text, timer) => show("error", title, text, timer),
  warning: (title, text, timer) => show("warning", title, text, timer),
  info: (title, text, timer) => show("info", title, text, timer),
};

export default toast;
