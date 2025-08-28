from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)

# from flask import Flask, render_template, request, jsonify
# from ai import AIPlayer

# app = Flask(__name__)

# # Persistent-ish game state
# board = [""] * 9
# current_player = "X"
# winner = None
# difficulty = "hard"
# scores = {"player": 0, "ai": 0, "draw": 0}

# @app.route('/')
# def home():
#     return render_template('index.html')

# @app.route('/start', methods=['POST'])
# def start_game():
#     global board, current_player, winner, difficulty
#     data = request.json or {}
#     difficulty = data.get('difficulty', 'hard')
#     ai_first = data.get('ai_first', False)

#     # Reset board & winner but keep scores
#     board = [""] * 9
#     winner = None
#     current_player = "O" if ai_first else "X"

#     # If AI goes first
#     if current_player == "O":
#         ai_move = AIPlayer.get_ai_move(board.copy(), "O", difficulty)
#         if ai_move is not None:
#             board[ai_move] = "O"
#             current_player = "X"

#     return jsonify({
#         'status': 'started',
#         'board': board,
#         'currentPlayer': current_player,
#         'gameMode': 'ai',
#         'scores': scores
#     })

# @app.route('/move', methods=['POST'])
# def make_move():
#     global board, current_player, winner, scores, difficulty
#     if winner:
#         return jsonify({'status': 'game_over', 'winner': winner, 'board': board})

#     data = request.json or {}
#     index = data.get('index')

#     if index is None or not (0 <= int(index) <= 8) or board[int(index)] != "":
#         return jsonify({'status': 'invalid'})

#     index = int(index)
#     board[index] = "X"

#     # Check human win
#     winning_cells = check_winner_cells('X')
#     if winning_cells:
#         winner = 'X'
#         scores['player'] += 1
#         return jsonify({'status': 'win', 'winner': 'X', 'board': board, 'winning_cells': winning_cells, 'scores': scores})

#     # Check draw
#     if "" not in board:
#         scores['draw'] += 1
#         return jsonify({'status': 'draw', 'board': board, 'scores': scores})

#     # AI move
#     ai_move = AIPlayer.get_ai_move(board.copy(), "O", difficulty)
#     if ai_move is not None:
#         board[ai_move] = "O"
#         winning_cells_ai = check_winner_cells('O')
#         if winning_cells_ai:
#             winner = 'O'
#             scores['ai'] += 1
#             return jsonify({'status': 'win', 'winner': 'O', 'board': board, 'winning_cells': winning_cells_ai, 'scores': scores})

#     if "" not in board:
#         scores['draw'] += 1
#         return jsonify({'status': 'draw', 'board': board, 'scores': scores})

#     return jsonify({'status': 'ai_turn', 'currentPlayer': 'X', 'board': board, 'scores': scores})

# @app.route('/reset', methods=['POST'])
# def reset_game():
#     global board, current_player, winner
#     board = [""] * 9
#     current_player = "X"
#     winner = None
#     return jsonify({'status': 'reset', 'board': board, 'scores': scores})

# @app.route('/reset_scores', methods=['POST'])
# def reset_scores():
#     global scores
#     scores = {"player": 0, "ai": 0, "draw": 0}
#     return jsonify({'status': 'scores_reset', 'scores': scores})

# def check_winner_cells(player):
#     win_conditions = [
#         [0, 1, 2], [3, 4, 5], [6, 7, 8],
#         [0, 3, 6], [1, 4, 7], [2, 5, 8],
#         [0, 4, 8], [2, 4, 6]
#     ]
#     for cond in win_conditions:
#         if all(board[i] == player for i in cond):
#             return cond
#     return None

# if __name__ == '__main__':
#     app.run(debug=True)
