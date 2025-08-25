/**
 * Navigation utilities for single-page application behavior
 */

/**
 * Smooth scroll to element with offset for fixed header
 */
export const scrollToElement = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Update page title and meta description for SEO
 */
export const updatePageMeta = (title: string, description?: string) => {
  document.title = title;
  
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }
};

/**
 * Handle external links to open in new tab
 */
export const handleExternalLinks = (container: HTMLElement) => {
  const links = container.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = (link as HTMLAnchorElement).href;
    if (href && !href.includes(window.location.origin)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

/**
 * Create loading state for content
 */
export const createLoadingState = (container: HTMLElement, message: string = 'Loading...') => {
  container.innerHTML = `
    <div class="content-loading">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      <p class="text-gray-600 mt-4">${message}</p>
    </div>
  `;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};