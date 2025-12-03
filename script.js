// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to navigation on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// Intersection Observer for timeline animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Observe legend cards for staggered animation
const legendCards = document.querySelectorAll('.legend-card');
const legendObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

legendCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    legendObserver.observe(card);
});

// Observe team cards
const teamCards = document.querySelectorAll('.team-card');
const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

teamCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    card.style.transition = 'all 0.5s ease-out';
    teamObserver.observe(card);
});

// Observe circuit cards
const circuitCards = document.querySelectorAll('.circuit-card');
const circuitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

circuitCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-30px)';
    card.style.transition = 'all 0.6s ease-out';
    circuitObserver.observe(card);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation for legend numbers
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            numberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.legend-number').forEach(number => {
    numberObserver.observe(number);
});

// Mobile menu toggle (if needed in future)
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-toggle');
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';
    
    nav.insertBefore(menuButton, nav.firstChild);
    
    menuButton.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });
    
    // Show menu button on mobile
    const checkWidth = () => {
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
        } else {
            menuButton.style.display = 'none';
            document.querySelector('.nav-links').classList.remove('active');
        }
    };
    
    window.addEventListener('resize', checkWidth);
    checkWidth();
};

// Initialize mobile menu
createMobileMenu();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Console message
console.log('%c🏎️ F1 History - Built for Speed! 🏁', 'color: #e10600; font-size: 20px; font-weight: bold;');
console.log('%cInterested in F1 history? Check out the FIA archives at fia.com', 'color: #ffd700; font-size: 14px;');

// ============================================================================
// DATABRICKS GENIE CHAT INTEGRATION
// ============================================================================

let conversationId = null;
let isProcessing = false;

// F1-themed color palette for charts
const F1_COLORS = [
    '#e10600',  // Red
    '#ffd700',  // Gold
    '#b0b0b0',  // Silver
    '#ff6b00',  // Orange
    '#00d2be',  // Cyan
    '#dc0000',  // Dark Red
    '#0090ff',  // Blue
    '#ff1493',  // Pink
    '#00ff00',  // Green
    '#9400d3'   // Purple
];

/**
 * Initialize Genie chat on page load
 */
async function initChat() {
    try {
        const response = await fetch('/api/genie-start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error('Failed to initialize chat');
        }

        const data = await response.json();
        conversationId = data.conversationId;
        console.log('Chat initialized successfully');
    } catch (error) {
        console.error('Error initializing chat:', error);
        renderInlineError('Failed to initialize chat. Please refresh the page.');
    }
}

/**
 * Send a message to Genie
 */
async function sendMessage(messageText) {
    if (!messageText.trim() || isProcessing) return;

    if (!conversationId) {
        renderInlineError('Chat not initialized. Please refresh the page.');
        return;
    }

    isProcessing = true;
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    
    // Disable input
    sendBtn.disabled = true;
    chatInput.disabled = true;

    // Render user message
    renderUserMessage(messageText);

    // Clear input
    chatInput.value = '';

    // Show loading animation
    const loadingId = showLoading();

    try {
        const response = await fetch('/api/genie-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationId: conversationId,
                message: messageText
            })
        });

        // Remove loading animation
        removeLoading(loadingId);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get response');
        }

        const data = await response.json();
        renderAIMessage(data.response, data.results, data.query);

    } catch (error) {
        console.error('Error sending message:', error);
        removeLoading(loadingId);
        renderInlineError(error.message || 'Failed to process your question. Please try again.');
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}

/**
 * Render user message bubble
 */
function renderUserMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-user';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Render AI message bubble with optional data
 */
function renderAIMessage(responseText, results, query) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-ai';
    
    // Add response text
    const textP = document.createElement('p');
    textP.textContent = responseText;
    messageDiv.appendChild(textP);

    // Add SQL query if available (collapsed by default)
    if (query) {
        const queryDetails = document.createElement('details');
        queryDetails.className = 'sql-query';
        const querySummary = document.createElement('summary');
        querySummary.textContent = 'View SQL Query';
        queryDetails.appendChild(querySummary);
        
        const queryPre = document.createElement('pre');
        queryPre.textContent = query;
        queryDetails.appendChild(queryPre);
        messageDiv.appendChild(queryDetails);
    }

    messagesContainer.appendChild(messageDiv);

    // Render results if available
    if (results && Array.isArray(results) && results.length > 0) {
        renderDataTable(results, messageDiv);
        renderChart(results, messageDiv);
    }

    scrollToBottom();
}

/**
 * Render data table with pagination (20 rows per page)
 */
