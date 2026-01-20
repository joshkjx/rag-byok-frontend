import {useState, useEffect, useCallback, useRef} from "react";
import {useAuth} from "../hooks/useAuth.js";

import {getDocList, uploadDocument} from "../api/documentsIO.js";

export function DocumentPane() {
    const [documentList, setDocumentList] = useState([]);
    const [loading, setLoading] = useState(false); // Some additional imports for future features, not used in current build
    const [uploading, setUploading] = useState(false);
    const {username, isLoggedIn} = useAuth();

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
            {documentList?.map(document => {
            return <DocumentRow
                key={document.document_id}
                documentName={document.original_filename} />
            })}
            <UploadButton onUpload={handleUpload} />
        </div>
    );
}

function DocumentRow( {documentName} ){
    return (
        <div className="documentRow">
            <p>{documentName}</p>
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
