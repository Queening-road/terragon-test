// CodeSphere Interactive Demo Script

class CodeSphereDemo {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.showPage('dashboard');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.showPage(pageId);
                this.updateNavigation(link);
            });
        });
    }

    setupEventListeners() {
        // Form submissions
        const loginForm = document.querySelector('.login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Model selection change
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                this.showModelChangeNotification(e.target.value);
            });
        }

        // Task group collapsing
        this.setupTaskGroupListeners();

        // Auto-resize textarea
        const chatInput = document.getElementById('commandInput');
        if (chatInput) {
            chatInput.addEventListener('input', this.autoResizeTextarea.bind(this));
        }
    }

    setupTaskGroupListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.task-group-header')) {
                const header = e.target.closest('.task-group-header');
                const group = header.closest('.task-group');
                group.classList.toggle('collapsed');
            }
        });
    }

    autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(60, textarea.scrollHeight) + 'px';
    }

    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    }

    updateNavigation(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            this.showNotification('登录成功！欢迎使用 CodeSphere', 'success');
            setTimeout(() => {
                this.showPage('dashboard');
                this.updateNavigation(document.querySelector('[data-page="dashboard"]'));
            }, 1500);
        } else {
            this.showNotification('请填写完整的登录信息', 'error');
        }
    }

    showModelChangeNotification(model) {
        const modelNames = {
            'claude': 'Claude',
            'kimi': 'Kimi',
            'qwen': 'Qwen',
            'glm': 'GLM'
        };
        this.showNotification(`已切换到 ${modelNames[model]} 模型`, 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    executeTask() {
        const commandInput = document.getElementById('commandInput');
        const command = commandInput.value.trim();

        if (!command) {
            this.showNotification('请输入命令或任务描述', 'error');
            return;
        }

        // Create new task
        const task = {
            id: this.taskIdCounter++,
            command: command,
            status: 'running',
            model: document.getElementById('modelSelect').value,
            timestamp: new Date(),
            progress: 0
        };

        this.tasks.unshift(task);
        this.renderTaskList();
        commandInput.value = '';

        // Simulate task execution
        this.simulateTaskExecution(task);

        this.showNotification('任务已添加到执行队列', 'success');
    }

    simulateTaskExecution(task) {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                task.status = 'completed';
                task.result = this.generateMockResult(task.command);
                clearInterval(progressInterval);
                this.renderTaskList();
                this.showNotification(`任务 #${task.id} 执行完成`, 'success');
            }
            task.progress = progress;
            this.updateTaskProgress(task);
        }, 1000);
    }

    generateMockResult(command) {
        const results = [
            "成功创建了React组件，包含登录表单和验证逻辑",
            "已生成Python爬虫代码，包含错误处理和数据存储功能",
            "创建了Vue.js单页应用，包含路由和状态管理",
            "生成了Node.js API服务，包含数据库连接和中间件",
            "已创建机器学习模型训练脚本，包含数据预处理和模型评估"
        ];
        return results[Math.floor(Math.random() * results.length)];
    }

    updateTaskProgress(task) {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (taskElement) {
            const progressBar = taskElement.querySelector('.task-progress-fill');
            const statusElement = taskElement.querySelector('.task-status');
            
            if (progressBar) {
                progressBar.style.width = `${task.progress}%`;
            }
            
            if (statusElement) {
                statusElement.textContent = task.status === 'completed' ? '已完成' : `进行中 ${Math.round(task.progress)}%`;
                statusElement.className = `task-status ${task.status}`;
            }
        }
    }

    renderTaskList() {
        // Group tasks by date
        const todayTasks = this.tasks.filter(task => this.isToday(task.timestamp));
        const yesterdayTasks = this.tasks.filter(task => this.isYesterday(task.timestamp));

        // Render today's tasks
        this.renderTaskGroup('todayTasks', todayTasks);
        
        // Render yesterday's tasks
        this.renderTaskGroup('yesterdayTasks', yesterdayTasks);
    }

    renderTaskGroup(containerId, tasks) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-tasks">暂无任务</div>';
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="task-item-new" data-task-id="${task.id}" onclick="demo.showTaskDetails(${task.id})">
                <div class="task-status-icon ${task.status}">
                    ${task.status === 'completed' ? '<i class="fas fa-check"></i>' : 
                      task.status === 'running' ? '<i class="fas fa-spinner"></i>' : 
                      '<i class="fas fa-clock"></i>'}
                </div>
                <div class="task-content">
                    <div class="task-title">${task.command}</div>
                    <div class="task-meta">
                        <span class="task-time">${this.getRelativeTime(task.timestamp)}</span>
                        <span class="task-repo">Queening-road/terragon-test</span>
                    </div>
                </div>
                <div class="task-stats">
                    ${task.status === 'completed' && task.result ? `
                        <div class="task-stat positive">
                            <i class="fas fa-plus"></i>
                            <span>+${Math.floor(Math.random() * 2000) + 100}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
    }

    getRelativeTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (minutes < 60) {
            return `${minutes} min ago`;
        } else if (hours < 24) {
            return `${hours} hr ago`;
        } else {
            return timestamp.toLocaleDateString();
        }
    }

    getModelDisplayName(model) {
        const names = {
            'claude': 'Claude',
            'kimi': 'Kimi',
            'qwen': 'Qwen',
            'glm': 'GLM'
        };
        return names[model] || model;
    }

    formatTime(timestamp) {
        return timestamp.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const modal = document.getElementById('taskModal');
        const taskDetails = document.getElementById('taskDetails');
        
        taskDetails.innerHTML = `
            <div class="task-detail-info">
                <h4>任务 #${task.id}</h4>
                <p><strong>模型:</strong> ${this.getModelDisplayName(task.model)}</p>
                <p><strong>创建时间:</strong> ${task.timestamp.toLocaleString('zh-CN')}</p>
                <p><strong>状态:</strong> <span class="status-${task.status}">${task.status === 'completed' ? '已完成' : task.status === 'running' ? '进行中' : '待执行'}</span></p>
            </div>
            <div class="task-detail-command">
                <h5>指令内容:</h5>
                <pre>${task.command}</pre>
            </div>
            ${task.result ? `
                <div class="task-detail-result">
                    <h5>执行结果:</h5>
                    <div class="result-content">${task.result}</div>
                </div>
            ` : ''}
        `;

        modal.style.display = 'block';

        // Simulate real-time updates for running tasks
        if (task.status === 'running') {
            this.simulateTaskProgress();
        }
    }

    simulateTaskProgress() {
        const progressBar = document.querySelector('.modal .progress-fill');
        const progressText = document.querySelector('.modal .progress-text');
        
        if (!progressBar || !progressText) return;

        const steps = [
            "初始化沙箱环境...",
            "拉取代码仓库...",
            "调用 Claude Code...",
            "生成代码中...",
            "运行测试...",
            "完成任务"
        ];

        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < steps.length) {
                progressText.textContent = steps[currentStep];
                progressBar.style.width = `${(currentStep + 1) * (100 / steps.length)}%`;
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 1500);
    }

    renameTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newName = prompt('请输入新的任务名称:', task.command.substring(0, 50));
        if (newName && newName.trim()) {
            task.command = newName.trim();
            this.renderTaskList();
            this.showNotification('任务重命名成功', 'success');
        }
    }

    deleteTask(taskId) {
        if (confirm('确定要删除这个任务吗？')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.renderTaskList();
            this.showNotification('任务已删除', 'info');
        }
    }

    closeTaskModal() {
        document.getElementById('taskModal').style.display = 'none';
    }

    triggerFileUpload() {
        document.getElementById('fileInput').click();
    }

    triggerImageUpload() {
        document.getElementById('imageInput').click();
    }

    showRegister() {
        this.showNotification('注册功能即将上线，敬请期待！', 'info');
    }
}

// File upload handlers
function triggerFileUpload() {
    demo.triggerFileUpload();
}

function triggerImageUpload() {
    demo.triggerImageUpload();
}

function executeTask() {
    demo.executeTask();
}

function closeTaskModal() {
    demo.closeTaskModal();
}

function showRegister() {
    demo.showRegister();
}

function startVoiceInput() {
    demo.showNotification('语音输入功能开发中...', 'info');
}

// Initialize demo when page loads
let demo;
document.addEventListener('DOMContentLoaded', () => {
    demo = new CodeSphereDemo();
    
    // Add some sample tasks for demonstration to match reference design
    setTimeout(() => {
        // Add a completed task from "today"
        const completedTask = {
            id: demo.taskIdCounter++,
            command: 'Create interactive product demo site from design prototype and requirements',
            status: 'completed',
            model: 'sonnet',
            timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            progress: 100,
            result: '成功创建了交互式产品演示网站，包含完整的UI组件和功能'
        };
        demo.tasks.unshift(completedTask);

        // Add another completed task
        const scriptTask = {
            id: demo.taskIdCounter++,
            command: 'Script to Retrieve CPU Core Count',
            status: 'completed',
            model: 'sonnet',
            timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
            progress: 100,
            result: '成功生成了获取CPU核心数量的脚本'
        };
        demo.tasks.unshift(scriptTask);

        demo.renderTaskList();
    }, 500);
});

// Handle file uploads
document.addEventListener('change', (e) => {
    if (e.target.id === 'fileInput' || e.target.id === 'imageInput') {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const fileNames = files.map(f => f.name).join(', ');
            demo.showNotification(`已选择文件: ${fileNames}`, 'success');
        }
    }
});

// Modal click outside to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('taskModal');
    if (e.target === modal) {
        demo.closeTaskModal();
    }
});