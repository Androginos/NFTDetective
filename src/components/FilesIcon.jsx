import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./FilesIcon.css";

const FilesIcon = ({ deviceType, position, customSize, contained = false }) => {
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
      document.body.classList.remove('files-modal-open');
    };
  }, [isModalOpen]);

  // Ses efekti çalma fonksiyonu
  const playClickSound = () => {
    console.log('📁 Files ses efekti çalmaya çalışılıyor...');
    try {
      const audio = new Audio('/sounds/soundeffect5.mp3'); // Files tıklama ses efekti
      audio.volume = 0.7;
      
      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Files ses dosyası yüklendi ve çalmaya hazır');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Files ses dosyası yükleme hatası:', e);
        console.error('❌ Dosya yolu kontrol edin: /sounds/soundeffect5.mp3');
      });
      
      audio.play()
        .then(() => {
          console.log('✅ Files ses başarıyla çalıyor');
        })
        .catch(err => {
          console.error('❌ Files ses çalma hatası:', err);
          console.error('💡 Tarayıcı ses politikası nedeniyle olabilir');
        });
        
    } catch (error) {
      console.error('❌ Files ses objesi oluşturma hatası:', error);
    }
  };

  // Modal açma fonksiyonu
  const handleFilesClick = () => {
    console.log('📁 Files icon\'a tıklandı, modal açılıyor...');
    playClickSound();
    setIsModalOpen(true);
    document.body.classList.add('files-modal-open');
  };

  // Modal kapatma fonksiyonu
  const closeModal = () => {
    console.log('📁 Files modal kapatılıyor...');
    setIsModalOpen(false);
    document.body.classList.remove('files-modal-open');
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
          className="files-icon-wrapper contained" 
          style={{ 
            width: `${finalSize}px`,
            height: `${finalSize}px`,
            cursor: 'pointer'
          }}
          onClick={handleFilesClick}
        >
          <img 
            src="/files.png" 
            alt="Files Icon" 
            className="files-icon-image" 
          />
        </div>

        {/* Modal Pencere - Portal ile body'e render - CSS Animasyonu */}
        {isModalOpen && createPortal(
          <div
            className="files-modal-backdrop"
            onClick={closeModal}
          >
            <div
              className="files-modal-content files-document-pickup-animation"
              style={{
                width: currentModalSize.width,
                height: currentModalSize.height
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="files-modal-close" onClick={closeModal}>
                ×
              </button>
              <div className="files-modal-image-container">
                <img 
                  src="/testimg5.png" 
                  alt="Files Content" 
                  className="files-modal-image"
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
      <div className="files-icon-debug-container">
        <div 
          className="files-icon-wrapper" 
          style={{ 
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            cursor: 'pointer'
          }}
          onClick={handleFilesClick}
        >
          <img 
            src="/files.png" 
            alt="Files Icon" 
            className="files-icon-image" 
          />
        </div>
      </div>

      {/* Modal Pencere - Portal ile body'e render - CSS Animasyonu */}
      {isModalOpen && createPortal(
        <div
          className="files-modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="files-modal-content files-document-pickup-animation"
            style={{
              width: currentModalSize.width,
              height: currentModalSize.height
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="files-modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="files-modal-image-container">
              <img 
                src="/testimg5.png" 
                alt="Files Content" 
                className="files-modal-image"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FilesIcon; 