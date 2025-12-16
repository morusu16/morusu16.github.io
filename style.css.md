---
created: 2025-12-16T22:48:40+09:00
modified: 2025-12-16T22:50:12+09:00
---

# style.css

/* style.css - 完全版 */

/* 基本リセット */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    line-height: 1.6;
}

/* コンテナ */
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    overflow: hidden;
}

/* ヘッダー */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px 20px;
    text-align: center;
}

header h1 {
    font-size: 1.8rem;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.subtitle {
    opacity: 0.9;
    font-size: 0.9rem;
}

/* クイック入力セクション */
.quick-input {
    padding: 25px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
}

.input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

@media (max-width: 600px) {
    .input-grid {
        grid-template-columns: 1fr;
    }
}

.input-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

.input-group input,
.input-group select {
    width: 100%;
    padding: 14px;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s;
}

.input-group input:focus,
.input-group select:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 15px 0;
}

.checkbox-group input[type="checkbox"] {
    width: 20px;
    height: 20px;
}

.add-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* ダッシュボード */
.dashboard {
    padding: 25px;
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 25px;
}

@media (max-width: 600px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 15px;
    border: 1px solid #e0e0e0;
}

.stat-card h3 {
    color: #333;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.progress-circle {
    width: 120px;
    height: 120px;
    margin: 0 auto;
}

.task-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background: white;
    border-radius: 8px;
    border: 1px solid #eee;
}

/* タスクリスト */
.task-section {
    padding: 0 25px 25px;
}

.task-section h2 {
    margin-bottom: 20px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-item {
    background: white;
    padding: 18px;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    border-left: 5px solid #667eea;
    transition: all 0.3s;
}

.task-item:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.task-item.completed {
    border-left-color: #4CAF50;
    opacity: 0.8;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.task-subject {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
}

.task-date {
    color: #666;
    font-size: 0.85rem;
}

.task-content {
    font-size: 1.1rem;
    margin: 8px 0;
    color: #333;
}

.task-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 10px;
}

.action-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.complete-btn {
    background: #4CAF50;
    color: white;
}

.delete-btn {
    background: #ff6b6b;
    color: white;
}

/* フッター */
footer {
    background: #333;
    color: white;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #444;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
}

.icon-btn {
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.icon-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.1);
}

/* レスポンシブ調整 */
@media (max-width: 480px) {
    body {
        padding: 10px;
    }
    
    .container {
        border-radius: 15px;
    }
    
    .quick-input,
    .dashboard,
    .task-section {
        padding: 20px;
    }
    
    header h1 {
        font-size: 1.5rem;
    }
    
    .task-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}

/* アニメーション */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.task-item {
    animation: fadeIn 0.3s ease-out;
}

/* ユーティリティ */
.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}

.mt-10 {
    margin-top: 10px;
}

.mb-10 {
    margin-bottom: 10px;
}
