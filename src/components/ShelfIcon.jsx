import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./ShelfIcon.css";
import FileList from "./FileList";

const ShelfIcon = ({ deviceType, position, customSize, contained = false, clickableSize }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeviceType, setCurrentDeviceType] = useState('desktop');
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionTitle, setCollectionTitle] = useState('NFT Collection Name');
  const [titleFontSize, setTitleFontSize] = useState(15); // Dinamik font boyutu

  // Dinamik font boyutu hesaplama fonksiyonu
  const calculateFontSize = (text, deviceType) => {
    const baseFontSizes = {
      desktop: 14,  // Küçük alan için optimize
      tablet: 13,   // Tablet için uygun  
      mobile: 12    // Mobile için uygun
    };
    
    const maxWidths = {
      desktop: 200,  // CSS ile uyumlu hale getirdik
      tablet: 180,   // Tablet için uygun
      mobile: 160    // Mobile için uygun
    };
    
    const baseSize = baseFontSizes[deviceType] || baseFontSizes.desktop;
    const maxWidth = maxWidths[deviceType] || maxWidths.desktop;
    
    // Karakter sayısına göre daha akıllı font boyutu hesaplama
    const textLength = text.length;
    let fontSize = baseSize;
    
    if (textLength > 25) {
      // 25 karakterden sonra daha hızlı küçülme
      fontSize = baseSize - Math.floor((textLength - 25) / 6);
    } else if (textLength > 15) {
      // 15-25 karakter arası yavaş küçülme
      fontSize = baseSize - Math.floor((textLength - 15) / 10);
    }
    
    // Minimum font boyutu sınırları (daha yüksek)
    const minFontSize = deviceType === 'mobile' ? 10 : 
                        deviceType === 'tablet' ? 11 : 12;
    
    return Math.max(fontSize, minFontSize);
  };

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

  // Başlık değiştiğinde veya device type değiştiğinde font boyutunu güncelle
  useEffect(() => {
    const effectiveDeviceType = deviceType || currentDeviceType;
    const newFontSize = calculateFontSize(collectionTitle, effectiveDeviceType);
    setTitleFontSize(newFontSize);
  }, [collectionTitle, currentDeviceType, deviceType]);

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
    setSearchTerm(''); // Modal kapanırken aramayı temizle
    // Modal kapandığında hover efektlerini tekrar aktif et
    document.body.classList.remove('modal-open');
  };

  // Arama fonksiyonları
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Test için başlık değiştirme (geliştirme amaçlı)
  const handleTitleDoubleClick = () => {
    const testTitles = [
      'NFT Collection Name',
      'Bored Ape Yacht Club',
      'Super Long NFT Collection Name That Should Get Smaller Font',
      'Very Very Very Long NFT Collection Name That Should Wrap to Multiple Lines and Still Stay Centered',
      'Short NFT',
      'Medium Length NFT Collection',
      'CryptoPunks',
      'Art Blocks Curated',
      'Extremely Long Named Digital Art Collection That Tests Font Sizing',
      'X',
      'This Is An Example Of A Really Really Long NFT Collection Name That Will Test The Wrapping And Font Scaling System'
    ];
    const currentIndex = testTitles.indexOf(collectionTitle);
    const nextTitle = testTitles[(currentIndex + 1) % testTitles.length];
    setCollectionTitle(nextTitle);
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
              
              {/* Modal Üst Bölümü - Başlık ve Arama */}
              <div className="shelf-modal-header">
                {/* Sol Taraf - Başlık Wrapper */}
                <div className="shelf-title-wrapper">
                  <div 
                    className="shelf-collection-title"
                    style={{ fontSize: `${titleFontSize}px` }}
                    onDoubleClick={handleTitleDoubleClick}
                    title="Çift tıklayarak farklı başlık uzunluklarını test edin"
                  >
                    {collectionTitle}
                  </div>
                </div>
                
                {/* Sağ Taraf - Search Wrapper */}
                <div className="shelf-search-wrapper">
                  <div className="shelf-search-container">
                    <div className="shelf-search-input-wrapper">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="shelf-search-input"
                      />
                      {searchTerm && (
                        <button 
                          onClick={clearSearch}
                          className="shelf-search-clear-btn"
                          aria-label="Aramayı temizle"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {searchTerm && (
                      <div className="shelf-search-results-info">
                        Called: "{searchTerm}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
            <div className="shelf-modal-image-container">
              <img 
                src="/testimg1.png" 
                alt="Shelf Content" 
                className="shelf-modal-image"
              />
              {/* FileList Overlay - searchTerm prop'u ile */}
              <FileList fileCount={500} searchTerm={searchTerm} />
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
            
            {/* Modal Üst Bölümü - Başlık ve Arama */}
            <div className="shelf-modal-header">
              {/* Sol Taraf - Başlık Wrapper */}
              <div className="shelf-title-wrapper">
                <div 
                  className="shelf-collection-title"
                  style={{ fontSize: `${titleFontSize}px` }}
                  onDoubleClick={handleTitleDoubleClick}
                  title="Çift tıklayarak farklı başlık uzunluklarını test edin"
                >
                  {collectionTitle}
                </div>
              </div>
              
              {/* Sağ Taraf - Search Wrapper */}
              <div className="shelf-search-wrapper">
                <div className="shelf-search-container">
                  <div className="shelf-search-input-wrapper">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="shelf-search-input"
                    />
                    {searchTerm && (
                      <button 
                        onClick={clearSearch}
                        className="shelf-search-clear-btn"
                        aria-label="Aramayı temizle"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <div className="shelf-search-results-info">
                      Called: "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="shelf-modal-image-container">
              <img 
                src="/testimg1.png" 
                alt="Shelf Content" 
                className="shelf-modal-image"
              />
              {/* FileList Overlay - searchTerm prop'u ile */}
              <FileList fileCount={500} searchTerm={searchTerm} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ShelfIcon; 