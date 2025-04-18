document.addEventListener('DOMContentLoaded', () => {
    // Find all email copy components
    const emailCopyComponents = document.querySelectorAll('.hero__contact-top');
    
    emailCopyComponents.forEach(component => {
        const emailText = component.querySelector('.hero__contact-email');
        const copyButton = component.querySelector('.hero__contact-email-copy');
        const copiedText = component.querySelector('.hero__contact-email-copied');
        
        // Function to handle the copy and animation
        const copyEmailToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(emailText.textContent);
                
                // Animate email text
                emailText.classList.add('copied');
                
                // Change the SVG to success icon
                const originalSrc = copyButton.src;
                copyButton.src = 'assets/icons/copy-success.svg';
                copyButton.style.filter = 'brightness(1) invert(1)';
                
                // Show the copied text
                copiedText.classList.add('show');
                
                // Reset everything after 3 seconds
                setTimeout(() => {
                    emailText.classList.remove('copied');
                    copyButton.src = originalSrc;
                    copiedText.classList.remove('show');
                }, 3000);
                
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        };
        
        // Add click handlers to both elements
        copyButton.addEventListener('click', copyEmailToClipboard);
        emailText.addEventListener('click', copyEmailToClipboard);
        
        // Add hover effect synchronization
        const elements = [emailText, copyButton];
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                elements.forEach(el => el.style.transform = 'scale(1.05)');
            });
            
            element.addEventListener('mouseleave', () => {
                elements.forEach(el => el.style.transform = 'scale(1)');
            });
            
            element.addEventListener('mousedown', () => {
                elements.forEach(el => el.style.transform = 'scale(0.95)');
            });
            
            element.addEventListener('mouseup', () => {
                elements.forEach(el => el.style.transform = 'scale(1.05)');
            });
        });
    });
});