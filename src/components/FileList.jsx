import React, { useState, useEffect } from 'react';
import './FileList.css';

const FileList = ({ fileCount = 0, searchTerm = '' }) => {
  // Temporary data - gerçek backend verisi geldiğinde değişecek
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);

  // File görselleri döngüsü - file1, file2, file3
  const fileImages = ['/file1.png', '/file2.png', '/file3.png'];
  
  // Dosya türü başına farklı başlık pozisyonları
  const titlePositions = {
    0: { top: '5px', left: '280px' }, // file1.png için
    1: { top: '5px', left: '480px' }, // file2.png için  
    2: { top: '5px', left: '70px' }  // file3.png için
  };

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
          position: titlePositions[fileType],
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
              
            return (
              <div 
                key={file.id} 
                className="file-item" 
                data-type={file.type}
                style={{
                  top: displayTop,
                  zIndex: searchTerm.trim() ? 1000 + index : file.id // Arama sonuçları için yeni z-index
                }}
              >
              <div className="file-image-wrapper">
                <img 
                  src={file.image} 
                  alt={`File ${file.id}`}
                  className="file-image"
                />
                <div 
                  className="file-title"
                  style={{
                    top: file.position.top,
                    left: file.position.left
                  }}
                >
                  {file.title}
                </div>
                {/* Seçilebilir alan - başlık pozisyonunda */}
                <div 
                  className="file-clickable-area"
                  style={{
                    top: file.position.top,
                    left: file.position.left,
                    zIndex: 10000 + file.type // Type 0: 10000, Type 1: 10001, Type 2: 10002
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