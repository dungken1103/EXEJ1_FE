import React, { useState, useEffect } from 'react';

const FALLBACK_IMAGE = '/images/no_image_available.jpg';

const SafeImage = ({ src, alt, className, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

    useEffect(() => {
        setImgSrc(src || FALLBACK_IMAGE);
    }, [src]);

    const handleError = () => {
        if (imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;
