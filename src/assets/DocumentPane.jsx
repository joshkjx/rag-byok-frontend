import {useState, useEffect, useCallback, useRef} from "react";

import {getDocList, uploadDocument, deleteDocument} from "../api/documentsIO.js";

export function DocumentPane() {
    const [documentList, setDocumentList] = useState([]);
    const [loading, setLoading] = useState(false); // This is a stopgap - should probably cache existing list and show that while waiting for api response.
    const [uploading, setUploading] = useState(false);

    const fetchDocuments = useCallback(async () =>{
        setLoading(true);
        try {
            const docList = await getDocList();
            setDocumentList(docList);
        } catch(e) {
            console.error('Error loading documents: ', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);


    const handleUpload = async (file) => {
        setUploading(true);
        try {
            const uploadSuccess = await uploadDocument(file);
            if (uploadSuccess) {
                await fetchDocuments();
                }
        } catch (e) {
            console.error('Error with upload: ', e);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="documentPane">
            {loading && <div><p> Loading documents, please wait...</p></div>}
            {uploading && <div><p> Uploading documents, please wait...</p></div>}
            {documentList?.map(document => {
            return <DocumentRow
                key={document.document_id}
                documentName={document.original_filename}
                documentId={document.document_id}
                onDelete={fetchDocuments} />
            })}
            <UploadButton onUpload={handleUpload} />
            <div className="warningBadge" role="note">
                Documents are stored unencrypted on the cloud. Please do not upload any sensitive documents.
            </div>
        </div>
    );
}

function DocumentRow( {documentName, documentId, onDelete} ){
    return (
        <div className="documentRow" style={{display: 'flex', gap: '0.5rem'}}>
            <p>{documentName}</p>
            <DeleteDocumentButton documentId={documentId} onDelete={onDelete} />
        </div>
    );
}

function UploadButton({onUpload}) {
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await onUpload(file);
        } finally {
            e.target.value = '';
        }
    };

    return (
        <>
        <button
            onClick={() => fileInputRef.current.click()}
            className={"upload-btn"}>
            Upload
        </button>
            <input
                ref = {fileInputRef}
                type = "file"
                onChange={handleFileSelect}
                accept=".pdf"
                style={{ display: 'none'}}
                />
        </>
    );

}

function DeleteDocumentButton({documentId, onDelete}) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () =>{
        setDeleting(true);
        try {
            await deleteDocument(documentId);
            onDelete();
        } catch (e) {
            console.error('Error deleting document: ', e);
        } finally {
            setDeleting(false)
        }
    };

    return (
    <button onClick={handleDelete}
    className={"delete-btn"}
    disabled={deleting}>
        X
    </button>
    )
}
