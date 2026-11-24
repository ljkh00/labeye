/* =====================================================================
   LINEAGE DATA — single source of truth for lineage.html and the
   "Project lineage" strip on every FYP page.

   To record a milestone: add ONE object to `events` and commit.
   Nothing else needs editing.

   Fields
     fyp     : "1A" … "3D"  (must exist in `lanes`)
     date    : "YYYY-MM"    (month the milestone happened / is planned)
     type    : initiated | continued | completed | handover | deferred
               | retired | planned
     person  : public label only — "Talent #3", a first name, or "TBC".
               NO full names / student IDs without written consent (PDPA).
     note    : one short line, public-safe (no IPs, VLANs, credentials)
     link    : optional — public report/poster URL. Private handover
               docs stay in the private pack; don't link them here.
   ===================================================================== */
window.LINEAGE = {
  lanes: [
    { id: "1A", title: "Virtualisation & Image Management", color: "#3C90FF", parent: null,  page: "fyp1a.html" },
    { id: "1B", title: "Network Segmentation",              color: "#B166FF", parent: "1A",  page: "fyp1b.html" },
    { id: "1C", title: "Lab Automation Framework",          color: "#FE651E", parent: "1A",  page: "fyp1c.html" },
    { id: "2A", title: "Security Dashboard (LabEye)",       color: "#A9C7FF", parent: "1B",  page: "fyp2a.html" },
    { id: "2B", title: "Red Team Provisioning Pipeline",    color: "#FC5844", parent: "1C",  page: "fyp2b.html" },
    { id: "2C", title: "Blue Team Defence Lab",             color: "#60A5FA", parent: "1B",  page: "fyp2c.html" },
    { id: "3A", title: "Honeypot & Threat Intel",           color: "#FDBA74", parent: "2C",  page: "fyp3a.html" },
    { id: "3B", title: "IDS/IPS Integration & Tuning",      color: "#FFB598", parent: "2C",  page: "fyp3b.html" },
    { id: "3C", title: "Lab Orchestration (retired)",       color: "#8B90A1", parent: "1C",  page: null },
    { id: "3D", title: "Identity & Access (Active Directory)", color: "#F472B6", parent: "1B", page: "fyp3d.html" }
  ],
  events: [
    // --- Seed entries: dates are when the scope was first published on this site.
    // --- Replace "TBC" / adjust dates to each cohort's real start month.
    { fyp: "1A", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published; prerequisite for all phases" },
    { fyp: "1B", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published" },
    { fyp: "1C", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published" },
    { fyp: "2A", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published" },
    { fyp: "2B", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published" },
    { fyp: "2C", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published" },
    { fyp: "3A", date: "2026-04", type: "initiated", person: "TBC", note: "Scope published" },
    { fyp: "3B", date: "2026-04", type: "deferred",  person: "—",   note: "Scope defined; awaiting student intake" },
    { fyp: "3C", date: "2026-04", type: "initiated", person: "—",   note: "Scope published" },
    { fyp: "3C", date: "2026-09", type: "retired",   person: "—",   note: "Folded into 2A / 1C / 2B; ID not reused" },
    { fyp: "3D", date: "2026-11", type: "initiated", person: "TBC", note: "Candidate identified; scope drafted" },
    { fyp: "3A", date: "2027-01", type: "planned",   person: "Talent #2", note: "Continue honeypot reiteration" }
  ]
};
