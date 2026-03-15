import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Mic, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  processVoiceCommand,
  runTests,
  TEST_CASES,
  type VoiceCommandResult,
} from "@/lib/voiceProcessor";
import { useLocation } from "wouter";

declare global {
  interface Window {
    SpeechRecognition: unknown;
    webkitSpeechRecognition: unknown;
  }
}

export default function VoiceTest() {
  const [, setLocation] = useLocation();
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<VoiceCommandResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [testResults, setTestResults] = useState<ReturnType<
    typeof runTests
  > | null>(null);
  const [showDebug, setShowDebug] = useState(true);

  const handleTestCommand = (input: string) => {
    const result = processVoiceCommand(input);
    setTestResult(result);
    setTestInput(input);
  };

  const runAllTests = () => {
    const results = runTests();
    setTestResults(results);
  };

  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const recognition = new (SpeechRecognitionAPI as any)();
    recognition.lang = "es-AR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleTestCommand(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation("/")}
            className="text-zinc-400 hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-zinc-800"
            title="Volver al juego"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
            Pruebas de Voz
          </h1>
        </div>

        {/* Manual Test Section */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Prueba Manual</h2>

          <div className="space-y-4">
            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Ingresa un comando de voz:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Ej: cuatro al seis, escalera servida..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
                <button
                  onClick={() => handleTestCommand(testInput)}
                  className="bg-emerald-500 text-zinc-950 px-6 py-3 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
                >
                  Probar
                </button>
              </div>
            </div>

            {/* Voice Input Button */}
            <button
              onClick={startListening}
              disabled={isListening}
              className={cn(
                "w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-blue-500 text-white hover:bg-blue-400"
              )}
            >
              <Mic className="w-5 h-5" />
              {isListening ? "Escuchando..." : "Usar Micrófono"}
            </button>
          </div>

          {/* Test Result */}
          <AnimatePresence>
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
                      Categoría
                    </p>
                    <p className="text-lg font-bold text-white">
                      {testResult.category || "No detectada"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
                      Puntuación
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      {testResult.score !== null ? `${testResult.score} pts` : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
                    Confianza
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-zinc-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                          width: `${Math.round(testResult.confidence * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-300">
                      {Math.round(testResult.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {showDebug && (
                  <div className="mt-4 p-3 bg-zinc-900 rounded border border-zinc-700">
                    <p className="text-xs text-zinc-400 font-mono">
                      {testResult.debugInfo}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Test Cases Section */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Casos de Prueba</h2>
            <button
              onClick={runAllTests}
              className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-400 transition-colors text-sm"
            >
              Ejecutar Todas
            </button>
          </div>

          {/* Test Results Summary */}
          {testResults && (
            <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {testResults.passed + testResults.failed}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-500 font-semibold mb-1">
                    Pasadas
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {testResults.passed}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-red-500 font-semibold mb-1">
                    Fallidas
                  </p>
                  <p className="text-2xl font-bold text-red-400">
                    {testResults.failed}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Cases List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {(testResults?.results || TEST_CASES.map((tc) => ({
              input: tc.input,
              expected: { category: tc.expectedCategory, score: tc.expectedScore },
              actual: { category: null, score: null },
              passed: false,
            }))).map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  result.passed
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : testResults
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-zinc-800/30 border-zinc-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {result.passed ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : testResults ? (
                      <X className="w-5 h-5 text-red-400" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm font-bold text-white mb-2">
                      {result.input}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-zinc-500 mb-1">Esperado:</p>
                        <p className="text-zinc-300">
                          {result.expected.category || "N/A"} /{" "}
                          {result.expected.score !== null
                            ? `${result.expected.score} pts`
                            : "N/A"}
                        </p>
                      </div>
                      {testResults && (
                        <div>
                          <p className="text-zinc-500 mb-1">Obtenido:</p>
                          <p
                            className={cn(
                              result.passed
                                ? "text-emerald-400"
                                : "text-red-400"
                            )}
                          >
                            {result.actual.category || "N/A"} /{" "}
                            {result.actual.score !== null
                              ? `${result.actual.score} pts`
                              : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Debug Toggle */}
        <div className="mt-8 flex items-center gap-2">
          <input
            type="checkbox"
            id="debug-toggle"
            checked={showDebug}
            onChange={(e) => setShowDebug(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 cursor-pointer"
          />
          <label htmlFor="debug-toggle" className="text-sm text-zinc-400 cursor-pointer">
            Mostrar información de depuración
          </label>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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
      `,
      }} />
    </div>
  );
}
