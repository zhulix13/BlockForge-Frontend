import { useEffect } from "react";

interface PageMetadataProps {
  title: string;
  description?: string;
}

/**
 * A utility component to update page metadata (title, description) dynamically.
 */
export function PageMetadata({ title, description }: PageMetadataProps) {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | BlockForge`;
    document.title = fullTitle;

    // Update Meta Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null; // This component doesn't render anything
}
