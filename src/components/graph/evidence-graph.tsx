"use client";

import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import { FileText, Image as ImageIcon, MapPin, Mic } from "lucide-react";
import type { EvidenceGraph, GraphEdgeKind, GraphNode } from "@/types/domain";
import { cn } from "@/lib/utils";

type BtNodeData = GraphNode & Record<string, unknown>;
type BtNode = Node<BtNodeData>;

const hidden = "!h-1 !w-1 !min-w-0 !border-0 !bg-transparent";

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Top} className={hidden} style={{ left: "50%", top: "50%" }} />
      <Handle type="source" position={Position.Top} className={hidden} style={{ left: "50%", top: "50%" }} />
    </>
  );
}

function IncidentNode({ data }: NodeProps<BtNode>) {
  return (
    <div className="w-56 border border-z0 bg-z0 px-4 py-3 text-center text-z10 shadow-[0_4px_12px_rgb(12_17_16/0.25)]">
      <Handles />
      <div className="text-[13px] font-semibold leading-snug text-z10">{data.label}</div>
      {data.sublabel && <div className="mt-0.5 text-[11px] text-z7">{data.sublabel}</div>}
    </div>
  );
}

function ReportNode({ data, selected }: NodeProps<BtNode>) {
  return (
    <div
      className={cn(
        "relative w-40 cursor-pointer border bg-panel px-3 py-2 transition-shadow",
        data.flagged ? "border-conflict" : "border-z0",
        selected && "ring-2 ring-accent",
      )}
    >
      <Handles />
      <div className="flex items-center justify-between gap-2">
        <div className="text-[13px] font-semibold text-fg">{data.label}</div>
        {data.flagged && <span aria-label="Possible conflict" className="hatch-cross size-3.5 shrink-0 border border-conflict text-conflict" />}
      </div>
      <div className="text-[11px] text-fg-muted">{data.sublabel}</div>
    </div>
  );
}

function LocationNode({ data }: NodeProps<BtNode>) {
  return (
    <div className="flex max-w-44 items-center gap-2 border border-line-strong bg-panel px-3 py-1.5">
      <Handles />
      <MapPin className="size-3.5 shrink-0 text-fg" />
      <div className="min-w-0">
        <div className="truncate text-[12px] font-medium text-fg">{data.label}</div>
        <div className="tabular truncate font-mono text-[10px] text-fg-faint">{data.sublabel}</div>
      </div>
    </div>
  );
}

function SourceNode({ data }: NodeProps<BtNode>) {
  const Icon = data.label === "Voice note" ? Mic : data.label === "Photo" ? ImageIcon : FileText;
  return (
    <div className="flex max-w-44 cursor-pointer items-center gap-2 border border-dashed border-z5 bg-panel px-2.5 py-1.5">
      <Handles />
      <span className="grid size-6 shrink-0 place-items-center border border-line-strong text-fg-muted">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[12px] font-medium text-fg">{data.label}</div>
        <div className="truncate text-[10px] text-fg-faint">{data.sublabel}</div>
      </div>
    </div>
  );
}

const nodeTypes = { incident: IncidentNode, report: ReportNode, location: LocationNode, source: SourceNode };

