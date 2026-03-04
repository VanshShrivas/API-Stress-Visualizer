import { useState, useEffect, useRef } from 'react';

export const useLoadTest = (testId, onComplete) => {
  const [metrics, setMetrics] = useState(null);
  const [historyData, setHistoryData] = useState({ labels: [], throughput: [], success: [], error: [] });
  const timerRef = useRef(null);

  useEffect(() => {
    if (!testId) return;

    setHistoryData({ labels: [], throughput: [], success: [], error: [] });

    timerRef.current = setInterval(async () => {
      try {
        // Demo fetch 
        const response = await fetch(`http://localhost:3500/api/send-test-info/${testId}`);
        const data = await response.json(); // { status, throughput, successRate, errorRate, etc. }

        const timestamp = new Date().toLocaleTimeString();

        setMetrics(data);
        setHistoryData(prev => ({
          labels: [...prev.labels, timestamp].slice(-20),
          throughput: [...prev.throughput, data.throughput].slice(-20),
          success: [...prev.success, data.successRate].slice(-20),
          error: [...prev.error, data.errorRate].slice(-20)
        }));

        if (data.status === 'completed' || data.status=== 'aborted') {
          clearInterval(timerRef.current);
          if (onComplete) onComplete();
        }
      } catch (err) {
        console.error("Polling failed", err);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [testId]);

  return { metrics, historyData };
};