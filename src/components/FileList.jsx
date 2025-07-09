import React, { useState, useEffect } from 'react';
import './FileList.css';

const FileList = ({ fileCount = 0, searchTerm = '' }) => {
  // Temporary data - gerçek backend verisi geldiğinde değişecek
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isDesktop, setIsDesktop] = useState(true);

  // File görselleri döngüsü - file1, file2, file3
  const fileImages = ['/file1.png', '/file2.png', '/file3.png'];
  
  // Dosya türü başına farklı başlık pozisyonları - Responsive
  const titlePositions = {
    desktop: {
      0: { top: '5px', left: '290px' }, // file1.png için
      1: { top: '5px', left: '495px' }, // file2.png için  
      2: { top: '5px', left: '75px' }   // file3.png için
    },
    mobile: {
      0: { top: '2px', left: '50%', transform: 'translateX(-50%)' }, // file1.png - ORTADA
      1: { top: '2px', left: '80%', transform: 'translateX(-50%)' }, // file2.png - EN SAĞDA  
      2: { top: '2px', left: '18%', transform: 'translateX(-50%)' }  // file3.png - EN SOLDA
    },
    tablet: {
      0: { top: '3px', left: '50%', transform: 'translateX(-50%)' }, // file1.png - ORTADA
      1: { top: '3px', left: '85%', transform: 'translateX(-50%)' }, // file2.png - EN SAĞDA  
      2: { top: '3px', left: '15%', transform: 'translateX(-50%)' }  // file3.png - EN SOLDA
    }
  };

  // Device type detection - 3 durumlu
  const [deviceType, setDeviceType] = useState('desktop');
  
  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 900) {
        setDeviceType('desktop');
        setIsDesktop(true);
      } else if (width > 600) {
        setDeviceType('tablet');
        setIsDesktop(false);
      } else {
        setDeviceType('mobile');
        setIsDesktop(false);
      }
    };
    
    // İlk yükleme
    handleResize();
    
    // Resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FileCount'a göre dosya listesi oluştur
  useEffect(() => {
    if (fileCount > 0) {
      const generatedFiles = [];
      for (let i = 0; i < fileCount; i++) {
        const fileType = i % 3; // 0, 1, 2 döngüsü
        const groupIndex = Math.floor(i / 3); // Her 3'lü grup için aynı pozisyon
        generatedFiles.push({
          id: i + 1,
          type: fileType,
          image: fileImages[fileType],
          title: `NFT #${i + 1}`, // Placeholder title
          position: titlePositions.desktop[fileType], // Desktop pozisyon referansı
          groupIndex: groupIndex // Grup numarası
        });
      }
      setFiles(generatedFiles);
    }
  }, [fileCount]);

  // Arama işlevselliği - prop'tan gelen searchTerm'e göre filtrele
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter(file => 
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.id.toString().includes(searchTerm)
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  return (
    <div className="file-list-overlay">
      <div className="file-list-container">
        <div className="file-list-debug-info">
          <span>Files: {fileCount} | Container: 900x900px</span>
        </div>
        
        <div className="file-list-scroll-area">
          {filteredFiles.map((file, index) => {
            // Arama varsa filtrelenen dosyaları en üstten başlat
            const displayTop = searchTerm.trim() 
              ? `${index * 60}px` // Arama sonuçları için daha geniş aralık
              : `${file.groupIndex * 50 + file.type * 18}px`; // Orijinal pozisyon
            
            // Responsive için style kontrolü - state'ten al
            const itemStyle = isDesktop ? {
              top: displayTop,
              zIndex: searchTerm.trim() ? 1000 + index : file.id
            } : {
              // Tablet/Mobile için inline style'ları kaldır
              zIndex: searchTerm.trim() ? 1000 + index : file.id
            };
              
            return (
              <div 
                key={file.id} 
                className="file-item" 
                data-type={file.type}
                data-desktop={isDesktop ? "true" : "false"}
                style={itemStyle}
              >
              <div className="file-image-wrapper">
                <img 
                  src={file.image} 
                  alt={`File ${file.id}`}
                  className="file-image"
                />
                <div 
                  className="file-title"
                  style={deviceType === 'desktop' ? {
                    // Desktop pozisyonları (orijinal)
                    top: file.position.top,
                    left: file.position.left
                  } : {
                    // Mobile/tablet pozisyonları (dinamik)
                    ...titlePositions[deviceType][file.type]
                  }}
                >
                  {file.title}
                </div>
                {/* Seçilebilir alan - başlık pozisyonunda */}
                <div 
                  className="file-clickable-area"
                  style={deviceType === 'desktop' ? {
                    // Desktop pozisyonları (orijinal)
                    top: file.position.top,
                    left: file.position.left,
                    zIndex: 10000 + file.type // Type 0: 10000, Type 1: 10001, Type 2: 10002 (3>2>1)
                  } : {
                    // Mobile/tablet pozisyonları (dinamik)
                    ...titlePositions[deviceType][file.type],
                    zIndex: 10000 + file.type // Z-index sistemi korunsun (3>2>1)
                  }}
                  onClick={() => console.log(`File ${file.id} (Type ${file.type}) clicked!`)}
                  title={`Click to select ${file.title}`}
                >
                </div>
              </div>
            </div>
            );
          })}
        </div>
        
        {fileCount === 0 && (
          <div className="file-list-empty">
            <p>No contract data analyzed yet</p>
            <p>Enter contract info and click Analysis</p>
          </div>
        )}

        {fileCount > 0 && filteredFiles.length === 0 && searchTerm && (
          <div className="file-list-empty">
            <p>No results found for search</p>
            <p>No NFTs matched with "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList; 