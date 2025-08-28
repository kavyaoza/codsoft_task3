# 🎮 CODSOFT Internship -- Task: Tic Tac Toe Game

This project is created as part of my **CODSOFT AI Internship**.  
It is a **Tic Tac Toe Game** built using **Flask, HTML, CSS, and JavaScript** with both **PvP (Player vs Player)** and **PvC (Player vs Computer)** modes.

---

## 🚀 Features

-   🎲 **Game Modes:**
    -   Player vs Player (PvP)  
    -   Player vs Computer (PvC) with AI difficulty levels (Easy, Medium, Hard)
-   🌙 **Dark/Light Theme Toggle**
-   🔊 **Sound Effects** (toggleable)
-   🕒 **Timer & Move Counter**
-   📜 **Move History & Undo option**
-   🏆 **Scoreboard & Win-Streak**
-   🎉 **Win Highlight & Confetti Animation**
-   ⚡ Responsive and interactive UI

---

## 🛠️ Tech Stack

-   **Backend:** Flask (Python)  
-   **Frontend:** HTML, CSS, JavaScript  
-   **Libraries:** Flask (for server), Minimax algorithm for AI (optional)  

---

## 📂 Project Structure

```
Task1_TicTacToe/
│
├── app.py               # Flask backend
├── ai.py                # Optional AI logic (minimax with alpha-beta)
├── requirements.txt     # Dependencies
├── static/
│   ├── css/
│   │   └── style.css    # CSS styling
│   └── js/
│       └── script.js    # Game logic (frontend)
├── templates/
│   └── index.html       # Main UI
└── README.md            # Project documentation
```

---

## ⚙️ Installation & Setup

1. **Clone this repository**

    ```bash
    git clone https://github.com/kavyaoza/codsoft_task3
    cd codsoft_taskno/Task1_TicTacToe
    ```

2. **Create a virtual environment (optional)**

    ```bash
    python -m venv venv
    source venv/bin/activate   # Linux/Mac
    venv\Scripts\activate      # Windows
    ```

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask app**

    ```bash
    python app.py
    ```

5. **Open in browser**

    ```
    http://127.0.0.1:5000/
    ```

---

## 📊 How It Works

1. The **frontend (HTML, CSS, JS)** handles board rendering, moves, and animations.  
2. Users can select **PvP** or **PvC** mode.  
3. In **PvC mode**, the AI can play on three levels:
   - Easy → Random moves  
   - Medium → Mix of random & smart moves  
   - Hard → Optimal play using **Minimax algorithm with Alpha-Beta pruning**  
4. Game state is updated dynamically with:
   - Move counter  
   - Timer  
   - Undo option  
   - Scoreboard tracking  
5. Victory detection triggers:
   - Win highlight  
   - Confetti animation 🎉  

---

## 📦 Requirements

The dependencies for this project are listed in **requirements.txt**:

```txt
Flask==2.0.1
```

Install them with:

```bash
pip install -r requirements.txt
```

---
## 📸 Screenshots

### 🔹 Home Page (Before Upload)
![Home Page](assets/screenshot_home.png)

### 🔹 Uploaded Tic Tac Toe Game
![Result Page](assets/screenshot_result.png)


### 🔹 Uploaded Light Theme
![Light Theme Page](assets/screenshot_theme.png)

---

## 🎥 Demo Video
👉 [Watch Demo Video](https://www.linkedin.com)  


---

## ✅ Internship Requirement

-   Task completed as part of **CODSOFT AI Internship**  
-   Maintained proper **GitHub repository (codsoft_task3)**  
-   To be shared on **LinkedIn** tagging `@codsoft`  

---

## 👨‍💻 Author

-   Name: *Kavya Oza*  
-   Email: *kavyaoza54@gmail.com*  
-   GitHub: (https://github.com/kavyaoza)  
-   LinkedIn: (www.linkedin.com/in/kavya-oza-a64220295)  

---

