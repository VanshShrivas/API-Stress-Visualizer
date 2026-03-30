import { useState, useEffect, useRef } from 'react';

export const useLoadTest = (testId, onComplete) => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState({ labels: [], throughput: [], success: [], error: [] });
  const timerRef = useRef(null);

  useEffect(() => {
    if (!testId) return;

    setError(null);
    setMetrics(null);
    setHistoryData({ labels: [], throughput: [], success: [], error: [] });

    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:3500/api/send-test-info/${testId}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        setMetrics(data);

        // If backend provides history
        if (data.history && data.history.length > 0) {
          const isRunning = data.status === 'running';
          const historySlice = isRunning ? data.history.slice(-20) : data.history;

          setHistoryData({
            labels: historySlice.map(h => new Date(h.timestamp).toLocaleTimeString()),
            throughput: historySlice.map(h => h.throughput),
            success: historySlice.map(h => h.successRate),
            error: historySlice.map(h => h.errorRate)
          });
        }

        // Only start polling if it's currently running
        if (data.status === 'running') {
          startPolling();
        } else {
            // Already finished, trigger completion if needed
            if (onComplete) onComplete();
        }
      } catch (err) {
        console.error("Initial fetch failed", err);
      }
    };

    const startPolling = () => {
      timerRef.current = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:3500/api/send-test-info/${testId}`);
          const data = await response.json();

          if (data.error) {
            setError(data.error);
            clearInterval(timerRef.current);
            return;
          }

          setMetrics(data);

          // For RUNNING tests, use frontend rolling logic (smoother animation)
          const timestamp = new Date().toLocaleTimeString();
          setHistoryData(prev => ({
            labels: [...prev.labels, timestamp].slice(-20),
            throughput: [...prev.throughput, data.throughput].slice(-20),
            success: [...prev.success, data.successRate].slice(-20),
            error: [...prev.error, data.errorRate].slice(-20)
          }));

          if (data.status !== 'running') {
            clearInterval(timerRef.current);
            // Final sync: Show full history now that testing is done
            if (data.history && data.history.length > 0) {
              setHistoryData({
                labels: data.history.map(h => new Date(h.timestamp).toLocaleTimeString()),
                throughput: data.history.map(h => h.throughput),
                success: data.history.map(h => h.successRate),
                error: data.history.map(h => h.errorRate)
              });
            }
            if (onComplete) onComplete();
          }
        } catch (err) {
          console.error("Polling failed", err);
        }
      }, 1000);
    };

    fetchInitialData();

    return () => clearInterval(timerRef.current);
  }, [testId]);

  return { metrics, historyData, error };
};