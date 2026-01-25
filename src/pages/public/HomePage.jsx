import React from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';

const HomePage = () => {

    return (
        <div className="h-screen bg-[#FFEFD5] text-[#2F2F2F] font-sans">


            {/* Banner */}
            <section className="bg-[#F3C469] px-10 py-16 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-semibold tracking-wide mb-2">DISCOVER YOUR NEXT</h1>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">FAVORITE BOOK</h2>
                    <button className="bg-[#C1462F] text-white px-6 py-2 rounded hover:bg-[#a53b28] transition">SHOP NOW</button>
                </div>
                <div className="md:w-1/2 flex justify-center gap-6 mt-10 md:mt-0">
                    <img src="/images/demenphieuluuky.png" alt="Book 1" className="w-28 h-auto" />
                    <img src="/images/consetugiac.png" alt="Book 2" className="w-28 h-auto" />
                    <img src="/images/tietkiemchotuonglai.png" alt="Book 3" className="w-28 h-auto" />
                </div>
            </section>

            {/* Popular Books */}
            <section className=" px-10 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold tracking-tight">POPULAR BOOKS</h3>
                    <button className="text-sm text-[#2F2F2F] hover:text-[#C1462F]">VIEW ALL</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Đừng hòng bắt nạt mình', author: 'NXB Kim Đồng', img: '/images/dunghongbatnatminh.png' },
                        { title: 'Tuổi thơ dữ dội', author: 'NXB Kim Đồng', img: '/images/tuoithodudoi.png' },
                        { title: 'Đất rừng phương Nam', author: 'Kim Đồng', img: '/images/datrungphuongnam.png' },
                        { title: 'Bên suối, bịt tai nghe gió', author: 'NXB Kim Đồng', img: '/images/bensuoibittainghegio.png' },
                    ].map((book, i) => (
                        <div key={i} className="text-center">
                            <img src={book.img} alt={book.title} className="mx-auto w-28 h-36 object-cover mb-3" />
                            <h4 className="font-semibold">{book.title}</h4>
                            <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* Footer */}

        </div>
    );
};

export default HomePage;
