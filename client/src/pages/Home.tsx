"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Trash2, Trophy, X, ChevronLeft, PenLine, Mic, MicOff, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { processVoiceCommand, type Category } from "@/lib/voiceProcessor";
import { useLocation } from "wouter";

declare global {
  interface Window {
    SpeechRecognition: unknown;
    webkitSpeechRecognition: unknown;
  }
}

type Player = {
  id: string;
  name: string;
  scores: Partial<Record<Category, number>>;
};

const CATEGORY_NAMES: Record<Category, string> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  escalera: "Escalera",
  full: "Full",
  poker: "Póker",
  generala: "Generala",
  dobleGenerala: "Doble Gen.",
};

const VALID_SCORES: Record<Category, number[]> = {
  "1": [0, 1, 2, 3, 4, 5],
  "2": [0, 2, 4, 6, 8, 10],
  "3": [0, 3, 6, 9, 12, 15],
  "4": [0, 4, 8, 12, 16, 20],
  "5": [0, 5, 10, 15, 20, 25],
  "6": [0, 6, 12, 18, 24, 30],
  escalera: [0, 20, 25],
  full: [0, 30, 35],
  poker: [0, 40, 45],
  generala: [0, 50, 55],
  dobleGenerala: [0, 100, 105],
};

export default function GeneralaScorecard() {
  const [, setLocation] = useLocation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{
    playerId: string;
    category: Category;
  } | null>(null);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const recognitionRef = useRef<any>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 4000);
  };

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    
    const newId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    setPlayers((prev) => [
      ...prev,
      {
        id: newId,
        name: newPlayerName.trim(),
        scores: {},
      },
    ]);
    setNewPlayerName("");
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const startGame = () => {
    if (players.length > 0) {
      setCurrentPlayerIndex(0);
      setGameStarted(true);
    }
  };

  const resetGame = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar la partida? Todos los puntajes se perderán.")) {
      setPlayers(players.map((p) => ({ ...p, scores: {} })));
      setCurrentPlayerIndex(0);
    }
  };

  const backToSetup = () => {
    if (confirm("¿Volver al inicio? Los puntajes actuales se perderán.")) {
      setGameStarted(false);
      setPlayers(players.map((p) => ({ ...p, scores: {} })));
      setCurrentPlayerIndex(0);
    }
  };

  const setScore = (playerId: string, category: Category, score: number | null) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const newScores = { ...p.scores };
          if (score === null) {
            delete newScores[category];
          } else {
            newScores[category] = score;
          }
          return { ...p, scores: newScores };
        }
        return p;
      })
    );
    setSelectedCell(null);

    // Advance turn if a score was added for the current player
    if (score !== null && players[currentPlayerIndex]?.id === playerId) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  const getTotalScore = (player: Player) => {
    return Object.values(player.scores).reduce((sum, score) => sum + (score || 0), 0);
  };

  const getLeaderId = () => {
    if (players.length === 0) return null;
    const totals = players.map((p) => ({ id: p.id, total: getTotalScore(p) }));
    const maxTotal = Math.max(...totals.map((t) => t.total));
    if (maxTotal === 0) return null;
    const leaders = totals.filter((t) => t.total === maxTotal);
    return leaders.length === 1 ? leaders[0].id : null;
  };

  const processVoiceCommandAndApply = async (transcript: string) => {
    setIsProcessingVoice(true);
    try {
      // Use the improved voice processor
      const result = processVoiceCommand(transcript);
      
      let targetPlayer = players[currentPlayerIndex];

      // Check for player names in transcript
      const lowerTranscript = transcript.toLowerCase();
      for (const player of players) {
        if (lowerTranscript.includes(player.name.toLowerCase())) {
          targetPlayer = player;
          break;
        }
      }

      if (result.category && result.score !== null && targetPlayer) {
        const validScores = VALID_SCORES[result.category];
        if (validScores && validScores.includes(result.score)) {
          setScore(targetPlayer.id, result.category, result.score);
          const catName = CATEGORY_NAMES[result.category] || result.category;
          const confidence = Math.round(result.confidence * 100);
          const scoreDisplay = result.score === 0 ? "Tachado" : `${result.score} pts`;
          showToast(
            `✓ ${scoreDisplay} en ${catName} para ${targetPlayer.name} (${confidence}% confianza)`,
            "success"
          );
        } else {
          showToast(
            `Puntuación inválida para ${CATEGORY_NAMES[result.category]}: ${result.score}`,
            "error"
          );
        }
      } else {
        showToast(
          `No se pudo interpretar: "${transcript}". Usa frases como "cuatro al seis" o "tachar escalera".`,
          "error"
        );
      }

    } catch (error) {
      console.error(error);
      showToast("Hubo un error al procesar el comando de voz.", "error");
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new (SpeechRecognitionAPI as any)();
    recognitionRef.current = recognition;
    recognition.lang = 'es-AR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processVoiceCommandAndApply(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        showToast("Permiso de micrófono denegado. Por favor, permítelo en tu navegador.", "error");
      } else if (event.error !== 'aborted') {
        showToast("Error con el micrófono: " + event.error, "error");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const leaderId = getLeaderId();

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8 font-sans flex items-center justify-center">
        <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
              <PenLine className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Anotador</h1>
            <p className="text-zinc-400">Agrega a los jugadores para comenzar</p>
          </div>

          <form onSubmit={addPlayer} className="flex gap-2 mb-8">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nombre del jugador..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              maxLength={15}
            />
            <button
              type="submit"
              disabled={!newPlayerName.trim()}
              className="bg-emerald-500 text-zinc-950 px-4 py-3 rounded-xl font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -10 }}
                  className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 rounded-xl p-3"
                >
                  <span className="font-medium text-zinc-200">{player.name}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-zinc-500 hover:text-red-400 p-1 rounded-md hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
              {players.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-zinc-500 text-sm"
                >
                  No hay jugadores todavía.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={startGame}
            disabled={players.length === 0}
            className="w-full bg-emerald-500 text-zinc-950 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:shadow-none mb-3"
          >
            <Users className="w-5 h-5" />
            Comenzar Partida
          </button>

          <button
            onClick={() => setLocation("/voice-test")}
            className="w-full bg-blue-500/20 text-blue-400 py-3 rounded-xl font-bold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2 border border-blue-500/30"
          >
            <Zap className="w-4 h-4" />
            Pruebas de Voz
          </button>
        </div>
      </div>
    );
  }

  const selectedPlayer = players.find((p) => p.id === selectedCell?.playerId);
  const selectedCategoryName = selectedCell ? CATEGORY_NAMES[selectedCell.category] : "";
  const isNumberCategory = selectedCell ? ["1", "2", "3", "4", "5", "6"].includes(selectedCell.category) : false;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col relative">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={backToSetup}
              className="text-zinc-400 hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-zinc-800"
              title="Volver al inicio"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
              <PenLine className="w-5 h-5" />
              Anotador
            </h1>
          </div>
          <button
            onClick={resetGame}
            className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors"
          >
            Reiniciar
          </button>
        </div>
      </header>

      {/* Score Grid */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left min-w-max">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-zinc-900 border-b border-r border-zinc-800 p-4 w-32 md:w-48 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.5)]">
                      <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Categoría</span>
                    </th>
                    {players.map((player, index) => (
                      <th
                        key={player.id}
                        onClick={() => setCurrentPlayerIndex(index)}
                        className={cn(
                          "border-b border-zinc-800 p-4 min-w-[100px] md:min-w-[140px] text-center transition-colors cursor-pointer hover:bg-zinc-800/50",
                          currentPlayerIndex === index ? "bg-zinc-800/80" : leaderId === player.id ? "bg-emerald-500/5" : ""
                        )}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {currentPlayerIndex === index && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-full mb-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                              Turno
                            </span>
                          )}
                          {leaderId === player.id && currentPlayerIndex !== index && (
                            <Trophy className="w-4 h-4 text-emerald-400 mb-1" />
                          )}
                          <span className={cn(
                            "font-bold truncate w-full",
                            currentPlayerIndex === index ? "text-white" : leaderId === player.id ? "text-emerald-400" : "text-zinc-400"
                          )}>
                            {player.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(CATEGORY_NAMES) as Category[]).map((category) => (
                    <tr key={category} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="sticky left-0 z-10 bg-zinc-900 border-b border-r border-zinc-800 p-4 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.5)]">
                        <span className="font-medium text-zinc-300">{CATEGORY_NAMES[category]}</span>
                      </td>
                      {players.map((player, index) => {
                        const score = player.scores[category];
                        const isScored = score !== undefined;
                        const isScratched = score === 0;

                        return (
                          <td
                            key={`${player.id}-${category}`}
                            className={cn(
                              "border-b border-zinc-800 p-2 text-center transition-colors",
                              currentPlayerIndex === index ? "bg-zinc-800/20" : leaderId === player.id ? "bg-emerald-500/5" : ""
                            )}
                          >
                            <button
                              onClick={() => setSelectedCell({ playerId: player.id, category })}
                              className={cn(
                                "w-full h-12 rounded-lg flex items-center justify-center text-lg font-bold transition-all",
                                !isScored && "text-zinc-700 hover:bg-zinc-800 hover:text-zinc-400",
                                isScored && !isScratched && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                isScratched && "bg-red-500/10 text-red-400 border border-red-500/20 line-through decoration-2"
                              )}
                            >
                              {isScored ? (isScratched ? "0" : score) : "-"}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-zinc-950/50">
                    <td className="sticky left-0 z-10 bg-zinc-950 border-r border-zinc-800 p-4 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.5)]">
                      <span className="font-bold text-white uppercase tracking-wider">Total</span>
                    </td>
                    {players.map((player, index) => (
                      <td
                        key={`total-${player.id}`}
                        className={cn(
                          "p-4 text-center transition-colors",
                          currentPlayerIndex === index ? "bg-zinc-800/40" : leaderId === player.id ? "bg-emerald-500/5" : ""
                        )}
                      >
                        <span className={cn(
                          "text-2xl font-bold font-mono",
                          leaderId === player.id ? "text-emerald-400" : "text-white"
                        )}>
                          {getTotalScore(player)}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Voice Command FAB */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium max-w-[280px] text-center",
                toastType === "success" && "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
                toastType === "error" && "bg-red-500/20 text-red-300 border-red-500/50",
                toastType === "info" && "bg-zinc-800 text-white border-zinc-700"
              )}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessingVoice}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all",
            isListening ? "bg-red-500 text-white animate-pulse" :
            isProcessingVoice ? "bg-zinc-700 text-zinc-400" :
            "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:scale-105"
          )}
          title="Anotar por voz"
        >
          {isProcessingVoice ? <Loader2 className="w-7 h-7 animate-spin" /> :
           isListening ? <MicOff className="w-7 h-7" /> :
           <Mic className="w-7 h-7" />}
        </button>
      </div>

      {/* Input Modal */}
      <AnimatePresence>
        {selectedCell && selectedPlayer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCell(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 z-50 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-zinc-400 text-sm font-medium mb-1">{selectedPlayer.name}</h3>
                  <h2 className="text-2xl font-bold text-white">{selectedCategoryName}</h2>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-zinc-500 hover:text-white p-2 bg-zinc-800/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isNumberCategory ? (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((count) => {
                    const scoreValue = count * parseInt(selectedCell.category);
                    return (
                      <button
                        key={count}
                        onClick={() => setScore(selectedCell.playerId, selectedCell.category, scoreValue)}
                        className={cn(
                          "py-3 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1",
                          count === 0
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            : "bg-zinc-800 text-white hover:bg-emerald-500 hover:text-zinc-950 border border-zinc-700 hover:border-emerald-500"
                        )}
                      >
                        <span className="text-lg">{count === 0 ? "Tachar" : `${count} dado${count !== 1 ? 's' : ''}`}</span>
                        {count > 0 && <span className="text-xs opacity-70 font-normal">({scoreValue} pts)</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {VALID_SCORES[selectedCell.category].map((scoreValue) => {
                    const isZero = scoreValue === 0;
                    return (
                      <button
                        key={scoreValue}
                        onClick={() => setScore(selectedCell.playerId, selectedCell.category, scoreValue)}
                        className={cn(
                          "py-4 rounded-xl font-bold text-xl transition-all",
                          isZero
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            : "bg-zinc-800 text-white hover:bg-emerald-500 hover:text-zinc-950 border border-zinc-700 hover:border-emerald-500"
                        )}
                      >
                        {isZero ? "Tachar" : scoreValue}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedPlayer.scores[selectedCell.category] !== undefined && (
                <button
                  onClick={() => setScore(selectedCell.playerId, selectedCell.category, null)}
                  className="w-full py-3 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Borrar anotación
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 82, 91, 1);
        }
      `}} />
    </div>
  );
}
