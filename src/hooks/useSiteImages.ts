"use client";

import { useState, useEffect } from "react";

export function useSiteImages() {
    const [images, setImages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchImages = async () => {
            try {
                const response = await fetch("/api/admin/site-images");
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const imgMap: Record<string, string> = {};
                    data.forEach((img: any) => {
                        if (img.key && img.url) {
                            imgMap[img.key] = img.url;
                        }
                    });
                    setImages(imgMap);
                }
            } catch (error) {
                console.error("Error fetching site images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const getImageUrl = (key: string, defaultPath: string) => {
        // Return default if not mounted or if image not found/empty in DB
        if (!isMounted) return defaultPath;
        const dbUrl = images[key];
        return (dbUrl && dbUrl.trim() !== "") ? dbUrl : defaultPath;
    };

    return { getImageUrl, images, loading, isMounted };
}