/** Arc that dips below the report row so conflicts never cut through other nodes. */
function ConflictEdge({ id, sourceX, sourceY, targetX, targetY, label, style }: EdgeProps) {
  const dist = Math.hypot(targetX - sourceX, targetY - sourceY);
  const depth = Math.min(170, 40 + dist * 0.25);
  const mx = (sourceX + targetX) / 2;
  const my = Math.max(sourceY, targetY) + depth;
  const path = `M ${sourceX},${sourceY} Q ${mx},${my + depth * 0.6} ${targetX},${targetY}`;
  // Quadratic bezier midpoint: 0.25*P0 + 0.5*C + 0.25*P2
  const ly = 0.25 * sourceY + 0.5 * (my + depth * 0.6) + 0.25 * targetY;
  return (
    <>
      <BaseEdge id={id} path={path} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute flex items-center gap-1 border border-conflict bg-panel px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-conflict"
            style={{ transform: `translate(-50%, -50%) translate(${mx}px, ${ly}px)`, zIndex: 1000 }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes = { conflict: ConflictEdge };

const EDGE_STYLE: Record<GraphEdgeKind, { stroke: string; dash?: string; width: number }> = {
  REPORTS: { stroke: "#0c1110", width: 1.6 },
  LOCATED_AT: { stroke: "#848c89", width: 1.2, dash: "4 4" },
  SUPPORTS: { stroke: "#848c89", width: 1.2 },
  CONFLICTS_WITH: { stroke: "#c0392b", width: 2, dash: "6 5" },
};

// Pixel padding; never zoom below ~legible size (narrow screens pan instead).
const FIT = { padding: "24px", minZoom: 0.92 } as const;

/** Approximate node sizes so positions computed for centres line up visually. */
const HALF: Record<string, [number, number]> = { incident: [112, 40], report: [80, 30], location: [80, 18], source: [80, 18] };

export function EvidenceGraphView({
  graph,
  onSelectReport,
  className,
}: {
  graph: EvidenceGraph;
  onSelectReport?: (reportId: string) => void;
  className?: string;
}) {
  const rfRef = useRef<ReactFlowInstance<BtNode, Edge> | null>(null);
  useEffect(() => {
    const refit = () => rfRef.current?.fitView(FIT);
    window.addEventListener("resize", refit);
    return () => window.removeEventListener("resize", refit);
  }, []);
  const nodes: BtNode[] = useMemo(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        type: n.kind,
        position: { x: n.x - HALF[n.kind][0], y: n.y - HALF[n.kind][1] },
        data: n as BtNodeData,
        draggable: true,
      })),
    [graph],
  );
  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((e) => {
        const s = EDGE_STYLE[e.kind];
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.kind === "CONFLICTS_WITH" ? "conflict" : "straight",
          animated: e.kind === "CONFLICTS_WITH",
          label: e.kind === "CONFLICTS_WITH" ? e.label : undefined,
          style: { stroke: s.stroke, strokeWidth: s.width, strokeDasharray: s.dash },
          markerEnd: e.kind === "REPORTS" ? { type: MarkerType.ArrowClosed, color: s.stroke, width: 16, height: 16 } : undefined,
        };
      }),
    [graph],
  );

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="relative min-h-0 flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={FIT}
        // Refit once nodes and the legend strip have been measured, and on resize.
        onInit={(rf) => {
          rfRef.current = rf;
          setTimeout(() => rf.fitView(FIT), 60);
        }}
        minZoom={0.3}
        maxZoom={1.8}
        forceColorMode="light"
        nodesConnectable={false}
        proOptions={{ hideAttribution: false }}
        onNodeClick={(_, n) => {
          const d = n.data as BtNodeData;
          if ((d.kind === "report" || d.kind === "source") && d.refId) onSelectReport?.(d.refId);
        }}
        style={{ background: "transparent" }}
      >
        <Background variant={BackgroundVariant.Lines} gap={28} size={1} color="#dde2df" />
        <Controls showInteractive={false} position="top-right" />
      </ReactFlow>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-z0 px-4 py-2 text-[11.5px] text-fg-muted">
        <LegendLine color="#0c1110" label="Reports" />
        <LegendLine color="#848c89" dash label="Located at" />
        <LegendLine color="#848c89" label="Supports" />
        <LegendLine color="#c0392b" dash label="Possible conflict" />
      </div>
    </div>
  );
}

function LegendLine({ color, label, dash }: { color: string; label: string; dash?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="18" height="4" aria-hidden>
        <line x1="0" y1="2" x2="18" y2="2" stroke={color} strokeWidth="2" strokeDasharray={dash ? "4 3" : undefined} />
      </svg>
      {label}
    </span>
  );
}
