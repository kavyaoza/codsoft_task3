import random
import math
from copy import deepcopy

class AIPlayer:
    @staticmethod
    def get_ai_move(board, ai_symbol, difficulty='hard'):
        """
        board: list of 9 elements ("" or "X" or "O")
        ai_symbol: "O" or "X"
        difficulty: 'easy', 'medium', 'hard'
        """
        if difficulty == 'easy':
            return AIPlayer.easy_move(board)
        elif difficulty == 'medium':
            return AIPlayer.medium_move(board, ai_symbol)
        else:
            return AIPlayer.hard_move(board, ai_symbol)

    @staticmethod
    def easy_move(board):
        available = [i for i, v in enumerate(board) if v == ""]
        return random.choice(available) if available else None

    @staticmethod
    def medium_move(board, ai_symbol):
        # 1) Win if possible
        for i in range(9):
            if board[i] == "":
                temp = board.copy()
                temp[i] = ai_symbol
                if AIPlayer.check_winner(temp, ai_symbol):
                    return i
        # 2) Block opponent
        opponent = "X" if ai_symbol == "O" else "O"
        for i in range(9):
            if board[i] == "":
                temp = board.copy()
                temp[i] = opponent
                if AIPlayer.check_winner(temp, opponent):
                    return i
        # 3) Take center
        if board[4] == "":
            return 4
        # 4) Take corner if available
        corners = [0, 2, 6, 8]
        random.shuffle(corners)
        for c in corners:
            if board[c] == "":
                return c
        # 5) fallback edge
        edges = [1, 3, 5, 7]
        random.shuffle(edges)
        for e in edges:
            if board[e] == "":
                return e
        return None

    @staticmethod
    def hard_move(board, ai_symbol):
        # Use minimax (with alpha-beta) to pick the best move
        best_score = -math.inf
        best_move = None
        for i in range(9):
            if board[i] == "":
                board_copy = board.copy()
                board_copy[i] = ai_symbol
                score = AIPlayer.minimax(board_copy, False, ai_symbol, -math.inf, math.inf)
                if score > best_score:
                    best_score = score
                    best_move = i
        # If for some edge case best_move is None, fallback to medium_move
        if best_move is None:
            return AIPlayer.medium_move(board, ai_symbol)
        return best_move

    @staticmethod
    def minimax(board, is_maximizing, ai_symbol, alpha, beta):
        """
        Returns a score from perspective of ai_symbol.
        Terminal scores: +1 for ai win, -1 for opponent win, 0 for draw.
        """
        opponent = "X" if ai_symbol == "O" else "O"
        winner = None
        if AIPlayer.check_winner(board, ai_symbol):
            return 1
        if AIPlayer.check_winner(board, opponent):
            return -1
        if "" not in board:
            return 0

        if is_maximizing:
            max_eval = -math.inf
            for i in range(9):
                if board[i] == "":
                    board[i] = ai_symbol
                    eval = AIPlayer.minimax(board, False, ai_symbol, alpha, beta)
                    board[i] = ""
                    max_eval = max(max_eval, eval)
                    alpha = max(alpha, eval)
                    if beta <= alpha:
                        break
            return max_eval
        else:
            min_eval = math.inf
            for i in range(9):
                if board[i] == "":
                    board[i] = opponent
                    eval = AIPlayer.minimax(board, True, ai_symbol, alpha, beta)
                    board[i] = ""
                    min_eval = min(min_eval, eval)
                    beta = min(beta, eval)
                    if beta <= alpha:
                        break
            return min_eval

    @staticmethod
    def check_winner(board, player):
        win_conditions = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ]
        return any(all(board[i] == player for i in cond) for cond in win_conditions)