function renderDataTable(data, parentElement) {
    if (!data || data.length === 0) return;

    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';

    const table = document.createElement('table');
    table.className = 'data-table';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columns = Object.keys(data[0]);
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body with pagination
    const tbody = document.createElement('tbody');
    const pageSize = 20;
    let currentPage = 0;

    function renderPage(page) {
        tbody.innerHTML = '';
        const start = page * pageSize;
        const end = Math.min(start + pageSize, data.length);

        for (let i = start; i < end; i++) {
            const row = document.createElement('tr');
            columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = data[i][col] !== null && data[i][col] !== undefined ? data[i][col] : '';
                row.appendChild(td);
            });
            tbody.appendChild(row);
        }
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Add pagination controls if needed
    if (data.length > pageSize) {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination-controls';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.className = 'pagination-btn';
        prevBtn.onclick = () => {
            if (currentPage > 0) {
                currentPage--;
                renderPage(currentPage);
                updatePaginationButtons();
            }
        };

        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.className = 'pagination-btn';
        nextBtn.onclick = () => {
            if ((currentPage + 1) * pageSize < data.length) {
                currentPage++;
                renderPage(currentPage);
                updatePaginationButtons();
            }
        };

        function updatePaginationButtons() {
            const totalPages = Math.ceil(data.length / pageSize);
            pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages} (${data.length} total rows)`;
            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = (currentPage + 1) * pageSize >= data.length;
        }

        paginationDiv.appendChild(prevBtn);
        paginationDiv.appendChild(pageInfo);
        paginationDiv.appendChild(nextBtn);
        tableContainer.appendChild(paginationDiv);

        updatePaginationButtons();
    }

    renderPage(0);
    parentElement.appendChild(tableContainer);
}

/**
 * Auto-detect data type and render appropriate chart
 */
function renderChart(data, parentElement) {
    if (!data || data.length === 0) return;

    // Analyze data structure
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(col => 
        data.every(row => typeof row[col] === 'number' || row[col] === null)
    );

    if (numericColumns.length === 0) return; // No numeric data to chart

    // Check for time-series data (year, date columns)
    const timeColumns = columns.filter(col => 
        col.toLowerCase().includes('year') || 
        col.toLowerCase().includes('date') ||
        col.toLowerCase().includes('season')
    );

    const categoryColumn = columns.find(col => !numericColumns.includes(col)) || columns[0];
    const valueColumn = numericColumns[0];

    // Limit data points for readability
    const chartData = data.slice(0, 20);

    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';

    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    parentElement.appendChild(chartContainer);

    // Determine chart type
    const chartType = timeColumns.length > 0 ? 'line' : 'bar';

    // Prepare chart data
    const labels = chartData.map(row => row[categoryColumn]);
    const values = chartData.map(row => row[valueColumn]);

    new Chart(canvas, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: valueColumn,
                data: values,
                backgroundColor: chartType === 'bar' ? F1_COLORS.slice(0, values.length) : 'rgba(225, 6, 0, 0.2)',
                borderColor: '#e10600',
                borderWidth: 2,
                fill: chartType === 'line'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(176, 176, 176, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(176, 176, 176, 0.1)'
                    }
                }
            }
        }
    });
}

/**
 * Show loading animation
 */
function showLoading() {
    const messagesContainer = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    const loadingId = 'loading-' + Date.now();
    loadingDiv.id = loadingId;
    loadingDiv.className = 'message message-ai loading-message';
    loadingDiv.innerHTML = '<span class="loading-dots">...</span>';
    messagesContainer.appendChild(loadingDiv);
    scrollToBottom();
    return loadingId;
}

/**
 * Remove loading animation
 */
function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

/**
 * Render inline error message
 */
function renderInlineError(errorMessage) {
    const messagesContainer = document.getElementById('chatMessages');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error-message';
    errorDiv.textContent = '⚠️ ' + errorMessage;
    messagesContainer.appendChild(errorDiv);
    scrollToBottom();
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Setup chat event listeners
 */
function setupChatListeners() {
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    // Send button click
    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    });

    // Enter key to send (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
            }
        }
    });

    // Sample question buttons
    document.querySelectorAll('.sample-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            sendMessage(question);
        });
    });

    // Mobile auto-focus when chat section is in viewport
    const chatSection = document.getElementById('chat');
    const chatInputElement = document.getElementById('chatInput');
    
    if (window.innerWidth <= 768) {
        const chatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        chatInputElement.focus();
                    }, 300);
                }
            });
        }, { threshold: 0.5 });

        chatObserver.observe(chatSection);
    }
}

// Initialize chat when page loads
window.addEventListener('load', () => {
    initChat();
    setupChatListeners();
});
