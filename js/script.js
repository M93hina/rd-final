// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-list a');

    // モバイルナビゲーションのトグル機能
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // メニューアイコンの状態更新
            const icon = navToggle.querySelector('.nav-toggle-icon');
            if (icon) {
                icon.style.transform = navList.classList.contains('active') 
                    ? 'rotate(90deg)' 
                    : 'rotate(0deg)';
            }
            
            // アクセシビリティ対応
            const isExpanded = navList.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            navToggle.setAttribute('aria-label', isExpanded ? 'メニューを閉じる' : 'メニューを開く');
        });
    }

    // ナビゲーションリンクのクリック時にモバイルメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navList.classList.contains('active')) {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'メニューを開く');
                
                // メニューアイコンのリセット
                const icon = navToggle.querySelector('.nav-toggle-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // ヘッダーのスクロール時の挙動
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // スクロール方向の検出
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 下スクロール時（ヘッダーを隠す）
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上スクロール時（ヘッダーを表示）
            header.style.transform = 'translateY(0)';
        }
        
        // スクロール位置に応じてヘッダーの背景を変更
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#fff';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });


    // ページトップへ戻るボタンの実装
    const createScrollTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-top-btn';
        button.setAttribute('aria-label', 'ページトップへ戻る');
        
        // スタイルの適用
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #2563eb;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        // クリック時の動作
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // スクロール時の表示/非表示
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });
        
        document.body.appendChild(button);
    };

    // ページトップボタンの作成
    createScrollTopButton();

    // フォーカス管理（アクセシビリティ向上）
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );

    // Tabキーでのフォーカス移動を改善
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        
        // Escapeキーでモバイルメニューを閉じる
        if (e.key === 'Escape' && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    });

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', function() {
        // モバイルメニューが開いている状態でデスクトップサイズになった場合
        if (window.innerWidth > 768 && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            
            // メニューアイコンのリセット
            const icon = navToggle.querySelector('.nav-toggle-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    });

    // アコーディオン機能
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            // 他のアコーディオンを閉じる
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    otherItem.querySelector('.accordion-content').style.padding = '0 1.5rem';
                }
            });

            // クリックしたアコーディオンの開閉
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '1.5rem';
            } else {
                content.style.maxHeight = null;
                content.style.padding = '0 1.5rem';
            }
        });
    });
});

