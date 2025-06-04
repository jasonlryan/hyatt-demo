        let currentCampaignId = null;
        let pollingInterval = null;
        let campaignDeliverables = {};
        let progressMessages = [];
        let lastProgressCount = 0;
        let isCreatingCampaign = false; // Prevent duplicate submissions
        let campaignInProgress = false; // Track if a campaign is running
        let currentPhase = null; // Track current phase
        let phaseStartTime = null; // Track phase timing

        async function startNewCampaign() {
            if (currentCampaignId) {
                try {
                    await fetch(`/api/campaigns/${currentCampaignId}`, { method: 'DELETE' });
                } catch (e) {
                    console.error('Failed to cancel campaign', e);
                }
                if (pollingInterval) clearInterval(pollingInterval);
                pollingInterval = null;
            }

            currentCampaignId = null;
            progressMessages = [];
            lastProgressCount = 0;
            campaignDeliverables = {};
            updateDeliverablesPanel();

            document.getElementById('campaignId').innerHTML = '<div class="campaign-id">No active campaign</div>';
            document.getElementById('progressBtn').style.display = 'none';
            document.getElementById('deliverablesBtn').style.display = 'none';
            document.getElementById('newCampaignBtn').style.display = 'none';
            document.getElementById('progressMessages').innerHTML = '';
            document.getElementById('progressPanelMessages').innerHTML = '';
            document.getElementById('conversationMessages').innerHTML = '';
        }

        async function createCampaign() {
            // Prevent multiple submissions
            if (isCreatingCampaign) {
                console.log('Campaign creation already in progress, ignoring duplicate request');
                return;
            }

            document.getElementById('newCampaignBtn').style.display = 'none';

            // Clear previous campaign deliverables
            campaignDeliverables = {};
            if (document.getElementById('deliverablesContent')) {
                updateDeliverablesPanel();
            }

            const brief = document.getElementById('campaignBrief').value.trim();
            
            if (!brief) {
                alert('Please enter a campaign brief');
                return;
            }

            // Set flag to prevent duplicates
            isCreatingCampaign = true;
            
            const createBtn = document.getElementById('createBtn');
            createBtn.disabled = true;
            createBtn.textContent = 'Creating Campaign...';

            // Reset progress and phase tracking
            progressMessages = [];
            lastProgressCount = 0;
            currentPhase = null;
            phaseStartTime = new Date();
            document.getElementById('progressUpdates').style.display = 'none'; // Hide center progress
            document.getElementById('progressBtn').style.display = 'inline-block'; // Show progress button
            document.getElementById('progressPanelMessages').innerHTML = ''; // Clear side panel
            addProgressMessage('🚀 Initializing campaign creation...', 'info');
            addProgressMessage('📝 Processing campaign brief and requirements', 'info');

            try {
                const response = await fetch('/api/campaigns', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ campaignBrief: brief })
                });

                const result = await response.json();

                if (response.ok) {
                    // The result contains campaignId, not id
                    currentCampaignId = result.campaignId;
                    document.getElementById('campaignId').innerHTML = `
                        <div class="campaign-id">Campaign ID: ${currentCampaignId}</div>
                        <div class="campaign-status status-active">Active</div>
                    `;
                    document.getElementById('statusSection').style.display = 'block';

                    // Hide input form and show "New Campaign" button
                    document.getElementById('campaignForm').style.display = 'none';
                    document.getElementById('newCampaignBtn').style.display = 'inline-block';
                    campaignInProgress = true;
                    
                    addProgressMessage('✅ Campaign created successfully', 'success');
                    addProgressMessage('🤖 AI agents are now collaborating on your campaign', 'info');
                    addProgressMessage('⏱️ Estimated completion time: 2-3 minutes', 'info');
                    
                    // Show conversation flow immediately with initial data
                    updateConversationFlow(result);
                    
                    // Start polling for updates immediately
                    startPolling();

                    document.getElementById('newCampaignBtn').style.display = 'inline-block';
                    
                    // Also do an immediate poll
                    setTimeout(updateCampaignStatus, 2000); // Increased delay
                    
                    // Clear the form after successful creation and conversation display
                    setTimeout(() => {
                        document.getElementById('campaignBrief').value = '';
                    }, 1000); // Delay clearing to ensure conversation is displayed
                } else {
                    showError(result.error || 'Failed to create campaign');
                    addProgressMessage('❌ Campaign creation failed', 'error');
                }
            } catch (error) {
                showError('Network error: ' + error.message);
                addProgressMessage('❌ Network error occurred', 'error');
            } finally {
                // Reset flag and button state
                isCreatingCampaign = false;
                createBtn.disabled = false;
                createBtn.textContent = 'Create Campaign';
            }
        }

        function trackPhaseChange(newPhase) {
            if (currentPhase !== newPhase) {
                if (currentPhase && phaseStartTime) {
                    const duration = Math.round((new Date() - phaseStartTime) / 1000);
                    addProgressMessage(`⏱️ ${currentPhase} phase completed in ${duration}s`, 'info', `${currentPhase}-timing`);
                }
                currentPhase = newPhase;
                phaseStartTime = new Date();
                
                // Add phase-specific timing estimates
                const estimates = {
                    'Research': '30-45 seconds',
                    'Strategic Insight': '20-30 seconds', 
                    'Trending': '25-35 seconds',
                    'Story': '30-40 seconds',
                    'Collaborative': '40-60 seconds'
                };
                
                if (estimates[newPhase]) {
                    addProgressMessage(`⏳ ${newPhase} phase starting (est. ${estimates[newPhase]})`, 'info', `${newPhase}-estimate`);
                }
            }
        }

        function simulateProgressFromConversation(campaign) {
            if (!campaign.conversation) return;
            
            // Only add new messages since last check
            const newMessages = campaign.conversation.slice(lastProgressCount);
            
            newMessages.forEach((message, index) => {
                const speaker = message.speaker;
                const timestamp = new Date(message.timestamp).toLocaleTimeString();
                
                // Avoid duplicate progress messages by checking if we already logged this message
                const messageKey = `${speaker}-${message.timestamp}`;
                if (progressMessages.some(p => p.key === messageKey)) {
                    return; // Skip if already processed
                }
                
                // More detailed progress tracking based on actual conversation flow
                if (speaker === 'Campaign Brief') {
                    addProgressMessage(`📝 Original campaign brief recorded: "${message.message.substring(0, 50)}..."`, 'info', messageKey);
                } else if (speaker === 'PR Manager') {
                    if (message.message.includes('campaign introduction') || index === 0) {
                        addProgressMessage(`👔 Campaign initiated - PR Manager setting strategic direction`, 'phase', messageKey);
                    } else if (message.message.includes('research') || message.message.includes('Research')) {
                        trackPhaseChange('Research');
                        addProgressMessage(`🔄 Transitioning to Research & Audience Analysis phase`, 'info', messageKey);
                    } else if (message.message.includes('trending') || message.message.includes('trends')) {
                        trackPhaseChange('Trending');
                        addProgressMessage(`🔄 Transitioning to Trending News Analysis phase`, 'info', messageKey);
                    } else if (message.message.includes('story') || message.message.includes('Story')) {
                        trackPhaseChange('Story');
                        addProgressMessage(`🔄 Transitioning to Story Development phase`, 'info', messageKey);
                    } else if (message.message.includes('collaborative') || message.message.includes('final')) {
                        trackPhaseChange('Collaborative');
                        addProgressMessage(`🔄 Transitioning to Collaborative Synthesis phase`, 'info', messageKey);
                    } else {
                        addProgressMessage(`👔 PR Manager: ${message.message.substring(0, 60)}...`, 'phase', messageKey);
                    }
                } else if (speaker.includes('Research')) {
                    trackPhaseChange('Research');
                    addProgressMessage(`🔍 Research Agent: Analyzing target audience and market insights`, 'info', messageKey);
                } else if (speaker.includes('Strategic Insight')) {
                    trackPhaseChange('Strategic Insight');
                    addProgressMessage(`🧠 Strategic Insight Agent: Converting insights to emotional truths`, 'info', messageKey);
                } else if (speaker.includes('Trending')) {
                    trackPhaseChange('Trending');
                    addProgressMessage(`📈 Trending Agent: Analyzing current market trends and cultural moments`, 'info', messageKey);
                } else if (speaker.includes('Story')) {
                    trackPhaseChange('Story');
                    addProgressMessage(`✍️ Story Agent: Developing compelling narratives and headlines`, 'info', messageKey);
                } else if (speaker === 'All Agents') {
                    trackPhaseChange('Collaborative');
                    addProgressMessage(`🤝 Collaborative Phase: All agents synthesizing final strategy`, 'phase', messageKey);
                }
                
                // Enhanced deliverable tracking
                if (message.deliverable) {
                    const deliverableType = getDeliverableType(message.deliverable);
                    const speakerIcon = getSpeakerIcon(speaker);
                    addProgressMessage(`${speakerIcon} ${deliverableType} deliverable completed by ${speaker}`, 'success', `${messageKey}-deliverable`);
                    
                    // Show quality metrics if available
                    if (message.qualityScore !== undefined) {
                        const qualityLevel = message.qualityScore > 0 ? 'high' : 'needs improvement';
                        addProgressMessage(`📊 Quality assessment: ${qualityLevel} confidence`, 'warning', `${messageKey}-quality`);
                    }
                }
            });
            
            lastProgressCount = campaign.conversation.length;
            
            // Enhanced completion tracking
            if (campaign.status === 'completed' && !progressMessages.some(m => m.message.includes('Campaign completed'))) {
                addProgressMessage('🎉 Campaign strategy completed successfully!', 'success', 'completion');
                addProgressMessage('💾 Campaign saved and ready for implementation', 'success', 'saved');
                campaignInProgress = false;
            }
        }

        function getDeliverableType(deliverable) {
            if (typeof deliverable === 'object') {
                if (deliverable.analysis) return 'Audience Research';
                if (deliverable.humanTruthAnalysis) return 'Strategic Insight';
                if (deliverable.trendsAnalysis) return 'Trends Analysis';
                if (deliverable.storyStrategy) return 'Story Strategy';
                if (deliverable.theme || deliverable.humanTruth) return 'Integrated Campaign Plan';
            }
            return 'Strategy';
        }

        function addProgressMessage(message, type = 'info', key = null) {
            const timestamp = new Date().toLocaleTimeString();
            const messageObj = { 
                message, 
                type, 
                timestamp, 
                key: key || `${timestamp}-${message.substring(0, 20)}` 
            };
            
            // Check for duplicates by finding the index of an existing message with the same key
            const existingMessageIndex = progressMessages.findIndex(p => p.key === messageObj.key);

            if (existingMessageIndex > -1) {
                // Replace existing message to update timestamp/content
                progressMessages[existingMessageIndex] = messageObj;
                console.log(`[Progress Debug] Updated existing message with key: "${messageObj.key}"`);
            } else {
                // Add new message
                progressMessages.push(messageObj);
                console.log(`[Progress Debug] Added new message with key: "${messageObj.key}"`);
            }
            
            // Re-render the entire progress panel to reflect changes
            renderProgressPanel();
            
            // Show progress button if not already visible
            document.getElementById('progressBtn').style.display = 'inline-block';
        }

        function renderProgressPanel() {
            const progressContainer = document.getElementById('progressPanelMessages');
            if (!progressContainer) return;

            // Check if user is scrolled to the bottom before clearing and re-rendering
            const scrollThreshold = 5; 
            const userWasAtBottom = progressContainer.scrollHeight - progressContainer.clientHeight <= progressContainer.scrollTop + scrollThreshold;

            progressContainer.innerHTML = ''; // Clear existing messages

            if (progressMessages.length === 0) {
                progressContainer.innerHTML = '<p style="color: #666; text-align: center; margin-top: 50px; font-size: 0.85rem;">No progress updates yet. Start a campaign to see real-time progress here.</p>';
            } else {
                progressMessages.forEach(msgObj => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `progress-message ${msgObj.type}`;
                    messageDiv.innerHTML = `<span class="progress-timestamp">${msgObj.timestamp}</span>${msgObj.message}`;
                    progressContainer.appendChild(messageDiv);
                });
            }

            if (userWasAtBottom) {
                progressContainer.scrollTop = progressContainer.scrollHeight;
            }
        }

        function formatMarkdown(text) {
            if (!text) return '';
            
            // Convert markdown to HTML
            return text
                // ADDED: First, replace literal '\\n' with actual newlines '\n'
                .replace(/\\n/g, '\n')

                // Headers
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^\*\*(.*)\*\*$/gm, '<h4>$1</h4>')
                
                // Bold and italic
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                
                // Lists
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
                
                // Line breaks
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>')
                
                // Wrap in paragraphs
                .replace(/^(?!<[h|l|p])/gm, '<p>')
                .replace(/(?<!>)$/gm, '</p>')
                
                // Clean up empty paragraphs
                .replace(/<p><\/p>/g, '')
                .replace(/<p><br><\/p>/g, '')
                
                // Wrap lists
                .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
                .replace(/<\/ul>\s*<ul>/g, '');
        }

        function startPolling() {
            if (pollingInterval) clearInterval(pollingInterval);
            
            // Reduced polling frequency to prevent overwhelming the server
            pollingInterval = setInterval(async () => {
                if (currentCampaignId && !isCreatingCampaign) {
                    await updateCampaignStatus();
                }
            }, 3000); // Increased from 1000ms to 3000ms
        }

        async function updateCampaignStatus() {
            try {
                console.log(`Polling campaign status for: ${currentCampaignId}`);
                const response = await fetch(`/api/campaigns/${currentCampaignId}`);
                const campaign = await response.json();

                console.log('Campaign status response:', campaign);

                if (response.ok) {
                    updateConversationFlow(campaign);
                    simulateProgressFromConversation(campaign);

                    if (campaign.status === 'paused') {
                        showReviewBanner(campaign);
                    } else {
                        hideReviewBanner();
                    }

                    if (campaign.status === 'completed') {
                        clearInterval(pollingInterval);
                        campaignInProgress = false;
                    }
                } else {
                    console.error('Failed to fetch campaign status:', campaign.error);
                }
            } catch (error) {
                console.error('Error polling campaign status:', error);
            }
        }

        function updateConversationFlow(campaign) {
            const conversationMessages = document.getElementById('conversationMessages');
            const newMessagesBtn = document.getElementById('newMessagesIndicator');
            
            if (!campaign.conversation) {
                conversationMessages.innerHTML = '<p>No conversation data available</p>';
                if (newMessagesBtn) newMessagesBtn.style.display = 'none';
                return;
            }

            // Check if user is scrolled to the bottom BEFORE adding new messages
            const scrollThreshold = 10;
            const userWasAtBottom = conversationMessages.scrollHeight - conversationMessages.clientHeight <= conversationMessages.scrollTop + scrollThreshold;

            // Determine if there are actually new messages being added compared to what's currently rendered
            const currentMessageCount = conversationMessages.children.length;
            const newMessageCount = campaign.conversation.length;
            const hasNewMessages = newMessageCount > currentMessageCount;

            conversationMessages.innerHTML = campaign.conversation.map(message => {
                const speakerClass = getSpeakerClass(message.speaker);
                const speakerIcon = getSpeakerIcon(message.speaker);
                const isProcessing = message.isProcessing ? 'processing' : '';
                
                let messageHtml = `
                    <div class="conversation-message ${speakerClass} ${isProcessing}">
                        <div class="message-speaker">${speakerIcon} ${message.speaker}:</div>
                        <div class="message-content">${message.message}</div>
                        <div class="message-timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
                    </div>
                `;

                if (message.deliverable) {
                    messageHtml += `
                        <div class="deliverable-section">
                            ${formatDeliverableData(message.deliverable, message.agent || message.speaker)}
                        </div>
                    `;
                }

                return messageHtml;
            }).join('');

            if (userWasAtBottom) {
                conversationMessages.scrollTop = conversationMessages.scrollHeight;
                if (newMessagesBtn) newMessagesBtn.style.display = 'none';
            } else {
                if (hasNewMessages && newMessagesBtn) {
                    newMessagesBtn.style.display = 'block';
                }
            }
        }

        function scrollToConversationBottom() {
            const conversationMessages = document.getElementById('conversationMessages');
            const newMessagesBtn = document.getElementById('newMessagesIndicator');
            if (conversationMessages) {
                conversationMessages.scrollTop = conversationMessages.scrollHeight;
            }
            if (newMessagesBtn) {
                newMessagesBtn.style.display = 'none';
            }
        }

        function getSpeakerClass(speaker) {
            switch (speaker) {
                case 'Campaign Brief':
                    return 'campaign-brief';
                case 'PR Manager':
                    return 'pr-manager';
                case 'Research & Audience GPT':
                    return 'research-agent';
                case 'Strategic Insight GPT':
                    return 'strategic-agent';
                case 'Trending News GPT':
                    return 'trending-agent';
                case 'Story Angles & Headlines GPT':
                    return 'story-agent';
                case 'All Agents':
                    return 'all-agents';
                default:
                    return '';
            }
        }

        function getSpeakerIcon(speaker) {
            switch (speaker) {
                case 'Campaign Brief':
                    return '📝';
                case 'PR Manager':
                    return '👔';
                case 'Research & Audience GPT':
                    return '🔍';
                case 'Strategic Insight GPT':
                    return '🧠';
                case 'Trending News GPT':
                    return '📈';
                case 'Story Angles & Headlines GPT':
                    return '✍️';
                case 'All Agents':
                    return '🤝';
                default:
                    return '🤖';
            }
        }

        function formatDeliverableData(deliverable, agent) {
            if (typeof deliverable === 'object') {
                let content = '';
                let title = `${agent} Deliverable`;

                // Handle Research & Audience deliverables
                if (deliverable.analysis) {
                    title = "Audience Research & Insights";
                    content = deliverable.analysis;
                } 
                // Handle Trending News deliverables
                else if (deliverable.trendsAnalysis) {
                    title = "Trending News Analysis";
                    content = deliverable.trendsAnalysis;
                } 
                // Handle Story Angles deliverables
                else if (deliverable.storyStrategy) {
                    title = "Story Angles & Headlines";
                    content = deliverable.storyStrategy;
                }
                // Handle Strategic Insight deliverables
                else if (deliverable.humanTruthAnalysis) {
                    title = "Strategic Insight & Human Truth";
                    content = deliverable.humanTruthAnalysis;
                }
                // Handle comprehensive final strategy deliverables
                else if (deliverable.theme || deliverable.humanTruth || deliverable.storyAngles || deliverable.trends) {
                    title = "Integrated Campaign Plan";
                    content = ''; // Initialize content

                    if (deliverable.theme) {
                        content += `CAMPAIGN THEME\\n${deliverable.theme}\\n\\n`;
                    }

                    if (deliverable.humanTruth) {
                        content += `HUMAN TRUTH\\n${deliverable.humanTruth}\\n\\n`;
                    }

                    // For storyAngles
                    if (deliverable.storyAngles) {
                        content += 'STORY STRATEGY\\n';
                        if (typeof deliverable.storyAngles === 'string') {
                            content += `${deliverable.storyAngles}\\n\\n`;
                        } else if (typeof deliverable.storyAngles === 'object') {
                            // If the object has a 'storyStrategy' property, use it
                            if (deliverable.storyAngles.storyStrategy && typeof deliverable.storyAngles.storyStrategy === 'string') {
                                content += `${deliverable.storyAngles.storyStrategy}\\n\\n`;
                            }
                            // If it has an 'angles' property (as seen in backend story.angles)
                            else if (deliverable.storyAngles.angles && typeof deliverable.storyAngles.angles === 'string') {
                                content += `${deliverable.storyAngles.angles}\\n\\n`;
                            }
                            // Fallback: stringify the object, assuming it contains the details directly
                            else {
                                content += `${JSON.stringify(deliverable.storyAngles, null, 2)}\\n\\n`;
                            }
                        }
                    }

                    // For trends
                    if (deliverable.trends) {
                        content += 'TRENDS ANALYSIS\\n';
                        if (typeof deliverable.trends === 'string') {
                            content += `${deliverable.trends}\\n\\n`;
                        } else if (Array.isArray(deliverable.trends)) {
                            // If it's an array of strings or simple objects
                            content += deliverable.trends.map(trend => {
                                if (typeof trend === 'string') return `- ${trend}`;
                                if (typeof trend === 'object' && trend.trendName) return `- ${trend.trendName}: ${trend.description || ''}`; // Example structure
                                return `- ${JSON.stringify(trend)}`;
                            }).join('\\n') + '\\n\\n';
                        } else if (typeof deliverable.trends === 'object') {
                            // If the object has a 'trendsAnalysis' property, use it
                            if (deliverable.trends.trendsAnalysis && typeof deliverable.trends.trendsAnalysis === 'string') {
                                content += `${deliverable.trends.trendsAnalysis}\\n\\n`;
                            }
                            // Fallback: stringify the object
                            else {
                                content += `${JSON.stringify(deliverable.trends, null, 2)}\\n\\n`;
                            }
                        }
                    }

                    // If no structured content was found, show what we have
                    if (!content) {
                        content = 'Comprehensive campaign strategy has been generated. Please check the deliverables panel for full details.';
                    }
                }
                // Fallback for any other object structure
                else {
                    // Try to extract any meaningful content from the object
                    const keys = Object.keys(deliverable);
                    if (keys.length > 0) {
                        content = keys.map(key => {
                            const value = deliverable[key];
                            if (typeof value === 'string' && value.length > 50) {
                                return `${key.toUpperCase()}\n${value}\n`;
                            } else if (typeof value === 'object') {
                                return `${key.toUpperCase()}\n${JSON.stringify(value, null, 2)}\n`;
                            }
                            return `${key}: ${value}`;
                        }).join('\n');
                    } else {
                        content = 'Deliverable content is available but in an unexpected format.';
                    }
                }

                const existingDeliverable = campaignDeliverables[agent];
                campaignDeliverables[agent] = { 
                    title, 
                    content,
                    // Preserve existing expanded state, or default for new deliverables
                    expanded: existingDeliverable ? existingDeliverable.expanded : (Object.keys(campaignDeliverables).length === 0)
                };
                
                // Show deliverables button and auto-update panel
                document.getElementById('deliverablesBtn').style.display = 'inline-block';
                
                // Auto-update deliverables panel if it exists
                if (document.getElementById('deliverablesContent')) {
                    updateDeliverablesPanel();
                }
                
                // Add visual notification for new deliverable
                addDeliverableNotification(title);

                return `<div class="deliverable-placeholder">
                    📄 <strong>DELIVERABLE:</strong> ${title}
                    <span class="deliverable-badge">Ready</span>
                    <button class="deliverable-toggle" onclick="openDeliverablesPanel()">View Details</button>
                </div>`;
            }

            // Handle string deliverables
            campaignDeliverables[agent] = { 
                title: `${agent} Deliverable`, 
                content: deliverable,
                expanded: Object.keys(campaignDeliverables).length === 0 // First deliverable is expanded
            };
            document.getElementById('deliverablesBtn').style.display = 'inline-block';
            
            // Auto-update deliverables panel if it exists
            if (document.getElementById('deliverablesContent')) {
                updateDeliverablesPanel();
            }
            
            // Add visual notification for new deliverable
            addDeliverableNotification(`${agent} Deliverable`);

            return `<div class="deliverable-placeholder">
                📄 <strong>DELIVERABLE:</strong> ${agent} Deliverable
                <span class="deliverable-badge">Ready</span>
                <button class="deliverable-toggle" onclick="openDeliverablesPanel()">View Details</button>
            </div>`;
        }

        function showError(message) {
            const errorSection = document.getElementById('errorSection');
            errorSection.innerHTML = `<div class="error">${message}</div>`;
            errorSection.style.display = 'block';
            
            setTimeout(() => {
                errorSection.style.display = 'none';
            }, 5000);
        }

        // Load recent campaigns on page load
        async function loadRecentCampaigns() {
            try {
                console.log('🔄 Loading recent campaigns...');
                const response = await fetch('/api/campaigns');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const campaigns = await response.json();
                console.log(`📚 Loaded ${campaigns.length} campaigns`);
                
                const campaignsList = document.getElementById('campaignsList');
                
                if (campaigns.length === 0) {
                    campaignsList.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No campaigns yet. Create your first campaign above!</p>';
                    return;
                }
                
                // Reverse the order to show most recent first
                const sortedCampaigns = campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                campaignsList.innerHTML = sortedCampaigns.map(campaign => `
                    <div class="campaign-item" onclick="loadCampaign('${campaign.id}')">
                        <div class="campaign-meta">
                            <span class="campaign-id">${campaign.id}</span>
                            <span class="campaign-status status-${campaign.status}">${campaign.status}</span>
                        </div>
                        <p>${campaign.brief}</p>
                        <small>Created: ${new Date(campaign.createdAt).toLocaleString()}</small>
                    </div>
                `).join('');
            } catch (error) {
                console.error('❌ Failed to load campaigns:', error);
                const campaignsList = document.getElementById('campaignsList');
                campaignsList.innerHTML = '<p style="color: #dc3545; text-align: center; padding: 20px;">Failed to load campaigns. Please refresh the page.</p>';
            }
        }

        function loadCampaign(campaignId) {
            currentCampaignId = campaignId;
            
            // Reset all tracking variables
            progressMessages = [];
            lastProgressCount = 0;
            isCreatingCampaign = false; // Reset the creation flag
            
            // Clear previous campaign deliverables
            campaignDeliverables = {};
            if (document.getElementById('deliverablesContent')) {
                updateDeliverablesPanel();
            }
            
            document.getElementById('progressMessages').innerHTML = '';
            document.getElementById('progressPanelMessages').innerHTML = '';
            document.getElementById('progressUpdates').style.display = 'none';
            document.getElementById('progressBtn').style.display = 'inline-block';
            addProgressMessage('🔄 Loading existing campaign...', 'info', 'loading-start');
            
            document.getElementById('campaignId').innerHTML = `
                <div class="campaign-id">Campaign ID: ${campaignId}</div>
                <div class="campaign-status status-active">Loading...</div>
            `;
            document.getElementById('statusSection').style.display = 'block';

            document.getElementById('campaignForm').style.display = 'none';
            document.getElementById('newCampaignBtn').style.display = 'inline-block';
            campaignInProgress = true;
            
            // Reset deliverables button
            document.getElementById('deliverablesBtn').style.display = 'none';
            document.getElementById('deliverablesBtn').innerHTML = 'View Deliverables';
            
            // Reset all phases
            ['research', 'trending', 'story', 'collaborative'].forEach(phase => {
                const card = document.getElementById(`${phase}Card`);
                const status = document.getElementById(`${phase}Status`);
                const results = document.getElementById(`${phase}Results`);
                
                if (card && status && results) {
                    card.className = 'status-card';
                    status.textContent = 'Pending';
                    status.className = 'phase-status status-pending';
                    results.style.display = 'none';
                }
            });

            startPolling();
            document.getElementById('newCampaignBtn').style.display = 'inline-block';
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            loadRecentCampaigns();
            updateContainerClasses();
            if (document.getElementById('deliverablesContent')) {
                updateDeliverablesPanel();
            }
            // ADDED: Initial render of the progress panel if it exists, to show placeholder or existing messages
            if (document.getElementById('progressPanelMessages')) {
                renderProgressPanel();
                // Open progress panel on initial load so users immediately see updates
                openProgressPanel();
            }

            fetch('/api/manual-review')
                .then(res => res.json())
                .then(data => {
                    const cb = document.getElementById('manualReviewCheckbox');
                    if (cb) cb.checked = data.enabled;
                })
                .catch(() => {});

            // ADDED: Event listener for conversation scroll
            const conversationMessages = document.getElementById('conversationMessages');
            if (conversationMessages) {
                conversationMessages.addEventListener('scroll', () => {
                    const newMessagesBtn = document.getElementById('newMessagesIndicator');
                    if (newMessagesBtn && newMessagesBtn.style.display === 'block') {
                        // If user scrolls to the bottom manually, hide the button
                        const scrollThreshold = 10;
                        if (conversationMessages.scrollHeight - conversationMessages.clientHeight <= conversationMessages.scrollTop + scrollThreshold) {
                            newMessagesBtn.style.display = 'none';
                        }
                    }
                });
            }
        });

        // Progress Panel Functions - LEFT SIDE
        function openProgressPanel() {
            const panel = document.getElementById('progressPanel');
            panel.classList.add('open');
            updateContainerClasses();

            // When opening the panel, ensure the latest messages are rendered
            // and automatically scroll to the bottom so the newest updates are
            // visible. This mirrors the behaviour when new messages arrive but
            // still allows the user to scroll up manually afterwards.
            renderProgressPanel();
            const container = document.getElementById('progressPanelMessages');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }

        function closeProgressPanel() {
            document.getElementById('progressPanel').classList.remove('open');
            updateContainerClasses();
        }

        // Deliverables Panel Functions - RIGHT SIDE
        function openDeliverablesPanel() {
            updateContainerClasses();
            updateDeliverablesPanel();
        }

        // Update container classes based on panel states
        function updateContainerClasses() {
            const container = document.querySelector('.container');
            const progressPanel = document.getElementById('progressPanel');

            container.classList.remove('progress-open', 'deliverables-open', 'both-open');

            if (progressPanel.classList.contains('open')) {
                container.classList.add('both-open');
            } else {
                container.classList.add('deliverables-open');
            }
            
            // Handle overlay for mobile (progress panel only now)
            const isMobile = window.innerWidth <= 768;
            if (isMobile && progressPanel.classList.contains('open')) {
                document.getElementById('panelOverlay').classList.add('show');
            } else {
                document.getElementById('panelOverlay').classList.remove('show');
            }
        }

        // Close all panels (now only effectively closes progress panel if mobile overlay is clicked)
        function closePanels() {
            document.getElementById('progressPanel').classList.remove('open');
            updateContainerClasses();
        }

        function updateDeliverablesPanel() {
            const content = document.getElementById('deliverablesContent');
            
            if (Object.keys(campaignDeliverables).length === 0) {
                content.innerHTML = '<p style="color: #666; text-align: center; margin-top: 50px;">No deliverables available yet.</p>';
                return;
            }

            let html = '';
            for (const [agentName, deliverable] of Object.entries(campaignDeliverables)) {
                const formattedContent = formatMarkdown(deliverable.content || 'No content available');
                const agentIcon = getSpeakerIcon(agentName);
                html += `
                    <div class="deliverable-item">
                        <div class="deliverable-header ${deliverable.expanded ? 'expanded' : ''}" onclick="toggleDeliverable('${agentName}')">
                            <div>
                                <h4>${deliverable.title || agentName}</h4>
                                <div class="agent-name">${agentIcon} From: ${agentName}</div>
                            </div>
                            <div class="deliverable-actions">
                                <button class="download-btn" onclick="downloadDeliverable('${agentName}', event)" title="Download as markdown file">
                                    📥
                                </button>
                                <span class="collapse-icon ${deliverable.expanded ? 'expanded' : ''}">▼</span>
                            </div>
                        </div>
                        <div class="deliverable-content ${deliverable.expanded ? 'expanded' : ''}">${formattedContent}</div>
                    </div>
                `;
            }
            content.innerHTML = html;
        }

        function toggleDeliverable(agentName) {
            const deliverable = campaignDeliverables[agentName];
            deliverable.expanded = !deliverable.expanded;
            updateDeliverablesPanel();
        }

        function closePanelsOnMobile() {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                closePanels();
            }
        }

        function addDeliverableNotification(title) {
            // Update deliverables button with count
            const deliverableCount = Object.keys(campaignDeliverables).length;
            const deliverablesBtn = document.getElementById('deliverablesBtn');
            
            // Add count badge to button
            deliverablesBtn.innerHTML = `View Deliverables <span style="background: #dc3545; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.75rem; margin-left: 5px;">${deliverableCount}</span>`;
            
            // Add progress message about new deliverable
            addProgressMessage(`📄 New deliverable available: ${title}`, 'success', `deliverable-${currentCampaignId}-${title}`);
            
            // Briefly highlight the deliverables button
            deliverablesBtn.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                deliverablesBtn.style.animation = '';
            }, 2000);
        }

        function showReviewBanner(campaign) {
            addReviewPrompt(campaign);
        }

        function hideReviewBanner() {
            removeReviewPrompt();
        }

        function addReviewPrompt(campaign) {
            const container = document.getElementById('conversationMessages');
            if (!container || document.getElementById('reviewPrompt')) return;

            const prompt = document.createElement('div');
            prompt.id = 'reviewPrompt';
            prompt.className = 'review-prompt';

            const message = campaign.pendingPhase === 'final_signoff'
                ? 'Review the final strategy and click Finalize to complete the campaign.'
                : `Awaiting review of the ${campaign.awaitingReview} phase.`;

            const resumeLabel = campaign.pendingPhase === 'final_signoff' ? 'Finalize' : 'Resume';

            prompt.innerHTML = `
                <div class="review-prompt-text">${message}</div>
                <div class="review-prompt-actions">
                    <button id="resumeBtnFlow" class="btn ${resumeLabel === 'Finalize' ? 'btn-finalize' : ''}">${resumeLabel}</button>
                    <button id="refineBtnFlow" class="btn btn-refine">Refine</button>
                </div>
            `;

            container.appendChild(prompt);
            scrollToConversationBottom();

            document.getElementById('resumeBtnFlow').onclick = async () => {
                try {
                    await fetch(`/api/campaigns/${campaign.id}/resume`, { method: 'POST' });
                } catch (err) {
                    alert('Failed to resume campaign');
                }
            };

            document.getElementById('refineBtnFlow').onclick = () => {
                removeReviewPrompt();
                showRefinePrompt(campaign.id);
            };
        }

        function removeReviewPrompt() {
            const prompt = document.getElementById('reviewPrompt');
            if (prompt) prompt.remove();
        }

        function showRefinePrompt(campaignId) {
            const container = document.getElementById('conversationMessages');
            if (!container || document.getElementById('refinePrompt')) return;

            const prompt = document.createElement('div');
            prompt.id = 'refinePrompt';
            prompt.className = 'review-prompt';
            prompt.innerHTML = `
                <div class="review-prompt-text">Enter refinement instructions:</div>
                <textarea id="refineText" rows="3" style="width:100%; margin-top:10px;"></textarea>
                <div class="review-prompt-actions">
                    <button id="submitRefine" class="btn btn-refine">Submit</button>
                    <button id="cancelRefine" class="btn">Cancel</button>
                </div>
            `;

            container.appendChild(prompt);
            scrollToConversationBottom();

            document.getElementById('submitRefine').onclick = async () => {
                const text = document.getElementById('refineText').value.trim();
                if (!text) return;
                try {
                    await fetch(`/api/campaigns/${campaignId}/refine`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ instructions: text })
                    });
                } catch (err) {
                    alert('Failed to submit refinement');
                }
                prompt.remove();
            };

            document.getElementById('cancelRefine').onclick = () => {
                prompt.remove();
            };
        }

        function toggleCampaignsList() {
            const campaignsList = document.getElementById('campaignsList');
            const toggleIcon = document.getElementById('campaignsToggle');
            
            if (campaignsList.classList.contains('open')) {
                campaignsList.classList.remove('open');
                toggleIcon.style.transform = 'rotate(0deg)';
            } else {
                campaignsList.classList.add('open');
                toggleIcon.style.transform = 'rotate(180deg)';
            }
        }

        function downloadDeliverable(agentName, event) {
            event.preventDefault();
            event.stopPropagation(); // Prevent triggering the collapse/expand
            
            const deliverable = campaignDeliverables[agentName];
            if (!deliverable || !deliverable.content) {
                alert('No content available to download');
                return;
            }
            
            const content = deliverable.content;
            // Create a clean filename
            const cleanAgentName = agentName.replace(/[^a-zA-Z0-9]/g, '_');
            const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const filename = `${cleanAgentName}_deliverable_${timestamp}.md`;

            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function newCampaign() {
            if (campaignInProgress || isCreatingCampaign) {
                const cancel = confirm('A campaign is currently running. Click OK to cancel it and start a new one, or Cancel to keep waiting.');
                if (!cancel) {
                    return; // User chose to wait
                }
                if (pollingInterval) clearInterval(pollingInterval);
                campaignInProgress = false;
                isCreatingCampaign = false;
                currentCampaignId = null;
                document.getElementById('statusSection').style.display = 'none';
                document.getElementById('progressBtn').style.display = 'none';
                document.getElementById('progressUpdates').style.display = 'none';
                document.getElementById('progressPanelMessages').innerHTML = '';
            }

            document.getElementById('campaignForm').style.display = 'block';
            document.getElementById('newCampaignBtn').style.display = 'none';
        }

        async function toggleManualReview() {
            const checkbox = document.getElementById('manualReviewCheckbox');
            try {
                await fetch('/api/manual-review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enabled: checkbox.checked })
                });
            } catch (err) {
                alert('Failed to update manual review setting');
                checkbox.checked = !checkbox.checked;
            }
        }

