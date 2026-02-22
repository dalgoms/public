/**
 * Command Palette (Ctrl+K / Cmd+K)
 * Figma-style contextual command system
 */

class CommandPalette {
    constructor() {
        this.overlay = document.getElementById('command-palette-overlay');
        this.palette = document.getElementById('command-palette');
        this.searchInput = document.getElementById('command-search');
        this.contextEl = document.getElementById('command-context');
        this.listEl = document.getElementById('command-list');
        
        this.isOpen = false;
        this.selectedIndex = 0;
        this.commands = [];
        this.filteredCommands = [];
        
        this.init();
    }
    
    init() {
        this.bindKeyboardShortcut();
        this.bindEvents();
    }
    
    bindKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            
            // Escape to close
            if (e.key === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.close();
            }
        });
    }
    
    bindEvents() {
        // Click outside to close
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        // Search input
        this.searchInput?.addEventListener('input', () => {
            this.filterCommands(this.searchInput.value);
        });
        
        // Keyboard navigation
        this.searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectPrev();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeSelected();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.overlay?.classList.add('active');
        this.searchInput.value = '';
        this.selectedIndex = 0;
        
        // Build contextual commands
        this.buildCommands();
        this.renderContext();
        this.renderCommands();
        
        // Focus search
        setTimeout(() => this.searchInput?.focus(), 50);
    }
    
    close() {
        this.isOpen = false;
        this.overlay?.classList.remove('active');
    }
    
    getContext() {
        const activeEl = window.editorState?.activeElement;
        const selectedElements = window.toolbarController?.selectedElements || [];
        const isGroupMode = window.toolbarController?.isGroupMode;
        
        if (isGroupMode && selectedElements.length > 1) {
            return {
                type: 'multiple',
                count: selectedElements.length,
                label: `${selectedElements.length}개 요소 선택됨`,
                icon: 'group'
            };
        }
        
        if (activeEl) {
            const typeLabels = {
                'background': '배경',
                'text': '텍스트',
                'shape': '도형',
                'image': '이미지'
            };
            return {
                type: activeEl.type,
                label: typeLabels[activeEl.type] || activeEl.type,
                element: activeEl,
                icon: activeEl.type
            };
        }
        
        return {
            type: 'none',
            label: '선택 없음',
            icon: 'none'
        };
    }
    
    buildCommands() {
        const context = this.getContext();
        this.commands = [];
        
        // Add commands based on context
        switch (context.type) {
            case 'text':
                this.addTextCommands();
                break;
            case 'background':
                this.addBackgroundCommands();
                break;
            case 'shape':
                this.addShapeCommands();
                break;
            case 'image':
                this.addImageCommands();
                break;
            case 'multiple':
                this.addMultipleSelectionCommands();
                break;
            default:
                this.addGeneralCommands();
        }
        
        // Always add general commands at the end
        this.addGlobalCommands();
        
        this.filteredCommands = [...this.commands];
    }
    
    addTextCommands() {
        this.commands.push(
            {
                group: '텍스트 스타일',
                items: [
                    {
                        id: 'font-size-increase',
                        title: '글자 크기 키우기',
                        desc: '폰트 사이즈 +10',
                        icon: 'type',
                        shortcut: ['⌘', '+'],
                        action: () => this.changeFontSize(10)
                    },
                    {
                        id: 'font-size-decrease',
                        title: '글자 크기 줄이기',
                        desc: '폰트 사이즈 -10',
                        icon: 'type',
                        shortcut: ['⌘', '-'],
                        action: () => this.changeFontSize(-10)
                    },
                    {
                        id: 'font-weight-bold',
                        title: '굵게',
                        desc: 'Font weight: Bold',
                        icon: 'bold',
                        shortcut: ['⌘', 'B'],
                        action: () => this.setFontWeight('700')
                    },
                    {
                        id: 'font-weight-normal',
                        title: '보통',
                        desc: 'Font weight: Regular',
                        icon: 'type',
                        action: () => this.setFontWeight('400')
                    }
                ]
            },
            {
                group: '텍스트 색상',
                items: [
                    {
                        id: 'color-white',
                        title: '흰색',
                        icon: 'circle',
                        iconColor: '#ffffff',
                        action: () => this.setTextColor('#ffffff')
                    },
                    {
                        id: 'color-black',
                        title: '검은색',
                        icon: 'circle',
                        iconColor: '#000000',
                        action: () => this.setTextColor('#000000')
                    },
                    {
                        id: 'color-yellow',
                        title: '강조 (노란색)',
                        icon: 'circle',
                        iconColor: '#d4ff00',
                        action: () => this.setTextColor('#d4ff00')
                    },
                    {
                        id: 'color-blue',
                        title: '파란색',
                        icon: 'circle',
                        iconColor: '#3b82f6',
                        action: () => this.setTextColor('#3b82f6')
                    }
                ]
            },
            {
                group: '텍스트 변환',
                items: [
                    {
                        id: 'text-uppercase',
                        title: '대문자로 변환',
                        desc: 'UPPERCASE',
                        icon: 'arrow-up',
                        action: () => this.transformText('uppercase')
                    },
                    {
                        id: 'text-lowercase',
                        title: '소문자로 변환',
                        desc: 'lowercase',
                        icon: 'arrow-down',
                        action: () => this.transformText('lowercase')
                    }
                ]
            },
            {
                group: '텍스트 정렬',
                items: [
                    {
                        id: 'align-left',
                        title: '왼쪽 정렬',
                        icon: 'align-left',
                        action: () => this.setTextAlign('left')
                    },
                    {
                        id: 'align-center',
                        title: '가운데 정렬',
                        icon: 'align-center',
                        action: () => this.setTextAlign('center')
                    },
                    {
                        id: 'align-right',
                        title: '오른쪽 정렬',
                        icon: 'align-right',
                        action: () => this.setTextAlign('right')
                    }
                ]
            }
        );
    }
    
    addBackgroundCommands() {
        this.commands.push(
            {
                group: '배경 채우기',
                items: [
                    {
                        id: 'bg-solid',
                        title: '단색으로 변경',
                        desc: 'Solid color fill',
                        icon: 'square',
                        action: () => this.setBackgroundType('solid')
                    },
                    {
                        id: 'bg-gradient',
                        title: '그라데이션으로 변경',
                        desc: 'Gradient fill',
                        icon: 'gradient',
                        action: () => this.setBackgroundType('gradient')
                    },
                    {
                        id: 'bg-image',
                        title: '이미지로 변경',
                        desc: 'Image fill',
                        icon: 'image',
                        action: () => this.setBackgroundType('image')
                    }
                ]
            },
            {
                group: '배경 색상 프리셋',
                items: [
                    {
                        id: 'bg-dark',
                        title: '어두운 배경',
                        icon: 'circle',
                        iconColor: '#171717',
                        action: () => this.setBackgroundColor('#171717')
                    },
                    {
                        id: 'bg-navy',
                        title: '네이비 배경',
                        icon: 'circle',
                        iconColor: '#1a365d',
                        action: () => this.setBackgroundColor('#1a365d')
                    },
                    {
                        id: 'bg-blue',
                        title: '블루 그라데이션',
                        icon: 'gradient',
                        action: () => this.setBackgroundGradient('#001D61', '#003C8A')
                    },
                    {
                        id: 'bg-sunset',
                        title: '선셋 그라데이션',
                        icon: 'gradient',
                        action: () => this.setBackgroundGradient('#f12711', '#f5af19')
                    }
                ]
            }
        );
    }
    
    addShapeCommands() {
        this.commands.push(
            {
                group: '도형 스타일',
                items: [
                    {
                        id: 'shape-color-blue',
                        title: '파란색으로 변경',
                        icon: 'circle',
                        iconColor: '#3b82f6',
                        action: () => this.setShapeColor('#3b82f6')
                    },
                    {
                        id: 'shape-color-green',
                        title: '초록색으로 변경',
                        icon: 'circle',
                        iconColor: '#10b981',
                        action: () => this.setShapeColor('#10b981')
                    },
                    {
                        id: 'shape-color-yellow',
                        title: '노란색으로 변경',
                        icon: 'circle',
                        iconColor: '#d4ff00',
                        action: () => this.setShapeColor('#d4ff00')
                    }
                ]
            },
            {
                group: '도형 위치',
                items: [
                    {
                        id: 'shape-center',
                        title: '캔버스 중앙으로',
                        icon: 'center',
                        action: () => this.centerElement()
                    },
                    {
                        id: 'shape-delete',
                        title: '삭제',
                        icon: 'trash',
                        shortcut: ['Del'],
                        action: () => this.deleteElement()
                    }
                ]
            }
        );
    }
    
    addImageCommands() {
        this.commands.push(
            {
                group: '이미지',
                items: [
                    {
                        id: 'image-center',
                        title: '캔버스 중앙으로',
                        icon: 'center',
                        action: () => this.centerElement()
                    },
                    {
                        id: 'image-fit',
                        title: '캔버스에 맞추기',
                        icon: 'maximize',
                        action: () => this.fitToCanvas()
                    },
                    {
                        id: 'image-delete',
                        title: '삭제',
                        icon: 'trash',
                        shortcut: ['Del'],
                        action: () => this.deleteElement()
                    }
                ]
            }
        );
    }
    
    addMultipleSelectionCommands() {
        this.commands.push(
            {
                group: '정렬',
                items: [
                    {
                        id: 'align-h-center',
                        title: '가로 중앙 정렬',
                        icon: 'align-center-h',
                        action: () => this.alignElements('center-h')
                    },
                    {
                        id: 'align-v-center',
                        title: '세로 중앙 정렬',
                        icon: 'align-center-v',
                        action: () => this.alignElements('center-v')
                    },
                    {
                        id: 'align-left',
                        title: '왼쪽 정렬',
                        icon: 'align-left',
                        action: () => this.alignElements('left')
                    },
                    {
                        id: 'align-right',
                        title: '오른쪽 정렬',
                        icon: 'align-right',
                        action: () => this.alignElements('right')
                    }
                ]
            },
            {
                group: '분배',
                items: [
                    {
                        id: 'distribute-h',
                        title: '가로 균등 분배',
                        icon: 'distribute-h',
                        action: () => this.distributeElements('horizontal')
                    },
                    {
                        id: 'distribute-v',
                        title: '세로 균등 분배',
                        icon: 'distribute-v',
                        action: () => this.distributeElements('vertical')
                    }
                ]
            },
            {
                group: '그룹',
                items: [
                    {
                        id: 'group',
                        title: '그룹화',
                        shortcut: ['⌘', 'G'],
                        icon: 'group',
                        action: () => this.groupElements()
                    }
                ]
            }
        );
    }
    
    addGeneralCommands() {
        this.commands.push(
            {
                group: '캔버스',
                items: [
                    {
                        id: 'add-text',
                        title: '텍스트 추가',
                        icon: 'type',
                        shortcut: ['T'],
                        action: () => this.addElement('text')
                    },
                    {
                        id: 'add-shape',
                        title: '도형 추가',
                        icon: 'square',
                        shortcut: ['R'],
                        action: () => this.addElement('shape')
                    }
                ]
            }
        );
    }
    
    addGlobalCommands() {
        this.commands.push(
            {
                group: '일반',
                items: [
                    {
                        id: 'zoom-fit',
                        title: '화면에 맞추기',
                        icon: 'maximize',
                        action: () => this.zoomFit()
                    },
                    {
                        id: 'zoom-100',
                        title: '100%로 보기',
                        icon: 'zoom',
                        action: () => this.zoomTo(100)
                    }
                ]
            }
        );
    }
    
    // ============================================
    // RENDERING
    // ============================================
    
    renderContext() {
        const context = this.getContext();
        const icons = this.getContextIcon(context.icon);
        
        this.contextEl.innerHTML = `
            <div class="command-context-icon">${icons}</div>
            <span class="command-context-label">${context.label}</span>
            <span class="command-context-type">${context.type}</span>
        `;
    }
    
    getContextIcon(type) {
        const icons = {
            text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M12 4v16"/></svg>',
            background: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
            shape: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
            image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
            group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
            multiple: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
            none: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
        };
        return icons[type] || icons.none;
    }
    
    renderCommands() {
        let html = '';
        let itemIndex = 0;
        
        this.filteredCommands.forEach(group => {
            html += `<div class="command-group">`;
            html += `<div class="command-group-title">${group.group}</div>`;
            
            group.items.forEach(item => {
                const isSelected = itemIndex === this.selectedIndex;
                const iconHtml = this.getItemIcon(item);
                const shortcutHtml = item.shortcut ? 
                    `<div class="command-item-shortcut">${item.shortcut.map(k => `<kbd>${k}</kbd>`).join('')}</div>` : '';
                
                html += `
                    <div class="command-item ${isSelected ? 'selected' : ''}" 
                         data-index="${itemIndex}" 
                         data-id="${item.id}">
                        <div class="command-item-icon" ${item.iconColor ? `style="background:${item.iconColor}"` : ''}>
                            ${iconHtml}
                        </div>
                        <div class="command-item-content">
                            <div class="command-item-title">${item.title}</div>
                            ${item.desc ? `<div class="command-item-desc">${item.desc}</div>` : ''}
                        </div>
                        ${shortcutHtml}
                    </div>
                `;
                itemIndex++;
            });
            
            html += `</div>`;
        });
        
        if (itemIndex === 0) {
            html = `<div class="command-empty">일치하는 명령어가 없습니다</div>`;
        }
        
        this.listEl.innerHTML = html;
        
        // Bind click events
        this.listEl.querySelectorAll('.command-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectedIndex = parseInt(item.dataset.index);
                this.executeSelected();
            });
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = parseInt(item.dataset.index);
                this.updateSelection();
            });
        });
    }
    
    getItemIcon(item) {
        const icons = {
            type: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M12 4v16"/></svg>',
            bold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>',
            circle: `<svg viewBox="0 0 24 24" fill="${item.iconColor || 'currentColor'}"><circle cx="12" cy="12" r="8"/></svg>`,
            square: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
            gradient: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/></svg>',
            image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
            'align-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>',
            'align-center': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
            'align-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>',
            'align-center-h': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><rect x="4" y="6" width="16" height="4"/><rect x="6" y="14" width="12" height="4"/></svg>',
            'align-center-v': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="22" y2="12"/><rect x="6" y="4" width="4" height="16"/><rect x="14" y="6" width="4" height="12"/></svg>',
            'distribute-h': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="4" height="14"/><rect x="10" y="7" width="4" height="10"/><rect x="16" y="5" width="4" height="14"/></svg>',
            'distribute-v': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="4" width="14" height="4"/><rect x="7" y="10" width="10" height="4"/><rect x="5" y="16" width="14" height="4"/></svg>',
            group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
            center: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>',
            trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
            maximize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
            zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
            'arrow-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>',
            'arrow-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>'
        };
        return icons[item.icon] || icons.square;
    }
    
    // ============================================
    // NAVIGATION
    // ============================================
    
    filterCommands(query) {
        if (!query.trim()) {
            this.filteredCommands = [...this.commands];
        } else {
            const q = query.toLowerCase();
            this.filteredCommands = this.commands.map(group => {
                const filteredItems = group.items.filter(item => 
                    item.title.toLowerCase().includes(q) ||
                    (item.desc && item.desc.toLowerCase().includes(q))
                );
                return filteredItems.length > 0 ? { ...group, items: filteredItems } : null;
            }).filter(Boolean);
        }
        
        this.selectedIndex = 0;
        this.renderCommands();
    }
    
    selectNext() {
        const totalItems = this.getTotalItems();
        if (totalItems === 0) return;
        
        this.selectedIndex = (this.selectedIndex + 1) % totalItems;
        this.updateSelection();
    }
    
    selectPrev() {
        const totalItems = this.getTotalItems();
        if (totalItems === 0) return;
        
        this.selectedIndex = (this.selectedIndex - 1 + totalItems) % totalItems;
        this.updateSelection();
    }
    
    getTotalItems() {
        return this.filteredCommands.reduce((sum, group) => sum + group.items.length, 0);
    }
    
    updateSelection() {
        this.listEl.querySelectorAll('.command-item').forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
        
        // Scroll into view
        const selectedItem = this.listEl.querySelector('.command-item.selected');
        selectedItem?.scrollIntoView({ block: 'nearest' });
    }
    
    executeSelected() {
        let currentIndex = 0;
        for (const group of this.filteredCommands) {
            for (const item of group.items) {
                if (currentIndex === this.selectedIndex) {
                    this.close();
                    item.action?.();
                    return;
                }
                currentIndex++;
            }
        }
    }
    
    // ============================================
    // ACTIONS
    // ============================================
    
    changeFontSize(delta) {
        const activeEl = window.editorState?.activeElement;
        if (!activeEl || activeEl.type !== 'text') return;
        
        const currentSize = activeEl.styles?.fontSize || 50;
        const newSize = Math.max(10, Math.min(200, currentSize + delta));
        
        window.editorState.updateActiveStyle('fontSize', newSize);
        
        // Sync UI
        const fontSizeInput = document.getElementById('font-size');
        if (fontSizeInput) fontSizeInput.value = newSize;
    }
    
    setFontWeight(weight) {
        window.editorState?.updateActiveStyle('fontWeight', weight);
        
        const weightSelect = document.getElementById('font-weight');
        if (weightSelect) weightSelect.value = weight;
    }
    
    setTextColor(color) {
        window.editorState?.updateActiveStyle('fillColor', color);
        
        const colorInput = document.getElementById('fill-color-solid');
        if (colorInput) colorInput.value = color;
    }
    
    transformText(transform) {
        const activeEl = window.editorState?.activeElement;
        if (!activeEl || !activeEl.element) return;
        
        const el = activeEl.element;
        if (transform === 'uppercase') {
            el.textContent = el.textContent.toUpperCase();
        } else if (transform === 'lowercase') {
            el.textContent = el.textContent.toLowerCase();
        }
    }
    
    setTextAlign(align) {
        window.editorState?.updateActiveStyle('textAlign', align);
        
        document.querySelectorAll('[data-align]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === align);
        });
    }
    
    setBackgroundType(type) {
        const bgObj = window.editorState?.getObject('background');
        if (!bgObj) return;
        
        window.editorState.updateActiveStyle('fillType', type);
        
        // Click the appropriate tab
        const tab = document.querySelector(`.fill-type-tab[data-fill-type="${type}"]`);
        tab?.click();
    }
    
    setBackgroundColor(color) {
        this.setBackgroundType('solid');
        window.editorState?.updateActiveStyle('fillColor', color);
    }
    
    setBackgroundGradient(start, end) {
        this.setBackgroundType('gradient');
        window.editorState?.updateActiveStyle('gradientStart', start);
        window.editorState?.updateActiveStyle('gradientEnd', end);
    }
    
    setShapeColor(color) {
        window.editorState?.updateActiveStyle('fillColor', color);
    }
    
    centerElement() {
        window.figmaPanelController?.alignActiveElement('center-h');
        window.figmaPanelController?.alignActiveElement('center-v');
    }
    
    deleteElement() {
        const activeEl = window.editorState?.activeElement;
        if (!activeEl || activeEl.type === 'background') return;
        
        window.editorState.removeLayer(activeEl.id);
    }
    
    fitToCanvas() {
        // Fit selected element to canvas
        const activeEl = window.editorState?.activeElement;
        if (!activeEl || !activeEl.element) return;
        
        const frameSize = window.figmaPanelController?.getFrameSize() || { width: 540, height: 540 };
        activeEl.element.style.width = frameSize.width + 'px';
        activeEl.element.style.height = frameSize.height + 'px';
        activeEl.element.style.left = '0px';
        activeEl.element.style.top = '0px';
    }
    
    alignElements(direction) {
        window.figmaPanelController?.alignActiveElement(direction);
    }
    
    distributeElements(direction) {
        // Distribute selected elements
        const selectedElements = window.toolbarController?.selectedElements || [];
        if (selectedElements.length < 3) return;
        
        const elements = selectedElements.map(el => ({
            el,
            rect: el.getBoundingClientRect()
        }));
        
        if (direction === 'horizontal') {
            elements.sort((a, b) => a.rect.left - b.rect.left);
            const minX = elements[0].rect.left;
            const maxX = elements[elements.length - 1].rect.left;
            const spacing = (maxX - minX) / (elements.length - 1);
            
            elements.forEach((item, i) => {
                if (i > 0 && i < elements.length - 1) {
                    const newLeft = minX + (spacing * i) - item.el.parentElement.getBoundingClientRect().left;
                    item.el.style.left = newLeft + 'px';
                }
            });
        } else {
            elements.sort((a, b) => a.rect.top - b.rect.top);
            const minY = elements[0].rect.top;
            const maxY = elements[elements.length - 1].rect.top;
            const spacing = (maxY - minY) / (elements.length - 1);
            
            elements.forEach((item, i) => {
                if (i > 0 && i < elements.length - 1) {
                    const newTop = minY + (spacing * i) - item.el.parentElement.getBoundingClientRect().top;
                    item.el.style.top = newTop + 'px';
                }
            });
        }
    }
    
    groupElements() {
        // Group functionality - select all elements as a frame
        window.toolbarController?.selectAllElements();
    }
    
    addElement(type) {
        if (type === 'text') {
            window.toolbarController?.createTextElement();
        } else if (type === 'shape') {
            window.toolbarController?.createShapeElement();
        }
    }
    
    zoomFit() {
        // Fit canvas to view
        document.querySelector('[data-action="fit"]')?.click();
    }
    
    zoomTo(level) {
        // Set zoom to specific level
        const zoomDisplay = document.getElementById('zoom-level');
        if (zoomDisplay) zoomDisplay.textContent = level + '%';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.commandPalette = new CommandPalette();
});
