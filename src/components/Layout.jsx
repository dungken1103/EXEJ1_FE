import React from 'react';
import { Outlet } from 'react-router-dom';
import { HiOutlinePhone, HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import Footer from './Footer';
import Header from './Header';

const HOTLINE = '0984350255';
const ZALO_LINK = `https://zalo.me/${HOTLINE}`;

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f5f0' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Liên hệ: Zalo + Hotline - cố định góc phải màn hình */}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
        <a
          href={ZALO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white transition hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: '#0068FF' }}
          title="Chat Zalo"
          aria-label="Liên hệ Zalo"
        >
          <HiOutlineChatBubbleBottomCenterText className="w-6 h-6" />
        </a>
        <a
          href={`tel:${HOTLINE}`}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white transition hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: '#2d5a27' }}
          title={`Hotline: ${HOTLINE}`}
          aria-label={`Gọi hotline ${HOTLINE}`}
        >
          <HiOutlinePhone className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default Layout;
