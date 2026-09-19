import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Layers,
  Network,
  Radio,
  Scale,
  ShieldCheck,
  Split,
  Workflow,
} from 'lucide-react';

export const ResearchContextView: React.FC = () => {
  const papers = [
    {
      title: 'Advanced Air Mobility Digital Twin: An Airspace Management Perspective',
      authors: 'Kameswara Namuduri',
      journal: 'IEEE Open Journal of Vehicular Technology (IEEE OJVT), vol. 4, 2023',
      doi: '10.1109/OJVT.2023.3297645',
      summary:
        'Provides the foundational airspace architecture for AAM. Introduces the AAM Digital Twin ecosystem, dynamic airspace stratification (UTM 0-400ft vs AAM 400-3000ft vs ATM), NASA Digital Flight Rules (DFR), 3-layer air corridor highway network with circular roundabouts, and RTCA UAS-to-UAS sidelink communication use cases.',
      keyPoints: [
        'Distinction between digitized airspace and dynamic digital twin',
        'Provider of Services for UAM (PSU) and FIMS coordination',
        'NASA/FAA Digital Flight Rules (DFR) replacing human ATC separation',
        '3-layer directional air corridors with 2nd-layer roundabouts',
        'Direct U2U sidelink & multi-hop communications for collision avoidance',
      ],
    },
    {
      title: 'Towards a generic digital twin architecture for smart cities: A multi-model approach with application to uncrewed aerial systems traffic management (UTM)',
      authors: 'A. Belfadel, A. Djebbar, L. Amour, S. R. B. M. S. A. Kadir, Y. Hadjadj-Aoul, et al.',
      journal: 'Computers, Environment and Urban Systems (CEUS), vol. 104, 2023',
      doi: '10.1016/j.compenvurbsys.2023.102008',
      summary:
        'Establishes the technical computing architecture for multi-model digital twins. Defines the Data Ingestion System (DIS) using Apache Kafka and Fiware Orion-LD, and the Model Management System (MMS) with a Model Library (MLib) connecting diverse simulators via formal 1-to-1 connector functions across spatial resolutions and decision time horizons.',
      keyPoints: [
        'Three-tier smart city digital twin (DIS, MMS, Decision Support)',
        'Model classification across Strategic, Tactical, Operational, and Impact horizons',
        'Coupling micro-level Vehicle Routing Problems (VRP) with macro-traffic models',
        'COPERT emissions model integration for environmental impact assessment',
        'What-if scenario exploration without real-world aviation risk',
      ],
    },
    {
      title: 'Digital Flight: The Future of Flight Rules in the NextGen and Beyond',
      authors: 'David J. Wing, B. Baxley, J. Ballard',
      journal: 'NASA Technical Memorandum, NASA/TM-20220005476, 2022',
      doi: 'NASA Technical Reports Server',
      summary:
        'Defines Digital Flight as an operating mode where flight safety and separation are conducted via digital machine-to-machine exchange, establishing Digital Flight Rules (DFR) as a regulatory framework authorizing sustained operations in visual and instrument conditions without human air traffic controller separation.',
      keyPoints: [
        'Elimination of human voice VHF communication bottlenecks in terminal zones',
        'Algorithmic self-separation criteria for longitudinal and lateral margins',
        'Equipage standards for connected digital avionics',
        'Scalability foundations for high-density uncrewed aviation',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Scientific Research Literature & Grounding
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Academic Citations, Mathematical Models, and Architectural Heritage (Prompt Section 30)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This AAM Digital Twin platform is directly grounded in peer-reviewed aerospace and computational research.
          Below are the core scientific publications, frameworks, and architectural models instantiated in this prototype.
        </p>
      </div>

      {/* Publications Cards */}
      <div className="space-y-4">
        {papers.map((paper, idx) => (
          <div
            key={idx}
            className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                  Paper #{idx + 1}
                </span>
                <h3 className="text-sm font-bold font-display text-white mt-1.5">
                  {paper.title}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {paper.authors} — <strong className="text-slate-300">{paper.journal}</strong>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                DOI: {paper.doi}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{paper.summary}</p>

            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1.5">
                Key Principles Implemented in This Twin:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {paper.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-850">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Framework Synthesis Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
          <Workflow className="w-4 h-4 text-cyan-400" />
          Conceptual Synthesis: The Closed-Loop Digital Twin
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          While Belfadel et al. (2023) focused on municipal ground sensors and high-level delivery drone fleet optimization,
          Namuduri (2023) focused on vertical airspace safety, ASTM corridors, and airborne sidelink communications.
          This application synthesizes both bodies of literature into a unified, interactive cyber-physical platform:
          real-time sensor ingestion (DIS) drives a synchronized twin (MMS) which enforces NASA Digital Flight Rules (DFR),
          evaluates multi-model what-if contingencies, and actuates trajectory adjustments via task push back to the physical vehicles.
        </p>
      </div>
    </div>
  );
};
