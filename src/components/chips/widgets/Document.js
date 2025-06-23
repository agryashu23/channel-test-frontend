// import React, { useState, useEffect } from 'react';
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'; // To display PDF pages
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// const FileUploadAndView = () => {
//   const [file, setFile] = useState(null);
//   const [fileUrl, setFileUrl] = useState('');
//   const [fileType, setFileType] = useState('');
//   const [numPages, setNumPages] = useState(null);

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     setFile(uploadedFile);
//     setFileUrl(URL.createObjectURL(uploadedFile));
//     setFileType(uploadedFile.type);
//   };

//   const handleUrlChange = (e) => {
//     setFileUrl(e.target.value);
//     // Here you can add logic to infer file type based on the URL
//     setFileType('url');
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const renderFilePreview = () => {
//     if (fileType === 'application/pdf') {
//       return (
//         <div>
//           <Document
//             file={fileUrl}
//             onLoadSuccess={onDocumentLoadSuccess}
//             className="w-48 h-48"
//           >
//             <Page pageNumber={1} className="thumbnail" />
//           </Document>
//           <p>{file.name}</p>
//           <p>{numPages} pages</p>
//         </div>
//       );
//     } else if (fileType === 'url') {
//       // Handle rendering for URL-based documents
//       return (
//         <div>
//           <img src="url-image-placeholder.png" alt="File preview" className="w-48 h-48" />
//           <p>{fileUrl}</p>
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <img src="file-image-placeholder.png" alt="File preview" className="w-48 h-48" />
//           {file && <p>{file.name}</p>}
//         </div>
//       );
//     }
//   };

//   const handleFileClick = () => {
//     window.open(fileUrl, '_blank');
//   };

//   return (
//     <div>
//       <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
//       <input type="text" placeholder="Enter file URL" onChange={handleUrlChange} />

//       <div className="file-preview" onClick={handleFileClick}>
//         {renderFilePreview()}
//       </div>
//     </div>
//   );
// };

// export default FileUploadAndView;
