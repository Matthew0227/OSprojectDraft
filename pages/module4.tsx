import Link from 'next/link'
import Head from 'next/head'
import GanttChartSimulator from '../src/components/GanttChartSimulator'
import CPUSchedExercise from "../src/components/CPUSchedExercise";

export default function Module4(){
  const themeColors = { primary: '#2c3e50', gold: '#f39c12', light: '#f8f9fa', border: '#e6edf3' }
  
  return (
    <>
      <Head><title>Module 4 — CPU Scheduling</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:1200}}>
        <div style={{background: `linear-gradient(135deg, ${themeColors.primary} 0%, #34495e 100%)`, padding:'2rem', borderRadius:'8px', marginBottom:'2rem', borderLeft:`5px solid ${themeColors.gold}`}}>
          <h1 style={{color:'#fff', margin:'0 0 0.5rem 0'}}>Module 4: CPU Scheduling</h1>
          <p style={{color:'#bbb', margin:0}}>Master process scheduling algorithms and optimization techniques</p>
        </div>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>Introduction &amp; Basic Concepts</h2>
        <p>In a multiprogramming operating system, multiple processes are kept in main memory simultaneously. The primary objective of multiprogramming is <strong>maximum CPU utilization</strong>.</p>

        <ul>
          <li><strong>What is CPU Scheduling?</strong> It is the fundamental mechanism of a multiprogrammed OS that handles the decision of which process in the <strong>ready queue</strong> (the set of all processes residing in main memory, ready and waiting to execute) will be allocated the CPU next.</li>
          <li><strong>Note:</strong> The ready queue is <strong>not necessarily</strong> a First-In, First-Out (FIFO) queue.</li>
        </ul>

        <h3>Important OS Submodules</h3>
        <ul>
          <li><strong>Short-term Scheduler (CPU Scheduler):</strong> Selects from among the ready processes in memory and allocates the CPU to one of them.</li>
          <li><strong>Dispatcher:</strong> A module that actually gives control of the CPU to the specific process selected by the short-term scheduler. This process involves: switching context, switching to user mode, and jumping to the proper location in the user program to restart it.</li>
          <li><strong>Dispatch Latency:</strong> The total time it takes for the dispatcher to stop one running process and start another one.</li>
        </ul>

        <h2 style={{color:'#2c3e50', borderBottom:'3px solid #f39c12', paddingBottom:'0.5rem'}}>The CPU-I/O Burst Cycle</h2>
        <p>Process execution consists of an alternating cycle of CPU execution (<strong>CPU burst</strong>) and waiting for input/output (<strong>I/O burst</strong>).</p>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/The CPU-IO Burst Cycle diagram.png" alt="CPU-I/O Burst Cycle Illustration" style={{maxWidth:'80%', height:'auto', borderRadius:'4px'}} />
        </div>

        <h3>Classifying Processes</h3>
        <p>The performance of scheduling algorithms depends heavily on the characterization of process bursts. Processes generally fall into two categories:</p>
        <ul>
          <li><strong>I/O-Bound Process:</strong> Spends more time doing I/O than computations; many very short CPU bursts.</li>
          <li><strong>CPU-Bound Process:</strong> Spends more time doing calculations; few very long CPU bursts.</li>
        </ul>

        <h2 style={{color:'#2c3e50', borderBottom:'3px solid #f39c12', paddingBottom:'0.5rem'}}>Preemptive vs. Nonpreemptive Scheduling</h2>
        <p>CPU scheduling decisions typically take place under four conditions:</p>
        <ol>
          <li>When a process switches from the <strong>running</strong> state to the <strong>waiting</strong> state.</li>
          <li>When a process switches from the <strong>running</strong> state to the <strong>ready</strong> state.</li>
          <li>When a process switches from the <strong>waiting</strong> state to the <strong>ready</strong> state.</li>
          <li>When a process <strong>terminates</strong>.</li>
        </ol>

        <h3>Scheduling Schemes</h3>
        <ul>
          <li><strong>Nonpreemptive Scheduling:</strong> Decisions happen only under conditions 1 and 4. Once a process enters the running state, it holds the CPU until it voluntarily terminates or blocks for I/O.</li>
          <li><strong>Preemptive Scheduling:</strong> Decisions happen under conditions 2 and 3. The OS can interrupt a running process and move it back to ready, preventing a single process from monopolizing the CPU.</li>
        </ul>

        <h2 style={{color:'#2c3e50', borderBottom:'3px solid #f39c12', paddingBottom:'0.5rem'}}>Scheduling Performance Criteria</h2>
        <ul>
          <li><strong>CPU Utilization:</strong> Fraction of time CPU is actively working. (Objective: Maximize)</li>
          <li><strong>Throughput:</strong> Number of processes completed per unit time. (Objective: Maximize)</li>
          <li><strong>Turnaround Time:</strong> Finish Time − Arrival Time. (Objective: Minimize)</li>
          <li><strong>Waiting Time:</strong> Turnaround Time − Burst Time. (Objective: Minimize)</li>
          <li><strong>Response Time:</strong> Time from submission until first response. (Objective: Minimize)</li>
        </ul>

        <blockquote style={{borderLeft:'4px solid #ddd', paddingLeft:'1rem'}}>
          <strong>Summary of Scheduling Goals by Environment:</strong>
          <p><strong>All Systems:</strong> Fairness, policy enforcement, balanced utilization.<br/>
          <strong>Batch Systems:</strong> Prioritize throughput and turnaround time.<br/>
          <strong>Interactive Systems:</strong> Fast response time.<br/>
          <strong>Real-Time Systems:</strong> Meet hard deadlines and avoid data/quality degradation.</p>
        </blockquote>

        <h2 style={{color:'#2c3e50', borderBottom:'3px solid #f39c12', paddingBottom:'0.5rem'}}>Core Scheduling Algorithms</h2>

        <h3>1. First-Come, First-Served (FCFS)</h3>
        <ul>
          <li><strong>Mechanism:</strong> FIFO allocation.</li>
          <li><strong>Nature:</strong> Nonpreemptive.</li>
          <li><strong>Drawbacks:</strong> Poor average waiting time; convoy effect.</li>
        </ul>

        <h3>2. Shortest-Job-First (SJF) / Shortest-Job-Next (SJN)</h3>
        <ul>
          <li><strong>Mechanism:</strong> Choose process with smallest next CPU burst.</li>
          <li><strong>Advantage:</strong> Optimal for average waiting time.</li>
          <li><strong>Disadvantage:</strong> Starvation risk for long jobs.</li>
          <li><strong>Variants:</strong> Nonpreemptive SJF and Preemptive SJF (Shortest-Remaining-Time-First, SRTF).</li>
        </ul>

        <h3>3. Priority Scheduling</h3>
        <ul>
          <li><strong>Mechanism:</strong> Each process has a priority; highest priority runs first.</li>
          <li><strong>Problem:</strong> Starvation of low-priority jobs.</li>
          <li><strong>Solution:</strong> Aging to gradually increase priority of waiting processes.</li>
          <li><strong>Schemes:</strong> Preemptive or Nonpreemptive.</li>
        </ul>

        <h3>4. Round Robin (RR)</h3>
        <ul>
          <li><strong>Mechanism:</strong> Time-sharing with a fixed time quantum (10–100 ms typical).</li>
          <li><strong>Nature:</strong> Preemptive via clock interrupts.</li>
          <li><strong>Notes:</strong> If quantum q and n processes, no process waits more than (n−1)q units; choice of q affects overhead and fairness.</li>
        </ul>

        <h3>5. Highest Response-Ratio Next (HRRN)</h3>
        <ul>
          <li><strong>Mechanism:</strong> Nonpreemptive; select process with highest response ratio.</li>
          <li><strong>Formula:</strong> <code>Response Ratio = (Time Spent Waiting + Expected Service Time) / Expected Service Time</code></li>
          <li><strong>Behavior:</strong> Balances short-job preference with aging to avoid starvation.</li>
        </ul>

        <h3>6. Multilevel Queue (MLQ) Scheduling</h3>
        <ul>
          <li><strong>Mechanism:</strong> Separate ready queues by category; processes permanently assigned to one queue.</li>
          <li><strong>Configuration:</strong> Each queue may use its own scheduling algorithm; inter-queue scheduling may be fixed-priority or time-sliced.</li>
        </ul>

        <h3>7. Multilevel Feedback Queue (MLFQ)</h3>
        <ul>
          <li><strong>Mechanism:</strong> Processes can move between queues based on behavior, favoring I/O-bound and interactive processes.</li>
          <li><strong>Parameters:</strong> Number of queues, per-queue algorithms, promotion/demotion rules.</li>
          <li><strong>Example:</strong> Q0 FCFS with 8ms quantum → demote to Q1 (16ms) → demote to Q2 (FCFS).</li>
          <li><strong>Mitigating Starvation:</strong> Implement aging to promote long-waiting jobs.</li>
        </ul>

        <h3>Interactive Simulator</h3>
        <p>Use the simulator below to experiment with scheduling behavior (FCFS shown by default):</p>
        <GanttChartSimulator />
        <CPUSchedExercise />
        <p style={{marginTop:'2rem'}}><Link href="/">← Back to modules</Link></p>
      </main>
    </>
  )
}
