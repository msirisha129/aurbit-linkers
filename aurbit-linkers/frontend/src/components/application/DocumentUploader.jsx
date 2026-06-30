import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function DocumentUploader({
  service,
  requiredDocuments = [],
  uploadedDocuments = [],
  onUpload,
}) {
  const [uploading, setUploading] = useState({});
  const [error, setError] = useState({});

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    return '📎';
  };

  const handleFileSelect = async (documentName, file) => {
    setError({ ...error, [documentName]: null });

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError({
        ...error,
        [documentName]: 'Invalid file type. Please upload PDF, JPG, PNG, or JPEG.',
      });
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError({
        ...error,
        [documentName]: `File size exceeds ${MAX_SIZE_MB}MB limit.`,
      });
      return;
    }

    setUploading({ ...uploading, [documentName]: true });

    try {
      if (onUpload) {
        await onUpload(documentName, file);
      }
      setUploading({ ...uploading, [documentName]: false });
    } catch (err) {
      setError({
        ...error,
        [documentName]: err.message || 'Upload failed. Please try again.',
      });
      setUploading({ ...uploading, [documentName]: false });
    }
  };

  const handleRemove = (documentName) => {
    if (onUpload) {
      onUpload(documentName, null);
    }
  };

  const isDocumentUploaded = (documentName) => {
    return uploadedDocuments.some((doc) => doc.name === documentName);
  };

  const getUploadedDocument = (documentName) => {
    return uploadedDocuments.find((doc) => doc.name === documentName);
  };

  if (requiredDocuments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-900 mb-4">Uploaded Documents</h2>
        <div className="text-center py-8">
          <FileText size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">No documents uploaded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-navy-900 mb-4">Uploaded Documents</h2>
      <div className="space-y-4">
        {requiredDocuments.map((docName) => {
          const uploaded = isDocumentUploaded(docName);
          const uploadedDoc = getUploadedDocument(docName);
          const isUploading = uploading[docName];
          const hasError = error[docName];

          return (
            <div
              key={docName}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-2xl flex-shrink-0">
                  {uploaded ? getFileIcon(uploadedDoc?.type || 'application/pdf') : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{docName}</p>
                  {uploaded && uploadedDoc && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {uploadedDoc.fileName || uploadedDoc.name}
                    </p>
                  )}
                  {hasError && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <XCircle size={12} />
                      {hasError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {uploaded ? (
                  <>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle size={14} strokeWidth={2.5} />
                      Uploaded
                    </span>
                    {uploadedDoc?.preview && (
                      <button
                        onClick={() => window.open(uploadedDoc.preview, '_blank')}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        title="Preview"
                      >
                        <Eye size={14} className="text-slate-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(docName)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  </>
                ) : (
                  <>
                    {isUploading ? (
                      <span className="text-xs text-slate-500">Uploading...</span>
                    ) : hasError ? (
                      <button
                        onClick={() => document.getElementById(`upload-${docName}`)?.click()}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        Retry
                      </button>
                    ) : (
                      <button
                        onClick={() => document.getElementById(`upload-${docName}`)?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#1a2744] text-white text-xs font-semibold hover:bg-[#15203a] transition-colors flex items-center gap-1"
                      >
                        <Upload size={12} />
                        Upload
                      </button>
                    )}
                    <input
                      id={`upload-${docName}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(docName, file);
                        }
                        e.target.value = '';
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}