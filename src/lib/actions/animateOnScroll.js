export function animateOnScroll(node) {
const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
    if (entry.isIntersecting) {
            node.style.setProperty('--opacity', '1');
            node.style.setProperty('--translate-y', '0');
            observer.unobserve(node); // Animate only once
        }
    });
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
     observer.observe(node);
    return {
        destroy() {
        observer.unobserve(node);
    }
    };
}