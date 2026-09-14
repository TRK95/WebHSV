import React, { useRef, useEffect } from 'react';
import "./style.scss"
import CheckIcon from '@mui/icons-material/Check';

const NotifyPopup = ({ title, content, onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className='modal'>
            <div className='content' ref={modalRef}>
                <div className='icon'><CheckIcon sx={{ fontSize: 40 }} /></div>
                <div className='closeIcon' onClick={onClose}>
                    x
                </div>
                <h2>{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: content}}></div>
            </div>
        </div>
    );
};

export default NotifyPopup;
