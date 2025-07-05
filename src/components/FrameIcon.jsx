import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./FrameIcon.css";

const FrameIcon = ({ deviceType, position, customSize, contained = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeviceType, setCurrentDeviceType] = useState('desktop');

  // Otomatik device detection
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setCurrentDeviceType('mobile');
      } else if (width <= 768) {
        setCurrentDeviceType('tablet');
      } else {
        setCurrentDeviceType('desktop');
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.classList.remove('frame-modal-open');
    };
  }, [isModalOpen]);

  // Ses efekti çalma fonksiyonu
  const playClickSound = () => {
    console.log('🖼️ Frame ses efekti çalmaya çalışılıyor...');
    try {
             const audio = new Audio('/sounds/soundeffect4.mp3'); // Frame tıklama ses efekti
      audio.volume = 0.9;
      
      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Frame ses dosyası yüklendi ve çalmaya hazır');
      });
      
             audio.addEventListener('error', (e) => {
        console.error('❌ Frame ses dosyası yükleme hatası:', e);
        console.error('❌ Dosya yolu kontrol edin: /sounds/soundeffect4.mp3');
      });
      
      audio.play()
        .then(() => {
          console.log('✅ Frame ses başarıyla çalıyor');
        })
        .catch(err => {
          console.error('❌ Frame ses çalma hatası:', err);
          console.error('💡 Tarayıcı ses politikası nedeniyle olabilir');
        });
        
    } catch (error) {
      console.error('❌ Frame ses objesi oluşturma hatası:', error);
    }
  };

  // Modal açma fonksiyonu
  const handleFrameClick = () => {
    console.log('🖼️ Frame icon\'a tıklandı, modal açılıyor...');
    playClickSound();
    setIsModalOpen(true);
    document.body.classList.add('frame-modal-open');
  };

  // Modal kapatma fonksiyonu
  const closeModal = () => {
    console.log('🖼️ Frame modal kapatılıyor...');
    setIsModalOpen(false);
    document.body.classList.remove('frame-modal-open');
  };

  // Modal içeriği için otomatik cihaz tipine göre responsive boyutlar
  const modalSizes = {
    desktop: { width: '800px', height: '800px' },   // Desktop - sabit boyut
    tablet: { width: '70vw', height: '70vh' },      // Tablet - viewport'un %70'i
    mobile: { width: '85vw', height: '75vh' }       // Mobile - viewport'un %85'i
  };

  // Gerçek device type'ı kullan (prop varsa onu, yoksa auto-detected)
  const effectiveDeviceType = deviceType || currentDeviceType;
  const currentModalSize = modalSizes[effectiveDeviceType];

  // Device-specific sizing - Easy to customize
  const sizes = {
    desktop: customSize || 600,   // Desktop boyutu
    tablet: customSize || 450,    // Tablet boyutu
    mobile: customSize || 200     // Mobile boyutu
  };

  // Device-specific positioning - Easy to customize
  const positions = {
    desktop: position || { 
      top: "44.3%",    // Vertical position
      left: "67.1%",   // Horizontal position
      transform: "translate(-50%, -50%)"
    },
    tablet: position || { 
      top: "41%",
      left: "84%",
      transform: "translate(-50%, -50%)"
    },
    mobile: position || { 
      top: "45.7%",
      left: "84.1%",
      transform: "translate(-50%, -50%)"
    }
  };

  const currentSize = sizes[deviceType] || sizes.desktop;
  const currentPosition = positions[deviceType] || positions.desktop;

  // Contained mode için boyut ayarlaması
  const containedSizes = {
    desktop: 80,   // Area boyutuna uygun
    tablet: 60,    // Area boyutuna uygun  
    mobile: 40     // Area boyutuna uygun
  };

  // CustomSize objesi varsa ve contained modda ise, customSize'dan al
  let finalSize;
  if (contained && customSize && typeof customSize === 'object') {
    finalSize = customSize[deviceType] || containedSizes[deviceType];
  } else if (contained) {
    finalSize = containedSizes[deviceType];
  } else {
    finalSize = currentSize;
  }

  if (contained) {
    // Area içinde kullanım - sadece wrapper
    return (
      <>
        <div 
          className="frame-icon-wrapper contained" 
          style={{ 
            width: `${finalSize}px`,
            height: `${finalSize}px`,
            cursor: 'pointer'
          }}
          onClick={handleFrameClick}
        >
          <img 
            src="/frame.png" 
            alt="Frame Icon" 
            className="frame-icon-image" 
          />
        </div>

        {/* Modal Pencere - Portal ile body'e render - CSS Animasyonu */}
        {isModalOpen && createPortal(
          <div
            className="frame-modal-backdrop"
            onClick={closeModal}
          >
            <div
              className="frame-modal-content frame-fade-animation"
              style={{
                width: currentModalSize.width,
                height: currentModalSize.height
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="frame-modal-close" onClick={closeModal}>
                ×
              </button>
              <div className="frame-modal-image-container">
                <img 
                  src="/testimg4.png" 
                  alt="Frame Content" 
                  className="frame-modal-image"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <>
      {/* Debug positioning container - responsive div */}
      <div className="frame-icon-debug-container">
        <div 
          className="frame-icon-wrapper" 
          style={{ 
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            cursor: 'pointer'
          }}
          onClick={handleFrameClick}
        >
          <img 
            src="/frame.png" 
            alt="Frame Icon" 
            className="frame-icon-image" 
          />
        </div>
      </div>

      {/* Modal Pencere - Portal ile body'e render - CSS Animasyonu */}
      {isModalOpen && createPortal(
        <div
          className="frame-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="frame-modal-content frame-fade-animation"
            style={{
              width: currentModalSize.width,
              height: currentModalSize.height
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="frame-modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="frame-modal-image-container">
              <img 
                src="/testimg4.png" 
                alt="Frame Content" 
                className="frame-modal-image"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FrameIcon; 