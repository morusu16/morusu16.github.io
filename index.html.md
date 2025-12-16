---
created: 2025-12-16T22:45:14+09:00
modified: 2025-12-16T22:48:05+09:00
---

# index.html

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📚 勉強管理システム</title>
    <style>
        /* ここにスタイルを追加（次のステップで置き換えます） */
        body {
            font-family: sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .input-group {
            margin: 20px 0;
        }
        input, select, textarea {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 5px;
            width: 100%;
            font-size: 16px;
        }
        .task {
            background: #f9f9f9;
            padding: 10px;
            margin: 10px 0;
            border-left: 4px solid #4CAF50;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 勉強管理システム</h1>
        <p>これから機能を追加していきます！</p>
        
        <!-- クイック入力フォーム -->
        <div class="input-group">
            <input type="date" id="dateInput" value="">
            <select id="subjectInput">
                <option value="数学">数学</option>
                <option value="英語">英語</option>
                <option value="プログラミング">プログラミング</option>
            </select>
            <input type="text" id="taskInput" placeholder="勉強内容">
            <button onclick="addTask()">タスク追加</button>
        </div>
        
        <!-- タスク表示エリア -->
        <div id="taskList">
            <div class="task">
                サンプルタスク：最初のタスクを追加してみよう！
            </div>
        </div>
    </div>

    <script>
        // 今日の日付を設定
        document.getElementById('dateInput').valueAsDate = new Date();
        
        // タスク追加関数
        function addTask() {
            const date = document.getElementById('dateInput').value;
            const subject = document.getElementById('subjectInput').value;
            const task = document.getElementById('taskInput').value;
            
            if (!task) {
                alert('勉強内容を入力してください');
                return;
            }
            
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <strong>${subject}</strong> - ${task}
                <br><small>${date}</small>
                <button onclick="this.parentElement.remove()" style="float:right; background:red; padding:5px;">削除</button>
            `;
            
            document.getElementById('taskList').prepend(taskElement);
            document.getElementById('taskInput').value = '';
            
            // 成功メッセージ
            alert('タスクを追加しました！');
        }
        
        console.log('勉強管理システムが起動しました！');
    </script>
</body>
</html>
