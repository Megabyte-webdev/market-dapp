import React, { useState } from 'react';
import { ethers } from 'ethers';
import { FaSpinner } from 'react-icons/fa';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';

import useMarket from '../hooks/useMarket';
import { useAuth } from '../context/AuthContext';

const MyProducts = () => {
  const { account } = useAuth();
  const {
    myProducts,
    loading,
    error,
    transferOwnership,
  } = useMarket();

  const [transferAddresses, setTransferAddresses] = useState({});
  const [transferring, setTransferring] = useState({});
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleTransfer = async (productId) => {
    const address = transferAddresses[productId];
    if (!ethers.utils.isAddress(address)) {
      alert('Invalid address.');
      return;
    }

    setTransferring((prev) => ({ ...prev, [productId]: true }));

    try {
      await transferOwnership(productId, address);
    } catch (err) {
      console.error('Transfer failed:', err);
    } finally {
      setTransferring((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div id="my-product" className="relative w-full mb-5">
      <h3 className="text-2xl font-semibold mb-6 text-center">Products You Own</h3>

      {loading?.myProducts ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-slate-800 rounded-lg p-4 animate-pulse h-32" />
                    ))}
                </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : myProducts.length === 0 ? (
        <div className="text-center bg-slate-900 rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-2">No Products Found</h3>
          <p className="text-sm text-gray-400">You currently have no products. Start adding some!</p>
        </div>
      ) : (
        <>
          <Swiper
            spaceBetween={15}
            navigation={{
              nextEl: '.next-btn',
              prevEl: '.prev-btn',
            }}
            modules={[Navigation]}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="p-3"
          >
            {myProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-900 rounded-lg shadow-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">Owner: {product.owner}</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    <span className="text-white">
                      {ethers.utils.formatEther(product.price)}
                    </span>{' '}
                    ETH
                  </p>

                  <input
                    type="text"
                    placeholder="New owner address"
                    className="w-full mt-4 mb-2 px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none"
                    onChange={(e) =>
                      setTransferAddresses({
                        ...transferAddresses,
                        [product.id]: e.target.value,
                      })
                    }
                    value={transferAddresses[product.id] || ''}
                  />
                  <button
                    onClick={() => handleTransfer(product.id)}
                    disabled={!transferAddresses[product.id] ||transferring[product.id]}
                    className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {transferring[product.id] ? (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                        Transferring...
                      </div>
                    ) : (
                      'Transfer Ownership'
                    )}
                  </button>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className={`cursor-pointer prev-btn p-2 border border-gray-300 rounded-full transition-all duration-300 ${
                isBeginning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 hover:text-black'
              }`}
              disabled={isBeginning}
            >
              <AiOutlineLeft size={25} />
            </button>
            <button
              className={`cursor-pointer next-btn p-2 border border-gray-300 rounded-full transition-all duration-300 ${
                isEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 hover:text-black'
              }`}
              disabled={isEnd}
            >
              <AiOutlineRight size={25} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProducts;
