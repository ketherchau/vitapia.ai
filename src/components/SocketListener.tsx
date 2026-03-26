"use client";

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNotification } from '@/components/providers/NotificationProvider';

export default function SocketListener() {
  const { showNotification } = useNotification();

  useEffect(() => {
    // Determine the orchestrator URL. In a real app, this should come from env var
    // like process.env.NEXT_PUBLIC_ORCHESTRATOR_URL, but we use the known IP here.
    const url = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || 'http://54.169.3.192:4000';
    const socket = io(url);

    socket.on('connect', () => {
      console.log('Connected to Orchestrator socket');
    });

    socket.on('simulation_ready', (data: { sim_id: string }) => {
      showNotification(
        "Simulation Complete!",
        `Your pulse check simulation ${data.sim_id} has finished processing 1,000 agents. You can now view the comprehensive report.`,
        "success"
      );
    });

    socket.on('simulation_failed', (data: { sim_id: string, error: string }) => {
      showNotification(
        "Simulation Failed",
        `Simulation ${data.sim_id} encountered an error: ${data.error}`,
        "error"
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [showNotification]);

  return null;
}
