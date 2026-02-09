import React, { useEffect } from 'react';

const SEO = ({ title, description }) => {
    useEffect(() => {
        // Update Title
        document.title = title || 'Waste To Worth';

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description || 'Trao vòng đời mới cho những mảnh gỗ offcut.');

        // Cleanup (optional, restores default if component unmounts - usually not needed for page transitions in SPA)
    }, [title, description]);

    return null;
};

export default SEO;
