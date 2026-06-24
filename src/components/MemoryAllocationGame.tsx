import React, { useState, useEffect } from 'react';

// Definitions for TypeScript strict typing
interface Job {
  id: number;
  size: number;
}

interface MemoryBlock {
  type: 'OS' | 'Process' | 'Hole';
  size: number;
  id?: number;
  label: string;
}

export default function Module5Game() {
  // System configurations matching Module 5 specifications
  const TOTAL_MEM = 256;
  const OS_SIZE = 40;
  const USER_MEM = TOTAL_MEM - OS_SIZE; // 216K available

  // Game States
  const [isCompactionEnabled, setIsCompactionEnabled] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  
  const [inputQueue, setInputQueue] = useState<Job[]>([]);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);

  // Initialize/Reset Game Data
  const resetGame = (compactionMode: boolean = isCompactionEnabled) => {
    setStatusMessage(null);
    setInputQueue([
      { id: 1, size: 60 },
      { id: 2, size: 100 },
      { id: 3, size: 30 },
      { id: 4, size: 70 },
      { id: 5, size: 50 },
    ]);
    setMemoryBlocks([
      { type: 'OS', size: OS_SIZE, label: `Operating System (${OS_SIZE}K)` },
      { type: 'Hole', size: USER_MEM, label: `Available Hole (${USER_MEM}K)` },
    ]);
  };

  // Run on first load
  useEffect(() => {
    resetGame();
  }, []);

  // Handle Switching Modes
  const handleModeChange = (compactionFlag: boolean) => {
    setIsCompactionEnabled(compactionFlag);
    resetGame(compactionFlag);
  };

  // First-Fit Allocation Logic
  const allocateJob = (jobIndex: number) => {
    setStatusMessage(null);
    const job = inputQueue[jobIndex];
    let allocated = false;
    const updatedBlocks = [...memoryBlocks];

    for (let i = 0; i < updatedBlocks.length; i++) {
      const block = updatedBlocks[i];
      if (block.type === 'Hole' && block.size >= job.size) {
        const remainingSize = block.size - job.size;

        // Replace hole with the process block
        updatedBlocks[i] = {
          type: 'Process',
          size: job.size,
          id: job.id,
          label: `Job ${job.id} (${job.size}K)`,
        };

        // If there's leftover space, insert a smaller leftover contiguous hole immediately downstream
        if (remainingSize > 0) {
          updatedBlocks.splice(i + 1, 0, {
            type: 'Hole',
            size: remainingSize,
            label: `Available Hole (${remainingSize}K)`,
          });
        }

        // Remove from input queue
        setInputQueue((prev) => prev.filter((_, idx) => idx !== jobIndex));
        allocated = true;
        break;
      }
    }

    if (allocated) {
      setMemoryBlocks(updatedBlocks);
      checkWinCondition(updatedBlocks, inputQueue.filter((_, idx) => idx !== jobIndex));
    } else {
      // Calculate fragmentation telemetry data
      const totalHoleSpace = updatedBlocks.reduce((acc, b) => b.type === 'Hole' ? acc + b.size : acc, 0);
      
      if (totalHoleSpace >= job.size) {
        if (isCompactionEnabled) {
          setStatusMessage({
            text: `❌ External Fragmentation! Job ${job.id} needs ${job.size}K contiguous space. Click the "Compact Memory" button to consolidate fragments!`,
            isError: true,
          });
        } else {
          setStatusMessage({
            text: `❌ External Fragmentation! Total free space is ${totalHoleSpace}K, but it is split. Terminate adjacent jobs to merge holes!`,
            isError: true,
          });
        }
      } else {
        setStatusMessage({
          text: `❌ Insufficient RAM! Job ${job.id} needs ${job.size}K, but total unallocated space is only ${totalHoleSpace}K.`,
          isError: true,
        });
      }
    }
  };

  // Terminate a process and turn its block into a hole
  const terminateJob = (jobId: number) => {
    setStatusMessage(null);
    let updatedBlocks = memoryBlocks.map((block) => {
      if (block.type === 'Process' && block.id === jobId) {
        return {
          type: 'Hole' as const,
          size: block.size,
          label: `Available Hole (${block.size}K)`,
        };
      }
      return block;
    });

    // Merge adjacent holes sequentially
    for (let i = 0; i < updatedBlocks.length - 1; i++) {
      if (updatedBlocks[i].type === 'Hole' && updatedBlocks[i + 1].type === 'Hole') {
        updatedBlocks[i].size += updatedBlocks[i + 1].size;
        updatedBlocks[i].label = `Available Hole (${updatedBlocks[i].size}K)`;
        updatedBlocks.splice(i + 1, 1);
        i--; // Re-verify updated indexes
      }
    }

    setMemoryBlocks(updatedBlocks);
    checkWinCondition(updatedBlocks, inputQueue);
  };

  // Dynamic Compaction Logic
  const triggerCompaction = () => {
    setStatusMessage(null);
    const runningProcesses = memoryBlocks.filter((b) => b.type === 'Process');
    const totalHoleSpace = memoryBlocks.reduce((acc, b) => b.type === 'Hole' ? acc + b.size : acc, 0);

    const reassembledBlocks: MemoryBlock[] = [
      { type: 'OS', size: OS_SIZE, label: `Operating System (${OS_SIZE}K)` },
      ...runningProcesses,
    ];

    if (totalHoleSpace > 0) {
      reassembledBlocks.push({
        type: 'Hole',
        size: totalHoleSpace,
        label: `Available Hole (${totalHoleSpace}K)`,
      });
    }

    setMemoryBlocks(reassembledBlocks);
    setStatusMessage({
      text: '⚙️ Compaction Complete! All active memory blocks shifted together. External fragmentation resolved!',
      isError: false,
    });
  };

  // Check if queue and memory are completely cleared
  const checkWinCondition = (currentBlocks: MemoryBlock[], currentQueue: Job[]) => {
    const hasActiveProcesses = currentBlocks.some((b) => b.type === 'Process');
    if (currentQueue.length === 0 && !hasActiveProcesses) {
      setStatusMessage({
        text: '🎉 Success! All processes executed successfully and memory is empty!',
        isError: false,
      });
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h2 style={{ textAlign: 'center', color: '#1f2328' }}>Module 5: MVT Memory Management Interactive</h2>
      <p style={{ textAlign: 'center', color: '#57606a', fontSize: '0.95rem' }}>
        <strong>System Constraints:</strong> RAM = 256K | OS Size = 40K (Low Memory) | Free Variable Allocations = 216K
      </p>

      {/* Mode Switches */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
        <button
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '6px',
            border: '1px solid #d0d7de',
            backgroundColor: !isCompactionEnabled ? '#0969da' : '#f6f8fa',
            color: !isCompactionEnabled ? 'white' : '#24292f',
          }}
          onClick={() => handleModeChange(false)}
        >
          Without Compaction
        </button>
        <button
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '6px',
            border: '1px solid #d0d7de',
            backgroundColor: isCompactionEnabled ? '#1f883d' : '#f6f8fa',
            color: isCompactionEnabled ? 'white' : '#24292f',
          }}
          onClick={() => handleModeChange(true)}
        >
          With Compaction Mode
        </button>
        <button
          style={{
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '6px',
            backgroundColor: '#cf222e',
            color: 'white',
            border: 'none',
          }}
          onClick={() => resetGame()}
        >
          Reset
        </button>
      </div>

      {/* Extra Action for Compaction Mode */}
      {isCompactionEnabled && (
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '6px',
              backgroundColor: '#8250df',
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onClick={triggerCompaction}
          >
            ⚙️ Compact Memory Now
          </button>
        </div>
      )}

      {/* Status Notifications Panel */}
      {statusMessage && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: '20px',
            fontSize: '0.95rem',
            border: statusMessage.isError ? '1px solid #f9cbd0' : '1px solid #c3e6cb',
            backgroundColor: statusMessage.isError ? '#ffebe9' : '#dafbe1',
            color: statusMessage.isError ? '#cf222e' : '#1f883d',
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Structural Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        
        {/* Left Hand: Input Waiting Queue */}
        <div style={{ border: '1px solid #d0d7de', borderRadius: '6px', padding: '16px', backgroundColor: '#f6f8fa' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #d0d7de', paddingBottom: '8px' }}>Input Queue (Disk)</h3>
          {inputQueue.length === 0 ? (
            <p style={{ color: '#57606a', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>No remaining jobs waiting on disk.</p>
          ) : (
            inputQueue.map((job, index) => (
              <div
                key={job.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  border: '1px solid #d0d7de',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontWeight: 600 }}>Job {job.id} <small style={{ color: '#57606a' }}>({job.size}K)</small></span>
                <button
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#24292f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => allocateJob(index)}
                >
                  Load Job
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Hand: RAM Partition Stack Map */}
        <div style={{ border: '1px solid #d0d7de', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginTop: 0, width: '100%', borderBottom: '1px solid #d0d7de', paddingBottom: '8px', textAlign: 'center' }}>Main Memory Map</h3>
          
          <div
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '400px',
              border: '2px solid #24292f',
              borderRadius: '6px',
              position: 'relative',
              backgroundColor: '#eaeef2',
              overflow: 'hidden',
            }}
          >
            {(() => {
              let currentTopOffsetPercent = 0;
              return memoryBlocks.map((block, idx) => {
                const blockHeightPercent = (block.size / TOTAL_MEM) * 100;
                const topVal = currentTopOffsetPercent;
                currentTopOffsetPercent += blockHeightPercent;

                // Color mappings based on partition classification definitions
                let bgStyle = '#eaeef2';
                let textColor = '#24292f';
                let borderStyle = '1px solid rgba(0,0,0,0.15)';

                if (block.type === 'OS') {
                  bgStyle = '#8c95a0';
                  textColor = 'white';
                } else if (block.type === 'Process') {
                  bgStyle = '#2da44e';
                  textColor = 'white';
                } else {
                  bgStyle = '#f6f8fa';
                  borderStyle = '1px dashed #afb8c1';
                  textColor = '#57606a';
                }

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: `${blockHeightPercent}%`,
                      top: `${topVal}%`,
                      backgroundColor: bgStyle,
                      borderBottom: borderStyle,
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      transition: 'top 0.3s, height 0.3s',
                      padding: '4px',
                    }}
                  >
                    <span style={{ textAlign: 'center' }}>{block.label}</span>
                    {block.type === 'Process' && (
                      <button
                        style={{
                          marginTop: '4px',
                          padding: '2px 6px',
                          fontSize: '0.75rem',
                          backgroundColor: '#cf222e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                        onClick={() => terminateJob(block.id!)}
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

      </div>
    </div>
  );
}