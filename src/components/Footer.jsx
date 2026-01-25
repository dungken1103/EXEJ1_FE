import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
    return (
        <div>
            <footer className="bg-[#2C2C2C] text-white px-10 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
                    
                    {/* Customer Service */}
                    <div>
                        <h5 className="font-semibold text-lg mb-4">CUSTOMER SERVICE</h5>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Help & FAQs</a></li>
                            <li><a href="#" className="hover:text-white transition">Shipping</a></li>
                            <li><a href="#" className="hover:text-white transition">Returns</a></li>
                        </ul>
                    </div>

                    {/* About Us */}
                    <div>
                        <h5 className="font-semibold text-lg mb-4">ABOUT US</h5>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-white transition">Our Story</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h5 className="font-semibold text-lg mb-4">CONTACT US</h5>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start"><MdLocationOn className="mr-2 mt-0.5" /> 123 Book Street, Hanoi, Vietnam</li>
                            <li className="flex items-center"><MdPhone className="mr-2" /> +84 123 456 789</li>
                            <li className="flex items-center"><MdEmail className="mr-2" /> support@fuhusu.com</li>
                        </ul>
                    </div>

                    {/* Social + Newsletter */}
                    <div>
                        <h5 className="font-semibold text-lg mb-4">FOLLOW US</h5>
                        <div className="flex space-x-4 text-xl text-gray-300 mb-4">
                            <a href="#"><FaFacebookF className="hover:text-white transition" /></a>
                            <a href="#"><FaInstagram className="hover:text-white transition" /></a>
                            <a href="#"><FaTwitter className="hover:text-white transition" /></a>
                        </div>

                        <h5 className="font-semibold text-sm mb-2">FUHUSU Bookstore</h5>
<p className="text-gray-300 text-sm">
  Sách hay, giá tốt, giao tận tay.
</p>

                    </div>
                </div>

                <hr className="my-6 border-gray-600" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                    <p>© 2025 Book Store. All rights reserved.</p>
                    <div className="flex space-x-4 mt-2 md:mt-0 text-2xl">
                        <FaCcVisa />
                        <FaCcMastercard />
                        <FaCcPaypal />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
