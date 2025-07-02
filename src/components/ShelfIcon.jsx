import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./ShelfIcon.css";

const ShelfIcon = ({ deviceType, position, customSize, contained = false, clickableSize }) => {
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

    // İlk yükleme
    detectDevice();
    
    // Resize listener
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
      // Component unmount olduğunda body class'ını temizle
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  // Ses efekti çalma fonksiyonu
  const playClickSound = () => {
    console.log('🔊 Ses efekti çalmaya çalışılıyor...');
    try {
      const audio = new Audio('/sounds/soundeffect1.mp3'); // Shelf tıklama ses efekti
      audio.volume = 0.7; // Ses seviyesini artırdık (0.3'ten 0.7'ye)
      
      // Ses yükleme durumunu kontrol et
      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Ses dosyası yüklendi ve çalmaya hazır');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Ses dosyası yükleme hatası:', e);
        console.error('❌ Dosya yolu kontrol edin: /sounds/soundeffect1.mp3');
      });
      
      // Ses çalmayı dene
      audio.play()
        .then(() => {
          console.log('✅ Ses başarıyla çalıyor');
        })
        .catch(err => {
          console.error('❌ Ses çalma hatası:', err);
          console.error('💡 Tarayıcı ses politikası nedeniyle olabilir');
        });
        
    } catch (error) {
      console.error('❌ Ses objesi oluşturma hatası:', error);
    }
  };

  // Modal açma fonksiyonu
  const handleShelfClick = () => {
    playClickSound();
    setIsModalOpen(true);
    // Modal açıkken diğer hover efektlerini devre dışı bırak
    document.body.classList.add('modal-open');
  };

  // Modal kapatma fonksiyonu
  const closeModal = () => {
    setIsModalOpen(false);
    // Modal kapandığında hover efektlerini tekrar aktif et
    document.body.classList.remove('modal-open');
  };

  // Device-specific sizing - Easy to customize
  const sizes = {
    desktop: customSize || 600,   
    tablet: customSize || 450,    
    mobile: customSize || 200      
  };

  // Device-specific positioning - Easy to customize
  const positions = {
    desktop: position || { 
      top: "50%",    
      left: "50%",   
      transform: "translate(-50%, -50%)" 
    },
    tablet: position || { 
      top: "50%",    
      left: "50%",   
      transform: "translate(-50%, -50%)"
    },
    mobile: position || { 
      top: "50%",    
      left: "50%",   
      transform: "translate(-50%, -50%)"
    }
  };

  const currentSize = sizes[deviceType] || sizes.desktop;
  const currentPosition = positions[deviceType] || positions.desktop;

  // Contained mode için boyut ayarlaması
  const containedSizes = {
    desktop: 80,   
    tablet: 60,    
    mobile: 40     
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

  // PNG boyutuna eşit tıklama alanı için özel mod
  let wrapperWidth, wrapperHeight;
  if (clickableSize === 'match-png') {
    // PNG boyutuna tam eşit tıklama alanı
    wrapperWidth = wrapperHeight = finalSize;
  } else if (clickableSize && typeof clickableSize === 'object') {
    const deviceClickSize = clickableSize[deviceType];
    if (deviceClickSize && typeof deviceClickSize === 'object') {
      // {desktop: {width: 100, height: 50}} formatı
      wrapperWidth = deviceClickSize.width || finalSize;
      wrapperHeight = deviceClickSize.height || finalSize;
    } else if (typeof deviceClickSize === 'number') {
      // {desktop: 100} formatı (kare)
      wrapperWidth = wrapperHeight = deviceClickSize;
    } else {
      // Varsayılan
      wrapperWidth = wrapperHeight = contained ? Math.max(finalSize * 0.8, finalSize - 20) : finalSize;
    }
  } else if (clickableSize && typeof clickableSize === 'number') {
    // Tek sayı (kare)
    wrapperWidth = wrapperHeight = clickableSize;
  } else {
    // Varsayılan: PNG'ye daha yakın boyut
    wrapperWidth = wrapperHeight = contained ? Math.max(finalSize * 0.8, finalSize - 20) : finalSize;
  }

  // Modal içeriği için otomatik cihaz tipine göre responsive boyutlar
  const modalSizes = {
    desktop: { width: '800px', height: '800px' },   // Desktop - sabit boyut
    tablet: { width: '70vw', height: '70vh' },      // Tablet - viewport'un %70'i
    mobile: { width: '85vw', height: '75vh' }       // Mobile - viewport'un %85'i
  };

  // Gerçek device type'ı kullan (prop varsa onu, yoksa auto-detected)
  const effectiveDeviceType = deviceType || currentDeviceType;
  const currentModalSize = modalSizes[effectiveDeviceType];

  if (contained) {
    // Area içinde kullanım - sadece wrapper
    return (
      <>
        <div 
          className={`shelf-icon-wrapper contained ${clickableSize === 'match-png' ? 'match-png-clickable' : ''}`}
          style={{ 
            width: `${wrapperWidth}px`,
            height: `${wrapperHeight}px`,
            cursor: 'pointer'
          }}
          onClick={handleShelfClick}
        >
          <img 
            src="/shelf.png" 
            alt="Shelf" 
            className="shelf-icon-image"
            style={{
              width: `${finalSize}px`,
              height: `${finalSize}px`,
              pointerEvents: 'auto'
            }}
          />
        </div>

        {/* Modal Pencere - Portal ile body'e render */}
        {isModalOpen && createPortal(
          <div className="shelf-modal-overlay" onClick={closeModal}>
            <div 
              className={`shelf-modal-content ${isModalOpen ? 'slide-down' : ''}`}
              style={{
                width: currentModalSize.width,
                height: currentModalSize.height
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="shelf-modal-close" onClick={closeModal}>
                ×
              </button>
              <div className="shelf-modal-image-container">
                <img 
                  src="/testimg1.png" 
                  alt="Shelf Content" 
                  className="shelf-modal-image"
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
      <div className="shelf-icon-debug-container">
        <div 
          className="shelf-icon-wrapper" 
          style={{ 
            width: `${wrapperWidth}px`,
            height: `${wrapperHeight}px`,
            cursor: 'pointer'
          }}
          onClick={handleShelfClick}
        >
          <img 
            src="/shelf.png" 
            alt="Shelf" 
            className="shelf-icon-image" 
          />
        </div>
      </div>

      {/* Modal Pencere - Portal ile body'e render */}
      {isModalOpen && createPortal(
        <div className="shelf-modal-overlay" onClick={closeModal}>
          <div 
            className={`shelf-modal-content ${isModalOpen ? 'slide-down' : ''}`}
            style={{
              width: currentModalSize.width,
              height: currentModalSize.height
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="shelf-modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="shelf-modal-image-container">
              <img 
                src="/testimg1.png" 
                alt="Shelf Content" 
                className="shelf-modal-image"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ShelfIcon; 