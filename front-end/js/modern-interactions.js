/**
 * Modern Interactions for Vulcan ERP Website
 * Handles scroll effects, animations, and interactive elements
 */

(function($) {
    'use strict';

    // Initialize when document is ready
    $(document).ready(function() {
        initScrollEffects();
        initAnimations();
        initTestimonialSlider();
        initCounterAnimations();
        initSmoothScrolling();
        initHeaderEffects();
        initTabAnimations();
        initLaptopInteractions();
        initTabSwitching();
    });

    // Scroll Effects
    function initScrollEffects() {
        // Removed scroll progress indicator
        
        // Removed custom header scroll effects to restore original behavior
    }

    // Removed scroll progress indicator to restore original behavior

    // Animations on scroll
    function initAnimations() {
        // Add animation classes to elements
        $('.modern_card, .work_item, .testimonial_item, .stat_item').addClass('animate-on-scroll');
        
        // Intersection Observer for animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Testimonial Slider
    function initTestimonialSlider() {
        let currentSlide = 0;
        const slides = $('.testimonial_item');
        const totalSlides = slides.length;

        if (totalSlides > 1) {
            // Initialize first slide
            slides.eq(0).addClass('active');
            
            // Auto-rotate testimonials
            setInterval(() => {
                slides.removeClass('active');
                currentSlide = (currentSlide + 1) % totalSlides;
                slides.eq(currentSlide).addClass('active');
            }, 5000);
        }
    }

    // Counter Animations
    function initCounterAnimations() {
        const counters = $('.counter');
        
        if (counters.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.each(function() {
                observer.observe(this);
            });
        }
    }

    // Animate counter numbers
    function animateCounter(element) {
        const $element = $(element);
        const target = parseInt($element.text());
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            $element.text(Math.floor(current));
        }, 16);
    }

    // Smooth Scrolling
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this.getAttribute('href'));
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800, 'easeInOutQuart');
            }
        });
    }

    // Header Effects
    function initHeaderEffects() {
        // Removed custom mobile menu modifications to restore original behavior
    }

    // Tab Animations
    function initTabAnimations() {
        $('.nav-tabs .nav-link').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this.getAttribute('href'));
            const tabContent = $('.tab-content');
            
            // Remove active classes
            $('.nav-tabs .nav-link').removeClass('active');
            $('.tab-pane').removeClass('show active');
            
            // Add active classes
            $(this).addClass('active');
            target.addClass('show active');
            
            // Trigger animation
            target.addClass('fade-in');
            setTimeout(() => {
                target.removeClass('fade-in');
            }, 300);
        });
    }

    // Laptop Interactions
    function initLaptopInteractions() {
        const laptop = $('.laptop');
        const screen = $('.laptop-screen');
        const statNumbers = $('.stat-number');
        
        // Laptop hover effects
        laptop.on('mouseenter', function() {
            $(this).addClass('laptop-active');
            // Animate dashboard stats
            animateDashboardStats();
        });
        
        laptop.on('mouseleave', function() {
            $(this).removeClass('laptop-active');
        });
        
        // Screen click effect
        screen.on('click', function() {
            $(this).addClass('screen-clicked');
            setTimeout(() => {
                $(this).removeClass('screen-clicked');
            }, 200);
        });
        
        // Animate chart bars on scroll
        $(window).scroll(function() {
            const laptopOffset = $('.laptop-container').offset().top;
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            
            if (scrollTop + windowHeight > laptopOffset + 100) {
                animateChartBars();
            }
        });
    }
    
    // Animate dashboard statistics
    function animateDashboardStats() {
        $('.stat-number').each(function() {
            const $this = $(this);
            const target = parseFloat($this.data('target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Handle decimal numbers for uptime
                if (target < 10) {
                    $this.text(current.toFixed(1));
                } else {
                    $this.text(Math.floor(current));
                }
            }, 16);
        });
    }
    
    // Animate chart bars
    function animateChartBars() {
        $('.bar').each(function(index) {
            const $bar = $(this);
            const height = $bar.css('height');
            
            $bar.css('height', '0');
            setTimeout(() => {
                $bar.css('height', height);
            }, index * 100);
        });
    }
    

    // Utility Functions
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Optimize scroll events
    $(window).on('scroll', throttle(function() {
        // Scroll-based animations and effects
        const scrollTop = $(window).scrollTop();
        
        // Subtle parallax effect for hero section
        if (scrollTop < $(window).height()) {
            $('.laptop-container').css('transform', `translateY(${scrollTop * 0.1}px)`);
        }
        
        // Fade in elements as they come into view
        $('.animate-on-scroll').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-in');
            }
        });
    }, 16));

    // Add easing function
    $.easing.easeInOutQuart = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    };

    // Initialize tooltips and popovers if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Add loading animation
    $(window).on('load', function() {
        $('.loading-overlay').fadeOut();
    });

    // Form validation and interactions
    $('form').on('submit', function(e) {
        const form = $(this);
        const submitBtn = form.find('button[type="submit"]');
        
        // Add loading state
        submitBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Sending...');
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            submitBtn.prop('disabled', false).html('Send Message');
            // Show success message
            showNotification('Message sent successfully!', 'success');
        }, 2000);
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification notification-${type}">
                <i class="fa fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.fadeOut(() => notification.remove());
        }, 5000);
        
        // Manual close
        notification.find('.close-notification').on('click', function() {
            notification.fadeOut(() => notification.remove());
        });
    }

    // Add notification styles
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification-info {
                border-left: 4px solid #17a2b8;
            }
            
            .close-notification {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
                margin-left: auto;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `)
        .appendTo('head');

    // Tab switching without page jump
    function initTabSwitching() {
        $('.modern_tabs .nav-link').on('click', function(e) {
            e.preventDefault();
            
            // Get the target tab ID from the data-target or href
            let targetId = $(this).data('target');
            if (!targetId) {
                // Fallback: get from aria-controls
                targetId = $(this).attr('aria-controls');
            }
            
            // Remove active class from all tabs and panes
            $('.modern_tabs .nav-link').removeClass('active');
            $('.tab-pane').removeClass('show active');
            
            // Add active class to clicked tab
            $(this).addClass('active');
            
            // Show corresponding tab pane
            if (targetId) {
                $('#' + targetId).addClass('show active');
            }
        });
    }

})(jQuery);
