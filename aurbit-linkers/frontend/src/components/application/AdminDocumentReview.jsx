import { Eye, Download, FileText } from 'lucide-react';

export default function AdminDocumentReview({
  documents = [],
  requiredDocuments = [],
  onView,
  onDownload,
}) {
  const isDocumentUploaded = (documentName) => {
    return documents.some((doc) => doc.name === documentName);
  };

  const getUploadedDocument = (documentName) => {
    return documents.find((doc) => doc.name === documentName);
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

          return (
            <div
              key={docName}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-2xl flex-shrink-0">
                  {uploaded ? '📄' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{docName}</p>
                  {uploaded && uploadedDoc ? (
                    <>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {uploadedDoc.fileName || uploadedDoc.name}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        ✓ Uploaded
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">No document uploaded yet.</p>
                  )}
                </div>
              </div>

              {uploaded && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {onView && (
                    <button
                      onClick={() => onView(docName, uploadedDoc)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      title="View"
                    >
                      <Eye size={14} className="text-slate-600" />
                    </button>
                  )}
                  {onDownload && (
                    <button
                      onClick={() => onDownload(docName, uploadedDoc)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      title="Download"
                    >
                      <Download size={14} className="text-slate-600" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}